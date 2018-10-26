const knex = require('../db/connection');

module.exports = {
    users: {
        getOneByEmail: function(email){
            console.log(`Enviando Query SELECT a User con email: ${email}`);
            return knex.select().table('User').where('email', email).first();
        },
        getOneByDocument: function(document){
            console.log(`Enviando Query SELECT a User con document: ${document}`);
            return knex.select().table('User').where('document', document).first();
        },
        insertUser: function(user){
            return knex('User').insert(user).returning('id');
        }
    },
    roles: {
        getRoles: function() {
            return knex.select().table('Role');
        },
        getRolById: function(id){
            return knex.select().table('Role').where('id', id).first();
        },
        getRolByName: function(name){
            return knex.select().table('Role').where('name', name).first();
        },
        insertRol: function(name){
            return knex('Role').insert(name).returning('id');
        },
        modifyRol: function(id, name){
            return knex('Role').where('id', id).update('name', name);
        },
        deleteRol: function(id){
            return knex('Role').where('id', id).del();
        }
    }
};