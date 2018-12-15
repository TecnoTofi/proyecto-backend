const knex = require('../db/connection');

module.exports = {
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
            return knex('Category').insert(category).returning('id');
        },
        update: function(id, name){
            return knex('Category').where('id', id).update('name', name);
        },
        delete: function(id){
            return knex('Category').where('id', id).del();
        }
    },
    rubros: {
        getAll: function(){
            return knex.select().table('Rubro');
        },
        getOneById: function(id){
            return knex.select().table('Rubro').where('id', id).first();
        },
        getOneByName: function(name){
            return knex.select().table('Rubro').where('name', name).first();
        },
        insert: function(category){
            return knex('Rubro').insert(category).returning('id');
        },
        update: function(id, name){
            return knex('Rubro').where('id', id).update('name', name);
        },
        delete: function(id){
            return knex('Rubro').where('id', id).del();
        }
    },
    types: {
        getAll: function() {
            return knex.select().table('Type');
        },
        getOneById: function(id){
            return knex.select().table('Type').where('id', id).first();
        },
        getOneByName: function(name){
            return knex.select().table('Type').where('name', name).first();
        },
        getForSignup: function(){
            return knex.select().table('Type').whereIn('name', ['Minorista', 'Mayorista']);
        },
        insert: function(type){
            return knex('Type').insert(type).returning('id');
        },
        update: function(id, name){
            return knex('Type').where('id', id).update('name', name);
        },
        delete: function(id){
            return knex('Type').where('id', id).del();
        }
    }
};