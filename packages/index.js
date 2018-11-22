//Incluimos modulo express para el manejo HTTP
const express = require('express');
//Creamos el router
const router= express.Router();
//const multer= require('multer');

const PackagesRoutes = require('./routes');
const { verifyToken } = require('../auth/routes');

//Todas las rutas empiezan con /api/packages

//Obtener todos los paquetes
router.get('/package', PackagesRoutes.getAllPackages);
//Obtener todos los paquetes de una compania
router.get('/company/:idComp', PackagesRoutes.getAllPackagesByCompany);
//Insertar un paquete
router.post('/'/*, upload.single('image'), verifyToken*/, PackagesRoutes.insertPackages);
//Agregar productos al paquete
router.post('/product'/*, verifyToken*/, PackagesRoutes.insertPackageProduct);
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

module.exports = router;