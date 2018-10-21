//Incluimos modulo express para el manejo HTTP
const express = require('express');
//Creamos el router
const router = express.Router();
//Incluimos modulo Joi para la validaciond de datos
const Joi = require('joi');
//Incluimos modulo de encriptacion de contraseñas
const bcrypt = require('bcrypt');
//Incluimos modulo propio con pool de conexion a DB
let pool = require('../db/connection');

//Todas las rutas empieza con /api/auth

router.get('/', (req, res) => {
    res.json({message: '😄'});
})

//Ruta para regsitro de usuarios-empresas
//Mejorar esta funcion, las queries son dependientes
router.post('/signup', (req, res) => {
    console.log('Conexion POST entrante : /api/register');
    //valido datos
    const {error} = validarRegistroEmpresas(req.body);
    //Si falla la validacion tiro para afuera
    if(error){
        console.log(`Error en la validacion : ${error}`);
        return res.status(400).send({message: error.details[0].message});
    }
    //encripto la contraseña
    bcrypt.hash(req.body.userPassword, 10, (err, hash) => {
        //Si falla la encriptacion, tiro para afuera
        if(err){
            console.log(`Error al crear hash : ${err}`);
            return res.status(500).json({error: err});
        }
        else{
            //conecto a la base de datos
            pool.connect((err, db, done) => {
                //Si hubo problemas de conexion con la DB, tiro para afuera
                if(err){
                    console.log(`Error al conectar con la base de datos : ${err}`);
                    return res.status(500).send({ message: `Error al conectar con la base de datos : ${err}`});
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
                        return res.status(500).send({ message: `Error en la query INSERT de empresas: ${err}`});
                    }
        
                    console.log(`Empresa insertada : ${req.body.companyName}`);
        
                    //Voy a buscar el id de la empresa insertada
                    //Ver de conseguirlo con el insert, no con una query mas
                    db.query('SELECT id FROM "dbo.Company" WHERE name =  $1', [req.body.companyName], (err, companyTable) => {
        
                        //Si hubo error en el select, tiro para afuera
                        if(err){
                            console.log(`Error en la query Select de empresas : ${err}`);
                            return res.status(500).send({ message: `Error en la query Select de empresas: ${err}`});
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
                                return res.status(500).send({ message: `Error en la query INSERT de usuarios: ${err}`});
                            }
                
                            console.log(`Usuario insertado : ${req.body.userName}`);
                        });
                    });
                    return res.status(201).send({ message: 'Alta exitosa'});
                });
            });
        }
    });
});

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
        companyFirstStreet: Joi.string().max(30),
        companySecondStreet: Joi.string().max(30),
        companyDoorNumber: Joi.string().max(15),
        category: Joi.number().required(),
        role: Joi.number().required()
    };
    return Joi.validate(body, schema);
}

module.exports = router;