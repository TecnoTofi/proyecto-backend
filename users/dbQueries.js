const knex = require('../db/connection');

module.exports = {
    users: {
        getRoles: function() {
            return knex.select().table('Role');
        },
        getOneByEmail: function(email){
            console.log(`Enviando Query SELECT a User con email: ${email}`);
            return knex.select().table('User').where('email', email);
        },
        getOneByDocument: function(document){
            console.log(`Enviando Query SELECT a User con document: ${document}`);
            return knex.select().table('User').where('document', document);
        },
        insertUser: function(user){
            return knex('User').insert(user).returning('id');
        }
    }
};