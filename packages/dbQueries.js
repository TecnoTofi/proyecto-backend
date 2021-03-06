//Importamos conexion a DataBase
const knex = require('../db/connection');

//Exportamos queries
module.exports = {
    //Queries de paquetes
    packages: {
        getPackages: function() {
            return knex.select().table('Package').where('deleted', null);
        },
        getAll: function(){
            return knex.select().table('Package');
        },
        getDeleted: function(){
            return knex.select().table('Package').whereNotNull('deleted');
        },
        getAllHabilitados: function(){
            return knex.select().table('Package').whereNull('deleted');
        },
        getAllForList(){
            return knex.raw('select p.id, p.description, p."companyId" , p."imagePath", p."imageName", p.deleted, p.created, p.code ,p.stock, c.price,c."validDateFrom" from "Package" p , "PackagePrice" c where c."packageId" = p."id"');
        },
        getAllForListHabilitados(){
            return knex.raw('select p.id, p.description, p."companyId" , p."imagePath", p."imageName", p.deleted, p.created, p.code ,p.stock, c.price,c."validDateFrom" from "Package" p , "PackagePrice" c where c."packageId" = p."id" and p.deleted  is null');
        },
        getAllForListDeleted(){
            return knex.raw('select p.id, p.description, p."companyId" , p."imagePath", p."imageName", p.deleted, p.created, p.code ,p.stock, c.price,c."validDateFrom" from "Package" p , "PackagePrice" c where c."packageId" = p."id" and p.deleted  is not null ');
        },
        getOneById: function(id){
            return knex.select().table('Package').where('id', id).first();
        },
        getOneByIdList: function(id){
            return knex.raw('select p.id, p.description, p."companyId" , p."imagePath", p."imageName", p.deleted, p.created, p.code ,p.stock, c.price,c."validDateFrom" from "Package" p , "PackagePrice" c where p.id = ?  c."packageId" = p."id"',
            [id]);
        },
        getOneByCode: function(code){
            return knex.select().table('Package').where('code', code).first();
        },
        getOneByCodeList: function(code){
            return knex.raw('select p.id, p.description, p."companyId" , p."imagePath", p."imageName", p.deleted, p.created, p.code ,p.stock, c.price,c."validDateFrom" from "Package" p , "PackagePrice" c where p.code = ?  c."packageId" = p."id"',
            [code]);
        },
        getByCompany: function(id){
            return knex.raw('select p.id, p.code, p."name", p.description, p."companyId", p.stock, p."imageName", p."imagePath", p.created, p.deleted, (select price from "PackagePrice" where "packageId" = p.id order by "validDateFrom" desc limit 1) "price", (select id from "PackagePrice" where "packageId" = p.id order by "validDateFrom" desc limit 1) "priceId" from "Package" p where p."companyId" = ? and p.deleted is null',
            [id]);
        },
        getAllByCompany: function(id){
            return knex.select().table('Package').where('companyId', id);
        },
        getDeleteByCompany: function(id){
            return knex.select().table('Package').where('companyId', id).whereNotNull('deleted');
        },
        getAllForListByCompany(id){
            return knex.raw('select p.id, p.description, p."companyId" , p."imagePath", p."imageName", p.deleted, p.created, p.code ,p.stock, c.price,c."validDateFrom" from "Package" p , "PackagePrice" c where p."companyId" = ?  c."packageId" = p."id"',
            [id]);
        },
        getForListHabilitadosByCompany(id){
            return knex.raw('select p.id, p.description, p."companyId" , p."imagePath", p."imageName", p.deleted, p.created, p.code ,p.stock, c.price,c."validDateFrom" from "Package" p , "PackagePrice" c where p."companyId" = ?  c."packageId" = p."id" and p.deleted is null',
            [id]);
        },
        getForDeleteListByCompany(id){
            return knex.raw('select p.id, p.description, p."companyId" , p."imagePath", p."imageName", p.deleted, p.created, p.code ,p.stock, c.price,c."validDateFrom" from "Package" p , "PackagePrice" c where p."companyId" = ?  c."packageId" = p."id" and p.deleted is not null',
            [id]);
        },
        insert: function(package){
            return knex('Package').insert(package).returning('id');
        },
        modify: function(id, package){
            return knex('Package').where('id', id).update(package);
        },
        deleteRollback: function(id){
            return knex('Package').where('id', id).del();
        },
        delete: function(id,date){
            console.log(`Enviando Query DELETE a package`);
            return knex('Package').where('id', id).update('deleted', date);
        },
    },
    //Queries de productos de paquete
    packageProduct: {
        getAll: function(){
            return knex.select().table('PackageProduct');
        },
        getAllById: function(id){
            return knex.select().table('PackageProduct').where('packageId', id);
        },
        getByPackageIdProductId(idpack,idProd){
            return knex.raw('select p.id, p."packageId", p."productId", p.quantity from "PackageProduct" p where p."packageId" = ? and p."productId" = ?',
            [idpack,idProd]);
        },
        insert: function(packageProd){
            return knex('PackageProduct').insert(packageProd).returning('id');
        },
        modify: function(id, packageProd){
            return knex('PackageProduct').where('id', id).update(packageProd);
        },
        delete: function(id){
            return knex('PackageProduct').where('id', id).del();
        },
        deleteByPackage: function(id){
            return knex('PackageProduct').where('packageId', id).del();
        }
    },
    //Queries de categorias de paquete
    packCategory: {
        getAll: function(){
            return knex.select().table('PackageCategory');
        },
        getByPackageId: function(id){
            return knex.select().table('PackageCategory').where('packageId', id);
        },
        getByPackageIdByCategoryId: function(idpack,idcat){
            return knex.raw('select p.id, p."packageId", p."categoryId" from "PackageCategory" p where p."packageId" = ? and p."categoryId" = ?',
            [idpack,idcat]);  
        },
        getByPackIdName: function(id){
            return knex.raw('select c.id, c.name from "PackageCategory" p, "Category" c where p."productId" = ? and p."categoryId" = c.id',
            [id]);
        },
        getByCategoryId: function(id){
            return knex.select().table('PackageCategory').where('categoryId', id);
        },
        insert: function(packCategory){
            return knex('PackageCategory').insert(packCategory).returning('id');
        },
        delete: function(id){
            return knex('PackageCategory').where('id', id).del();
        },
        deleteByPackage: function(id){
            return knex('PackageCategory').where('packageId', id).del();
        }
    },
    //Queries de precios de paquetes
    prices: {
        getOneById: function(id){
            return knex.select().table('PackagePrice').where('id', id).first();
        },
        getCurrent: function(packId){
            return knex.raw('select * from "PackagePrice" where "packageId" = ? order by "validDateFrom" desc limit 1',
            [packId]);
        },
        getLast: function(packId){
            return knex.raw('select * from "PackagePrice" where "packageId" = ? order by "validDateFrom" desc limit 2',
            [packId]);
        },
        insert: function(price){
            return knex('PackagePrice').insert(price).returning('id');
        }
    }
}