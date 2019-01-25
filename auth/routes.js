//Incluimos dotenv para utilizar el archivo .env para el secreto
require('dotenv').config();
//Incluimos Joi para la validacion de tipo de datos
const Joi = require('joi');
//Incluimos JsonWebToken para autenticacion
const jwt = require('jsonwebtoken');
//Incluimos modulo Bcrypt de encriptacion de contraseñas
const bcrypt = require('bcrypt');
//Incluimos funciones de Company
const { getCompanyById,
        getCompanyByRut,
        getCompanyByName,
        rollbackInsertCompany,
        insertCompany,
        validarCompany: validarDatosCompany,
        updateCompany } = require('../companies/routes');
//Incluimos funciones de User
const { getUserByDocument,
        getUserByEmail,
        getUserById,
        insertUser,
        validarUserUpdate: validarDatosUser,
        updateUser } = require('../users/routes');
//Incluimos funciones de helpers
const { getTypeById, getRubroById, validarId } = require('../helpers/routes');

//Declaramos el secreto para JWT
const secreto = process.env.COOKIE_SECRET;
//const secreto = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJjb25hcHJvbGVAZ21haWwuY29tIiwidXNlclBhc3N3b3JkIjoidGVzdDEyMzQiLCJpYXQiOjE1NDUxODY1MzEsImV4cCI6MTU0NTE5MDEzMX0.58leQTwJJrc3nA7YhqMKNtlnfjWo7eK4TrgJmHRMfBg';

//Ruteo para validacion de tokens
function verifyToken (req, res, next) {
    console.info('Conexion POST entrante : /api/auth/');
    // console.log('cookies', req.cookies.access_token);

    //Verificamos que el token haya sido enviado en el header de la request
    if(!req.headers.token){
        //Si no viene el token, damos no autorizado
        console.info('No hay token, acceso no autorizado');
        res.status(401).json({message: 'Acceso no autorizado'});
    }
    else{
        //Si hay token, validamos con JWT
        console.info('Validando token');
        const { token } = req.headers;
        jwt.verify(token, secreto, (err, userData) => {
            if(err){
                //Si el token no es valido o esta expirado, damos no autorizado
                console.info(`Token invalido : ${err}`);
                res.status(401).json({message: `Token invalido: ${err}`});
            }
            else{
                //Si el token es valido, agregamos al body las credenciales
                console.info(`Token valido para usuario: ${userData.userEmail}`);
                console.info('Agregando credenciales al body de la request');
                req.body.userEmail = userData.userEmail;
                req.body.userPassword = userData.userPassword;
                //continuamos a la siguiente funcion
                console.info('Llamando a siguiente funcion');
                next();
            }
        });
    }
}

//Ruteo de inicio de sesion
async function login(req, res){
    console.info('Conexion POST entrante : /api/auth/login');
    const {userEmail, userPassword} = req.body;

    //Enviamos a validar el tipo de datos recibidos
    console.info('Validando tipos de datos recibidos');
    let {error} = validarLogin({userEmail, userPassword});
    //Si hay error devolvemos y no continuamos
    if(error){
        console.info(`Errores en la validacion de tipos de datos`);
        let errores = error.details.map(e => {
            console.info(e.message);
            return e.message;
        });
        res.status(400).json({message: errores});
    }
    else{
        console.info('Validacion de tipo de datos exitosa');
        //Buscamos el usuario en la BD a partir del email
        let { user } = await getUserByEmail(userEmail);

        if(user){
            //Si el usuario existe
            console.info('Usuario encontrado');

            //Checkeamos si el usuario fue eliminado
            console.info('Revisando estado del usuario');
            if(user.deleted){
                console.log(`Usuario con email ${userEmail} esta bloqueado`);
                res.status(204).json({message: 'Usuario bloqueado'});
            }
            else{
                console.info('Usuario no se encuentra bloqueado');
                //Procedemos a comparar la contraseña encriptada
                console.info('Comenzando comparacion de contraseña encriptada');
                const comparacionPass = await bcrypt.compare(userPassword, user.password)
                                                    .then(result => result)
                                                    .catch(err => {
                                                        console.error(`Error en la comparacion de contraseña: ${err}`);
                                                        res.status(500).json('Error en el inicio de sesion.');
                                                    });
                //Si la contraseña esta bien, avanzamos a firmar el token
                if(comparacionPass){
                    console.info('Comparacion correcta');

                    //Firmamos el token con la info necesaria
                    console.log('Firmando token');
                    const token = jwt.sign({userEmail, userPassword}, secreto, {expiresIn: '1h'});

                    //Si se creo correctamente el token, pasamos a buscar info extra
                    if(token){
                        console.log('Token firmado correctamente');
                        //traemos el tipo del usuario que esta iniciando sesion
                        let { type } = await getTypeById(user.typeId);

                        if(type){
                            console.info('Tipo encontrado correctamente');
                            //traemos la compañia a la que pertenece el usuario que esta iniciando sesion
                            let { company } = await getCompanyById(user.companyId);

                            if(company){
                                console.info('Compania encontrada correctamente');

                                if(company.deleted !== null){
                                    console.log(`Company con ID: ${company.id} esta bloqueada`);
                                    res.status(204).json({message: 'Company bloqueada'});
                                }
                                else{
                                    // insert de last_login
                                    user.lastLogin = new Date();
                                    let { result: updateRes, message: updateMessage } = await updateUser(user.id, user);

                                    if(!updateRes){
                                        console.info('Ocurrio un error al actualizar usuario para lastLogin');
                                        console.info(updateMessage);
                                        console.info('Preparando response');
                                        res.status(500).json({message: 'Ocurrio un error al procesar la solicitud'})
                                    }
                                    else{
                                        //creamos el cookie
                                        console.info('Creando token');
                                        res.cookie('access_token', token, {
                                            maxAge: new Date(Date.now() + 3600),
                                            httpOnly: false
                                        });
                                        console.info('Token creado');
                                        
                                        //armamos el cuerpo de la respuesta
                                        console.info('Preparando datos de la response');
                                        let data = {
                                            userType: type.name,
                                            userTypeId: type.id,
                                            userName: user.name,
                                            userEmail: user.email,
                                            userId: user.id,
                                            userCompanyName: company.name,
                                            userCompanyId: company.id
                                        };

                                        //enviamos la respuesta con el token y el cuerpo
                                        console.info('Enviando response');
                                        res.status(200).json({
                                            message: 'Loggeado correctamente',
                                            token: token,
                                            userData: data
                                        });
                                    }
                                }
                            }
                            else{
                                console.info('Hubo problemas al obtener la compania');
                                res.status(500).json('Error en el inicio de sesion.');
                            }
                        }
                        else{
                            console.info('Hubo problemas al obtener el tipo');
                            res.status(500).json('Error en el inicio de sesion.');
                        }
                    }
                    else{
                        console.log(`Error al firmar el token : ${error}`);
                        res.status(500).json({message: 'Error en el inicio de sesion.'});
                    }
                        
                }
                else{
                    console.log('Contraseña incorrecta');
                    res.status(400).json({message: 'Usuario o contraseña incorrectos.'});
                }   
            }
        }
        else{
            console.log(`Email no existe en la plataforma : ${req.body.userEmail}, enviando response`);
            res.status(400).json({message: 'Usuario o contraseña incorrectos.'});
        }
    }
};

//ruteo de cierre de sesion
const logout = (req, res) => {
    console.info('Conexion POST entrante : /api/auth/logout');
    //indicamos borrar cookie
    console.info('Borrando cookie');
    res.clearCookie('access_token', req.cookies.access_token, {
        maxAge: new Date(Date.now() + 3600),
        httpOnly: false
    });
    console.info('Cookie borrada');
    //enviamos response
    console.info('Enviando response.')
    res.status(200).json({message: 'Cierre de sesion exitoso'});
};

//funcion de ruteo de registro
async function signup(req, res){
    console.info('Conexion POST entrante : /api/auth/signup');
    //Array para almacenar errores
    let errorMessage = [];

    if(!req.file){
        console.info('No se envio imagen con la request');
        console.info('Preparando response');
        res.status(400).json({message: 'No se envio imagen con la request'});
    }
    else{
        //armamos body para user
        console.info('Armando objeto user');
        let valUser = {
            typeId: req.body.type,
            userName: req.body.userName,
            document: req.body.userDocument,
            email: req.body.userEmail,
            password: req.body.userPassword,
            userPhone: req.body.userPhone,
            userFirstStreet: req.body.userFirstStreet,
            userSecondStreet: req.body.userSecondStreet,
            userDoorNumber: req.body.userDoorNumber,
        };

        // armamos body para company
        console.info('Armando objeto company')
        let valCompany = {
            typeId: req.body.type,
            rubroId: req.body.rubro,
            rut: req.body.companyRut,
            companyName: req.body.companyName,
            description: req.body.companyDescription,
            companyPhone: req.body.companyPhone,
            companyFirstStreet: req.body.companyFirstStreet,
            companySecondStreet: req.body.companySecondStreet,
            companyDoorNumber: req.body.companyDoorNumber,
            imageName: req.file.filename,
            imagePath: req.file.path
        };

        //envio bodies para validar tipos de datos
        console.info('Iniciando validacion de tipos de datos de User');
        const { error: errorUser} = validarDatosUser(valUser);
        console.info('Iniciando validacion de tipos de datos de Company');
        const { error: errorCompany } = validarDatosCompany(valCompany);

        console.info('Checkeando por errores');
        //Si hay errores, lo agregamos al array
        if(errorUser) {
            console.info('Errores encontrados en la validacion de usuario');
            errorUser.details.map(e => {
                console.info(e.message);
                errorMessage.push(e.message);
                return;
            });
        }
        if(errorCompany){
            console.info('Errores encontrados en la validacion de company');
            errorCompany.details.map(e => {
                console.info(e.message);
                errorMessage.push(e.message);
                return;
            });
        }

        if(errorMessage.length > 0){
            console.info(`Se encontraron ${errorMessage.length} errores de tipo en la request`);
            errorMessage.map(err => console.log(err));
            console.info('Enviando response');
            res.status(400).json({message: errorMessage});
        }
        else{
            console.info('Validacion de tipo de datos exitosa');

            // Validaciones de existencia
            console.info('Comenzando validaciones de existencia');

            let { user: userByEmail } = await getUserByEmail(valUser.email);
            let { user: userByDocument } = await getUserByDocument(valUser.document);
            let { company: companyByRut } = await getCompanyByRut(valCompany.rut);
            let { company: companyByName } = await getCompanyByName(valCompany.companyName);
            let { type: typeById, message: typeMessage } = await getTypeById(valCompany.typeId);
            let { rubro: rubroById, message: rubroMessage } = await getRubroById(valCompany.rubroId);

            if(userByEmail) errorMessage.push(`Ya existe un usuario con email ${valUser.email}`);
            if(userByDocument) errorMessage.push(`Ya existe un usuario con documento ${valUser.document}`);
            if(companyByRut) errorMessage.push(`Ya existe una empresa con rut ${valCompany.rut}`);
            if(companyByName) errorMessage.push(`Ya existe una empresa con nombre ${valCompany.companyName}`);
            if(!typeById) errorMessage.push(typeMessage);
            if(!rubroById) errorMessage.push(rubroMessage);

            //Si no estan repetidos los datos, seguimos con el ecriptado de la contraseña
            if(errorMessage.length > 0){
                console.info(`Se encontraron ${errorMessage.length} errores de existencia en la request`);
                errorMessage.map(err => console.log(err));
                console.info('Enviando response')
                res.status(400).json({message: errorMessage});
            }
            else{
                console.info('Validaciones de existencia exitosas');

                //Encriptamos la contraseña
                console.info('Comenzado encryptacion de contraseña');
                const hash = await bcrypt.hash(valUser.password, 10);
                
                //Si la encriptacion salio bien, pasamos al insert de company
                if(!hash){
                    console.error(`Error al crear hash : ${err}`);
                    res.status(500).json({message: 'Error al registrarse'});
                }
                else{
                    console.info('Encryptacion de contraseña, correcta');

                    console.info('Preparando objeto para insert de Company');
                    let company = {
                        name: valCompany.companyName,
                        rut: valCompany.rut,
                        firstStreet: valCompany.companyFirstStreet,
                        secondStreet: valCompany.companySecondStreet,
                        doorNumber: valCompany.companyDoorNumber,
                        phone: valCompany.companyPhone,
                        typeId: valCompany.typeId,
                        rubroId: valCompany.rubroId,
                        description: valCompany.description,
                        imageName: valCompany.imageName,
                        imagePath: valCompany.imagePath,
                        created: new Date()
                    };

                    //Enviamos insert a company
                    let { id: companyId, message: companyMessage } = await insertCompany(company);
                    
                    //Si el insert de company salio bien, paso a insert de usuario
                    if(companyId !== 0){
                        console.info(`Insert de Company terminado correctamente, con ID: ${companyId}`);

                        console.info('Preparando objeto para insert de User');
                        let user = {
                            typeId: valUser.typeId,
                            companyId: companyId,
                            name: valUser.userName,
                            document: valUser.document,
                            email: valUser.email,
                            password: hash,
                            phone: valUser.userPhone,
                            firstStreet: valUser.userFirstStreet,
                            secondStreet: valUser.userSecondStreet,
                            doorNumber: valUser.userDoorNumber,
                            created: new Date()
                        };

                        //envio insert de user
                        let { id: userId, message: userMessage } = await insertUser(user);

                        if(userId){
                            console.info(`Insert de User terminado correctamente, con ID: ${userId}`);
                            console.info('Preparando response');
                            res.status(201).json({message: 'Registro existoso'});
                        }
                        else{
                            console.info('Hubo un problema al insertar el usuario, realizando rollback');
                            let rollbackCompany = await rollbackInsertCompany(companyId);
                            if(rollbackCompany.result) console.info(`Rollback de Company ${companyId} realizado correctamente`);
                            else console.info(`Ocurrio un error en rollback de Company ${companyId}`);
                            console.info('Preparando response');
                            res.status(500).json({message: userMessage});
                        }
                    }
                    else{
                        console.info('Preparando response');
                        res.status(500).json({message: companyMessage});
                    }
                }
            }
        }
    }
};

async function actualizarPerfil(req, res){
    console.log('request', req.body);
    let idUser = req.params.idUser;
    let idEmpresa = req.params.idEmpr;
    console.log(`Conexion POST entrante : /api/auth/update/user/${idUser}/company/${idEmpresa}`);

    console.info(`Comenzando validacion de tipos`);
    let { error: errorUserId } = validarId(idUser);
    let { error: errorCompanyId } = validarId(idEmpresa);

    if(errorUserId || errorCompanyId){
        console.info(`Error/es en la validacion de tipos`);
        console.log(errorUserId.details[0].message);
        console.log(errorCompanyId.details[0].message);
        console.info('Preparando response');
        res.status(400).json({message: [errorUserId.details[0].message, errorCompanyId.details[0].message]});
    }
    else{
        console.info('Validaciones de tipo exitosas');
        console.info('Comenzando validaciones de existencia');
        let errorMessage = [];

        let { user: userById, message: userMessage } = await getUserById(idUser);
        let { company: companyById, message: companyMessage } = await getCompanyById(idEmpresa);

        if(!userById) errorMessage.push(userMessage);
        if(!companyById) errorMessage.push(companyMessage);
        if(companyById && userById && companyById.id !== userById.companyId)
                errorMessage.push('El usuario ingresado no corresponde con la empresa ingresada');

        if(errorMessage.length > 0){
            console.info(`Se encontraron ${errorMessage.length} errores de existencia en la request`);
            errorMessage.map(err => console.log(err));
            console.info('Enviando response')
            res.status(400).json({message: errorMessage});
        }
        else{
            //armamos body para user
            let valUser = {
                userName: req.body.userName,
                email: req.body.email,
                document: req.body.document,
                userPhone: req.body.userPhone,
                userFirstStreet: req.body.userFirstStreet,
                userSecondStreet: req.body.userSecondStreet,
                userDoorNumber: req.body.userDoorNumber,
                typeId: req.body.type
            }

            // armamos body para company
            let valComp = {
                companyName: req.body.companyName,
                rut: req.body.companyRut,
                companyPhone: req.body.companyPhone,
                companyFirstStreet: req.body.companyFirstStreet,
                companySecondStreet: req.body.companySecondStreet,
                companyDoorNumber: req.body.companyDoorNumber,
                description: req.body.companyDescription,
                typeId: req.body.type,
                rubroId: req.body.rubro,
                imageName: req.file ? req.file.filename : '',
                imagePath: req.file ? req.file.filename : '' 
            }
            console.log(valComp);

            //envio bodies para validar tipos de datos
            console.log('Iniciando validacion de tipos de datos de User');
            const {error: erroresUser} = await validarDatosUser(valUser);
            console.log('Iniciando validacion de tipos de datos de Company');
            const {error: erroresCompany} = await validarDatosCompany(valComp);

            if(erroresCompany || erroresUser){                
                console.info('Erorres encontrados en la request');
                let errores = erroresCompany.details.map(e => {
                    console.info(e.message);
                    return e.message;
                });

                let erroresDos = erroresUser.details.map(e => {
                    console.info(e.message);
                    return e.message;
                });
                errores.concat(erroresDos);
                return { status: 400, message: errores };
            }
            else{
                console.log('Enviando query Update de Company');
                //Enviamos Update de company
                let { result: companyRes, message: companyMessage } = await updateCompany(idEmpresa, valComp)
            
                console.log('Enviando query Update de User');
                //envio update de user
                let { result: userRes, message: userMessage } = await updateUser(idUser, valUser);

                //si el update de usuer salio bien, envio response
                if(Number(userRes) !== 0 && Number(companyRes) !== 0){
                    console.log(`Usuario modificado con ID: ${idUser}`);
                    console.log('Update finalizado');
                    res.status(204).json({message: 'Modificacion exitoso'});
                }
                else{
                    console.info('No se pudo modificar usuario y/o compania');
                    console.info(companyMessage);
                    console.info(userMessage);
                    console.info('Preparando response');
                    res.status(500).json({message: [userMessage, companyMessage]});
                }
            }
        }
    }
};

function validarLogin(body){
    const schema = Joi.object().keys({
        userEmail: Joi.string().email().required(),
        userPassword: Joi.string().min(8).max(20).required()
    }).with('userEmail', 'userPassword');

    return Joi.validate(body, schema);
};

//Exporto funciones de ruteo
module.exports = {
    login,
    logout,
    signup,
    verifyToken,
    actualizarPerfil
};