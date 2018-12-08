//Incluimos modulo express para el manejo HTTP
const express = require('express');
//Creamos el router
const router= express.Router();
const multer= require('multer');

const PackagesRoutes = require('./routes');
const { verifyToken } = require('../auth/routes');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        //indicamos ruta destino de las imagenes
        cb(null, './uploads/packages/');
    },
    filename: function(req, file, cb){
        //indicamos como se formara el nombre del archivo
        cb(null, new Date().toISOString().replace(/:/g,'-') + file.originalname);
    }
});

//Creamos filtros para guardar unicamente jpg, jpeg y png
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
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

//Todas las rutas empiezan con /api/package

//Obtener todos los paquetes
router.get('/', PackagesRoutes.getAllPackages);
//Obtener todos los paquetes de una compania
router.get('/company/:id', PackagesRoutes.getAllPackagesByCompany);
//Insertar un paquete
// router.post('/'/*, upload.single('image'), verifyToken*/, PackagesRoutes.insertPackages);
//Agregar productos al paquete
// router.post('/product'/*, verifyToken*/, PackagesRoutes.insertPackageProduct);
//Obtener los productos de un paquete por su ID
router.get('/products/:id', PackagesRoutes.getAllProductByPackage);
//modificar paquete
router.post('/update/idPack', PackagesRoutes.updatePackage);
//eliminar paquete
router.post('/delete/idPack', PackagesRoutes.deletePackage);
//modificar lineas del paquete
router.post('/product/update/idPacProd', PackagesRoutes.updatePackageProduct);
//eliminar lineas del paquete
router.post('/product/delete/idPacProd', PackagesRoutes.deletePackageProduct);
//prueba
router.post('/',upload.single('image'), verifyToken, PackagesRoutes.insertPackagesCompleto);

module.exports = router;