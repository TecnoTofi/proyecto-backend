//Incluimos modulo express para el manejo HTTP
const express = require('express');
//Creamos el router
const router = express.Router();
//Incluimos modulo Joi para la validaciond de datos
const Joi = require('joi');
//Incluimos modulo propio con pool de conexion a DB
let pool = require('../db/connection');

//Todas las rutas empiezan con /api/users

//Ruta para obtener el listado de Roles de usuario
router.get('/types', (req, res) => {
    console.log('Conexion GET entrante : /api/users/types');

    pool.connect((err, db, done) => {
        //Si hubo problemas de conexion con la DB, tiro para afuera
        if(err){
            console.log(`Error al conectar con la base de datos : ${err}`);
            return res.status(500).json({ message: `Error al conectar con la base de datos : ${err}`});
        }
        //Envio consulta SELECT
        db.query('SELECT * FROM "dbo.Role"', (err, typesTable) => {
            done();
            //Si hubo error en el select, tiro para afuera
            if(err){
                console.log(`Error en la query Select de role : ${err}`);
                return res.status(500).json({ message: `Error en la query Select de role: ${err}`});
            }
            console.log('Informacion de Roles enviada');
            return res.status(200).json(typesTable.rows);
        })
    })
});

module.exports = router;