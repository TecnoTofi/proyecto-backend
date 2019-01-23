//Incluimos modulo express para el manejo HTTP
const express = require('express');
//Creamos el router
const router = express.Router();

//Todas las rutas empiezan con /api/analytics

const AnalyticsRoutes = require('./routes');
const { verifyToken } = require('../auth/routes');

router.get('/signups', AnalyticsRoutes.obtenerRegistrosPorMes);
router.get('/logins', AnalyticsRoutes.obtenerLoginsPorMes);
router.get('/products', AnalyticsRoutes.obtenerRegistroProductosPorMes);
router.get('/packages', AnalyticsRoutes.obtenerRegistroPaquetesPorMes);
router.get('/ventas/pedidos', AnalyticsRoutes.obtenerPedidosPorMes);
router.get('/ventas/transactions', AnalyticsRoutes.obtenerTransaccionesPorMes);
router.get('/ventas/products', AnalyticsRoutes.obtenerVentaProductosPorMes);
router.get('/ventas/packages', AnalyticsRoutes.obtenerVentaPaquetesPorMes);


module.exports = router;