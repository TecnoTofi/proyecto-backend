const knex = require('../db/connection');

module.exports = {
    pedidos: {
        getAll: function(){
            return knex.select().table('Pedido');
        },
        getOneById: function(id){
            return knex.select().table('Pedido').where('id', id).first();
        },
        getByUser: function(userId){
            return knex.select().table('Pedido').where('userId', userId);
        },
        insert: function(pedido){
            return knex('Pedido').insert(pedido).returning('id');
        }
    },
    transactions: {
        getAll: function(){
            return knex.select().table('Transaction');
        },
        getOneById: function(id){
            return knex.select().table('Transaction').where('id', id).first();
        },
        getByPedido: function(pedidoId){
            return knex.select().table('Transaction').where('pedidoId', pedidoId);
        },
        insert: function(transaction){
            return knex('Transaction').insert(transaction).returning('id');
        }
    },
    transactionProducts: {
        getAll: function(){
            return knex.select().table('TransactionProducts');
        },
        getOneById: function(id){
            return knex.select().table('TransactionProducts').where('id', id).first();
        },
        getByTransaction: function(transactionId){
            return knex.select().table('TransactionProducts').where('transactionId', transactionId);
        },
        insert: function(transactionProduct){
            return knex('TransactionProducts').insert(transactionProduct).returning('id');
        }
    },
    deliveries: {
        getAll: function(){
            return knex.select().table('Delivery');
        },
        getOneById: function(id){
            return knex.select().table('Delivery').where('id', id).first();
        },
        getByTransaction: function(transactionId){
            return knex.select().table('Delivery').where('transactionId', transactionId);
        },
        insert: function(delivery){
            return knex('Delivery').insert(delivery).returning('id');
        }
    }
};