//Incluimos modulo express para el manejo HTTP
const express = require('express');
//Creamos el router
const router = express.Router();

const PedidoRoutes = require('./routes');
const { verifyToken } = require('../auth/routes');

//Todas las rutas empiezan con /api/pedido

//Endpoints
router.get('/', verifyToken, PedidoRoutes.obtenerPedidos);
router.get('/:id', verifyToken, PedidoRoutes.obtenerPedidoById);
router.get('/user/:id', verifyToken, PedidoRoutes.obtenerPedidosByUser);
router.get('/date/range', verifyToken, PedidoRoutes.obtenerPedidosByDate, );
router.get('/user/:id/date', verifyToken, PedidoRoutes.obtenerPedidosByDateByUser);
router.get('/user/:id/seller/:sellerId/date', verifyToken, PedidoRoutes.obtenerPedidosByDateByUserBySeller);
router.get('/user/:id/seller/:sellerId/date/estimado'/*, verifyToken*/, PedidoRoutes.obtenerPedidosByDateByUserBySellerEstimados);
router.post('/company/:id/masVendidos', verifyToken, PedidoRoutes.obtenerCincoProductosMasVendidos);
router.post('/company/:id/menosVendidos', verifyToken, PedidoRoutes.obtenerCincoProductosMenosVendidos);
router.get('/company/:id', verifyToken, PedidoRoutes.obtenerTransactionsByCompany);
router.post('/calcular', verifyToken, PedidoRoutes.calcularTotal);
router.post('/', verifyToken, PedidoRoutes.realizarPedido);

module.exports = router;