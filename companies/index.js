//Incluimos modulo express para el manejo HTTP
const express = require('express');
//Creamos el router
const router = express.Router();

const CompanyRoutes = require('./routes');

//Todas las rutas empiezan con /api/company

//Ruta para obtener el listado de companyCategory
router.get('/category', CompanyRoutes.getCategories);
router.get('/', CompanyRoutes.getCompanies);

module.exports = router;