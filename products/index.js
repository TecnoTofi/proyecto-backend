//Incluimos modulo express para el manejo HTTP
const express = require('express');
//Creamos el router
const router = express.Router();
//Incluimos modulo multer para manejo de request FormData (con imagenes)
const multer = require('multer');
//Creamos storage para indicar donde almacenar las imagenes
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        //indicamos ruta destino de las imagenes
        cb(null, './uploads/products/');
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

const ProductRoutes = require('./routes');
const { verifyToken } = require('../auth/routes');

// Todas las rutas empiezan con /api/product

//Endpoints
router.get('/' , ProductRoutes.obtenerProducts);
router.get(/^\/company$/, ProductRoutes.obtenerCompanyProducts);
router.get('/:id' , ProductRoutes.obtenerProductById);
router.get('/:id/companies' , ProductRoutes.obtenerCompanyProductsByProduct);
router.get('/code/:code' , ProductRoutes.obtenerProductByCode);
router.get('/category/:id' , ProductRoutes.obtenerProductsByCategory);
router.get('/company/deleted' , ProductRoutes.obtenerDeletedCompanyProducts);
router.get(/^\/company\/all/, ProductRoutes.obtenerAllCompanyProducts);
router.get('/company/:id' , ProductRoutes.obtenerCompanyProductsByCompany);
router.get('/company/:id/notassociated' , ProductRoutes.obtenerNotAssociatedProductsByCompany);
router.get('/company/:id/all' , ProductRoutes.obtenerAllCompanyProductsByCompany);
router.get('/company/:id/deleted/' , ProductRoutes.obtenerDeletedCompanyProductsByCompany);
router.get('/company/:companyId/product/:productId', verifyToken, ProductRoutes.obtenerCompanyProductById);
router.post('/', upload.single('image'), verifyToken, ProductRoutes.altaProductoVal);
router.post('/associate', upload.single('image'), verifyToken, ProductRoutes.asociarProductoVal);
router.post('/company' , upload.single('image'), verifyToken, ProductRoutes.altaAsociacionProducto);
router.post('/bulk',  upload.single('image'), verifyToken, ProductRoutes.cargaBulkVal);
router.post('/company/:companyId/category/:categoryId/price', verifyToken, ProductRoutes.ajustarPrecioByCompanyByCategory);
router.put('/:productId/company/:companyId', upload.single('image'), verifyToken, ProductRoutes.modificarProducto);
router.delete('/company/:id', verifyToken, ProductRoutes.eliminarProducto);

module.exports = router;