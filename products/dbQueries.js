const knex = require('../db/connection');

module.exports ={
    categories: {
        getAll: function(){
            return knex.select().table('ProductCategory');
        },
        getOneById: function(id){
            return knex.select().table('ProductCategory').where('id', id).first();
        },
        getOneByName: function(name){
            return knex.select().table('ProductCategory').where('name', name).first();
        },
        insert: function(category){
            return knex('ProductCategory').insert(category).returnning('id');
        },
        modify: function(id, name){
            return knex('ProductCategory').where('id', id).update('name', name);
        },
        delete: function(id){
            return knex('ProductCategory').where('id', id).del();
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
        getByCategory(categoryId){
            return knex.select().table('Product').where('category', categoryId);
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
    companyProduct: {
        getAll: function(){
            return knex.select().table('CompanyProduct');
        },
        getOneById: function(id){
            return knex.select().table('CompanyProduct').where('id', id).first();
        },
        getByCompany: function(companyId){
            return knex.select().table('CompanyProduct').where('companyId', companyId);
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
            return knex('CompanyProduct').where('id', id).update(product);
        },
        delete: function(id){
            return knex('CompanyProduct').where('id', id).del();
        }
    }
};