//Incluimos Joi para validaciones
const Joi = require('joi');
//Incluimos queries de DB
const queries = require('./dbQueries');

//Categorias

//Endpoint para obtener todas las categorias
async function obtenerCategories(req, res){
    console.info('Conexion GET entrante : /api/helper/category');

    //Obtenemos los datos
    let { categories, message } = await getCategories();

    if(categories){
        //Retornamos los datos
        console.info(`${categories.length} categorias encontrados`);
        console.info('Preparando response');
        res.status(200).json({categories});
    }
    else{
        //Si fallo, damos error
        console.info('No se encontraron categorias');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

//Endpoint para obtener cateogiras filtrando por ID
async function obtenerCategoryById(req, res){
    console.log(`Conexion GET entrante : /api/helper/category/${req.params.id}`);

    //Validamos parametros de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        //Si hay error, retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        //Obtenemos los datos
        let { category, message } = await getCategoryById(req.params.id);

        if(category){
            //Retornamos los datos
            console.info('Categoria encontrado');
            console.info('Preparando response');
            res.status(200).json({category});
        }
        else{
            //Si fallo, damos error
            console.info('No se encontro tipo');
            console.info('Preparando response');
            res.status(200).json({message});
        }
    }
}

//Endpoint para registrar una nueva categoria
async function altaCategory(req, res){
    console.info('Conexion POST entrante : /api/helper/category');

    //Validamos parametros de la request
    if(!req.body.name){
        console.info('No se encontro nombre en la request');
        console.info('Preparando response');
        res.status(400).json({message: 'Debe enviar "name"'});
    }
    else{
        //Validamos parametros de la request
        console.info('Enviando a validar tipos de datos en request');
        let { error } = validarRequest(req.body.name);

        if(error){
            //Si hay error, retornamos
            console.info('Erorres encontrados en la request');
            console.info(error);
            console.info('Preparando response');
            res.status(400).json({error: error.details[0].message});
        }
        else{
            console.info('Validaciones de tipo de datos exitosa');
            console.info('Comenzando validaciones de existencia');

            //Obtenemos los datos
            let { category: existe, message: existeMessage } = await getCategoryByName(req.body.name);

            if(existe){
                //Si ya existe, retornamos por repetido
                console.info(`Ya existe categoria con nombre ${req.body.name}`);
                console.info('Preparando response');
                res.status(400).json({message: existeMessage});
            }
            else{
                //Si no existe, llamamos auxiliar para registro de categoria
                console.info('Enviando request para insercion');
                let category = { name: req.body.name };
                let { id, message } = await insertCategory(category);
                
                if(id){
                    //Si fue exitoso, retornamos OK
                    console.info(`Categoria insertada correctamente con ID: ${id}`);
                    console.info('Preparando response');
                    res.status(201).json({message: 'Alta exitosa', id: id});
                }
                else{
                    //Si fallo damos error
                    console.info('No se pudo insertar categoria');
                    console.info('Preparando response');
                    res.status(500).json({message: message});
                }
            }
        }
    }
}

//Endpoint para modificar una categoria existente
async function modificarCategory(req, res){
    console.info(`Conexion PUT entrante : /api/helper/category/${req.params.id}`);

    //Validamos parametros de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        //Si hay error, retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        //Validamos parametros de la request
        if(!req.body.name){
            console.info('No se encontro nombre en la request');
            console.info('Preparando response');
            res.status(400).json({message: 'Debe enviar "name"'});
        }
        else{
            //Validamos datos
            console.info('Enviando a validar tipos de datos en request');
            let { error } = validarRequest(req.body.name);
    
            if(error){
                //Si hay error, retornamos
                console.info('Erorres encontrados en la request');
                console.info(error);
                console.info('Preparando response');
                res.status(400).json({error: error.details[0].message});
            }
            else{
                console.info('Validaciones de tipo de datos exitosa');
                console.info('Comenzando validaciones de existencia');
    
                //Obtenemos los datos
                let { category: existeId, message: existeIdMessage } = await getCategoryById(req.params.id);
                let { category: existeName, message: existeNameMessage } = await getCategoryByName(req.body.name);
    
                if(!existeId){
                    //Si no existe, retornamos
                    console.info(`No existe categoria con ID: ${req.params.id}`);
                    console.info('Preparando response');
                    res.status(400).json({existeIdMessage});
                }
                else if(existeName && existeName.id === req.params.id){
                    //Verificamos que sea modificacion valida
                    console.info(`Categoria con ID: ${req.params.id} ya tiene nombre ${req.body.name}`);
                    console.info('Preparando response');
                    res.status(400).json({message: `Categoria con ID: ${req.params.id} ya tiene nombre ${req.body.name}`});
                }
                else if(existeName){
                    //Verificamos que no se repita
                    console.info(`Ya existe categoria con nombre ${req.body.name}`);
                    console.info('Preparando response');
                    res.status(400).json({message: existeNameMessage});
                }
                else if(existeId){
                    console.info('Enviando request para update');

                    //Si esta todo bien, llamamos auxiliar para modificacion de categoria
                    let { result, message } = await updateCategory(req.params.id, req.body.name);
                    
                    if(result){
                        //Si fue exitoso, retornamos OK
                        console.info(`Categoria con ID: ${req.params.id} actualizado correctamente`);
                        console.info('Preparando response');
                        res.status(200).json({message: 'Modificacion exitosa'});
                    }
                    else{
                        //Si fallo damos error
                        console.info('No se pudo modificar categoria');
                        console.info('Preparando response');
                        res.status(500).json({message: message});
                    }
                }
            }
        }
    }
}

//Endpoint para eliminar una categoria existente (fisico)
async function eliminarCategory(req, res){
    console.info(`Conexion DELETE entrante : /api/helper/category/${req.params.id}`);

    //Validamos parametros de la URL
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

        //Obtenemos datos
        let { category: existe, message: existeMessage } = await getCategoryById(req.params.id);

        if(!existe){
            //Si no existe, retornamos
            console.info(`No existe categoria con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message: existeMessage});
        }
        else{
            //Si existe, llamamos auxiliar para eliminar categorias
            console.info('Enviando request para eliminacion');
            let { result, message } = await deleteCategory(req.params.id);
            
            if(result){
                //Si fue exitoso, retornamos OK
                console.info(`Categoria eliminada correctamente con ID: ${req.params.id}`);
                console.info('Preparando response');
                res.status(201).json({message});
            }
            else{
                //Si fallo damos error
                console.info('No se pudo eliminar Tipo');
                console.info('Preparando response');
                res.status(500).json({message: message});
            }
        }
    }
}

//Auxiliar para obtener todas las categorias
async function getCategories(){
    console.info('Buscando todos las categorias');
    let message = '';
    //Conectamos con las queries
    let categories = await queries
                        .categories
                        .getAll()
                        .then(data => {
                            //Si se consiguio la info
                            if(data){
                                console.info('Informacion de categorias obtenida');
                                return data;
                            }
                            else{
                                //Si no se consiguieron datos
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
//Auxiliar para obtener categorias filtrando por ID
async function getCategoryById(id){
    console.info(`Buscando category con ID: ${id}`);
    let message = '';
    //Conectamos con las queries
    let category = await queries
                    .categories
                    .getOneById(id)
                    .then(data => {
                        //Si se consiguio la info
                        if(data){
                            console.info(`Category con ID: ${id} encontrado`);
                            return data;
                        }
                        else{
                            //Si no se consiguieron datos
                            console.info(`No existe category con ID: ${id}`);
                            message = `No existe un category con ID ${id}`;
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

//Auxiliar para obtener categorias filtrando por nombre
async function getCategoryByName(name){
    console.info(`Buscando categoria con nombre: ${name}`);
    let message = '';
    //Conectamos con las queries
    let category = await queries
                    .categories
                    .getOneByName(name)
                    .then(data => {
                        //Si se consiguio la info
                        if(data){
                            console.info(`Categoria con nombre: ${name} encontrado`);
                            message = `Ya existe categoria con nombre ${name}`;
                            return data;
                        }
                        else{
                            //Si no se consiguieron datos
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

//Auxiliar para insertar nueva categoria
async function insertCategory(category){
    console.info('Comenzando insert de Category');
    let message = '';
    //Conectamos con las queries
    let id = await queries
                .categories
                .insert(category)
                .then(res => {
                    //Si se inserto correctamente
                    if(res){
                        console.info(`Insert de Category existoso con ID: ${res[0]}`);
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
                    console.error(`Error en Query INSERT de Category: ${err}`);
                    message = 'Ocurrio un error al intertar dar de alta';
                    return 0;
                });
    return { id, message };
}

//Auxiliar para modificar categoria existente
async function updateCategory(id, name){
    console.info('Comenzando update de Categoria');
    let message = '';
    //Conectamos con las queries
    let result = await queries
                .categories
                .update(id, name)
                .then(res => {
                    //Si se modifico correctamente
                    if(res){
                        console.info(`Update de Categoria con ID: ${id} existoso}`);
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
                    console.error(`Error en Query UPDATE de Category: ${err}`);
                    message = 'Ocurrio un error al intertar modificar';
                    return 0;
                });
    return { result, message };
}

//Auxiliar para eliminar categoria existente (fisico)
async function deleteCategory(id){
    console.info('Comenzando delete de Categoria');
    let message = '';
    //Conectamos con las queries
    let result = await queries
                .categories
                .delete(id)
                .then(res => {
                    //Si se inserto correctamente
                    if(res){
                        console.info(`Delete de Categoria existoso con ID: ${id}`);
                        message = `Categoria con ID:${id} eliminada correctamente`;
                        return res;
                    }
                    else{
                        //Si fallo
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

//Enpoint para obtener todos los rubros
async function obtenerRubros(req, res){
    console.info('Conexion GET entrante : /api/helper/rubro');

    //Obtenemos los datos
    let { rubros, message } = await getRubros();

    if(rubros){
        //Retornamos los datos
        console.info(`${rubros.length} rubros encontrados`);
        console.info('Preparando response');
        res.status(200).json({rubros});
    }
    else{
        //Si fallo, damos error
        console.info('No se encontraron rubros');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

//Enpoint para obtener rubros filtrando por ID
async function obtenerRubroById(req, res){
    console.log(`Conexion GET entrante : /api/helper/rubro/${req.params.id}`);

    //Validamos parametros de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        //Si hay error, retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        //Obtenemos los datos
        let { rubro, message } = await getRubroById(req.params.id);

        if(rubro){
            //Retornamos los datos
            console.info('Rubro encontrado');
            console.info('Preparando response');
            res.status(200).json({rubro});
        }
        else{
            //Si fallo, damos error
            console.info('No se encontro rubro');
            console.info('Preparando response');
            res.status(200).json({message});
        }
    }
}

//Enpoint para registrar un nuevo rubro
async function altaRubro(req, res){
    console.info('Conexion POST entrante : /api/helper/rubro');

    //Validamos parametros de la request
    if(!req.body.name){
        console.info('No se encontro nombre en la request');
        console.info('Preparando response');
        res.status(400).json({message: 'Debe enviar "name"'});
    }
    else{
        //Validamos parametros de la request
        console.info('Enviando a validar tipos de datos en request');
        let { error } = validarRequest(req.body.name);

        if(error){
            //Si hay error, retornamos
            console.info('Erorres encontrados en la request');
            console.info(error);
            console.info('Preparando response');
            res.status(400).json({error: error.details[0].message});
        }
        else{
            console.info('Validaciones de tipo de datos exitosa');
            console.info('Comenzando validaciones de existencia');

            //Obtenemos los datos
            let { rubro: existe, message: existeMessage } = await getRubroByName(req.body.name);

            if(existe){
                //Si ya existe, retornamos por repetido
                console.info(`Ya existe rubro con nombre ${req.body.name}`);
                console.info('Preparando response');
                res.status(400).json({message: existeMessage});
            }
            else{
                //Si no existe, llamamos auxiliar para registro de rubro
                console.info('Enviando request para insercion');
                let rubro = { name: req.body.name };
                let { id, message } = await insertRubro(rubro);
                
                if(id){
                    //Si fue exitoso, retornamos OK
                    console.info(`Rubro insertado correctamente con ID: ${id}`);
                    console.info('Preparando response');
                    res.status(201).json({message});
                }
                else{
                    //Si fallo damos error
                    console.info('No se pudo insertar rubro');
                    console.info('Preparando response');
                    res.status(500).json({message: message});
                }
            }
        }
    }
}

//Enpoint para modificar un rubro existente
async function modificarRubro(req, res){
    console.info(`Conexion PUT entrante : /api/helper/rubro/${req.params.id}`);

    //Validamos parametros de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        //Si hay error, retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        if(!req.body.name){
            //Validamos parametros de la request
            console.info('No se encontro nombre en la request');
            console.info('Preparando response');
            res.status(400).json({message: 'Debe enviar "name"'});
        }
        else{
            //Validamos datos
            console.info('Enviando a validar tipos de datos en request');
            let { error } = validarRequest(req.body.name);
    
            if(error){
                //Si hay error, retornamos
                console.info('Erorres encontrados en la request');
                console.info(error);
                console.info('Preparando response');
                res.status(400).json({error: error.details[0].message});
            }
            else{
                console.info('Validaciones de tipo de datos exitosa');
                console.info('Comenzando validaciones de existencia');
    
                //Obtenemos los datos
                let { rubro: existeId, message: existeIdMessage } = await getRubroById(req.params.id);
                let { rubro: existeName, message: existeNameMessage } = await getRubroByName(req.body.name);
    
                if(!existeId){
                    //Si no existe, retornamos
                    console.info(`No existe rubro con ID: ${req.params.id}`);
                    console.info('Preparando response');
                    res.status(400).json({existeIdMessage});
                }
                else if(existeName && existeName.id === req.params.id){
                    //Verificamos que sea modificacion valida
                    console.info(`Rubro con ID: ${req.params.id} ya tiene nombre ${req.body.name}`);
                    console.info('Preparando response');
                    res.status(400).json({message: `Rubro con ID: ${req.params.id} ya tiene nombre ${req.body.name}`});
                }
                else if(existeName){
                    //Verificamos que no se repita
                    console.info(`Ya existe rubro con nombre ${req.body.name}`);
                    console.info('Preparando response');
                    res.status(400).json({message: existeNameMessage});
                }
                else if(existeId){
                    console.info('Enviando request para update');
                    
                    //Si esta todo bien, llamamos auxiliar para modificacion de rubro
                    let { result, message } = await updateRubro(req.params.id, req.body.name);
                    
                    if(result){
                        //Si fue exitoso, retornamos OK
                        console.info(`Rubro con ID: ${req.params.id} actualizado correctamente`);
                        console.info('Preparando response');
                        res.status(200).json({message});
                    }
                    else{
                        //Si fallo damos error
                        console.info('No se pudo modificar rubro');
                        console.info('Preparando response');
                        res.status(500).json({message: message});
                    }
                }
            }
        }
    }
}

//Enpoint para eliminar un rubro existente (fisico)
async function eliminarRubro(req, res){
    console.info(`Conexion DELETE entrante : /api/helper/rubro/${req.params.id}`);

    //Validamos parametros de la URL
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

        //Obtenemos datos
        let { rubro: existe, message: existeMessage } = await getRubroById(req.params.id);

        if(!existe){
            //Si no existe, retornamos
            console.info(`No existe rubro con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message: existeMessage});
        }
        else{
            //Si existe, llamamos auxiliar para eliminar categorias
            console.info('Enviando request para eliminacion');
            let { result, message } = await deleteRubro(req.params.id);
            
            if(result){
                //Si fue exitoso, retornamos OK
                console.info(`Rubro eliminado correctamente con ID: ${req.params.id}`);
                console.info('Preparando response');
                res.status(201).json({message});
            }
            else{
                //Si fallo damos error
                console.info('No se pudo eliminar rubro');
                console.info('Preparando response');
                res.status(500).json({message: message});
            }
        }
    }
}

//Auxiliar para obtener todos los rubros
async function getRubros(){
    console.info('Buscando todos los rubros');
    let message = '';
    //Conectamos con las queries
    let rubros = await queries
                        .rubros
                        .getAll()
                        .then(rubs => {
                            //Si se consiguio la info
                            if(rubs){
                                console.info('Informacion de rubros obtenida');
                                return rubs;
                            }
                            else{
                                //Si no se consiguieron datos
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

//Auiliar para obtener rubros filtrando por ID
async function getRubroById(id){
    console.info(`Buscando rubro con ID: ${id}`);
    let message = '';
    //Conectamos con las queries
    let rubro = await queries
                    .rubros
                    .getOneById(id)
                    .then(data => {
                        //Si se consiguio la info
                        if(data){
                            console.info(`Rubro con ID: ${id} encontrado`);
                            return data;
                        }
                        else{
                            //Si no se consiguieron datos
                            console.info(`No existe rubro con ID: ${id}`);
                            message = `No existe un rubro con ID ${id}`;
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

//Auxiliar para obtener rubros filtrando por nombre
async function getRubroByName(name){
    console.info(`Buscando rubro con nombre: ${name}`);
    let message = '';
    //Conectamos con las queries
    let rubro = await queries
                    .rubros
                    .getOneByName(name)
                    .then(data => {
                        //Si se consiguio la info
                        if(data){
                            console.info(`Rubro con nombre: ${name} encontrado`);
                            message = `Ya existe rubro con nombre ${name}`;
                            return data;
                        }
                        else{
                            //Si no se consiguieron datos
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

//Auxiliar para registrar nuevos rubro
async function insertRubro(rubro){
    console.info('Comenzando insert de Rubro');
    let message = '';
    //Conectamos con las queries
    let id = await queries
                .rubros
                .insert(rubro)
                .then(res => {
                    //Si se inserto correctamente
                    if(res){
                        console.info(`Insert de Rubro existoso con ID: ${res[0]}`);
                        message = `Rubro insertado correctamente con ID: ${res[0]}`;
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
                    console.error(`Error en Query INSERT de Rubro: ${err}`);
                    message = 'Ocurrio un error al intertar dar de alta';
                    return 0;
                });
    return { id, message };
}

//Auxiliar para modificar rubros existentes
async function updateRubro(id, name){
    console.info('Comenzando update de Rubro');
    let message = '';
    //Conectamos con las queries
    let result = await queries
                .rubros
                .update(id, name)
                .then(res => {
                    //Si se modifico correctamente
                    if(res){
                        console.info(`Update de Rubro con ID: ${id} existoso}`);
                        message = `Rubro con ID: ${id} actualizado correctamente`;
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
                    console.error(`Error en Query UPDATE de Rubro: ${err}`);
                    message = 'Ocurrio un error al intertar modificar';
                    return 0;
                });
    return { result, message };
}

//Auxiliar para elimininar rubros existentes (fisico)
async function deleteRubro(id){
    console.info('Comenzando delete de Rubro');
    let message = '';
    //Conectamos con las queries
    let result = await queries
                .rubros
                .delete(id)
                .then(res => {
                    //Si se inserto correctamente
                    if(res){
                        console.info(`Delete de Rubro existoso con ID: ${id}`);
                        message = `Rubro con ID:${id} eliminado correctamente`;
                        return res;
                    }
                    else{
                        //Si fallo
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

//Endpoint para obtener todos los tipos
async function obtenerTypes(req, res){
    console.info('Conexion GET entrante : /api/helper/type');

    //Obtenemos los datos
    let { types, message } = await getTypes();

    if(types){
        //Retornamos los datos
        console.info(`${types.length} tipos encontrados`);
        console.info('Preparando response');
        res.status(200).json({types});
    }
    else{
        //Si fallo, damos error
        console.info('No se encontraron tipos');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

//Endpoint para obtener tipos especificos para el formulario de registro de usuario - company
async function obtenerTypesSignUp(req, res){
    console.log('Conexion GET entrante : /api/helper/type/signup');

    //Obtenemos los datos
    let { type: minorista, message: messageMin } = await getTypeByName('Minorista');
    let { type: mayorista, message: messageMay } = await getTypeByName('Mayorista');

    if(minorista && mayorista){
        //Retornamos los datos
        console.info('Tipos encontrados');
        console.info('Preparando response');
        res.status(200).json({minorista, mayorista});
    }
    else{
        //Si fallo, damos error
        console.info('No se encontraron tipos');
        console.info('Preparando response');
        res.status(200).json({message: 'No se encontraron tipos'});
    }
}

//Endpoint para obtener tipos filtrando por ID
async function obtenerTypeById(req, res){
    console.log(`Conexion GET entrante : /api/helper/type/${req.params.id}`);

    //Validamos parametros de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        //Si hay error, retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        //Obtenemos los datos
        let { type, message } = await getTypeById(req.params.id);

        if(type){
            //Retornamos los datos
            console.info('Tipo encontrado');
            console.info('Preparando response');
            res.status(200).json({type});
        }
        else{
            //Si fallo, damos error
            console.info('No se encontro tipo');
            console.info('Preparando response');
            res.status(200).json({message});
        }
    }
}

//Endpoint para registrar nuevos tipos
async function altaType(req, res){
    console.info('Conexion POST entrante : /api/helper/type');

    //Validamos parametros de la request
    if(!req.body.name){
        console.info('No se encontro nombre en la request');
        console.info('Preparando response');
        res.status(400).json({message: 'Debe enviar "name"'});
    }
    else{
        //Validamos parametros de la request
        console.info('Enviando a validar tipos de datos en request');
        let { error } = validarRequest(req.body.name);

        if(error){
            //Si hay error, retornamos
            console.info('Erorres encontrados en la request');
            console.info(error);
            console.info('Preparando response');
            res.status(400).json({error: error.details[0].message});
        }
        else{
            console.info('Validaciones de tipo de datos exitosa');
            console.info('Comenzando validaciones de existencia');

            //Obtenemos los datos
            let { type: existe, message: existeMessage } = await getTypeByName(req.body.name);

            if(existe){
                //Si ya existe, retornamos por repetido
                console.info(`Ya existe tipo con nombre ${req.body.name}`);
                console.info('Preparando response');
                res.status(400).json({message: existeMessage});
            }
            else{
                //Si no existe, llamamos auxiliar para registro de tipo
                console.info('Enviando request para insercion');
                let type = { name: req.body.name };
                let { id, message } = await insertType(type);
                
                if(id){
                    //Si fue exitoso, retornamos OK
                    console.info(`Tipo insertado correctamente con ID: ${id}`);
                    console.info('Preparando response');
                    res.status(201).json({message});
                }
                else{
                    //Si fallo damos error
                    console.info('No se pudo insertar tipo');
                    console.info('Preparando response');
                    res.status(500).json({message: message});
                }
            }
        }
    }
}

//Endpoint para modificar tipos existentes
async function modificarType(req, res){
    console.info(`Conexion PUT entrante : /api/helper/type/${req.params.id}`);

    //Validamos parametros de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        //Si hay error, retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        //Validamos parametros de la request
        if(!req.body.name){
            console.info('No se encontro nombre en la request');
            console.info('Preparando response');
            res.status(400).json({message: 'Debe enviar "name"'});
        }
        else{
            //Validamos datos
            console.info('Enviando a validar tipos de datos en request');
            let { error } = validarRequest(req.body.name);
    
            if(error){
                //Si hay error, retornamos
                console.info('Erorres encontrados en la request');
                console.info(error);
                console.info('Preparando response');
                res.status(400).json({error: error.details[0].message});
            }
            else{
                console.info('Validaciones de tipo de datos exitosa');
                console.info('Comenzando validaciones de existencia');
    
                //Obtenemos los datos
                let { type: existeId, message: existeIdMessage } = await getTypeById(req.params.id);
                let { type: existeName, message: existeNameMessage } = await getTypeByName(req.body.name);
    
                if(!existeId){
                    //Si no existe, retornamos
                    console.info(`No existe tipo con ID: ${req.params.id}`);
                    console.info('Preparando response');
                    res.status(400).json({message: existeIdMessage});
                }
                else if(existeName && existeName.id === req.params.id){
                    //Verificamos que sea modificacion valida
                    console.info(`Tipo con ID: ${req.params.id} ya tiene nombre ${req.body.name}`);
                    console.info('Preparando response');
                    res.status(400).json({message: `Tipo con ID: ${req.params.id} ya tiene nombre ${req.body.name}`});
                }
                else if(existeName){
                    //Verificamos que no se repita
                    console.info(`Ya existe tipo con nombre ${req.body.name}`);
                    console.info('Preparando response');
                    res.status(400).json({message: existeNameMessage});
                }
                else if(existeId){
                    console.info('Enviando request para update');
                    
                    //Si esta todo bien, llamamos auxiliar para modificacion de categoria
                    let { result, message } = await updateType(req.params.id, req.body.name);
                    
                    if(result){
                        //Si fue exitoso, retornamos OK
                        console.info(`Tipo con ID: ${req.params.id} actualizado correctamente`);
                        console.info('Preparando response');
                        res.status(200).json({message});
                    }
                    else{
                        //Si fallo damos error
                        console.info('No se pudo modificar tipo');
                        console.info('Preparando response');
                        res.status(500).json({message: message});
                    }
                }
            }
        }
    }
}

//Enpoint para eliminar tipos existentes (fisico)
async function eliminarType(req, res){
    console.info(`Conexion DELETE entrante : /api/helper/type/${req.params.id}`);

    //Validamos parametros de la URL
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

        //Obtenemos datos
        let { type: existe, message: existeMessage } = await getTypeById(req.params.id);

        if(!existe){
            //Si no existe, retornamos
            console.info(`No existe tipo con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message: existeMessage});
        }
        else{
            //Si existe, llamamos auxiliar para eliminar tipos
            console.info('Enviando request para eliminacion');
            let { result, message } = await deleteType(req.params.id);
            
            if(result){
                //Si fue exitoso, retornamos OK
                console.info(`Tipo eliminado correctamente con ID: ${req.params.id}`);
                console.info('Preparando response');
                res.status(201).json({message});
            }
            else{
                //Si fallo damos error
                console.info('No se pudo eliminar tipo');
                console.info('Preparando response');
                res.status(500).json({message: message});
            }
        }
    }
}

//Auxiliar para obtener todos los tipos
async function getTypes(){
    console.info('Buscando todos los tipos');
    let message = '';
    //Conectamos con las queries
    let types = await queries
                        .types
                        .getAll()
                        .then(data => {
                            //Si se consiguio la info
                            if(data){
                                console.info('Informacion de tipos obtenida');
                                return data
                            }
                            else{
                                //Si no se consiguieron datos
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

//Auxiliar para obtener tipos filtrando por ID
async function getTypeById(id){
    console.info(`Buscando tipo con ID: ${id}`);
    let message = '';
    //Conectamos con las queries
    let type = await queries
                    .types
                    .getOneById(id)
                    .then(data => {
                        //Si se consiguio la info
                        if(data){
                            console.info(`Tipo con ID: ${id} encontrado`);
                            return data;
                        }
                        else{
                            //Si no se consiguieron datos
                            console.info(`No existe tipo con ID: ${id}`);
                            message = `No existe un tipo con ID ${id}`;
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
//Auxiliar para obtener tipos filtrando por nombre
async function getTypeByName(name){
    console.info(`Buscando tipo con nombre: ${name}`);
    let message = '';
    //Conectamos con las queries
    let type = await queries
                    .types
                    .getOneByName(name)
                    .then(data => {
                        if(data){
                            //Si se consiguio la info
                            console.info(`Tipo con nombre: ${name} encontrado`);
                            message = `Ya existe tipo con nombre ${name}`;
                            return data;
                        }
                        else{
                            //Si no se consiguieron datos
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

//Auxiliar para registar nuevos tipos
async function insertType(type){
    console.info('Comenzando insert de Tipo');
    let message = '';
    //Conectamos con las queries
    let id = await queries
                .types
                .insert(type)
                .then(res => {
                    if(res){
                        //Si se inserto correctamente
                        console.info(`Insert de Tipo existoso con ID: ${res[0]}`);
                        message = `Tipo insertado correctamente con ID: ${res[0]}`;
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
                    console.error(`Error en Query INSERT de Type: ${err}`);
                    message = 'Ocurrio un error al intertar dar de alta';
                    return 0;
                });
    return { id, message };
}

//Auxiliar para modificar tipos existentes
async function updateType(id, name){
    console.info('Comenzando update de Tipo');
    let message = '';
    //Conectamos con las queries
    let result = await queries
                .types
                .update(id, name)
                .then(res => {
                    //Si se modifico correctamente
                    if(res){
                        console.info(`Update de Tipo con ID: ${id} existoso}`);
                        message = `Tipo con ID: ${id} actualizado correctamente`;
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
                    console.error(`Error en Query UPDATE de Type: ${err}`);
                    message = 'Ocurrio un error al intertar modificar';
                    return 0;
                });
    return { result, message };
}

//Auxiliar para eliminar tipos existentes (fisico)
async function deleteType(id){
    console.info('Comenzando delete de Tipo');
    let message = '';
    //Conectamos con las queries
    let result = await queries
                .types
                .delete(id)
                .then(res => {
                    //Si se modifico correctamente
                    if(res){
                        console.info(`Delete de Tipo existoso con ID: ${id}`);
                        message = `Tipo con ID:${id} eliminado correctamente`;
                        return res;
                    }
                    else{
                        //Si fallo
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

//Funcion para validar nombres
function validarRequest(name){
    console.info('Comenzando validacion Joi de la request');
    //Creamos schema Joi
    const schema = Joi.string().min(1).max(30).required();
    console.info('Finalizando validacion Joi de la request');
    //Validamos
    return Joi.validate(name, schema);
}

//Funcion para validar IDs
function validarId(id){
    console.info('Comenzando validacion Joi del ID');
    //Creamos schema Joi
    const schema = Joi.number().min(0).max(999999999).required();
    console.info('Finalizando validacion Joi del ID');
    //Validamos
    return Joi.validate(id, schema);
}

//Exportamos endpoints
module.exports = {
    obtenerCategories,
    obtenerCategoryById,
    altaCategory,
    modificarCategory,
    eliminarCategory,
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
    deleteType,
    validarId,
};