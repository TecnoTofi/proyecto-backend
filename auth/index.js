//Incluimos modulo express para manejo HTTP
const express = require('express');
//Creamos router
const router = express.Router();
//Incluimos modulo multer para manejo de request FormData (con imagenes)
const multer = require('multer');
//Creamos storage para indicar donde almacenar las imagenes
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        //indicamos ruta destino de las imagenes
        cb(null, './uploads/companies/');
    },
    filename: function(req, file, cb){
        //indicamos como se formara el nombre del archivo
        if(file) cb(null, new Date().toISOString().replace(/:/g,'-') + file.originalname);
        else cb(null);
    }
});
//Creamos filtros para guardar unicamente jpg, jpeg y png
const fileFilter = (req, file, cb) => {
    if(file && file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
};
//Incluimos en multer las funciones anteriormente creadas
const upload = multer({
    storage: storage,
    limits: {
        // Determinamos 5mb maximo tamaño de archivo
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

//Todas las rutas empiezan con /api/auth

//Incluimos rutas de Auth
const AuthRoutes = require('./routes');
//Creamos ruteos HTTP 
router.post('/', AuthRoutes.verifyToken, AuthRoutes.login);
router.post('/login', AuthRoutes.login);
router.post('/logout', AuthRoutes.logout);
//Registro de usuarios-empresa
router.post('/signup', upload.single('companyImage'), AuthRoutes.signup);
//Modificar usuarios-empresa
//pasar a put
router.put('/update/user/:idUser/company/:idEmpr', AuthRoutes.verifyToken, upload.single('companyImage'), AuthRoutes.actualizarPerfil);

//Exportamos el router
module.exports = router;