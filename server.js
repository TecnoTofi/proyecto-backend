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
//Incluimos ruteo de analytics
const analyticRoutes = require('./analytics/index');

//Inicializamos APP
const app = express();
//Usamos morgan para logeo de conexiones
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
// app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cookieParser());
//Cors para permitir conexiones de servidores externos
app.use(cors());
//Hacemos publica la carpeta de imagenes para servir de URLs
app.use('/uploads', express.static('uploads'));

//Montamos ruteos propios
app.use('/api/auth', authRoutes);
app.use('/api/helper', helpersRoutes);
app.use('/api/user', usersRoutes);
app.use('/api/company', companiesRoutes);
app.use('/api/product', productsRoutes);
app.use('/api/package',packageRoutes);
app.use('/api/pedido', pedidosRoutes);
app.use('/api/voucher', voucherRoutes);
app.use('/api/analytics', analyticRoutes);

//Mensaje de bienvenida a / (root)
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