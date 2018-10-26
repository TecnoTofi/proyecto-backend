//Incluimos modulo express para el manejo HTTP
const express = require('express');
//Creamos el router
const router = express.Router();

const UserRoutes = require('./routes');

//Todas las rutas empiezan con /api/users

//Ruta para obtener el listado de Roles de usuario
router.get('/role', UserRoutes.roles);

module.exports = router;