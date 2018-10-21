//Incluimos modulo express para el manejo HTTP
const express = require('express');
//Creamos el router
const router = express.Router();
//Incluimos modulo Joi para la validaciond de datos
const Joi = require('joi');
//Incluimos modulo de encriptacion de contraseñas
const bcrypt = require('bcrypt');
//Incluimos modulo propio con pool de conexion a DB
let pool = require('../database/connection');

//Todas las rutas empieza con /api/auth

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
                //Envio insert de la empresa
                db.query('INSERT INTO company (name, rut, phone, "categoryId") VALUES ($1, $2, $3, $4)', [req.body.companyName, req.body.companyRut, req.body.companyPhone, req.body.category], (err) => {
        
                    //Si hubo error en el insert, tiro para afuera
                    if(err){
                        console.log(`Error en la query INSERT de empresas : ${err}`);
                        return res.status(500).send({ message: `Error en la query INSERT de empresas: ${err}`});
                    }
        
                    console.log(`Empresa insertada : ${req.body.companyName}`);
        
                    //Voy a buscar el id de la empresa insertada
                    //Ver de conseguirlo con el insert, no con una query mas
                    db.query('SELECT id FROM company WHERE name = $1', [req.body.companyName], (err, companyTable) => {
        
                        //Si hubo error en el select, tiro para afuera
                        if(err){
                            console.log(`Error en la query Select de empresas : ${err}`);
                            return res.status(500).send({ message: `Error en la query Select de empresas: ${err}`});
                        }
                        
                        let companyId = companyTable.rows[0].id;
                        console.log(`Empresa obtenida : ${companyId}`);
        
                        //Envio insert del usuario
                        db.query('INSERT INTO "user" (name, email, password, document, phone, "roleId", "companyId") values ($1, $2, $3, $4, $5, $6, $7)', [req.body.userName, req.body.userEmail, hash, req.body.userDocument, req.body.userPhone, req.body.role, companyId], (err) => {
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
        userEmail: Joi.string().min(6).max(50).required(),
        userPassword: Joi.string().min(8).max(20).required(),
        userDocument: Joi.string().min(5).max(15).required(),
        userPhone: Joi.string().min(7).max(15).required(),
        companyName: Joi.string().min(3).max(50).required(),
        companyRut: Joi.string().min(12).max(12).required(),
        companyPhone: Joi.string().min(7).max(15).required(),
        category: Joi.number().required(),
        role: Joi.number().required()
    };
    return Joi.validate(body, schema);
}

module.exports = router;