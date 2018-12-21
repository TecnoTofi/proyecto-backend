//Incluimos modulo express para el manejo HTTP
const express = require('express');
//Creamos el router
const router = express.Router();

const multer = require('multer');
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
/*
//Todas las rutas empiezan con /api/product

//Obtener todas las categorias de productos
router.get('/category', ProductRoutes.getCategories);
//Obtener todos los productos
// router.get('/', ProductRoutes.getAllProducts);
//Insertar un producto
// router.post('/', upload.single('image'), verifyToken, ProductRoutes.insertProduct);
//Asociar un producto a una empresa
router.post('/company', verifyToken, ProductRoutes.insertCompanyProduct);
//Obtener los productos de una empresa por su ID
router.get('/company/:id', ProductRoutes.getProductByCompany);
//Obtener todos los productos con datos para el listado generico
router.get('/', ProductRoutes.getAllProductsGenericList);
//modificar Producto
router.post('/update/company/:id', upload.single('productImage'), ProductRoutes.updateCompanyProduct);
// router.post('/update/company/:id', ProductRoutes.updateCompanyProduct);
//eliminar producto
router.post('/delete/company/:id', ProductRoutes.deleteCompanyProduct);
//insertar y asociar producto
router.post('/', upload.single('productImage'), verifyToken, ProductRoutes.insertProductYAssociacion);
//Obtener todos los CompanyProduct de un mismo productId
router.get('/:id/companies',ProductRoutes.getProductCompanyByProduct);
//Obtener un producto por Id
router.get('/:id',ProductRoutes.getProductById);
*/

// Todas las rutas empiezan con /api/product

//Producto
router.get('/' , ProductRoutes.obtenerProducts);
router.get(/^\/company$/, ProductRoutes.obtenerCompanyProducts);
router.get('/:id' , ProductRoutes.obtenerProductById);
router.get('/code/:code' , ProductRoutes.obtenerProductByCode);
router.get('/category/:id' , ProductRoutes.obtenerProductsByCategory);

//CompanyProduct
router.get('/company/deleted' , ProductRoutes.obtenerDeletedCompanyProducts);
router.get(/^\/company\/all/, ProductRoutes.obtenerAllCompanyProducts);
router.get('/company/:id' , ProductRoutes.obtenerCompanyProductsByCompany);
// router.get('/company/list/:id' , ProductRoutes.obtenerCompanyProductsByCompanyList);
router.get('/company/:id/all' , ProductRoutes.obtenerAllCompanyProductsByCompany);
// router.get('/company/all/list/:id' , ProductRoutes.obtenerCompanyProductsAllByCompanyList);
router.get('/company/:id/deleted/' , ProductRoutes.obtenerDeletedCompanyProductsByCompany);
// router.get('/company/deleted/list/:id' , ProductRoutes.obtenerCompanyProductsDeletedByCompanyList);
// //
router.get('/company/:companyId/product/:productId', verifyToken, ProductRoutes.obtenerCompanyProductById);

router.post('/', verifyToken , upload.single('image'), ProductRoutes.altaProducto);
router.post('/associate', verifyToken, upload.single('image'), ProductRoutes.asociarProducto);
// // insertar y asociar producto
// router.post('/company' ,upload.single('image'), ProductRoutes.altaAsociacionProducto);
// //modificar Producto
// router.put('/update/company/:id', upload.single('productImage'), ProductRoutes.modificarProducto);
// //eliminar producto
// router.delete('/delete/company/:id', ProductRoutes.eliminarProducto);
module.exports = router;