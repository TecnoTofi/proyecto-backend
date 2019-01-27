//Incluimos modulo express para el manejo HTTP
const express = require('express');
//Creamos el router
const router = express.Router();

const UserRoutes = require('./routes');
const { verifyToken } = require('../auth/routes');

//Todas las rutas empiezan con /api/user

//Endpoints
router.get('/', UserRoutes.obtenerUsers);
router.get('/all', UserRoutes.obtenerAllUsers);
router.get('/deleted', UserRoutes.obtenerDeletedUsers);
router.get('/type/:id', UserRoutes.obtenerUsersByType);
router.get('/:id', UserRoutes.obtenerUserById);
router.get('/company/:id', UserRoutes.obtenerUserByCompanyId);
router.get('/document/:document', UserRoutes.obtenerUserByDocument);
router.get('/email/:email', UserRoutes.obtenerUserByEmail);
// router.post('/', verifyToken, UserRoutes.altaUser);  //Comentada para no dejar publicada
router.put('/:id', verifyToken, UserRoutes.modificarUserVal);
router.delete('/:id', verifyToken, UserRoutes.eliminarUser);

module.exports = router;