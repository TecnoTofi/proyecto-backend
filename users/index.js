//Incluimos modulo express para el manejo HTTP
const express = require('express');
//Creamos el router
const router = express.Router();

const UserRoutes = require('./routes');

//Todas las rutas empiezan con /api/user

router.get('/:id', UserRoutes.getOneUser);

module.exports = router;