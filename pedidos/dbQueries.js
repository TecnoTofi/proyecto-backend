//Importamos conexion a DataBase
const knex = require('../db/connection');

//Exportamos queries
module.exports = {
    //Queries de pedidos
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
    //Queries de transacciones
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
        getBySeller: function(id){
            return knex.select().table('Transaction').where('sellerId', id);
        },
        getByDate: function(dateFrom, dateTo){
            return knex.select().table('Transaction').where('timestamp', '>=', dateFrom).andWhere('timestamp', '<=', dateTo);
        },
        getByDateByCompany: function(id, dateFrom, dateTo){
            return knex.select().table('Transaction').where('sellerId', id).andWhere('timestamp', '>=', dateFrom).andWhere('timestamp', '<=', dateTo);
        },
        insert: function(transaction){
            return knex('Transaction').insert(transaction).returning('id');
        },
        delete: function(id){
            return knex('Transaction').where('id', id).del();
        }
    },
    //Queries de productos de transacciones
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
    //Queries de paquetes de transacciones
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
    //Queries de relacion transaccion - pedido
    pedidoTransaction: {
        insert: function(pedidoTransaction){
            return knex('PedidoTransaction').insert(pedidoTransaction).returning('id');
        },
        delete: function(id){
            return knex('PedidoTransaction').where('id', id).del();
        }
    },
    //Queries de deliveries
    deliveries: {
        getAll: function(){
            return knex.select().table('Delivery');
        },
        getOneById: function(id){
            return knex.select().table('Delivery').where('id', id).first();
        },
        getByTransaction: function(transactionId){
            return knex.select().table('Delivery').where('transactionId', transactionId).first();
        },
        insert: function(delivery){
            return knex('Delivery').insert(delivery).returning('id');
        },
        delete: function(id){
            return knex('Delivery').where('id', id).del();
        },
    },
    //Queries de reportes
    consultas:{
        getTopCincoProductosMasVendidosByCompany: function(idCompany, fecha){
            return knex.raw('SELECT tp."productId", p.code, c.name, SUM(quantity), c."imageName", c."imagePath" FROM "Transaction" t, "TransactionProduct" tp, "CompanyProduct" c, "Product" p WHERE tp."transactionId" = t.id and c.id = tp."productId" and p.id = c."productId" and t."sellerId" = ? and t."timestamp" > ? group by tp."productId", p.code, c.name, c."imageName", c."imagePath" order by SUM desc limit 5',
            [idCompany, fecha]);
        },
        getTopCincoProductosMenosVendidosByCompany: function(idCompany, fecha){
            return knex.raw('SELECT tp."productId", p.code, c.name, SUM(quantity), c."imageName", c."imagePath" FROM "Transaction" t, "TransactionProduct" tp, "CompanyProduct" c, "Product" p WHERE tp."transactionId" = t.id and c.id = tp."productId" and p.id = c."productId" and t."sellerId" = ? and t."timestamp" > ? group by tp."productId", p.code, c.name, c."imageName", c."imagePath" order by SUM asc limit 5',
            [idCompany, fecha]);
        },
        getTopCincoPaquetesMasVendidosByCompany: function(idCompany, fecha){
            return knex.raw('SELECT tp."packageId", p.code, p.name, SUM(quantity), p."imageName", p."imagePath" FROM "Transaction" t, "TransactionPackage" tp, "Package" p WHERE tp."transactionId" = t.id AND p.id = tp."packageId" AND t."sellerId" = ? AND t."timestamp" > ? group by tp."packageId", p.code, p.name, p."imageName", p."imagePath" order by SUM desc limit 5',
            [idCompany, fecha]);
        },
        getTopCincoPaquetesMenosVendidosByCompany: function(idCompany, fecha){
            return knex.raw('SELECT tp."packageId", p.code, p.name, SUM(quantity), p."imageName", p."imagePath" from "Transaction" t, "TransactionPackage" tp, "Package" p WHERE tp."transactionId" = t.id and p.id = tp."packageId" and t."sellerId" = ? and t."timestamp" > ? group by tp."packageId", p.code, p.name, p."imageName", p."imagePath" order by SUM asc limit 5',
            [idCompany, fecha]);
        },
        getRecomendacionPedidosPorFecha: function(fecha1, fecha2, userId){
            return knex.raw('SELECT cp.id, cp."companyId", cp."productId", cp.name, cp.description, cp.stock, cp.deleted, tp.quantity, tp."priceId",t.amount, t."sellerId",p."timestamp",p. "specialDiscount" FROM "TransactionProduct" tp, "Transaction" t,  "PedidoTransaction" pt, "Pedido" p,"CompanyProduct" cp , "ProductPrice" pp Where p.id = pt."pedidoId" and pt."transactionId" = t.id and t.id = tp."transactionId" and tp."productId" = cp.id and tp."priceId" = pp.id and p."userId" = ? and t."timestamp" > ? and p."timestamp" > ? and t."timestamp" < ? and p."timestamp" < ?',
            [userId, fecha1, fecha1, fecha2, fecha2]);
        },
        getRecomendacionPedidosPorFechaByCompany: function(fecha1, fecha2, userId, sellerId){
            return knex.raw('SELECT cp.id, cp."companyId", cp."productId", cp.name, cp.description, cp.stock, cp.deleted, tp.quantity, tp."priceId",t.amount, t."sellerId",p."timestamp",p. "specialDiscount" FROM "TransactionProduct" tp, "Transaction" t,  "PedidoTransaction" pt, "Pedido" p,"CompanyProduct" cp , "ProductPrice" pp Where p.id = pt."pedidoId" and pt."transactionId" = t.id and t.id = tp."transactionId" and tp."productId" = cp.id and tp."priceId" = pp.id and p."userId" = ? and t."sellerId" = ? and t."timestamp" > ? and p."timestamp" > ? and t."timestamp" < ? and p."timestamp" < ?',
            [userId, sellerId, fecha1, fecha1, fecha2, fecha2]);
        },
        getRecomendacionPedidoEstimadoByCompany: function(fecha1, fecha2, userId, sellerId){
            return knex.raw('SELECT cp.id, cp."companyId", cp."productId", cp.name, cp.description, cp.stock, cp.deleted, SUM(tp.quantity), tp."priceId", t."sellerId" FROM "TransactionProduct" tp, "Transaction" t,  "PedidoTransaction" pt, "Pedido" p,"CompanyProduct" cp , "ProductPrice" pp Where p.id = pt."pedidoId" and pt."transactionId" = t.id and t.id = tp."transactionId" and tp."productId" = cp.id and tp."priceId" = pp.id and p."userId" = ? and t."sellerId" = ? and t."timestamp" > ? and p."timestamp" > ? and t."timestamp" < ? and p."timestamp" < ? group by cp.id, cp."companyId", cp."productId", cp.name, cp.description, cp.stock, cp.deleted,tp."priceId", t."sellerId"',
            [userId, sellerId, fecha1, fecha1, fecha2, fecha2]);
        },
        getRecomendacionPedidoEstimado: function(fecha1, fecha2, userId){
            console.log(fecha1, fecha2, userId)
                return knex.raw('SELECT cp.id, cp."companyId", cp."productId", cp.name, cp.description, cp.stock, cp.deleted, SUM(tp.quantity), tp."priceId", t."sellerId" FROM "TransactionProduct" tp, "Transaction" t,  "PedidoTransaction" pt, "Pedido" p,"CompanyProduct" cp , "ProductPrice" pp Where p.id = pt."pedidoId" and pt."transactionId" = t.id and t.id = tp."transactionId" and tp."productId" = cp.id and tp."priceId" = pp.id and p."userId" = ? and t."timestamp" > ? and t."timestamp" < ? group by cp.id, cp."companyId", cp."productId", cp.name, cp.description, cp.stock, cp.deleted,tp."priceId", t."sellerId"',
                [userId, fecha1, fecha2]);
        },
    }
};