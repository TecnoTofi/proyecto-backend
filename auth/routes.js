//Incluimos dotenv para utilizar el archivo .env para el secreto
require('dotenv').config();
//Incluimos JsonWebToken para autenticacion
const jwt = require('jsonwebtoken');
//Incluimos modulo Bcrypt de encriptacion de contraseñas
const bcrypt = require('bcrypt');
//Incluimos dbQueries de User
const userQueries = require('../users/dbQueries');
//Incluimos dbQueries de Company
const companyQueries = require('../companies/dbQueries');
//Incluimos getCompany de Company
const { getCompany } = require('../companies/routes');
//Incluimos getRole de User
const { getRole } = require('../users/routes');
//Incluimos funciones de insert, validacion y updte para Company
const { insertCompany, validarTipoDatosCompany, updateCompany } = require('../companies/routes');
//Incluimos funciones de insert, validacion y update para User
const { insertUser, validarTipoDatosUser, validarLogin, updateUser } = require('../users/routes');

//Declaramos el secreto para JWT
const secreto = process.env.COOKIE_SECRET;
//const secreto = 'keyboard_cat';

//Ruteo para validacion de tokens
function verifyToken (req, res, next) {
    console.log('Iniciando validacion de token');

    //Verificamos que el token haya sido enviado en el header de la request
    if(!req.headers.token){
        //Si no viene el token, damos no autorizado
        console.log('No hay token, acceso no autorizado');
        res.status(401).json({message: 'Acceso no autorizado'});
    }
    else{
        //Si hay token, validamos con JWT
        const token = req.headers.token;
        jwt.verify(token, secreto, (error, userData) => {
            if(error){
                //Si el token no es valido o esta expirado, damos no autorizado
                console.log(`Token no valido : ${error}`);
                res.status(401).json({message: `Token no valido: ${error}`});
            }
            else{
                //Si el token es valido, agregamos al body las credenciales
                console.log('Validacion de token exitosa');
                req.body.userEmail = userData.userEmail;
                req.body.userPassword = userData.userPassword;
                //continuamos al login
                next();
            }
        });
    }
}

//Ruteo de inicio de sesion
async function login(req, res){
    console.log('Conexion POST entrante : /api/login');
    //Enviamos a validar el tipo de datos recibidos
    let {error} = await validarLogin(req.body);
    //Si hay error devolvemos y no continuamos
    if(error){
        console.log(`Error en la validacion de tipos de datos : ${error}`);
        return res.status(400).json({message: error.details[0].message});
    }
    console.log('Validacion de tipo de datos exitosa');
    //Buscamos el usuario en la BD a partir del email
    let user = await userQueries
                        .users
                        .getOneByEmail(req.body.userEmail)
                        .then(res => {
                            // console.log(res);
                            if(res) return res
                            else return null
                        })
                        .catch(err => {
                            console.log(`Error en la Query SELECT de User para Email : ${err}`);
                            res.status(500).json({message: err});
                        });
    if(user){
        //Si el usuario existe, procedemos a comparar la contraseña encriptada
        console.log('Usuario encontrado');
        const comparacionPass = await bcrypt.compare(req.body.userPassword, user.password)
                                            .then(result => {
                                                return result;
                                            })
                                            .catch(err => {
                                                console.log(`Error en la comparacion de contraseña: ${err}`);
                                                res.status(500).json('Error en el inicio de sesion.');
                                            });
        //Si la contraseña esta bien, avanzamos a firmar el token
        if(comparacionPass){
            console.log('Comparacion correcta');

            //Firmamos el token con la info necesaria
            const {userEmail, userPassword} = req.body;
            console.log('Firmando token');
            const token = jwt.sign({userEmail, userPassword}, secreto, {expiresIn: '1h'});

            //Si se creo correctamente el token, pasamos a buscar info extra
            if(token){
                console.log('Token firmado correctamente');
                //traemos el rol del usuario que esta iniciando sesion
                let { rol } = await getRole(user.roleId);
                //traemos la compañia a la que pertenece el usuario que esta iniciando sesion
                let { company } = await getCompany(user.companyId);



                //creamos el cookie
                res.cookie('access_token', token, {
                    maxAge: new Date(Date.now() + 3600),
                    httpOnly: false
                });
                //armamos el cuerpo de la respuesta
                let data = {
                    userType: rol.name,
                    userName: user.name,
                    userEmail: user.email,
                    userId: user.id,
                    userCompanyName: company.name,
                    userCompanyId: company.id
                };

                console.log(`Preparacion de datos : ${data}`);
                //enviamos la respuesta con el token y el cuerpo
                res.status(200).json({
                    message: 'Loggeado correctamente',
                    token: token,
                    userData: data
                });
                console.log('Loggin correcto');
                console.log('Response enviada correctamente');
            }
            else{
                console.log(`Error al firmar el token : ${error}`);
                res.status(500).json({message: 'Error al firmar el token'});
            }
                
        }
        else{
            console.log('Contraseña incorrecta');
            res.status(400).json({message: 'Usuario o contraseña incorrectos.'});
        }
    }
    else{
        console.log(`Email no existe en la plataforma : ${req.body.userEmail}`);
        res.status(400).json({message: 'Usuario o contraseña incorrectos.'});
    }
};

//ruteo de cierre de sesion
const logout = (req, res) => {
    //indicamos borrar cookie
    res.clearCookie('access_token', req.cookies.access_token, {
        maxAge: new Date(Date.now() + 3600),
        httpOnly: false
    });
    //enviamos response
    res.status(200).json({message: 'Cierre de sesion exitoso'});
};

//funcion de ruteo de registro
async function signup(req, res){
    console.log(req.body);
    console.log('Conexion POST entrante : /api/signup');
    
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
        role: req.body.role
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
        categoryId: req.body.companyCategory,
        companyDescription: req.body.companyDescription,
        imageName: req.file.filename,
        imagePath: req.file.path
    }

    //envio bodies para validar tipos de datos
    console.log('Iniciando validacion de tipos de datos de User');
    const validacionUsuarios = await validarTipoDatosUser(valUser);
    console.log('Iniciando validacion de tipos de datos de Company');
    const validacionEmpresas = await validarTipoDatosCompany(valComp);

    // console.log('Validacion users', validacionUsuarios);
    // console.log('Validacion companies', validacionEmpresas);

    //agregar un if validacionUsuarios && validacionEmpresas para evitar undefined
    //Respondo acorde a si fallo algo en las validaciones de tipo
    // if(!validacionUsuarios.error || !validacionEmpresas.error){
    //     console.log('Error en la validacion de tipos de datos : Undefined');
    //     res.status(500).json({message: 'Error inesperado'});
    // }
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
        const erroresexistencia = await ValidarExistenciaDatos(req.body);

        //Si no estan repetidos los datos, seguimos con el ecriptado de la contraseña
        if(erroresexistencia.length == 0){

            console.log('Comenzado encryptacion de contraseña');
            //Encriptamos la contraseña
            const hash = await bcrypt.hash(valUser.userPassword, 10);
            
            //Si la encriptacion salio bien, pasamos al insert de company
            if(hash){
                console.log('Encryptacion de contraseña, correcta');

                console.log('Enviando query INSERT de Company');
                //Enviamos insert a company
                console.log(valComp);
                let company = await insertCompany(valComp);
                
                //Si el insert de company salio bien, paso a insert de usuario
                if(await company.id != 0){
                    console.log('Query correcta');
                    console.log(`Empresa insertada con id: ${company.id}`);

                    console.log('Enviando query INSERT de User');
                    //envio insert de user
                    let user = Number(await insertUser(valUser, hash, company.id));
                    //si el insert de usuer salio bien, envio response
                    if(await user.id != 0){
                        console.log('Query correcta');
                        console.log(`Usuario insertado con id: ${user.id}`);
                        console.log('Registro finalizado');
                        res.status(201).json({message: 'Alta exitosa'});
                    }
                    else{
                        //mejorar estas respuestas
                        res.status(500).json({message: 'Error en el alta'});
                    }
                }
                else{
                    res.status(500).json({message: 'Error en el alta'});
                }
            }
            else{
                console.log(`Error al crear hash : ${err}`);
                res.status(500).json({error: err});
            }
        }
        else{
            console.log('Errores en la validacion de existencia encontrados');
            res.status(400).json({message: erroresexistencia});
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
        role: req.body.role
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
        categoryId: req.body.companyCategory,
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

//Validaciones de existencia de datos unicos en BD
async function ValidarExistenciaDatos(body){
    console.log('Iniciando validacion de existencia de datos');

    let errores = [];
    
    //Me fijo que no exista ya el email
    await userQueries
        .users
        .getOneByEmail(body.userEmail)
        .then(res => {
            if(res){
                console.log(`Email ya existe en la DB : ${body.userEmail}`);
                errores.push('Email ya esta en uso');
            }
        })
        .catch(err => {
            console.log(`Error en la Query SELECT de User para Email : ${err}`);
            res.status(500).json({message: err});
        });
    
    //Me fijo que no exista ya el documento de identidad
    await userQueries
        .users
        .getOneByDocument(body.userDocument)
        .then(res => {
            if(res){
                console.log(`Documento ya existe en la DB : ${body.userDocument}`);
                errores.push('Documento ya esta en uso');
            }
        })
        .catch(err => {
            console.log(`Error en la Query SELECT de User para Documento : ${err}`);
            res.status(500).json({message: err});
        });

    // Me fijo que no exista ya el nombre de la empresa
    await companyQueries
        .companies
        .getOneByName(body.companyName)
        .then(res => {
            if(res){
                console.log(`Nombre de empresa ya existe en la DB : ${body.companyName}`);
                errores.push('Nombre de empresa ya esta en uso');
            }
        })
        .catch(err => {
            console.log(`Error en la Query SELECT de Company para Name : ${err}`);
            res.status(500).json({message: err});
        });

    //Me fijo que no exista ya el RUT
    await companyQueries
        .companies
        .getOneByRut(body.companyRut)
        .then(res => {
            if(res){
                console.log(`RUT ya existe en la DB : ${body.companyRut}`);
                errores.push('RUT ya esta en uso');
            }
        })
        .catch(err => {
            console.log(`Error en la Query SELECT de Company para Rut : ${err}`);
            res.status(500).json({message: err});
        });
    //envio response
    await console.log(`Errores encontrados en validacion de existencias : ${errores}`);
    return errores;
};

//Exporto funciones de ruteo
module.exports = {
    login,
    logout,
    signup,
    verifyToken,
    actualizarPerfil
};