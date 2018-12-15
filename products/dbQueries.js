const knex = require('../db/connection');

module.exports ={
    categories: {
        getAll: function(){
            return knex.select().table('Category');
        },
        getOneById: function(id){
            return knex.select().table('Category').where('id', id).first();
        },
        getOneByName: function(name){
            return knex.select().table('Category').where('name', name).first();
        },
        insert: function(category){
            return knex('Category').insert(category).returnning('id');
        },
        modify: function(id, name){
            return knex('Category').where('id', id).update('name', name);
        },
        delete: function(id){
            return knex('Category').where('id', id).del();
        }
    },
    products: {
        getAll: function(){
            return knex.select().table('Product');
        },
        getOneById: function(id){
            return knex.select().table('Product').where('id', id).first();
        },
        getOneByCode: function(code){
            return knex.select().table('Product').where('code', code).first();
        },
        getByName: function(name){
            return knex.select().table('Product').where('name', name);
        },
        getAllForGenericList: function(){
            return knex.raw('select p.id, p.code, p."name", p."imageName", p."imagePath", pc."categoryId", c."name" from "Product" p, "ProdCategory" pc, "ProductCategory" c where p.id = pc."productId" and pc."categoryId" = c.id order by p.id');
        },
        insert: function(product){
            return knex('Product').insert(product).returning('id');
        },
        modify: function(id, product){
            return knex('Product').where('id', id).update(product);
        },
        delete: function(id){
            return knex('Product').where('id', id).del();
        }
    },
    prodCategory: {
        getAll: function(){
            return knex.select().table('ProductCategory');
        },
        getByProductId: function(id){
            return knex.select().table('ProductCategory').where('productId', id);
        },
        getByProdIdName: function(id){
            return knex.raw('select c.id, c.name from "ProductCategory" p, "Category" c where p."productId" = ? and p."categoryId" = c.id',
            [id]);
        },
        getByCategoryId: function(id){
            return knex.select().table('ProductCategory').where('categoryId', id);
        },
        insert: function(prodCategory){
            return knex('ProductCategory').insert(prodCategory).returning('id');
        },
        delete: function(id){
            return knex('ProductCategory').where('id', id).del();
        }
    },
    companyProduct: {
        getAll: function(){
            return knex.select().table('CompanyProduct');
        },
        getOneById: function(id){
            return knex.select().table('CompanyProduct').where('id', id).first();
        },
        getByCompany: function(companyId){
            return knex.select().table('CompanyProduct').where('companyId', companyId);
            //'select p.id, p.code, cp."name", cp.description, cp.price, cp.stock, cp."imageName", cp."imagePath", pc."categoryId", c."name", cp."companyId" from "Product" p, "ProdCategory" pc, "ProductCategory" c, "CompanyProduct" cp where p.id = pc."productId" and pc."categoryId" = c.id order by p.id'
            // return knex.raw('select cp.id, p.code, cp."name", cp.price, cp.stock from "CompanyProduct" cp, "Product" p where cp."productId" = p.id and cp."companyId" = ? order by cp."name", p.code, cp.price, cp.stock',
            // [companyId]);
            // return knex.raw('select cp.id, p.code, cp."name", cp.description, cp.price, cp.stock, cp."imageName", cp."imagePath" from "CompanyProduct" cp, "Product" p where cp."productId" = p.id and cp."companyId" = ? order by cp."name", p.code, cp.price, cp.stock',
            // [companyId]);
        },
        getByProduct: function(productId){
            return knex.select().table('CompanyProduct').where('productId', productId);
        },
        getByName: function(name){
            return knex.select().table('CompanyProduct').where('name', name);
        },
        getByPriceRange(min, max){
            return knex.select().table('CompanyProduct').whereBetween('price', [min, max]);
        },
        getByStockRange(min, max){
            return knex.select().table('CompanyProduct').whereBetween('stock', [min, max]);
        },
        insert: function(product){
            return knex('CompanyProduct').insert(product).returning('id');
        },
        modify: function(id, product){
            // return knex.raw(`update "CompanyProduct" set "companyId" = ${product.companyId}, "productId" = ${product.productId}, "name" = ${product.name}, description = ${product.description}, price = ${product.price}, stock = ${product.stock}, "imagePath" = ${product.imagePath}, "imageName" = ${product.imageName} where id = ${id};`);
            return knex('CompanyProduct').where('id', id).update(product);
        },
        delete: function(id){
            return knex('CompanyProduct').where('id', id).del();
        }
    }
};