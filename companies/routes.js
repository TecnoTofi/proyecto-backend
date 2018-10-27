// let pool = require('../db/connection');
const queries = require('./dbQueries');

//GET Categories
const getCategories =  (req, res) => {
    console.log('Conexion GET entrante : /api/company/category');

    queries
        .categories
        .getAll()
        .then(categories => {
            console.log('Informacion de Company Category obtenida');
            res.status(200).json(categories);
        })
        .catch(err => {
           console.log(`Error en Query SELECT de CompanyCategory : ${err}`);
           res.status(500).json({message: err});
        });
    console.log('Informacion de Company Category enviada');
};

//GET Company
const getCompanies = (req, res) => {
    console.log('Conexion GET entrante : /api/company/');

    queries
        .companies
        .getAll()
        .then(companies => {
            console.log('Informacion de Company obtenida');
            res.status(200).json(companies);
        })
        .catch(err => {
            console.log(`Error en Query SELECT de Company : ${err}`);
            res.status(500).json({message: err});
         });
    console.log('Informacion de Company enviada');
};

//POST Company
const insertCompany = (req, res) => {
    console.log('Conexion POST entrante : /api/company/');
    
    //realizar validaciones

    queries
        .companies
        .insert(req.body)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(`Error en Query INSERT de Company : ${err}`);
            res.status(500).json({message: err});
         });
};

module.exports = { getCategories, getCompanies, insertCompany }