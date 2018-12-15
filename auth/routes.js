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
        validarDatos: validarDatosCompany,
        updateCompany } = require('../companies/routes');
//Incluimos funciones de User
const { getUserByDocument,
        getUserByEmail,
        insertUser,
        validarDatos: validarDatosUser,
        updateUser } = require('../users/routes');
//Incluimos funciones de helpers
const { getTypeById, getRubroById } = require('../helpers/routes');

//Declaramos el secreto para JWT
const secreto = process.env.COOKIE_SECRET;
//const secreto = 'keyboard_cat';

//Ruteo para validacion de tokens
function verifyToken (req, res, next) {
    console.info('Conexion POST entrante : /api/auth/');
    console.log('cookies', req.cookies.access_token);

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
        console.info(`Error en la validacion de tipos de datos : ${error.details[0].message}`);
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info('Validacion de tipo de datos exitosa');
        //Buscamos el usuario en la BD a partir del email
        let { user } = await getUserByEmail(userEmail);

        if(user){
            //Si el usuario existe, procedemos a comparar la contraseña encriptada
            console.info('Usuario encontrado');

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
    if(errorUser) errorMessage.push(errorUser.details[0].message);
    if(errorCompany) errorMessage.push(errorCompany.details[0].message);

    if(errorMessage.length > 0){
        console.info(`Se encontraron ${errorMessage.length} errores de tipo en la request`);
        errorMessage.map(err => console.log(err));
        console.info('Enviando response');
        res.status(400).json({errorMessage});
    }
    else{
        console.info('Validacion de tipo de datos exitosa');

        // Validaciones de existencia
        console.info('Comenzando validaciones de existencia');

        let { user: userByEmail } = await getUserByEmail(valUser.email);
        let { user: userByDocument } = await getUserByDocument(valUser.document);
        let { company: companyByRut } = await getCompanyByRut(valCompany.rut);
        let { company: companyByName } = await getCompanyByName(valCompany.companyName);
        let { type: typeById } = await getTypeById(valCompany.typeId);
        let { rubro: rubroById } = await getRubroById(valCompany.rubroId);

        if(userByEmail) errorMessage.push(`Ya existe un usuario con email ${valUser.email}`);
        if(userByDocument) errorMessage.push(`Ya existe un usuario con documento ${valUser.document}`);
        if(companyByRut) errorMessage.push(`Ya existe una empresa con rut ${valCompany.rut}`);
        if(companyByName) errorMessage.push(`Ya existe una empresa con nombre ${valCompany.companyName}`);
        if(!typeById) errorMessage.push(`No existe tipo con ID: ${valCompany.typeId}`);
        if(!rubroById) errorMessage.push(`No existe rubro con ID: ${valCompany.rubroId}`);

        // const erroresexistencia = await ValidarExistenciaDatos(req.body);

        //Si no estan repetidos los datos, seguimos con el ecriptado de la contraseña
        if(errorMessage.length > 0){
            console.info(`Se encontraron ${errorMessage.length} errores de existencia en la request`);
            errorMessage.map(err => console.log(err));
            console.info('Enviando response')
            res.status(400).json({errorMessage});
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
                let { id: companyId } = await insertCompany(company);
                
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
                    };

                    //envio insert de user
                    let { id: userId } = await insertUser(user);

                    if(userId){
                        console.info(`Insert de User terminado correctamente, con ID: ${userId}`);
                        console.info('Preparando response');
                        res.status(201).json({message: 'Registro existoso'});
                    }
                    else{
                        console.info('Hubo un problema al insertar el usuario, realizando rollback');
                        let rollbackCompany = await rollbackInsertCompany(companyId);
                        if(rollbackCompany.res) console.info(`Rollback de Company ${companyId} realizado correctamente`);
                        else console.info(`Ocurrio un error en rollback de Company ${companyId}`);
                        console.info('Preparando response');
                        res.status(500).json({message: 'Error al registrarse'});
                    }
                }
                else{
                    console.info('Preparando response');
                    res.status(500).json({message: 'Error al registrarse'});
                }
            }
        }
    }
};

async function actualizarPerfil(req, res){
    let idUser= req.params.idUser;
    let idEmpresa= req.params.idEmpr;
    console.log('idUser', idUser);
    console.log('idEmpresa', idEmpresa);
    
    console.log(`Conexion POST entrante : /api/auth/update/user/${idUser}/company/${idEmpresa}`);
    console.log('body', req.body);

    //armamos body para user
    let valUser = {
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        userPassword: req.body.userPassword,
        userDocument: req.body.userDocument,
        userPhone: req.body.userPhone,
        userFirstStreet: req.body.userFirstStreet,
        userSecondStreet: req.body.userSecondStreet,
        userDoorNumber: req.body.userDoorNumber,
        type: req.body.type
    }

    // armamos body para company
    let valComp = {
        companyName: req.body.companyName,
        companyRut: req.body.companyRut,
        companyPhone: req.body.companyPhone,
        companyFirstStreet: req.body.companyFirstStreet,
        companySecondStreet: req.body.companySecondStreet,
        companyDoorNumber: req.body.companyDoorNumber,
        typeId: req.body.companyType,
        rubroId: req.body.rubro,
        companyDescription: req.body.companyDescription,
        imageName: req.file.filename,
        imagePath: req.fil  
    }
    console.log(valComp);

    //envio bodies para validar tipos de datos
    console.log('Iniciando validacion de tipos de datos de User');
    const validacionUsuarios = await validarTipoDatosUser(valUser);
    console.log('Iniciando validacion de tipos de datos de Company');
    const validacionEmpresas = await validarTipoDatosCompany(valComp);

    if(validacionUsuarios.error && validacionEmpresas.error){
        console.log('Error en la validacion de tipos de datos de usuario y empresa');
        let errores = {
            usuario: validacionUsuarios.error.details[0].message,
            empresa: validacionEmpresas.error.details[0].message
        };
        res.status(400).json({message: errores});
    }
    else if(validacionUsuarios.error){
        console.log('Error en la validacion de tipos de datos de usuario');
        let errores = {
            usuario: validacionUsuarios.error.details[0].message
        };
        res.status(400).json({message: errores});
    }
    else if(validacionEmpresas.error){
        console.log('Error en la validacion de tipos de datos de empresa');
        let errores = {
            empresa: validacionEmpresas.error.details[0].message
        };
        res.status(400).json({message: errores});
    }
    else{
        console.log('Validaciones de tipos de usuario correctas');

        //Si las validaciones de tipo esta bien, valido que los datos unicos no existan ya
        //const erroresexistencia = await ValidarExistenciaDatos(req.body);
        
        //Si no estan repetidos los datos, seguimos con el ecriptado de la contraseña
        //if(erroresexistencia.length == 0){

            console.log('Comenzado encryptacion de contraseña');
            //Encriptamos la contraseña
            const hash = await bcrypt.hash(valUser.userPassword, 10);
            
            //Si la encriptacion salio bien, pasamos al insert de company
            if(hash){
                console.log('Encryptacion de contraseña, correcta');

                console.log('Enviando query Update de Company');
                //Enviamos Update de company
                console.log(valComp);
                let company = await updateCompany(valComp,idEmpresa);
                console.log(company);
            
                console.log('Enviando query Update de User');
                    //envio update de user
                    let user = Number(await updateUser(valUser, idUser,hash));
                    console.log(user);
                    //si el update de usuer salio bien, envio response
                    if(await user.id != 0){
                        console.log('Query correcta');
                        console.log(`Usuario modificado con id: ${user.id}`);
                        console.log('Update finalizado');
                        res.status(201).json({message: 'Update exitoso'});
                    }
                    else{
                        //mejorar estas respuestas
                        res.status(500).json({message: 'Error en el update'});
                    }
                //}
                /*else{
                    res.status(500).json({message: 'Error en el update'});
                }*/
            }
            else{
                console.log(`Error al crear hash : ${err}`);
                res.status(500).json({error: err});
            }
        }
        /*else{
            console.log('Errores en la validacion de existencia encontrados');
            res.status(400).json({message: erroresexistencia});
        }*/
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