const Joi = require('joi');
const bcrypt = require('bcrypt');
const queries = require('./dbQueries');
const { getTypeById, validarId } = require('../helpers/routes');
const { getCompanyById } = require('../companies/routes');

async function obtenerUsers(req, res){
    console.info('Conexion GET entrante : /api/user');

    let { users, message } = await getUsers();

    if(users){
        console.info(`${users.length} usuarios encontrados`);
        console.info('Preparando response');
        res.status(200).json({users});
    }
    else{
        console.info('No se encontraron usuarios');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

async function obtenerAllUsers(req, res){
    console.info('Conexion GET entrante : /api/user/all');

    let { users, message } = await getAllUsers();

    if(users){
        console.info(`${users.length} usuarios encontrados`);
        console.info('Preparando response');
        res.status(200).json({users});
    }
    else{
        console.info('No se encontraron usuarios');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

async function obtenerDeletedUsers(req, res){
    console.info('Conexion GET entrante : /api/user/deleted');

    let { users, message } = await getDeletedUsers();

    if(users){
        console.info(`${users.length} usuarios encontrados`);
        console.info('Preparando response');
        res.status(200).json({users});
    }
    else{
        console.info('No se encontraron usuarios');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

async function obtenerUsersByType(req, res){
    console.info(`Conexion GET entrante : /api/user/type/${req.params.id}`);
    
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
            console.info(`Obteniendo usuarios de tipo ${type.name}`);
            let { users, message } = await getUsersByType(req.params.id, type.name);

            if(users){
                console.info(`${users.length} usuarios encontrados`);
                console.info('Preparando response');
                res.status(200).json({users});
            }
            else{
                console.info('No se encontraron usuarios');
                console.info('Preparando response');
                res.status(200).json({message});
            }
        }
    }
}

async function obtenerUserById(req, res){
    console.log(`Conexion GET entrante : /api/user/${req.params.id}`);

    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info('Validacion de tipos exitosa');
        console.info(`Yendo a buscar usuario con ID: ${req.params.id}`);
        let { user, message } = await getUserById(req.params.id);

        if(user){
            console.info('User encontrado');
            console.info('Preparando response');
            res.status(200).json({user});
        }
        else{
            console.info('No se encontro usuario');
            console.info('Preparando response');
            res.status(200).json({message});
        }
    }
}

async function obtenerUserByCompanyId(req, res){
    console.info(`Conexion GET entrante : /api/user/company/${req.params.id}`);

    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info(`Comprobando existencia de company ${req.params.id}`);
        let { company, message: companyMessage } = await getCompanyById(req.params.id);

        if(!company){
            console.info(`No existe company con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message: companyMessage});
        }
        else{
            console.info(`Obteniendo usuario de company ${company.name}`);
            let { user, message } = await getUserByCompanyId(req.params.id, company.name);

            if(user){
                console.info('Preparando response');
                res.status(200).json({user});
            }
            else{
                console.info('No se encontro usuario');
                console.info('Preparando response');
                res.status(200).json({message});
            }
        }
    }
}

async function obtenerUserByDocument(req, res){
    console.info(`Conexion GET entrante : /api/user/document/${req.params.document}`);

    console.info(`Comenzando validacion de tipos`);
    let { error } = validarDocumento(req.params.document);

    if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info('Validacion de tipos existosa');
        console.info(`Yendo a buscar usuario con documento: ${req.params.document}`);
        let { user, message } = await getUserByDocument(req.params.document);

        if(user){
            console.info('User encontrado');
            console.info('Preparando response');
            res.status(200).json({user});
        }
        else{
            console.info('No se encontro usuario');
            console.info('Preparando response');
            res.status(200).json({message});
        }
    }
}

async function obtenerUserByEmail(req, res){
    console.info(`Conexion GET entrante : /api/user/email/${req.params.email}`);

    console.info(`Comenzando validacion de tipos`);
    let { error } = validarEmail(req.params.email);

    if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info('Validacion de tipos existosa');
        console.info(`Yendo a buscar usuario con email: ${req.params.email}`);
        let { user, message } = await getUserByEmail(req.params.email);

        if(user){
            console.info('User encontrado');
            console.info('Preparando response');
            res.status(200).json({user});
        }
        else{
            console.info('No se encontro usuario');
            console.info('Preparando response');
            res.status(200).json({message});
        }
    }
}

async function altaUser(req, res){
    console.info('Conexion POST entrante : /api/user/');

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
        
        let { type, message: typeMessage } = await getTypeById(valUser.typeId);
        let { company, message: companyMessage } = await getCompanyById(valUser.companyId);
        let { user: userByEmail } = await getUserByEmail(valUser.email);
        let { user: userByDocument } = await getUserByDocument(valUser.document);

        if(userByEmail) errorMessage.push(`Ya existe un usuario con email ${valUser.email}`);
        if(userByDocument) errorMessage.push(`Ya existe un usuario con documento ${valUser.document}`);
        if(!type) errorMessage.push(typeMessage);
        if(!company) errorMessage.push(companyMessage);

        if(errorMessage.length > 0){
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
                console.error(`Error al crear hash : ${err}`);
                res.status(500).json({message: 'Error al registrarse'});
            }
            else{
                console.info('Encryptacion de contraseña, correcta');
                console.info('Preparando objeto para insert');

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

                let { id: userId, message: userMessage } = await insertUser(user);

                if(userId){
                    console.info(`Insert de User terminado correctamente, con ID: ${userId}`);
                    console.info('Preparando response');
                    res.status(201).json({message: 'Registro existoso', id: userId});
                }
                else{
                    console.info('Preparando response');
                    res.status(500).json({message: userMessage});
                }
            }
        }
    }
}

async function modificarUser(req, res){
    console.info(`Conexion PUT entrante : /api/user/${req.params.id}`);

    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
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
    
        //Inicializo array de errores
        let errorMessage = [];
    
        console.info(`Comenzando validacion de tipos`);
        let { error: errorId } = validarId(req.params.id);
        let { error: errorUser} = validarUser(valUser);
    
        if(errorUser) {
            console.info('Errores encontrados en la validacion de tipos de usuario');
            errorUser.details.map(e => {
                console.info(e.message);
                errorMessage.push(e.message);
                return;
            });
        }
    
        if(errorId) {
            console.info('Errores encontrados en la validacion de tipo de ID');
            errorId.details.map(e => {
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
            console.info('Comenzando validaciones de existencia')
    
            //Vuelvo a colocar companyId
            valUser.companyId = req.body.companyId;
    
            console.info(`Yendo a buscar usuario con ID: ${req.params.id}`);
            let { user: userById, message: userByIdMessage } = await getUserById(req.params.id);
            let { user: userByDocument } = await getUserByDocument(valUser.document);
            let { user: userByEmail } = await getUserByEmail(valUser.email);
            let { type, message: typeMessage } = await getTypeById(valUser.typeId);
            let { company, message: companyMessage } = await getCompanyById(valUser.companyId);
    
            if(!userById) errorMessage.push(userByIdMessage);
            if(userByDocument && userByDocument.id !== req.params.id) errorMessage.push(`Ya existe otro usuario con documento ${valUser.document}`);
            if(userByEmail && userByEmail.id !== req.params.id) errorMessage.push(`Ya existe otro usuario con email ${valUser.email}`);
            if(!type) errorMessage.push(typeMessage);
            if(!company) errorMessage.push(companyMessage);
            if(userById && userById.companyId !== valUser.companyId) errorMessage.push(`Usuario ${req.params.id} no pertenece a la empresa ${valUser.companyId}`);
    
            if(errorMessage.length > 0){
                console.info(`Se encontraron ${errorMessage.length} errores de existencia en la request`);
                errorMessage.map(err => console.log(err));
                console.info('Enviando response');
                res.status(400).json({message: errorMessage});
            }
            else{
                console.info('Validacion de existencia exitosas');
                console.info('Comenzado encryptacion de contraseña');
                const hash = await bcrypt.hash(valUser.password, 10);
                
                if(!hash){
                    console.error(`Error al crear hash : ${err}`);
                    res.status(500).json({message: 'Error al registrarse'});
                }
                else{
                    console.info('Encryptacion de contraseña, correcta');
                    console.info('Preparando objeto para update');
    
                    let user = {
                        typeId: valUser.typeId,
                        name: valUser.userName,
                        document: valUser.document,
                        email: valUser.email,
                        password: hash,
                        phone: valUser.userPhone,
                        firstStreet: valUser.userFirstStreet,
                        secondStreet: valUser.userSecondStreet,
                        doorNumber: valUser.userDoorNumber,
                    };
    
                    let { result, message } = await updateUser(req.params.id, user);
    
                    if(result){
                        console.info(`Usuario con ID: ${req.params.id} actualizado correctamente`);
                        console.info('Preparando response');
                        res.status(200).json({message: 'Modificacion exitosa'});
                    }
                    else{
                        console.info('No se pudo modificar usuario');
                        console.info('Preparando response');
                        res.status(500).json({message: message});
                    }
                }
            }
        }
    }
}

async function eliminarUser(req, res){
    console.info(`Conexion DELETE entrante : /api/user/${req.params.id}`);

    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info('Comenzando validaciones de existencia');

        let { user, message } = await getUserById(req.params.id);

        if(!user){
            console.info(`No existe usuario con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message});
        }
        else{
            console.info('Enviando request para eliminacion');
            let { result, message } = await deleteUser(req.params.id, new Date());
            
            if(result){
                console.info(`Usuario eliminado correctamente con ID: ${req.params.id}`);
                console.info('Preparando response');
                res.status(201).json({message});
            }
            else{
                console.info('No se pudo eliminar usuario');
                console.info('Preparando response');
                res.status(500).json({message: message});
            }
        }
    }
}

async function getUsers(){
    console.info('Buscando usuarios no bloqueados');
    let message = '';
    let users = await queries
                        .users
                        .getUsers()
                        .then(data => {
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

async function getAllUsers(){
    console.info('Buscando todos los usuarios');
    let message = '';
    let users = await queries
                        .users
                        .getAll()
                        .then(data => {
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

async function getDeletedUsers(){
    console.info('Buscando usuarios bloqueados');
    let message = '';
    let users = await queries
                        .users
                        .getDeleted()
                        .then(data => {
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

async function getUsersByType(id, type){
    console.info(`Buscando todos los usuarios de tipo ${type}`);
    let message = '';
    let users = await queries
                        .users
                        .getByType(id)
                        .then(data => {
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

async function getUserById(id){
    console.info(`Buscando usuario con ID: ${id}`);
    let message = '';
    let user = await queries
                .users
                .getOneById(id)
                .then(data => {
                    if(data) {
                        console.info(`Usuario con ID: ${id} encontrado`);
                        return data;
                    }
                    else{
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

async function getUserByCompanyId(id, company){
    console.info(`Buscando usuario de company ${company}`);
    let message = '';
    let user = await queries
                        .users
                        .getByCompany(id)
                        .then(data => {
                            if(data){
                                console.info('Informacion de usuario obtenida');
                                //Oculatamos la contraseña de cada user
                                data.password = '';
                                return data;
                            }
                            else{
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

async function getUserByDocument(documento){
    console.info(`Buscando ususario con documento: ${documento}`);
    let message = '';
    let user = await queries
                        .users
                        .getOneByDocument(documento)
                        .then(data => {
                            if(data){
                                console.info(`Usuario con documento: ${documento} encontrado`);
                                data.password = '';
                                return data;
                            }
                            else{
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

async function getUserByEmail(email){
    console.info(`Buscando usuario con email: ${email}`);
    let message = '';
    let user = await queries
                .users
                .getOneByEmail(email)
                .then(data => {
                    if(data) {
                        console.info(`Usuario con email: ${email} encontrado`);
                        return data;
                    }
                    else{
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

async function insertUser(user){
    console.info('Comenzando insert de User');
    let message = '';
    let id = await queries
                    .users
                    .insert(user)
                    .then(res => {
                        if(res){
                            console.info(`Insert de User exitoso con ID: ${res[0]}`);
                            return res[0];
                        }
                        else{
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

async function updateUser(id, user){
    console.info('Comenzando update de User');
    let message = '';
    let result = await queries
                .users
                .update(id, user)
                .then(res => {
                    if(res){
                        console.info(`Update de User con ID: ${id} existoso}`);
                        return res;
                    }
                    else{
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

async function deleteUser(id, date){
    console.info('Comenzando delete de Usuario');
    let message = '';
    let result = await queries
                .users
                .delete(id, date)
                .then(res => {
                    if(res){
                        console.info(`Delete de Usuario existoso con ID: ${id}`);
                        message = `Usuario con ID:${id} eliminado correctamente`;
                        return res;
                    }
                    else{
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

async function rollbackInsertUser(id){
    let message = '';
    let res = await queries
                    .users
                    .delete(id)
                    .then(data => {
                        return data;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de USER: ', err);
                        message += `Error en Query DELETE de USER: ${err}`;
                    });
    return { res, message };
}

function validarUser(body){
    console.info('Comenzando validacion Joi de Usuario');
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
    return Joi.validate(body, schema);
};

function validarEmail(email){
    console.info('Comenzando validacion Joi de Email');
    const schema = Joi.string().email().required();
    console.info('Finalizando validacion Joi de Email');
    return Joi.validate(email, schema);
}

function validarDocumento(documento){
    console.info('Comenzando validacion Joi de Documento');
    const schema = Joi.string().min(5).max(15).required();
    console.info('Finalizando validacion Joi de Documento');
    return Joi.validate(documento, schema);
}

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
};