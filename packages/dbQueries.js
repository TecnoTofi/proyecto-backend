const knex = require('../db/connection');

module.exports = {

    packages: {
        getAll: function(){
            return knex.select().table('Package');
        },
        getOneById: function(id){
            return knex.select().table('Package').where('id', id).first();
        },
        getByCompanyId: function(id){
            return knex.select().table('Package').where('companyId', id);
        },
        insert: function(package){
            return knex('Package').insert(package).returning('id');
        },
        modify: function(id, package){
            return knex('Package').where('id', id).update(package);
        },
        delete: function(id){
            return knex('Package').where('id', id).del();
        }
    },

    packageProduct: {
        getAll: function(){
            return knex.select().table('PackageProduct');
        },
        getAllById: function(id){
            return knex.select().table('PackageProduct').where('packageId', id);
        },
        insert: function(packageProd){
            return knex('PackageProduct').insert(packageProd).returning('id');
        },
        modify: function(id, packageProd){
            return knex('PackageProduct').where('id', id).update(packageProd);
        },
        delete: function(id){
            return knex('PackageProduct').where('id', id).del();
        }
    },
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