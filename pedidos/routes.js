const Joi = require('joi');
const queries = require('./dbQueries');
const RoutesUsers = require('../users/routes');
const RoutesCompanies = require('../companies/routes');
const RoutesProducts = require('../products/routes');
const RoutesPackages = require('../packages/routes');
const companyQueries = require('../companies/dbQueries');
const userQueries = require('../users/dbQueries');
const productQueries = require('../products/dbQueries');
const { reducirStock } = require('../products/routes');

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

        //validacion de existencia (userId, sellerId, buyerId, productos y paquetes)
//         let errorMessage = ''; // cambiar esto por un array de mensajes para poder iterar

//         let busquedaUser = await RoutesUsers.getUser(req.body.userId);
//         // console.log(busquedaUser);
//         if(!busquedaUser.user) errorMessage += '\n' + busquedaUser.message;

//         // console.log(`Buscando compania vendedora con id: ${req.body.sellerId}`);
//         // let busquedaSeller = await RoutesCompanies.getCompany(req.body.sellerId);
//         // // console.log(busquedaSeller);
//         // if(!busquedaSeller.company) errorMessage += '\n' + busquedaSeller.message;

//         console.log(`Buscando compania compradora con id: ${req.body.buyerId}`);
//         let busquedaBuyer = await RoutesCompanies.getCompany(req.body.buyerId);
//         // console.log(busquedaBuyer);
//         if(!busquedaBuyer.company) errorMessage += '\n' + busquedaBuyer.message;

//         //validar que la compania es la misma que la del usuario

//         let busquedaProductos;
//         let busquedaPaquetes;

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
        

//         if(errorMessage){
//             console.log('Errores encontrados en las validaciones de existencias: ', errorMessage);
//             res.status(400).json({message: errorMessage});
//         }
//         else{
//             res.status(200).json({message: 'OK'});
//             console.log('Validaciones de existencias exitosas');
//             //Preparacion de objectos knex a insertar

//             errorMessage = '';

//             console.log('Creando objeto pedido para insercion');
//             let pedido = {
//                 userId: req.body.userId
//             };

//             console.log('Enviando Query INSERT para Pedido');
//             // let pedidoId = await insertPedido(pedido);

//             // Armar transacciones, una por cada company seller
//             let transacciones = armarTransactions(req.body.products, req.body.packages);

//             //Armar logica para realizar los insert de cada transaccion con el listado de arriba
//             //specialDiscount es por empresa, por lo tanto deberia haber uno por cada transaccion
//             //Hacer que llegue un listado de transacciones ya armado en lugar de armarlo?

//             //Realizar logica para determinar el company id segun el type
//             // let delivery = {
//             //     type: req.body.deliveryType,
//             //     transactionId,
//             //     companyId: '',
//             //     userId: req.body.userId,
//             //     timestamp: new Date(),
//             //     status: 'Pendiente'
//             // }
//         }
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
                    message+= `Error en Query INSERT de Transaction: ${err}`;
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
                        message+= `Error en Query INSERT de TransactionProduct: ${err}`;
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
                        message+= `Error en Query INSERT de TransactionPackage: ${err}`;
                    });
    return { id, message };
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
        amount: Joi.number().required(),
        specialDiscount: Joi.number().required(),
        buyerId: Joi.number().required(),
        contenido: Joi.array().allow(null),
        deliveryType: Joi.string().required()
    };
    return Joi.validate(body, schema);
}

module.exports = {
    realizarPedido,
    getPedidoById,
    getPedidoByUser,
    getTransactionsByPedidoId
}