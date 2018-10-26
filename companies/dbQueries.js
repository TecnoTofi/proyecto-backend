const knex = require('../db/connection');

module.exports = {
    companies: {
        getCategories: function(){
            return knex.select().table('CompanyCategory');
        },
        getAll: function(){
            return knex.select().table('Company');
        },
        insertCompany: function(company){
            return knex('Company').insert(company).returning('id');
        }
    }
};