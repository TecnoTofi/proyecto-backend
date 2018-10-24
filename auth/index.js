//Incluimos modulo express para el manejo HTTP
const express = require('express');
//Creamos el router
const router = express.Router();
// const jwt = require('jsonwebtoken');

const AuthRoutes = require('./routes');

// const secreto = 'keyboard_cat';

//Todas las rutas empieza con /api/auth

// function verificarToken(req, res, next) {
//     if(!req.cookies.access_token){
//         console.log('Token invalido, acceso no autorizado');
//         res.status(401).json({message: 'Token invalido, acceso no autorizado'});
//     }
//     const token = req.cookies.access_token;
//     jwt.verify(token, secreto, (error, userData) => {
//         if(error){
//             console.log(`Error en la verificacion del token : ${error}`);
//             res.status(422).json({message: `Error en la verificacion del token : ${error}`});
//         }
//         req.user = userData;
//         next();
//     });
// }


// router.post('/login', 

//Ruta para regsitro de usuarios-empresas
//Mejorar esta funcion, las queries son dependientes
//Se puede usar KNEX
//Falta verificar que no exista aun
// router.post('/signup', 

router.post('/login', AuthRoutes.login);
router.post('/logout', AuthRoutes.logout);
router.post('/signup', AuthRoutes.signup);

module.exports = router;