const knex = require('../db/connection');

module.exports = {
    companies: {
        getAll: function(){
            console.log(`Enviando Query SELECT a Company`);
            return knex.select().table('Company');
        },
        getOneById: function(id){
            console.log(`Enviando Query SELECT a Company con id ${id}`);
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
        getByCategory: function(rubroId){
            console.log(`Enviando Query SELECT a Company por category: ${rubroId}`);
            return knex.select().table('Company').where('rubroId', rubroId);
        },
        getAllForList: function(){
            console.log(`Enviando Query SELECT a Company`);
            return knex.raw('select c.id, c.name, c.description, c."imageName", c."imagePath", cc."name" "Category", ct."name" "Type" from "Company" c, "CompanyCategory" cc, "CompanyType" ct where c."categoryId" = cc.id and c."typeId" = ct.id;');
        },
        getOneForEdit: function(id){
            //borrar esto?
            console.log(`Enviando Query SELECT a Company`);
            return knex.raw('select c.id, c.name, c.description, c.phone, c."firstStreet", c."secondStreet", c."doorNumber", c."imageName", c."imagePath", cc."id" "Category", ct."id" "Type" from "Company" c, "CompanyCategory" cc, "CompanyType" ct where c."categoryId" = cc.id and c."typeId" = ct.id and c.id = ?',
            [id]);
        },
        getOneForDetail: function(id){
            //borrar esto?
            console.log(`Enviando Query SELECT a Company`);
            return knex.raw('select c.id, c.name, c.description, c."imageName", c."imagePath", cc."name" "Category", ct."name" "Type" from "Company" c, "CompanyCategory" cc, "CompanyType" ct where c."categoryId" = cc.id and c."typeId" = ct.id and c.id = ?',
            [id]);
        },
        insert: function(company){
            console.log(`Enviando Query INSERT a Company`);
            return knex('Company').insert(company).returning('id');
        },
        modify: function(id, company){
            console.log(`Enviando Query UPDATE a Company`);
            return knex('Company').where('id', id).update(company);
        },
        delete: function(id){
            //pasar a borrado logico
            console.log(`Enviando Query DELETE a Company`);
            return knex('Company').where('id', id).del();
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
        modify: function(id, name){
            return knex('Rubro').where('id', id).update('name', name);
        },
        delete: function(id){
            return knex('Rubro').where('id', id).del();
        }
    },
    types: {
        getAll: function(){
            return knex.select().table('Type');
        },
        getOneById: function(id){
            return knex.select().table('Type').where('id', id).first();
        },
        getOneByName: function(name){
            return knex.select().table('Type').where('name', name).first();
        },
        insert: function(category){
            return knex('Type').insert(category).returning('id');
        },
        modify: function(id, name){
            return knex('Type').where('id', id).update('name', name);
        },
        delete: function(id){
            return knex('Type').where('id', id).del();
        }
    }
};