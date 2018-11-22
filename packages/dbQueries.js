const knex = require('../db/connection');

module.exports = {

    packages: {
        getAll: function(){
            return knex.select().table('Packages');
        },
        getOneById: function(id){
            return knex.select().table('Packages').where('id', id).first();
        },
        getAllByCompanyId: function(id){
            return knex.select().table('Packages').where('companyId', id);
        },
        insert: function(package){
            return knex('Packages').insert(package).returning('id');
        },
        modify: function(id, package){
            return knex('Packages').where('id', id).update(package);
        },
        delete: function(id){
            return knex('Packages').where('id', id).del();
        }
    },

    packagesProduct: {
        getAll: function(){
            return knex.select().table('PackageProducts');
        },
        getAllById: function(id){
            return knex.select().table('PackageProducts').where('packageId', id);
        },
        insert: function(packageProd){
            return knex('PackageProducts').insert(packageProd).returning('id');
        },
        modify: function(id, packageProd){
            return knex('PackageProducts').where('id', id).update(packageProd);
        },
        delete: function(id){
            return knex('PackageProduct').where('id', id).del();
        }
    },

}