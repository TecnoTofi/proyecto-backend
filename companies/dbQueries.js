//Importamos conexion a DataBase
const knex = require('../db/connection');

//Exportamos queries
module.exports = {
    //Queries de companies
    companies: {
        getCompanies: function(){
            console.log(`Enviando Query SELECT a Company`);
            return knex.select().table('Company').where('deleted', null);
        },
        getAll: function(){
            console.log(`Enviando Query SELECT a Company`);
            return knex.select().table('Company');
        },
        getDeleted: function(){
            console.log(`Enviando Query SELECT a Company`);
            return knex.select().table('Company').whereNot('deleted', null);
        },
        getByType: function(id){
            console.log(`Enviando Query SELECT a Company`);
            return knex.select().table('Company').where('typeId', id);
        },
        getByRubro: function(id){
            console.log(`Enviando Query SELECT a Company`);
            return knex.select().table('Company').where('rubroId', id);
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
            console.log(`Enviando Query SELECT a Company`);
            return knex.raw('select c.id, c.name, c.description, c.phone, c."firstStreet", c."secondStreet", c."doorNumber", c."imageName", c."imagePath", cc."id" "Category", ct."id" "Type" from "Company" c, "CompanyCategory" cc, "CompanyType" ct where c."categoryId" = cc.id and c."typeId" = ct.id and c.id = ?',
            [id]);
        },
        getOneForDetail: function(id){
            console.log(`Enviando Query SELECT a Company`);
            return knex.raw('select c.id, c.name, c.description, c."imageName", c."imagePath", cc."name" "Category", ct."name" "Type" from "Company" c, "CompanyCategory" cc, "CompanyType" ct where c."categoryId" = cc.id and c."typeId" = ct.id and c.id = ?',
            [id]);
        },
        insert: function(company){
            console.log(`Enviando Query INSERT a Company`);
            return knex('Company').insert(company).returning('id');
        },
        update: function(id, company){
            console.log(`Enviando Query UPDATE a Company`);
            return knex('Company').where('id', id).update(company);
        },
        delete: function(id, date){
            console.log(`Enviando Query DELETE a User`);
            return knex('Company').where('id', id).update('deleted', date);
        },
        rollback: function(id){
            console.log(`Enviando Query DELETE a User`);
            return knex('Company').where('id', id).del();
        }
    }
};