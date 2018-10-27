const Joi = require('joi');
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
async function insertCompany(req, res){
    console.log('Conexion POST entrante : /api/company/');
    
    let {error} = await validarTipoDatoCompany(req.body);

    if(!error){

        let company = {
            name: req.body.companyName,
            rut: req.body.companyRut,
            firstStreet: req.body.companyFirstStreet,
            secondStreet: req.body.companySecondStreet,
            doorNumber: req.body.companyDoorNumber,
            phone: req.body.companyPhone,
            categoryId: req.body.category
        }

        queries
            .companies
            .insert(company)
            .then(result => {
                res.json(result);
            })
            .catch(err => {
                console.log(`Error en Query INSERT de Company : ${err}`);
                res.status(500).json({message: err});
            });
    }
    else{
        console.log(`Error en la validacion de tipos de dato : ${error.details[0].message}`);
        res.status(400).json({message: error.details[0].message});
    }
};

function validarTipoDatoCompany(body){
    const schema = {
        companyName: Joi.string().min(3).max(30).required(),
        companyRut: Joi.number().required(),
        companyPhone: Joi.number().required(),
        companyFirstStreet: Joi.string().min(3).max(30).required(),
        companySecondStreet: Joi.string().min(3).max(30).required(),
        companyDoorNumber: Joi.number().required(),
        category: Joi.number().required(),
    }
    return Joi.validate(schema, body);
}

module.exports = { getCategories, getCompanies, insertCompany }


// const companyData = {
//     companyName: signupdata.companyName,
//     companyRut: signupdata.companyRut,
//     companyPhone: signupdata.companyPhone,
//     companyFirstStreet: signupdata.companyFirstStreet,
//     companySecondStreet: signupdata.companySecondStreet,
//     companyDoorNumber: signupdata.companyDoorNumber,
//     category: signupdata.category
//   };  