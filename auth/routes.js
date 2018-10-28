const jwt = require('jsonwebtoken');
//Incluimos modulo Joi para la validaciond de datos
const Joi = require('joi');
//Incluimos modulo de encriptacion de contraseñas
const bcrypt = require('bcrypt');
//Incluimos modulo propio con pool de conexion a DB
const userQueries = require('../users/dbQueries');
const companyQueries = require('../companies/dbQueries');
const { insertCompany, validarTipoDatosCompany } = require('../companies/routes');
const { insertUser, validarTipoDatosUser, validarLogin } = require('../users/routes');

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
        const comparacionPass = await bcrypt.compare(req.body.userPassword, user.password);

        if(comparacionPass){
            console.log('Comparacion correcta');

            const {userEmail, userPassword} = req.body;

            console.log('Firmando token');
            const token = await jwt.sign({userEmail, userPassword}, secreto, {expiresIn: '1h'})

            if(token){
                console.log('Token firmado correctamente');

                let rol = await userQueries
                                    .roles
                                    .getOneById(user.roleId)
                                    .then(rol => {
                                        console.log(`Informacion de Role obtenida correctamente`);
                                        return rol
                                    })
                                    .catch(err => {
                                        console.log(`Error en Query SELECT de Role : ${err}`);
                                        res.status(500).json({message: err});
                                    });
                let company = await companyQueries
                                        .companies
                                        .getOneById(user.companyId)
                                        .then(comp => {
                                            console.log(`Informacion de Company obtenida correctamente`);
                                            return comp
                                        })
                                        .catch(err => {
                                            console.log(`Error en Query SELECT de Company : ${err}`);
                                            res.status(500).json({message: err});
                                        });
                
                res.cookie('access_token', token, {
                    maxAge: new Date(Date.now() + 3600),
                    httpOnly: false
                });

                let data = {
                    userType: rol.name,
                    userName: user.name,
                    userEmail: user.email,
                    userId: user.id,
                    userCompanyName: company.name,
                    userCompanyId: company.id
                };

                console.log(`Preparacion de datos : ${data}`);

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
            res.json({message: 'Usuario o contraseña incorrectos.'});
        }
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
    const validacionUsuarios = await validarTipoDatosUser(req.body.userData);
    console.log('Iniciando validacion de tipos de datos de Company');
    const validacionEmpresas = await validarTipoDatosCompany(req.body.companyData);

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
            const hash = await bcrypt.hash(req.body.userData.userPassword, 10);
            
            if(hash){
                console.log('Encryptacion de contraseña, correcta');

                console.log('Enviando query INSERT de Company');
                let company = await insertCompany(req.body.companyData);
                
                if(await company.id != 0){
                    console.log('Query correcta');
                    console.log(`Empresa insertada con id: ${company.id}`);

                    console.log('Enviando query INSERT de User');
                    let user = Number(await insertUser(req.body.userData, hash, company.id));

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

module.exports = { login, logout, signup };