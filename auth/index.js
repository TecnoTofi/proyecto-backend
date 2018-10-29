//Incluimos modulo express para el manejo HTTP
const express = require('express');
//Creamos el router
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/companies/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString().replace(/:/g,'-') + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
};
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const AuthRoutes = require('./routes');

router.post('/login', AuthRoutes.login);
router.post('/logout', AuthRoutes.logout);
router.post('/signup', upload.single('companyImage'), AuthRoutes.signup);
// router.post('/signup', AuthRoutes.signup);

module.exports = router;