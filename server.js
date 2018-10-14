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

//Creamos pool de conexin a la DB
let pool = new pg.Pool({
    host: 'localhost', //IP del servidor
    port: 5432, //puerto servidor Postgres
    user: 'tecno', //usuario de conexion a DB
    'password': 'tecno1234', //contraseña del user
    database: 'proyFirst', //nombre de la DB
    max: 10 //cantidad de conexiones simultaneas
});

//Determinamos Routes

//Ruta para obtener el listado de empresas
app.get('/api/empresas', (req, res) => {

    console.log('Conexion entrante GET : /api/empresas');

    pool.connect((err, db, done) => {
        if(err){
            console.log(`Error al conectar a la DB: ${err}`);
            return res.status(500).send({message: `Error al conectar con la DB: ${err}`});
        }

        db.query('SELECT * FROM empresa', (err, table) => {
            done();
            if(err){
                console.log(`Error en la query INSERT: ${err}`);
                return res.status(500).send({message: `Error en la query INSERT ${err}`});
            }
            console.log(`Informacion de empresas enviada: ${table.rows}`);
            return res.status(200).send(table.rows);
        });
    });
});

//Ruta para insercion de empresas
app.post('/api/empresas', (req, res) => {

    console.log('Conexion entrante POS : /api/empresas');

    const {errorValidacion} = validarNombre(req.body);

    if(errorValidacion){
        console.log(`Error en la validacion: ${errorValidacion}`);
        return res.status(400).send(errorValidacion.details[0].message);
    }

    let empresa_name = req.body.name;

    pool.connect((err, db, done) => {
        if(err){
            console.log(`Error al conectar a la DB: ${err}`);
            return res.status(500).send({message: `Error al conectar con la DB: ${err}`});
        }

        db.query('INSERT INTO empresa (name) VALUES ($1)', [empresa_name], (err, table) => {
            done();
            if(err){
                console.log(`Error en la query INSERT: ${err}`);
                return res.status(500).send({message: `Error en la query INSERT ${err}`});
            }

            console.log(`Empresa insertada: ${empresa_name}`);
            return res.status(201).send({message: `Empresa insertada`});
        });
    });
});

app.get('/api/empresas/:id/productos', (req, res) => {
    
    console.log(`Conexion entrante GET : /api/empresas/${req.params.id}/productos`);

    pool.connect((err, db, done) => {
        if(err){
            console.log(`Error al conectar a la DB: ${err}`);
            return res.status(500).send({message: `Error al conectar con la DB: ${err}`});
        }

        let empresa_id = req.params.id;
        db.query('SELECT * FROM producto WHERE empresa_id = $1', [empresa_id], (err, table) => {
            done();
            if(err){
                console.log(`Error en la query INSERT: ${err}`);
                return res.status(500).send({message: `Error en la query INSERT ${err}`});
            }

            console.log(`Informacion de productos enviada: ${table.rows}`);
            return res.status(200).send(table.rows);
        })
    });
});

app.post('/api/productos', (req, res) => {

    console.log('Conexion entrante POST : /api/productos');
    console.log('Llegue a Node con la request: ', req.body);

    const {errorValidacion} = validarNombre(req.body);

    if(errorValidacion) {
        console.log(`Error en la validacion: ${errorValidacion}`);
        return res.status(400).send(errorValidacion.details[0].message);
    }

    let producto_name = req.body.name;
    let empresa_id = req.body.empresa_id;

    pool.connect((err, db, done) => {
        if(err) {
            console.log(`Error al conectar a la DB: ${err}`);
            return res.status(500).send({message: `Error al conectar con la DB: ${err}`});
        }

        db.query('INSERT INTO producto (name, empresa_id) VALUES ($1, $2)', [producto_name, empresa_id], (err, table) => {
            done();
            if(err){
                console.log(`Error en la query INSERT: ${err}`);
                return res.status(500).send({message: `Error en la query INSERT ${err}`});
            }

            console.log(`Producto insertado: ${producto_name}`);
            res.status(201).send({message: 'Producto insertado'});
        })
    })
});

function validarNombre(obj){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(obj, schema);
}

//Levanta servicio en el puerto indicado
app.listen(PORT, () => console.log(`Listening on Port: ${PORT}`));