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
    if(file && (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg')){
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

const CompanyRoutes = require('./routes');
const { verifyToken } = require('../auth/routes');

//Todas las rutas empiezan con /api/company

router.get('/', CompanyRoutes.obtenerCompanies);
router.get('/all', CompanyRoutes.obtenerAllCompanies);
router.get('/deleted', CompanyRoutes.obtenerDeletedCompanies);
router.get('/type/:id', CompanyRoutes.obtenerCompaniesByType);
router.get('/rubro/:id', CompanyRoutes.obtenerCompaniesByRubro);
router.get('/:id', CompanyRoutes.obtenerCompanyById);
router.get('/rut/:rut', CompanyRoutes.obtenerCompanyByRut);
router.get('/name/:name', CompanyRoutes.obtenerCompanyByName);
// router.post('/', upload.single('companyImage'), CompanyRoutes.altaCompany); //Comentada para no dejar publicada
router.put('/:id', upload.single('companyImage'), verifyToken, CompanyRoutes.modificarCompany);
router.delete('/:id', verifyToken, CompanyRoutes.eliminarCompany);

module.exports = router;