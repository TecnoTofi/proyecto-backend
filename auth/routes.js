const jwt = require('jsonwebtoken');
//Incluimos modulo Joi para la validaciond de datos
const Joi = require('joi');
//Incluimos modulo de encriptacion de contraseñas
const bcrypt = require('bcrypt');
//Incluimos modulo propio con pool de conexion a DB
let pool = require('../db/connection');

const secreto = 'keyboard_cat';

//funcion ruteo de inicio de sesion
const login = (req, res) => {
    console.log('Conexion POST entrante : /api/login');

    let {error} = validarLogin(req.body);

    if(error){
        console.log(`Error en la validacion : ${error}`);
        return res.status(400).json({message: error.details[0].message});
    }
    console.log('Pasa validacion de datos');

    pool.connect((err, db, done) => {

        if(err){
            console.log(`Error al conectar con la base de datos : ${err}`);
            return res.status(500).json({ message: `Error al conectar con la base de datos : ${err}`});
        }
        console.log('Conexion con DB correcta');
        console.log('Enviando query SELECT a User');
        db.query('select * from "dbo.User" where email = $1', [req.body.userEmail], (err, user) => {
            // done();

            if(err){
                console.log(`Error en la query SELECT de users : ${err}`);
                return res.status(500).json({ message: `Error en la query SELECT de users: ${err}`});
            }
            console.log('Query SELECT de User correcta');
            if(user.rowCount > 0){
                console.log('Usuario obtenido correctamente');
                console.log('Enviando query SELECT a Role');
                db.query('select name from "dbo.Role" where id = $1', [user.rows[0].roleId], (err, type) => {
                    done();

                    if(err){
                        console.log(`Error en la query SELECT de ROLE : ${err}`);
                        return res.status(500).json({ message: `Error en la query SELECT de ROLE: ${err}`});
                    }
                    console.log('Query SELECT a Role correcta');
                    console.log('Encriptando contraseña para comparacion');
                
                //hash
                    bcrypt
                        .compare(req.body.userPassword, user.rows[0].password)
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
                                console.log(`Tipo: ${type.rows[0].name}`);
                                console.log(`Email: ${user.rows[0].email}`);
                                console.log(`Name: ${user.rows[0].name}`);
                                console.log(`ID: ${user.rows[0].id}`);

                                let data = {
                                    userType: type.rows[0].name,
                                    userName: user.rows[0].name,
                                    userEmail: user.rows[0].email,
                                    userId: user.rows[0].id
                                };

                                res.status(200).json({
                                    message: 'Loggeado correctamente',
                                    token: token,
                                    userData: data
                                });
                                console.log('Loggin correcto');
                                console.log('Response enviada correctamente');
                            });
                        }//if de bcrypt
                        else{
                            res.json({message: 'Usuario o contraseña incorrectos.'});
                        }
                    });
                });
            }//if de rows > 0
            else{
                res.json({message: 'Usuario o contraseña incorrectos.'});
            }
        });
    });
};

//funcion de ruteo de cierre de sesion
const logout = (req, res) => {
    res.clearCookie('access_token', req.cookies.access_token, {
        maxAge: new Date(Date.now() + 3600),
        httpOnly: false
    });
    res.status(200).json({message: 'Cierre de sesion exitoso'});
}

//funcion de ruteo de registro
const signup = (req, res) => {
    console.log('Conexion POST entrante : /api/signup');
    //valido datos
    const {error} = validarRegistroEmpresas(req.body);
    //Si falla la validacion tiro para afuera
    if(error){
        console.log(`Error en la validacion : ${error}`);
        res.status(400).json({message: error.details[0].message});
    }
    //encripto la contraseña
    bcrypt.hash(req.body.userPassword, 10, (err, hash) => {
        //Si falla la encriptacion, tiro para afuera
        if(err){
            console.log(`Error al crear hash : ${err}`);
            res.status(500).json({error: err});
        }
        else{
            //conecto a la base de datos
            pool.connect((err, db, done) => {
                //Si hubo problemas de conexion con la DB, tiro para afuera
                if(err){
                    console.log(`Error al conectar con la base de datos : ${err}`);
                    res.status(500).json({ message: `Error al conectar con la base de datos : ${err}`});
                }

                let company = [
                    req.body.companyName,
                    req.body.companyRut,
                    req.body.companyPhone,
                    req.body.companyFirstStreet,
                    req.body.companySecondStreet,
                    req.body.companyDoorNumber,
                    req.body.category
                ]

                //Envio insert de la empresa
                db.query('INSERT INTO "dbo.Company" (name, rut, phone, "firstStreet", "secondStreet", "doorNumber", "categoryId") VALUES ($1, $2, $3, $4, $5, $6, $7)', company, (err) => {
        
                    //Si hubo error en el insert, tiro para afuera
                    if(err){
                        console.log(`Error en la query INSERT de empresas : ${err}`);
                        res.status(500).json({ message: `Error en la query INSERT de empresas: ${err}`});
                    }
        
                    console.log(`Empresa insertada : ${req.body.companyName}`);
        
                    //Voy a buscar el id de la empresa insertada
                    //Ver de conseguirlo con el insert, no con una query mas
                    db.query('SELECT id FROM "dbo.Company" WHERE name =  $1', [req.body.companyName], (err, companyTable) => {
        
                        //Si hubo error en el select, tiro para afuera
                        if(err){
                            console.log(`Error en la query Select de empresas : ${err}`);
                            res.status(500).json({ message: `Error en la query Select de empresas: ${err}`});
                        }
                        
                        let companyId = companyTable.rows[0].id;
                        console.log(`Empresa obtenida : ${companyId}`);
        
                        let user = [
                            req.body.userName,
                            req.body.userEmail,
                            hash,
                            req.body.userDocument,
                            req.body.userPhone,
                            req.body.userFirstStreet,
                            req.body.userSecondStreet,
                            req.body.userDoorNumber,
                            req.body.role,
                            companyId
                        ]

                        //Envio insert del usuario
                        db.query('INSERT INTO "dbo.User" (name, email, password, document, phone, "firstStreet", "secondStreet", "doorNumber", "roleId", "companyId") values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', user, (err) => {
                            done();
                            //Si hubo error en el insert, tiro para afuera
                            if(err){
                                console.log(`Error en la query INSERT de usuarios : ${err}`);
                                res.status(500).json({ message: `Error en la query INSERT de usuarios: ${err}`});
                            }
                
                            console.log(`Usuario insertado : ${req.body.userName}`);
                        });
                    });
                    res.status(201).json({ message: 'Alta exitosa'});
                });
            });
        }
    });
};

//Validaciones de datos

//Validacion de nombres
function validarRegistroEmpresas(body){
    const schema = {
        userName: Joi.string().min(3).max(50).required(),
        userEmail: Joi.string().min(6).max(50).email().required(),
        userPassword: Joi.string().min(8).max(20).required(),
        userDocument: Joi.string().min(5).max(15).required(),
        userPhone: Joi.string().min(7).max(15).required(),
        userFirstStreet: Joi.string().max(30),
        userSecondStreet: Joi.string().max(30),
        userDoorNumber: Joi.string().max(15),
        companyName: Joi.string().min(3).max(50).required(),
        companyRut: Joi.string().min(12).max(12).required(),
        companyPhone: Joi.string().min(7).max(15).required(),
        companyFirstStreet: Joi.string().max(30).required(),
        companySecondStreet: Joi.string().max(30).required(),
        companyDoorNumber: Joi.string().max(15).required(),
        category: Joi.number().required(),
        role: Joi.number().required()
    };
    return Joi.validate(body, schema);
}

function validarLogin(body){
    const schema = {
        userEmail: Joi.string().min(6).max(50).email().required(),
        userPassword: Joi.string().min(8).max(20).required()
    };
    return Joi.validate(body, schema);
}

module.exports = { login, logout, signup};