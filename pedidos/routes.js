const Joi = require('joi');
const queries = require('./dbQueries');
const { reducirStock } = require('../products/routes');

function realizarPedido(req, res){
    console.log('realizar pedido');
    reducirStock(1, 2);
    res.json({message: 'OK'});
}

function getPedidoById(req, res){
    console.log('getPedidoById');
    res.json({message: 'OK'});
}

function getPedidoByUser(req, res){
    console.log('getPedidoByUser');
    res.json({message: 'OK'});
}

function getTransactionsByPedidoId(req, res){
    console.log('getTransactionsByPedidoId');
    res.json({message: 'OK'});
}

module.exports = {
    realizarPedido,
    getPedidoById,
    getPedidoByUser,
    getTransactionsByPedidoId
}