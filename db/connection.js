const environment = process.env.ENVIRONMENT || 'development'
// const environment = 'staging';
const config = require('../knexfile');
const environmentConfig = config[environment];
const knex = require('knex');
const connection = knex(environmentConfig);

module.exports = connection;