const express = require('express');
const router = express.Router();
const HelperRoutes = require('./routes');
const { verifyToken } = require('../auth/routes');

//Todas las rutas empiezan con /api/helper

//Categorias
router.get('/category', HelperRoutes.obtenerCategories);
router.get('/category/:id', HelperRoutes.obtenerCategoryById);
router.post('/category', verifyToken, HelperRoutes.altaCategoria);
// router.put('/category/:id', verifyToken, HelperRoutes.modificarCategoria);
// router.delete('/category/:id', verifyToken, HelperRoutes.eliminarCategoria);

//Rubros
router.get('/rubro', HelperRoutes.obtenerRubros);
router.get('/rubro/:id', HelperRoutes.obtenerRubroById);
router.post('/rubro', verifyToken, HelperRoutes.altaRubro);
// router.put('/rubro/:id', verifyToken, HelperRoutes.modificarRubro);
// router.delete('/rubro/:id', verifyToken, HelperRoutes.eliminarRubro);

//Tipos
router.get('/type', HelperRoutes.obtenerTypes);
router.get('/type/signup', HelperRoutes.obtenerTypesSignUp);
router.get('/type/:id', HelperRoutes.obtenerTypeById);
router.post('/type', verifyToken, HelperRoutes.altaType);
// router.put('/type/:id', verifyToken, HelperRoutes.modificarType);
// router.delete('/type/:id', verifyToken, HelperRoutes.eliminarType);

module.exports = router;