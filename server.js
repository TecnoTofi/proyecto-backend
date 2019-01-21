//Incluimos modulo express para el manejo HTTP
const express = require('express');
const morgan = require('morgan');
//Incluimos modulo body-parser para complementar express
const bodyParser = require('body-parser');
//Incluimos cookie-parser para el manejo de cookies
const cookieParser = require('cookie-parser');
//Incluimos modulo CORS para conectar con frontend React
const cors = require('cors');

//Incluimos autenticacion
const authRoutes = require('./auth/index');
//Incluimos helpers
const helpersRoutes = require('./helpers/index');
//Incluimos ruteo de usuarios
const usersRoutes = require('./users/index');
//Incluimos ruteo de empresas
const companiesRoutes = require('./companies/index');
//Incluimos ruteo de productos
const productsRoutes = require('./products/index');
//Incluimos ruteo de pedidos
const pedidosRoutes = require('./pedidos/index');
//Incluimos ruteo de paquetes
const packageRoutes = require('./packages/index');
//Incluimos ruteo de vouchers
const voucherRoutes = require('./vouchers/index');

//Inicializamos APP
const app = express();
app.use(morgan('dev'));
app.use(cors({
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
// app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cookieParser());
app.use(cors());
// app.use((re, res, next) => {
//     res.header("Access-Control-Allow-Origin", "http://localhost:3001");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
app.use('/uploads', express.static('uploads'));
// const allowCrossDomain = function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*"); // allow requests from any other server
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE'); // allow these verbs
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
//     next();
// };

// app.use(allowCrossDomain);
// app.set('trust proxy', true);

//Monstamos ruteos propios
app.use('/api/auth', authRoutes);
app.use('/api/helper', helpersRoutes);
app.use('/api/user', usersRoutes);
app.use('/api/company', companiesRoutes);
app.use('/api/product', productsRoutes);
app.use('/api/package',packageRoutes);
app.use('/api/pedido', pedidosRoutes);
app.use('/api/voucher', voucherRoutes);

//Mensaje de bienvenida a /
app.get('/', (req, res) => {
    res.json({message: 'Bienvenido a la plataforma de sistema de gestion de pedidos'});
  });

//Establecemos el puerto segun variable de ambiente del servidor o 3000 para ambiente de desarrollo
const PORT = process.env.PORT || 3000;
//Levanta servicio de escucha en el puerto indicado
app.listen(PORT, (error) => {
    if(error) console.log(`Error interno al levantar servicio : ${error}`);
    console.log(`Escuchando en Puerto: ${PORT}`);
});