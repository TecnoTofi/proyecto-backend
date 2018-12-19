const Joi = require('joi');
const queries = require('./dbQueries');
const { validarId } = require('../helpers/routes');
const { getUserById } = require('../users/routes');
const { getCompanyById } = require('../companies/routes');
const {
    reducirStock: reducirStockProd, 
    getProduct,
    getLastPrices: getLastPricesProducts,
    getPriceById: getPriceByIdProduct
} = require('../products/routes');
const {
    reducirStock: reducirStockPack, 
    getPackage,
    getLastPrices: getLastPricesPackages,
    getPriceById: getPriceByIdPackage
} = require('../packages/routes');

async function obtenerPedidos(req, res){
    console.info('Conexion GET entrante : /api/pedido');

    let { pedidos, message } = await getPedidos();

    if(pedidos){
        console.info(`${pedidos.length} pedidos encontrados`);
        console.info('Preparando response');
        res.status(200).json(pedidos);
    }
    else{
        console.info('No se encontraron pedidos');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

async function obtenerPedidoById(req, res){
    console.log(`Conexion GET entrante : /api/pedido/${req.params.id}`);

    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info('Validacion de tipos exitosa');
        console.info(`Yendo a buscar pedido con ID: ${req.params.id}`);
        let { pedido, message } = await getPedidoById(req.params.id);

        if(pedido){
            console.info('Pedido encontrado');
            console.info('Preparando response');
            res.status(200).json(pedido);
        }
        else{
            console.info('No se encontro pedido');
            console.info('Preparando response');
            res.status(400).json({message});
        }
    }
}

async function obtenerPedidosByUser(req, res){
    console.info(`Conexion GET entrante : /api/pedido/user/${req.params.id}`);
    
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info(`Comprobando existencia de usuario ${req.params.id}`);
        let { user, message: userMessage } = await getUserById(req.params.id);

        if(!user){
            console.info(`No existe ususario con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message: userMessage});
        }
        else{
            if(user.email === req.body.userEmail){
                console.info(`Obteniendo pedidos de usuario ${user.name}`);
                let { pedidos, message } = await getPedidosByUser(req.params.id);
    
                if(pedidos){
                    console.info(`${pedidos.length} pedidos encontrados`);
                    console.info('Preparando response');
                    res.status(200).json(pedidos);
                }
                else{
                    console.info('No se encontraron pedidos');
                    console.info('Preparando response');
                    res.status(200).json({message});
                }
            }
            else{
                console.info('Token no corresponde con usuario enviado por parametros');
                console.info('Preparando response');
                res.status(200).json({message: 'Token no corresponde con usuario solicitado'});
            }
        }
    } 
}

async function obtenerPedidosByDate(req, res){
    console.info('Conexion GET entrante : /api/pedido/date');
    
    console.info('Comenzando validacion de tipos');
    let fechas = {
        dateFrom: new Date(req.body.dateFrom).toUTCString(),
        dateTo: new Date(req.body.dateTo).toUTCString()
    };

    let { error } = validarFechas(fechas);

    if(error){
        console.info('Erorres encontrados en la request');
        let errores = error.details.map(e => {
            console.info(e.message);
            return e.message;
        });
        console.info('Preparando response');
        res.status(400).json({message: errores});
    }
    else{
        let { pedidos, message } = await getPedidosByDate(fechas);

        if(pedidos){
            console.info(`${pedidos.length} pedidos encontrados`);
            console.info('Preparando response');
            res.status(200).json(pedidos);
        }
        else{
            console.info('No se encontraron pedidos');
            console.info('Preparando response');
            res.status(200).json({message});
        }
    }
}

async function obtenerPedidosByDateByUser(req, res){
    
}

async function obtenerTransactionsByPedido(req, res){
    
}

async function obtenerTransactionById(req, res){
    
}

async function obtenerTransactionsByDate(req, res){
    
}

async function obtenerTransactionsByCompany(req, res){
    
}

async function obtenerTransactionsByDateByCompany(req, res){
    
}

async function obtenerTransactionProductsByTransaction(req, res){
    
}

async function obtenerTransactionPackagesByTransaction(req, res){
    
}

async function obtenerDeliveryByPedido(req, res){
    
}

async function calcularTotal(req, res){
    console.info('Conexion POST entrante : /api/pedido/calcular');

    let validar = {
        contenido: req.body.contenido,
        specialDiscount: req.body.specialDiscount
    };
    
    let { error } = validarCalculo(validar);

    if(error){
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
        console.info('Analizando contenido');
        let { armado, sumaProds, sumaPacks } = await analizarContenido(req.body.contenido);
        console.log('armado', armado)
        console.log('sumaProds', sumaProds)
        console.log('sumaPacks', sumaPacks)

        if(armado){
            console.info('Contenido analizado');
            let total = sumaProds + sumaPacks;

            console.info('Verificando special discount');
            if(req.body.specialDiscount !== 0) total -= total * (req.body.specialDiscount / 100);

            console.info(`Total calculado $${total}`);
            console.info('Preparando response');
            res.status(200).json({ total, sumaProds, sumaPacks });
        }
        else{
            console.info('Error al calcular el total');
            console.info('Preparando response');
            res.status(500).json({message: 'Ocurrio un error al querer calcular el total'});
        }
    }
}

async function realizarPedido(req, res){
    console.info('Conexion POST entrante : /api/pedido');

    console.log('request', req.body);

    console.info('Enviando a validar tipos de datos en request');
    let valPedido = {
        userId: req.body.userId,
        buyerId: req.body.buyerId,
        amount: req.body.amount,
        specialDiscount: req.body.specialDiscount,
        deliveryType: req.body.deliveryType,
        contenido: req.body.contenido
    };
    let { error } = validarPedido(valPedido);
    
    if(error){
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
            let { armado, sumaProds, sumaPacks } = await analizarContenido(req.body.contenido);
            req.body.contenido = armado;

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
                // taotal * (specialDiscount / 100) = total a descontar
                if(req.body.specialDiscount !== 0) total -= total * (req.body.specialDiscount / 100);

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
                        specialDiscount: req.body.specialDiscount
                    };
                    console.log('Enviando Query INSERT para Pedido');
                    let pedidoRes = await insertPedido(pedido);

                    // Armar transacciones, una por cada seller
                    if(pedidoRes.id){
                        console.log(`Pedido insertado correctamente, ID: ${pedidoRes.id}`);
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
                                        productsIds.push(prodRes.id);
                                        let prodReducido = await reducirStockProd(producto.id, producto.quantity);
                                        if(!prodReducido){
                                            productsOk = false;
                                            rollback = true;
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
                                        packagesIds.push(packRes.id);
                                        let packReducido = await reducirStockPack(paquete.id, paquete.quantity);
                                        if(!packReducido){
                                            packagesOk = false;
                                            rollback = true;
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

                                        //Falta hacer logica de tabla Delivery
                                        let despachador = 0;
                                        if(req.body.deliveryType === 'Comprador') despachador = req.body.buyerId;
                                        else despachador = seller.sellerId;

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
                                            console.log(`Error en insert Delivery para transaction ${transactionRes.id}`);
                                            errorMessage.push(deliveryRes.message);
                                            deliveriesOK = false;
                                            rollback = true;
                                        }

                                    }
                                    else{
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
                            console.log('Ocurrio un error en el proceso de inserts, comenzando rollback');

                            console.log('Comenzando rollbacks de deliveries');
                            for(let id of deliveriesIds){
                                console.log(`Enviando rollback de delivery ID: ${id}`);
                                let rollackDelivery = await rollbackDelivery(id);
                                if(rollackDelivery.result) console.log(`Rollback de delivery ${id} realizado correctamente`);
                                else console.log(`Ocurrio un error en rollback de delivery ${id}`);
                            }

                            console.log('Comenzando rollbacks de transactionPackages');
                            for(let id of packagesIds){
                                console.log(`Enviando rollback de transactionPackage ID: ${id}`);
                                let rollbackPackage = await rollbackTransactionPackage(id);
                                if(rollbackPackage.result) console.log(`Rollback de transactionPackage ${id} realizado correctamente`);
                                else console.log(`Ocurrio un error en rollback de transactionPackage ${id}`);
                            }

                            console.log('Comenzando rollbacks de transactionProducts');
                            for(let id of productsIds){
                                console.log(`Enviando rollback de transactionProduct ID: ${id}`);
                                let rollbackProduct = await rollbackTransactionProduct(id);
                                if(rollbackProduct.result) console.log(`Rollback de transactionProduct ${id} realizado correctamente`);
                                else console.log(`Ocurrio un error en rollback de transactionProduct ${id}`);
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

                            console.log('Comenzando rollbacks de pedido');
                            let rollbackPed = await rollbackPedido(pedidoRes.id);
                            if(rollbackPed.result) console.log(`Rollback de pedido ${pedidoRes.id} realizado correctamente`);
                            else console.log(`Ocurrio un error en rollback de pedido ${pedidoRes.id}`);

                            res.status(500).json({message: 'No se pudo completar el pedido'});
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
            console.log('Contenido es un array vacio');
            res.status(400).json({message: 'Contenido es un array vacio'});
        }
    }
}

async function armarPedido(pedido){
    console.info(`Comenzando armado de pedido ${pedido.id}`);

    console.info('Obteniendo transacciones');
    let { transactions: transactionIds } = await getTransactionsByPedido(pedido.id);

    let flag = true;
    if(transactionIds){
        let transactions = await Promise.all(transactionIds.map(async id => {
            console.log('ID: ', id)
            let { transaction: tran } = await getTransactionById(id);

            if(tran){
                let transaction =  await armarTransaction(tran);

                if(!transaction){
                    flag = false;
                    return null;
                }
                else{
                    return transaction;
                }
            }
            else{
                flag = false;
                return null;
            }
        }));
        if(flag){
            pedido.transactions = transactions;

            // let { delivery } = await getDeliveryByTransaction(pedido.id);

            // if(delivery){
            //     pedido.delivery = delivery;
                return pedido;
            // }
            // else{
            //     console.info(`Ocurrio un error buscando el delivery para el pedido ${pedido.id}`);
            //     return null;
            // }

        }
        else{
            console.info('Ocurrio un error armando las transacciones');
            return null
        }
    }
    else{
        console.info(`Ocurrio un error buscando las transacciones para el pedido ${pedido.id}`);
        return null;
    }
}

async function armarTransaction(transaction){
    console.info(`Comenzando armado de transaccion ${transaction.id}`);

    console.info('Obteniendo productos');
    let { productos } = await getTransactionProductsByTransaction(transaction.id);
    
    console.info('Obteniendo paquetes');
    let { paquetes } = await getTransactionPackagesByTransaction(transaction.id);

    if(!productos && !paquetes){
        console.info(`Ocurrio un error buscando los productos y paquetes de la transaccion ${transaction.id}`);
        return null;
    }
    else{
        let { delivery } = await getDeliveryByTransaction(transaction.id);

        if(productos){
            transaction.products = productos;
        }

        if(paquetes){
            transaction.packages = paquetes;
        }

        if(!delivery){
            console.info(`Ocurrio un error buscando el delivery de la transaccion ${transaction.id}`);
            return null;
        }
        else{
            transaction.delivery = delivery;
            return transaction;
        }
    }
}

async function getPedidos(){
    console.info(`Buscando todos los pedidos`);
    let message = '';
    let pedidos = await queries
                        .pedidos
                        .getAll()
                        .then(async data => {
                            if(data){
                                let flag = true;
                                console.info('Informacion de pedidos obtenida');
                                let res = await Promise.all(data.map(async p => {
                                    let pedido = await armarPedido(p);
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

async function getPedidoById(id){
    console.info(`Buscando pedido con ID: ${id}`);
    let message = '';
    let pedido = await queries
                    .pedidos
                    .getOneById(id)
                    .then(async data => {
                        if(data){
                            console.info(`Pedido con ID: ${id} encontrado`);
                            let res = await armarPedido(data);
                            if(res) return res;
                            else return null;
                        }
                        else{
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

async function getPedidosByUser(id){
    console.info(`Buscando todos los pedido del usuario ${id}`);
    let message = '';
    let pedidos = await queries
                        .pedidos
                        .getByUser(id)
                        .then(async data => {
                            if(data){
                                let flag = true;
                                console.info('Informacion de pedidos obtenida');
                                let res = await Promise.all(data.map(async p => {
                                    let pedido = await armarPedido(p);
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

async function getPedidosByDate({ dateFrom, dateTo }){
    console.info(`Buscando todos los pedido entre ${dateFrom} y ${dateTo}`);
    let message = '';
    let pedidos = await queries
                        .pedidos
                        .getByDate(dateFrom, dateTo)
                        .then(async data => {
                            if(data){
                                let flag = true;
                                console.info('Informacion de pedidos obtenida');
                                let res = await Promise.all(data.map(async p => {
                                    let pedido = await armarPedido(p);
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

async function getPedidosByDateByUser(id, dateFrom, dateTo){
    //ver tema fechas y user
    console.info(`Buscando todos los pedido del usuario ${id} entre ${dateFrom} y ${dateTo}`);
    let message = '';
    let pedidos = await queries
                        .pedidos
                        .getByDateByUser(id, dateFrom, dateTo)
                        .then(async data => {
                            if(data){
                                let flag = true;
                                console.info('Informacion de pedidos obtenida');
                                let res = await Promise.all(data.map(async p => {
                                    let pedido = await armarPedido(p);
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

async function getTransactionsByPedido(id){
    console.info(`Buscando todas las transacciones del pedido ${id}`);
    let message = '';
    let transactions = await queries
                        .transactions
                        .getByPedido(id)
                        .then(data => {
                            if(data){
                                console.info('Informacion de transacciones obtenida');
                                let res = data.map(t => t.transactionId);
                                return res;
                            }
                            else{
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

async function getTransactionById(id){
    console.info(`Buscando transaccion con ID: ${id}`);
    let message = '';
    let transaction = await queries
                    .transactions
                    .getOneById(id)
                    .then(data => {
                        if(data){
                            console.info(`Transaccion con ID: ${id} encontrada`);
                            return data;
                        }
                        else{
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

async function getTransactionsByDate(dateFrom, dateTo){
    //ver
    console.info(`Buscando todos los pedido del usuario ${id}`);
    let message = '';
    let pedidos = await queries
                        .pedidos
                        .getByUser(id)
                        .then(async data => {
                            if(data){
                                let flag = true;
                                console.info('Informacion de pedidos obtenida');
                                let res = await Promise.all(data.map(async p => {
                                    let pedido = await armarPedido(p);
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

async function getTransactionsByCompany(id, company){
    //ver
    console.info(`Buscando todos los pedido del usuario ${id}`);
    let message = '';
    let pedidos = await queries
                        .pedidos
                        .getByUser(id)
                        .then(async data => {
                            if(data){
                                let flag = true;
                                console.info('Informacion de pedidos obtenida');
                                let res = await Promise.all(data.map(async p => {
                                    let pedido = await armarPedido(p);
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

async function getTransactionsByDateByCompany(id, company, dateFrom, dateTo){
    //ver
    console.info(`Buscando todos los pedido del usuario ${id}`);
    let message = '';
    let pedidos = await queries
                        .pedidos
                        .getByUser(id)
                        .then(async data => {
                            if(data){
                                let flag = true;
                                console.info('Informacion de pedidos obtenida');
                                let res = await Promise.all(data.map(async p => {
                                    let pedido = await armarPedido(p);
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

async function getTransactionProductsByTransaction(id){
    console.log(`Buscando productos para transaccion ${id}`);
    let message = '';
    let productos = await queries
                        .transactionProducts
                        .getByTransaction(id)
                        .then(async data => {
                            if(data){
                                console.info(`Se encontraron ${data.length} productos para la transaccion ${id}`);
                                let flag = true;
                                let res = await Promise.all(data.map(async prod => {
                                    let { product } = await getProduct(prod.productId);
                                    if(product){
                                        let { price } = await getPriceByIdProduct(prod.priceId);

                                        if(price){
                                            product.priceId = prod.priceId;
                                            product.price = price.price;
                                            product.quantity = prod.quantity;
                                            return product;
                                        }
                                        else{
                                            flag = false;
                                            return null;
                                        }
                                    }
                                    else{
                                        console.info(`Ocurrio un error al obtener el producto con ID: ${prod.productId}`);
                                        flag = false;
                                        return null;
                                    }
                                }));
                                if(flag) return res;
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

async function getTransactionPackagesByTransaction(id){
    console.log(`Buscando paquetes para transaccion ${id}`);
    let message = '';
    let paquetes = await queries
                        .transactionPackages
                        .getByTransaction(id)
                        .then(async data => {
                            if(data){
                                console.info(`Se encontraron ${data.length} paquetes para la transaccion ${id}`);
                                let flag = true;
                                let res = await Promise.all(data.map(async pack => {
                                    let { package } = await getPackage(pack.packageId);
                                    if(package){
                                        let { price } = await getPriceByIdPackage(pack.priceId);

                                        if(price){
                                            package.priceId = pack.priceId;
                                            package.quantity = pack.quantity;
                                            return package;
                                        }
                                        else{
                                            flag = false;
                                            return null;
                                        }
                                    }
                                    else{
                                        console.info(`Ocurrio un error al obtener el paquete con ID: ${pack.packageId}`);
                                        flag = false;
                                        return null;
                                    }
                                }));
                                if(flag) return res;
                                else return null;
                            }
                            else{
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

async function getDeliveryByTransaction(id){
console.info(`Buscando el delivery de la transaccion ${id}`);
    let message = '';
    let delivery = await queries
                        .deliveries
                        .getByTransaction(id)
                        .then(data => {
                            if(data){
                                console.info('Informacion de delivery obtenida');
                                return data;
                            }
                            else{
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

async function insertPedido(pedido){
    console.info('Comenzando insert de Pedido');
    let message = '';
    let id = await queries
            .pedidos
            .insert(pedido)
            .then(res => {
                if(res){
                    console.log(`Insert de Pedido exitoso con ID: ${res[0]}`);
                    return res[0];
                }
                else{
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

async function insertTransaction(transaction){
    console.info('Comenzando insert de Transaction');
    let message = '';
    let id = await queries
            .transactions
            .insert(transaction)
            .then(res => {
                if(res){
                    console.log(`Insert de Transaction exitoso con ID: ${res[0]}`);
                    return res[0];
                }
                else{
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

async function insertTransactionProduct(tranProd){
    console.info('Comenzando insert de TransactionProduct');
    let message = '';
    let id = await queries
            .transactionProducts
            .insert(tranProd)
            .then(res => {
                if(res){
                    console.log(`Insert de TransactionProduct exitoso con ID: ${res[0]}`);
                    return res[0];
                }
                else{
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

async function insertTransactionPackage(tranPack){
    console.info('Comenzando insert de TransactionPackage');
    let message = '';
    let id = await queries
            .transactionPackages
            .insert(tranPack)
            .then(res => {
                if(res){
                    console.log(`Insert de TransactionPackage exitoso con ID: ${res[0]}`);
                    return res[0];
                }
                else{
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

async function insertPedidoTransaction(pedidoTransaction){
    console.info('Comenzando insert de PedidoTransaction');
    let message = '';
    let id = await queries
            .pedidoTransaction
            .insert(pedidoTransaction)
            .then(res => {
                if(res){
                    console.log(`Insert de PedidoTransaction exitoso con ID: ${res[0]}`);
                    return res[0];
                }
                else{
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

async function insertDelivery(delivery){
    console.info('Comenzando insert de Delivery');
    let message = '';
    let id = await queries
            .deliveries
            .insert(delivery)
            .then(res => {
                if(res){
                    console.log(`Insert de Delivery exitoso con ID: ${res[0]}`);
                    return res[0];
                }
                else{
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

async function rollbackPedido(id){
    let message = '';
    let result = await queries
                    .pedidos
                    .delete(id)
                    .then(res => {
                        // console.log(`Rollback de Pedido ${id} realizado correctamente: ${data}`);
                        return res;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de Pedido: ', err);
                        message += `Error en Query DELETE de Pedido: ${err}`;
                    });
    return { result, message };
}

async function rollbackTransaction(id){
    let message = '';
    let result = await queries
                    .transactions
                    .delete(id)
                    .then(res => {
                        // console.log(`Rollback de Transaction ${id} realizado correctamente: ${data}`);
                        return res;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de Transaction: ', err);
                        message += `Error en Query DELETE de Transaction: ${err}`;
                    });
    return { result, message };
}

async function rollbackTransactionProduct(id){
    let message = '';
    let result = await queries
                    .transactionProducts
                    .delete(id)
                    .then(res => {
                        // console.log(`Rollback de TransactionProduct ${id} realizado correctamente: ${data}`);
                        return res;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de TransactionProduct: ', err);
                        message += `Error en Query DELETE de TransactionProduct: ${err}`;
                    });
    return { result, message };
}

async function rollbackTransactionPackage(id){
    let message = '';
    let result = await queries
                    .transactionPackages
                    .delete(id)
                    .then(res => {
                        // console.log(`Rollback de TransactionPackage ${id} realizado correctamente: ${data}`);
                        return res;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de TransactionPackage: ', err);
                        message += `Error en Query DELETE de TransactionPackage: ${err}`;
                    });
    return { result, message };
}

async function rollbackPedidoTransaction(id){
    let message = '';
    let result = await queries
                    .pedidoTransaction
                    .delete(id)
                    .then(res => {
                        // console.log(`Rollback de PedidoTransaction ${id} realizado correctamente: ${data}`);
                        return res;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de PedidoTransaction: ', err);
                        message += `Error en Query DELETE de PedidoTransaction: ${err}`;
                    });
    return { result, message };
}

async function rollbackDelivery(id){
    let message = '';
    let result = await queries
                    .deliveries
                    .delete(id)
                    .then(res => {
                        // console.log(`Rollback de Delivery ${id} realizado correctamente: ${data}`);
                        return res;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de Delivery: ', err);
                        message += `Error en Query DELETE de Delivery: ${err}`;
                    });
    return { result, message };
}

function validarPedido(body){
    console.info('Comenzando validacion Joi de Pedido');
    const schema = Joi.object().keys({
        userId: Joi.number().required(),
        buyerId: Joi.number().required(),
        amount: Joi.number().required(),
        specialDiscount: Joi.number().required(),
        deliveryType: Joi.string().required(),
        contenido: Joi.array().required()
    });
    console.info('Finalizando validacion Joi de Pedido');
    return Joi.validate(body, schema);
}

function validarFechas(fechas){
    console.info('Comenzando validacion Joi de Fecha');
    const schema = Joi.object().keys({
        dateFrom: Joi.date().required(),
        dateTo: Joi.date().required()
    });
    console.info('Finalizando validacion Joi de Fecha');
    return Joi.validate(fechas, schema);
}

function validarCalculo(validar){
    console.info('Comenzando validacion Joi de calculo');
    const schema = Joi.object().keys({
        contenido: Joi.array().required(),
        specialDiscount: Joi.number().required()
    });
    console.info('Finalizando validacion Joi de calculo');
    return Joi.validate(validar, schema);
}


async function analizarContenido(contenido){
    let sumaProds = 0, sumaPacks = 0;

    let armado = await Promise.all(contenido.map(async seller => {
        let sumaProdsSeller = 0, sumaPacksSeller = 0;
        //Valido que el seller exista
        let { company: sellerCompany, message: sellerMessage } = await getCompanyById(seller.sellerId);
        if(!sellerCompany) errorMessage.push(sellerMessage);
        else{
            if(seller.productos && seller.productos.length > 0){
                for(let prod of seller.productos){
                    let { product, message: productMessage } = await getProduct(prod.id);
                    if(!product) errorMessage.push(productMessage);
                    else if(Number(product.companyId) !== seller.sellerId){
                        errorMessage.push(`Producto con ID: ${prod.id} no corresponde a empresa con ID: ${seller.sellerId}`);
                    }
                    else{
                        console.info(`Buscando precios para comparar, producto: ${product.id}`);
                        //revisar desde aca ya que debo ver como congelar los precios y comparar que todo este bien y tomar los valores mostrados en el carrito
                        let { prices: lastPrices, message: currentMessage } = await getLastPricesProducts(product.id);
                        let { price: cartPrice, message: cartMessage} = await getPriceByIdProduct(prod.priceId);

                        let currentPrice = lastPrices.rows[0];
                        let lastPrice = lastPrices.rows[1];
                        prod.timestamp = new Date(prod.timestamp);

                        if(lastPrices && cartPrice){
                            console.info('Precios encontrados');
                            if(currentPrice.id === cartPrice.id){
                                console.info(`IDs de precios coinciden: ${cartPrice.id}`);
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

            if(seller.paquetes && seller.paquetes.length > 0){
                for(let pack of seller.paquetes){
                    let { package, message: packageMessage } = await getPackage(pack.id);
                    if(!package) errorMessage.push(packageMessage);
                    else if(package.companyId !== seller.sellerId){
                        errorMessage.push(`Paquete con ID: ${pack.id} no corresponde a empresa con ID: ${seller.sellerId}`);
                    }
                    else{
                        console.info(`Buscando precios para comparar, paquete: ${package.id}`);
                        //revisar desde aca ya que debo ver como congelar los precios y comparar que todo este bien y tomar los valores mostrados en el carrito
                        let { price: lastPrices, message: currentMessage } = await getLastPricesPackages(package.id);
                        let { price: cartPrice, message: cartMessage} = await getPriceByIdPackage(pack.priceId);

                        let currentPrice = lastPrices[0];
                        let lastPrice = lastPrices[1];

                        if(currentPrice && cartPrice){
                            console.info('Precios encontrados');
                            if(currentPrice.id === cartPrice.id){
                                console.info(`IDs de precios coinciden: ${cartPrice.id}`);
                                if(currentPrice.price === prod.price && prod.timestamp > currentPrice.validDateFrom){
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
            seller.amount = sumaProdsSeller + sumaPacksSeller;
            return seller;
        }
    }));

    return { armado, sumaProds, sumaPacks };
}


module.exports = {
    obtenerPedidos,
    obtenerPedidoById,
    obtenerPedidosByUser,
    obtenerPedidosByDate,
    obtenerPedidosByDateByUser,
    obtenerTransactionsByPedido,
    obtenerTransactionById,
    obtenerTransactionsByDate,
    obtenerTransactionsByCompany,
    obtenerTransactionsByDateByCompany,
    obtenerTransactionProductsByTransaction,
    obtenerTransactionPackagesByTransaction,
    obtenerDeliveryByPedido,
    calcularTotal,
    realizarPedido,
}