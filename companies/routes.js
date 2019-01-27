//Incluimos Joi para validaciones
const Joi = require('joi');
//Incluimos queries de DB
const queries = require('./dbQueries');
//Incluimos funciones de helpers
const { getRubroById, getTypeById, validarId } = require('../helpers/routes');

//Endpoint para obtener todas las companias no borradas
async function obtenerCompanies(req, res){
    console.info('Conexion GET entrante : /api/company');

    //Obtenemos los datos
    let { companies, message } = await getAllCompanies();

    if(companies){
        //Retornamos los datos
        console.info(`${companies.length} companias encontradas`);
        console.info('Preparando response');
        res.status(200).json(companies);
    }
    else{
        //Si fallo, damos error
        console.info('No se encontraron companias');
        console.info('Preparando response');
        res.status(500).json({message});
    }
}

//Endpoint para obtener todas las companias
async function obtenerAllCompanies(req, res){
    console.info('Conexion GET entrante : /api/company/all');

    //Obtenemos los datos
    let { companies, message } = await getAllCompanies();

    if(companies){
        //Retornamos los datos
        console.info(`${companies.length} companias encontradas`);
        console.info('Preparando response');
        res.status(200).json(companies);
    }
    else{
        //Si fallo damos error
        console.info('No se encontraron companias');
        console.info('Preparando response');
        res.status(500).json({message});
    }
}

//Endpoint para obtener todas las companias borradas
async function obtenerDeletedCompanies(req, res){
    console.info('Conexion GET entrante : /api/company/all');

    //Obtenemos los datos
    let { companies, message } = await getDeletedCompanies();

    if(companies){
        //Retornamos los datos
        console.info(`${companies.length} companias encontradas`);
        console.info('Preparando response');
        res.status(200).json(companies);
    }
    else{
        //Si fallo damos error
        console.info('No se encontraron companias');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

//Endpoint para obtener companias filtrando por tipo
async function obtenerCompaniesByType(req, res){
    console.info(`Conexion GET entrante : /api/company/type/${req.params.id}`);
    
    //Validamos parametro de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        //Si hay error retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        //Obtenemos el tipo
        console.info(`Comprobando existencia de tipo ${req.params.id}`);
        let { type, message: typeMessage } = await getTypeById(req.params.id);

        if(!type){
            //Si no se encuentra, retornamos error
            console.info(`No existe tipo con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message: typeMessage});
        }
        else{
            //Obtenemos companias
            console.info(`Obteniendo companies de tipo ${type.name}`);
            let { companies, message } = await getCompaniesByType(req.params.id, type.name);

            if(companies){
                //Retornamos los datos
                console.info(`${companies.length} companies encontrados`);
                console.info('Preparando response');
                res.status(200).json(companies);
            }
            else{
                //Si fallo damos error
                console.info('No se encontraron companies');
                console.info('Preparando response');
                res.status(500).json({message});
            }
        }
    }
}

//Endpoint para obtener companias filtrando por rubro
async function obtenerCompaniesByRubro(req, res){
    console.info(`Conexion GET entrante : /api/company/rubro/${req.params.id}`);
    
    //Validamos parametros de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        //Si hay error retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        //Obtenemos el rubro
        console.info(`Comprobando existencia de rubro ${req.params.id}`);
        let { rubro, message: rubroMessage } = await getRubroById(req.params.id);

        if(!rubro){
            //Si no se encuentra, retornamos error
            console.info(`No existe rubro con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message: rubroMessage});
        }
        else{
            console.info(`Obteniendo companies de rubro ${rubro.name}`);
            let { companies, message } = await getCompaniesByRubro(req.params.id, rubro.name);

            if(companies){
                //Obtenemos companias
                console.info(`${companies.length} companies encontrados`);
                console.info('Preparando response');
                res.status(200).json(companies);
            }
            else{
                //Retornamos los datos
                console.info('No se encontraron companies');
                console.info('Preparando response');
                res.status(500).json({message});
            }
        }
    }
}

//Endpoint para obtener companias filtrando por ID
async function obtenerCompanyById(req, res){
    console.log(`Conexion GET entrante : /api/company/${req.params.id}`);

    //Validamos parametro de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        //Si hay error retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        //Obtenemos la compnia
        console.info('Validacion de tipos exitosa');
        console.info(`Yendo a buscar company con ID: ${req.params.id}`);
        let { company, message } = await getCompanyById(req.params.id);

        if(company){
            //Retornamos los datos
            console.info('Company encontrada');
            console.info('Preparando response');
            res.status(200).json(company);
        }
        else{
            //Si no se encuentra, retornamos error
            console.info('No se encontro company');
            console.info('Preparando response');
            res.status(500).json({message});
        }
    }
}

//Endpoint para obtener companias filtrando por Rut
async function obtenerCompanyByRut(req, res){
    console.log(`Conexion GET entrante : /api/company/rut/${req.params.rut}`);

    //Validamos parametro de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarRut(req.params.rut);

    if(error){
        //Si hay error retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        //Obtenemos la compania
        console.info('Validacion de tipos exitosa');
        console.info(`Yendo a buscar company con Rut: ${req.params.rut}`);
        let { company, message } = await getCompanyByRut(req.params.rut);

        if(company){
            //Retornamos los datos
            console.info('Company encontrada');
            console.info('Preparando response');
            res.status(200).json(company);
        }
        else{
            //Si fallo damos error
            console.info('No se encontro company');
            console.info('Preparando response');
            res.status(500).json({message});
        }
    }
}

//Endpoint para obtener companias filtrando por nombre
async function obtenerCompanyByName(req, res){
    console.log(`Conexion GET entrante : /api/company/name/${req.params.name}`);

    //Validamos parametro de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarName(req.params.name);

    if(error){
        //Si hay error retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        //Obtenemos la compania
        console.info('Validacion de tipos exitosa');
        console.info(`Yendo a buscar company con Nombre: ${req.params.name}`);
        let { company, message } = await getCompanyByName(req.params.name);

        if(company){
            //Retornamos los datos
            console.info('Company encontrada');
            console.info('Preparando response');
            res.status(200).json(company);
        }
        else{
            //Si fallo damos error
            console.info('No se encontro company');
            console.info('Preparando response');
            res.status(200).json({message});
        }
    }
}

//Endpoint para registrar una nueva compania
async function altaCompany(req, res){
    console.info('Conexion POST entrante : /api/company');

    //Armamos body de validacion
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

    //Enviamos a validar los datos
    let { error } = validarCompany(valCompany);

    if(error){
        //Si hay algun error, retornamos
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

        //Buscamos todas las entidades
        let { type, message: typeMessage } = await getTypeById(valCompany.typeId);
        let { rubro, message: rubroMessage } = await getRubroById(valCompany.rubroId);
        let { company: companyByRut } = await getCompanyByRut(valCompany.rut);
        let { company: companyByName } = await getCompanyByName(valCompany.companyName);

        //Si ya existen companias, damos error para evitar repetidos
        if(!type) errorMessage.push(typeMessage);
        if(!rubro) errorMessage.push(rubroMessage);
        if(companyByRut) errorMessage.push(`Ya existe una compañia con Rut ${valCompany.rut}`);
        if(companyByName) errorMessage.push(`Ya existe una compañia con Nombre ${valCompany.companyName}`);

        if(errorMessage.length > 0){
            //Si hay algun error, retornamos
            console.info(`Se encontraron ${errorMessage.length} errores de existencia en la request`);
            errorMessage.map(err => console.log(err));
            console.info('Enviando response')
            res.status(400).json({message: errorMessage});
        }
        else{
            console.info('Validaciones de existencia exitosas');
            //Armamos body para insert
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
                //Si se inserto correctamente, retornamos ID
                console.info(`Insert de Company terminado correctamente, con ID: ${companyId}`);
                console.info('Preparando response');
                res.status(201).json({message: 'Registro existoso', id: companyId});
            }
            else{
                //Si fallo damos error
                console.info('Preparando response');
                res.status(500).json({message: companyMessage});
            }
        }
    }
}

//Endpoint para modificar una compania
async function modificarCompanyVal(req, res){
    console.info(`Conexion PUT entrante : /api/company/${req.params.id}`);

    //Llamamos auxiliar para modificar compania
    let { status, message } = await modificarCompany(req.params.id, req.body, req.file);

    //Retornamos
    res.status(status).json(message);
}

// Auxiliar para modificar una compania
async function modificarCompany(id, body, file){
    console.info(`Comenzando validacion de tipos`);

    //Validamos parametro de la URL
    let { error } = validarId(id);

    if(error){
        //Si hay error, retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        return { status: 400, message: error.details[0].message };
    }
    else{
        //Armamos body para validacion de datos
        console.info('Enviando a validar tipos de datos en request');
        let valCompany = {
            typeId: body.type,
            rubroId: body.rubro,
            rut: body.companyRut,
            companyName: body.companyName,
            description: body.companyDescription,
            companyPhone: body.companyPhone,
            companyFirstStreet: body.companyFirstStreet,
            companySecondStreet: body.companySecondStreet,
            companyDoorNumber: body.companyDoorNumber,
            imageName: file ? file.filename : null,
            imagePath: file ? file.path : null
        };

        //Inicializo array de errores
        let errorMessage = [];

        //Enviamos a validar los datos
        console.info(`Comenzando validacion de tipos`);
        let { error: errorCompany} = validarCompany(valCompany);

        if(errorCompany) {
            //Si hay error, agregamos al array
            console.info('Errores encontrados en la validacion de tipos de company');
            errorCompany.details.map(e => {
                console.info(e.message);
                errorMessage.push(e.message);
                return;
            });
        }

        if(errorMessage.length > 0){
            //Si hay errores, retornamos
            console.info(`Se encontraron ${errorMessage.length} errores de tipo en la request`);
            errorMessage.map(err => console.log(err));
            console.info('Enviando response');
            return { status: 400, message: errorMessage };
        }
        else{
            console.info('Validacion de tipos exitosa');
            console.info('Comenzando validaciones de existencia');

            //Buscamos las entidades para validar existencia
            let { type, message: typeMessage } = await getTypeById(valCompany.typeId);
            let { rubro, message: rubroMessage } = await getRubroById(valCompany.rubroId);
            let { company: companyById, message: companyByIdMessage } = await getCompanyById(id);
            let { company: companyByRut } = await getCompanyByRut(valCompany.rut);
            let { company: companyByName } = await getCompanyByName(valCompany.companyName);

            //Agregamos mensajes de error en caso de que ocurran
            if(!type) errorMessage.push(typeMessage);
            if(!rubro) errorMessage.push(rubroMessage);
            if(!companyById) errorMessage.push(companyByIdMessage);
            if(companyByRut && companyByRut.id !== id) errorMessage.push(`Ya existe una compañia con Rut ${valCompany.rut}`);
            if(companyByName && companyByName.id !== id) errorMessage.push(`Ya existe una compañia con Nombre ${valCompany.companyName}`);

            if(errorMessage.length > 0){
                //Si hay errores, retornamos
                console.info(`Se encontraron ${errorMessage.length} errores de existencia en la request`);
                errorMessage.map(err => console.log(err));
                console.info('Enviando response');
                return { status: 400, message: errorMessage };
            }
            else{
                console.info('Validacion de existencia exitosas');
                console.info('Preparando objeto para update de Company');
                //Creamos body para update
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
                    imageName: valCompany.imageName ? valCompany.imageName : companyById.imageName,
                    imagePath: valCompany.imagePath ? valCompany.imagePath : companyById.imagePath,
                };

                //Enviamos a modificar la compania
                let { result, message } = await updateCompany(id, company);

                if(result){
                    //Si todo salio bien, retornamos
                    console.info(`Company con ID: ${id} actualizada correctamente`);
                    console.info('Preparando response');
                    return { status: 200, message: 'Modificacion exitosa' };
                }
                else{
                    //Si fallo damos error
                    console.info('No se pudo modificar company');
                    console.info('Preparando response');
                    return { status: 500, message: message };
                }
            }
        }
    }
}

//Endpoint para eliminar una compania
async function eliminarCompany(req, res){
    console.info(`Conexion DELETE entrante : /api/company/${req.params.id}`);

    //Validamos parametro de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        //Si hay error, retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info('Comenzando validaciones de existencia');

        //Obtenemos la compania
        let { company, message } = await getCompanyById(req.params.id);

        if(!company){
            //Si no se encontro, retornamos
            console.info(`No existe company con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message});
        }
        else{
            console.info('Enviando request para eliminacion');
            //Enviamos a borrar la compania (update que inserta timestamp en campo 'deleted')
            let { result, message } = await deleteCompany(req.params.id, new Date());
            
            if(result){
                //Si salio bien, retornamos
                console.info(`Company eliminada correctamente con ID: ${req.params.id}`);
                console.info('Preparando response');
                res.status(201).json({message});
            }
            else{
                //Si fallo damos error
                console.info('No se pudo eliminar company');
                console.info('Preparando response');
                res.status(500).json({message: message});
            }
        }
    }
}

//Auxiliar para obtener todas las companias no borradas
async function getCompanies(){
    console.info('Buscando companias no bloqueadas');
    let message = '';
    //Conectamos con las queries
    let companies = await queries
                        .companies
                        .getCompanies()
                        .then(data => {
                            //Si se consiguio la info
                            if(data){
                                console.info('Informacion de companias obtenida');
                                return data;
                            }
                            else{
                                //Si no se consiguieron datos
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

//Auxiliar para obtener todas las companias
async function getAllCompanies(){
    console.info('Buscando companias no bloqueadas');
    let message = '';
    //Conectamos con las queries
    let companies = await queries
                        .companies
                        .getAll()
                        .then(data => {
                            //Si se consiguio la info
                            if(data){
                                console.info('Informacion de companias obtenida');
                                return data;
                            }
                            else{
                                //Si no se consiguieron datos
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

//Auxiliar para obtener todas las companias borradas
async function getDeletedCompanies(){
    console.info('Buscando companias no bloqueadas');
    let message = '';
    //Conectamos con las queries
    let companies = await queries
                        .companies
                        .getDeleted()
                        .then(data => {
                            //Si se consiguio la info
                            if(data){
                                console.info('Informacion de companias obtenida');
                                return data;
                            }
                            else{
                                //Si no se consiguieron datos
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

//Auxiliar para obtener todas las companias filtrando por tipo
async function getCompaniesByType(id, type){
    console.info(`Buscando todas las companies de tipo ${type}`);
    let message = '';
    //Conectamos con las queries
    let companies = await queries
                        .companies
                        .getByType(id)
                        .then(data => {
                            //Si se consiguio la info   
                            if(data){
                                console.info('Informacion de companies obtenida');
                                return data;
                            }
                            else{
                                //Si no se consiguieron datos
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

//Auxiliar para obtener todas las companias filtrando por rubro
async function getCompaniesByRubro(id, rubro){
    console.info(`Buscando todas las companies de tipo ${rubro}`);
    let message = '';
    //Conectamos con las queries
    let companies = await queries
                        .companies
                        .getByRubro(id)
                        .then(data => {
                            //Si se consiguio la info
                            if(data){
                                console.info('Informacion de companies obtenida');
                                return data;
                            }
                            else{
                                //Si no se consiguieron datos
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

//Auxiliar para obtener todas las companias filtrando por ID
async function getCompanyById(id){
    console.info(`Buscando company con ID: ${id}`);
    let message = '';
    //Conectamos con las queries
    let company = await queries
                .companies
                .getOneById(id)
                .then(data => {
                    //Si se consiguio la info
                    if(data) {
                        console.info(`Company con ID: ${id} encontrada`);
                        return data;
                    }
                    else{
                        //Si no se consiguieron datos
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

//Auxiliar para obtener todas las companias filtrando por Rut
async function getCompanyByRut(rut){
    console.info(`Buscando company con Rut: ${rut}`);
    let message = '';
    //Conectamos con las queries
    let company = await queries
                .companies
                .getOneByRut(rut)
                .then(data => {
                    //Si se consiguio la info
                    if(data) {
                        console.info(`Company con Rut: ${rut} encontrada`);
                        return data;
                    }
                    else{
                        //Si no se consiguieron datos
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
    //Conectamos con las queries
    let company = await queries
                .companies
                .getOneByName(name)
                .then(data => {
                    //Si se consiguio la info
                    if(data) {
                        console.info(`Company con Nombre: ${name} encontrada`);
                        return data;
                    }
                    else{
                        //Si no se consiguieron datos
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

//Auxiliar para obtener todas las companias filtrando por nombre
async function insertCompany(company){
    console.info('Comenzando insert de Company');
    let message = '';
    //Conectamos con las queries
    let id = await queries
                    .companies
                    .insert(company)
                    .then(res => {
                        //Si se inserto correctamente
                        if(res){
                            console.info(`Insert de Company exitoso con ID: ${res[0]}`);
                            return res[0];
                        }
                        else{
                            //Si fallo
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

//Auxiliar para modificar una compania
async function updateCompany(id, company){
    console.info('Comenzando update de Company');
    let message = '';
    //Conectamos con las queries
    let result = await queries
                .companies
                .update(id, company)
                .then(res => {
                    //Si se actualizo correctamente
                    if(res){
                        console.info(`Update de Company con ID: ${id} existoso}`);
                        return res;
                    }
                    else{
                        //Si fallo
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

//Auxiliar para eliminar una compania
async function deleteCompany(id, date){
    console.info('Comenzando delete de Company');
    let message = '';
    //Conectamos con las queries
    let result = await queries
                .companies
                .delete(id, date)
                .then(res => {
                    //Si se elimino correctamente
                    if(res){
                        console.info(`Delete de Company existoso con ID: ${id}`);
                        message = `Company con ID:${id} eliminado correctamente`;
                        return res;
                    }
                    else{
                        //Si fallo
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

//Auxiliar para realizar rollback de registro de compania
async function rollbackInsertCompany(id){
    let message = '';
    //Conectamos con las queries
    let result = await queries
                    .companies
                    .rollback(id)
                    .then(res => {
                        return res;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de Company: ', err);
                        message += `Error en Query DELETE de Company: ${err}`;
                    });
    return { result, message };
}

//Endpoint para validar datos de registro de compania
function validarCompany(body){
    console.info('Comenzando validacion Joi de Company');
    //Creamos schema Joi
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
    //Validamos
    return Joi.validate(body, schema);
};

//Auxiliar para validar Rut
function validarRut(rut){
    console.info('Comenzando validacion Joi de Rut');
    //Cremoa schema Joi
    const schema = Joi.string().min(12).max(12).required();
    console.info('Finalizando validacion Joi de Rut');
    //Validamos
    return Joi.validate(rut, schema);
}

//Auxiliar para validar nombre
function validarName(name){
    console.info('Comenzando validacion Joi de Nombre');
    //Creamos schema Joi
    const schema = Joi.string().min(3).max(50).required();
    console.info('Finalizando validacion Joi de Nombre');
    //Validamos
    return Joi.validate(name, schema);
}

//Exportamos endpoints
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
    modificarCompanyVal,
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