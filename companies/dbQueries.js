const knex = require('../db/connection');

module.exports = {
    companies: {
        getCategories: function(){
            return knex.select().table('CompanyCategory');
        },
        getAll: function(){
            return knex.select().table('Company');
        },
        getOneByName: function(name){
            console.log(`Enviando Query SELECT a Company con name: ${name}`);
            return knex.select().table('Company').where('name', name).first();
        },
        getOneByRut: function(rut){
            console.log(`Enviando Query SELECT a Company con rut: ${rut}`);
            return knex.select().table('Company').where('rut', rut).first();
        },
        insertCompany: function(company){
            return knex('Company').insert(company).returning('id');
        }
    }
};