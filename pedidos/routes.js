const Joi = require('joi');
const pedidoQueries = require('./dbQueries');
const companyQueries = require('../companies/dbQueries');
const userQueries = require('../users/dbQueries');
const productQueries = require('../products/dbQueries');
const { reducirStock } = require('../products/routes');

function getPedidoById(req, res){
    console.log(`Conexion GET entrante : /api/pedido/${req.params.id}`);
    pedidosQueries
        .pedidos
        .getOneById(req.params.id)
        .then(data => {
            console.log('Informacion de pedido obtenida correctamente');
            res.status(200).json(data);
        })
        .catch(err => console.log(err));
}

function getPedidoByUser(req, res){
    console.log(`Conexion GET entrante : /api/pedido/user/${req.params.id}`);
    pedidosQueries
    .pedidos
    .getByUser(req.params.id)
    .then(data => {
        console.log('Informacion de pedidos obtenida correctamente');
        res.status(200).json(data);
    })
    .catch(err => console.log(err));
}

function getTransactionsByPedidoId(req, res){
    console.log(`Conexion GET entrante : /api/pedido/${req.params.id}/transactions`);
    pedidosQueries
    .transactions
    .getByPedido(req.params.id)
    .then(data => {
        console.log('Informacion de transacciones obtenida correctamente');
        res.status(200).json(data);
    })
    .catch(err => console.log(err));
}

async function realizarPedido(req, res){
    console.log('Conexion POST entrante : /api/pedido');
    
    //validacion
    console.log('Comenzando validacion JOI de request');
    let { error } = validarPedido(body);
    
    if(error){
        console.log(`Error en la validacion de request: ${error.details[0].message}`)
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.log('Validacion JOI exitosa');

        //validacion de existencia (userId, sellerId y buyerId)
        let errorMessage = '';

        console.log(`Yendo a buscar usuario con id: ${req.body.userId}`);
        let user = await userQueries
                    .users
                    .getOneById(req.body.userId)
                    .then(data => {
                        //undefined si no existe
                        if(!data) {
                            console.log(`No existe usuario con id: ${req.body.userId}`);
                            errorMessage+= `No existe un usuario con id ${req.body.userId}`;
                        }
                        return data;
                    })
                    .catch(err => {
                        console.log('Error en Query SELECT de User: ', err);
                        errorMessage+= `Error en Query SELECT de User: ${err}`;
                    });

        console.log(`Yendo a buscar compania seller con id: ${req.body.sellerId}`);
        let seller = await companyQueries
                        .companies
                        .getOneById(req.body.sellerId)
                        .then(data => {
                            //undefined si no existe
                            if(!data) {
                                console.log(`No existe company seller con id: ${req.body.sellerId}`);
                                errorMessage+= `No existe una company seller con id ${req.body.sellerId}`;
                            }
                            return data;
                        })
                        .catch(err => {
                            console.log('Error en Query SELECT de Company seller: ', err);
                            errorMessage+= `Error en Query SELECT de Company seler: ${err}`;
                        });

        console.log(`Yendo a buscar compania buyer con id: ${req.body.buyerId}`);
        let buyer = await companyQueries
                        .companies
                        .getOneById(req.body.buyerId)
                        .then(data => {
                            //undefined si no existe
                            if(!data) {
                                console.log(`No existe company buyer con id: ${req.body.buyerId}`);
                                errorMessage+= `No existe una company buyer con id ${req.body.buyerId}`;
                            }
                            return data;
                        })
                        .catch(err => {
                            console.log('Error en Query SELECT de Company buyer: ', err);
                            errorMessage+= `Error en Query SELECT de Company buyer: ${err}`;
                        });

        if(req.body.products){
            req.body.products.map(prod => {
                productQueries
                    .companyProduct
                    .getOneById(prod.id)
                    .then(data => {
                        //undefined si no existe
                        if(!data) {
                            console.log(`No existe producto con id: ${prod.id}`);
                            errorMessage+= `No existe un producto con id ${prod.id}`;
                        }
                    })
                    .catch(err => {
                        console.log('Error en Query SELECT de CompanyProduct: ', err);
                        errorMessage+= `Error en Query SELECT de CompanyProduct: ${err}`;
                    });
            });
        }

        if(req.body.packages){
            req.body.packages.map(package => {
                //hay que crear companyPackages
                productQueries
                    .companyPackages
                    .getOneById(package.id)
                    .then(data => {
                        //undefined si no existe
                        if(!data) {
                            console.log(`No existe package con id: ${package.id}`);
                            errorMessage+= `No existe un paquete con id ${package.id}`;
                        }
                    })
                    .catch(err => {
                        console.log('Error en Query SELECT de Package: ', err);
                        errorMessage+= `Error en Query SELECT de Package: ${err}`;
                    });
            });
        }

        //creo que aca va a saltar automatico por no esperar todo lo de arriba
        if(errorMessage){
            console.log('Errores encontrados en las validaciones de existencias: ', errorMessage);
            res.status(400).json({message: errorMessage});
        }
        else{
            console.log('Validacion de existencias exitosa');
            //Preparacion de objectos knex a insertar

            errorMessage = '';

            console.log('Creando objeto pedido para insercion');
            let pedido = {
                userId: req.body.userId
            };
            console.log('Creando objeto transaction para insercion');
            let transaction = {
                amount: req.body.amount,
                specialDiscount: req.body.specialDiscount,
                sellerId: req.body.sellerId,
                buyerId: req.body.buyerId,
                timestamp: new Date()
            }
            console.log('Enviando Query INSERT para Pedido');
            let pedidoId = pedidoQueries
                            .pedidos
                            .insert(pedido)
                            .then(data => {
                                //ver si esto es necesario
                                if(!data){
                                    console.log('Error en la insercion de Pedido');
                                    errorMessage += 'No se pudo insertar el Pedido';
                                }
                                return data;
                            })
                            .catch(err => {
                                console.log('Error en Query INSERT de Pedido: ', err);
                                errorMessage+= `Error en Query INSERT de Pedido: ${err}`;
                            });

            let transactionId = pedidoQueries
                            .transactions
                            .insert(transaction)
                            .then(data => {
                                //ver si esto es necesario
                                if(!data){
                                    console.log('Error en la insercion de Transaction');
                                    errorMessage += 'No se pudo insertar el Transaction';
                                }
                                return data;
                            })
                            .catch(err => {
                                console.log('Error en Query INSERT de Transaction: ', err);
                                errorMessage+= `Error en Query INSERT de Transaction: ${err}`;
                            });

            //Realizar logica para determinar el company id segun el type
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

function validarPedido(body){
    const schema = {
        userId: Joi.number().required(),
        amount: Joi.number().required(),
        specialDiscount: Joi.number().allow(null),
        sellerId: Joi.number().required(),
        buyerId: Joi.number().required(),
        products: Joi.array().allow(null),
        packages: Joi.array().allow(null),
        deliveryType: Joi.string().required
    };
    return Joi.validate(body, schema);
}

module.exports = {
    realizarPedido,
    getPedidoById,
    getPedidoByUser,
    getTransactionsByPedidoId
}