//Incluimos modulo Express para manejo HTTP
const express = require('express');
//Incluimos modulo Body-Parser para complementar express
const bodyParser = require('body-parser');
//Incluimos modulo PG para conectar con servidor Postgres
const pg = require('pg');
//Incluimos modulo CORS para conectar con front-end React
const cors = require('cors');
//Incluimos joi para la validacion de datos
const Joi = require('joi');

//Establecemos puerto de conexion dado por servidor o fijo 3000 (dev env)
const PORT = process.env.PORT || 3000;

//inicializamos app
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Creamos pool de conexion a la DB
// let pool = new pg.Pool({
//     host: 'localhost', //IP del servidor
//     port: 5432, //puerto servidor Postgres
//     user: '', //usuario de conexion a DB
//     'password': '', //contraseña del user
//     database: '', //nombre de la DB
//     max: 10 //cantidad de conexiones simultaneas
// });

//escribir conexiones aqui

//Levanta servicio en el puerto indicado
app.listen(PORT, () => console.log(`Listening on Port: ${PORT}`));