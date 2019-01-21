const express = require('express');
const router = express.Router();

const PedidoRoutes = require('./routes');
const { verifyToken } = require('../auth/routes');

//Todas las rutas empiezan con /api/pedido

router.get('/', verifyToken, PedidoRoutes.obtenerPedidos);
router.get('/:id', verifyToken, PedidoRoutes.obtenerPedidoById);
router.get('/user/:id', verifyToken, PedidoRoutes.obtenerPedidosByUser);
router.get('/date/range', verifyToken, PedidoRoutes.obtenerPedidosByDate, );
router.get('/user/:id/date', verifyToken, PedidoRoutes.obtenerPedidosByDateByUser);

router.get('/user/:id/:sellerId/date'/*, verifyToken*/, PedidoRoutes.obtenerPedidosByDateByUserBySeller);
router.get('/user/:id/:sellerId/date/estimado'/*, verifyToken*/, PedidoRoutes.obtenerPedidosByDateByUserBySellerEstimados);
router.get('/user/:id/masVendido'/*, verifyToken*/, PedidoRoutes.obtenerCincoProductosMasVendidos);
router.get('/user/:id/menosVendidos'/*, verifyToken*/, PedidoRoutes.obtenerCincoProductosMenosVendidos);

router.get('/:id/transactions', verifyToken, PedidoRoutes.obtenerTransactionsByPedido);
router.get('/:pedidoId/transaction/:transactionId', verifyToken, PedidoRoutes.obtenerTransactionById);
router.get('/transactions/date', verifyToken, PedidoRoutes.obtenerTransactionsByDate);
router.get('/company/:id', verifyToken, PedidoRoutes.obtenerTransactionsByCompany);
router.get('/company/:id/date', verifyToken, PedidoRoutes.obtenerTransactionsByDateByCompany);
router.get('/:pedidoId/transaction/:transactionId/products', verifyToken, PedidoRoutes.obtenerTransactionProductsByTransaction);
router.get('/:pedidoId/transaction/:transactionId/packages', verifyToken, PedidoRoutes.obtenerTransactionPackagesByTransaction);
router.get('/:id/delivery', verifyToken, PedidoRoutes.obtenerDeliveryByPedido);
router.post('/calcular', verifyToken, PedidoRoutes.calcularTotal);
router.post('/', verifyToken, PedidoRoutes.realizarPedido);

module.exports = router;