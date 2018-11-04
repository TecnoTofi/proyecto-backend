//Incluimos modulo express para el manejo HTTP
const express = require('express');
//Creamos el router
const router = express.Router();

const ProductRoutes = require('./routes');
const { verifyToken } = require('../auth/routes');

//Todas las rutas empiezan con /api/product

router.get('/category', ProductRoutes.getCategories);
router.get('/', ProductRoutes.getProducts);
router.post('/', verifyToken, ProductRoutes.insertProduct);
router.post('/company', verifyToken, ProductRoutes.insertCompanyProduct);

module.exports = router;