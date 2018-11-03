const Joi = require('joi');
const queries = require('./dbQueries');

const roles = (req, res) => {
    console.log('Conexion GET entrante : /api/user/role');
    queries
        .roles
        .getAll()
        .then(roles => {
            console.log('Informacion de Roles obtenida');
            res.status(200).json(roles);
        })
        .catch(err => {
            console.log(`Error en Query SELECT de Role : ${err}`);
            res.status(500).json({message: err});
         });
    console.log('Informacion de Roles enviada');
};

const forSignup = (req, res) => {
    console.log('Conexion GET entrante : /api/user/role/signup');
    queries
        .roles
        .getForSignup()
        .then(roles => {
            console.log('Informacion de Roles obtenida');
            res.status(200).json(roles);
        })
        .catch(err => {
            console.log(`Error en Query SELECT de Role : ${err}`);
            res.status(500).json({message: err});
         });
    console.log('Informacion de Roles enviada');
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
        roleId: body.role,
        companyId: companyId,
        firstStreet: body.userFirstStreet,
        secondStreet: body.userSecondStreet,
        doorNumber: body.userDoorNumber,
        phone: body.userPhone,
        document: body.userDocument
    };

    retorno.id = queries
                .users
                .insert(user)
                .then(id => {
                    console.log('Querie INSERT de Company correcta');
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
        role: Joi.number().required()
    };
    return Joi.validate(body, schema);
};

module.exports = { roles, insertUser, validarTipoDatosUser, validarLogin, forSignup };