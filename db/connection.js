const pg = require('pg');

let pool = new pg.Pool({
    host: 'localhost', //IP del servidor
    port: 5432, //Puerto del servidor
    user: 'tecno', //Nombre del usuario
    password: 'tecno1234', //Contraseña del usuario
    database: 'proyecto', //Nombre de la base de datos
    max: 10 //Maxima cantidad de conexiones simultaneas
});

module.exports = pool;