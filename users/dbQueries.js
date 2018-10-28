const knex = require('../db/connection');

module.exports = {
    users: {
        getOneById: function(id){
            return knex.select().table('User').where('id', id).first();
        },
        getOneByEmail: function(email){
            console.log(`Enviando Query SELECT a User con email: ${email}`);
            return knex.select().table('User').where('email', email).first();
        },
        getOneByDocument: function(document){
            console.log(`Enviando Query SELECT a User con document: ${document}`);
            return knex.select().table('User').where('document', document).first();
        },
        getByName: function(name){
            return knex.select().table('User').where('name', name);
        },
        getByPhone: function(phone){
            return knex.select().table('User').where('phone', phone);
        },
        getByRol: function(roleId){
            return knex.select().table('User').where('roleId', roleId);
        },
        insert: function(user){
            return knex('User').insert(user).returning('id');
        },
        update: function(id, user){
            return knex('User').where('id', id).update(user);
        },
        delete: function(id){
            return knex('User').where('id', id).del();
        }
    },
    roles: {
        getAll: function() {
            return knex.select().table('Role');
        },
        getOneById: function(id){
            return knex.select().table('Role').where('id', id).first();
        },
        getOneByName: function(name){
            return knex.select().table('Role').where('name', name).first();
        },
        getForSignup: function(){
            return knex.select().table('Role').whereIn('name', ['Minorista', 'Mayorista']);
        },
        insert: function(rol){
            return knex('Role').insert(rol).returning('id');
        },
        update: function(id, name){
            return knex('Role').where('id', id).update('name', name);
        },
        delete: function(id){
            return knex('Role').where('id', id).del();
        }
    }
};