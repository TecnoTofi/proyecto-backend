const Joi = require('joi');
const queries = require('./dbQueries');

const getAllTypes = (req, res) => {
    console.log('Conexion GET entrante : /api/user/type');
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

const forSignup = (req, res) => {
    console.log('Conexion GET entrante : /api/user/type/signup');
    queries
        .types
        .getForSignup()
        .then(types => {
            console.log('Informacion de tipos obtenida');
            res.status(200).json(types);
        })
        .catch(err => {
            console.log(`Error en Query SELECT de Type : ${err}`);
            res.status(500).json({message: err});
         });
};

const getOneUser = async (req, res) => {
    console.log(`Conexion GET entrante : /api/user/${req.params.id}`);

    let { user, message } = await getUserById(req.params.id);

    if(!user){
        console.log(message);
        res.status(400).json(message);
    }
    else{
        console.log('Usuario encontrado');
        res.status(200).json(user);
        console.log('Informacion de usuario enviada');
    }
    // queries
    //     .users
    //     .getOneById(req.params.id)
    //     .then(user => {
    //         if(user){
    //             console.log('Informacion de usuario obtenida');
    //             res.status(200).json(user);
    //         }
    //         else{
    //             console.log(`No existe usuario con ID: ${req.params.id}`);
    //             res.status(400).json({message: `No existe usuario con ID: ${req.params.id}`});
    //         }
    //     })
    //     .catch(err => {
    //         console.log(`Error en Query SELECT de Type : ${err}`);
    //         res.status(500).json({message: err});
    //      });
    
};

async function insertUser(user){
    console.info('Comenzando insert de company');

    // let retorno = {
    //     id: 0,
    //     errores: ''
    // }

    // console.log('Preparando datos para insercion');

    // const user = {
    //     email: body.userEmail,
    //     password: hash,
    //     name: body.userName,
    //     typeId: body.type,
    //     companyId: companyId,
    //     firstStreet: body.userFirstStreet,
    //     secondStreet: body.userSecondStreet,
    //     doorNumber: body.userDoorNumber,
    //     phone: body.userPhone,
    //     document: body.userDocument,
    //     created: new Date()
    // };
    let message = '';
    let id = await queries
                    .users
                    .insert(user)
                    .then(id => {
                        if(id){
                            console.log('Query INSERT de User correcta');
                            return Number(id);
                        }
                        else{
                            console.error('Error en Query INSERT de User');
                            return 0;
                        }
                    })
                    .catch(err => {
                        console.log(`Error en Query INSERT de User: ${err}`);
                        message = err;
                        return 0;
                    });
    
    return { id, message };
};

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

async function updateUser(body,id,hash){

    console.log('Accediendo a ../user/routes/updateUser');

    let retorno = {
        id: 0,
        errores: ''
    }

    console.log('Preparando datos para modificacion');

    const user = {
        email: body.userEmail,
        password: hash,
        name: body.userName,
        typeId: body.type,
        firstStreet: body.userFirstStreet,
        secondStreet: body.userSecondStreet,
        doorNumber: body.userDoorNumber,
        phone: body.userPhone,
        document: body.userDocument
    };

    retorno.id = queries
                .users
                .update(id, user)
                .then(id => {
                    console.log('Querie update de User correcta');
                    return Number(id);
                })
                .catch(err => {
                    console.log(`Error en update de User : ${err}`);
                    retorno.errores = err;
                    retorno.id = 0;
                });

    if(await retorno.id == 0) console.log('Finalizando update fallido');
    else console.log('Finalizando update correcto');
    
    return await retorno;
};

async function getUserById(id){
    console.info(`Buscando usuario con id: ${id}`);
    let message = '';
    let user = await queries
                .users
                .getOneById(id)
                .then(data => {
                    //undefined si no existe
                    if(!data) {
                        console.info(`No existe usuario con id: ${id}`);
                        message = `No existe un usuario con id ${id}`;
                    }
                    else{
                        console.info(`Usuario encontrado con id: ${id}`);
                        return data;
                    }
                })
                .catch(err => {
                    console.error('Error en Query SELECT de User: ', err);
                    message = `Error en Query SELECT de User: ${err}`;
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
                            if(!data){
                                console.info(`No existe usuario con documento : ${documento}`);
                                message = (`No existe usuario con documento : ${documento}`);
                            }
                            else{
                                console.info(`Usuario encontrado con documento: ${documento}`);
                                return data;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en la Query SELECT de User para Documento : ${err}`);
                            message = `Error en la Query SELECT de User para Documento : ${err}`;
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
                    //undefined si no existe
                    if(!data) {
                        console.info(`No existe usuario con email: ${email}`);
                        message = `No existe un usuario con email ${email}`;
                    }
                    else{
                        console.info(`Usuario encontrado con email: ${email}`);
                        return data;
                    }
                })
                .catch(err => {
                    console.error('Error en Query SELECT de User: ', err);
                    message = `Error en Query SELECT de User: ${err}`;
                });
    return { user, message };
}

async function getTypeById(id){
    console.log(`Buscando tipo con id: ${id}`);
    let message = '';
    let type = await queries
                    .types
                    .getOneById(id)
                    .then(data => {
                        if(!data){
                            console.log(`No existe tipo con id: ${id}`);
                            message += `No existe un tipo con id ${id}`;
                        }
                        return data;
                    })
                    .catch(err => {
                        console.log(`Error en Query SELECT de Type : ${err}`);
                        message += `Error en Query SELECT de Type: ${err}`;
                    });
    return { type, message };
}

function validarDatos(body){
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

module.exports = {
    getUserById,
    getUserByDocument,
    getUserByEmail,
    rollbackInsertUser,
    getAllTypes,
    insertUser,
    validarDatos,
    forSignup,
    getOneUser,
    updateUser,
    getTypeById
};