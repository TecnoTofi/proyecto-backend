const express = require('express');
const router = express.Router();

const PedidoRoutes = require('./routes');
const { verifyToken } = require('../auth/routes');

//Todas las rutas empiezan con /api/pedido

//Realizar un pedido
router.post('/', verifyToken, PedidoRoutes.realizarPedido);
//Obtener un pedido por ID
router.get('/:id', PedidoRoutes.getPedidoById);
//Obtener pedidos de un usuario
router.get('/user/:id', PedidoRoutes.getPedidoByUser);
//Obtener transacciones por ID pedido
router.get('/:id/transactions', PedidoRoutes.getTransactionsByPedidoId);

module.exports = router;