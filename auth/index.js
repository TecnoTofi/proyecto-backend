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

const AuthRoutes = require('./routes');

//Todas las rutas empiezan con /api/auth

//Endpoints
router.post('/', AuthRoutes.verifyToken, AuthRoutes.login);
router.post('/login', AuthRoutes.login);
router.post('/logout', AuthRoutes.logout);
router.post('/signup', upload.single('companyImage'), AuthRoutes.signup);
router.put('/update/user/:idUser/company/:idCompany', AuthRoutes.verifyToken, upload.single('companyImage'), AuthRoutes.actualizarPerfil);

module.exports = router;