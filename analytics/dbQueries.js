//Importamos conexion a DataBase
const knex = require('../db/connection');

//Exportamos queries
module.exports = {
    //Queries de usuarios
    usuarios: {
        getSignUpsPorFecha: function(dateTo, dateFrom){
            return knex.raw('select count(*) from "User" where created >= ? and created <= ?',
            [dateTo, dateFrom])
        },
        getLoginsPorFecha: function(dateTo, dateFrom){
            return knex.raw('select count(*) from "User" where "lastLogin" >= ? and "lastLogin" <= ?',
            [dateTo, dateFrom])
        },
    },
    //Queries de productos
    productos: {
        getRegistrosPorFecha: function(dateTo, dateFrom){
            return knex.raw('select count(*) from "Product" where created >= ? and created <= ?',
            [dateTo, dateFrom])
        },
    },
    //Queries de paquetes
    paquetes: {
        getRegistrosPorFecha: function(dateTo, dateFrom){
            return knex.raw('select count(*) from "Package" where created >= ? and created <= ?',
            [dateTo, dateFrom])
        },
    },
    //Queries de pedidos
    pedidos: {
        getPedidosPorFecha: function(dateTo, dateFrom){
            return knex.raw('select count(*) from "Pedido" where "timestamp" >= ? and "timestamp" <= ?',
            [dateTo, dateFrom])
        },
        getTransactionsPorFecha: function(dateTo, dateFrom){
            return knex.raw('select count(*) from "Transaction" where "timestamp" >= ? and "timestamp" <= ?',
            [dateTo, dateFrom])
        },
        getProductsPorFecha: function(dateTo, dateFrom){
            return knex.raw('select sum(quantity) from "TransactionProduct" where "transactionId" in (select id from "Transaction" where "timestamp" >= ? and "timestamp" <= ?)',
            [dateTo, dateFrom])
        },
        getPackagesPorFecha: function(dateTo, dateFrom){
            return knex.raw('select sum(quantity) from "TransactionPackage" where "transactionId" in (select id from "Transaction" where "timestamp" >= ? and "timestamp" <= ?)',
            [dateTo, dateFrom])
        },
    }
}