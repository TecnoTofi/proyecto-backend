let pool = require('../db/connection');
const queries = require('./dbQueries');

//GET Categories
const getCategories =  (req, res) => {
    console.log('Conexion GET entrante : /api/company/category');

    queries
        .companies
        .getCategories()
        .then(categories => {
            console.log('Informacion de Company Category obtenida');
            res.status(200).json(categories);
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
        });
    console.log('Informacion de Company enviada');
};

//POST Company
const insertCompany = (req, res) => {
    console.log('Conexion POST entrante : /api/company/');
    
    //realizar validaciones

    queries
        .companies
        .insertCompany(req.body)
        .then(result => {
            res.json(result);
        })
};

module.exports = { getCategories, getCompanies, insertCompany }