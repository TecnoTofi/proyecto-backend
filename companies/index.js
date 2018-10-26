//Incluimos modulo express para el manejo HTTP
const express = require('express');
//Creamos el router
const router = express.Router();

const CompanyRoutes = require('./routes');
const VerifyToken = require('../auth/verifyToken');

//Todas las rutas empiezan con /api/company

//Ruta para obtener el listado de companyCategory
router.get('/category', CompanyRoutes.getCategories);
router.get('/', CompanyRoutes.getCompanies);
router.post('/', CompanyRoutes.insertCompany);

module.exports = router;