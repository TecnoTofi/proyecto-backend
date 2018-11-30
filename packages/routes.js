const Joi = require('joi');
const productQueries = require('../products/dbQueries');
const companyQueries = require('../companies/dbQueries');
const queries = require('./dbQueries');


const getAllPackages = (req, res) => {
    console.log('Conexion GET entrante : /api/packages');

    queries
        .packages
        .getAll()
        .then(data => {
            console.log('Informaicon de Package obtenida');
            res.status(200).json(data);
            })
        .catch(err =>{
            console.log(`Error en Query SELECT a Packages : ${err}`);
            res.status(500).json({message: err});
        });
};

const getAllPackagesByCompany = (req, res) => {
    console.log('Conexion GET entrante : /api/packages');
    let idCompany= req.params.idComp;

    queries
        .packages
        .getAllByCompanyId(idCompany)
        .then(data => {
            console.log('Informacion de Package de comapany obtenida');
            res.status(200).json(data);
            })
        .catch(err =>{
            console.log(`Error en Query SELECT a Packages : ${err}`);
            res.status(500).json({message: err});
        });
};

const getAllProductByPackage = (req, res) => {
    console.log('Conexion GET entrante : /api/packages');
    let idPackage= req.params.id;

    queries
        .packagesProduct
        .getAllById(idPackage)
        .then(data => {
            console.log('Informacion de productos de un packages obtenida');
            res.status(200).json(data);
            })
        .catch(err =>{
            console.log(`Error en Query SELECT a Packages : ${err}`);
            res.status(500).json({message: err});
        });
};

//POST /api/Packages
async function insertPackages(req, res){
    console.log('Conexion POST entrante : /api/insert/package');

    let valPackage = {
        price: req.body.price,
        description: req.body.description,
        companyId:req.body.idCompany
    }

    let {error} = await validarRegistroPackage(valPackage);

    if(!error){

            packageId = await queries
                            .packages
                            .insert(valPackage)
                            .then(id => {
                                console.log('Paquete insertado correctamente');
                                return id;
                            })
                            .catch(err => {
                                console.log(`Error en Query INSERT de Product : ${err}`);
                                res.status(500).json({message: err});
                            });

            if(packageId){
                res.status(201).json({message: 'insertado correctamente'});
            }
            else{
                console.log(`Error inesperado`);
                res.status(500).json({message: 'Error inesperado'});
            }
    }
    else{
        console.log(`Error en la validacion de tipos de dato : ${error.details[0].message}`);
        res.status(400).json({message: error.details[0].message});
    }
    
};

async function updatePackage(req, res){
    console.log('Conexion POST entrante : /api/package/update');
    let idPackage= req.params.idPack;
    console.log('idPackage', idPackage);

    let valPackage = {
        companyId: req.body.companyId,
        description: req.body.description,
        price: req.body.price,
        /*imageName: req.file.filename,
        imagePath: req.file.path*/
    }

    console.log(valPackage);

    let {error} = await validarRegistroPackage(valProduct);

    if(!error){

            queries
                .packages
                .modify(idPackage ,valPackage)
                .then(packageId => {
                    console.log('package modificado correctamente');
                    res.status(201).json(packageId);
                })
                .catch(err => {
                    console.log(`Error en Query Update de package : ${err}`);
                    res.status(500).json({message: err});
                });
        }
    else{
        console.log(`Error en la validacion de tipos de dato : ${error.details[0].message}`);
        res.status(400).json({message: error.details[0].message});
    }
};

async function deletePackage(req, res){
    console.log('Conexion POST entrante : /api/package/delete');
    
    let idPackage= req.params.idPack;
    
    console.log('idPackage', idPackage);

            queries
                .packages
                .delete(idPackage)
                .then(packageId => {
                    console.log('Package eliminado correctamente');
                    res.status(201).json(packageId);
                })
                .catch(err => {
                    console.log(`Error en Query delete de package : ${err}`);
                    res.status(500).json({message: err});
                });
};

async function insertPackageProduct(req, res){
    console.log('Conexion POST entrante : /api/insert/package/product');

    let valPackageProduct = {
        packageId: req.body.packageId,
        productId: req.body.productId,
        quantity:req.body.quantity
    }

    let {error} = await validarRegistroPackageProduct(valPackageProduct);

    if(!error){

            packageProductId = await queries
                            .packagesProduct
                            .insert(valPackageProduct)
                            .then(id => {
                                console.log('Producto insertado correctamente en paquete');
                                return id;
                            })
                            .catch(err => {
                                console.log(`Error en Query INSERT de packageProduct : ${err}`);
                                res.status(500).json({message: err});
                            });

            if(packageProductId){
                res.status(201).json({message: 'insertado correctamente'});
            }
            else{
                console.log(`Error inesperado`);
                res.status(500).json({message: 'Error inesperado'});
            }
    }
    else{
        console.log(`Error en la validacion de tipos de dato : ${error.details[0].message}`);
        res.status(400).json({message: error.details[0].message});
    }
    
};

async function updatePackageProduct(req, res){
    console.log('Conexion POST entrante : /api/package/product/update');
    let idPackageProduct= req.params.idPacProd;
    console.log('idProductPackage', idPackageProduct);

    let valPackageProduct = {
        packageId: req.body.packageId,
        productId: req.body.productId,
        quantity:req.body.quantity
    }

    console.log(valPackageProduct);

    let {error} = await validarRegistroPackageProduct(valPackageProduct);

    if(!error){

            queries
                .packagesProduct
                .modify(idPackageProduct ,valPackageProduct)
                .then(id => {
                    console.log('packageProduct modificado correctamente');
                    res.status(201).json(id);
                })
                .catch(err => {
                    console.log(`Error en Query Update de packageProduct : ${err}`);
                    res.status(500).json({message: err});
                });
        }
    else{
        console.log(`Error en la validacion de tipos de dato : ${error.details[0].message}`);
        res.status(400).json({message: error.details[0].message});
    }
};

async function deletePackageProduct(req, res){
    console.log('Conexion POST entrante : /api/package/product/delete');
    let idPackageProduct= req.params.idPacProd;
    console.log('idProductPackage', idPackageProduct);

            queries
                .packagesProduct
                .delete(idPackageProduct)
                .then(id => {
                    console.log('PackageProduct eliminado correctamente');
                    res.status(201).json(id);
                })
                .catch(err => {
                    console.log(`Error en Query delete de packageProduct : ${err}`);
                    res.status(500).json({message: err});
                });
};

async function insertPackagesCompleto(req, res){
    console.log('Conexion POST entrante : /api/package');

    console.log(req.body);
    // console.log(req.body.products[0]);

    let i = 0;
    while(i < req.body.products.length){
        console.log(req.body.products[i]);
        i++;
    }

    // let valPackage = {
    //     price: req.body.price,
    //     description: req.body.description,
    //     companyId:req.body.companyId,
    //     imageName: req.file.filename,
    //     imagePath: req.file.path
    // }

    // let products = JSON.parse('[' + '{' + req.body.products + '}' + ']');
    // console.log(products);

    // let {error} = await validarRegistroPackage(valPackage);

    // if(!error){

    //     // let {error} = await validarRegistroPackageProduct(valPackageProduct);

    //     if(!error){
    //         packageId = await packageQueries
    //                         .package
    //                         .insert(valPackage)
    //                         .then(id => {
    //                             console.log('Paquete insertado correctamente');
    //                             return id[0];
    //                         })
    //                         .catch(err => {
    //                             console.log(`Error en Query INSERT de Product : ${err}`);
    //                             res.status(500).json({message: err});
    //                         })                
    //         let contadorOk = 0;

    //         for(let prod in products){
                
    //             let valPackageProduct = {
    //                 packageId: packageId,
    //                 productId: products[prod].id,
    //                 quantity: products[prod].cantidad
    //             }
    //             console.log(valPackageProduct);
    //             await packageQueries
    //                 .packageProduct
    //                 .insert(valPackageProduct)
    //                 .then(id => {
    //                     console.log('Producto insertado correctamente en paquete');
    //                     if(id[0]) contadorOk++;
    //                 })
    //                 .catch(err => {
    //                     console.log(`Error en Query INSERT de packageProduct : ${err}`);
    //                     res.status(500).json({message: err});
    //                 });
    //             }

    //         if(contadorOk === req.body.products.length){
    //             res.status(201).json({message: 'insertado correctamente'});
    //         }
    //         else{
    //             console.log(`Error en insert de linea de paquete`);
    //             res.status(500).json({message: 'Error en insert de linea de paquete'});
    //         }
    //     }
    //     else{
    //         console.log(`Error en la validacion de tipos de dato de linea de paquete : ${error.details[0].message}`);
    //         res.status(400).json({message: error.details[0].message});
    //     }
    // }
    // else{
    //     console.log(`Error en la validacion de tipos de dato : ${error.details[0].message}`);
    //     res.status(400).json({message: error.details[0].message});
    // }
};

async function getPackage(packageId){
    console.log(`Buscando paquete con id: ${packageId}`);
    let message = '';
    let package = await queries
                            .companyQueries
                            .getOneById(packageId)
                            .then(data => {
                                //undefined si no existe
                                if(!data) {
                                    console.log(`No existe paquete con id: ${packageId}`);
                                    message += `No existe un paquete con id ${packageId}`;
                                }
                                return data;
                            })
                            .catch(err => {
                                console.log('Error en Query SELECT de Package: ', err);
                                message += `Error en Query SELECT de Package: ${err}`;
                            });
    return { package, message };
}

function reducirStock(id, cantidad){
    console.log('reducir stock', id, cantidad);
}

function validarRegistroPackage(body) {
    const schema = {
        price:Joi.number().required(),
        description: Joi.string().min(3).max(30).required(),
        companyId:Joi.number().required(),
        imageName: Joi.string().min(3).max(150).required(),
        imagePath: Joi.string().min(3).max(150).required()
    };
    return Joi.validate(body, schema);
}

function validarRegistroPackageProduct(body) {
    const schema = {
        packageId:Joi.number().required(),
        productId:Joi.number().required(),
        quantity: Joi.number().required(),
    };
    return Joi.validate(body, schema);
}

module.exports = {
    getAllPackages,
    getAllPackagesByCompany,
    getAllProductByPackage,
    insertPackages,
    updatePackage,
    deletePackage,
    insertPackageProduct,
    updatePackageProduct,
    deletePackageProduct,
    insertPackagesCompleto,
    reducirStock,
    getPackage
};