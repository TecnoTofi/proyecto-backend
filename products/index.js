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

router.get('/category', ProductRoutes.getCategories);
router.get('/', ProductRoutes.getProducts);
router.post('/', upload.single('image'), verifyToken, ProductRoutes.insertProduct);
router.post('/company', verifyToken, ProductRoutes.insertCompanyProduct);

module.exports = router;