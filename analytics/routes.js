const queries = require('./dbQueries');

async function obtenerRegistrosPorMes(req, res) {
    console.info('Conexion GET entrante : /api/analytics/signups');

    let { dateTo, dateFrom } = crearFechas();

    let { result, message } = await getRegistrosPorMes(dateTo, dateFrom);

    if(result){
        console.info(`Cantidad de registros por mes: ${result}`);
        console.info('Preparando response');
        res.status(200).json({message: `Cantidad de registros mensuales: ${result}`});
    }
    else{
        console.info('No se encontraron datos');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

async function obtenerLoginsPorMes(req, res) {
    console.info('Conexion GET entrante : /api/analytics/logins');
}

async function obtenerRegistroProductosPorMes(req, res) {
    console.info('Conexion GET entrante : /api/analytics/products');
}

async function obtenerRegistroPaquetesPorMes(req, res) {
    console.info('Conexion GET entrante : /api/analytics/packages');
}

async function obtenerPedidosPorMes(req, res) {
    console.info('Conexion GET entrante : /api/analytics/ventas/pedidos');
}

async function obtenerTransaccionesPorMes(req, res) {
    console.info('Conexion GET entrante : /api/analytics/ventas/transactions');
}

async function obtenerVentaProductosPorMes(req, res) {
    console.info('Conexion GET entrante : /api/analytics/ventas/products');
}

async function obtenerVentaPaquetesPorMes(req, res) {
    console.info('Conexion GET entrante : /api/analytics/ventas/packages');
}

async function getRegistrosPorMes(dateTo, dateFrom){
    console.info(`Buscando registros de usuarios desde ${dateTo} hasta ${dateFrom}`);
    let message = '';
    let result = await queries
                .usuarios
                .getSignUpsPorFecha(dateTo, dateFrom)
                .then(data => {
                    if(data.rows.length > 0) {
                        console.info(`Informacion obtenido`);
                        return Number(data.rows[0].count);
                    }
                    else{
                        console.info(`No hubo registros entre ${dateTo} y ${dateFrom}`);
                        message = `No hubo registros entre ${dateTo} y ${dateFrom}`;
                        return null;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query SELECT de Analytics User: ${err}`);
                    message = 'Ocurrio un error al obtener la informacion';
                });
    return { result, message };
}

async function getLoginsPorMes(dateTo, dateFrom){
    console.info(`Buscando logins de usuarios desde ${dateTo} hasta ${dateFrom}`);
    let message = '';
    let result = await queries
                .usuarios
                .getLoginsPorFecha(dateTo, dateFrom)
                .then(data => {
                    if(data) {
                        console.info(`Informacion obtenido`);
                        return data;
                    }
                    else{
                        console.info(`No hubo logins entre ${dateTo} y ${dateFrom}`);
                        message = `No hubo logins entre ${dateTo} y ${dateFrom}`;
                        return null;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query SELECT de Analytics User: ${err}`);
                    message = 'Ocurrio un error al obtener la informacion';
                });
    return { result, message };
}

async function getRegistroProductosPorMes(dateTo, dateFrom){
    console.info(`Buscando registros de productos desde ${dateTo} hasta ${dateFrom}`);
    let message = '';
    let result = await queries
                .productos
                .getRegistrosPorFecha(dateTo, dateFrom)
                .then(data => {
                    if(data) {
                        console.info(`Informacion obtenido`);
                        return data;
                    }
                    else{
                        console.info(`No hubo registros entre ${dateTo} y ${dateFrom}`);
                        message = `No hubo registros entre ${dateTo} y ${dateFrom}`;
                        return null;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query SELECT de Analytics Products: ${err}`);
                    message = 'Ocurrio un error al obtener la informacion';
                });
    return { result, message };
}

async function getRegistroPaquetesPorMes(dateTo, dateFrom){
    console.info(`Buscando registros de paquetes desde ${dateTo} hasta ${dateFrom}`);
    let message = '';
    let result = await queries
                .paquetes
                .getRegistrosPorFecha(dateTo, dateFrom)
                .then(data => {
                    if(data) {
                        console.info(`Informacion obtenido`);
                        return data;
                    }
                    else{
                        console.info(`No hubo registros entre ${dateTo} y ${dateFrom}`);
                        message = `No hubo registros entre ${dateTo} y ${dateFrom}`;
                        return null;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query SELECT de Analytics Package: ${err}`);
                    message = 'Ocurrio un error al obtener la informacion';
                });
    return { result, message };
}

async function getPedidosPorMes(dateTo, dateFrom){
    console.info(`Buscando pedidos realizados desde ${dateTo} hasta ${dateFrom}`);
    let message = '';
    let result = await queries
                .pedidos
                .getPedidosPorFecha(dateTo, dateFrom)
                .then(data => {
                    if(data) {
                        console.info(`Informacion obtenido`);
                        return data;
                    }
                    else{
                        console.info(`No hubo pedidos realizados entre ${dateTo} y ${dateFrom}`);
                        message = `No hubo pedidos realizados entre ${dateTo} y ${dateFrom}`;
                        return null;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query SELECT de Analytics Pedido: ${err}`);
                    message = 'Ocurrio un error al obtener la informacion';
                });
    return { result, message };
}

async function getTransaccionesPorMes(dateTo, dateFrom){
    console.info(`Buscando transacciones realizadas desde ${dateTo} hasta ${dateFrom}`);
    let message = '';
    let result = await queries
                .pedidos
                .getTransactionsPorFecha(dateTo, dateFrom)
                .then(data => {
                    if(data) {
                        console.info(`Informacion obtenido`);
                        return data;
                    }
                    else{
                        console.info(`No hubo transacciones realizadas entre ${dateTo} y ${dateFrom}`);
                        message = `No hubo transacciones realizadas entre ${dateTo} y ${dateFrom}`;
                        return null;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query SELECT de Analytics Pedido: ${err}`);
                    message = 'Ocurrio un error al obtener la informacion';
                });
    return { result, message };
}

async function getVentaProductosPorMes(dateTo, dateFrom){
    console.info(`Buscando ventas de productos realizadas desde ${dateTo} hasta ${dateFrom}`);
    let message = '';
    let result = await queries
                .pedidos
                .getProductsPorFecha(dateTo, dateFrom)
                .then(data => {
                    if(data) {
                        console.info(`Informacion obtenido`);
                        return data;
                    }
                    else{
                        console.info(`No hubo ventas de productos realizadas entre ${dateTo} y ${dateFrom}`);
                        message = `No hubo ventas de productos realizadas entre ${dateTo} y ${dateFrom}`;
                        return null;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query SELECT de Analytics Pedido: ${err}`);
                    message = 'Ocurrio un error al obtener la informacion';
                });
    return { result, message };
}

async function getVentaPaquetesPorMes(dateTo, dateFrom){
    console.info(`Buscando ventas de paquetes realizadas desde ${dateTo} hasta ${dateFrom}`);
    let message = '';
    let result = await queries
                .pedidos
                .getPackagesPorFecha(dateTo, dateFrom)
                .then(data => {
                    if(data) {
                        console.info(`Informacion obtenido`);
                        return data;
                    }
                    else{
                        console.info(`No hubo ventas de paquetes realizadas entre ${dateTo} y ${dateFrom}`);
                        message = `No hubo ventas de paquetes realizadas entre ${dateTo} y ${dateFrom}`;
                        return null;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query SELECT de Analytics Pedido: ${err}`);
                    message = 'Ocurrio un error al obtener la informacion';
                });
    return { result, message };
}

function crearFechas(){
    console.info('Creando fechas del mes actual');

    let dateTo = new Date();
    dateTo.setUTCDate(dateTo.getDate() - dateTo.getDate() + 1);
    dateTo.setUTCHours(0, 0, 0, 0);
    let dateFrom = new Date();
    dateFrom.setUTCMonth(1)
    dateFrom.setUTCDate(0);
    dateFrom.setUTCHours(23, 59, 59, 999);

    console.info('Fechas creadas');
    console.info(`Desde ${dateTo} hasta ${dateFrom}`);

    return { dateTo, dateFrom };
}

module.exports = {
    obtenerRegistrosPorMes,
    obtenerLoginsPorMes,
    obtenerRegistroProductosPorMes,
    obtenerRegistroPaquetesPorMes,
    obtenerPedidosPorMes,
    obtenerTransaccionesPorMes,
    obtenerVentaProductosPorMes,
    obtenerVentaPaquetesPorMes
}