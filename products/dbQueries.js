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
            return knex.select().table('Product').where('name', name).first();
        },
        getAllForGenericList: function(){
            return knex.raw('select p.id, p.code, p."name", p."imageName", p."imagePath", pc."categoryId", c."name" from "Product" p, "ProdCategory" pc, "ProductCategory" c where p.id = pc."productId" and pc."categoryId" = c.id order by p.id');
        },
        getByCategoryId(categoryId){
            return knex.raw('select p.id, p.code, p.name , p."imagePath", p."imageName", p.deleted, p.created from "Product" p , "ProductCategory" c where c."categoryId" = ? and c."productId" = p.id',[categoryId]);
        },
        insert: function(product){
            return knex('Product').insert(product).returning('id');
        },
        modify: function(id, product){
            return knex('Product').where('id', id).update(product);
        },
        delete: function(id,date){
            console.log(`Enviando Query DELETE a Product`);
            return knex('Product').where('id', id).update('deleted', date);
        }

    },
    prodCategory: {
        getAll: function(){
            return knex.select().table('ProductCategory');
        },
        getByProductId: function(id){
            return knex.select('categoryId').table('ProductCategory').where('productId', id);
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

        getCompanyProducts: function(){
            // return knex.select().table('CompanyProduct').where('deleted', null);
            return knex.raw('select pc.id, p.id "productId", p.code, pc."companyId", pc.name, pc.description, pc.stock, pc."imagePath", pc."imageName", pc.created, pc.deleted, (select price from "ProductPrice" where "productId" = pc.id order by "validDateFrom" desc limit 1) "price", (select id from "ProductPrice" where "productId" = pc.id order by "validDateFrom" desc limit 1) "priceId"  from "Product" p , "CompanyProduct" pc where pc."productId" = p.id and pc.deleted is null');
        },
        getAll: function(){
            // return knex.select().table('CompanyProduct');
            return knex.raw('select pc.id, p.id "productId", p.code, pc."companyId", pc.name, pc.description, pc.stock, pc."imagePath", pc."imageName", pc.created, pc.deleted, (select price from "ProductPrice" where "productId" = pc.id order by "validDateFrom" desc limit 1) "price", (select id from "ProductPrice" where "productId" = pc.id order by "validDateFrom" desc limit 1) "priceId"  from "Product" p , "CompanyProduct" pc where pc."productId" = p.id');
        },
        getDeleted: function(){
            // return knex.select().table('CompanyProduct').whereNotNull('deleted');
            return knex.raw('select pc.id, p.id "productId", p.code, pc."companyId", pc.name, pc.description, pc.stock, pc."imagePath", pc."imageName", pc.created, pc.deleted, (select price from "ProductPrice" where "productId" = pc.id order by "validDateFrom" desc limit 1) "price", (select id from "ProductPrice" where "productId" = pc.id order by "validDateFrom" desc limit 1) "priceId"  from "Product" p , "CompanyProduct" pc where pc."productId" = p.id and pc.deleted is not null');
        },
        getOneById: function(id){
            return knex.select().table('CompanyProduct').where('id', id).first();
        },
        getOneByIdList: function(id){
            return knex.raw('select p.id, p.code, p.deleted, p.created, pc."companyId", pc.name, pc.description, pc.stock, pc."imagePath", pc."imageName", pc.created, pc.deleted,c.id, c.price, c."validDateFrom" from "Product" p , "ProductPrice" c , "CompanyProduct" pc where pc.id = ? and  c."productId" = pc.id and pc."productId" = p.id',
            [id]);
        },
        getAllByCompany: function(id){
            // return knex.select().table('CompanyProduct').where('companyId', id);
            return knex.raw('select pc.id, p.id "productId", p.code, pc."companyId", pc.name, pc.description, pc.stock, pc."imagePath", pc."imageName", pc.created, pc.deleted, (select price from "ProductPrice" where "productId" = pc.id order by "validDateFrom" desc limit 1) "price", (select id from "ProductPrice" where "productId" = pc.id order by "validDateFrom" desc limit 1) "priceId"  from "Product" p , "CompanyProduct" pc where pc."productId" = p.id and pc."companyId" = ?',
            [id]);
        },
        getByCompany: function(id){
            // return knex.select().table('CompanyProduct').where('companyId', id).whereNull('deleted');
            return knex.raw('select pc.id, p.id "productId", p.code, pc."companyId", pc.name, pc.description, pc.stock, pc."imagePath", pc."imageName", pc.created, pc.deleted, (select price from "ProductPrice" where "productId" = pc.id order by "validDateFrom" desc limit 1) "price", (select id from "ProductPrice" where "productId" = pc.id order by "validDateFrom" desc limit 1) "priceId"  from "Product" p , "CompanyProduct" pc where pc."productId" = p.id and pc.deleted is null and pc."companyId" = ?',
            [id]);
        },
        getDeleteByCompany: function(id){
            // return knex.select().table('CompanyProduct').where('companyId', id).whereNotNull('deleted');
            return knex.raw('select pc.id, p.id "productId", p.code, pc."companyId", pc.name, pc.description, pc.stock, pc."imagePath", pc."imageName", pc.created, pc.deleted, (select price from "ProductPrice" where "productId" = pc.id order by "validDateFrom" desc limit 1) "price", (select id from "ProductPrice" where "productId" = pc.id order by "validDateFrom" desc limit 1) "priceId"  from "Product" p , "CompanyProduct" pc where pc."productId" = p.id and pc.deleted is not null and pc."companyId" = ?',
            [id]);
        },
        getByProduct: function(id){
            return knex.select().table('CompanyProduct').where('productId', id);
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
        getAllForList(){
            return knex.raw('select p.id, p.code, p.deleted, p.created, pc."companyId", pc.name, pc.description, pc.stock, pc."imagePath", pc."imageName", pc.created, pc.deleted,c.id, c.price, c."validDateFrom" from "Product" p , "ProductPrice" c , "CompanyProduct" pc where c."productId" = pc."productId" and c."productId" = p.id and pc."productId" = p.id');
        },
        getAllForListHabilitados(){
            return knex.raw('select pc.id, p.code, pc."companyId", pc.name, pc.description, pc.stock, pc."imagePath", pc."imageName", pc.created, pc.deleted, c.id "priceId", c.price from "Product" p, "ProductPrice" c, "CompanyProduct" pc where c."productId" = pc.id and pc."productId" = p.id and pc.deleted is null and c.id in (select id from "ProductPrice" group by id order by "validDateFrom" desc limit 1);');
        },
        getAllForListDeleted(){
            return knex.raw('select p.id, p.code, p.deleted, p.created, pc."companyId", pc.name, pc.description, pc.stock, pc."imagePath", pc."imageName", pc.created, pc.deleted,c.id, c.price, c."validDateFrom" from "Product" p , "ProductPrice" c , "CompanyProduct" pc where c."productId" = pc.id and pc."productId" = p.id and  pc.deleted is not null');
        },

        getAllForListByCompany(id){
            return knex.raw('select p.id, p.code, p.deleted, p.created, pc."companyId", pc.name, pc.description, pc.stock, pc."imagePath", pc."imageName", pc.created, pc.deleted,c.id, c.price, c."validDateFrom" from "Product" p , "ProductPrice" c , "CompanyProduct" pc where pc."companyId" = ? and  c."productId" = pc.id and pc."productId" = p.id',
            [id]);
        },
        getForListHabilitadosByCompany(id){
            return knex.raw('select p.id, p.code, p.deleted, p.created, pc."companyId", pc.name, pc.description, pc.stock, pc."imagePath", pc."imageName", pc.created, pc.deleted,c.id, c.price, c."validDateFrom" from "Product" p , "ProductPrice" c , "CompanyProduct" pc where pc."companyId" = ? and  c."productId" = pc.id and pc."productId" = p.id and  pc.deleted  is null',
            [id]);
        },
        getForDeleteListByCompany(id){
            return knex.raw('select p.id, p.code, p.deleted, p.created, pc."companyId", pc.name, pc.description, pc.stock, pc."imagePath", pc."imageName", pc.created, pc.deleted,c.id, c.price, c."validDateFrom" from "Product" p , "ProductPrice" c , "CompanyProduct" pc where pc."companyId" = ? and  c."productId" = pc.id and pc."productId" = p.id and pc.deleted  is not null',
            [id]);
        },
        insert: function(product){
            return knex('CompanyProduct').insert(product).returning('id');
        },
        modify: function(id, product){
            // return knex.raw(`update "CompanyProduct" set "companyId" = ${product.companyId}, "productId" = ${product.productId}, "name" = ${product.name}, description = ${product.description}, price = ${product.price}, stock = ${product.stock}, "imagePath" = ${product.imagePath}, "imageName" = ${product.imageName} where id = ${id};`);
            return knex('CompanyProduct').where('id', id).update(product);
        },
        delete: function(id,date){
            console.log(`Enviando Query DELETE a companyProduct`);
            return knex('CompanyProduct').where('id', id).update('deleted', date);
        }
    },
    prices: {
        getOneById: function(id){
            return knex.select().table('ProductPrice').where('id', id).first();
        },
        getCurrent: function(prodId){
            return knex.raw('select * from "ProductPrice" where "productId" = ? order by "validDateFrom" desc limit 1',
            [prodId]);
        },
        getLast: function(prodId){
            return knex.raw('select * from "ProductPrice" where "productId" = ? order by "validDateFrom" desc limit 2',
            [prodId]);
        },
        insert: function(price){
            return knex('ProductPrice').insert(price).returning('id');
        }
    }
};