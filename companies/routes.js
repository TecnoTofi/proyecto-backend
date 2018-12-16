const Joi = require('joi');
const queries = require('./dbQueries');
const { getRubroById, getTypeById, validarId } = require('../helpers/routes');

async function obtenerCompanies(req, res){
    console.info('Conexion GET entrante : /api/company');

    let { companies, message } = await getAllCompanies();

    if(companies){
        console.info(`${companies.length} companias encontradas`);
        console.info('Preparando response');
        res.status(200).json(companies);
    }
    else{
        console.info('No se encontraron companias');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

async function obtenerAllCompanies(req, res){
    console.info('Conexion GET entrante : /api/company/all');

    let { companies, message } = await getAllCompanies();

    if(companies){
        console.info(`${companies.length} companias encontradas`);
        console.info('Preparando response');
        res.status(200).json(companies);
    }
    else{
        console.info('No se encontraron companias');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

async function obtenerDeletedCompanies(req, res){
    console.info('Conexion GET entrante : /api/company/all');

    let { companies, message } = await getDeletedCompanies();

    if(companies){
        console.info(`${companies.length} companias encontradas`);
        console.info('Preparando response');
        res.status(200).json(companies);
    }
    else{
        console.info('No se encontraron companias');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

async function obtenerCompaniesByType(req, res){
    console.info(`Conexion GET entrante : /api/company/type/${req.params.id}`);
    
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info(`Comprobando existencia de tipo ${req.params.id}`);
        let { type, message: typeMessage } = await getTypeById(req.params.id);

        if(!type){
            console.info(`No existe tipo con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message: typeMessage});
        }
        else{
            console.info(`Obteniendo companies de tipo ${type.name}`);
            let { companies, message } = await getCompaniesByType(req.params.id, type.name);

            if(companies){
                console.info(`${companies.length} companies encontrados`);
                console.info('Preparando response');
                res.status(200).json(companies);
            }
            else{
                console.info('No se encontraron companies');
                console.info('Preparando response');
                res.status(200).json({message});
            }
        }
    }
}

async function obtenerCompaniesByRubro(req, res){
    console.info(`Conexion GET entrante : /api/company/rubro/${req.params.id}`);
    
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info(`Comprobando existencia de rubro ${req.params.id}`);
        let { rubro, message: rubroMessage } = await getRubroById(req.params.id);

        if(!rubro){
            console.info(`No existe rubro con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message: rubroMessage});
        }
        else{
            console.info(`Obteniendo companies de rubro ${rubro.name}`);
            let { companies, message } = await getCompaniesByRubro(req.params.id, rubro.name);

            if(companies){
                console.info(`${companies.length} companies encontrados`);
                console.info('Preparando response');
                res.status(200).json(companies);
            }
            else{
                console.info('No se encontraron companies');
                console.info('Preparando response');
                res.status(200).json({message});
            }
        }
    }
}

async function obtenerCompanyById(req, res){
    console.log(`Conexion GET entrante : /api/company/${req.params.id}`);

    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info('Validacion de tipos exitosa');
        console.info(`Yendo a buscar company con ID: ${req.params.id}`);
        let { company, message } = await getCompanyById(req.params.id);

        if(company){
            console.info('Company encontrada');
            console.info('Preparando response');
            res.status(200).json(company);
        }
        else{
            console.info('No se encontro company');
            console.info('Preparando response');
            res.status(200).json({message});
        }
    }
}

async function obtenerCompanyByRut(req, res){
    console.log(`Conexion GET entrante : /api/company/rut/${req.params.rut}`);

    console.info(`Comenzando validacion de tipos`);
    let { error } = validarRut(req.params.rut);

    if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info('Validacion de tipos exitosa');
        console.info(`Yendo a buscar company con Rut: ${req.params.rut}`);
        let { company, message } = await getCompanyByRut(req.params.rut);

        if(company){
            console.info('Company encontrada');
            console.info('Preparando response');
            res.status(200).json(company);
        }
        else{
            console.info('No se encontro company');
            console.info('Preparando response');
            res.status(200).json({message});
        }
    }
}

async function obtenerCompanyByName(req, res){
    console.log(`Conexion GET entrante : /api/company/name/${req.params.name}`);

    console.info(`Comenzando validacion de tipos`);
    let { error } = validarName(req.params.name);

    if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info('Validacion de tipos exitosa');
        console.info(`Yendo a buscar company con Nombre: ${req.params.name}`);
        let { company, message } = await getCompanyByName(req.params.name);

        if(company){
            console.info('Company encontrada');
            console.info('Preparando response');
            res.status(200).json(company);
        }
        else{
            console.info('No se encontro company');
            console.info('Preparando response');
            res.status(200).json({message});
        }
    }
}

async function altaCompany(req, res){
    console.info('Conexion POST entrante : /api/company');

    console.info('Enviando a validar tipos de datos en request');
    let valCompany = {
        typeId: req.body.type,
        rubroId: req.body.rubro,
        rut: req.body.companyRut,
        companyName: req.body.companyName,
        description: req.body.companyDescription,
        companyPhone: req.body.companyPhone,
        companyFirstStreet: req.body.companyFirstStreet,
        companySecondStreet: req.body.companySecondStreet,
        companyDoorNumber: req.body.companyDoorNumber,
        imageName: req.file.filename,
        imagePath: req.file.path
    };

    let { error } = validarCompany(valCompany);

    if(error){
        console.info('Erorres encontrados en la request');
        let errores = error.details.map(e => {
            console.info(e.message);
            return e.message;
        });
        console.info('Preparando response');
        res.status(400).json({message: errores});
    }
    else{
        console.info('Validaciones de tipo de datos exitosa');
        console.info('Comenzando validaciones de existencia');

        //Inicializo array de errores
        let errorMessage = [];

        let { type, message: typeMessage } = await getTypeById(valCompany.typeId);
        let { rubro, message: rubroMessage } = await getRubroById(valCompany.rubroId);
        let { company: companyByRut } = await getCompanyByRut(valCompany.rut);
        let { company: companyByName } = await getCompanyByName(valCompany.companyName);

        if(!type) errorMessage.push(typeMessage);
        if(!rubro) errorMessage.push(rubroMessage);
        if(companyByRut) errorMessage.push(`Ya existe una compañia con Rut ${valCompany.rut}`);
        if(companyByName) errorMessage.push(`Ya existe una compañia con Nombre ${valCompany.companyName}`);

        if(errorMessage.length > 0){
            console.info(`Se encontraron ${errorMessage.length} errores de existencia en la request`);
            errorMessage.map(err => console.log(err));
            console.info('Enviando response')
            res.status(400).json({message: errorMessage});
        }
        else{
            console.info('Validaciones de existencia exitosas');

            console.info('Preparando objeto para insert de Company');
            let company = {
                name: valCompany.companyName,
                rut: valCompany.rut,
                firstStreet: valCompany.companyFirstStreet,
                secondStreet: valCompany.companySecondStreet,
                doorNumber: valCompany.companyDoorNumber,
                phone: valCompany.companyPhone,
                typeId: valCompany.typeId,
                rubroId: valCompany.rubroId,
                description: valCompany.description,
                imageName: valCompany.imageName,
                imagePath: valCompany.imagePath,
                created: new Date()
            };

            //Enviamos insert a company
            let { id: companyId, message: companyMessage } = await insertCompany(company);

            if(companyId){
                console.info(`Insert de Company terminado correctamente, con ID: ${companyId}`);
                console.info('Preparando response');
                res.status(201).json({message: 'Registro existoso', id: companyId});
            }
            else{
                console.info('Preparando response');
                res.status(500).json({message: companyMessage});
            }
        }
    }
}

async function modificarCompany(req, res){
    console.info(`Conexion PUT entrante : /api/company/${req.params.id}`);

    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info('Enviando a validar tipos de datos en request');
        let valCompany = {
            typeId: req.body.type,
            rubroId: req.body.rubro,
            rut: req.body.companyRut,
            companyName: req.body.companyName,
            description: req.body.companyDescription,
            companyPhone: req.body.companyPhone,
            companyFirstStreet: req.body.companyFirstStreet,
            companySecondStreet: req.body.companySecondStreet,
            companyDoorNumber: req.body.companyDoorNumber,
            imageName: req.file ? req.file.filename : req.body.imageName,
            imagePath: req.file ? req.file.path : req.body.imagePath
        };

        //Inicializo array de errores
        let errorMessage = [];

        console.info(`Comenzando validacion de tipos`);
        let { error: errorCompany} = validarCompany(valCompany);

        if(errorCompany) {
            console.info('Errores encontrados en la validacion de tipos de company');
            errorCompany.details.map(e => {
                console.info(e.message);
                errorMessage.push(e.message);
                return;
            });
        }

        if(errorMessage.length > 0){
            console.info(`Se encontraron ${errorMessage.length} errores de tipo en la request`);
            errorMessage.map(err => console.log(err));
            console.info('Enviando response');
            res.status(400).json({message: errorMessage});
        }
        else{
            console.info('Validacion de tipos exitosa');
            console.info('Comenzando validaciones de existencia');

            let { type, message: typeMessage } = await getTypeById(valCompany.typeId);
            let { rubro, message: rubroMessage } = await getRubroById(valCompany.rubroId);
            let { company: companyById, message: companyByIdMessage } = await getCompanyById(req.params.id);
            let { company: companyByRut } = await getCompanyByRut(valCompany.rut);
            let { company: companyByName } = await getCompanyByName(valCompany.companyName);

            if(!type) errorMessage.push(typeMessage);
            if(!rubro) errorMessage.push(rubroMessage);
            if(!companyById) errorMessage.push(companyByIdMessage);
            if(companyByRut && companyByRut.id !== req.params.id) errorMessage.push(`Ya existe una compañia con Rut ${valCompany.rut}`);
            if(companyByName && companyByName.id !== req.params.id) errorMessage.push(`Ya existe una compañia con Nombre ${valCompany.companyName}`);

            if(errorMessage.length > 0){
                console.info(`Se encontraron ${errorMessage.length} errores de existencia en la request`);
                errorMessage.map(err => console.log(err));
                console.info('Enviando response');
                res.status(400).json({message: errorMessage});
            }
            else{
                console.info('Validacion de existencia exitosas');

                console.info('Preparando objeto para update de Company');
                let company = {
                    name: valCompany.companyName,
                    rut: valCompany.rut,
                    firstStreet: valCompany.companyFirstStreet,
                    secondStreet: valCompany.companySecondStreet,
                    doorNumber: valCompany.companyDoorNumber,
                    phone: valCompany.companyPhone,
                    typeId: valCompany.typeId,
                    rubroId: valCompany.rubroId,
                    description: valCompany.description,
                    imageName: valCompany.imageName,
                    imagePath: valCompany.imagePath,
                };

                let { result, message } = await updateCompany(req.params.id, company);

                if(result){
                    console.info(`Company con ID: ${req.params.id} actualizada correctamente`);
                    console.info('Preparando response');
                    res.status(200).json({message: 'Modificacion exitosa'});
                }
                else{
                    console.info('No se pudo modificar company');
                    console.info('Preparando response');
                    res.status(500).json({message: message});
                }
            }
        }
    }
}

async function eliminarCompany(req, res){
    console.info(`Conexion DELETE entrante : /api/company/${req.params.id}`);

    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info('Comenzando validaciones de existencia');

        let { company, message } = await getCompanyById(req.params.id);

        if(!company){
            console.info(`No existe company con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message});
        }
        else{
            console.info('Enviando request para eliminacion');
            let { result, message } = await deleteCompany(req.params.id, new Date());
            
            if(result){
                console.info(`Company eliminada correctamente con ID: ${req.params.id}`);
                console.info('Preparando response');
                res.status(201).json({message});
            }
            else{
                console.info('No se pudo eliminar company');
                console.info('Preparando response');
                res.status(500).json({message: message});
            }
        }
    }
}

async function getCompanies(){
    console.info('Buscando companias no bloqueadas');
    let message = '';
    let companies = await queries
                        .companies
                        .getCompanies()
                        .then(data => {
                            if(data){
                                console.info('Informacion de companias obtenida');
                                return data;
                            }
                            else{
                                console.info('No existen companias registrados en la BD que no esten bloqueadas');
                                message = 'No existen companias registrados en la BD que no esten bloqueadas';
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de Company : ${err}`);
                            message = 'Ocurrio un error al obtener las companias';
                            return null;
                        });
    return { companies, message };
}

async function getAllCompanies(){
    console.info('Buscando companias no bloqueadas');
    let message = '';
    let companies = await queries
                        .companies
                        .getAll()
                        .then(data => {
                            if(data){
                                console.info('Informacion de companias obtenida');
                                return data;
                            }
                            else{
                                console.info('No existen companias registrados en la BD que no esten bloqueadas');
                                message = 'No existen companias registrados en la BD que no esten bloqueadas';
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de Company : ${err}`);
                            message = 'Ocurrio un error al obtener las companias';
                            return null;
                        });
    return { companies, message };
}

async function getDeletedCompanies(){
    console.info('Buscando companias no bloqueadas');
    let message = '';
    let companies = await queries
                        .companies
                        .getDeleted()
                        .then(data => {
                            if(data){
                                console.info('Informacion de companias obtenida');
                                return data;
                            }
                            else{
                                console.info('No existen companias registrados en la BD que no esten bloqueadas');
                                message = 'No existen companias registrados en la BD que no esten bloqueadas';
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de Company : ${err}`);
                            message = 'Ocurrio un error al obtener las companias';
                            return null;
                        });
    return { companies, message };
}

async function getCompaniesByType(id, type){
    console.info(`Buscando todas las companies de tipo ${type}`);
    let message = '';
    let companies = await queries
                        .companies
                        .getByType(id)
                        .then(data => {
                            if(data){
                                console.info('Informacion de companies obtenida');
                                return data;
                            }
                            else{
                                console.info(`No existen companies registrados en la BD con tipo ${type}`);
                                message = `No existen companies registrados en la BD con tipo ${type}`;
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de Company : ${err}`);
                            message = 'Ocurrio un error al obtener las companies';
                            return null;
                        });
    return { companies, message };
}

async function getCompaniesByRubro(id, rubro){
    console.info(`Buscando todas las companies de tipo ${rubro}`);
    let message = '';
    let companies = await queries
                        .companies
                        .getByRubro(id)
                        .then(data => {
                            if(data){
                                console.info('Informacion de companies obtenida');
                                return data;
                            }
                            else{
                                console.info(`No existen companies registrados en la BD con rubro ${rubro}`);
                                message = `No existen companies registrados en la BD con rubro ${rubro}`;
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de Company : ${err}`);
                            message = 'Ocurrio un error al obtener las companies';
                            return null;
                        });
    return { companies, message };
}

async function getCompanyById(id){
    console.info(`Buscando company con ID: ${id}`);
    let message = '';
    let company = await queries
                .companies
                .getOneById(id)
                .then(data => {
                    if(data) {
                        console.info(`Company con ID: ${id} encontrada`);
                        return data;
                    }
                    else{
                        console.info(`No existe company con ID: ${id}`);
                        message = `No existe un company con ID ${id}`;
                        return null;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query SELECT de Company: ${err}`);
                    message = 'Ocurrio un error al obtener la company';
                });
    return { company, message };
}

async function getCompanyByRut(rut){
    console.info(`Buscando company con Rut: ${rut}`);
    let message = '';
    let company = await queries
                .companies
                .getOneByRut(rut)
                .then(data => {
                    if(data) {
                        console.info(`Company con Rut: ${rut} encontrada`);
                        return data;
                    }
                    else{
                        console.info(`No existe company con Rut: ${rut}`);
                        message = `No existe un company con Rut ${rut}`;
                        return null;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query SELECT de Company: ${err}`);
                    message = 'Ocurrio un error al obtener la company';
                });
    return { company, message };
}

async function getCompanyByName(name){
    console.info(`Buscando company con Nombre: ${name}`);
    let message = '';
    let company = await queries
                .companies
                .getOneByName(name)
                .then(data => {
                    if(data) {
                        console.info(`Company con Nombre: ${name} encontrada`);
                        return data;
                    }
                    else{
                        console.info(`No existe company con Nombre: ${name}`);
                        message = `No existe un company con Nombre ${name}`;
                        return null;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query SELECT de Company: ${err}`);
                    message = 'Ocurrio un error al obtener la company';
                });
    return { company, message };
}

async function insertCompany(company){
    console.info('Comenzando insert de Company');
    let message = '';
    let id = await queries
                    .companies
                    .insert(company)
                    .then(res => {
                        if(res){
                            console.info(`Insert de Company exitoso con ID: ${res[0]}`);
                            return res[0];
                        }
                        else{
                            console.info('Ocurrio un error');
                            message = 'Ocurrio un error al intertar dar de alta';
                            return 0;
                        }
                    })
                    .catch(err => {
                        console.log(`Error en Query INSERT de Company: ${err}`);
                        message = 'Ocurrio un error al intertar dar de alta';
                        return 0;
                    });
    
    return { id, message };
}

async function updateCompany(id, company){
    console.info('Comenzando update de Company');
    let message = '';
    let result = await queries
                .companies
                .update(id, company)
                .then(res => {
                    if(res){
                        console.info(`Update de Company con ID: ${id} existoso}`);
                        return res;
                    }
                    else{
                        console.info('Ocurrio un error');
                        message = 'Ocurrio un error al intertar modificar';
                        return 0;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query UPDATE de Company: ${err}`);
                    message = 'Ocurrio un error al intertar modificar';
                    return 0;
                });
    return { result, message };
}

async function deleteCompany(id, date){
    console.info('Comenzando delete de Company');
    let message = '';
    let result = await queries
                .companies
                .delete(id, date)
                .then(res => {
                    if(res){
                        console.info(`Delete de Company existoso con ID: ${id}`);
                        message = `Company con ID:${id} eliminado correctamente`;
                        return res;
                    }
                    else{
                        console.info('Ocurrio un error');
                        message = 'Ocurrio un error al intertar eliminar el company';
                        return 0;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query INSERT de Company: ${err}`);
                    message = 'Ocurrio un error al intertar eliminar el company';
                    return 0;
                });
    return { result, message };
}

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

function validarCompany(body){
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

function validarRut(rut){
    console.info('Comenzando validacion Joi de Rut');
    const schema = Joi.string().min(12).max(12).required();
    console.info('Finalizando validacion Joi de Rut');
    return Joi.validate(rut, schema);
}

function validarName(name){
    console.info('Comenzando validacion Joi de Nombre');
    const schema = Joi.string().min(3).max(50).required();
    console.info('Finalizando validacion Joi de Nombre');
    return Joi.validate(name, schema);
}

module.exports = {
    obtenerCompanies,
    obtenerAllCompanies,
    obtenerDeletedCompanies,
    obtenerCompaniesByType,
    obtenerCompaniesByRubro,
    obtenerCompanyById,
    obtenerCompanyByRut,
    obtenerCompanyByName,
    altaCompany,
    modificarCompany,
    eliminarCompany,
    getCompanies,
    getAllCompanies,
    getDeletedCompanies,
    getCompaniesByType,
    getCompanyById,
    getCompanyByRut,
    getCompanyByName,
    insertCompany,
    updateCompany,
    deleteCompany,
    rollbackInsertCompany,
    validarCompany,
};