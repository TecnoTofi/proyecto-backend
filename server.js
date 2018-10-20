//Incluimos modulo express para el manejo HTTP
const express = require('express');
//Incluimos modulo body-parser para complementar express
const bodyParser = require('body-parser');
//Incluimos modulo PG para conectar con base de datos PostgreSQL
const pg = require('pg');
//Incluimos modulo CORS para conectar con frontend React
const cors = require('cors');
//Incluimos modulo Joi para la validaciond de datos
const Joi = require('joi');

//Establecemos el puerto segun variable de ambiente del servidor o 3000 para ambiente de desarrollo
const PORT = process.env.PORT || 3000;

//Inicializamos APP
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Creamos conexion a la base de datos
let pool = new pg.Pool({
    host: 'localhost', //IP del servidor
    port: 5432, //Puerto del servidor
    user: 'tecno', //Nombre del usuario
    password: 'tecno1234', //Contraseña del usuario
    database: 'proyFirst', //Nombre de la base de datos
    max: 10 //Maxima cantidad de conexiones simultaneas
});

//Determinamos routes

//Ruta para registro de empresas
app.post('/api/empresas/new', (req, res) => {
    console.log('Conexion POST entrante : /api/empresas/new');

    const {error} = validarRegistroEmpresas(req.body);

    if(error){
        console.log(`Error en la validacion : ${error}`);
        return res.status(400).send(error.details[0].message);
    }

    pool.connect((err, db, done) => {
        //Si hubo problemas de conexion con la DB, tiro para afuera
        if(err){
            console.log(`Error al conectar con la base de datos : ${err}`);
            return res.status(500).send({ message: `Error al conectar con la base de datos : ${err}`});
        }
        //Envio insert de la empresa
        db.query('INSERT INTO company (name, rut, phone, "categoryId") VALUES ($1, $2, $3, $4)', [req.body.companyName, req.body.rut, req.body.companyPhone, req.body.category], (err) => {

            //Si hubo error en el insert, tiro para afuera
            if(err){
                console.log(`Error en la query INSERT de empresas : ${err}`);
                return res.status(500).send({ message: `Error en la query INSERT de empresas: ${err}`});
            }

            console.log(`Empresa insertada : ${req.body.companyName}`);

            //Voy a buscar el id de la empresa insertada
            db.query('SELECT id FROM company WHERE name = $1', [req.body.companyName], (err, companyTable) => {

                //Si hubo error en el select, tiro para afuera
                if(err){
                    console.log(`Error en la query Select de empresas : ${err}`);
                    return res.status(500).send({ message: `Error en la query Select de empresas: ${err}`});
                }
                
                let companyId = companyTable.rows[0].id;
                console.log(`Empresa obtenida : ${companyId}`);

                //Envio insert del usuario
                db.query('INSERT INTO "user" (name, email, password, document, phone, "roleId", "companyId") values ($1, $2, $3, $4, $5, $6, $7)', [req.body.name, req.body.email, req.body.password, req.body.document, req.body.userPhone, req.body.role, companyId], (err) => {
                    done();
                    //Si hubo error en el insert, tiro para afuera
                    if(err){
                        console.log(`Error en la query INSERT de usuarios : ${err}`);
                        return res.status(500).send({ message: `Error en la query INSERT de usuarios: ${err}`});
                    }
        
                    console.log(`Usuarios insertado : ${req.body.name}`);
                    
                });
            });
            return res.status(201).send({ message: 'Alta exitosa'});
        });
    });
});

//Validaciones de datos

//Validacion de nombres
function validarRegistroEmpresas(body){
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(6).max(50).required(),
        password: Joi.string().min(8).max(20).required(),
        document: Joi.string().min(5).max(15).required(),
        userPhone: Joi.string().min(7).max(15).required(),
        companyName: Joi.string().min(3).max(50).required(),
        rut: Joi.string().min(12).max(12).required(),
        companyPhone: Joi.string().min(7).max(15).required(),
        category: Joi.number().required(),
        role: Joi.number().required()
    };
    return Joi.validate(body, schema);
}

//Levanta servicio de escucha en el puerto indicado
app.listen(PORT, () => console.log(`Escuchando en Puerto: ${PORT}`));