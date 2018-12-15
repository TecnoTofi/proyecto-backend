//Incluimos modulo express para el manejo HTTP
const express = require('express');
//Creamos el router
const router = express.Router();

const CompanyRoutes = require('./routes');

//Todas las rutas empiezan con /api/company

//Obtener todas las empresas
router.get('/', CompanyRoutes.getCompanies);
router.get('/test', CompanyRoutes.getAllForList);
//Obtener una compania por id
router.get('/:id',CompanyRoutes.getOneCompany);

module.exports = router;