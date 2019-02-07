//Conexion a DataBase
// const environment = process.env.ENVIRONMENT || 'development'
const environment = 'staging';
//Obtengo informacion de ambiente
const config = require('../knexfile');
const environmentConfig = config[environment];
//Importamos Knex
const knex = require('knex');
const connection = knex(environmentConfig);

module.exports = connection;