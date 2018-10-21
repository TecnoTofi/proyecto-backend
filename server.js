//Incluimos modulo express para el manejo HTTP
const express = require('express');
//Incluimos modulo body-parser para complementar express
const bodyParser = require('body-parser');
//Incluimos modulo PG para conectar con base de datos PostgreSQL
// const pg = require('pg');
//Incluimos modulo CORS para conectar con frontend React
const cors = require('cors');
//Incluimos modulo Joi para la validaciond de datos
// const Joi = require('joi');

//Inclusion de modulos propios

//Incluimos conexion a la base de datos
// let pool = require('./db/connection');
//Incluimos autenticacion
const authRoutes = require('./auth/index');
//Incluimos ruteo de usuarios
const usersRoutes = require('./users/index');
//Incluimos ruteo de empresas
const companiesRoutes = require('./companies/index');

//Establecemos el puerto segun variable de ambiente del servidor o 3000 para ambiente de desarrollo
const PORT = process.env.PORT || 3000;

//Inicializamos APP
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

//Monstamos ruteos propios
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/companies', companiesRoutes);

//Levanta servicio de escucha en el puerto indicado
app.listen(PORT, () => console.log(`Escuchando en Puerto: ${PORT}`));