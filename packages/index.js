//Incluimos modulo express para el manejo HTTP
const express = require('express');
//Creamos el router
const router= express.Router();
//Incluimos modulo multer para manejo de request FormData (con imagenes)
const multer= require('multer');
//Creamos storage para indicar donde almacenar las imagenes
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        //indicamos ruta destino de las imagenes
        cb(null, './uploads/packages/');
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
const PackagesRoutes = require('./routes');
const { verifyToken } = require('../auth/routes');

//Todas las rutas empiezan con /api/package

//Endpoints
router.get('/', PackagesRoutes.obtenerPackages);
router.get('/all', PackagesRoutes.obtenerAllPackages);
router.get('/deleted', PackagesRoutes.obtenerDeletedPackages);
router.get('/company/:id', PackagesRoutes.obtenerPackagesByCompany);
router.get('/company/:id/all', PackagesRoutes.obtenerAllPackagesByCompany);
router.get('/company/:id/deleted', PackagesRoutes.obtenerDeletedPackagesByCompany);
router.get('/:id', PackagesRoutes.obtenerPaqueteById);
router.get('/code/:code', PackagesRoutes.obtenerPaqueteByCode);
router.get('/:id/products', PackagesRoutes.obtenerAllProductsByPackage);
router.post('/', upload.single('image'), verifyToken, PackagesRoutes.altaPaquete);
router.post('/:id/product', verifyToken, PackagesRoutes.agregarPackageProduct);
router.put('/:id', upload.single('image'), verifyToken, PackagesRoutes.modificarPaquete);
router.delete('/:id', verifyToken, PackagesRoutes.eliminarPaquete);

module.exports = router;