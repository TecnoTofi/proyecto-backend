//Incluimos Joi para validaciones
const Joi = require('joi');
//Incluimos Bcrypt para encriptacion de contraseña
const bcrypt = require('bcrypt');
//Incluimos queries de DB
const queries = require('./dbQueries');
//Incluimos funciones de helpers
const { getTypeById, validarId } = require('../helpers/routes');
//Incluimos funciones de companies
const { getCompanyById } = require('../companies/routes');

//Endpoint para obtener todos los usuarios no borrados
async function obtenerUsers(req, res){
    console.info('Conexion GET entrante : /api/user');

    //Obtenemos los datos
    let { users, message } = await getUsers();

    if(users){
        //Retornamos los datos
        console.info(`${users.length} usuarios encontrados`);
        console.info('Preparando response');
        res.status(200).json(users);
    }
    else{
        //Si fallo, damos error
        console.info('No se encontraron usuarios');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

//Endpoint para obtener todos los usuarios
async function obtenerAllUsers(req, res){
    console.info('Conexion GET entrante : /api/user/all');

    //Obtenemos los datos
    let { users, message } = await getAllUsers();

    if(users){
        //Retornamos los datos
        console.info(`${users.length} usuarios encontrados`);
        console.info('Preparando response');
        res.status(200).json(users);
    }
    else{
        //Si fallo, damos error
        console.info('No se encontraron usuarios');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}
//Endpoint para obtener todos los usuarios borrados
async function obtenerDeletedUsers(req, res){
    console.info('Conexion GET entrante : /api/user/deleted');

    //Obtenemos los datos
    let { users, message } = await getDeletedUsers();

    if(users){
        //Retornamos los datos
        console.info(`${users.length} usuarios encontrados`);
        console.info('Preparando response');
        res.status(200).json(users);
    }
    else{
        //Si fallo, damos error
        console.info('No se encontraron usuarios');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

//Endpoint para obtener usuarios filtrando por tipo
async function obtenerUsersByType(req, res){
    console.info(`Conexion GET entrante : /api/user/type/${req.params.id}`);
    
    //Validamos paramostros de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        //Si fallo, retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        //Obtenemos el tipo
        console.info(`Comprobando existencia de tipo ${req.params.id}`);
        let { type, message: typeMessage } = await getTypeById(req.params.id);

        if(!type){
            //Si no existe, retornamos
            console.info(`No existe tipo con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message: typeMessage});
        }
        else{
            //Obtenemos los datos
            console.info(`Obteniendo usuarios de tipo ${type.name}`);
            let { users, message } = await getUsersByType(req.params.id, type.name);

            if(users){
                //Retornamos los datos
                console.info(`${users.length} usuarios encontrados`);
                console.info('Preparando response');
                res.status(200).json(users);
            }
            else{
                //Si fallo damos error
                console.info('No se encontraron usuarios');
                console.info('Preparando response');
                res.status(200).json({message});
            }
        }
    }
}

//Endpoint para obtener usuarios filtrando por ID
async function obtenerUserById(req, res){
    console.log(`Conexion GET entrante : /api/user/${req.params.id}`);

    //Validamos paramostros de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        //Si fallo, retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        //Obtenemos los datos
        console.info('Validacion de tipos exitosa');
        console.info(`Yendo a buscar usuario con ID: ${req.params.id}`);
        let { user, message } = await getUserById(req.params.id);

        if(user){
            //Retornamos los datos
            console.info('User encontrado');
            console.info('Preparando response');
            user.password = '';
            res.status(200).json(user);
        }
        else{
            //Si fallo damos error
            console.info('No se encontro usuario');
            console.info('Preparando response');
            res.status(200).json({message});
        }
    }
}

//Endpoint para obtener usuarios filtrando por ID de company
async function obtenerUserByCompanyId(req, res){
    console.info(`Conexion GET entrante : /api/user/company/${req.params.id}`);

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
        //Obtenemos la compania para validar existencia
        console.info(`Comprobando existencia de company ${req.params.id}`);
        let { company, message: companyMessage } = await getCompanyById(req.params.id);

        if(!company){
            //Si no existe, damos error
            console.info(`No existe company con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message: companyMessage});
        }
        else{
            //Obtenemos los datos
            console.info(`Obteniendo usuario de company ${company.name}`);
            let { user, message } = await getUserByCompanyId(req.params.id, company.name);

            if(user){
                //Retornamos los datos
                console.info('Preparando response');
                res.status(200).json(user);
            }
            else{
                //Si fallo damos error
                console.info('No se encontro usuario');
                console.info('Preparando response');
                res.status(200).json({message});
            }
        }
    }
}

//Endpoint para obtener usuarios filtrando por documento
async function obtenerUserByDocument(req, res){
    console.info(`Conexion GET entrante : /api/user/document/${req.params.document}`);

    //Validamos parametors de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarDocumento(req.params.document);

    if(error){
        //Si hay error, retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        //Obtenemos los datos
        console.info('Validacion de tipos existosa');
        console.info(`Yendo a buscar usuario con documento: ${req.params.document}`);
        let { user, message } = await getUserByDocument(req.params.document);

        if(user){
            //Retornamos los datos
            console.info('User encontrado');
            console.info('Preparando response');
            res.status(200).json(user);
        }
        else{
            //Si fallo damos error
            console.info('No se encontro usuario');
            console.info('Preparando response');
            res.status(200).json({message});
        }
    }
}

//Endpoint para obtener usuarios filtrando por email
async function obtenerUserByEmail(req, res){
    console.info(`Conexion GET entrante : /api/user/email/${req.params.email}`);

    //Validamos parametros de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarEmail(req.params.email);

    if(error){
        //Si hay error, retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        //Obtenemos los datos
        console.info('Validacion de tipos existosa');
        console.info(`Yendo a buscar usuario con email: ${req.params.email}`);
        let { user, message } = await getUserByEmail(req.params.email);

        if(user){
            //Retornamos error
            console.info('User encontrado');
            console.info('Preparando response');
            user.password = '';
            res.status(200).json(user);
        }
        else{
            //Si fallo damos error
            console.info('No se encontro usuario');
            console.info('Preparando response');
            res.status(200).json({message});
        }
    }
}

//Endpoint para registro de nuevos usuarios
async function altaUser(req, res){
    console.info('Conexion POST entrante : /api/user/');

    //Creamos body para validacion
    console.info('Enviando a validar tipos de datos en request');
    let valUser = {
        typeId: req.body.typeId,
        userName: req.body.userName,
        document: req.body.document,
        email: req.body.email,
        password: req.body.password,
        userPhone: req.body.userPhone,
        userFirstStreet: req.body.userFirstStreet,
        userSecondStreet: req.body.userSecondStreet,
        userDoorNumber: req.body.userDoorNumber,
    };
    let { error } = validarUser(valUser);

    if(error){
        //Si hay errores retornamos
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
        //Vuelvo a colocar companyId
        valUser.companyId = req.body.companyId;
        
        //Obtenemos entidades para validacion de existencias
        let { type, message: typeMessage } = await getTypeById(valUser.typeId);
        let { company, message: companyMessage } = await getCompanyById(valUser.companyId);
        let { user: userByEmail } = await getUserByEmail(valUser.email);
        let { user: userByDocument } = await getUserByDocument(valUser.document);

        //Agrego errores en caso de haberlos
        if(userByEmail) errorMessage.push(`Ya existe un usuario con email ${valUser.email}`);
        if(userByDocument) errorMessage.push(`Ya existe un usuario con documento ${valUser.document}`);
        if(!type) errorMessage.push(typeMessage);
        if(!company) errorMessage.push(companyMessage);

        if(errorMessage.length > 0){
            //Si hay errores, retornamos
            console.info(`Se encontraron ${errorMessage.length} errores de existencia en la request`);
            errorMessage.map(err => console.log(err));
            console.info('Enviando response')
            res.status(400).json({message: errorMessage});
        }
        else{
            console.info('Validaciones de existencia exitosas');

            //Encriptamos la contraseña
            console.info('Comenzado encryptacion de contraseña');
            const hash = await bcrypt.hash(valUser.password, 10);
            
            if(!hash){
                //Si fallo la encriptacion
                console.error(`Error al crear hash : ${err}`);
                res.status(500).json({message: 'Error al registrarse'});
            }
            else{
                console.info('Encryptacion de contraseña, correcta');
                console.info('Preparando objeto para insert');

                //Creamos body para insert
                let user = {
                    typeId: valUser.typeId,
                    companyId: valUser.companyId,
                    name: valUser.userName,
                    document: valUser.document,
                    email: valUser.email,
                    password: hash,
                    phone: valUser.userPhone,
                    firstStreet: valUser.userFirstStreet,
                    secondStreet: valUser.userSecondStreet,
                    doorNumber: valUser.userDoorNumber,
                    created: new Date()
                };

                //Llamamos insert de user
                let { id: userId, message: userMessage } = await insertUser(user);

                if(userId){
                    //Si fue exitoso retornamos OK
                    console.info(`Insert de User terminado correctamente, con ID: ${userId}`);
                    console.info('Preparando response');
                    res.status(201).json({message: 'Registro existoso', id: userId});
                }
                else{
                    //Si fallo damos error
                    console.info('Preparando response');
                    res.status(500).json({message: userMessage});
                }
            }
        }
    }
}

//Endpoint para modificar usuarios existentes
async function modificarUserVal(req, res){
    console.info(`Conexion PUT entrante : /api/user/${req.params.id}`);

    //Llamamos auxiliar de modificacion de usuarios
    let { status, message } = await modificarUser(req.params.id, req.body);

    //Retornamos resultado
    res.status(status).json(message);
}

//Auxiliar para modificar usuarios existentes
async function modificarUser(id, body){
    console.info(`Comenzando validacion de tipos`);
    
    //Validamos tipo de dato
    let { error } = validarId(id);

    if(error){
        //Si hay error, retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        return { status: 400, message: error.details[0].message };
    }
    else{
        console.info('Enviando a validar tipos de datos en request');
        //Creamos body de validacion
        let valUser = {
            typeId: body.type,
            userName: body.userName,
            document: body.document,
            email: body.email,
            userPhone: body.userPhone,
            userFirstStreet: body.userFirstStreet,
            userSecondStreet: body.userSecondStreet,
            userDoorNumber: body.userDoorNumber,
        };
    
        //Inicializo array de errores
        let errorMessage = [];
    
        console.info(`Comenzando validacion de tipos`);
        let { error: errorUser} = validarUserUpdate(valUser);
    
        if(errorUser) {
            //Si hay error, agregamos al array
            console.info('Errores encontrados en la validacion de tipos de usuario');
            errorUser.details.map(e => {
                console.info(e.message);
                errorMessage.push(e.message);
                return;
            });
        }
        
        if(errorMessage.length > 0){
            //Si hay error, retornamos
            console.info(`Se encontraron ${errorMessage.length} errores de tipo en la request`);
            errorMessage.map(err => console.log(err));
            console.info('Enviando response');
            return { status: 400, message: errorMessage };
        }
        else{
            console.info('Validacion de tipos exitosa');
            console.info('Comenzando validaciones de existencia');
    
            //Vuelvo a colocar companyId
            valUser.companyId = body.companyId;
    
            //Obtenemos entidades para validar existencias
            console.info(`Yendo a buscar usuario con ID: ${id}`);
            let { user: userById, message: userByIdMessage } = await getUserById(id);
            let { user: userByDocument } = await getUserByDocument(valUser.document);
            let { user: userByEmail } = await getUserByEmail(valUser.email);
            let { type, message: typeMessage } = await getTypeById(valUser.typeId);
            let { company, message: companyMessage } = await getCompanyById(valUser.companyId);
    
            //Si hay errores, agrego al array
            if(!userById) errorMessage.push(userByIdMessage);
            if(userByDocument && userByDocument.id !== id) errorMessage.push(`Ya existe otro usuario con documento ${valUser.document}`);
            if(userByEmail && userByEmail.id !== id) errorMessage.push(`Ya existe otro usuario con email ${valUser.email}`);
            if(!type) errorMessage.push(typeMessage);
            if(!company) errorMessage.push(companyMessage);
            if(userById && userById.companyId !== valUser.companyId) errorMessage.push(`Usuario ${id} no pertenece a la empresa ${valUser.companyId}`);
    
            if(errorMessage.length > 0){
                //Si hay error, retorno
                console.info(`Se encontraron ${errorMessage.length} errores de existencia en la request`);
                errorMessage.map(err => console.log(err));
                console.info('Enviando response');
                return { status: 400, message: errorMessage };
            }
            else{
                console.info('Validacion de existencia exitosas');
                console.info('Encryptacion de contraseña, correcta');
                console.info('Preparando objeto para update');

                //Creo body de update
                let user = {
                    typeId: valUser.typeId,
                    name: valUser.userName,
                    document: valUser.document,
                    email: valUser.email,
                    password: userById.password,
                    phone: valUser.userPhone,
                    firstStreet: valUser.userFirstStreet,
                    secondStreet: valUser.userSecondStreet,
                    doorNumber: valUser.userDoorNumber,
                };

                //Llamo auxiliar de modificacion de user
                let { result, message } = await updateUser(id, user);

                if(result){
                    //Si fue exitoso, retornamos OK
                    console.info(`Usuario con ID: ${id} actualizado correctamente`);
                    console.info('Preparando response');
                    return { status: 200, message: 'Modificacion exitosa' };
                }
                else{
                    //Si fallo damos error
                    console.info('No se pudo modificar usuario');
                    console.info('Preparando response');
                    return { status: 500, message: message };
                }
            }
        }
    }
}

//Enpoint para eliminar usuarios existentes (logico)
async function eliminarUser(req, res){
    console.info(`Conexion DELETE entrante : /api/user/${req.params.id}`);

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

        //Obtenemos el usuario
        let { user, message } = await getUserById(req.params.id);

        if(!user){
            //Si no existe, damos error
            console.info(`No existe usuario con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message});
        }
        else{
            //Si existe, llamamos a auxiliar de borrado de usuario
            console.info('Enviando request para eliminacion');
            let { result, message } = await deleteUser(req.params.id, new Date());
            
            if(result){
                //Si fue exitoso, retornamos OK
                console.info(`Usuario eliminado correctamente con ID: ${req.params.id}`);
                console.info('Preparando response');
                res.status(201).json({message});
            }
            else{
                //Si fallo damos error
                console.info('No se pudo eliminar usuario');
                console.info('Preparando response');
                res.status(500).json({message: message});
            }
        }
    }
}

//Auxiliar para obtener todos los usuarios no borrados
async function getUsers(){
    console.info('Buscando usuarios no bloqueados');
    let message = '';
    //Conectamos con las queries
    let users = await queries
                        .users
                        .getUsers()
                        .then(data => {
                            //Si se consiguio la info
                            if(data){
                                console.info('Informacion de usuarios obtenida');
                                //Oculatamos la contraseña de cada user
                                data = data.map(u => {
                                    u.password = '';
                                    return u;
                                });
                                return data;
                            }
                            else{
                                //Si no se consiguieron datos
                                console.info('No existen usuarios registrados en la BD que no esten bloqueados');
                                message = 'No existen usuarios registrados en la BD que no esten bloqueados';
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de User : ${err}`);
                            message = 'Ocurrio un error al obtener los usuarios';
                            return null;
                        });
    return { users, message };
}

//Auxiliar para obtener todos los usuarios 
async function getAllUsers(){
    console.info('Buscando todos los usuarios');
    let message = '';
    //Conectamos con las queries
    let users = await queries
                        .users
                        .getAll()
                        .then(data => {
                            //Si se consiguio la info
                            if(data){
                                console.info('Informacion de usuarios obtenida');
                                //Oculatamos la contraseña de cada user
                                data = data.map(u => {
                                    u.password = '';
                                    return u;
                                });
                                return data;
                            }
                            else{
                                //Si no se consiguieron datos
                                console.info('No existen usuarios registrados en la BD');
                                message = 'No existen usuarios registrados en la BD';
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de User : ${err}`);
                            message = 'Ocurrio un error al obtener los usuarios';
                            return null;
                        });
    return { users, message };
}

//Auxiliar para obtener todos los usuarios borrados
async function getDeletedUsers(){
    console.info('Buscando usuarios bloqueados');
    let message = '';
    //Conectamos con las queries
    let users = await queries
                        .users
                        .getDeleted()
                        .then(data => {
                            //Si se consiguio la info
                            if(data){
                                console.info('Informacion de usuarios obtenida');
                                //Oculatamos la contraseña de cada user
                                data = data.map(u => {
                                    u.password = '';
                                    return u;
                                });
                                return data;
                            }
                            else{
                                //Si no se consiguieron datos
                                console.info('No existen usuarios registrados en la BD con estado bloqueado');
                                message = 'No existen usuarios registrados en la BD con estado bloqueado';
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de User : ${err}`);
                            message = 'Ocurrio un error al obtener los usuarios';
                            return null;
                        });
    return { users, message };
}

//Auxiliar para obtener usuarios filtrando por tipo
async function getUsersByType(id, type){
    console.info(`Buscando todos los usuarios de tipo ${type}`);
    let message = '';
    //Conectamos con las queries
    let users = await queries
                        .users
                        .getByType(id)
                        .then(data => {
                            //Si se consiguio la info
                            if(data){
                                console.info('Informacion de usuarios obtenida');
                                //Oculatamos la contraseña de cada user
                                data = data.map(u => {
                                    u.password = '';
                                    return u;
                                });
                                return data;
                            }
                            else{
                                //Si no se consiguieron datos
                                console.info(`No existen usuarios registrados en la BD con tipo ${type}`);
                                message = `No existen usuarios registrados en la BD con tipo ${type}`;
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de User : ${err}`);
                            message = 'Ocurrio un error al obtener los usuarios';
                            return null;
                        });
    return { users, message };
}

//Auxiliar para obtener usuarios filtrando por ID
async function getUserById(id){
    console.info(`Buscando usuario con ID: ${id}`);
    let message = '';
    //Conectamos con las queries
    let user = await queries
                .users
                .getOneById(id)
                .then(data => {
                    //Si se consiguio la info
                    if(data) {
                        console.info(`Usuario con ID: ${id} encontrado`);
                        return data;
                    }
                    else{
                        //Si no se consiguieron datos
                        console.info(`No existe usuario con ID: ${id}`);
                        message = `No existe un usuario con ID ${id}`;
                        return null;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query SELECT de User: ${err}`);
                    message = 'Ocurrio un error al obtener el usuario';
                });
    return { user, message };
}

//Auxiliar para obtener usuarios filtrando por ID de company
async function getUserByCompanyId(id, company){
    console.info(`Buscando usuario de company ${company}`);
    let message = '';
    //Conectamos con las queries
    let user = await queries
                        .users
                        .getByCompany(id)
                        .then(data => {
                            //Si se consiguio la info
                            if(data){
                                console.info('Informacion de usuario obtenida');
                                //Oculatamos la contraseña de cada user
                                data.password = '';
                                return data;
                            }
                            else{
                                //Si no se consiguieron datos
                                console.info('No existen usuarios registrados en la BD');
                                message = 'No existen usuarios registrados en la BD';
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de User : ${err}`);
                            message = 'Ocurrio un error al obtener los usuarios';
                            return null;
                        });
    return { user, message };
}

//Auxiliar para obtener usuarios filtrando por documento
async function getUserByDocument(documento){
    console.info(`Buscando ususario con documento: ${documento}`);
    let message = '';
    //Conectamos con las queries
    let user = await queries
                        .users
                        .getOneByDocument(documento)
                        .then(data => {
                            //Si se consiguio la info
                            if(data){
                                console.info(`Usuario con documento: ${documento} encontrado`);
                                data.password = '';
                                return data;
                            }
                            else{
                                //Si no se consiguieron datos
                                console.info(`No existe usuario con documento : ${documento}`);
                                message = (`No existe usuario con documento : ${documento}`);
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en la Query SELECT de User para Documento : ${err}`);
                            message = 'Ocurrio un error al obtener el usuario';
                        });
    return { user, message };
}

//Auxiliar para obtener usuarios filtrando por email
async function getUserByEmail(email){
    console.info(`Buscando usuario con email: ${email}`);
    let message = '';
    //Conectamos con las queries
    let user = await queries
                .users
                .getOneByEmail(email)
                .then(data => {
                    //Si se consiguio la info
                    if(data) {
                        console.info(`Usuario con email: ${email} encontrado`);
                        return data;
                    }
                    else{
                        //Si no se consiguieron datos
                        console.info(`No existe usuario con email: ${email}`);
                        message = `No existe un usuario con email ${email}`;
                        return null;
                    }
                })
                .catch(err => {
                    console.error('Error en Query SELECT de User: ', err);
                    message = 'Ocurrio un error al obtener el usuario';
                });
    return { user, message };
}

//Auxiliar para insertar nuevos usuarios
async function insertUser(user){
    console.info('Comenzando insert de User');
    let message = '';
    //Conectamos con las queries
    let id = await queries
                    .users
                    .insert(user)
                    .then(res => {
                        //Si fue exitoso
                        if(res){
                            console.info(`Insert de User exitoso con ID: ${res[0]}`);
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
                        console.log(`Error en Query INSERT de User: ${err}`);
                        message = 'Ocurrio un error al intertar dar de alta';
                        return 0;
                    });
    
    return { id, message };
}

//Auxiliar para modificar usuarios existentes
async function updateUser(id, user){
    console.info('Comenzando update de User');
    let message = '';
    //Conectamos con las queries
    let result = await queries
                .users
                .update(id, user)
                .then(res => {
                    //Si fue exitoso
                    if(res){
                        console.info(`Update de User con ID: ${id} existoso}`);
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
                    console.error(`Error en Query UPDATE de User: ${err}`);
                    message = 'Ocurrio un error al intertar modificar';
                    return 0;
                });
    return { result, message };
}

//Auxiliar para eliminar usuarios (logico)
async function deleteUser(id, date){
    console.info('Comenzando delete de Usuario');
    let message = '';
    //Conectamos con las queries
    let result = await queries
                .users
                .delete(id, date)
                .then(res => {
                    //Si fue exitoso
                    if(res){
                        console.info(`Delete de Usuario existoso con ID: ${id}`);
                        message = `Usuario con ID:${id} eliminado correctamente`;
                        return res;
                    }
                    else{
                        //Si fallo
                        console.info('Ocurrio un error');
                        message = 'Ocurrio un error al intertar eliminar el usuario';
                        return 0;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query INSERT de User: ${err}`);
                    message = 'Ocurrio un error al intertar eliminar el usuario';
                    return 0;
                });
    return { result, message };
}

//Rollback de insert de usuarios (fisico)
async function rollbackInsertUser(id){
    let message = '';
    //Conectamos con las queries
    let result = await queries
                    .users
                    .rollback(id)
                    .then(res => {
                        return res;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de USER: ', err);
                        message += `Error en Query DELETE de USER: ${err}`;
                    });
    return { result, message };
}

//Funcion para validar datos de usuarios insert
function validarUser(body){
    console.info('Comenzando validacion Joi de Usuario');
    //Creamos schema Joi
    const schema = Joi.object().keys({
        typeId: Joi.number().required(),
        userName: Joi.string().min(3).max(50).required(),
        document: Joi.string().min(5).max(15).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(20).required(),
        userPhone: Joi.string().min(7).max(15).required(),
        userFirstStreet: Joi.string().min(3).max(30).allow('').allow(null),
        userSecondStreet: Joi.string().min(3).max(30).allow('').allow(null),
        userDoorNumber: Joi.string().max(6).allow('').allow(null),
    });

    console.info('Finalizando validacion Joi de Usuario');
    //Validamos
    return Joi.validate(body, schema);
};

//Funcion para validar datos de usuarios update
function validarUserUpdate(body){
    console.info('Comenzando validacion Joi de Usuario');
    //Creamos schema Joi
    const schema = Joi.object().keys({
        typeId: Joi.number().required(),
        userName: Joi.string().min(3).max(50).required(),
        document: Joi.string().min(5).max(15).required(),
        email: Joi.string().email().required(),
        userPhone: Joi.string().min(7).max(15).required(),
        userFirstStreet: Joi.string().min(3).max(30).allow('').allow(null),
        userSecondStreet: Joi.string().min(3).max(30).allow('').allow(null),
        userDoorNumber: Joi.string().max(6).allow('').allow(null),
    });

    console.info('Finalizando validacion Joi de Usuario');
    //Validamos
    return Joi.validate(body, schema);
};

//Funcion para validar emails
function validarEmail(email){
    console.info('Comenzando validacion Joi de Email');
    //Creamos schema Joi
    const schema = Joi.string().email().required();
    console.info('Finalizando validacion Joi de Email');
    //Validamos
    return Joi.validate(email, schema);
}

//Funcion para validar documentos
function validarDocumento(documento){
    console.info('Comenzando validacion Joi de Documento');
    //Creamos schema Joi
    const schema = Joi.string().min(5).max(15).required();
    console.info('Finalizando validacion Joi de Documento');
    //Validamos
    return Joi.validate(documento, schema);
}

//Exportamos endpoints
module.exports = {
    obtenerUsers,
    obtenerAllUsers,
    obtenerDeletedUsers,
    obtenerUsersByType,
    obtenerUserById,
    obtenerUserByCompanyId,
    obtenerUserByDocument,
    obtenerUserByEmail,
    altaUser,
    modificarUserVal,
    modificarUser,
    eliminarUser,
    getUsers,
    getAllUsers,
    getDeletedUsers,
    getUsersByType,
    getUserById,
    getUserByCompanyId,
    getUserByDocument,
    getUserByEmail,
    insertUser,
    updateUser,
    deleteUser,
    rollbackInsertUser,
    validarUser,
    validarUserUpdate,
};