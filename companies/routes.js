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
                console.log(comp);
                if(comp.imagePath) comp.imagePath = comp.imagePath.replace(regex, '/');
                console.log(comp);
                return comp;
            });
            res.status(200).json(empresas);
        })
        .catch(err => {
            console.log(`Error en Query SELECT de Company : ${err}`);
            res.status(500).json({message: err});
         });
    console.log('Informacion de Company enviada');
};

const getOneCompany = (req, res) => {
    console.log('Conexion GET entrante : /api/company/id');
    //console.log(req);
    // req.params.id

    queries
        .companies
        .getOneById(47)
        .then(company => {
            console.log('Informacion de una Company obtenida');
            /*let regex = /\\/g;
            const company = companies.map(comp => {
                comp.imagePath = comp.imagePath.replace(regex, '/');
                return comp;*/
                res.status(200).json(company);
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
                        console.log('Querie INSERT de Company correcta')//no necesariamente
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

async function updateCompany(body,id){
    console.log('Accediendo a ../companies/routes/updateCompany');

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
    console.log('Datos para update listos');
    console.log('Enviando Querie Update de Company');
    console.log(company);
    retorno.id = await queries
                    .companies
                    .modify(id,company)
                    .then(id => {
                        console.log('Querie update de Company correcta')//no necesariamente
                        return Number(id);
                    })
                    .catch(err => {
                        console.log(`Error en Query update de Company : ${err}`);
                        retorno.errores = err;
                        retorno.id = 0;
                    });

    if(await retorno.id == 0) console.log('Finalizando update fallido');
    else console.log('Finalizando update correcta');
    
    return await retorno;
};

async function getAllForList(req, res){
    console.log('entre');
    await queries
                    .companies
                    .getOneForDetail(40)
                    .then(response => {
                        console.log('hay response');
                        res.status(200).json(response);
                    })
                    .catch(err => console.log(err));
}

async function getCompany(companyId){
    let message = '';
    let company = await queries
                    .companies
                    .getOneById(companyId)
                    .then(data => {
                        //undefined si no existe
                        if(!data) {
                            console.log(`No existe company con id: ${companyId}`);
                            message += `No existe una company con id ${companyId}`;
                        }
                        return data;
                    })
                    .catch(err => {
                        console.log('Error en Query SELECT de Company: ', err);
                        message += `Error en Query SELECT de Company: ${err}`;
                    });
    return { company, message };
}

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

module.exports = {
    getCategories,
    getTypes,
    getCompanies,
    insertCompany,
    validarTipoDatosCompany,
    getAllForList,
    getOneCompany,
    updateCompany,
    getCompany
};