const jwt = require('jsonwebtoken');
//Incluimos modulo Joi para la validaciond de datos
const Joi = require('joi');
//Incluimos modulo de encriptacion de contraseñas
const bcrypt = require('bcrypt');
//Incluimos modulo propio con pool de conexion a DB
const userQueries = require('../users/dbQueries');
const companyQueries = require('../companies/dbQueries');

const secreto = 'keyboard_cat';

//funcion ruteo de inicio de sesion
async function login(req, res){
    console.log('Conexion POST entrante : /api/login');

    let {error} = await validarLogin(req.body);

    if(error){
        console.log(`Error en la validacion : ${error}`);
        return res.status(400).json({message: error.details[0].message});
    }
    console.log('Validacion de datos exitosa');
    
    let user = await userQueries
                        .users
                        .getOneByEmail(req.body.userEmail)
                        .then(res => {
                            console.log(res);
                            if(res) return res
                            else return null
                        })
                        .catch(err => {
                            console.log(`Error en la Query SELECT de User para Email : ${err}`);
                            res.status(500).json({message: err});
                        });
                                
    if(user){

        let rol = await userQueries
                            .roles
                            .getRolById(user.roleId)
                            .then(rol => {
                                console.log(rol);
                                if(rol) return rol
                                else return null;
                            })
                            .catch(err => {
                                console.log(`Error en Query SELECT de Role : ${err}`);
                                res.status(500).json({message: err});
                            });

        bcrypt
            .compare(req.body.userPassword, user.password)
            .then(result => {

                if(result){
                    console.log('Comparacion correcta');
                    const {userEmail, userPassword} = req.body;
                    console.log('Firmando token');
                    jwt.sign({userEmail, userPassword}, secreto, {expiresIn: '1h'}, (error, token) => {
                        if(error){
                            console.log(`Error al firmar el token : ${error}`);
                            res.status(500).json({message: 'Error al firmar el token'});
                        }
                        console.log('Token firmado correctamente');
                        
                        res.cookie('access_token', token, {
                            maxAge: new Date(Date.now() + 3600),
                            httpOnly: false
                        });

                        let data = {
                            userType: rol.name,
                            userName: user.name,
                            userEmail: user.email,
                            userId: user.id
                        };

                        console.log(`Preparacion de datos : ${data}`);

                        res.status(200).json({
                            message: 'Loggeado correctamente',
                            // token: token,
                            userData: data
                        });
                        console.log('Loggin correcto');
                        console.log('Response enviada correctamente');
                    });
                }//if de bcrypt
            else{
                console.log('Contraseña incorrecta');
                res.json({message: 'Usuario o contraseña incorrectos.'});
            }
        })
        .catch(err => {
            console.log('Error al encyptar');
            res.status(500).json({message: 'Error al encryptar'});
        });
    }
    else{
        console.log(`Email no existe en la plataforma : ${req.body.userEmail}`);
        res.status(400).json({message: 'Usuario o contraseña incorrectos.'});
    }
};

//funcion de ruteo de cierre de sesion
const logout = (req, res) => {
    res.clearCookie('access_token', req.cookies.access_token, {
        maxAge: new Date(Date.now() + 3600),
        httpOnly: false
    });
    res.status(200).json({message: 'Cierre de sesion exitoso'});
};

//funcion de ruteo de registro
async function signup(req, res){
    console.log('Conexion POST entrante : /api/signup');
    
    //valido datos
    console.log('Iniciando validacion de tipos de datos de User');
    const validacionUsuarios = await ValidarTipoDatosUsuario(req.body.userData);
    console.log('Iniciando validacion de tipos de datos de Company');
    const validacionEmpresas = await validarTipoDatosEmpresa(req.body.companyData);

    // Si falla la validacion tiro para afuera
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

        const erroresexistencia = await ValidarExistenciaDatos(req.body);

        if(erroresexistencia.length == 0){
            console.log('Comenzado encryptacion de contraseña');
            bcrypt.hash(req.body.userData.userPassword, 10, (err, hash) => {
                //Si falla la encriptacion, tiro para afuera
                if(err){
                    console.log(`Error al crear hash : ${err}`);
                    res.status(500).json({error: err});
                }
                else{
                    console.log('Encryptacion de contraseña, correcta');
                    console.log('Preparacion de registro de empresa');
                    const companyData = {
                        name: req.body.companyData.companyName,
                        rut: req.body.companyData.companyRut,
                        firstStreet: req.body.companyData.companyFirstStreet,
                        secondStreet: req.body.companyData.companySecondStreet,
                        doorNumber: req.body.companyData.companyDoorNumber,
                        phone: req.body.companyData.companyPhone,
                        categoryId: req.body.companyData.category
                    };
    
                    let companyId;
                    console.log('Enviando query INSERT de Company');
                    companyQueries
                        .companies
                        .insert(companyData)
                        .then(res => {
                            companyId = res;
                        })
                        .catch(err => {
                            console.log(`Error en insert de Company : ${err}`);
                            res.status(500).json({message: err});
                        });
    
                    console.log('Query correcta');
                    console.log(`Empresa insertada con id: ${companyId}`);
                    console.log('Preparacion de registro de usuario');
                    const userData = {
                        phone: req.body.userData.userphone,
                        email: req.body.userData.userEmail,
                        password: hash,
                        document: req.body.userData.userDocument,
                        name: req.body.userData.userName,
                        roleId: req.body.userData.role,
                        companyId: companyId,
                        firstStreet: req.body.userData.userFirstStreet,
                        secondStreet: req.body.userData.userSecondStreet,
                        doorNumber: req.body.userData.userDoorNumber
                      };
    
                    let userId;
                    console.log('Enviando query INSERT de User');
                    userQueries
                        .users
                        .insert(userData)
                        .then(res => {
                            userId = res;
                        })
                        .catch(err => {
                            console.log(`Error en insert de User : ${err}`);
                            res.status(500).json({message: err});
                        });
    
                    console.log('Query correcta');
                    console.log(`Usuario insertado con id: ${userId}`);
                    console.log('Registro finalizado');
                    res.status(201).json({message: 'Alta exitosa'});
                }
            });
        }
        else{
            console.log('Errores en la validacion de existencia encontrados');
            res.status(400).json({message: erroresexistencia});
        }
    }
};

async function ValidarExistenciaDatos(body){
    console.log('Iniciando validacion de existencia de datos');

    let errores = [];

    await userQueries
        .users
        .getOneByEmail(body.userData.userEmail)
        .then(res => {
            if(res){
                console.log(`Email ya existe en la DB : ${body.userData.userEmail}`);
                errores.push('Email ya esta en uso');
            }
        })
        .catch(err => {
            console.log(`Error en la Query SELECT de User para Email : ${err}`);
            res.status(500).json({message: err});
        });

    await userQueries
        .users
        .getOneByDocument(body.userData.userDocument)
        .then(res => {
            if(res){
                console.log(`Documento ya existe en la DB : ${body.userData.userDocument}`);
                errores.push('Documento ya esta en uso');
            }
        })
        .catch(err => {
            console.log(`Error en la Query SELECT de User para Documento : ${err}`);
            res.status(500).json({message: err});
        });

    await companyQueries
        .companies
        .getOneByName(body.companyData.companyName)
        .then(res => {
            if(res){
                console.log(`Nombre de empresa ya existe en la DB : ${body.companyData.companyName}`);
                errores.push('Nombre de empresa ya esta en uso');
            }
        })
        .catch(err => {
            console.log(`Error en la Query SELECT de Company para Name : ${err}`);
            res.status(500).json({message: err});
        });

    await companyQueries
        .companies
        .getOneByRut(body.companyData.companyRut)
        .then(res => {
            if(res){
                console.log(`RUT ya existe en la DB : ${body.companyData.companyRut}`);
                errores.push('RUT ya esta en uso');
            }
        })
        .catch(err => {
            console.log(`Error en la Query SELECT de Company para Rut : ${err}`);
            res.status(500).json({message: err});
        });
    await console.log(`Errores encontrados en validacion de existencias : ${errores}`);
    return errores;
};

//Validaciones de datos

//Validacion de nombres
function ValidarTipoDatosUsuario(body){
    const schema = {
        userName: Joi.string().min(3).max(50).required(),
        userEmail: Joi.string().min(6).max(50).email().required(),
        userPassword: Joi.string().min(8).max(20).required(),
        userDocument: Joi.string().min(5).max(15).required(),
        userPhone: Joi.string().min(7).max(15).required(),
        userFirstStreet: Joi.string().max(30),
        userSecondStreet: Joi.string().max(30),
        userDoorNumber: Joi.string().max(15),
        role: Joi.number().required()
    };
    return Joi.validate(body, schema);
};

function validarTipoDatosEmpresa(body){
    const schema = {
        companyName: Joi.string().min(3).max(50).required(),
        companyRut: Joi.string().min(12).max(12).required(),
        companyPhone: Joi.string().min(7).max(15).required(),
        companyFirstStreet: Joi.string().max(30).required(),
        companySecondStreet: Joi.string().max(30).required(),
        companyDoorNumber: Joi.string().max(15).required(),
        category: Joi.number().required()
    };
    return Joi.validate(body, schema);
};


function validarLogin(body){
    const schema = {
        userEmail: Joi.string().min(6).max(50).email().required(),
        userPassword: Joi.string().min(8).max(20).required()
    };
    return Joi.validate(body, schema);
};

module.exports = { login, logout, signup };