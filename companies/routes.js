const Joi = require('joi');
const queries = require('./dbQueries');
const fs = require('fs');

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

const getTypes =  (req, res) => {
    console.log('Conexion GET entrante : /api/company/type');

    queries
        .types
        .getAll()
        .then(types => {
            console.log('Informacion de Company Types obtenida');
            res.status(200).json(types);
        })
        .catch(err => {
           console.log(`Error en Query SELECT de CompanyType : ${err}`);
           res.status(500).json({message: err});
        });
    console.log('Informacion de Company Type enviada');
};

//GET Company
const getCompanies = (req, res) => {
    console.log('Conexion GET entrante : /api/company/');

    queries
        .companies
        .getAll()
        .then(companies => {
            console.log('Informacion de Company obtenida');
            let regex = /\\/g;
            const empresas = companies.map(comp => {
                comp.imagePath = comp.imagePath.replace(regex, '/');
                return comp;
            });
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
        typeId: body.typeId,
        categoryId: body.categoryId,
        description: body.companyDescription,
        imageName: body.imageName,
        imagePath: body.imagePath
    }
    console.log('Datos para insercion listos');
    console.log('Enviando Querie INSERT de Company');
    console.log(company);
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
        typeId: Joi.number().required(),
        categoryId: Joi.number().required(),
        companyDescription: Joi.string().min(5).max(100).required(),
        imageName: Joi.allow('').allow(null),
        imagePath: Joi.allow('').allow(null)
    };
    return Joi.validate(body, schema);
};

module.exports = { getCategories, getTypes, getCompanies, insertCompany, validarTipoDatosCompany };