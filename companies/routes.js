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
async function insertCompany(body){
    console.log('Accediendo a ../companies/routes/insertCompany');

    let retorno = {
        id: 0,
        errores: ''
    };

    console.log('Preparando datos para insercion');
    let company = {
        name: body.companyName,
        rut: body.companyRut,
        firstStreet: body.companyFirstStreet,
        secondStreet: body.companySecondStreet,
        doorNumber: body.companyDoorNumber,
        phone: body.companyPhone,
        categoryId: body.category
    }
    console.log('Datos para insercion listos');
    console.log('Enviando Querie INSERT de Company');

    retorno.id = await queries
                    .companies
                    .insert(company)
                    .then(id => {
                        console.log('Querie INSERT de Company correcta')
                        return Number(id);
                    })
                    .catch(err => {
                        console.log(`Error en Query INSERT de Company : ${err}`);
                        retorno.errores = err;
                        retorno.id = 0;
                    });

    if(await retorno.id == 0) console.log('Finalizando insercion fallida');
    else console.log('Finalizando insercion correcta');
    
    return await retorno;
};

function validarTipoDatosCompany(body){
    const schema = {
        companyName: Joi.string().min(3).max(50).required(),
        companyRut: Joi.string().min(12).max(12).required(),
        companyPhone: Joi.string().min(7).max(15).required(),
        companyFirstStreet: Joi.string().max(30).required(),
        companySecondStreet: Joi.string().max(30).required(),
        companyDoorNumber: Joi.string().max(15).required(),
        category: Joi.number().required()
    };
    return Joi.validate(body, schema);
};

module.exports = { getCategories, getCompanies, insertCompany, validarTipoDatosCompany };