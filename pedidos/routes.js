const Joi = require('joi');
const queries = require('./dbQueries');
const { getUser } = require('../users/routes');
const { getCompany } = require('../companies/routes');
// const RoutesPackages = require('../packages/routes');
// const companyQueries = require('../companies/dbQueries');
// const userQueries = require('../users/dbQueries');
// const productQueries = require('../products/dbQueries');
const { reducirStock: reducirStockProd, getProduct } = require('../products/routes');
const { reducirStock: reducirStockPack, getPackage } = require('../packages/routes');

// function getPedidoById(req, res){
//     console.log(`Conexion GET entrante : /api/pedido/${req.params.id}`);

//     queries
//         .pedidos
//         .getOneById(req.params.id)
//         .then(data => {
//             if(data){
//                 console.log('Informacion de pedido obtenida correctamente');
//                 res.status(200).json(data);
//             }
//             else{
//                 console.log(`No existe pedido para el ID: ${req.params.id}`);
//                 res.status(400).json({message: `No existe pedido para el ID: ${req.params.id}`});
//             }
//         })
//         .catch(err => {
//             console.log('Error en Query SELECT de Pedido', err);
//             res.status(500).json({message: 'Hubo un error al ejecutar la consulta'});
//         });
// }

async function getPedidos(req, res){
    console.log(`Conexion GET entrante : /api/pedido/user/${req.params.id}`);

    let busUser = await getUser(req.params.id);

    if(!busUser.user){
        console.log(`No existe user con ID: ${req.params.id}`);
        res.status(400).json({message: `No existe user con ID: ${req.params.id}`});
    }
    else{
        console.log(`Yendo a buscar pedidos del usuario ${req.params.id}`);
        let pedidos = await getPedidosByUser(req.params.id);

        if(!pedidos){
            //ver si devuelve array vacio
            console.log(`No hay pedidos para el usuario ${req.params.id}`);
            res.status(200).json({message: `No hay pedidos para el usuario ${req.params.id}`});
        }
        else if(pedidos.length > 0){
            console.log(`Usuario tiene ${pedidos.length} pedidos`);

            pedidos = await Promise.all(pedidos.map(async pedido => {

                pedido.transactions = await getTransactionsByPedidoId(pedido.id);

                if(pedido.transactions.length > 0){
                    console.log(`Comenzando busquedas de productos y paquetes por transaccion.`);
                    pedido.transactions = await Promise.all(pedido.transactions.map(async transaccion => {
                        transaccion.productos = await getProductsByTranId(transaccion.id);
                        // console.log('transaccion.productos', transaccion.productos);
                        transaccion.paquetes = await getPackagesByTranId(transaccion.id);
                        return transaccion;
                    }));
                }
                else{
                    //error al buscar transacciones
                }
                return pedido;
            }));
            res.status(200).json(pedidos);
        }
        else{
            console.log('El usuario no tiene pedidos');
            res.status(200).json({message: 'El usuario no tiene pedidos'});
        }
    }
}

const getPedidosByUser = async (userId) => {
    //agregar message para errores
    let pedidos = await queries
                    .pedidos
                    .getByUser(userId)
                    .then(data => {
                        if(data && data.length > 0){
                            console.log('Informacion de pedidos obtenida correctamente');
                            data.map(ped => console.log(ped))
                            // res.status(200).json(data);
                            return data;
                        }
                        else{
                            console.log(`No existen pedidos para el user ID: ${userId}`);
                            // res.status(400).json({message: `No existe pedido para el user ID: ${userId}`});
                        }
                    })
                    .catch(err => {
                        console.log('Error en Query SELECT de Pedido', err);
                        // res.status(500).json({message: 'Hubo un error al ejecutar la consulta'});
                    });
    return pedidos;
}

// function getPedidosByUserComplete(req, res){
//     console.log(`Conexion GET entrante : /api/pedido/user/${req.params.id}/complete`);
// }

const getTransactionsByPedidoId = async (pedidoId) => {
    //agregar message para errores
    let pedidoTransaction = await queries
                            .transactions
                            .getByPedido(pedidoId)
                            .then(data => {
                                if(data && data.length > 0){
                                    console.log(`${data.length} transacciones encontradas para el pedido ${pedidoId}`);
                                    let res = data.map(tran => {
                                        console.log(`Id transaccion: ${tran.transactionId}`);
                                        return {id: tran.transactionId}
                                    })
                                    return res;
                                    // res.status(200).json(data);
                                }
                                else{
                                    console.log(`No existe pedido para el ID: ${pedidoId}`);
                                    // res.status(400).json({message: `No existe pedido para el ID: ${pedidoId}`});
                                }
                            })
                            .catch(err => {
                                console.log('Error en Query SELECT de Transaction', err);
                                // res.status(500).json({message: 'Hubo un error al ejecutar la consulta'});
                            });
    return pedidoTransaction;
}

async function getProductsByTranId(transactionId){
    console.log(`Buscando productos para transaccion ${transactionId}`);
    //agregar message para errores
    let productos = await queries
                            .transactionProducts
                            .getByTransaction(transactionId)
                            .then(async data => {
                                if(data && data.length > 0){
                                    console.log(`Se encontraron ${data.length} productos para la transaccion ${transactionId}`);
                                    let res = await Promise.all(data.map(async prod => {
                                        // console.log('prod', prod);
                                        let busquedaProd = await getProduct(prod.productId);
                                        if(busquedaProd.product){
                                            prod.product = busquedaProd.product;
                                            prod.product.price = prod.price;
                                            prod.product.quantity = prod.quantity;
                                        }
                                        else{
                                            //error
                                        }
                                        // console.log('prod.product', prod.product);
                                        // console.log('quantity', prod.product.quantity);
                                        // return {id: prod.productId, quantity: prod.quantity}
                                        return prod.product;
                                    }));
                                    return res;
                                }
                                else{
                                    console.log(`No se encontraron productos para la transaccion ID: ${transactionId}`);
                                }
                            })
                            .catch(err => {
                                console.log('Error en Query SELECT de TransactionProduct', err);
                            })
    // console.log('productos', productos);
    return productos;
}

async function getPackagesByTranId(transactionId){
    console.log(`Buscando paquetes para transaccion ${transactionId}`);
    //agregar message para errores
    let paquetes = await queries
                            .transactionPackages
                            .getByTransaction(transactionId)
                            .then(async data => {
                                if(data && data.length > 0){
                                    console.log(`Se encontraron ${data.length} paquetes para la transaccion ${transactionId}`);
                                    let res = await Promise.all(data.map(async pack => {
                                        let busquedaPack = await getPackage(pack.packageId);
                                        if(busquedaPack.package){
                                            pack.package = busquedaPack.package;
                                            pack.package.quantity = pack.quantity;
                                        }
                                        else{
                                            //error
                                        }
                                        return pack.package;
                                    }));
                                    return res;
                                }
                                else{
                                    console.log(`No se encontraron paquetes para la transaccion ID: ${transactionId}`);
                                }
                            })
                            .catch(err => {
                                console.log('Error en Query SELECT de TransactionPackage', err);
                            })
    return paquetes;
}

async function realizarPedido(req, res){
    console.log('Conexion POST entrante : /api/pedido');

    console.log('Request', req.body);

    // validacion de tipos
    console.log('Comenzando validacion JOI de request');
    let { error } = validarPedido(req.body);
    
    if(error){
        console.log(`Error en la validacion de tipos de datos: ${error.details[0].message}`)
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.log('Validacion JOI exitosa');

        //Si hay contenido sigo, si no devuelvo error
        if(req.body.contenido && req.body.contenido.length > 0){
            //validacion de existencia (userId, sellerId, buyerId, productos y paquetes)
            let errorMessage = [];

            //Busco el usuario
            let busquedaUser = await getUser(req.body.userId);
            //Si el usuario no existe, concateno mensaje de error
            if(!busquedaUser.user) errorMessage.push(busquedaUser.message);

            //Busco empresa asociada al usuario
            console.log(`Buscando compania compradora con id: ${req.body.buyerId}`);
            let busquedaBuyer = await getCompany(req.body.buyerId);
            //Si la empresa no existe, concateno mensaje de error
            if(!busquedaBuyer.company) errorMessage.push(busquedaBuyer.message);

            //validar que la compania es la misma que la del usuario
            if(busquedaBuyer.company.id !== busquedaUser.user.companyId)
                errorMessage.push('El usuario ingresado no corresponde con la empresa ingresada');

            //Inicio los arrays a utilizar para los inserts
            let sumaProds = 0, sumaPacks = 0;

            //Recorro todos los sellers 
            await Promise.all(req.body.contenido.map(async seller => {
                let sumaProdsSeller = 0, sumaPacksSeller = 0;
                //Valido que el seller exista
                let busSeller = await getCompany(seller.sellerId);
                if(!busSeller.company) errorMessage.push(busquedaBuyer.message);
                else{
                    if(seller.productos && seller.productos.length > 0){
                        for(let prod of seller.productos){
                            let busProd = await getProduct(prod.id);
                            if(!busProd.product) errorMessage.push(busProd.message);
                            else if(busProd.product.companyId !== seller.sellerId){
                                console.log('busProd.product.companyId', busProd.product.companyId);
                                console.log('busProd.product.companyId', typeof busProd.product.companyId);
                                console.log('seller.sellerId', seller.sellerId);
                                console.log('seller.sellerId', typeof seller.sellerId);
                                errorMessage.push(`Producto con ID: ${prod.id} no corresponde a empresa con ID: ${seller.sellerId}`);
                            }
                            else{
                                sumaProds += busProd.product.price;
                                sumaProdsSeller += busProd.product.price;
                                prod.price = busProd.product.price;
                            }
                        }
                    }

                    if(seller.paquetes && seller.paquetes.length > 0){
                        for(let pack of seller.paquetes){
                            let busPack = await getPackage(pack.id);
                            if(!busPack.package) errorMessage.push(busPack.message);
                            else if(busPack.package.companyId !== seller.sellerId){
                                errorMessage.push(`Paquete con ID: ${pack.id} no corresponde a empresa con ID: ${seller.sellerId}`);
                            }
                            else{
                                sumaPacks += busPack.package.price;
                                sumaPacksSeller += busPack.package.price;
                                pack.price = busPack.package.price;
                            }
                        }
                    }
                    seller.amount = sumaProdsSeller + sumaPacksSeller;
                    // transactions.push(transaction);
                }
            }));

            if(errorMessage.length > 0){
                console.log('Errores encontrados en las validaciones de existencias: ');
                for(let error of errorMessage){
                    console.log(error);
                }
                res.status(400).json({message: errorMessage});
            }
            else{
                console.log('Validaciones de existencias exitosas');
                console.log('Validacion amount the pedido');

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
                        amount: req.body.amount,
                        specialDiscount: req.body.specialDiscount
                    };
                    console.log('Enviando Query INSERT para Pedido');
                    let pedidoRes = await insertPedido(pedido);

                    // Armar transacciones, una por cada seller
                    if(pedidoRes.id){
                        console.log(`Pedido insertado correctamente, ID: ${pedidoRes.id}`);
                        let transactionsOk = true, productsOk = true, packagesOk = true, pedidoTransactionOK = true, deliveriesOK = true;
                        let transactionsIds = [], pedidoTransactionsIds = [], deliveriesIds = [], productsIds = [], packagesIds = [];;
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
                            let transactionRes = await insertarTransaccion(transaction);

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
                                        price: producto.price
                                    }

                                    console.log(`Enviando producto con ID: ${producto.id} para insercion transaccionProduct de seller ${seller.sellerId}`);
                                    let prodRes = await insertarTransactionProduct(prod);

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
                                        price: paquete.price
                                    }

                                    console.log(`Enviando paquete con ID: ${paquete.id} para insercion transaccionPackage de seller ${seller.sellerId}`);
                                    let packRes = await insertarTransactionPackage(pack);

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
                                if(rollackDelivery.res) console.log(`Rollback de delivery ${id} realizado correctamente`);
                                else console.log(`Ocurrio un error en rollback de delivery ${id}`);
                            }

                            console.log('Comenzando rollbacks de transactionPackages');
                            for(let id of packagesIds){
                                console.log(`Enviando rollback de transactionPackage ID: ${id}`);
                                let rollbackPackage = await rollbackTransactionPackage(id);
                                if(rollbackPackage.res) console.log(`Rollback de transactionPackage ${id} realizado correctamente`);
                                else console.log(`Ocurrio un error en rollback de transactionPackage ${id}`);
                            }

                            console.log('Comenzando rollbacks de transactionProducts');
                            for(let id of productsIds){
                                console.log(`Enviando rollback de transactionProduct ID: ${id}`);
                                let rollbackProduct = await rollbackTransactionProduct(id);
                                if(rollbackProduct.res) console.log(`Rollback de transactionProduct ${id} realizado correctamente`);
                                else console.log(`Ocurrio un error en rollback de transactionProduct ${id}`);
                            }

                            console.log('Comenzando rollbacks de pedidoTransaction');
                            for(let id of pedidoTransactionsIds){
                                console.log(`Enviando rollback de pedidoTransaction ID: ${id}`);
                                let rollbackPedTran = await rollbackPedidoTransaction(id);
                                if(rollbackPedTran.res) console.log(`Rollback de pedidoTransaction ${id} realizado correctamente`);
                                else console.log(`Ocurrio un error en rollback de pedidoTransaction ${id}`);
                            }

                            console.log('Comenzando rollbacks de transactions');
                            for(let id of transactionsIds){
                                console.log(`Enviando rollback de transaction ID: ${id}`);
                                let rollbackTran = await rollbackTransaction(id);
                                if(rollbackTran.res) console.log(`Rollback de transaction ${id} realizado correctamente`);
                                else console.log(`Ocurrio un error en rollback de transaction ${id}`);
                            }

                            console.log('Comenzando rollbacks de pedido');
                            let rollbackPed = await rollbackPedido(pedidoRes.id);
                            if(rollbackPed.res) console.log(`Rollback de pedido ${pedidoRes.id} realizado correctamente`);
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
                    console.log('req.body.amount', req.body.amount);
                    console.log('req.body.amount', typeof req.body.amount);
                    console.log('total', total);
                    console.log('total', typeof total);
                    console.log('Amount no coincide con el contenido ingresado');
                    res.status(400).json({message: 'Amount no coincide con el contenido ingresado'});
                }
            }//fin else errorMessage.length > 0
        } //fin if contenido.length > 0
        else{
            console.log('Contenido es un array vacio');
            res.status(400).json({message: 'Contenido es un array vacio'});
        }
    }
}

async function insertPedido(pedido){
    let message = '';
    let id = await queries
            .pedidos
            .insert(pedido)
            .then(data => {
                // console.log(`Pedido insertado correctamente, ID: ${data[0]}`);
                return data[0];
            })
            .catch(err => {
                console.log('Error en Query INSERT de Pedido: ', err);
                message += `Error en Query INSERT de Pedido: ${err}`;
            });
    return { id, message};
}

async function insertarTransaccion(transaction){
    let message = '';
    let id = await queries
                .transactions
                .insert(transaction)
                .then(data => {
                    // console.log(`Transaccion insertada correctamente, ID: ${data[0]}`);
                    return data[0];
                })
                .catch(err => {
                    console.log('Error en Query INSERT de Transaction: ', err);
                    message += `Error en Query INSERT de Transaction: ${err}`;
                });
    return { id, message };
}

async function insertarTransactionProduct(tranProd){
    let message = '';
    let id = await queries
                    .transactionProducts
                    .insert(tranProd)
                    .then(data => {
                        // console.log(`Producto de transaccion insertado correctamente, ID: ${data[0]}`);
                        return data[0];
                    })
                    .catch(err => {
                        console.log('Error en Query INSERT de TransactionProduct: ', err);
                        message += `Error en Query INSERT de TransactionProduct: ${err}`;
                    });
    return { id, message };
}

async function insertarTransactionPackage(tranPack){
    let message = '';
    let id = await queries
                    .transactionPackages
                    .insert(tranPack)
                    .then(data => {
                        // console.log(`Paquete de transaccion insertado correctamente, ID: ${data[0]}`);
                        return data[0];
                    })
                    .catch(err => {
                        console.log('Error en Query INSERT de TransactionPackage: ', err);
                        message += `Error en Query INSERT de TransactionPackage: ${err}`;
                    });
    return { id, message };
}

async function insertPedidoTransaction(pedidoTransaction){
    let message = '';
    let id = await queries
            .pedidoTransaction
            .insert(pedidoTransaction)
            .then(data => {
                // console.log(`PedidoTransaction insertado correctamente, ID: ${data[0]}`);
                return data[0];
            })
            .catch(err => {
                console.log('Error en Query INSERT de PedidoTransaction: ', err);
                message += `Error en Query INSERT de PedidoTransaction: ${err}`;
            });
    return { id, message};
}

async function insertDelivery(delivery){
    let message = '';
    let id = await queries
            .deliveries
            .insert(delivery)
            .then(data => {
                // console.log(`Delivery insertado correctamente, ID: ${data[0]}`);
                return data[0];
            })
            .catch(err => {
                console.log('Error en Query INSERT de Delivery: ', err);
                message += `Error en Query INSERT de Delivery: ${err}`;
            });
    return { id, message};
}

async function rollbackPedido(id){
    let message = '';
    let res = await queries
                    .pedidos
                    .delete(id)
                    .then(data => {
                        // console.log(`Rollback de Pedido ${id} realizado correctamente: ${data}`);
                        return data;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de Pedido: ', err);
                        message += `Error en Query DELETE de Pedido: ${err}`;
                    });
    return { res, message };
}

async function rollbackTransaction(id){
    let message = '';
    let res = await queries
                    .transactions
                    .delete(id)
                    .then(data => {
                        // console.log(`Rollback de Transaction ${id} realizado correctamente: ${data}`);
                        return data;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de Transaction: ', err);
                        message += `Error en Query DELETE de Transaction: ${err}`;
                    });
    return { res, message };
}

async function rollbackTransactionProduct(id){
    let message = '';
    let res = await queries
                    .transactionProducts
                    .delete(id)
                    .then(data => {
                        // console.log(`Rollback de TransactionProduct ${id} realizado correctamente: ${data}`);
                        return data;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de TransactionProduct: ', err);
                        message += `Error en Query DELETE de TransactionProduct: ${err}`;
                    });
    return { res, message };
}

async function rollbackTransactionPackage(id){
    let message = '';
    let res = await queries
                    .transactionPackages
                    .delete(id)
                    .then(data => {
                        // console.log(`Rollback de TransactionPackage ${id} realizado correctamente: ${data}`);
                        return data;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de TransactionPackage: ', err);
                        message += `Error en Query DELETE de TransactionPackage: ${err}`;
                    });
    return { res, message };
}

async function rollbackPedidoTransaction(id){
    let message = '';
    let res = await queries
                    .pedidoTransaction
                    .delete(id)
                    .then(data => {
                        // console.log(`Rollback de PedidoTransaction ${id} realizado correctamente: ${data}`);
                        return data;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de PedidoTransaction: ', err);
                        message += `Error en Query DELETE de PedidoTransaction: ${err}`;
                    });
    return { res, message };
}

async function rollbackDelivery(id){
    let message = '';
    let res = await queries
                    .deliveries
                    .delete(id)
                    .then(data => {
                        // console.log(`Rollback de Delivery ${id} realizado correctamente: ${data}`);
                        return data;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de Delivery: ', err);
                        message += `Error en Query DELETE de Delivery: ${err}`;
                    });
    return { res, message };
}

function validarPedido(body){
    const schema = {
        userId: Joi.number().required(),
        buyerId: Joi.number().required(),
        amount: Joi.number().required(),
        specialDiscount: Joi.number().required(),
        deliveryType: Joi.string().required(),
        contenido: Joi.array().required()
    };
    return Joi.validate(body, schema);
}

function validarSeller(seller){
    const schema = {
        sellerId: Joi.number().required(),
        productos: Joi.array().allow(null).empty(),
        paquetes: Joi.array().allow(null).empty()
    };
    return Joi.validate(seller, schema);
}

function validarProd(prod){
    const schema = {
        id: Joi.number().required(),
        quantity: Joi.number().required(),
        code: Joi.string().allow('').allow(null),
    };
    return Joi.validate(prod, schema);
}

module.exports = {
    realizarPedido,
    getPedidos
    // getPedidoById,
    // getPedidosByUser,
    // getPedidosByUserComplete,
    // getTransactionsByPedidoId,
    // getProductsByTranId,
    // getPackagesByTranId
}