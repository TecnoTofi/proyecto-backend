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
        getByDate: function(dateFrom, dateTo){
            return knex.select().table('Pedido').where('timestamp', '>=', dateFrom).andWhere('timestamp', '<=', dateTo);
        },
        getByDateByUser: function(id, dateFrom, dateTo){
            return knex.select().table('Pedido').where('userId', id).andWhere('timestamp', '>=', dateFrom).andWhere('timestamp', '<=', dateTo);
        },
        insert: function(pedido){
            return knex('Pedido').insert(pedido).returning('id');
        },
        delete: function(id){
            return knex('Pedido').where('id', id).del();
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
            return knex.select('transactionId').table('PedidoTransaction').where('pedidoId', pedidoId);
        },
        insert: function(transaction){
            return knex('Transaction').insert(transaction).returning('id');
        },
        delete: function(id){
            return knex('Transaction').where('id', id).del();
        }
    },
    transactionProducts: {
        getAll: function(){
            return knex.select().table('TransactionProduct');
        },
        getOneById: function(id){
            return knex.select().table('TransactionProduct').where('id', id).first();
        },
        getByTransaction: function(transactionId){
            return knex.select('productId', 'quantity', 'priceId').table('TransactionProduct').where('transactionId', transactionId);
        },
        insert: function(transactionProduct){
            return knex('TransactionProduct').insert(transactionProduct).returning('id');
        },
        delete: function(id){
            return knex('TransactionProduct').where('id', id).del();
        }
    },
    transactionPackages: {
        getAll: function(){
            return knex.select().table('TransactionPackage');
        },
        getOneById: function(id){
            return knex.select().table('TransactionPackage').where('id', id).first();
        },
        getByTransaction: function(transactionId){
            return knex.select('packageId', 'quantity', 'priceId').table('TransactionPackage').where('transactionId', transactionId);
        },
        insert: function(transactionPackage){
            return knex('TransactionPackage').insert(transactionPackage).returning('id');
        },
        delete: function(id){
            return knex('TransactionPackage').where('id', id).del();
        }
    },
    pedidoTransaction: {
        insert: function(pedidoTransaction){
            return knex('PedidoTransaction').insert(pedidoTransaction).returning('id');
        },
        delete: function(id){
            return knex('PedidoTransaction').where('id', id).del();
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
        },
        delete: function(id){
            return knex('Delivery').where('id', id).del();
        }
    }
};