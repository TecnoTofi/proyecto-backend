//Incluimos Joi para validaciones
const Joi = require('joi');
//Incluimos queries de DB
const queries = require('./dbQueries');
//Incluimos funciones de helpers
const { validarId } = require('../helpers/routes');
//Incluimos funciones de users
const { getUserById, getUserByCompanyId, getUserByEmail } = require('../users/routes');
//Incluimos funciones de companies
const { getCompanyById } = require('../companies/routes');
//Incluimos funciones de productos
const {
    ajustarStock: ajustarStockProd, 
    getCompanyProductById,
    getLastPrices: getLastPricesProducts,
    getPriceById: getPriceByIdProduct
} = require('../products/routes');
//Incluimos funciones de paquetes
const {
    ajustarStock: ajustarStockPack, 
    getPackageById,
    getLastPrices: getLastPricesPackages,
    getPriceById: getPriceByIdPackage
} = require('../packages/routes');
//Incluimos funciones de voucher
const {
    getVoucherById,
    getVoucherByCode,
    validacionVoucher,
    ajustarStock: ajustarStockVoucher,
    insertVoucherCompany,
    rollbackVoucherCompany
} = require('../vouchers/routes');

//Incluimos funciones de pagos
const { realizarPago } = require('../payment/routes');

//Endpoint para obtener todos los pedidos
async function obtenerPedidos(req, res){
    console.info('Conexion GET entrante : /api/pedido');

    //Obtenemos los datos
    let { pedidos, message } = await getPedidos();

    if(pedidos){
        //Retornamos los datos
        console.info(`${pedidos.length} pedidos encontrados`);
        console.info('Preparando response');
        res.status(200).json(pedidos);
    }
    else{
        //Si fallo, damos error
        console.info('No se encontraron pedidos');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

//Endpoint para obtener un pedido filtrado por Id
async function obtenerPedidoById(req, res){
    console.log(`Conexion GET entrante : /api/pedido/${req.params.id}`);

    //Validamos parametro de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        //Si hay error retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        //Obtenemos los datos
        console.info('Validacion de tipos exitosa');
        console.info(`Yendo a buscar pedido con ID: ${req.params.id}`);
        let { pedido, message } = await getPedidoById(req.params.id);

        if(pedido){
            //Retornamos los datos
            console.info('Pedido encontrado');
            console.info('Preparando response');
            res.status(200).json(pedido);
        }
        else{
            //Si fallo, damos error
            console.info('No se encontro pedido');
            console.info('Preparando response');
            res.status(400).json({message});
        }
    }
}

//Endpoint para obtener un pedido filtrado por Id usuario
async function obtenerPedidosByUser(req, res){
    console.info(`Conexion GET entrante : /api/pedido/user/${req.params.id}`);
    
    //Validamos parametro de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        //Si hay error retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        //Obtenemos el usuario
        console.info(`Comprobando existencia de usuario ${req.params.id}`);
        let { user, message: userMessage } = await getUserById(req.params.id);

        if(!user){
            //Si fallo, damos error
            console.info(`No existe ususario con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message: userMessage});
        }
        else{
            if(user.email === req.body.userEmail){
                //Obtenemos los datos
                console.info(`Obteniendo pedidos de usuario ${user.name}`);
                let { pedidos, message } = await getPedidosByUser(req.params.id);
    
                if(pedidos){
                    //Retornamos los datos
                    console.info(`${pedidos.length} pedidos encontrados`);
                    console.info('Preparando response');
                    res.status(200).json(pedidos);
                }
                else{
                    //Si fallo, damos error
                    console.info('No se encontraron pedidos');
                    console.info('Preparando response');
                    res.status(200).json({message});
                }
            }
            else{
                //Usuario enviado y logueado no coinciden
                console.info('Token no corresponde con usuario enviado por parametros');
                console.info('Preparando response');
                res.status(200).json({message: 'Token no corresponde con usuario solicitado'});
            }
        }
    } 
}

//Endpoint para obtener un pedido filtrado por Id usuario
async function obtenerPedidosByDate(req, res){
    console.info('Conexion GET entrante : /api/pedido/date');
    
    //Armamos las fechas
    console.info('Comenzando validacion de tipos');
    let fechas = {
        dateFrom: new Date(req.body.dateFrom).toUTCString(),
        dateTo: new Date(req.body.dateTo).toUTCString()
    };

    //Validamos datos
    let { error } = validarFechas(fechas);

    if(error){
        //Si hay error retornamos
        console.info('Erorres encontrados en la request');
        let errores = error.details.map(e => {
            console.info(e.message);
            return e.message;
        });
        console.info('Preparando response');
        res.status(400).json({message: errores});
    }
    else{

        //Obtenemos los datos
        let { pedidos, message } = await getPedidosByDate(fechas);

        if(pedidos){
            //Retornamos los datos
            console.info(`${pedidos.length} pedidos encontrados`);
            console.info('Preparando response');
            res.status(200).json(pedidos);
        }
        else{
            //Si fallo, damos error
            console.info('No se encontraron pedidos');
            console.info('Preparando response');
            res.status(200).json({message});
        }
    }
}

//Endpoint para obtener un pedido filtrado por Id usuario y fecha
async function obtenerPedidosByDateByUser(req, res){
    console.info(`Conexion GET entrante : /api/pedido/user/${req.params.id}/date`);

    //Validamos parametro de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        //Si hay error retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        //Armamos fechas
        console.info('Comenzando validacion de tipos');
        let fechas = {
            dateFrom: new Date(req.body.dateFrom).toUTCString(),
            dateTo: new Date(req.body.dateTo).toUTCString()
        };

        //Validamos fechas
        let { error: errorFechas } = validarFechas(fechas);

        if(errorFechas){
            //Si hay error retornamos
            console.info('Erorres encontrados en la request');
            let errores = errorFechas.details.map(e => {
                console.info(e.message);
                return e.message;
            });
            console.info('Preparando response');
            res.status(400).json({message: errores});
        }
        else{

            //Obtenemos el usuario
            let { user, message: userMessage } = await getUserById(req.params.id);

            if(user){
                //Obtenemos los datos
                let { pedidos, message } = await getPedidosByDateByUser(req.params.id, fechas.dateFrom, fechas.dateTo);

                if(pedidos){
                    //Retornamos los datos
                    console.info(`${pedidos.length} pedidos encontrados`);
                    console.info('Preparando response');
                    res.status(200).json(pedidos);
                }
                else{
                    //Si fallo, damos error
                    console.info('No se encontraron pedidos');
                    console.info('Preparando response');
                    res.status(200).json({message});
                }
            }
            else{
                //Si fallo, damos error
                console.info(`No se encontro el usuario ${req.params.id}`);
                console.info('Preparando response');
                res.status(400).json({message: userMessage});
            }
        }
    }
}

//Endpoint para obtener transaccion filtrado por compania
async function obtenerTransactionsByCompany(req, res){
    console.info(`Conexion GET entrante : /api/pedido/company/${req.params.id}`);
    
    //Validamos parametro de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        //Si hay error retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        //Obtenemos la compania
        console.info(`Comprobando existencia de compania ${req.params.id}`);
        let { company, message: companyMessage } = await getCompanyById(req.params.id);

        if(!company){
            //Si fallo, damos error
            console.info(`No existe company con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message: companyMessage});
        }
        else{
            //Obtenemos el usuario
            let { user, message: userMessage } = await getUserByCompanyId(company.id);

            if(!user){
                //Si fallo, damos error
                console.info(`No existe usuario para la compania con ID: ${req.params.id}`);
                console.info('Preparando response');
                res.status(400).json({message: userMessage});
            }
            if(user.email === req.body.userEmail){
                //Obtenemos los datos
                console.info(`Obteniendo pedidos de compania ${company.name}`);
                let { transactions, message } = await getTransactionsByCompany(req.params.id);
    
                if(transactions){
                    //Retornamos los datos
                    console.info(`${transactions.length} transacciones encontradas`);
                    console.info('Preparando response');
                    res.status(200).json(transactions);
                }
                else{
                    //Si fallo, damos error
                    console.info('No se encontraron transacciones');
                    console.info('Preparando response');
                    res.status(200).json({message});
                }
            }
            else{
                //Si fallo, damos error
                console.info('Token no corresponde con usuario correspondiente a la empresa');
                console.info('Preparando response');
                res.status(400).json({message: 'Token no corresponde con compania'});
            }
        }
    } 
}

//Endpoint para obtener los pedidos filtrado por Id usuario, seller y fechas
async function obtenerPedidosByDateByUserBySeller(req, res){
    console.info(`Conexion GET entrante : /api/pedido/user/${req.params.id}/seller/${req.params.sellerId}/date`);

    //Validamos parametro de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        //Si hay error retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info('Comenzando validacion de tipos');
        let fechas = {
            dateFrom: new Date(req.body.dateFrom).toUTCString(),
            dateTo: new Date(req.body.dateTo).toUTCString()
        };

        //Validamos parametros
        let { error: errorFechas } = validarFechas(fechas);

        if(errorFechas){
            //Si hay error retornamos
            console.info('Erorres encontrados en la request');
            let errores = errorFechas.details.map(e => {
                console.info(e.message);
                return e.message;
            });
            console.info('Preparando response');
            res.status(400).json({message: errores});
        }
        else{
            
            //Obtenemos el usuario
            let { user, message: userMessage } = await getUserById(req.params.id);

            if(user){
                //Obtenemos los datos
                let { pedidos, message } = await getPedidosByDateByUserBySeller(req.params.id, fechas.dateFrom, fechas.dateTo, req.params.sellerId);

                if(pedidos){
                    //Filtramos por el seller
                    let pedidosRet = pedidos.filter(ped => {
                        let transactions = ped.transactions.filter(tran => {
                            if(tran.sellerId === req.params.sellerId) return tran;
                        })
                        ped.transactions = transactions;
                        if(ped.transactions.length === 0) return null;
                        else return ped;
                    });
                    console.info(`${pedidosRet.length} pedidos encontrados`);
                    console.info('Preparando response');
                    //Retornamos los datos
                    res.status(200).json(pedidosRet);
                }
                else{
                    //Si fallo, damos error
                    console.info('No se encontraron pedidos');
                    console.info('Preparando response');
                    res.status(200).json({message});
                }
            }
            else{
                //Si fallo, damos error
                console.info(`No se encontro el usuario ${req.params.id}`);
                console.info('Preparando response');
                res.status(400).json({message: userMessage});
            }
        }
    }
}

//Endpoint para obtener los pedidos estimados filtrado por Id usuario, seller y fechas
async function obtenerPedidosByDateByUserBySellerEstimados(req, res){
    console.info(`Conexion GET entrante : /api/pedido/user/${req.params.id}/seller/${req.params.sellerId}/date/estimado`);

    //Validamos parametro de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        //Si hay error retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        //Armamos las fechas
        console.info('Comenzando validacion de tipos');
        let fechas = {
            dateFrom: new Date(req.body.dateFrom).toUTCString(),
            dateTo: new Date(req.body.dateTo).toUTCString()
        };

        //Validamos parametros
        let { error: errorFechas } = validarFechas(fechas);

        if(errorFechas){
            //Si hay error retornamos
            console.info('Erorres encontrados en la request');
            let errores = errorFechas.details.map(e => {
                console.info(e.message);
                return e.message;
            });
            console.info('Preparando response');
            res.status(400).json({message: errores});
        }
        else{

            //Obtenemos el usuario
            let { user, message: userMessage } = await getUserById(req.params.id);

            if(user){
                //Obtenemos los datos
                let { pedidos, message } = await getPedidosByDateByUserBySellerEstimados(req.params.id, fechas.dateFrom, fechas.dateTo, req.params.sellerId);

                if(pedidos){
                    //Retornamos los datos
                    console.info(`${pedidos.length} pedidos encontrados`);
                    console.info('Preparando response');
                    res.status(200).json(pedidos);
                }
                else{
                    //Si fallo, damos error
                    console.info('No se encontraron pedidos');
                    console.info('Preparando response');
                    res.status(200).json({message});
                }
            }
            else{
                //Si fallo, damos error
                console.info(`No se encontro el usuario ${req.params.id}`);
                console.info('Preparando response');
                res.status(400).json({message: userMessage});
            }
        }
    }
}

//Endpoint para obtener reporte de productos mas vendidos filtrado por compania
async function obtenerCincoProductosMasVendidos(req, res){
    console.info(`Conexion GET entrante : /api/pedido//company/${req.params.id}/masVendido`);
    
    //Armamos fecha
    console.info('Comenzando validacion de tipos');
    let dateFrom = new Date(req.body.dateFrom).toUTCString();

    //Validamos parametro
    let { error } = validarFecha(dateFrom);

    if(error){
        //Si hay error retornamos
        console.info('Erorres encontrados en la request');
        let errores = error.details.map(e => {
            console.info(e.message);
            return e.message;
        });
        console.info('Preparando response');
        res.status(400).json({message: errores});
    }
    else{
        //Validamos parametro de la URL
        console.info(`Comenzando validacion de tipos`);
        let { error } = validarId(req.params.id);

        if(error){
            //Si hay error retornamos
            console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
            console.info('Preparando response');
            res.status(400).json({message: error.details[0].message});
        }   
        else{
            //Obtenemos la compania
            console.info(`Comprobando existencia de compania ${req.params.id}`);
            let { company, message: companyMessage } = await getCompanyById(req.params.id);

            if(!company){
                //Si hay error retornamos
                console.info(`No existe company con ID: ${req.params.id}`);
                console.info('Preparando response');
                res.status(400).json({message: companyMessage});
            }
            else{
                //Obtenemos los datos
                let { productos, message: productsMessage } = await getCincoProductosMasVendidos(req.params.id, dateFrom);
                let { paquetes, message: packagesMessage } = await getCincoPaquetesMasVendidos(req.params.id, dateFrom);

                if(productos && paquetes){
                    //Retornamos los datos
                    console.info(`${productos.length} productos encontrados`);
                    console.info(`${paquetes.length} productos encontrados`);
                    console.info('Preparando response');
                    res.status(200).json({productos, paquetes});
                }
                else if(productos && !paquetes){
                    //Retornamos los datos
                    console.info(`${productos.length} productos encontrados`);
                    console.info(`No se encontraron paquetes`);
                    console.info('Preparando response');
                    res.status(200).json({productos, packagesMessage});
                }
                else if(!productos && paquetes){
                    //Si fallo, damos error
                    console.info(`${paquetes.length} paquetes encontrados`);
                    console.info(`No se encontraron productos`);
                    console.info('Preparando response');
                    res.status(200).json({paquetes, productsMessage});
                }
                else{
                    //Si fallo, damos error
                    console.info('No se encontraron productos ni paquetes');
                    console.info('Preparando response');
                    res.status(200).json({productsMessage, packagesMessage});
                }
            }   
        }
    }
}

//Endpoint para obtener reporte de productos mas vendidos filtrado por compania
async function obtenerCincoProductosMenosVendidos(req, res){
    console.info(`Conexion GET entrante : /api/pedido//company/${req.params.id}/menosVendido`);
    
    console.info('Comenzando validacion de tipos');
    let dateFrom = new Date(req.body.dateFrom).toUTCString();

    //Validamos parametro
    let { error } = validarFecha(dateFrom);

    if(error){
        //Si hay error retornamos
        console.info('Erorres encontrados en la request');
        let errores = error.details.map(e => {
            console.info(e.message);
            return e.message;
        });
        console.info('Preparando response');
        res.status(400).json({message: errores});
    }
    else{
        //Validamos parametro de la URL
        console.info(`Comenzando validacion de tipos`);
        let { error } = validarId(req.params.id);

        if(error){
            //Si hay error retornamos
            console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
            console.info('Preparando response');
            res.status(400).json({message: error.details[0].message});
        }   
        else{
            //Obtenemos la compania
            console.info(`Comprobando existencia de compania ${req.params.id}`);
            let { company, message: companyMessage } = await getCompanyById(req.params.id);

            if(!company){
                //Si hay error retornamos
                console.info(`No existe company con ID: ${req.params.id}`);
                console.info('Preparando response');
                res.status(400).json({message: companyMessage});
            }
            else{
                //Obtenemos los datos
                let { productos, message: productsMessage } = await getCincoProductosMenosVendidos(req.params.id, dateFrom);
                let { paquetes, message: packagesMessage } = await getCincoPaquetesMenosVendidos(req.params.id, dateFrom);

                if(productos && paquetes){
                    //Retornamos los datos
                    console.info(`${productos.length} productos encontrados`);
                    console.info(`${paquetes.length} productos encontrados`);
                    console.info('Preparando response');
                    res.status(200).json({productos, paquetes});
                }
                else if(productos && !paquetes){
                    //Retornamos los datos
                    console.info(`${productos.length} productos encontrados`);
                    console.info(`No se encontraron paquetes`);
                    console.info('Preparando response');
                    res.status(200).json({productos, packagesMessage});
                }
                else if(!productos && paquetes){
                    //Retornamos los datos
                    console.info(`${paquetes.length} paquetes encontrados`);
                    console.info(`No se encontraron productos`);
                    console.info('Preparando response');
                    res.status(200).json({paquetes, productsMessage});
                }
                else{
                    //Si fallo, damos error
                    console.info('No se encontraron productos ni paquetes');
                    console.info('Preparando response');
                    res.status(200).json({productsMessage, packagesMessage});
                }
            }   
        }
    }
}

//Funcion para calcular el costo de un pedido
async function calcularTotal(req, res){
    console.info('Conexion POST entrante : /api/pedido/calcular');

    //Creo body para validacion
    let validar = {
        contenido: req.body.contenido,
        voucher: req.body.voucher
    };
    
    //Validamos parametros
    let { error } = validarCalculo(validar);

    if(error){
        //Si hay error retornamos
        console.info('Erorres encontrados en la request');
        let errores = error.details.map(e => {
            console.info(e.message);
            return e.message;
        });
        console.info('Preparando response');
        res.status(400).json({message: errores});
    }
    else{
        console.info('Validaciones Joi exitosas');

        //Obtenemos el usuario
        let { user, message: userMessage } = await getUserByEmail(req.body.userEmail);

        if(!user){
            //Si fallo, damos error
            console.info('Hubo un problema al obtener el usuario');
            console.info(userMessage);
            console.info('Preparando response');
            res.status(500).json({message: 'Ocurrio un problema al procesar la solicitud'})
        }
        else{
            console.info('Analizando contenido');
            //Obtenemos los datos
            let { armado, sumaProds, sumaPacks, errorMessage, voucher } = await analizarContenido(req.body.contenido, req.body.voucher, user.companyId);

            if(errorMessage.length === 0){
                console.info('Contenido analizado');
                let total = sumaProds + sumaPacks;
                if(voucher && voucher.type === 'valor') total = total - voucher.value;
                if(voucher && voucher.type === 'porcentaje') total -= total * (voucher.value / 100);

                console.info(`Total calculado $${total}`);
                console.info('Preparando response');
                //Retornamos los datos
                res.status(200).json({ total, sumaProds, sumaPacks, voucher });
            }
            else{
                //Si fallo, damos error
                console.info(`Se encontraron ${errorMessage.length} errores al analizar el contenido`);
                errorMessage.map(err => console.log(err));
                console.info('Enviando response')
                res.status(400).json({message: errorMessage});
            }
        }
    }
}

//Funcion para realizar un pedido
async function realizarPedido(req, res){
    console.info('Conexion POST entrante : /api/pedido');

    console.info('Enviando a validar tipos de datos en request');
    //Armamos body de pedido
    let valPedido = {
        userId: req.body.userId,
        buyerId: req.body.buyerId,
        amount: req.body.amount,
        voucher: req.body.voucher,
        deliveryType: req.body.deliveryType,
        contenido: req.body.contenido
    };
    let { error } = validarPedido(valPedido);
    
    if(error){
        //Si hay error retornamos
        console.info('Erorres encontrados en la request');
        let errores = error.details.map(e => {
            console.info(e.message);
            return e.message;
        });
        console.info('Preparando response');
        res.status(400).json({message: errores});
    }
    else{
        console.info('Validaciones de tipo de datos exitosa');
        console.info('Comenzando validaciones de existencia');

        //Si hay contenido sigo, si no devuelvo error
        if(req.body.contenido.length > 0){
            //validacion de existencia (userId, sellerId, buyerId, productos y paquetes)
            let errorMessage = [];

            //Busco el usuario
            console.info(`Buscando usuario comprador con ID: ${req.body.userId}`);
            let { user: userById, message: userMessage } = await getUserById(req.body.userId);
            //Si el usuario no existe, concateno mensaje de error
            if(!userById) errorMessage.push(userMessage);

            //Busco empresa asociada al usuario
            console.info(`Buscando compania compradora con ID: ${req.body.buyerId}`);
            let { company: companyById, message: companyMessage } = await getCompanyById(req.body.buyerId);
            //Si la empresa no existe, concateno mensaje de error
            if(!companyById) errorMessage.push(companyMessage);

            //validar que la compania es la misma que la del usuario
            if(companyById && userById && companyById.id !== userById.companyId)
                errorMessage.push('El usuario ingresado no corresponde con la empresa ingresada');

            console.info('Analizamos contenido para validar existencias');
            let { armado, sumaProds, sumaPacks, errorMessage: errores, voucher } = await analizarContenido(req.body.contenido, req.body.voucher, userById.companyId);
            req.body.contenido = armado;
            errorMessage.concat(errores);

            //Si fallo, damos error
            if(errorMessage.length > 0){
                console.info(`Se encontraron ${errorMessage.length} errores de existencia en la request`);
                errorMessage.map(err => console.log(err));
                console.info('Enviando response')
                res.status(400).json({message: errorMessage});
            }
            else{
                console.log('Validaciones de existencias exitosas');
                console.log('Validando amount de pedido');

                //Validamos que el total recibido sea la suma correcta
                let total = sumaProds + sumaPacks;
                if(voucher && voucher.type === 'valor') total = total - voucher.value;
                if(voucher && voucher.type === 'porcentaje') total -= total * (voucher.value / 100);

                //Si el amount no es igual, damos error
                if(req.body.amount === total){
                    let rollback = false;
                    console.log('Amount ingresado es valido');

                    //Preparacion de objecto pedido knex a insertar
                    console.log('Creando objeto pedido para insercion');
                    let pedido = {
                        userId: req.body.userId,
                        timestamp: new Date(),
                        amount: total,
                        voucher: voucher ? voucher.id : null
                    };
                    console.log('Enviando Query INSERT para Pedido');
                    let pedidoRes = await insertPedido(pedido);

                    // Armar transacciones, una por cada seller
                    if(pedidoRes.id){
                        console.log(`Pedido insertado correctamente, ID: ${pedidoRes.id}`);

                        //realizar pago
                        let pagoRes = await realizarPago(pedidoRes.id, pedido.amount, req.body.contenido);

                        //Si fallo pago, damos error
                        if(!pagoRes){
                            console.log('Fallo pago de factura');
                            console.log('Comenzando rollbacks de pedido');
                            let rollbackPed = await rollbackPedido(pedidoRes.id);
                            if(rollbackPed.result) console.log(`Rollback de pedido ${pedidoRes.id} realizado correctamente`);
                            else console.log(`Ocurrio un error en rollback de pedido ${pedidoRes.id}`);
                            
                            res.status(500).json({message: 'No se pudo completar el pedido'});
                        }
                        else{
                            let voucherCompanyId;

                            //Procesamos voucher
                            if(voucher){
                                let voucherReducido = ajustarStockVoucher(voucher.id, 1, 'reducir');
                                if(voucherReducido) console.info("Stock de vaucher reducido correctamente");
                                else{
                                    rollback = true;
                                    console.info('No se pudo reducir el stock del voucher');
                                }

                                let { id, message } = await insertVoucherCompany({companyId: userById.companyId, voucherId: voucher.id});
                                if(!id){
                                    rollback = true;
                                    console.info('No se pudo insertar VoucherCompany');
                                }
                                else{
                                    voucherCompanyId = id;
                                    console.info('VoucherCompany insertado correctamente');
                                }
                            }

                            let transactionsOk = true, productsOk = true, packagesOk = true, pedidoTransactionOK = true, deliveriesOK = true;
                            let transactionsIds = [], pedidoTransactionsIds = [], deliveriesIds = [], productsIds = [], packagesIds = [];
                            let seller = {};

                            console.log('Comenzando armado e insercion de transacciones');

                            let j = 0;
                            while(j < req.body.contenido.length && transactionsOk && productsOk && packagesOk && pedidoTransactionOK && deliveriesOK && !rollback){
                                let sellerProductsIds = [], sellerPackagesIds = [];
                                seller = req.body.contenido[j];
                                j++;

                                //Armamos la transaccion
                                console.log(`Armando transaccion de seller ${seller.sellerId}`);
                                let transaction = {
                                    amount: seller.amount,
                                    sellerId: seller.sellerId,
                                    buyerId: req.body.buyerId,
                                    timestamp: new Date()
                                }

                                console.log(`Enviando para insercion transaccion de seller ${seller.sellerId}`);
                                let transactionRes = await insertTransaction(transaction);

                                if(transactionRes.id){
                                    console.log(`Transaccion de seller ${seller.sellerId} insertada correctamente con ID: ${transactionRes.id}`);
                                    transactionsIds.push(transactionRes.id);

                                    console.log(`Comenzando armado e insercion de transactionProducts para seller ${seller.sellerId}`);
                                    let i = 0;
                                    while(i < seller.productos.length && productsOk){
                                        let producto = seller.productos[i];
                                        i++;

                                        console.log(`Armando producto con ID: ${producto.id} para insercion de transactionProduct`);
                                        let prod = {
                                            transactionId: transactionRes.id,
                                            productId: producto.id,
                                            quantity: producto.quantity,
                                            priceId: producto.priceId
                                        }

                                        console.log(`Enviando producto con ID: ${producto.id} para insercion transaccionProduct de seller ${seller.sellerId}`);
                                        let prodRes = await insertTransactionProduct(prod);

                                        if(!prodRes.id){
                                            console.log(`Fallo insert de transactionProduct con ID: ${producto.id}`);
                                            errorMessage.push(prodRes.message);
                                            productsOk = false;
                                            rollback = true;
                                        }
                                        else{
                                            console.log(`TransaccionProduct de seller ${seller.sellerId} insertada correctamente con ID: ${prodRes.id}`);
                                            sellerProductsIds.push(prodRes.id);
                                            let prodReducido = await ajustarStockProd(producto.id, producto.quantity, 'reducir');
                                            if(!prodReducido){
                                                productsIds.push({id: prodRes.id});
                                                productsOk = false;
                                                rollback = true;
                                            }
                                            else{
                                                productsIds.push({id: prodRes.id, cantidad: producto.quantity});
                                            }
                                        }
                                    }

                                    console.log(`Comenzando armado e insercion de transactionPackages para seller ${seller.sellerId}`);
                                    let x = 0;
                                    while(x< seller.paquetes.length && packagesOk){
                                        let paquete = seller.paquetes[x];
                                        x++;

                                        console.log(`Armando paquete con ID: ${paquete.id} para insercion de transactionPackage`);
                                        let pack = {
                                            transactionId: transactionRes.id,
                                            packageId: paquete.id,
                                            quantity: paquete.quantity,
                                            priceId: paquete.priceId
                                        }

                                        console.log(`Enviando paquete con ID: ${paquete.id} para insercion transaccionPackage de seller ${seller.sellerId}`);
                                        let packRes = await insertTransactionPackage(pack);

                                        if(!packRes.id){
                                            console.log(`Fallo insert de transactionPackage con ID: ${paquete.id}`);
                                            errorMessage.push(packRes.message);
                                            packagesOk = false;
                                            rollback = true;
                                        }
                                        else{
                                            console.log(`TransaccionProduct de seller ${seller.sellerId} insertada correctamente con ID: ${packRes.id}`);
                                            sellerPackagesIds.push(packRes.id);
                                            let packReducido = await ajustarStockPack(paquete.id, paquete.quantity, 'reducir');
                                            if(!packReducido){
                                                packagesIds.push({id: packRes.id});
                                                packagesOk = false;
                                                rollback = true;
                                            }
                                            else{
                                                packagesIds.push({id: packRes.id, cantidad: paquete.quantity});
                                            }
                                        }
                                    }

                                    //Valido que todos los inserts de este seller esten bien para poder insertar pedidoTransaction
                                    if(sellerProductsIds.length === seller.productos.length && sellerPackagesIds.length === seller.paquetes.length && transactionsOk && productsOk && packagesOk){
                                        console.log(`Transaction, TransactionProducts y TransactionPackages insertados correctamente para seller ${seller.sellerId}`);

                                        console.log(`Armando PedidoTransaction para pedido ${pedidoRes.id} y transaction ${transactionRes.id}`);
                                        let pedTran = {
                                            pedidoId: pedidoRes.id,
                                            transactionId: transactionRes.id
                                        }

                                        console.log('Enviando para insercion pedidoTransaction');
                                        let pedidoTransactionRes = await insertPedidoTransaction(pedTran);
                    
                                        if(pedidoTransactionRes.id){
                                            console.log(`PedidoTransaction insertado correctamente con ID: ${pedidoTransactionRes.id}`);
                                            pedidoTransactionsIds.push(pedidoTransactionRes.id);
                                            // insert de delivery

                                            let despachador = 0;
                                            if(req.body.deliveryType === 'Comprador') despachador = req.body.buyerId;
                                            else despachador = seller.sellerId;

                                            //Armamos body de insert de delivery
                                            let delivery = {
                                                type: req.body.deliveryType,
                                                transactionId: transactionRes.id,
                                                companyId: despachador,
                                                userId: req.body.userId,
                                                timestamp: new Date(),
                                                status: 'Pendiente'
                                            }

                                            let deliveryRes = await insertDelivery(delivery);

                                            if(deliveryRes.id){
                                                console.log(`Delivery insertado correctamente con ID: ${deliveryRes.id}`);
                                                deliveriesIds.push(deliveryRes.id);
                                            }
                                            else{
                                                //Si falla, marcamos rollback
                                                console.log(`Error en insert Delivery para transaction ${transactionRes.id}`);
                                                errorMessage.push(deliveryRes.message);
                                                deliveriesOK = false;
                                                rollback = true;
                                            }

                                        }
                                        else{
                                            //Si falla, maracamos rollback
                                            console.log(`Error en insert PedidoTransaction para pedido ${pedidoRes.id} y transaction ${transactionRes.id}`);
                                            pedidoTransactionOK = false;
                                            rollback = true;
                                        }
                                    }//fin if todo salio bien para esa transaccion
                                    else{
                                        console.log(`Ocurrio un error al finalizar los inserts de la transacccion ${transactionRes.id}`);
                                        transactionsOk = false;
                                        rollback = true;
                                    }
                                }//fin if transaction se inserto correctamente
                                else{
                                    console.log(`Error en insert transaccion de seller ${transaction.sellerId}, con error: ${transactionRes.message}`);
                                    errorMessage.push(transactionRes.message);
                                    transactionsOk = false;
                                    rollback = true;
                                }
                            }//end while de transactions

                            //Terminaron todos los inserts, verificamos que todo este ok o damos rollback
                            if(!rollback && transactionsIds.length === req.body.contenido.length && pedidoTransactionsIds.length === req.body.contenido.length && deliveriesIds.length === req.body.contenido.length){
                                console.log('Pedido finalizado exitosamente');
                                res.status(201).json(pedidoRes.id);
                            }
                            else{
                                //Comenzamos proceso de rollback
                                console.log('Ocurrio un error en el proceso de inserts, comenzando rollback');

                                console.log('Comenzando rollbacks de deliveries');
                                for(let id of deliveriesIds){
                                    console.log(`Enviando rollback de delivery ID: ${id}`);
                                    let rollackDelivery = await rollbackDelivery(id);
                                    if(rollackDelivery.result) console.log(`Rollback de delivery ${id} realizado correctamente`);
                                    else console.log(`Ocurrio un error en rollback de delivery ${id}`);
                                }

                                console.log('Comenzando rollbacks de transactionPackages');
                                for(let paq of packagesIds){
                                    console.log(`Enviando rollback de transactionPackage ID: ${paq.id}`);
                                    let rollbackPackage = await rollbackTransactionPackage(paq.id);
                                    if(rollbackPackage.result) console.log(`Rollback de transactionPackage ${paq.id} realizado correctamente`);
                                    else console.log(`Ocurrio un error en rollback de transactionPackage ${paq.id}`);
                                    let packAjustado = await ajustarStockPack(paq.id, paq.cantidad, 'aumentar');
                                    if(packAjustado) console.info(`Stock de paquete con ID: ${paq.id} reajustado`);
                                    else console.info(`Ocurrio un error en reajuste de stock de paquete ${paq.id}`)
                                }

                                console.log('Comenzando rollbacks de transactionProducts');
                                for(let prod of productsIds){
                                    console.log(`Enviando rollback de transactionProduct ID: ${prod.id}`);
                                    let rollbackProduct = await rollbackTransactionProduct(prod.id);
                                    if(rollbackProduct.result) console.log(`Rollback de transactionProduct ${prod.id} realizado correctamente`);
                                    else console.log(`Ocurrio un error en rollback de transactionProduct ${prod.id}`);
                                    let prodAjustado = await ajustarStockProd(prod.id, prod.cantidad, 'aumentar');
                                    if(prodAjustado) console.info(`Stock de producto con ID: ${prod.id} reajustado`);
                                    else console.info(`Ocurrio un error en reajuste de stock de producto ${prod.id}`)
                                }

                                console.log('Comenzando rollbacks de pedidoTransaction');
                                for(let id of pedidoTransactionsIds){
                                    console.log(`Enviando rollback de pedidoTransaction ID: ${id}`);
                                    let rollbackPedTran = await rollbackPedidoTransaction(id);
                                    if(rollbackPedTran.result) console.log(`Rollback de pedidoTransaction ${id} realizado correctamente`);
                                    else console.log(`Ocurrio un error en rollback de pedidoTransaction ${id}`);
                                }

                                console.log('Comenzando rollbacks de transactions');
                                for(let id of transactionsIds){
                                    console.log(`Enviando rollback de transaction ID: ${id}`);
                                    let rollbackTran = await rollbackTransaction(id);
                                    if(rollbackTran.result) console.log(`Rollback de transaction ${id} realizado correctamente`);
                                    else console.log(`Ocurrio un error en rollback de transaction ${id}`);
                                }

                                if(pedido.voucher){
                                    let rollbackVoucherRes = await rollbackVoucherCompany(voucherCompanyId);
                                    if(rollbackVoucherRes.result) console.log(`Rollback de voucher ${pedido.voucher} realizado correctamente`);
                                    else console.log(`Ocurrio un error en rollback de voucher ${pedido.voucher}`);
                                    let voucherAjustado = await ajustarStockVoucher(pedido.voucher, 1, 'aumentar');
                                    if(voucherAjustado) console.info(`Stock de voucher con ID: ${pedido.voucher} reajustado`);
                                    else console.info(`Ocurrio un error en reajuste de stock de voucher ${pedido.voucher}`)
                                }

                                console.log('Comenzando rollbacks de pedido');
                                let rollbackPed = await rollbackPedido(pedidoRes.id);
                                if(rollbackPed.result) console.log(`Rollback de pedido ${pedidoRes.id} realizado correctamente`);
                                else console.log(`Ocurrio un error en rollback de pedido ${pedidoRes.id}`);

                                res.status(500).json({message: 'No se pudo completar el pedido'});
                            }
                        }
                    }//fin if pedido se inserto correctamente
                    else{
                        console.log(`Error en insert pedido, con error: ${pedidoRes.message}`)
                        res.status(500).json({message: `${pedidoRes.message}`});
                    }
                }//fin if amount === total
                else{
                    console.log('Total calculado no coincide con amount recibido en la request');
                    res.status(400).json({message: 'Total calculado no coincide con amount recibido en la request'});
                }
            }//fin else errorMessage.length > 0
        } //fin if contenido.length > 0
        else{
            //Si fallo, damos error
            console.log('Contenido es un array vacio');
            res.status(400).json({message: 'Contenido es un array vacio'});
        }
    }
}

//Funcion para armar el pedido
async function armarPedido(pedido, sellerId){
    console.info(`Comenzando armado de pedido ${pedido.id}`);

    //Obtenemos el usuario comprador
    let { user, message: userMessage } = await getUserById(pedido.userId);

    if(!user){
        //Si no se encontro, retornamos null
        console.info('No se pudo encontrar el usuario.');
        console.info(userMessage);
        return null;
    }
    else{
        pedido.userName = user.name;

        //Obtenemos la compania compradora
        let { company: buyerCompany, message: companyMessage } = await getCompanyById(user.companyId);

        if(!buyerCompany){
            //Si no se encontro, retornamos null
            console.info('No se pudo encontrar la compania compradora.');
            console.info(companyMessage);
            return null;
        }
        else{
            pedido.buyerName = buyerCompany.name;

            //Obtenemos las transacciones
            console.info('Obteniendo transacciones');
            let { transactions: transactionIds } = await getTransactionsByPedido(pedido.id);

            let flag = true;
            if(transactionIds){
                //Armamos las transacciones con sus datos
                let transactions = await Promise.all(transactionIds.map(async id => {
                    let { transaction: tran } = await getTransactionById(id);
                    if(tran){
                        //Si hay seller y coincide con el seller de la transaccion
                        if(sellerId && tran.sellerId === sellerId){
                            let transaction =  await armarTransaction(tran);

                            //Retornamos los datos
                            if(!transaction){
                                flag = false;
                                return null;
                            }
                            else{
                                return transaction;
                            }
                        }
                        //Si hay seller pero no coincide con el seller de la transaccion
                        else if(sellerId && tran.sellerId !== sellerId){
                            let transaction = tran;
                            return transaction;
                        }
                        //Si no hay seller 
                        else{
                            let transaction =  await armarTransaction(tran);

                            //Si fallo, damos error
                            if(!transaction){
                                flag = false;
                                return null;
                            }
                            //Retornamos los datos
                            else{
                                return transaction;
                            }
                        }
                    }
                    //Si fallo, damos error
                    else{
                        flag = false;
                        return null;
                    }

                }));
                if(pedido.voucher){
                    let { voucher, message: voucherMessage } = await getVoucherById(pedido.voucher);
                    if(!voucher){

                        flag = false;
                        console.info('No se pudo encontrar el voucher');
                        console.info(voucherMessage);
                    }
                    else{
                        let v = {
                            id: voucher.id,
                            voucher: voucher.voucher,
                            type: voucher.type,
                            value: voucher.value
                        }
                        pedido.voucher = v;
                    }
                }
                
                //Retornamos los datos
                if(flag){
                    pedido.transactions = transactions;
                    return pedido;
                }
                //Si fallo, damos error
                else{
                    console.info('Ocurrio un error armando las transacciones');
                    return null
                }
            }
            //Si fallo, damos error
            else{
                console.info(`Ocurrio un error buscando las transacciones para el pedido ${pedido.id}`);
                return null;
            }
        }
    }
}

//Funcion para armar la transaccion
async function armarTransaction(transaction){
    console.info(`Comenzando armado de transaccion ${transaction.id}`);

    //Obtenemos las companias compradora y vendedora
    let { company: buyerCompany, message: buyerMessage } = await getCompanyById(transaction.buyerId);
    
    if(!buyerCompany){
        //Si no se encontro, retornamos null
        console.info('No se pudo encontrar la compania compradora.');
        console.info(buyerMessage);
        return null;
    }
    else{
        transaction.buyerName = buyerCompany.name;

        let { company: sellerCompany, message: sellerMessage } = await getCompanyById(transaction.sellerId);

        if(!sellerCompany){
            //Si no se encontro, retornamos null
            console.info('No se pudo encontrar la compania vendedora.');
            console.info(sellerMessage);
            return null;
        }
        else{
            transaction.sellerName = sellerCompany.name;
            
            //Obtenemos los productos
            console.info('Obteniendo productos');
            let { productos } = await getTransactionProductsByTransaction(transaction.id);
            
            //Obtenemos los paquetes
            console.info('Obteniendo paquetes');
            let { paquetes } = await getTransactionPackagesByTransaction(transaction.id);
            
            //Si hay error retornamos
            if(!productos && !paquetes){
                console.info(`Ocurrio un error buscando los productos y paquetes de la transaccion ${transaction.id}`);
                return null;
            }
            else{
                //Obtenemos el delivery
                let { delivery } = await getDeliveryByTransaction(transaction.id);

                if(productos){
                    transaction.products = productos;
                }

                if(paquetes){
                    console.log('entro')
                    transaction.packages = paquetes;
                }

                //Si hay error retornamos
                if(!delivery){
                    console.info(`Ocurrio un error buscando el delivery de la transaccion ${transaction.id}`);
                    return null;
                }
                //Retornamos los datos
                else{
                    transaction.delivery = delivery;
                    return transaction;
                }
            }
        }
    }
}

//Auxiliar para obtener pedidos
async function getPedidos(){
    console.info(`Buscando todos los pedidos`);
    let message = '';
    //Conectamos con las queries
    let pedidos = await queries
                        .pedidos
                        .getAll()
                        .then(async data => {
                            //Si se consiguio la info
                            if(data){
                                let flag = true;
                                //Armamos los pedidos con todos sus datos
                                console.info('Informacion de pedidos obtenida');
                                let res = await Promise.all(data.map(async p => {
                                    let pedido = await armarPedido(p);
                                    if(pedido){
                                        return pedido;
                                    }
                                    else{
                                        //Si fallo, damos error
                                        flag = false;
                                        return null;
                                    }
                                }));
                                //Retornamos los datos
                                if(flag) return res;
                                //Si fallo, damos error
                                else return null;
                            }
                            else{
                                //Si no se consiguieron datos
                                console.info(`No existen pedidos registrados en la BD`);
                                message = `No existen pedidos registrados en la BD`;
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de Pedido : ${err}`);
                            message = 'Ocurrio un error al obtener los pedidos';
                            return null;
                        });
    return { pedidos, message };
}

//Auxiliar para obtener pedidos filtrando por ID
async function getPedidoById(id){
    console.info(`Buscando pedido con ID: ${id}`);
    let message = '';
    //Conectamos con las queries
    let pedido = await queries
                    .pedidos
                    .getOneById(id)
                    .then(async data => {
                        //Si se consiguio la info
                        if(data){
                            //Armamos los pedidos con todos sus datos
                            console.info(`Pedido con ID: ${id} encontrado`);
                            let res = await armarPedido(data);
                            if(res) return res;
                            else return null;
                        }
                        else{
                            //Si no se consiguieron datos
                            console.info(`No existe pedido con ID: ${id}`);
                            message = `No existe un pedido con ID ${id}`;
                            return null;
                        }
                    })
                    .catch(err => {
                        console.error(`Error en Query SELECT de Pedido : ${err}`);
                        message = 'Ocurrio un error al obtener el pedido';
                        return null;
                    });
    return { pedido, message };
}

//Auxiliar para obtener pedidos filtrando por usuario
async function getPedidosByUser(id){
    console.info(`Buscando todos los pedido del usuario ${id}`);
    let message = '';
    //Conectamos con las queries
    let pedidos = await queries
                        .pedidos
                        .getByUser(id)
                        .then(async data => {
                            //Si se consiguio la info
                            if(data){
                                let flag = true;
                                //Armamos los pedidos con todos sus datos
                                console.info('Informacion de pedidos obtenida');
                                let res = await Promise.all(data.map(async p => {
                                    let pedido = await armarPedido(p);
                                    if(pedido){
                                        return pedido;
                                    }
                                    else{
                                        //Si fallo, damos error
                                        flag = false;
                                        return null;
                                    }
                                }));
                                //Retornamos los datos
                                if(flag) return res;
                                //Si fallo, damos error
                                else return null;
                            }
                            else{
                                //Si no se consiguieron datos
                                console.info(`No existen pedidos registrados en la BD para el usuario ${id}`);
                                message = `No existen pedidos registrados en la BD para el usuario ${id}`;
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de Pedido : ${err}`);
                            message = 'Ocurrio un error al obtener los pedidos';
                            return null;
                        });
    return { pedidos, message };
}

//Auxiliar para obtener pedidos filtrando por  fechas
async function getPedidosByDate({ dateFrom, dateTo }){
    console.info(`Buscando todos los pedido entre ${dateFrom} y ${dateTo}`);
    let message = '';
    //Conectamos con las queries
    let pedidos = await queries
                        .pedidos
                        .getByDate(dateFrom, dateTo)
                        .then(async data => {
                            //Si se consiguio la info
                            if(data){
                                let flag = true;
                                //Armamos los pedidos con todos sus datos
                                console.info('Informacion de pedidos obtenida');
                                let res = await Promise.all(data.map(async p => {
                                    let pedido = await armarPedido(p);
                                    if(pedido){
                                        return pedido;
                                    }
                                    else{
                                        //Si fallo, damos error
                                        flag = false;
                                        return null;
                                    }
                                }));
                                //Retornamos los datos
                                if(flag) return res;
                                //Si fallo, damos error
                                else return null;
                            }
                            else{
                                //Si no se consiguieron datos
                                console.info(`No existen pedidos registrados en la BD para el usuario ${id}`);
                                message = `No existen pedidos registrados en la BD para el usuario ${id}`;
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de Pedido : ${err}`);
                            message = 'Ocurrio un error al obtener los pedidos';
                            return null;
                        });
    return { pedidos, message };
}

//Auxiliar para obtener pedidos filtrando por ID de usuario y fechas
async function getPedidosByDateByUser(id, dateFrom, dateTo){
    //ver tema fechas y user
    console.info(`Buscando todos los pedido del usuario ${id} entre ${dateFrom} y ${dateTo}`);
    let message = '';
    //Conectamos con las queries
    let pedidos = await queries
                        .pedidos
                        .getByDateByUser(id, dateFrom, dateTo)
                        .then(async data => {
                            //Si se consiguio la info
                            if(data){
                                let flag = true;
                                //Armamos los pedidos con todos sus datos
                                console.info('Informacion de pedidos obtenida');
                                let res = await Promise.all(data.map(async p => {
                                    let pedido = await armarPedido(p);
                                    if(pedido){
                                        return pedido;
                                    }
                                    else{
                                        //Si no se consiguieron datos
                                        flag = false;
                                        return null;
                                    }
                                }));
                                //Si se consiguio la info
                                if(flag) return res;
                                //Si no se consiguieron datos
                                else return null;
                            }
                            else{
                                //Si no se consiguieron datos
                                console.info(`No existen pedidos registrados en la BD para el usuario ${id}`);
                                message = `No existen pedidos registrados en la BD para el usuario ${id}`;
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de Pedido : ${err}`);
                            message = 'Ocurrio un error al obtener los pedidos';
                            return null;
                        });
    return { pedidos, message };
}

//Auxiliar para obtener transacciones filtrando por ID de pedido
async function getTransactionsByPedido(id){
    console.info(`Buscando todas las transacciones del pedido ${id}`);
    let message = '';
    //Conectamos con las queries
    let transactions = await queries
                        .transactions
                        .getByPedido(id)
                        .then(data => {
                            //Si se consiguio la info
                            if(data){
                                console.info('Informacion de transacciones obtenida');
                                let res = data.map(t => t.transactionId);
                                return res;
                            }
                            else{
                                //Si no se consiguieron datos
                                console.info(`No existen transacciones registrados en la BD para el pedido ${id}`);
                                message = `No existen transacciones registrados en la BD para el pedido ${id}`;
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de Pedido : ${err}`);
                            message = 'Ocurrio un error al obtener las transacciones';
                            return null;
                        });
    return { transactions, message };
}

//Auxiliar para obtener transaccion filtrando por ID
async function getTransactionById(id){
    console.info(`Buscando transaccion con ID: ${id}`);
    let message = '';
    //Conectamos con las queries
    let transaction = await queries
                    .transactions
                    .getOneById(id)
                    .then(data => {
                        //Si se consiguio la info
                        if(data){
                            console.info(`Transaccion con ID: ${id} encontrada`);
                            return data;
                        }
                        else{
                            //Si no se consiguieron datos
                            console.info(`No existe transaccion con ID: ${id}`);
                            message = `No existe un transaccion con ID ${id}`;
                            return null;
                        }
                    })
                    .catch(err => {
                        console.error(`Error en Query SELECT de Transaction : ${err}`);
                        message = 'Ocurrio un error al obtener la transaccion';
                        return null;
                    });
    return { transaction, message };
}

//Auxiliar para obtener transacciones filtrando por fechas
async function getTransactionsByDate(dateFrom, dateTo){
    console.info(`Buscando todas las transacciones entre ${dateFrom} y ${dateTo}`);
    let message = '';
    //Conectamos con las queries
    let transactions = await queries
                        .transactions
                        .getByDate(dateFrom, dateTo)
                        .then(async data => {
                            //Si se consiguio la info
                            if(data){
                                console.info('Informacion de transacciones obtenida');
                                let res = data.map(t => t.transactionId);
                                return res;
                            }
                            else{
                                //Si no se consiguieron datos
                                console.info(`No existen transacciones registrados en la BD entre ${dateFrom} y ${dateTo}`);
                                message = `No existen transacciones registrados en la BD entre ${dateFrom} y ${dateTo}`;
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de Pedido : ${err}`);
                            message = 'Ocurrio un error al obtener los pedidos';
                            return null;
                        });
    return { transactions, message };
}

//Auxiliar para obtener transacciones filtrando por compania
async function getTransactionsByCompany(id){
    console.info(`Buscando todas las transacciones de la compania ${id}`);
    let message = '';
    //Conectamos con las queries
    let transactions = await queries
                        .transactions
                        .getBySeller(id)
                        .then(async data => {
                            if(data){
                                let flag = true;
                                //Obtenemos los datos
                                console.info('Informacion de transacciones obtenida');
                                let res = await Promise.all(data.map(async t => {
                                    let transaccion = await armarTransaction(t);
                                    if(transaccion){
                                        return transaccion;
                                    }
                                    else{
                                        //Si no se consiguieron datos
                                        flag = false;
                                        return null;
                                    }
                                }));
                                //Si se consiguio la info
                                if(flag) return res;
                                //Si no se consiguieron datos
                                else return null;
                            }
                            else{
                                //Si no se consiguieron datos
                                console.info(`No existen transacciones registradas en la BD para la comapnia ${id}`);
                                message = `No existen transacciones registradas en la BD para la comapnia ${id}`;
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de Pedido : ${err}`);
                            message = 'Ocurrio un error al obtener los transacciones';
                            return null;
                        });
    return { transactions, message };
}

//Auxiliar para obtener transacciones filtrando por compania y fechas
async function getTransactionsByDateByCompany(id, company, dateFrom, dateTo){
    console.info(`Buscando todas las transacciones entre ${dateFrom} y ${dateTo} para el seller ${company}`);
    let message = '';
    //Conectamos con las queries
    let transactions = await queries
                        .transactions
                        .getByDate(id, dateFrom, dateTo)
                        .then(async data => {
                            if(data){
                                //Si se consiguio la info
                                console.info('Informacion de transacciones obtenida');
                                let res = data.map(t => t.transactionId);
                                return res;
                            }
                            else{
                                //Si no se consiguieron datos
                                console.info(`No existen transacciones registrados en la BD entre ${dateFrom} y ${dateTo} para el seller ${company}`);
                                message = `No existen transacciones registrados en la BD entre ${dateFrom} y ${dateTo} para el seller ${company}`;
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de Pedido : ${err}`);
                            message = 'Ocurrio un error al obtener los pedidos';
                            return null;
                        });
    return { transactions, message };
}

//Auxiliar para obtener transaccion de producto filtrando por ID de transaccion
async function getTransactionProductsByTransaction(id){
    console.log(`Buscando productos para transaccion ${id}`);
    let message = '';
    //Conectamos con las queries
    let productos = await queries
                        .transactionProducts
                        .getByTransaction(id)
                        .then(async data => {
                            //Si se consiguio la info
                            if(data){
                                console.info(`Se encontraron ${data.length} productos para la transaccion ${id}`);
                                let flag = true;
                                //Obtenemos los datos
                                let res = await Promise.all(data.map(async prod => {
                                    let { producto } = await getCompanyProductById(prod.productId);
                                    if(producto){
                                        let { price } = await getPriceByIdProduct(prod.priceId);

                                        if(price){
                                            producto.priceId = prod.priceId;
                                            producto.price = price.price;
                                            producto.quantity = prod.quantity;
                                            return producto;
                                        }
                                        else{
                                            //Si no se consiguieron datos
                                            flag = false;
                                            return null;
                                        }
                                    }
                                    else{
                                        //Si no se consiguieron datos
                                        console.info(`Ocurrio un error al obtener el producto con ID: ${prod.productId}`);
                                        flag = false;
                                        return null;
                                    }
                                }));
                                //Si se consiguio la info
                                if(flag) return res;
                                //Si no se consiguieron datos
                                else return null;
                            }
                            else{
                                console.info(`No existen productos registrados en la BD para la transaccion ${id}`);
                                message = `No existen productos registrados en la BD para la transaccion ${id}`;
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de TransactionProduct : ${err}`);
                            message = 'Ocurrio un error al obtener los productos';
                            return null;
                        });
    return { productos, message };
}

//Auxiliar para obtener transaccion de paquete filtrando por ID de transaccion
async function getTransactionPackagesByTransaction(id){
    console.log(`Buscando paquetes para transaccion ${id}`);
    let message = '';
    //Conectamos con las queries
    let paquetes = await queries
                        .transactionPackages
                        .getByTransaction(id)
                        .then(async data => {
                            //Si se consiguio la info
                            if(data){
                                console.info(`Se encontraron ${data.length} paquetes para la transaccion ${id}`);
                                let flag = true;
                                //Obtenemos los datos
                                let res = await Promise.all(data.map(async pack => {
                                    let { paquete } = await getPackageById(pack.packageId);
                                    if(paquete){
                                        let { price } = await getPriceByIdPackage(pack.priceId);

                                        if(price){
                                            paquete.priceId = pack.priceId;
                                            paquete.quantity = pack.quantity;
                                            return paquete;
                                        }
                                        else{
                                            //Si fallo, damos error
                                            flag = false;
                                            return null;
                                        }
                                    }
                                    else{
                                        //Si fallo, damos error
                                        console.info(`Ocurrio un error al obtener el paquete con ID: ${pack.packageId}`);
                                        flag = false;
                                        return null;
                                    }
                                }));
                                //Retornamos los datos
                                if(flag) return res;
                                //Si fallo, damos error
                                else return null;
                            }
                            else{
                                //Si fallo, damos error
                                console.info(`No existen paquetes registrados en la BD para la transaccion ${id}`);
                                message = `No existen paquetes registrados en la BD para la transaccion ${id}`;
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de TransactionProduct : ${err}`);
                            message = 'Ocurrio un error al obtener los paquetes';
                            return null;
                        });
    return { paquetes, message };
}

//Auxiliar para obtener delivery filtrando por ID de transaccion
async function getDeliveryByTransaction(id){
console.info(`Buscando el delivery de la transaccion ${id}`);
    let message = '';
    //Conectamos con las queries
    let delivery = await queries
                        .deliveries
                        .getByTransaction(id)
                        .then(data => {
                            //Si se consiguio la info
                            if(data){
                                console.info('Informacion de delivery obtenida');
                                return data;
                            }
                            else{
                                //Si no se consiguieron datos
                                console.info(`No existe delivery registrados en la BD para el pedido ${id}`);
                                message = `No existe delivery registrados en la BD para el pedido ${id}`;
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de Delivery : ${err}`);
                            message = 'Ocurrio un error al obtener el delivery';
                            return null;
                        });
    return { delivery, message };
}

//Auxiliar para obtener los pedidos filtrando por usuario,fechas y seller
async function getPedidosByDateByUserBySeller(id, dateFrom, dateTo, sellerId){
    //ver tema fechas y user
    console.info(`Buscando todos los pedido del usuario ${id} entre ${dateFrom} y ${dateTo}`);
    let message = '';
    //Conectamos con las queries
    let pedidos = await queries
                        .pedidos
                        .getByDateByUser(id, dateFrom, dateTo)
                        .then(async data => {
                            //Si se consiguio la info
                            if(data){
                                let flag = true;
                                //Armamos los pedidos con todos sus datos
                                console.info('Informacion de pedidos obtenida');
                                let res = await Promise.all(data.map(async p => {
                                    let pedido = await armarPedido(p, sellerId);
                                    if(pedido){
                                        return pedido;
                                    }
                                    else{
                                        flag = false;
                                        return null;
                                    }
                                }));
                                if(flag) return res;
                                else return null;
                            }
                            else{
                                //Si no se consiguieron datos
                                console.info(`No existen pedidos registrados en la BD para el usuario ${id}`);
                                message = `No existen pedidos registrados en la BD para el usuario ${id}`;
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de Pedido : ${err}`);
                            message = 'Ocurrio un error al obtener los pedidos';
                            return null;
                        });
    return { pedidos, message };
}

//Auxiliar para obtener un pedido estimado filtrando por usuario,fechas y seller
async function getPedidosByDateByUserBySellerEstimados(id, dateFrom, dateTo, sellerId){
    //ver tema fechas y user
    console.info(`Buscando todos los pedido del usuario ${id} entre ${dateFrom} y ${dateTo}`);
    let message = '';
    //Conectamos con las queries
    let pedidos =   await queries
                        .consultas
                        .getRecomendacionPedidoEstimadoByCompany(dateFrom, dateTo, id,sellerId)
                        .then(async data => {
                            //Si se consiguio la info
                            if(data.rows){
                                console.info('Informacion de productos obtenida');
                                return data.rows;
                            }
                            else{
                                //Si no se consiguieron datos
                                console.info(`No existe productos registrados en la BD para la compania ${id}`);
                                message = `No existe productos registrados en la BD para la compania ${id}`;
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de Pedido : ${err}`);
                            message = 'Ocurrio un error al obtener los pedidos';
                            return null;
                        });
                        console.log(pedidos);
    return { pedidos, message };
}

//Auxiliar para obtener cinco productos mas vendidos filtrando por compania
async function getCincoProductosMasVendidos(id, fecha){
    console.info(`Buscando cinco productos mas vendidos para la compania con id ${id}`);
        let message = '';
        //Conectamos con las queries
        let productos = await queries
                            .consultas
                            .getTopCincoProductosMasVendidosByCompany(id, fecha)
                            .then(data => {
                                //Si se consiguio la info
                                if(data.rows){
                                    console.info('Informacion de productos obtenida');
                                    return data.rows;
                                }
                                else{
                                    //Si no se consiguieron datos
                                    console.info(`No existen productos vendidos para la compania ${id} en este rango de tiempo`);
                                    message = `No existen productos vendidos para la compania ${id} en este rango de tiempo`;
                                    return null;
                                }
                            })
                            .catch(err => {
                                console.error(`Error en Query SELECT de Consultas : ${err}`);
                                message = 'Ocurrio un error al obtener los productos';
                                return null;
                            });
        return { productos, message };
}

//Auxiliar para obtener cinco productos menos vendidos filtrando por compania
async function getCincoProductosMenosVendidos(id, fecha){
    console.info(`Buscando cinco productos menos vendidos para la compania con id ${id}`);
        let message = '';
        //Conectamos con las queries
        let productos = await queries
                            .consultas
                            .getTopCincoProductosMenosVendidosByCompany(id,fecha)
                            .then(data => {
                                //Si se consiguio la info
                                if(data.rows){
                                    console.info('Informacion de productos obtenida');
                                    return data.rows;
                                }
                                else{
                                    //Si no se consiguieron datos
                                    console.info(`No existen productos vendidos para la compania ${id} en este rango de tiempo`);
                                    message = `No existen productos vendidos para la compania ${id} en este rango de tiempo`;
                                    return null;
                                }
                            })
                            .catch(err => {
                                console.error(`Error en Query SELECT de Consultas : ${err}`);
                                message = 'Ocurrio un error al obtener los productos';
                                return null;
                            });
        return { productos, message };
}

//Auxiliar para obtener cinco paquetes mas vendidos filtrando por compania
async function getCincoPaquetesMasVendidos(id, fecha){
    console.info(`Buscando cinco paquetes mas vendidos para la compania con id ${id}`);
        let message = '';
        //Conectamos con las queries
        let paquetes = await queries
                            .consultas
                            .getTopCincoPaquetesMasVendidosByCompany(id, fecha)
                            .then(data => {
                                //Si se consiguio la info
                                if(data.rows){
                                    console.info('Informacion de paquetes obtenida');
                                    return data.rows;
                                }
                                else{
                                    //Si no se consiguieron datos
                                    console.info(`No existen paquetes vendidos para la compania ${id} en este rango de tiempo`);
                                    message = `No existen paquetes vendidos para la compania ${id} en este rango de tiempo`;
                                    return null;
                                }
                            })
                            .catch(err => {
                                console.error(`Error en Query SELECT de Consultas : ${err}`);
                                message = 'Ocurrio un error al obtener los paquetes';
                                return null;
                            });
        return { paquetes, message };
}

//Auxiliar para obtener cinco paquetes menos vendidos filtrando por compania
async function getCincoPaquetesMenosVendidos(id, fecha){
    console.info(`Buscando cinco paquetes menos vendidos para la compania con id ${id}`);
        let message = '';
        //Conectamos con las queries
        let paquetes = await queries
                            .consultas
                            .getTopCincoPaquetesMenosVendidosByCompany(id,fecha)
                            .then(data => {
                                //Si se consiguio la info
                                if(data.rows){
                                    console.info('Informacion de paquetes obtenida');
                                    return data.rows;
                                }
                                else{
                                    //Si no se consiguieron datos
                                    console.info(`No existen paquetes vendidos para la compania ${id} en este rango de tiempo`);
                                    message = `No existen paquetes vendidos para la compania ${id} en este rango de tiempo`;
                                    return null;
                                }
                            })
                            .catch(err => {
                                console.error(`Error en Query SELECT de Consultas : ${err}`);
                                message = 'Ocurrio un error al obtener los paquetes';
                                return null;
                            });
        return { paquetes, message };
}

//Auxiliar para insertar pedido
async function insertPedido(pedido){
    console.info('Comenzando insert de Pedido');
    let message = '';
    //Conectamos con las queries
    let id = await queries
            .pedidos
            .insert(pedido)
            .then(res => {
                if(res){
                    //Si se inserto correctamente
                    console.log(`Insert de Pedido exitoso con ID: ${res[0]}`);
                    return res[0];
                }
                else{
                    //Si fallo
                    console.info('Ocurrio un error');
                    message = 'Ocurrio un error al intertar dar de alta';
                    return 0;
                }
            })
            .catch(err => {
                console.log('Error en Query INSERT de Pedido: ', err);
                message = 'Ocurrio un error al intertar dar de alta';
                return 0;
            });

    return { id, message};
}

//Auxiliar para insertar una transaccion de un pedido existente
async function insertTransaction(transaction){
    console.info('Comenzando insert de Transaction');
    let message = '';
    //Conectamos con las queries
    let id = await queries
            .transactions
            .insert(transaction)
            .then(res => {
                if(res){
                    //Si se inserto correctamente
                    console.log(`Insert de Transaction exitoso con ID: ${res[0]}`);
                    return res[0];
                }
                else{
                    //Si fallo
                    console.info('Ocurrio un error');
                    message = 'Ocurrio un error al intertar dar de alta';
                    return 0;
                }
            })
            .catch(err => {
                console.log('Error en Query INSERT de Transaction: ', err);
                message = 'Ocurrio un error al intertar dar de alta';
                return 0;
            });
            
    return { id, message};
}

//Auxiliar para insertar una transaccion de un producto de una transaccion existente
async function insertTransactionProduct(tranProd){
    console.info('Comenzando insert de TransactionProduct');
    let message = '';
    //Conectamos con las queries
    let id = await queries
            .transactionProducts
            .insert(tranProd)
            .then(res => {
                if(res){
                    //Si se inserto correctamente
                    console.log(`Insert de TransactionProduct exitoso con ID: ${res[0]}`);
                    return res[0];
                }
                else{
                    //Si fallo
                    console.info('Ocurrio un error');
                    message = 'Ocurrio un error al intertar dar de alta';
                    return 0;
                }
            })
            .catch(err => {
                console.log('Error en Query INSERT de TransactionProduct: ', err);
                message = 'Ocurrio un error al intertar dar de alta';
                return 0;
            });
            
    return { id, message};
}

//Auxiliar para insertar una transaccion de un paquete de una transaccion existente
async function insertTransactionPackage(tranPack){
    console.info('Comenzando insert de TransactionPackage');
    let message = '';
    //Conectamos con las queries
    let id = await queries
            .transactionPackages
            .insert(tranPack)
            .then(res => {
                if(res){
                    //Si se inserto correctamente
                    console.log(`Insert de TransactionPackage exitoso con ID: ${res[0]}`);
                    return res[0];
                }
                else{
                    //Si fallo
                    console.info('Ocurrio un error');
                    message = 'Ocurrio un error al intertar dar de alta';
                    return 0;
                }
            })
            .catch(err => {
                console.log('Error en Query INSERT de TransactionPackage: ', err);
                message = 'Ocurrio un error al intertar dar de alta';
                return 0;
            });
            
    return { id, message};
}

//Auxiliar para insertar una transaccion en un pedido existente
async function insertPedidoTransaction(pedidoTransaction){
    console.info('Comenzando insert de PedidoTransaction');
    let message = '';
    //Conectamos con las queries
    let id = await queries
            .pedidoTransaction
            .insert(pedidoTransaction)
            .then(res => {
                if(res){
                    //Si se inserto correctamente
                    console.log(`Insert de PedidoTransaction exitoso con ID: ${res[0]}`);
                    return res[0];
                }
                else{
                    //Si fallo
                    console.info('Ocurrio un error');
                    message = 'Ocurrio un error al intertar dar de alta';
                    return 0;
                }
            })
            .catch(err => {
                console.log('Error en Query INSERT de PedidoTransaction: ', err);
                message = 'Ocurrio un error al intertar dar de alta';
                return 0;
            });

    return { id, message};
}

//Auxiliar para insertar un delivery en un pedido existente
async function insertDelivery(delivery){
    console.info('Comenzando insert de Delivery');
    let message = '';
    //Conectamos con las queries
    let id = await queries
            .deliveries
            .insert(delivery)
            .then(res => {
                if(res){
                    //Si se inserto correctamente
                    console.log(`Insert de Delivery exitoso con ID: ${res[0]}`);
                    return res[0];
                }
                else{
                    //Si fallo
                    console.info('Ocurrio un error');
                    message = 'Ocurrio un error al intertar dar de alta';
                    return 0;
                }
            })
            .catch(err => {
                console.log('Error en Query INSERT de Delivery: ', err);
                message = 'Ocurrio un error al intertar dar de alta';
                return 0;
            });

    return { id, message};
}

//Rollback de insercion de un pedido
async function rollbackPedido(id){
    let message = '';
    //Conectamos con las queries
    let result = await queries
                    .pedidos
                    .delete(id)
                    .then(res => {
                        return res;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de Pedido: ', err);
                        message += `Error en Query DELETE de Pedido: ${err}`;
                    });
    return { result, message };
}

//Rollback de insercion de una transaccion de un pedido
async function rollbackTransaction(id){
    let message = '';
    //Conectamos con las queries
    let result = await queries
                    .transactions
                    .delete(id)
                    .then(res => {
                        return res;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de Transaction: ', err);
                        message += `Error en Query DELETE de Transaction: ${err}`;
                    });
    return { result, message };
}

//Rollback de insercion de una transaccion de un producto de una transaccion
async function rollbackTransactionProduct(id){
    let message = '';
    //Conectamos con las queries
    let result = await queries
                    .transactionProducts
                    .delete(id)
                    .then(res => {
                        return res;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de TransactionProduct: ', err);
                        message += `Error en Query DELETE de TransactionProduct: ${err}`;
                    });
    return { result, message };
}

//Rollback de insercion de una transaccion de un paquete de una transaccion
async function rollbackTransactionPackage(id){
    let message = '';
    //Conectamos con las queries
    let result = await queries
                    .transactionPackages
                    .delete(id)
                    .then(res => {
                        return res;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de TransactionPackage: ', err);
                        message += `Error en Query DELETE de TransactionPackage: ${err}`;
                    });
    return { result, message };
}

//Rollback de insercion de una transaccion de un pedido
async function rollbackPedidoTransaction(id){
    let message = '';
    //Conectamos con las queries
    let result = await queries
                    .pedidoTransaction
                    .delete(id)
                    .then(res => {
                        return res;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de PedidoTransaction: ', err);
                        message += `Error en Query DELETE de PedidoTransaction: ${err}`;
                    });
    return { result, message };
}

//Rollback de insercion de delivery de un pedido
async function rollbackDelivery(id){
    let message = '';
    //Conectamos con las queries
    let result = await queries
                    .deliveries
                    .delete(id)
                    .then(res => {
                        return res;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de Delivery: ', err);
                        message += `Error en Query DELETE de Delivery: ${err}`;
                    });
    return { result, message };
}

//Funcion para validar pedido
function validarPedido(body){
    console.info('Comenzando validacion Joi de Pedido');
    //Creamos schema Joi
    const schema = Joi.object().keys({
        userId: Joi.number().required(),
        buyerId: Joi.number().required(),
        amount: Joi.number().required(),
        voucher: Joi.string().allow('').allow(null),
        deliveryType: Joi.string().required(),
        contenido: Joi.array().required()
    });
    console.info('Finalizando validacion Joi de Pedido');
    //Validamos
    return Joi.validate(body, schema);
}

//Funcion para validar fechas
function validarFechas(fechas){
    console.info('Comenzando validacion Joi de Fechas');
    //Creamos schema Joi
    const schema = Joi.object().keys({
        dateFrom: Joi.date().required(),
        dateTo: Joi.date().required()
    });
    console.info('Finalizando validacion Joi de Fechas');
    //Validamos
    return Joi.validate(fechas, schema);
}

//Funcion para validar fecha
function validarFecha(fecha){
    console.info('Comenzando validacion Joi de Fecha');
    //Creamos schema Joi
    const schema = Joi.date().required()
    console.info('Finalizando validacion Joi de Fecha');
    //Validamos
    return Joi.validate(fecha, schema);
}

//Funcion para validar calculo
function validarCalculo(validar){
    console.info('Comenzando validacion Joi de calculo');
    //Creamos schema Joi
    const schema = Joi.object().keys({
        contenido: Joi.array().required(),
        voucher: Joi.string().allow('').allow(null)
    });
    console.info('Finalizando validacion Joi de calculo');
    //Validamos
    return Joi.validate(validar, schema);
}

//Funcion para analizar contenido de un pedido
async function analizarContenido(contenido, codigoVoucher, userCompanyId){
    //Inicializamos variables finales de retorno
    let sumaProds = 0, sumaPacks = 0, errorMessage = [];
    let voucher = null;
    //Obtenemos voucher por codigo
    if(codigoVoucher !== null) voucherRes = await getVoucherByCode(codigoVoucher);
    //Obtenemos fecha actual para validacion de vocher (vencimiento)
    let fecha = new Date();
    //Bandera para determinar si se aplica el voucher
    let valido = false;
    //Validamos voucher
    if(voucherRes.voucher) {
        valido = await validacionVoucher(voucherRes.voucher.id, fecha, userCompanyId);
    }

    let armado = await Promise.all(contenido.map(async seller => {
        //Recorremos contenido
        let sumaProdsSeller = 0, sumaPacksSeller = 0;
        //Valido que el seller exista
        let { company: sellerCompany, message: sellerMessage } = await getCompanyById(seller.sellerId);
        if(!sellerCompany) errorMessage.push(sellerMessage);
        else{
            //Recorro productos de seller
            if(seller.productos && seller.productos.length > 0){
                for(let prod of seller.productos){
                    //Verifico existencia de producto
                    let { producto: product, message: productMessage } = await getCompanyProductById(prod.id);
                    if(!product) errorMessage.push(productMessage);
                    else if(product.companyId !== seller.sellerId){
                        errorMessage.push(`Producto con ID: ${prod.id} no corresponde a empresa con ID: ${seller.sellerId}`);
                    }
                    else{
                        console.info(`Buscando precios para comparar, producto: ${product.id}`);
                        //Obtengo precios de producto
                        let { prices: lastPrices, message: currentMessage } = await getLastPricesProducts(product.id);
                        let { price: cartPrice, message: cartMessage} = await getPriceByIdProduct(prod.priceId);

                        //Auxiliares para calculos de precios
                        let currentPrice = lastPrices[0];
                        let lastPrice = lastPrices[1];
                        prod.timestamp = new Date(prod.timestamp);

                        //Realizo comparacion de precios y realizo calculos de suma de costos
                        if(lastPrices && cartPrice){
                            console.info('Precios encontrados');
                            if(currentPrice.id === cartPrice.id){
                                if(currentPrice.price === prod.price && prod.timestamp > currentPrice.validDateFrom){
                                    console.info('Precios y fechas coinciden, el precio es correcto');
                                    sumaProds += currentPrice.price * prod.quantity;
                                    sumaProdsSeller += currentPrice.price * prod.quantity;
                                    prod.priceId = currentPrice.id;
                                }
                                else{
                                    //retornar error, el carrito fue modificado
                                    console.info('Precios en el carrito no coinciden con la base de datos');
                                    errorMessage.push('Precios en el carrito no coinciden con la base de datos');
                                }
                            }
                            else{
                                console.info(`IDs de precios no coinciden: ${cartPrice.id}`);
                                console.info('Uso precio anterior');

                                if(lastPrice){
                                    if(cartPrice.id === lastPrice.id){
                                        console.info(`IDs de precios coinciden: ${cartPrice.id}`);
                                        if(cartPrice.price === lastPrice.price && prod.timestamp > lastPrice.validDateFrom){
                                            console.info('Precios y fechas coinciden, el precio es correcto');
                                            sumaProds += lastPrice.price * prod.quantity;
                                            sumaProdsSeller += lastPrice.price * prod.quantity;
                                            prod.priceId = lastPrice.id;
                                        }else{
                                            //retornar error, el carrito fue modificado
                                            console.info('Precios en el carrito no coinciden con la base de datos');
                                            errorMessage.push('Precios en el carrito no coinciden con la base de datos');
                                        }
                                    }
                                    else{
                                        //retornar error, el carrito fue modificado
                                        console.info('Precios en el carrito no coinciden con la base de datos');
                                        errorMessage.push('Precios en el carrito no coinciden con la base de datos');
                                    }
                                }
                                else{
                                    console.info('Precio anterior no encontrado');
                                    errorMessage.push('Precios en el carrito no coinciden con la base de datos');
                                }
                            }
                        }
                        else{
                            console.info('No se encontraron los precios');
                            console.info('CurrentPrice: ', currentMessage);
                            console.info('CartPrice: ', cartMessage);
                            errorMessage.push('Precios en el carrito no coinciden con la base de datos');
                        }
                    }
                }
            }
            //Recorro paquetes de seller
            if(seller.paquetes && seller.paquetes.length > 0){
                for(let pack of seller.paquetes){
                    //Verifico existencia de paquete
                    let { paquete: package, message: packageMessage } = await getPackageById(pack.id);
                    if(!package) errorMessage.push(packageMessage);
                    else if(package.companyId !== seller.sellerId){
                        errorMessage.push(`Paquete con ID: ${pack.id} no corresponde a empresa con ID: ${seller.sellerId}`);
                    }
                    else{
                        console.info(`Buscando precios para comparar, paquete: ${package.id}`);
                        //Obtengo precios
                        let { prices: lastPrices, message: currentMessage } = await getLastPricesPackages(package.id);
                        let { price: cartPrice, message: cartMessage} = await getPriceByIdPackage(pack.priceId);

                        //Auxiliares para calculos de precios
                        let currentPrice = lastPrices[0];
                        let lastPrice = lastPrices[1];
                        pack.timestamp = new Date(pack.timestamp);

                        //Realizo comparacion de precios y realizo calculos de suma de costos
                        if(currentPrice && cartPrice){
                            console.info('Precios encontrados');
                            if(currentPrice.id === cartPrice.id){
                                if(currentPrice.price === pack.price && pack.timestamp > currentPrice.validDateFrom){
                                    console.info('Precios y fechas coinciden, el precio es correcto');
                                    sumaPacks += currentPrice.price * pack.quantity;
                                    sumaPacksSeller += currentPrice.price * pack.quantity;
                                    pack.priceId = currentPrice.id;
                                }
                                else{
                                    //retornar error, el carrito fue modificado
                                    console.info('Precios en el carrito no coinciden con la base de datos');
                                    errorMessage.push('Precios en el carrito no coinciden con la base de datos');
                                }
                            }
                            else{
                                console.info(`IDs de precios no coinciden: ${cartPrice.id}`);
                                console.info('Uso precio anterior');

                                if(lastPrice){
                                    if(cartPrice.id === lastPrice.id){
                                        console.info(`IDs de precios coinciden: ${cartPrice.id}`);
                                        if(cartPrice.price === lastPrice.price && prod.timestamp > lastPrice.validDateFrom){
                                            console.info('Precios y fechas coinciden, el precio es correcto');
                                            sumaPacks += lastPrice.price * pack.quantity;
                                            sumaPacksSeller += lastPrice.price * pack.quantity;
                                            pack.priceId = lastPrice.id;
                                        }else{
                                            //retornar error, el carrito fue modificado
                                            console.info('Precios en el carrito no coinciden con la base de datos');
                                            errorMessage.push('Precios en el carrito no coinciden con la base de datos');
                                        }
                                    }
                                    else{
                                        //retornar error, el carrito fue modificado
                                        console.info('Precios en el carrito no coinciden con la base de datos');
                                        errorMessage.push('Precios en el carrito no coinciden con la base de datos');
                                    }
                                }
                                else{
                                    console.info('Precio anterior no encontrado');
                                    errorMessage.push('Precios en el carrito no coinciden con la base de datos');
                                }
                            }
                        }
                        else{
                            console.info('No se encontraron los precios');
                            console.info('CurrentPrice: ', currentMessage);
                            console.info('CartPrice: ', cartMessage);
                            errorMessage.push('Precios en el carrito no coinciden con la base de datos');
                        }
                    }
                }
            }
            //Sumo totales
            seller.amount = sumaProdsSeller + sumaPacksSeller;
            return seller;
        }
    }));
    //Retorno datos, difiriendo si el vocher existe y es valido o no
    if(valido) return { armado, sumaProds, sumaPacks, errorMessage, voucher: valido };
    else return { armado, sumaProds, sumaPacks, errorMessage };
}

//Exportamos endpoints
module.exports = {
    obtenerPedidos,
    obtenerPedidoById,
    obtenerPedidosByUser,
    obtenerPedidosByDate,
    obtenerPedidosByDateByUser,
    obtenerTransactionsByCompany,
    obtenerPedidosByDateByUserBySeller,
    obtenerPedidosByDateByUserBySellerEstimados,
    obtenerCincoProductosMasVendidos,
    obtenerCincoProductosMenosVendidos,
    calcularTotal,
    realizarPedido,
}