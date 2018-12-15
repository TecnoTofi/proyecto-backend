//Incluimos modulo express para el manejo HTTP
const express = require('express');
//Creamos el router
const router = express.Router();

const UserRoutes = require('./routes');

//Todas las rutas empiezan con /api/user

//Ruta para obtener el listado de Roles de usuario
router.get('/type', UserRoutes.getAllTypes);
router.get('/role/signup', UserRoutes.forSignup);
router.get('/:id', UserRoutes.getOneUser);

module.exports = router;