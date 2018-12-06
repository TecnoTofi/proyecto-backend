const express = require('express');
const router = express.Router();

const PedidoRoutes = require('./routes');
const { verifyToken } = require('../auth/routes');

//Todas las rutas empiezan con /api/pedido

//Realizar un pedido
router.post('/', PedidoRoutes.realizarPedido); //agregar validacion de token
//Obtener un pedido por ID
// router.get('/:id', PedidoRoutes.getPedidoById);
//Obtener pedidos de un usuario
// router.get('/user/:id', PedidoRoutes.getPedidosByUser);
//Obtener todos los pedidos de un usuario, con sus respectivas transacciones, produtos y paquetes
router.get('/user/:id', PedidoRoutes.getPedidos);
//Obtener transacciones por ID pedido
// router.get('/:id/transactions', PedidoRoutes.getTransactionsByPedidoId);
//Obtener productos por ID de transaccion
// router.get('/transaction/:id/products', PedidoRoutes.getProductsByTranId);
//Obtener paquetes por ID de transaccion
// router.get('/transactions/:id/packages', PedidoRoutes.getPackagesByTranId);

module.exports = router;