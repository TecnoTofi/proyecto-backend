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

const ProductRoutes = require('./routes');
const { verifyToken } = require('../auth/routes');

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

module.exports = router;