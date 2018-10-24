//Incluimos modulo express para el manejo HTTP
const express = require('express');
//Creamos el router
const router = express.Router();

const CompanyRoutes = require('./routes');
const VerifyToken = require('../auth/verifyToken');

//Todas las rutas empiezan con /api/companies

//Ruta para obtener el listado de companyCategory
router.get('/types', CompanyRoutes.categories);
router.get('/', VerifyToken, CompanyRoutes.companies);

module.exports = router;