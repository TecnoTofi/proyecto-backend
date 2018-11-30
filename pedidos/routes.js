const Joi = require('joi');
const queries = require('./dbQueries');
const { getUser } = require('../users/routes');
const { getCompany } = require('../companies/routes');
// const RoutesPackages = require('../packages/routes');
// const companyQueries = require('../companies/dbQueries');
// const userQueries = require('../users/dbQueries');
// const productQueries = require('../products/dbQueries');
const { reducirStock: reducirStockProd } = require('../products/routes');
const { reducirStock: reducirStockPack } = require('../packages/routes');

function getPedidoById(req, res){
    console.log(`Conexion GET entrante : /api/pedido/${req.params.id}`);

    queries
        .pedidos
        .getOneById(req.params.id)
        .then(data => {
            if(data){
                console.log('Informacion de pedido obtenida correctamente');
                res.status(200).json(data);
            }
            else{
                console.log(`No existe pedido para el ID: ${req.params.id}`);
                res.status(400).json({message: `No existe pedido para el ID: ${req.params.id}`});
            }
        })
        .catch(err => {
            console.log('Error en Query SELECT de Pedido', err);
            res.status(500).json({message: 'Hubo un error al ejecutar la consulta'});
        });
}

function getPedidoByUser(req, res){
    console.log(`Conexion GET entrante : /api/pedido/user/${req.params.id}`);

    queries
        .pedidos
        .getByUser(req.params.id)
        .then(data => {
            if(data && data.length > 0){
                console.log('Informacion de pedidos obtenida correctamente');
                res.status(200).json(data);
            }
            else{
                console.log(`No existen pedidos para el user ID: ${req.params.id}`);
                res.status(400).json({message: `No existe pedido para el user ID: ${req.params.id}`});
            }
        })
        .catch(err => {
            console.log('Error en Query SELECT de Pedido', err);
            res.status(500).json({message: 'Hubo un error al ejecutar la consulta'});
        });
}

function getTransactionsByPedidoId(req, res){
    console.log(`Conexion GET entrante : /api/pedido/${req.params.id}/transactions`);

    queries
        .transactions
        .getByPedido(req.params.id)
        .then(data => {
            if(data && data.length > 0){
                console.log('Informacion de transacciones obtenida correctamente');
                res.status(200).json(data);
            }
            else{
                console.log(`No existe pedido para el ID: ${req.params.id}`);
                res.status(400).json({message: `No existe pedido para el ID: ${req.params.id}`});
            }
        })
        .catch(err => {
            console.log('Error en Query SELECT de Transaction', err);
            res.status(500).json({message: 'Hubo un error al ejecutar la consulta'});
        });
}

async function realizarPedido(req, res){
    console.log('Conexion POST entrante : /api/pedido');
    // console.log(req.body);
    // res.status(200).json({message: 'bien'});

    console.log('Request', req.body);

    // validacion de tipos
    console.log('Comenzando validacion JOI de request');
    let { error } = validarPedido(req.body);
    
    if(error){
        console.log(`Error en la validacion de request: ${error.details[0].message}`)
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.log('Validacion JOI exitosa');

        //validacion de cada seller/producto/paquete

        //validacion de existencia (userId, sellerId, buyerId, productos y paquetes)
        let errorMessage = ''; // cambiar esto por un array de mensajes para poder iterar

        let busquedaUser = await getUser(req.body.userId);
        console.log(busquedaUser);
        if(!busquedaUser.user) errorMessage += '\n' + busquedaUser.message;

        // console.log(`Buscando compania vendedora con id: ${req.body.sellerId}`);
        // let busquedaSeller = await RoutesCompanies.getCompany(req.body.sellerId);
        // // console.log(busquedaSeller);
        // if(!busquedaSeller.company) errorMessage += '\n' + busquedaSeller.message;

        console.log(`Buscando compania compradora con id: ${req.body.buyerId}`);
        let busquedaBuyer = await getCompany(req.body.buyerId);
        console.log(busquedaBuyer);
        if(!busquedaBuyer.company) errorMessage += '\n' + busquedaBuyer.message;

        //validar que la compania es la misma que la del usuario

        if(busquedaBuyer.company.id !== busquedaUser.user.companyId)
            errorMessage += '\n' + 'El usuario ingresado no corresponde con la empresa ingresada';


        // console.log('errorMessage', errorMessage);

        // let busquedaProductos;
        // let busquedaPaquetes;

// //probar todo esto nuevamente
//         if(req.body.contenido && req.body.contenido.length > 0){
//             if(req.body.contenido.productos && req.body.contenido.productos.length > 0){
//                 busquedaProductos = await Promise.all(req.body.contenido.productos.map(async prod => {
//                     let busProd = await RoutesProducts.getProduct(prod.id);
//                     if(!busProd.product) errorMessage += '\n' + busProd.message;
//                     else{
//                         //validacion de seller
//                         busProd.seller = prod.sellerId; //para que era esto?
//                         busProd.quantity = prod.quantity; //para que era esto?
//                     }
    
//                     return busProd;
//                 }));
//                 console.log(busquedaProductos); //para que era esto?
//             }
    
//             if(req.body.contenido.packages && req.body.contenido.packages.length > 0){
//                 busquedaPaquetes = await Promise.all(req.body.contenido.packages.map(async package => {
//                     let busPack = await RoutesPackages.getPackage(package.id);
//                     if(!busPack.package) errorMessage += '\n' + busPack.message;
//                     else{
//                         busPack.seller = package.sellerId; //para que era esto?
//                         busPack.quantity = package.quantity; //para que era esto?
//                     }
//                 }));
//                 console.log(busquedaPaquetes); //para que era esto?
//             }
//         }
//         else{
//             // error no vino contenido
//         }
        

        if(errorMessage){
            console.log('Errores encontrados en las validaciones de existencias: ', errorMessage);
            res.status(400).json({message: errorMessage});
        }
        else{
            // res.status(200).json({message: 'OK'});
            console.log('Validaciones de existencias exitosas');
            //Preparacion de objectos knex a insertar

            errorMessage = '';

            console.log('Creando objeto pedido para insercion');
            let pedido = {
                userId: req.body.userId
            };

            console.log('Enviando Query INSERT para Pedido');
            let pedidoRes = await insertPedido(pedido);

            let transactionsIds = [];
            let productsIds = [];
            let packagesIds = [];

            // Armar transacciones, una por cada company seller
            // let transacciones = armarTransactions(req.body.products, req.body.packages);
            if(pedidoRes.id){
                let j = 0;
                let transactionsOk = true;
                let productsOk = true;
                let packagesOk = true;
                let seller = {};

                while(j < req.body.contenido.length && transactionsOk && productsOk && packagesOk){
                    seller = req.body.contenido[j];
                    j++;

                    let transaction = {
                        amount: req.body.amount,
                        specialDiscount: req.body.specialDiscount,
                        sellerId: seller.sellerId,
                        buyerId: req.body.buyerId,
                        timestamp: new Date()
                    }

                    let sellerRes = await insertarTransaccion(transaction);

                    if(sellerRes.id){
                        transactionsIds.push(sellerRes.id);

                        let i = 0;
                        while(i< seller.productos.length && productsOk){

                            let prod = {
                                transactionId: sellerRes.id,
                                productId: seller.productos[i].id,
                                quantity: seller.productos[i].quantity
                            }

                            let prodRes = await insertarTransactionProduct(prod);
                            if(!prodRes.id){
                                errorMessage += prodRes.message
                                productsOk = false;
                            }
                            else{
                                productsIds.push(prodRes.id);
                                //hacer la funcion - controlar el resultado ya que el update puede fallar
                                reducirStockProd(prod.id, prod.quantity);
                            }
                            i++;
                        }

                        let x = 0;
                        while(x< seller.paquetes.length && packagesOk){

                            let pack = {
                                transactionId: sellerRes.id,
                                packageId: seller.paquetes[x].id,
                                quantity: seller.paquetes[x].quantity
                            }

                            let packRes = await insertarTransactionPackage(pack);
                            if(!packRes.id){
                                errorMessage += packRes.message
                                packagesOk = false;
                            }
                            else{
                                packagesIds.push(packRes.id);
                                //hacer la funcion - controlar el resultado ya que el update puede fallar
                                reducirStockPack(prod.id, prod.quantity);
                            }
                            x++;
                        }

                        if(!errorMessage && productsIds.length === seller.productos.length && packagesIds.length === seller.paquetes.length){
                            
                            let pedTran = {
                                pedidoId: pedidoRes.id,
                                transactionId: sellerRes.id
                            }
                            let pedidoTransactionRes = await insertPedidoTransaction(pedTran);
                            // usar este id
        
                            if(pedidoTransactionRes.id){
                                console.log('Pedido finalizado correctamente');
                                res.status(201).json({message: `Pedido realizado correctamente: ${pedidoTransactionRes.id}`});
                            }
                            else{
                                //Realizar rollback, crear funcion aparte para no repetir codigo
                                //Falta hacer logica de tabla Delivery

                                // let delivery = {
                                //     type: req.body.deliveryType,
                                //     transactionId,
                                //     companyId: '',
                                //     userId: req.body.userId,
                                //     timestamp: new Date(),
                                //     status: 'Pendiente'
                                // }
                            }
                        }
                    }
                    else{
                        transactionsOk = false;
                        console.log(`Error en insert transaccion de seller ${seller.sellerId}, con error: ${sellerRes.message}`);
                        res.status(500).json({message: sellerRes.message});
                    }
                }

                if(errorMessage || productsIds.length !== seller.productos.length || packagesIds.length !== seller.paquetes.length){

                    console.log('No se pudieron completas los inserts de transactions, realizando rollback');
                    //Rollback
                    //Ver de controllar que los rollbacks salgan bien
                    let rollbackPedidoRes = await rollbackPedido(pedidoRes.id);

                    for(let tranId in transactionsIds){
                        let rollbackTransactionRes = await rollbackTransaction(tranId);
                    }

                    for(let tranProdId in productsIds){
                        let rollbackTransactionRes = await rollbackTransactionProduct(tranProdId);
                    }

                    for(let tranPackId in packagesIds){
                        let rollbackTransactionRes = await rollbackTransactionPackage(tranPackId);
                    }
                    res(500).json({message: 'Algo salio mal en los insert de pedido'});
                }
            }
            else{
                console.log(`Error en insert pedido, con error: ${pedidoRes.message}`)
                res.status(500).json({message: `${pedidoRes.message}`});
            }
        }
    }
}

async function insertPedido(pedido){
    let message = '';
    let id = await queries
            .pedidos
            .insert(pedido)
            .then(data => {
                console.log(`Pedido insertado correctamente, ID: ${data[0]}`);
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
                    console.log(`Transaccion insertada correctamente, ID: ${data[0]}`);
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
                        console.log(`Producto de transaccion insertado correctamente, ID: ${data[0]}`);
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
                        console.log(`Paquete de transaccion insertado correctamente, ID: ${data[0]}`);
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
                console.log(`PedidoTransaction insertado correctamente, ID: ${data[0]}`);
                return data[0];
            })
            .catch(err => {
                console.log('Error en Query INSERT de PedidoTransaction: ', err);
                message += `Error en Query INSERT de PedidoTransaction: ${err}`;
            });
    return { id, message};
}

async function rollbackPedido(id){
    let message = '';
    let res = await queries
                    .pedidos
                    .delete(id)
                    .then(data => {
                        console.log(`Rollback de Pedido ${id} realizado correctamente: ${data}`);
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
                        console.log(`Rollback de Transaction ${id} realizado correctamente: ${data}`);
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
                        console.log(`Rollback de TransactionProduct ${id} realizado correctamente: ${data}`);
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
                        console.log(`Rollback de TransactionPackage ${id} realizado correctamente: ${data}`);
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
                        console.log(`Rollback de PedidoTransaction ${id} realizado correctamente: ${data}`);
                        return data;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de PedidoTransaction: ', err);
                        message += `Error en Query DELETE de PedidoTransaction: ${err}`;
                    });
    return { res, message };
}

function armarTransactions(productos, paquetes){
    console.log('Armando transacciones para insertar en DB...');

    let transactionProducts = [];
    if(productos && productos.length > 0){
        for(let prod of productos){
            let i = 0;
            let inserteNuevo = false;
            while((transactionProducts.length === 0 || i < transactionProducts.length) && !inserteNuevo){
                if(transactionProducts.length === 0 || transactionProducts[i].sellerId !== prod.sellerId){
                    let tranProd = {
                        sellerId: prod.sellerId,
                        productos: [
                            {
                                id: prod.id,
                                quantity: prod.quantity
                            }
                        ]
                    }
                    inserteNuevo = true;
                    transactionProducts.push(tranProd);
                }
                else{
                    let sellerProd = { id: prod.id, quantity: prod.quantity };
                    transactionProducts[i].productos.push(sellerProd);
                }
                i++;
            }
        }
    }
    // console.log('Vendedores unicos de productos', transactionProducts);

    let transactionPackages = [];
    if(paquetes && paquetes.length > 0){
        for(let pack of paquetes){
            let i = 0;
            let inserteNuevo = false;
            while((transactionPackages.length === 0 || i < transactionPackages.length) && !inserteNuevo){
                if(transactionPackages.length === 0 || transactionPackages[i].sellerId !== pack.sellerId){
                    let tranProd = {
                        sellerId: pack.sellerId,
                        paquetes: [
                            {
                                id: pack.id,
                                quantity: pack.quantity
                            }
                        ]
                    }
                    inserteNuevo = true;
                    transactionPackages.push(tranProd);
                }
                else{
                    let sellerPack = { id: pack.id, quantity: pack.quantity };
                    transactionPackages[i].productos.push(sellerPack);
                }
                i++;
            }
        }
    }
    // console.log('Vendedores unicos de paquetes', transactionPackages);

    let transacciones  = [];
    if(transactionPackages.length === 0 && transactionProducts.length > 0)
        transacciones = transactionProducts;
    else if(transactionProducts.length === 0 && transactionPackages.length > 0)
        transacciones = transactionPackages;
    else if (transactionProducts.length > 0 && transactionPackages.length > 0){
        transacciones = transactionProducts;

        for(let item of transactionPackages){
            console.log('dentor del for')
            let i = 0;
            let inserte = false;
            while(i < transactionProducts.length && !inserte){
                console.log('entre al while')
                if(transactionProducts[i].sellerId === item.sellerId){
                    console.log('entre aca');
                    console.log('tranprods', transactionProducts[i]);
                    console.log('sellers', transacciones[i]);
                    transacciones[i].paquetes = item.paquetes;
                    inserte = true;
                }
                i++;
            }
            if(!inserte){
                transacciones.push(item);
            }
        }
    }
    console.log('Transacciones armadas', transacciones);
    return transacciones;
}

function validarPedido(body){
    const schema = {
        userId: Joi.number().required(),
        buyerId: Joi.number().required(),
        amount: Joi.number().required(),
        specialDiscount: Joi.number().required(),
        deliveryType: Joi.string().required(),
        contenido: Joi.array().allow(null)
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
    getPedidoById,
    getPedidoByUser,
    getTransactionsByPedidoId
}