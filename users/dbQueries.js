const knex = require('../db/connection');

module.exports = {
    users: {
        getRoles: function() {
            return knex.select().table('Role');
        },
        insertUser: function(user){
            return knex('user').insert(user).returning('id');
        }
    }
};