const knex = require('../db/connection');

module.exports = {
    users: {
        getOneById: function(id){
            console.log(`Enviando Query SELECT a User con id: ${id}`);
            return knex.select().table('User').where('id', id).first();
        },
        getOneByEmail: function(email){
            console.log(`Enviando Query SELECT a User con email: ${email}`);
            return knex.select().table('User').where('email', email).first();
        },
        getOneByDocument: function(documento){
            console.log(`Enviando Query SELECT a User con documento: ${documento}`);
            return knex.select().table('User').where('document', documento).first();
        },
        getByName: function(name){
            console.log(`Enviando Query SELECT a User con nombre: ${name}`);
            return knex.select().table('User').where('name', name);
        },
        getByPhone: function(phone){
            console.log(`Enviando Query SELECT a User con telefono: ${phone}`);
            return knex.select().table('User').where('phone', phone);
        },
        getByRol: function(typeId){
            console.log(`Enviando Query SELECT a User con tipo: ${typeId}`);
            return knex.select().table('User').where('typeId', typeId);
        },
        insert: function(user){
            console.log(`Enviando Query INSERT a User`);
            return knex('User').insert(user).returning('id');
        },
        update: function(id, user){
            console.log(`Enviando Query UPDATE a User`);
            return knex('User').where('id', id).update(user);
        },
        delete: function(id){
            //pasar a borrado logico
            console.log(`Enviando Query DELETE a User`);
            return knex('User').where('id', id).del();
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
        insert: function(rol){
            return knex('Type').insert(rol).returning('id');
        },
        update: function(id, name){
            return knex('Type').where('id', id).update('name', name);
        },
        delete: function(id){
            return knex('Type').where('id', id).del();
        }
    }
};