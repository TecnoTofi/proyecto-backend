const Joi = require('joi');
const queries = require('./dbQueries');
const fs = require('fs');

//GET Categories
const getRubros =  (req, res) => {
    console.log('Conexion GET entrante : /api/company/rubros');

    queries
        .rubros
        .getAll()
        .then(categories => {
            console.log('Informacion de Rubros obtenida');
            res.status(200).json(categories);
        })
        .catch(err => {
           console.log(`Error en Query SELECT de Rubro : ${err}`);
           res.status(500).json({message: err});
        });
};

const getTypes =  (req, res) => {
    console.log('Conexion GET entrante : /api/company/types');

    queries
        .types
        .getAll()
        .then(types => {
            console.log('Informacion de Types obtenida');
            res.status(200).json(types);
        })
        .catch(err => {
           console.log(`Error en Query SELECT de Type : ${err}`);
           res.status(500).json({message: err});
        });
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
};

const getOneCompany = async (req, res) => {
    console.log(`Conexion GET entrante : /api/company/${req.params.id}`);
    
    let { company, message } = await getCompanyById(req.params.id);

    if(!company){
        console.log(message);
        res.status(400).json(message);
    }
    else{
        console.log('Compania encontrada');
        res.status(200).json(company);
        console.log('Informacion de Company enviada');
    }

    // queries
    //     .companies
    //     .getOneById(req.params.id)
    //     .then(company => {
    //         if(company){
    //             console.log('Informacion de una Company obtenida');
    //             /*let regex = /\\/g;
    //             const company = companies.map(comp => {
    //                 comp.imagePath = comp.imagePath.replace(regex, '/');
    //                 return comp;*/
    //             res.status(200).json(company);
    //         }
    //         else{
    //             console.log(`No existe Company con ID: ${req.params.id}`);
    //             res.status(400).json({message: `No existe Company con ID: ${req.params.id}`});
    //         }
    //     })
    //     .catch(err => {
    //         console.log(`Error en Query SELECT de Company : ${err}`);
    //         res.status(500).json({message: err});
    //      });
};

//POST Company
async function insertCompany(company){
    console.info('Comenzando insert de company');

    // let retorno = {
    //     id: 0,
    //     errores: ''
    // };

    // console.log('Preparando datos para insercion');
    // let company = {
    //     name: body.companyName,
    //     rut: body.companyRut,
    //     firstStreet: body.companyFirstStreet,
    //     secondStreet: body.companySecondStreet,
    //     doorNumber: body.companyDoorNumber,
    //     phone: body.companyPhone,
    //     typeId: body.type,
    //     rubroId: body.rubro,
    //     description: body.companyDescription,
    //     imageName: body.imageName,
    //     imagePath: body.imagePath,
    //     created: new Date()
    // }
    // console.log('Datos para insercion listos');
    // console.log('Enviando Querie INSERT de Company');
    // console.log(company);
    let message = '';
    let id = await queries
                    .companies
                    .insert(company)
                    .then(id => {
                        if(id){
                            console.info('Query INSERT de Company correcta');
                            return Number(id);
                        }
                        else{
                            console.error('Error en Query INSERT de Company');
                            return 0;
                        }
                    })
                    .catch(err => {
                        console.error(`Error en Query INSERT de Company: ${err}`);
                        message = `Error en Query INSERT de Company: ${err}`;
                        return 0;
                    });
    
    return { id, message};
};

async function rollbackInsertCompany(id){
    let message = '';
    let res = await queries
                    .companies
                    .delete(id)
                    .then(data => {
                        return data;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de Company: ', err);
                        message += `Error en Query DELETE de Company: ${err}`;
                    });
    return { res, message };
}

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

async function getCompanyById(id){
    console.info(`Buscando Company con id: ${id}`);
    let message = '';
    let company = await queries
                    .companies
                    .getOneById(id)
                    .then(data => {
                        //undefined si no existe
                        if(!data) {
                            console.info(`No existe company con id: ${id}`);
                            message += `No existe una company con id ${id}`;
                        }
                        else{
                            console.info(`Company encontrada con id: ${id}`)
                            return data;
                        }
                    })
                    .catch(err => {
                        console.error('Error en Query SELECT de Company: ', err);
                        message += `Error en Query SELECT de Company: ${err}`;
                    });
    return { company, message };
}

async function getCompanyByRut(rut){
    console.info(`Buscando Company con Rut: ${rut}`);
    let message = '';
    let company = await queries
                    .companies
                    .getOneByRut(rut)
                    .then(data => {
                        //undefined si no existe
                        if(!data) {
                            console.info(`No existe company con Rut: ${rut}`);
                            message += `No existe una company con Rut ${rut}`;
                        }
                        else{
                            console.info(`Company encontrada con rut: ${rut}`);
                            return data;
                        }
                    })
                    .catch(err => {
                        console.error('Error en Query SELECT de Company: ', err);
                        message += `Error en Query SELECT de Company: ${err}`;
                    });
    return { company, message };
}

async function getCompanyByName(name){
    console.info(`Buscando Company con nombre: ${name}`);
    let message = '';
    let company = await queries
                    .companies
                    .getOneByName(name)
                    .then(data => {
                        if(!data) {
                            console.info(`No existe company con nombre: ${name}`);
                            message += `No existe una company con nombre ${name}`;
                        }
                        else{
                            console.info(`Company encontrada con nombre: ${name}`);
                            return data;
                        }
                    })
                    .catch(err => {
                        console.error('Error en Query SELECT de Company: ', err);
                        message += `Error en Query SELECT de Company: ${err}`;
                    });
    return { company, message };
}

function validarDatos(body){
    console.info('Comenzando validacion Joi de Company');
    const schema = Joi.object().keys({
        typeId: Joi.number().required(),
        rubroId: Joi.number().required(),
        rut: Joi.string().min(12).max(12).required(),
        companyName: Joi.string().min(3).max(50).required(),
        description: Joi.string().min(5).max(100),
        companyPhone: Joi.string().min(7).max(15).required(),
        companyFirstStreet: Joi.string().max(30).required(),
        companySecondStreet: Joi.string().max(30).required(),
        companyDoorNumber: Joi.string().max(15).required(),
        imageName: Joi.allow('').allow(null),
        imagePath: Joi.allow('').allow(null)
    });

    console.info('Finalizando validacion Joi de Company');
    return Joi.validate(body, schema);
};

module.exports = {
    getCompanyById,
    getCompanyByRut,
    getCompanyByName,
    rollbackInsertCompany,
    getRubros,
    getTypes,
    getCompanies,
    insertCompany,
    validarDatos,
    getAllForList,
    getOneCompany,
    updateCompany,
};