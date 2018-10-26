// const pg = require('pg');

// let pool = new pg.Pool({
//     host: 'localhost', //IP del servidor
//     port: 5432, //Puerto del servidor
//     user: 'tecno', //Nombre del usuario
//     password: 'tecno1234', //Contraseña del usuario
//     database: 'proyecto', //Nombre de la base de datos
//     max: 10 //Maxima cantidad de conexiones simultaneas
// });

// module.exports = pool;

// const knex = require('knex')({
//     client: 'pg',
//     connection: {
//         host: 'locahost',
//         user: 'tecno',
//         password: 'tecno1234',
//         database: 'proyecto'
//     },
//     pool: {min: 0, max: 10}
// });

// module.exports = knex;

const environment = 'development';
const config = require('../knexfile');
const environmentConfig = config[environment];
const knex = require('knex');
const connection = knex(environmentConfig);

module.exports = connection;