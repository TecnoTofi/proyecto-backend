let pool = require('../db/connection');

const categories =  (req, res) => {
    console.log('Conexion GET entrante : /api/companies/types');

    pool.connect((err, db, done) => {
        //Si hubo problemas de conexion con la DB, tiro para afuera
        if(err){
            console.log(`Error al conectar con la base de datos : ${err}`);
            return res.status(500).json({ message: `Error al conectar con la base de datos : ${err}`});
        }
        //Envio consulta SELECT
        db.query('SELECT * FROM "dbo.CompanyCategory"', (err, typesTable) => {
            done();
            //Si hubo error en el select, tiro para afuera
            if(err){
                console.log(`Error en la query Select de companyCategory : ${err}`);
                return res.status(500).json({ message: `Error en la query Select de companyCategory: ${err}`});
            }
            console.log('Informacion de Company Category enviada');
            return res.status(200).json(typesTable.rows);
        })
    })
};

const companies = (req, res) => {
    console.log('Conexion GET entrante : /api/listadoCompanies/companies');

    pool.connect((err, db, done) => {
        //Si hubo problemas de conexion con la DB, tiro para afuera
        if(err){
            console.log(`Error al conectar con la base de datos : ${err}`);
            return res.status(500).json({ message: `Error al conectar con la base de datos : ${err}`});
        }
        //Envio consulta SELECT
        db.query('SELECT * FROM "dbo.Company"', (err, companies) => {
            done();
            //Si hubo error en el select, tiro para afuera
            if(err){
                console.log(`Error en la query Select de company : ${err}`);
                return res.status(500).json({ message: `Error en la query Select de company: ${err}`});
            }
            console.log('Listado de companias enviado');
            return res.status(200).json(companies.rows);
        })
    })
};

module.exports = { categories, companies }