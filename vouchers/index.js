//Incluimos modulo express para el manejo HTTP
const express = require('express');
//Creamos el router
const router = express.Router();

const VoucherRoutes = require('./routes');
const { verifyToken } = require('../auth/routes');

//Todas las rutas empiezan con /api/voucher

//Endpoints
router.get('/', verifyToken, VoucherRoutes.obtenerVoucher);
router.get(/^\/voucherCompany$/, verifyToken, VoucherRoutes.obtenerVoucherCompany);
router.get('/:id', verifyToken, VoucherRoutes.obtenerVoucherById);
router.get('/code/:code', verifyToken, VoucherRoutes.obtenerVoucherByCode);
router.post('/', verifyToken, VoucherRoutes.altaVoucherVal);
router.get('/voucherCompany/:id', verifyToken, VoucherRoutes.obtenerVoucherCompanyById);
router.get('/company/:companyId/voucher/:voucherId', verifyToken, VoucherRoutes.obtenerVoucherCompanyByCompanyIdByVoucher);
router.post('/voucherCompany', verifyToken, VoucherRoutes.altaVoucherCompanyVal);

module.exports = router;