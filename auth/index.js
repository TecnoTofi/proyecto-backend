//Incluimos modulo express para el manejo HTTP
const express = require('express');
//Creamos el router
const router = express.Router();

const AuthRoutes = require('./routes');

router.post('/login', AuthRoutes.login);
router.post('/logout', AuthRoutes.logout);
router.post('/signup', AuthRoutes.signup);

module.exports = router;