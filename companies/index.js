//Incluimos modulo express para el manejo HTTP
const express = require('express');
//Creamos el router
const router = express.Router();
//Incluimos modulo Joi para la validaciond de datos
// const Joi = require('joi');
//Incluimos modulo propio con pool de conexion a DB
// let pool = require('../db/connection');
const CompanyRoutes = require('./routes');
// const VerifyToken = require('../auth/verifyToken');
const jwt = require('jsonwebtoken');
//Todas las rutas empiezan con /api/companies
const secreto = 'keyboard_cat';

function verifyToken (req, res, next){
    console.log(req.headers.token);
    if(!req.headers.token){
        console.log('Token invalido, acceso no autorizado');
        res.status(401).json({message: 'Acceso no autorizado'});
    }
    const token = req.headers.token;
    jwt.verify(token, secreto, (error, userData) => {
        if(error){
            console.log(`Error en la verificacion del token : ${error}`);
            res.status(422).json({message: `Error en la verificacion del token : ${error}`});
        }
        req.user = userData;
        next();
    });
}

//Ruta para obtener el listado de companyCategory
router.get('/types', CompanyRoutes.categories);
router.get('/', CompanyRoutes.companies);

module.exports = router;
// export default router;