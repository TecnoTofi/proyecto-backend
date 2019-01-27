//Incluimos modulo express para el manejo HTTP
const express = require('express');
//Creamos el router
const router = express.Router();

const HelperRoutes = require('./routes');
const { verifyToken } = require('../auth/routes');

//Todas las rutas empiezan con /api/helper

//Endpoints

//Categorias
router.get('/category', HelperRoutes.obtenerCategories);
router.get('/category/:id', HelperRoutes.obtenerCategoryById);
router.post('/category', verifyToken, HelperRoutes.altaCategory);
// router.put('/category/:id', verifyToken, HelperRoutes.modificarCategory); //Comentada para no dejar publicada
// router.delete('/category/:id', verifyToken, HelperRoutes.eliminarCategory); //Comentada para no dejar publicada

//Rubros
router.get('/rubro', HelperRoutes.obtenerRubros);
router.get('/rubro/:id', HelperRoutes.obtenerRubroById);
router.post('/rubro', verifyToken, HelperRoutes.altaRubro);
// router.put('/rubro/:id', verifyToken, HelperRoutes.modificarRubro); //Comentada para no dejar publicada
// router.delete('/rubro/:id', verifyToken, HelperRoutes.eliminarRubro); //Comentada para no dejar publicada

//Tipos
router.get('/type', HelperRoutes.obtenerTypes);
router.get('/type/signup', HelperRoutes.obtenerTypesSignUp);
router.get('/type/:id', HelperRoutes.obtenerTypeById);
router.post('/type', verifyToken, HelperRoutes.altaType);
// router.put('/type/:id', verifyToken, HelperRoutes.modificarType); //Comentada para no dejar publicada
// router.delete('/type/:id', verifyToken, HelperRoutes.eliminarType); //Comentada para no dejar publicada

module.exports = router;