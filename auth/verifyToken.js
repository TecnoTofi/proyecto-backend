const jwt = require('jsonwebtoken');
const secreto = 'keyboard_cat';

const verifyToken = (req, res, next) => {
    if(!req.headers.token){
        console.log('Token invalido, acceso no autorizado');
        res.status(401).json({message: 'Acceso no autorizado'});
    }
    const token = req.headers.token;
    jwt.verify(token, secreto, (error, userData) => {
        if(error){
            console.log(`Error en la verificacion del token : ${error}`);
            res.status(422).json({message: `Error en la verificacion del token : ${error}`});
        }
        req.user = userData;
        next();
    });
}

module.exports = verifyToken;