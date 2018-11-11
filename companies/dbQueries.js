const knex = require('../db/connection');

module.exports = {
    companies: {
        getAll: function(){
            return knex.select().table('Company');
        },
        getOneById: function(id){
            return knex.select().table('Company').where('id', id).first();
        },
        getOneByRut: function(rut){
            console.log(`Enviando Query SELECT a Company con rut: ${rut}`);
            return knex.select().table('Company').where('rut', rut).first();
        },
        getOneByName: function(name){
            console.log(`Enviando Query SELECT a Company con name: ${name}`);
            return knex.select().table('Company').where('name', name).first();
        },
        getByCategory: function(categoryId){
            return knex.select().table('Company').where('categoryId', categoryId);
        },
        getAllForList: function(){
            return knex.raw('select c.id, c.name, c.description, c."imageName", c."imagePath", cc."name" "Category", ct."name" "Type" from "Company" c, "CompanyCategory" cc, "CompanyType" ct where c."categoryId" = cc.id and c."typeId" = ct.id;');
        },
        getOneForEdit: function(id){
            return knex.raw('select c.id, c.name, c.description, c.phone, c."firstStreet", c."secondStreet", c."doorNumber", c."imageName", c."imagePath", cc."id" "Category", ct."id" "Type" from "Company" c, "CompanyCategory" cc, "CompanyType" ct where c."categoryId" = cc.id and c."typeId" = ct.id and c.id = ?',
            [id]);
        },
        getOneForDetail: function(id){
            return knex.raw('select c.id, c.name, c.description, c."imageName", c."imagePath", cc."name" "Category", ct."name" "Type" from "Company" c, "CompanyCategory" cc, "CompanyType" ct where c."categoryId" = cc.id and c."typeId" = ct.id and c.id = ?',
            [id]);
        },
        insert: function(company){
            return knex('Company').insert(company).returning('id');
        },
        modify: function(id, company){
            return knex('Company').where('id', id).update(company);
        },
        delete: function(id){
            return knex('Company').where('id', id).del();
        }
    },
    categories: {
        getAll: function(){
            return knex.select().table('CompanyCategory');
        },
        getOneById: function(id){
            return knex.select().table('CompanyCategory').where('id', id).first();
        },
        getOneByName: function(name){
            return knex.select().table('CompanyCategory').where('name', name).first();
        },
        insert: function(category){
            return knex('CompanyCategory').insert(category).returning('id');
        },
        modify: function(id, name){
            return knex('CompanyCategory').where('id', id).update('name', name);
        },
        delete: function(id){
            return knex('CompanyCategory').where('id', id).del();
        }
    },
    types: {
        getAll: function(){
            return knex.select().table('CompanyType');
        },
        getOneById: function(id){
            return knex.select().table('CompanyType').where('id', id).first();
        },
        getOneByName: function(name){
            return knex.select().table('CompanyType').where('name', name).first();
        },
        insert: function(category){
            return knex('CompanyType').insert(category).returning('id');
        },
        modify: function(id, name){
            return knex('CompanyType').where('id', id).update('name', name);
        },
        delete: function(id){
            return knex('CompanyType').where('id', id).del();
        }
    }
};