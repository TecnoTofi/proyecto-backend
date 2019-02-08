//Importamos conexion a DataBase
const knex = require('../db/connection');

//Exportamos queries
module.exports ={
    //Queries de productos
    products: {
        getAll: function(){
            return knex.select().table('Product').where('deleted', null);
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
        getByCategoryId(categoryId){
            return knex.raw('select p.id, p.code, p.name , p."imagePath", p."imageName", p.deleted, p.created from "Product" p , "ProductCategory" c where c."categoryId" = ? and c."productId" = p.id',
            [categoryId]);
        },
        getNotAssociated: function(id){
            return knex.raw('select p.id, p.code, p.name , p."imagePath", p."imageName", p.created, p.deleted from "Product" p where p.id not in (select "productId" from "CompanyProduct" where "companyId" = ?)',
            [id]);
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
        },
        deleteRollback: function(id){
            return knex('Product').where('id', id).del();
        }
    },
    //Queries de categorias de producto
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
    //Queries de productos de compania
    companyProduct: {
        getCompanyProducts: function(){
            return knex.raw('select pc.id, p.id "productId", p.code, pc."companyId", pc.name, pc.description, pc.stock, pc."imagePath", pc."imageName", pc.created, pc.deleted, (select price from "ProductPrice" where "productId" = pc.id order by "validDateFrom" desc limit 1) "price", (select id from "ProductPrice" where "productId" = pc.id order by "validDateFrom" desc limit 1) "priceId"  from "Product" p , "CompanyProduct" pc where pc."productId" = p.id and pc.deleted is null');
        },
        getAll: function(){
            return knex.raw('select pc.id, p.id "productId", p.code, pc."companyId", pc.name, pc.description, pc.stock, pc."imagePath", pc."imageName", pc.created, pc.deleted, (select price from "ProductPrice" where "productId" = pc.id order by "validDateFrom" desc limit 1) "price", (select id from "ProductPrice" where "productId" = pc.id order by "validDateFrom" desc limit 1) "priceId"  from "Product" p , "CompanyProduct" pc where pc."productId" = p.id');
        },
        getDeleted: function(){
            return knex.raw('select pc.id, p.id "productId", p.code, pc."companyId", pc.name, pc.description, pc.stock, pc."imagePath", pc."imageName", pc.created, pc.deleted, (select price from "ProductPrice" where "productId" = pc.id order by "validDateFrom" desc limit 1) "price", (select id from "ProductPrice" where "productId" = pc.id order by "validDateFrom" desc limit 1) "priceId"  from "Product" p , "CompanyProduct" pc where pc."productId" = p.id and pc.deleted is not null');
        },
        getOneById: function(id, deleted){
            return knex.raw(`select pc.id, p.id "productId", p.code, pc."companyId", pc.name, pc.description, pc.stock, pc."imagePath", pc."imageName", pc.created, pc.deleted, (select price from "ProductPrice" where "productId" = pc.id order by "validDateFrom" desc limit 1) "price", (select id from "ProductPrice" where "productId" = pc.id order by "validDateFrom" desc limit 1) "priceId"  from "Product" p , "CompanyProduct" pc where pc."productId" = p.id and pc.deleted ${deleted ? 'is' : 'is not'} null and pc.id = ?`,
            [id]);
        },
        getOneByIdList: function(id){
            return knex.raw('select p.id, p.code, p.deleted, p.created, pc."companyId", pc.name, pc.description, pc.stock, pc."imagePath", pc."imageName", pc.created, pc.deleted,c.id, c.price, c."validDateFrom" from "Product" p , "ProductPrice" c , "CompanyProduct" pc where pc.id = ? and  c."productId" = pc.id and pc."productId" = p.id',
            [id]);
        },
        getAllByCompany: function(id){
            return knex.raw('select pc.id, p.id "productId", p.code, pc."companyId", pc.name, pc.description, pc.stock, pc."imagePath", pc."imageName", pc.created, pc.deleted, (select price from "ProductPrice" where "productId" = pc.id order by "validDateFrom" desc limit 1) "price", (select id from "ProductPrice" where "productId" = pc.id order by "validDateFrom" desc limit 1) "priceId"  from "Product" p , "CompanyProduct" pc where pc."productId" = p.id and pc."companyId" = ?',
            [id]);
        },
        getByCompany: function(id){
            return knex.raw('select pc.id, p.id "productId", p.code, pc."companyId", pc.name, pc.description, pc.stock, pc."imagePath", pc."imageName", pc.created, pc.deleted, (select price from "ProductPrice" where "productId" = pc.id order by "validDateFrom" desc limit 1) "price", (select id from "ProductPrice" where "productId" = pc.id order by "validDateFrom" desc limit 1) "priceId"  from "Product" p , "CompanyProduct" pc where pc."productId" = p.id and pc.deleted is null and pc."companyId" = ?',
            [id]);
        },
        getDeleteByCompany: function(id){
            return knex.raw('select pc.id, p.id "productId", p.code, pc."companyId", pc.name, pc.description, pc.stock, pc."imagePath", pc."imageName", pc.created, pc.deleted, (select price from "ProductPrice" where "productId" = pc.id order by "validDateFrom" desc limit 1) "price", (select id from "ProductPrice" where "productId" = pc.id order by "validDateFrom" desc limit 1) "priceId"  from "Product" p , "CompanyProduct" pc where pc."productId" = p.id and pc.deleted is not null and pc."companyId" = ?',
            [id]);
        },
        getByProduct: function(id){
            return knex.raw('select pc.id, p.id "productId", p.code, pc."companyId", pc.name, pc.description, pc.stock, pc."imagePath", pc."imageName", pc.created, pc.deleted, (select price from "ProductPrice" where "productId" = pc.id order by "validDateFrom" desc limit 1) "price", (select id from "ProductPrice" where "productId" = pc.id order by "validDateFrom" desc limit 1) "priceId" from "Product" p , "CompanyProduct" pc where pc."productId" = p.id and p.id = ? and pc.deleted is null',
            [id]);
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
        getOneByProductByCompany: function(idComp, idProd){
            return knex.raw('select pc.id, p.code, pc."companyId", p.id "productId", pc.name, pc.description, pc.stock, pc."imagePath", pc."imageName", pc.created, pc.deleted from "Product" p, "CompanyProduct" pc where pc."companyId" = ? and  pc."productId" = ? and p.id = pc."productId"',
            [idComp,idProd]);
        },
        getByCompanyByCategory: function(companyId, categoryId){
            return knex.raw('select c.id, c."companyId", c."productId", (select price from "ProductPrice" where "productId" = c.id order by "validDateFrom" desc limit 1) "price" from "CompanyProduct" c where "companyId" = ? and "productId" in (select "productId" from "ProductCategory" where "categoryId" = ?)',
            [companyId, categoryId]);
        },
        getByPackageNonDeleted(productId, companyId){
            return knex.raw('select * from "PackageProduct" where "productId" = ? and "packageId" in (select id from "Package" where "companyId" = ? and deleted is null)',
            [productId, companyId]);
        },
        insert: function(product){
            return knex('CompanyProduct').insert(product).returning('id');
        },
        modify: function(id, product){
            return knex('CompanyProduct').where('id', id).update(product);
        },
        delete: function(id, date){
            console.log(`Enviando Query DELETE a companyProduct`);
            return knex('CompanyProduct').where('id', id).update('deleted', date);
        }        
    },
    //Queries de precios de productos
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