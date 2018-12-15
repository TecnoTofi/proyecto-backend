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

    let { user, message } = await getUser(req.params.id);

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

async function insertUser(body, hash, companyId){
    console.log('Accediendo a ../user/routes/insertUser');

    let retorno = {
        id: 0,
        errores: ''
    }

    console.log('Preparando datos para insercion');

    const user = {
        email: body.userEmail,
        password: hash,
        name: body.userName,
        typeId: body.type,
        companyId: companyId,
        firstStreet: body.userFirstStreet,
        secondStreet: body.userSecondStreet,
        doorNumber: body.userDoorNumber,
        phone: body.userPhone,
        document: body.userDocument,
        created: new Date()
    };

    retorno.id = queries
                .users
                .insert(user)
                .then(id => {
                    console.log('Querie INSERT de User correcta');
                    return Number(id);
                })
                .catch(err => {
                    console.log(`Error en insert de User : ${err}`);
                    retorno.errores = err;
                    retorno.id = 0;
                });

    if(await retorno.id == 0) console.log('Finalizando insercion fallida');
    else console.log('Finalizando insercion correcta');
    
    return await retorno;
};

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

async function getUser(userId){
    console.log(`Buscando usuario con id: ${userId}`);
    let message = '';
    let user = await queries
                .users
                .getOneById(userId)
                .then(data => {
                    //undefined si no existe
                    if(!data) {
                        console.log(`No existe usuario con id: ${userId}`);
                        message += `No existe un usuario con id ${userId}`;
                    }
                    //ver capaz de retornar sin la password
                    return data;
                })
                .catch(err => {
                    console.log('Error en Query SELECT de User: ', err);
                    message += `Error en Query SELECT de User: ${err}`;
                });
    return { user, message };
}

async function getType(typeId){
    console.log(`Buscando tipo con id: ${typeId}`);
    let message = '';
    let type = await queries
                    .types
                    .getOneById(typeId)
                    .then(data => {
                        if(!data){
                            console.log(`No existe tipo con id: ${typeId}`);
                            message += `No existe un tipo con id ${typeId}`;
                        }
                        return data;
                    })
                    .catch(err => {
                        console.log(`Error en Query SELECT de Type : ${err}`);
                        message += `Error en Query SELECT de Type: ${err}`;
                    });
    return { type, message };
}

function validarLogin(body){
    const schema = {
        userEmail: Joi.string().min(6).max(50).email().required(),
        userPassword: Joi.string().min(8).max(20).required()
    };
    return Joi.validate(body, schema);
};

function validarTipoDatosUser(body){
    const schema = {
        userName: Joi.string().min(3).max(50).required(),
        userEmail: Joi.string().min(6).max(50).email().required(),
        userPassword: Joi.string().min(8).max(20).required(),
        userDocument: Joi.string().min(5).max(15).required(),
        userPhone: Joi.string().min(7).max(15).required(),
        userFirstStreet: Joi.string().min(3).max(30).allow('').allow(null),
        userSecondStreet: Joi.string().min(3).max(30).allow('').allow(null),
        userDoorNumber: Joi.string().max(6).allow('').allow(null),
        type: Joi.number().required()
    };
    return Joi.validate(body, schema);
};

module.exports = {
    getAllTypes,
    insertUser,
    validarTipoDatosUser,
    validarLogin,
    forSignup,
    getOneUser,
    updateUser,
    getUser,
    getType
};