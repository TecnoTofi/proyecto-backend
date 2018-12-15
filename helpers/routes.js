const Joi = require('joi');
const queries = require('./dbQueries');

//Categorias
async function obtenerCategories(req, res){
    console.info('Conexion GET entrante : /api/helper/category');

    let { categories, message } = await getCategories();

    if(categories){
        console.info(`${categories.length} categorias encontrados`);
        console.info('Preparando response');
        res.status(200).json({categories});
    }
    else{
        console.info('No se encontraron categorias');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

async function obtenerCategoryById(req, res){
    console.log(`Conexion GET entrante : /api/helper/category/${req.params.id}`);

    let { category, message } = await getCategoryById(req.params.id);

    if(category){
        console.info('Tipo encontrado');
        console.info('Preparando response');
        res.status(200).json({category});
    }
    else{
        console.info('No se encontro tipo');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

async function altaCategoria(req, res){
    console.info('Conexion POST entrante : /api/helper/category');

    if(!req.body.name){
        console.info('No se encontro nombre en la request');
        console.info('Preparando response');
        res.status(400).json({message: 'Debe enviar "name"'});
    }
    else{
        console.info('Enviando a validar tipos de datos en request');
        let { error } = validarRequest(req.body.name);

        if(error){
            console.info('Erorres encontrados en la request');
            console.info(error);
            console.info('Preparando response');
            res.status(400).json({error: error.details[0].message});
        }
        else{
            console.info('Validaciones de tipo de datos exitosa');
            console.info('Comenzando validaciones de existencia');

            let { category: existe, message: existeMessage } = await getCategoryByName(req.body.name);

            if(existe){
                console.info(`Ya existe categoria con nombre ${req.body.name}`);
                console.info('Preparando response');
                res.status(400).json({message: existeMessage});
            }
            else{
                console.info('Enviando request para insercion');
                let category = { name: req.body.name };
                let { id, message } = await insertCategory(category);
                
                if(id){
                    console.info(`Categoria insertada correctamente con ID: ${id}`);
                    console.info('Preparando response');
                    res.status(201).json({message: 'Alta exitosa', id: id});
                }
                else{
                    console.info('No se pudo insertar categoria');
                    console.info('Preparando response');
                    res.status(500).json({message: message});
                }
            }
        }
    }
}

async function modificarCategoria(req, res){
    console.info(`Conexion PUT entrante : /api/helper/category/${req.params.id}`);

    if(!req.body.name){
        console.info('No se encontro nombre en la request');
        console.info('Preparando response');
        res.status(400).json({message: 'Debe enviar "name"'});
    }
    else{
        console.info('Enviando a validar tipos de datos en request');
        let { error } = validarRequest(req.body.name);

        if(error){
            console.info('Erorres encontrados en la request');
            console.info(error);
            console.info('Preparando response');
            res.status(400).json({error: error.details[0].message});
        }
        else{
            console.info('Validaciones de tipo de datos exitosa');
            console.info('Comenzando validaciones de existencia');

            let { category: existeId, message: existeIdMessage } = await getCategoryById(req.params.id);
            let { category: existeName, message: existeNameMessage } = await getCategoryByName(req.body.name);

            if(!existeId){
                console.info(`No existe categoria con ID: ${req.params.id}`);
                console.info('Preparando response');
                res.status(400).json({existeIdMessage});
            }
            else if(existeName && existeName.id === req.params.id){
                console.info(`Categoria con ID: ${req.params.id} ya tiene nombre ${req.body.name}`);
                console.info('Preparando response');
                res.status(400).json({message: `Categoria con ID: ${req.params.id} ya tiene nombre ${req.body.name}`});
            }
            else if(existeName){
                console.info(`Ya existe categoria con nombre ${req.body.name}`);
                console.info('Preparando response');
                res.status(400).json({message: existeNameMessage});
            }
            else if(existeId){
                console.info('Enviando request para update');
                
                let { result, message } = await updateCategory(req.params.id, req.body.name);
                
                if(result){
                    console.info(`Categoria con ID: ${req.params.id} actualizado correctamente`);
                    console.info('Preparando response');
                    res.status(201).json({message: 'Modificacion exitosa'});
                }
                else{
                    console.info('No se pudo modificar categoria');
                    console.info('Preparando response');
                    res.status(500).json({message: message});
                }
            }
        }
    }
}

async function eliminarCategoria(req, res){
    console.info(`Conexion DELETE entrante : /api/helper/category/${req.params.id}`);

    console.info('Comenzando validaciones de existencia');

    let { category: existe, message: existeMessage } = await getCategoryById(req.params.id);

    if(!existe){
        console.info(`No existe categoria con ID: ${req.params.id}`);
        console.info('Preparando response');
        res.status(400).json({message: existeMessage});
    }
    else{
        console.info('Enviando request para eliminacion');
        let { result, message } = await deleteCategory(req.params.id);
        
        if(result){
            console.info(`Categoria eliminada correctamente con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(201).json({message});
        }
        else{
            console.info('No se pudo eliminar Tipo');
            console.info('Preparando response');
            res.status(500).json({message: message});
        }
    }
}

async function getCategories(){
    console.info('Buscando todos las categorias');
    let message = '';
    let categories = await queries
                        .categories
                        .getAll()
                        .then(data => {
                            if(data){
                                console.info('Informacion de categorias obtenida');
                                return data;
                            }
                            else{
                                console.info('No existen categorias registrados en la BD');
                                message = 'No existen categorias registrados en la BD';
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de Category : ${err}`);
                            message = 'Ocurrio un error al obtener las categorias';
                            return null;
                        });
    return { categories, message };
}

async function getCategoryById(id){
    console.info(`Buscando category con id: ${id}`);
    let message = '';
    let category = await queries
                    .categories
                    .getOneById(id)
                    .then(data => {
                        if(data){
                            console.info(`Category con ID: ${id} encontrado`);
                            return data;
                        }
                        else{
                            console.info(`No existe category con id: ${id}`);
                            message = `No existe un category con id ${id}`;
                            return null;
                        }
                    })
                    .catch(err => {
                        console.error(`Error en Query SELECT de Category : ${err}`);
                        message = 'Ocurrio un error al obtener la categoria';
                        return null;
                    });
    return { category, message };
}

async function getCategoryByName(name){
    console.info(`Buscando categoria con nombre: ${name}`);
    let message = '';
    let category = await queries
                    .categories
                    .getOneByName(name)
                    .then(data => {
                        if(data){
                            console.info(`Categoria con nombre: ${name} encontrado`);
                            message = `Ya existe categoria con nombre ${name}`;
                            return data;
                        }
                        else{
                            console.info(`No existe categoria con nombre: ${name}`);
                            message = `No existe un categoria con nombre ${name}`;
                            return null;
                        }
                    })
                    .catch(err => {
                        console.error(`Error en Query SELECT de Category : ${err}`);
                        message = 'Ocurrio un error al obtener la categoria';
                        return null;
                    });
    return { category, message };
}

async function insertCategory(category){
    console.info('Comenzando insert de Category');
    let message = '';
    let id = await queries
                .categories
                .insert(category)
                .then(res => {
                    if(res){
                        console.info(`Insert de Category existoso con ID: ${res[0]}`);
                        return res[0];
                    }
                    else{
                        console.info('Ocurrio un error');
                        message = 'Ocurrio un error al intertar dar de alta';
                        return 0;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query INSERT de Category: ${err}`);
                    message = 'Ocurrio un error al intertar dar de alta';
                    return 0;
                });
    return { id, message };
}

async function updateCategory(id, name){
    console.info('Comenzando update de Categoria');
    let message = '';
    let result = await queries
                .categories
                .update(id, name)
                .then(res => {
                    if(res){
                        console.info(`Update de Categoria con ID: ${id} existoso}`);
                        return res;
                    }
                    else{
                        console.info('Ocurrio un error');
                        message = 'Ocurrio un error al intertar modificar';
                        return 0;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query UPDATE de Category: ${err}`);
                    message = 'Ocurrio un error al intertar modificar';
                    return 0;
                });
    return { result, message };
}

async function deleteCategory(id){
    console.info('Comenzando delete de Categoria');
    let message = '';
    let result = await queries
                .categories
                .delete(id)
                .then(res => {
                    if(res){
                        console.info(`Delete de Categoria existoso con ID: ${id}`);
                        message = `Categoria con ID:${id} eliminada correctamente`;
                        return res;
                    }
                    else{
                        console.info('Ocurrio un error');
                        message = 'Ocurrio un error al intertar eliminar la categoria';
                        return 0;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query INSERT de Category: ${err}`);
                    message = 'Ocurrio un error al intertar eliminar la categoria';
                    return 0;
                });
    return { result, message };
}

//Rubros
async function obtenerRubros(req, res){
    console.info('Conexion GET entrante : /api/helper/rubro');

    let { rubros, message } = await getRubros();
    if(rubros){
        console.info(`${rubros.length} rubros encontrados`);
        console.info('Preparando response');
        res.status(200).json({rubros});
    }
    else{
        console.info('No se encontraron rubros');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

async function obtenerRubroById(req, res){
    console.log(`Conexion GET entrante : /api/helper/rubro/${req.params.id}`);

    let { rubro, message } = await getRubroById(req.params.id);

    if(rubro){
        console.info('Rubro encontrado');
        console.info('Preparando response');
        res.status(200).json({rubro});
    }
    else{
        console.info('No se encontro rubro');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

async function altaRubro(req, res){
    console.info('Conexion POST entrante : /api/helper/rubro');

    if(!req.body.name){
        console.info('No se encontro nombre en la request');
        console.info('Preparando response');
        res.status(400).json({message: 'Debe enviar "name"'});
    }
    else{
        console.info('Enviando a validar tipos de datos en request');
        let { error } = validarRequest(req.body.name);

        if(error){
            console.info('Erorres encontrados en la request');
            console.info(error);
            console.info('Preparando response');
            res.status(400).json({error: error.details[0].message});
        }
        else{
            console.info('Validaciones de tipo de datos exitosa');
            console.info('Comenzando validaciones de existencia');

            let { rubro: existe, message: existeMessage } = await getRubroByName(req.body.name);

            if(existe){
                console.info(`Ya existe rubro con nombre ${req.body.name}`);
                console.info('Preparando response');
                res.status(400).json({message: existeMessage});
            }
            else{
                console.info('Enviando request para insercion');
                let rubro = { name: req.body.name };
                let { id, message } = await insertRubro(rubro);
                
                if(id){
                    console.info(`Rubro insertado correctamente con ID: ${id}`);
                    console.info('Preparando response');
                    res.status(201).json({message});
                }
                else{
                    console.info('No se pudo insertar rubro');
                    console.info('Preparando response');
                    res.status(500).json({message: message});
                }
            }
        }
    }
}

async function modificarRubro(req, res){
    console.info(`Conexion PUT entrante : /api/helper/rubro/${req.params.id}`);

    if(!req.body.name){
        console.info('No se encontro nombre en la request');
        console.info('Preparando response');
        res.status(400).json({message: 'Debe enviar "name"'});
    }
    else{
        console.info('Enviando a validar tipos de datos en request');
        let { error } = validarRequest(req.body.name);

        if(error){
            console.info('Erorres encontrados en la request');
            console.info(error);
            console.info('Preparando response');
            res.status(400).json({error: error.details[0].message});
        }
        else{
            console.info('Validaciones de tipo de datos exitosa');
            console.info('Comenzando validaciones de existencia');

            let { rubro: existeId, message: existeIdMessage } = await getRubroById(req.params.id);
            let { rubro: existeName, message: existeNameMessage } = await getRubroByName(req.body.name);

            if(!existeId){
                console.info(`No existe rubro con ID: ${req.params.id}`);
                console.info('Preparando response');
                res.status(400).json({existeIdMessage});
            }
            else if(existeName && existeName.id === req.params.id){
                console.info(`Rubro con ID: ${req.params.id} ya tiene nombre ${req.body.name}`);
                console.info('Preparando response');
                res.status(400).json({message: `Rubro con ID: ${req.params.id} ya tiene nombre ${req.body.name}`});
            }
            else if(existeName){
                console.info(`Ya existe rubro con nombre ${req.body.name}`);
                console.info('Preparando response');
                res.status(400).json({message: existeNameMessage});
            }
            else if(existeId){
                console.info('Enviando request para update');
                
                let { result, message } = await updateRubro(req.params.id, req.body.name);
                
                if(result){
                    console.info(`Rubro con ID: ${req.params.id} actualizado correctamente`);
                    console.info('Preparando response');
                    res.status(201).json({message});
                }
                else{
                    console.info('No se pudo modificar rubro');
                    console.info('Preparando response');
                    res.status(500).json({message: message});
                }
            }
        }
    }
}

async function eliminarRubro(req, res){
    console.info(`Conexion DELETE entrante : /api/helper/rubro/${req.params.id}`);

    console.info('Comenzando validaciones de existencia');

    let { rubro: existe, message: existeMessage } = await getRubroById(req.params.id);

    if(!existe){
        console.info(`No existe rubro con ID: ${req.params.id}`);
        console.info('Preparando response');
        res.status(400).json({message: existeMessage});
    }
    else{
        console.info('Enviando request para eliminacion');
        let { result, message } = await deleteRubro(req.params.id);
        
        if(result){
            console.info(`Rubro eliminado correctamente con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(201).json({message});
        }
        else{
            console.info('No se pudo eliminar rubro');
            console.info('Preparando response');
            res.status(500).json({message: message});
        }
    }
}

async function getRubros(){
    console.info('Buscando todos los rubros');
    let message = '';
    let rubros = await queries
                        .rubros
                        .getAll()
                        .then(rubs => {
                            if(rubs){
                                console.info('Informacion de rubros obtenida');
                                return rubs;
                            }
                            else{
                                console.info('No existen rubros registrados en la BD');
                                message = 'No existen rubros registrados en la BD';
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de Rubro : ${err}`);
                            message = 'Ocurrio un error al obtener los rubros';
                            return null;
                        });
    return { rubros, message };
}

async function getRubroById(id){
    console.info(`Buscando rubro con id: ${id}`);
    let message = '';
    let rubro = await queries
                    .rubros
                    .getOneById(id)
                    .then(data => {
                        if(data){
                            console.info(`Rubro con ID: ${id} encontrado`);
                            return data;
                        }
                        else{
                            console.info(`No existe rubro con id: ${id}`);
                            message = `No existe un rubro con id ${id}`;
                            return null;
                        }
                    })
                    .catch(err => {
                        console.error(`Error en Query SELECT de Rubro : ${err}`);
                        message = 'Ocurrio un error al obtener el rubro';
                        return null;
                    });
    return { rubro, message };
}

async function getRubroByName(name){
    console.info(`Buscando rubro con nombre: ${name}`);
    let message = '';
    let rubro = await queries
                    .rubros
                    .getOneByName(name)
                    .then(data => {
                        if(data){
                            console.info(`Rubro con nombre: ${name} encontrado`);
                            message = `Ya existe rubro con nombre ${name}`;
                            return data;
                        }
                        else{
                            console.info(`No existe rubro con nombre: ${name}`);
                            message = `No existe un rubro con nombre ${name}`;
                            return null;
                        }
                    })
                    .catch(err => {
                        console.error(`Error en Query SELECT de Rubro : ${err}`);
                        message = 'Ocurrio un error al obtener el rubro';
                        return null;
                    });
    return { rubro, message };
}

async function insertRubro(rubro){
    console.info('Comenzando insert de Rubro');
    let message = '';
    let id = await queries
                .rubros
                .insert(rubro)
                .then(res => {
                    if(res){
                        console.info(`Insert de Rubro existoso con ID: ${res[0]}`);
                        message = `Rubro insertado correctamente con ID: ${res[0]}`;
                        return res[0];
                    }
                    else{
                        console.info('Ocurrio un error');
                        message = 'Ocurrio un error al intertar dar de alta';
                        return 0;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query INSERT de Rubro: ${err}`);
                    message = 'Ocurrio un error al intertar dar de alta';
                    return 0;
                });
    return { id, message };
}

async function updateRubro(id, name){
    console.info('Comenzando update de Rubro');
    let message = '';
    let result = await queries
                .rubros
                .update(id, name)
                .then(res => {
                    if(res){
                        console.info(`Update de Rubro con ID: ${id} existoso}`);
                        message = `Rubro con ID: ${id} actualizado correctamente`;
                        return res;
                    }
                    else{
                        console.info('Ocurrio un error');
                        message = 'Ocurrio un error al intertar modificar';
                        return 0;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query UPDATE de Rubro: ${err}`);
                    message = 'Ocurrio un error al intertar modificar';
                    return 0;
                });
    return { result, message };
}

async function deleteRubro(id){
    console.info('Comenzando delete de Rubro');
    let message = '';
    let result = await queries
                .rubros
                .delete(id)
                .then(res => {
                    if(res){
                        console.info(`Delete de Rubro existoso con ID: ${id}`);
                        message = `Rubro con ID:${id} eliminado correctamente`;
                        return res;
                    }
                    else{
                        console.info('Ocurrio un error');
                        message = 'Ocurrio un error al intertar eliminar el rubro';
                        return 0;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query INSERT de Type: ${err}`);
                    message = 'Ocurrio un error al intertar eliminar el rubro';
                    return 0;
                });
    return { result, message };
}

//Tipos
async function obtenerTypes(req, res){
    console.info('Conexion GET entrante : /api/helper/type');

    let { types, message } = await getTypes();

    if(types){
        console.info(`${types.length} tipos encontrados`);
        console.info('Preparando response');
        res.status(200).json({types});
    }
    else{
        console.info('No se encontraron tipos');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

async function obtenerTypesSignUp(req, res){
    console.log('Conexion GET entrante : /api/helper/type/signup');

    let { type: minorista, message: messageMin } = await getTypeByName('Minorista');
    let { type: mayorista, message: messageMay } = await getTypeByName('Mayorista');

    if(minorista && mayorista){
        console.info('Tipos encontrados');
        console.info('Preparando response');
        res.status(200).json({minorista, mayorista});
    }
    else{
        console.info('No se encontraron tipos');
        console.info('Preparando response');
        res.status(200).json({message: 'No se encontraron tipos'});
    }
}

async function obtenerTypeById(req, res){
    console.log(`Conexion GET entrante : /api/helper/type/${req.params.id}`);

    let { type, message } = await getTypeById(req.params.id);

    if(type){
        console.info('Tipo encontrado');
        console.info('Preparando response');
        res.status(200).json({type});
    }
    else{
        console.info('No se encontro tipo');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

async function altaType(req, res){
    console.info('Conexion POST entrante : /api/helper/type');

    if(!req.body.name){
        console.info('No se encontro nombre en la request');
        console.info('Preparando response');
        res.status(400).json({message: 'Debe enviar "name"'});
    }
    else{
        console.info('Enviando a validar tipos de datos en request');
        let { error } = validarRequest(req.body.name);

        if(error){
            console.info('Erorres encontrados en la request');
            console.info(error);
            console.info('Preparando response');
            res.status(400).json({error: error.details[0].message});
        }
        else{
            console.info('Validaciones de tipo de datos exitosa');
            console.info('Comenzando validaciones de existencia');

            let { type: existe, message: existeMessage } = await getTypeByName(req.body.name);

            if(existe){
                console.info(`Ya existe tipo con nombre ${req.body.name}`);
                console.info('Preparando response');
                res.status(400).json({message: existeMessage});
            }
            else{
                console.info('Enviando request para insercion');
                let type = { name: req.body.name };
                let { id, message } = await insertType(type);
                
                if(id){
                    console.info(`Tipo insertado correctamente con ID: ${id}`);
                    console.info('Preparando response');
                    res.status(201).json({message});
                }
                else{
                    console.info('No se pudo insertar tipo');
                    console.info('Preparando response');
                    res.status(500).json({message: message});
                }
            }
        }
    }
}

async function modificarType(req, res){
    console.info(`Conexion PUT entrante : /api/helper/type/${req.params.id}`);

    if(!req.body.name){
        console.info('No se encontro nombre en la request');
        console.info('Preparando response');
        res.status(400).json({message: 'Debe enviar "name"'});
    }
    else{
        console.info('Enviando a validar tipos de datos en request');
        let { error } = validarRequest(req.body.name);

        if(error){
            console.info('Erorres encontrados en la request');
            console.info(error);
            console.info('Preparando response');
            res.status(400).json({error: error.details[0].message});
        }
        else{
            console.info('Validaciones de tipo de datos exitosa');
            console.info('Comenzando validaciones de existencia');

            let { type: existeId, message: existeIdMessage } = await getTypeById(req.params.id);
            let { type: existeName, message: existeNameMessage } = await getTypeByName(req.body.name);

            if(!existeId){
                console.info(`No existe tipo con ID: ${req.params.id}`);
                console.info('Preparando response');
                res.status(400).json({message: existeIdMessage});
            }
            else if(existeName && existeName.id === req.params.id){
                console.info(`Tipo con ID: ${req.params.id} ya tiene nombre ${req.body.name}`);
                console.info('Preparando response');
                res.status(400).json({message: `Tipo con ID: ${req.params.id} ya tiene nombre ${req.body.name}`});
            }
            else if(existeName){
                console.info(`Ya existe tipo con nombre ${req.body.name}`);
                console.info('Preparando response');
                res.status(400).json({message: existeNameMessage});
            }
            else if(existeId){
                console.info('Enviando request para update');
                
                let { result, message } = await updateType(req.params.id, req.body.name);
                
                if(result){
                    console.info(`Tipo con ID: ${req.params.id} actualizado correctamente`);
                    console.info('Preparando response');
                    res.status(201).json({message});
                }
                else{
                    console.info('No se pudo modificar tipo');
                    console.info('Preparando response');
                    res.status(500).json({message: message});
                }
            }
        }
    }
}

async function eliminarType(req, res){
    console.info(`Conexion DELETE entrante : /api/helper/type/${req.params.id}`);

    console.info('Comenzando validaciones de existencia');

    let { type: existe, message: existeMessage } = await getTypeById(req.params.id);

    if(!existe){
        console.info(`No existe tipo con ID: ${req.params.id}`);
        console.info('Preparando response');
        res.status(400).json({message: existeMessage});
    }
    else{
        console.info('Enviando request para eliminacion');
        let { result, message } = await deleteType(req.params.id);
        
        if(result){
            console.info(`Tipo eliminado correctamente con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(201).json({message});
        }
        else{
            console.info('No se pudo eliminar tipo');
            console.info('Preparando response');
            res.status(500).json({message: message});
        }
    }
}

async function getTypes(){
    console.info('Buscando todos los tipos');
    let message = '';
    let types = await queries
                        .types
                        .getAll()
                        .then(data => {
                            if(data){
                                console.info('Informacion de tipos obtenida');
                                return data
                            }
                            else{
                                console.info('No existen tipos registrados en la BD');
                                message = 'No existen tipos registrados en la BD';
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de Type : ${err}`);
                            message = 'Ocurrio un error al obtener los tipos';
                            return null;
                        });
    return { types, message };
}

async function getTypeById(id){
    console.info(`Buscando tipo con id: ${id}`);
    let message = '';
    let type = await queries
                    .types
                    .getOneById(id)
                    .then(data => {
                        if(data){
                            console.info(`Tipo con ID: ${id} encontrado`);
                            return data;
                        }
                        else{
                            console.info(`No existe tipo con id: ${id}`);
                            message = `No existe un tipo con id ${id}`;
                            return null;
                        }
                    })
                    .catch(err => {
                        console.error(`Error en Query SELECT de Type : ${err}`);
                        message = 'Ocurrio un error al obtener el tipo';
                        return null;
                    });
    return { type, message };
}

async function getTypeByName(name){
    console.info(`Buscando tipo con nombre: ${name}`);
    let message = '';
    let type = await queries
                    .types
                    .getOneByName(name)
                    .then(data => {
                        if(data){
                            console.info(`Tipo con nombre: ${name} encontrado`);
                            message = `Ya existe tipo con nombre ${name}`;
                            return data;
                        }
                        else{
                            console.info(`No existe tipo con nombre: ${name}`);
                            message = `No existe un tipo con nombre ${name}`;
                            return null;
                        }
                    })
                    .catch(err => {
                        console.error(`Error en Query SELECT de Type : ${err}`);
                        message = 'Ocurrio un error al obtener el tipo';
                        return null;
                    });
    return { type, message };
}

async function insertType(type){
    console.info('Comenzando insert de Tipo');
    let message = '';
    let id = await queries
                .types
                .insert(type)
                .then(res => {
                    if(res){
                        console.info(`Insert de Tipo existoso con ID: ${res[0]}`);
                        message = `Tipo insertado correctamente con ID: ${res[0]}`;
                        return res[0];
                    }
                    else{
                        console.info('Ocurrio un error');
                        message = 'Ocurrio un error al intertar dar de alta';
                        return 0;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query INSERT de Type: ${err}`);
                    message = 'Ocurrio un error al intertar dar de alta';
                    return 0;
                });
    return { id, message };
}

async function updateType(id, name){
    console.info('Comenzando update de Tipo');
    let message = '';
    let result = await queries
                .types
                .update(id, name)
                .then(res => {
                    if(res){
                        console.info(`Update de Tipo con ID: ${id} existoso}`);
                        message = `Tipo con ID: ${id} actualizado correctamente`;
                        return res;
                    }
                    else{
                        console.info('Ocurrio un error');
                        message = 'Ocurrio un error al intertar modificar';
                        return 0;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query UPDATE de Type: ${err}`);
                    message = 'Ocurrio un error al intertar modificar';
                    return 0;
                });
    return { result, message };
}

async function deleteType(id){
    console.info('Comenzando delete de Tipo');
    let message = '';
    let result = await queries
                .types
                .delete(id)
                .then(res => {
                    if(res){
                        console.info(`Delete de Tipo existoso con ID: ${id}`);
                        message = `Tipo con ID:${id} eliminado correctamente`;
                        return res;
                    }
                    else{
                        console.info('Ocurrio un error');
                        message = 'Ocurrio un error al intertar eliminar el tipo';
                        return 0;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query INSERT de Type: ${err}`);
                    message = 'Ocurrio un error al intertar eliminar el tipo';
                    return 0;
                });
    return { result, message };
}

function validarRequest(type){
    const schema = Joi.string().required();

    return Joi.validate(type, schema);
}

module.exports = {
    obtenerCategories,
    obtenerCategoryById,
    altaCategoria,
    modificarCategoria,
    eliminarCategoria,
    getCategories,
    getCategoryById,
    getCategoryByName,
    insertCategory,
    updateCategory,
    deleteCategory,
    obtenerRubros,
    obtenerRubroById,
    altaRubro,
    modificarRubro,
    eliminarRubro,
    getRubros,
    getRubroById,
    getRubroByName,
    insertRubro,
    updateRubro,
    deleteRubro,
    obtenerTypes,
    obtenerTypesSignUp,
    obtenerTypeById,
    altaType,
    modificarType,
    eliminarType,
    getTypes,
    getTypeById,
    getTypeByName,
    insertType,
    updateType,
    deleteType
};