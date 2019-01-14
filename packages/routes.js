const Joi = require('joi');
const queries = require('./dbQueries');
const { getCompanyById } = require('../companies/routes');
const { getUserByEmail } = require('../users/routes');
const { getCompanyProductById } = require('../products/routes');
const { validarId, getCategoryById } = require('../helpers/routes');

async function obtenerPackages(req, res){
    console.info('Conexion GET entrante : /api/package/');

    let { paquetes, message } = await getPackages();

    if(paquetes){
        console.info(`${paquetes.length} paquetes encontrados`);
        console.info('Preparando response');
        res.status(200).json(paquetes);
    }
    else{
        console.info('No se encontraron productos');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

async function obtenerAllPackages(req, res){
    console.info('Conexion GET entrante : /api/package/all');

    let { paquetes, message } = await getAllPackages();

    if(paquetes){
        console.info(`${paquetes.length} paquetes encontrados`);
        console.info('Preparando response');
        res.status(200).json(paquetes);
    }
    else{
        console.info('No se encontraron paquetes');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

async function obtenerDeletedPackages(req, res){
    console.info('Conexion GET entrante : /api/package/deleted');

    let { paquetes, message } = await getDeletedPackages();

    if(paquetes){
        console.info(`${paquetes.length} paquetes encontrados`);
        console.info('Preparando response');
        res.status(200).json(paquetes);
    }
    else{
        console.info('No se encontraron productos');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

async function obtenerPackagesByCompany(req, res){
    console.info(`Conexion GET entrante : /api/package/company/${req.params.id}`);

    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info(`Comprobando existencia de company ${req.params.id}`);
        let { company, message: companyMessage } = await getCompanyById(req.params.id);

        if(!company){
            console.info(`No existe company con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message: companyMessage});
        }
        else{
            let { companyPackages, message } = await getPackagesByCompany(req.params.id);

            if(companyPackages){
                console.info(`${companyPackages.length} productos encontrados`);
                console.info('Preparando response');
                res.status(200).json(companyPackages);
            }
            else{
                console.info('No se encontraron productos');
                console.info('Preparando response');
                res.status(200).json({message});
            }
        }
    }
}

async function obtenerAllPackagesByCompany(req, res){
    console.info(`Conexion GET entrante : /api/package/company/${req.params.id}/all`);

    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info(`Comprobando existencia de company ${req.params.id}`);
        let { company, message: companyMessage } = await getCompanyById(req.params.id);

        if(!company){
            console.info(`No existe company con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message: companyMessage});
        }
        else{
            let { companyPackages, message } = await getAllPackagesByCompany(req.params.id);
            console.log(companyPackages);

            if(companyPackages){
                console.info(`${companyPackages.length} productos encontrados`);
                console.info('Preparando response');
                res.status(200).json(companyPackages);
            }
            else{
                console.info('No se encontraron productos');
                console.info('Preparando response');
                res.status(200).json({message});
            }
        }
    }
}

async function obtenerDeletedPackagesByCompany(req, res){
    console.info(`Conexion GET entrante : /api/package/company/${req.params.id}/deleted`);

    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info(`Comprobando existencia de company ${req.params.id}`);
        let { company, message: companyMessage } = await getCompanyById(req.params.id);

        if(!company){
            console.info(`No existe company con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message: companyMessage});
        }
        else{
            let { companyPackages, message } = await getDeletedPackagesByCompany(req.params.id);

            if(companyPackages){
                console.info(`${companyPackages.length} productos encontrados`);
                console.info('Preparando response');
                res.status(200).json(companyPackages);
            }
            else{
                console.info('No se encontraron productos');
                console.info('Preparando response');
                res.status(200).json({message});
            }
        }
    }
}

async function obtenerPaqueteById(req, res){
    console.info(`Conexion GET entrante : /api/package/${req.params.id}`);

    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info('Validacion de tipos exitosa');
        console.info(`Yendo a buscar paquete con ID: ${req.params.id}`);
        let { paquete, message } = await getPackageById(req.params.id);

        if(paquete){
            console.info(`Paquete encontrado`);
            console.info('Preparando response');
            res.status(200).json(paquete);
        }
        else{
            console.info('No se encontro paquete');
            console.info('Preparando response');
            res.status(200).json({message});
        }
    }
}

async function obtenerPaqueteByCode(req, res){
    console.info(`Conexion GET entrante : /api/package/code/${req.params.code}`);

    console.info(`Comenzando validacion de tipos`);
    let { error } = validarCode(req.params.code);

    if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        let { paquete, message } = await getPackageByCode(req.params.code);

        if(paquete){
            console.info(`Paquete encontrado`);
            console.info('Preparando response');
            res.status(200).json(paquete);
        }
        else{
            console.info('No se encontro paquete');
            console.info('Preparando response');
            res.status(200).json({message});
        }
    }
}

async function obtenerAllProductsByPackage(req, res) {
    console.info(`Conexion GET entrante : /api/package/${req.params.id}/products`);
}

async function altaPaquete(req, res){
    console.info('Conexion POST entrante : /api/package');
    console.info(req.body);

    // let categories = JSON.parse('[' + req.body.categories + ']');

    let valPackage = {
        code: req.body.code,
        name: req.body.name,
        description: req.body.description,
        stock: req.body.stock,
        price: req.body.price,
        categories: req.body.categories,
        productos: req.body.productos,
        imageName: req.file ? req.file.filename : 'uploads\packages\package.jpg',
        imagePath: req.file ? req.file.path : 'uploads\packages\package.jpg',
    };

    // validacion de tipos
    console.log('Comenzando validacion JOI de request');
    let { error } = validarPackage(valPackage);
    
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

        //Inicializo array de errores
        let errorMessage = [];
        let { user: userByEmail, message: userMessage } = await getUserByEmail(req.body.userEmail);

        if(!userByEmail){
            console.info('Ocurrio un error al buscar el usuario');
            console.info('Preparando response');
            res.status(500).json({message: 'Ocurrio un error con la solicitud'});
        }
        else{
            let { productos, message: messageProductos } = await validarProductos(req.body.productos, userByEmail.companyId);
            let { categories, message: messageCategorias } = await validarCategorias(req.body.categories);
            let { paquete: packageByCode } = await getPackageByCode(valPackage.code);

            if(messageCategorias.length > 0) errorMessage = errorMessage.concat(messageCategorias);
            if(messageProductos.length > 0) errorMessage = errorMessage.concat(messageProductos);
            if(packageByCode) errorMessage.push(`Ya existe un paquete con Codigo ${valPackage.code}`);
            
            if(packageByCode && userByEmail.companyId !== packageByCode.companyId){
                console.info(`Paquete con ID: ${req.params.id} no corresponde con la compania del usuario`);
                console.info('Preparando response');
                res.status(500).json({message: `Paquete con ID: ${req.params.id} no corresponde con la compania del usuario`});
            }
            else{
                if(errorMessage.length > 0){
                    console.info(`Se encontraron ${errorMessage.length} errores de existencia en la request`);
                    errorMessage.map(err => console.log(err));
                    console.info('Enviando response')
                    res.status(400).json({message: errorMessage});
                }
                else{
                    console.log('Validaciones de existencia exitosas');
                    let package = {
                        companyId: userByEmail.companyId,
                        code: valPackage.code,
                        name: valPackage.name,
                        description: valPackage.description,
                        stock: valPackage.stock,
                        imageName: valPackage.imageName,
                        imagePath: valPackage.imagePath,
                        created: new Date(),
                    };
        
                    console.log('Enviando a insertar paquete');
                    let { id: packageId, message: packageMessage } = await insertPackage(package);
        
                    if(packageId){
                        console.log(`Paquete insertado correctamente con ID: ${packageId}`);
        
                        let packCategoryIds = [];
                        let rollback = false;
                        let packCategory = {
                            packageId
                        }
                        console.log(`Comenzando armado e insercion de PackageCategory para paquete ${packageId}`);
                        let i = 0;
                        let categoriesOk = true;
                        while(i < categories.length && categoriesOk){
                            
                            packCategory.categoryId = categories[i].id;

                            console.log('Enviando Query INSERT para PackageCategory');
                            let { id: packageCategoryId, message: packageCategoryMessage} = await insertPackageCategory(packCategory);
        
                            if(!packageCategoryId){
                                console.log(`Fallo insert de PackageCategory con ID: ${packCategory.categoryId}`);
                                errorMessage.push(packageCategoryMessage);
                                rollback = true;
                                categoriesOk = false;
                            }
                            else{
                                console.log(`PackageCategory insertada correctamente con ID: ${packageCategoryId}`);
                                packCategoryIds.push(packageCategoryId);
                            }
                            i++;
                        }

                        console.log(`Comenzando armado e insercion de PackageProduct para paquete ${packageId}`);
                        let packProductIds = [];
                        let productsOk = true;
                        
                        let j = 0;
                        while(j < req.body.productos.length && productsOk){

                            let packageProduct = {
                                productId: req.body.productos[j].id,
                                packageId,
                                quantity: req.body.productos[j].quantity,
                            }
                            j++;

                            console.log('Enviando a insertar PackageProduct');
                            let { id: packageProductId, message: packageProductMessage } = await insertPackageProduct(packageProduct);
                            
                            if(!packageProductId){
                                console.log(`Fallo insert de PackageProduct con product ID: ${packageProduct.productId}`);
                                errorMessage.push(packageProductMessage);
                                rollback = true;
                                productsOk = false;
                            }
                            else{
                                console.log(`PackageProduct insertada correctamente con ID: ${packageProductId}`);
                                packProductIds.push(packageProductId);
                            }
                        }

                        let precio = {
                            price: valPackage.price,
                            packageId,
                            validDateFrom: new Date(),
                        };

                        let { id: priceId, message: priceMessage } = await insertPrice(precio);

                        if(priceId){
                            console.log(`Price insertado correctamente con ID: ${priceId}`);

                            console.log('Paquete finalizado exitosamente');
                            res.status(201).json(packageId);
                        }
                        else{
                            rollback = true;
                            productsOk = false;
                            console.info(`Ocurrio un error al insertar el precio para el paquete ${packageId}`);
                            errorMessage.push(`Ocurrio un error al insertar el precio para el paquete ${packageId}`);
                        }

                        if(rollback){
                            console.log('Ocurrio un error en el proceso de inserts, comenzando rollback');
                            
                            console.log('Comenzando rollbacks de categorias');
                            for(let id of packCategoryIds){
                                console.log(`Enviando rollback de PackageCategory ID: ${id}`);
                                let rollbackPackageCategory = await rollbackInsertPackageCategory(id)
                                if(rollbackPackageCategory.res) console.log(`Rollback de PackageCategory ${id} realizado correctamente`);
                                else console.log(`Ocurrio un error en rollback de PackageCategory ${id}`);
                            }

                            console.log('Comenzando rollbacks de packageProducts');
                            for(let id of packProductIds){
                                console.log(`Enviando rollback de PackageProduct ID: ${id}`);
                                let rollbackPackageProduct = await rollbackInsertPackageCategory(id)
                                if(rollbackPackageProduct.res) console.log(`Rollback de PackageProduct ${id} realizado correctamente`);
                                else console.log(`Ocurrio un error en rollback de PackageProduct ${id}`);
                            }

                            console.log('Comenzando rollbacks de package');
                            let rollbackProduct = await rollbackInsertPackage(packageId);
                            if(rollbackProduct.res) console.log(`Rollback de Package ${packageId} realizado correctamente`);
                            else console.log(`Ocurrio un error en rollback de Package ${packageId}`);
                        }
                    }
                    else{
                        console.info('Error en la insercion de paquete');
                        console.info('Preparando response');
                        res.status(500).json({message: packageMessage});
                    }
                }
            }
        }
    }
}

async function agregarPackageProduct(req, res){
    console.log(`Conexion POST entrante : /api/package/${req.params.id}/product`);

    console.info(`Comenzando validacion de tipos`);
    //let { error } = validarId(req.params.id);

    /*if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{*/

    let valPackageProducts = {
        packageId: req.body.req.params.id,
        productId: req.body.productId,
        quantity: quantity,
    }

    // validacion de tipos
    console.log('Comenzando validacion JOI de request');
    let { error } = validarRegistroPackageProduct(valPackageProducts);
    
    if(error){
        console.log(`Error en la validacion de tipos de datos: ${error.details[0].message}`)
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info('Validaciones de tipo de datos exitosa');
        console.info('Comenzando validaciones de existencia');

        //Inicializo array de errores
        let errorMessage = [];

        let valProducts = await validarProducto(valPackageProducts.productId);
        let valPackage = await getPackageById(valPackageProducts.packageId);
        
        if(valProducts.message) errorMessage.push(valProducts.message);
        if(valPackage.message) errorMessage.push(valPackage.message);


        if(errorMessage.length > 0){
            console.info(`Se encontraron ${errorMessage.length} errores de existencia en la request`);
            errorMessage.map(err => console.log(err));
            console.info('Enviando response')
            res.status(400).json({message: errorMessage});
        }
        else{
            console.log('Validaciones de existencia exitosas');

                console.log('Enviando a insertar packageProduct');
                let packageProduct = await insertPackageProduct(valPackageProducts);

                if(packageProduct.id){
                    console.log(`Producto insertado correctamente con ID: ${packageProduct.id}`);   
                }
                else{
                    console.log(`Error al insertar producto: ${packageProduct.message}`);
                    res.status(500).json({message: packageProduct.message});
                }
        }   
    }
}

async function modificarPaquete(req, res){
    console.info(`Conexion PUT entrante : /api/package/${req.params.id}`);

    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        let { paquete: paqueteById, message: packageMessage } = await getPackageById(req.params.id);

        if(!paqueteById){
            console.info(`No se encontro paquete con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message: packageMessage});
        }
        else{
            console.info('Paquete encontrado, buscando usuario');
            let { user: userByEmail } = await getUserByEmail(req.body.userEmail);

            if(!userByEmail){
                console.info('Ocurrio un error al buscar el usuario');
                console.info('Preparando response');
                res.status(500).json({message: 'Ocurrio un error al procesar la solicitud'});
            }
            else{
                console.info('Usuario encontrado, verificando correspondencia');
                if(userByEmail.companyId !== paqueteById.companyId){
                    console.info('Usuario no corresponde con compania dueña del paquete');
                    console.info('Preparando response');
                    res.status(400).json({message: 'Usuario no corresponde con compania dueña del paquete'});
                }
                else{
                    console.info('Usuario y compania corresponden con el paquete');
                    console.info('Armando paquete para validacion');
                    let valPackage = {
                        code: req.body.code,
                        name: req.body.name,
                        description: req.body.description,
                        stock: req.body.stock,
                        price: req.body.price,
                        categories: req.body.categories,
                        productos: req.body.productos,
                        imageName: req.file ? req.file.filename : req.body.imageName,
                        imagePath: req.file ? req.file.path : req.body.imagePath,
                    };

                    let { error } = validarPackage(valPackage);

                    if(error){
                        console.info('Erorres encontrados en la request');
                        let errores = error.details.map(e => {
                            console.info(e.message);
                            return e.message;
                        });
                        res.status(400).json(errores);
                    }
                    else{
                        console.info('Validacion de request exitosa');
                        console.info('Obteniendo precio actual');
                        let { price: currentPrice } = await getCurrentPrice(req.params.id);

                        if(!currentPrice){
                            console.info('Ocurrio un error al buscar el precio');
                            console.info('Preparando response');
                            res.status(500).json({message: 'Ocurrio un error al procesar la solicitud'});
                        }
                        else {
                            console.info('Precio obtenido');
                            let newPriceId = 0, rollback = false, errorMessage = [];

                            console.info('Obteniendo datos del paquete en caso de rollback');
                            let { paquete: paqueteRollback } = await getPackageRollback(req.params.id);
                            
                            if(!paqueteRollback){
                                console.info('No se pudo obtener el paquete original en caso de rollback');
                                console.info('Preparando response');
                                res.status(500).json({message: 'Ocurrio un error con la solicitud'});
                            }
                            else{
                                if(currentPrice.price !== req.body.price){
                                    console.info('Insertando nuevo precio');
                                    newPriceId = insertPrice({packageId: req.params.id, price: req.body.price, validDateFrom: new Date()});
                                }
                                console.info('Borrando packageProducts viejos');
                                let { result: packProdsResult, message: delPackProdsMessage } = await deletePackageProducts(req.params.id);
                                console.info('Borrando packageCategories viejos');
                                let { result: packCatsResult, message: delPackCatsMessage } = await deletePackageCategories(req.params.id);
                                let packProductIds = [];
                                let packCategoriesIds = [];
    
                                if(packProdsResult){
                                    console.info('PackageProducts viejos borrados');
                                    console.info('Preparandose para insertar nuevos packageProducts');
                                    let productsOk = true;
                                    let i = 0;
                                    while(i < req.body.productos.length && productsOk){
                                        let packageProduct = {
                                            productId: req.body.productos[i].productId,
                                            packageId: req.params.id,
                                            quantity: req.body.productos[i].quantity,
                                        };
    
                                        console.log('Verificando existencia de productos');
                                        let {producto: companyProduct, message: companyProductMessage} = await getCompanyProductById(packageProduct.productId);
    
                                        if(!companyProduct){
                                            console.info(`No existe companyProduct con ID: ${packageProduct.productId}`);
                                            rollback = true;
                                            productsOk = false;
                                            errorMessage.push(companyProductMessage);
                                        }
                                        else if(companyProduct && companyProduct.companyId === userByEmail.companyId){
                                            console.info('Enviando insert PackageProduct');
                                            let { id, message } = await insertPackageProduct(packageProduct);
    
                                            if(id){
                                                console.info(`PackageProduct insertado con ID: ${id}`);
                                                packProductIds.push(id);
                                            }
                                            else{
                                                console.info(`No se pudo insertar el packageProduct, comienza rollback`);
                                                console.info(message);
                                                productsOk = false;
                                                rollback = true;
                                                errorMessage.push(`No se pudo insertar el packageProduct con ID: ${packageProduct.productId}`);
                                            }
                                        }
                                        else{
                                            console.info(`CompanyProduct con ID: ${packageProduct.productId} no corresponde con la compania`);
                                            rollback = true;
                                            productsOk = false;
                                            errorMessage.push(`CompanyProduct con ID: ${packageProduct.productId} no corresponde con la compania`);
                                        }
                                        i++;
                                    }
                                }
                                else{
                                    console.info('Ocurrio un error en el borrado de packageProducts, preparando rollback');
                                    console.info(delPackProdsMessage);
                                    rollback = true;
                                }
    
                                if(packCatsResult){
                                    console.info('PackageCategories viejos borrados');
                                    console.info('Preparandose para insertar nuevos packageCategories');
                                    let categoriesOk = true;
                                    let j = 0;
                                    while(j < req.body.categories.length && categoriesOk){
                                        let packCategory = {
                                            packageId: req.params.id,
                                            categoryId: req.body.categories[j]
                                        };
    
                                        console.info('Verificando existencia de categorias');
                                        let { category, message: categoryMessage } = await getCategoryById(packCategory.categoryId);
    
                                        if(!category){
                                            console.info(`No existe categoria con ID: ${packCategory.categoryId}`);
                                            rollback = true;
                                            productsOk = false;
                                            errorMessage.push(categoryMessage);
                                        }
                                        else{
                                            console.log('Enviando insert PackageCategory');
                                            let { id, message } = await insertPackageCategory(packCategory);
    
                                            if(id){
                                                console.info(`PackageCategory insertado con ID: ${id}`);
                                                packCategoriesIds.push(id);
                                            }
                                            else{
                                                console.info(`No se pudo insertar el PackageCategory con ID: ${packCategory.categoryId}, comienza rollback`);
                                                console.info(message);
                                                categoriesOK = false;
                                                rollback = true;
                                                errorMessage.push(`No se pudo insertar el PackageCategory con ID: ${packCategory.categoryId}`);
                                            }
                                        }
                                        j++;
                                    }
                                }
                                else{
                                    console.info('Ocurrio un error en el borrado de packageCategories, preparando rollback');
                                    console.info(delPackCatsMessage);
                                    rollback = true;
                                }
    
                                let package = {
                                    companyId: userByEmail.companyId,
                                    code: valPackage.code,
                                    name: valPackage.name,
                                    description: valPackage.description,
                                    stock: valPackage.stock,
                                    imageName: valPackage.imageName,
                                    imagePath: valPackage.imagePath
                                };
    
                                let { result: updatePackResult, message: updatePackMessage } = await updatePackage(req.params.id, package);
    
                                if(updatePackResult){
                                    console.info('Paquete modificado con exito');
                                }
                                else{
                                    console.info('Ocurrio un error al actualizar el paquete');
                                    console.info(updatePackMessage);
                                    rollback = true;
                                }
    
                                if(rollback){
                                    console.info('Comenzando rollback');
                                    console.info(`${errorMessage.length} errores encontrados`);
                                    errorMessage.map(e => {
                                        console.info(e);
                                    });
    
                                    console.info('Borrando packageProducts insertados');
                                    let { result: packProdsResult, message: delPackProdsMessage } = await deletePackageProducts(req.params.id);
                                    console.info('Borrando packageCategories insertados');
                                    let { result: packCatsResult, message: delPackCatsMessage } = await deletePackageCategories(req.params.id);
                                    
    
                                    console.log('ver si es iterable');
                                    console.log('paqueteRollback', paqueteRollback);
                                    console.log('productos');
                                    console.log(paqueteRollback.productos);
                                    console.log('categorias');
                                    console.log(paqueteRollback.categorias);
    
                                    for(let p of paqueteRollback.productos){
                                        let prod = {
                                            packageId: p.packageId,
                                            productId: p.productId,
                                            quantity: p.quantity
                                        };
    
                                        let { id, message } = await insertPackageProduct(prod);
    
                                    }
    
                                    for(let c of paqueteRollback.categorias){
                                        let cat = {
                                            packageId: c.packageId,
                                            categoryId: c.categoryId
                                        };
    
                                        let { id, message } = await insertPackageCategory(cat);
    
                                    }
    
                                    let package = {
                                        code: paqueteRollback.code,
                                        name: paqueteRollback.name,
                                        description: paqueteRollback.description,
                                        companyId: paqueteRollback.companyId,
                                        stock: paqueteRollback.stock,
                                        imagePath: paqueteRollback.imagePath,
                                        imageName: paqueteRollback.imageName,
                                        deleted: paqueteRollback.deleted,
                                        created: paqueteRollback.created
                                    }
    
                                    let { result, message } = await updatePackage(req.params.id, package);
    
                                    res.status(500).json({message: errorMessage});
                                }
                                else{
                                    console.info('Modificacion terminada');
                                    console.info('Preparando response');
                                    res.status(200).json('Modificacion completada');
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

async function eliminarPaquete(req, res){
    console.info(`Conexion DELETE entrante : /api/package/${req.params.id}`);

    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info('Comenzando validaciones de existencia');

        let { paquete, message } = await getPackageById(req.params.id);

        if(!paquete){
            console.info(`No existe paquete con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message});
        }
        else{

            let { user, message: userMessage } = await getUserByEmail(req.body.userEmail);
            
            if(!user){
                console.info('Ocurrio un error buscando el usuario');
                console.info('Preparando request');
                res.status(500).json({message: 'Ocurrio un error al procesar la solicitud'});
            }
            else if(user.companyId === paquete.companyId){
                console.info('Enviando request para eliminacion');
                let { result, message } = await deletePackage(req.params.id, new Date());
                
                if(result){
                    console.info(`Package eliminado correctamente con ID: ${req.params.id}`);
                    console.info('Preparando response');
                    res.status(201).json({message});
                }
                else{
                    console.info('No se pudo eliminar Package');
                    console.info('Preparando response');
                    res.status(500).json({message: message});
                }
            }
            else{
                console.info('Paquete no corresponde con la compania del usuario');
                console.info('Preparando responde');
                res.status(400).json({message: 'Paquete no corresponde con la compania del usuario'});
            }
        }
    }
}

async function armarPackage(paquete){
    console.info(`Comenzando armado de paquete con ID: ${paquete.id}`);

    let categories = [], message = '', flag = true;

    
    paquete.imagePath = paquete.imagePath.replace(/\\/g, '/');

    let { company } = await getCompanyById(paquete.companyId);
    if(company) paquete.companyName = company.name;
    else {
        flag = false;
        message = 'Ocurrio un error al obtener los productos';
        console.info('Ocurrio un error obteniendo la company del producto');
    }

    let { price } = await getCurrentPrice(paquete.id);
    if(price){
        paquete.priceId = price.id;
        paquete.price = price.price;
    }
    else{
        flag = false;
        message = 'Ocurrio un error al obtener los paquetes';
        console.info('Ocurrio un error al obtener el precio del paquete');
    }
    
    let { categorias: categoriesIds } = await getPackageCategories(paquete.id);
    if(categoriesIds){
        for(let c of categoriesIds){
            let { category } = await getCategoryById(c.categoryId);
            categories.push(category);
        }
        paquete.categories = categories;
    }
    else{
        flag = false;
        message = 'Ocurrio un problema al buscar los paquetes';
        console.info('Ocurrio un problema al buscar las categorias del paquete');
    }
    //productos

    if(flag) return { paquete, message };
    else return { message };
}

async function getPackages(){
    console.info('Buscando todos los paquetes habilitados');
    let message ='';
    let paquetes = await queries
                        .packages
                        .getPackages()
                        .then(async data => {
                            if(data){
                                console.info('Informacion de paquetes obtenida');
                                let flag = true;
                                for(let p of data){
                                    let { paquete, message: packageMessage } = await armarPackage(p);
                                    if(paquete) p = paquete;
                                    else{
                                        message = packageMessage;
                                        flag = false;
                                    }
                                }

                                if(flag) return data;
                                else return null;
                            }
                            else{
                                console.info('No existen paquetes registrados en la BD');
                                message = 'No existen paquetes registrados en la BD';
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de Package : ${err}`);
                            message = 'Ocurrio un error al obtener los paquetes';
                            return null;
                        });
    return { paquetes , message };
}

async function getAllPackages(){
    console.info('Buscando todos los paquetes');
    let message ='';
    let paquetes = await queries
                        .packages
                        .getAll()
                        .then(async data => {
                            if(data){
                                console.info('Informacion de paquetes obtenida');
                                let flag = true;
                                for(let p of data){
                                    let { paquete, message: packageMessage } = await armarPackage(p);
                                    if(paquete) p = paquete;
                                    else{
                                        message = packageMessage;
                                        flag = false;
                                    }
                                }

                                if(flag) return data;
                                else return null;
                            }
                            else{
                                console.info('No existen paquetes registrados en la BD');
                                message = 'No existen paquetes registrados en la BD';
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de Package : ${err}`);
                            message = 'Ocurrio un error al obtener los paquetes';
                            return null;
                        });
    return { paquetes , message };
}

// async function getAllPackages(){
//     console.info('Buscando todos los paquetes');
//     let message ='';
//     let paquetes = await queries
//                         .packages
//                         .getAllForList()
//                         .then(data => {
//                             if(data.rows){
//                                 console.info(`Informacion de paquetes obtenida`);
//                                 let regex = /\\/g;
//                                 const paquetes = Promise.all(data.rows.map(async paq => {
//                                     paq.imagePath = paq.imagePath.replace(regex, '/');
//                                     return paq;
//                                 }));
//                                 return paquetes;
//                             }
//                             else{
//                                 console.info('No existen paquetes registrados en la BD');
//                                 message = 'No existen paquetes registrados en la BD';
//                                 return null;
//                             }
//                         })
//                         .catch(err => {
//                             console.error(`Error en Query SELECT de Package : ${err}`);
//                             message = 'Ocurrio un error al obtener los paquetes';
//                             return null;
//                         });
//     return { paquetes , message };
// }

async function getDeletedPackages(){
    console.info('Buscando todos los paquetes borrados');
    let message ='';
    let paquetes = await queries
                        .packages
                        .getDeleted()
                        .then(async data => {
                            if(data){
                                console.info('Informacion de paquetes obtenida');
                                let flag = true;
                                for(let p of data){
                                    let { paquete, message: packageMessage } = await armarPackage(p);
                                    if(paquete) p = paquete;
                                    else{
                                        message = packageMessage;
                                        flag = false;
                                    }
                                }

                                if(flag) return data;
                                else return null;
                            }
                            else{
                                console.info('No existen paquetes borrados registrados en la BD');
                                message = 'No existen paquetes borrados registrados en la BD';
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de Package : ${err}`);
                            message = 'Ocurrio un error al obtener los paquetes';
                            return null;
                        });
    return { paquetes , message };
}

async function getPackagesByCompany(id){
    console.info(`Buscando todos los paquetes habilitados de la compania con id : ${id}`);
    let message ='';
    let companyPackages = await queries
                        .packages
                        .getByCompany(id)
                        .then(async data => {
                            if(data){
                                console.info(`Informacion de paquetes habilitados de la compania con id : ${id},  obtenida`);
                                let flag = true;
                                for(let p of data.rows){
                                    let { paquete, message: packageMessage } = await armarPackage(p);
                                    if(paquete) p = paquete;
                                    else{
                                        message = packageMessage;
                                        flag = false;
                                    }
                                }

                                if(flag) return data.rows;
                                else return null;
                            }
                            else{
                                console.info(`No existen paquetes habilitados para la compania con id : ${id}, registrados en la BD`);
                                message = `No existen paquetes habilitados para la compania con id : ${id}, registrados en la BD`;
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de Package : ${err}`);
                            message = 'Ocurrio un error al obtener los paquetes habilitados de la compania';
                            return null;
                        });
    return { companyPackages , message };
}

// async function getPackagesByCompanyList(id){
//     console.info(`Buscando todos los paquetes habilitados de la compania con id : ${id}`);
//     let message ='';
//     let CompanyPackages = await queries
//                         .packages
//                         .getForListHabilitadosByCompany(id)
//                         .then(data => {
//                             if(data.rows){
//                                 console.info(`Informacion de paquetes habilitados de la compania con id : ${id},  obtenida`);
//                                 let regex = /\\/g;
//                                 const paquetes = Promise.all(data.rows.map(async paq => {
//                                     paq.imagePath = paq.imagePath.replace(regex, '/');
//                                     return paq;
//                                 }));
//                                 paquetes                            
//                             }
//                             else{
//                                 console.info(`No existen paquetes habilitados para la compania con id : ${id}, registrados en la BD`);
//                                 message = `No existen paquetes habilitados para la compania con id : ${id}, registrados en la BD`;
//                                 return null;
//                             }
//                         })
//                         .catch(err => {
//                             console.error(`Error en Query SELECT de Package : ${err}`);
//                             message = 'Ocurrio un error al obtener los paquetes habilitados de la compania';
//                             return null;
//                         });
//     return { CompanyPackages , message };
// }

async function getAllPackagesByCompany(id){
    console.info(`Buscando todos los paquetes de la compania con id : ${id}`);
    let message ='';
    let companyPackages = await queries
                        .packages
                        .getAllByCompany(id)
                        .then(async data => {
                            if(data){
                                console.info(`Informacion de paquetes de la compania con id : ${id},  obtenida`);
                                let flag = true;
                                for(let p of data){
                                    let { paquete, message: packageMessage } = await armarPackage(p);
                                    if(paquete) p = paquete;
                                    else{
                                        message = packageMessage;
                                        flag = false;
                                    }
                                }

                                if(flag) return data;
                                else return null;
                            }
                            else{
                                console.info(`No existen paquetes para la compania con id : ${id}, registrados en la BD`);
                                message = `No existen paquetes para la compania con id : ${id}, registrados en la BD`;
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de Package : ${err}`);
                            message = 'Ocurrio un error al obtener los paquetes de la compania';
                            return null;
                        });
    return { companyPackages , message };
}

// async function getAllPackagesByCompanyList(id){
//     console.info(`Buscando todos los paquetes de la compania con id : ${id}`);
//     let message ='';
//     let CompanyPackages = await queries
//                         .packages
//                         .getAllForListByCompany(id)
//                         .then(data => {
//                             if(data.rows){
//                                 console.info(`Informacion de paquetes de la compania con id : ${id},  obtenida`);
//                                 let regex = /\\/g;
//                                 const paquetes = Promise.all(data.rows.map(async paq => {
//                                     paq.imagePath = paq.imagePath.replace(regex, '/');
//                                     return paq;
//                                 }));
//                                 paquetes                            
//                             }
//                             else{
//                                 console.info(`No existen paquetes para la compania con id : ${id}, registrados en la BD`);
//                                 message = `No existen paquetes para la compania con id : ${id}, registrados en la BD`;
//                                 return null;
//                             }
//                         })
//                         .catch(err => {
//                             console.error(`Error en Query SELECT de Package : ${err}`);
//                             message = 'Ocurrio un error al obtener los paquetes de la compania';
//                             return null;
//                         });
//     return { CompanyPackages , message };
// }

async function getDeletedPackagesByCompany(id){
    console.info(`Buscando todos los paquetes eliminados de la compania con id : ${id}`);
    let message ='';
    let companyPackages = await queries
                        .packages
                        .getDeleteByCompany(id)
                        .then(async data => {
                            if(data){
                                console.info(`Informacion de paquetes eliminados de la compania con id : ${id},  obtenida`);
                                let flag = true;
                                for(let p of data){
                                    let { paquete, message: packageMessage } = await armarPackage(p);
                                    if(paquete) p = paquete;
                                    else{
                                        message = packageMessage;
                                        flag = false;
                                    }
                                }

                                if(flag) return data;
                                else return null;
                            }
                            else{
                                console.info(`No existen paquetes eliminados para la compania con id : ${id}, registrados en la BD`);
                                message = `No existen paquetes eliminados para la compania con id : ${id}, registrados en la BD`;
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de Package : ${err}`);
                            message = 'Ocurrio un error al obtener los paquetes eliminados de la compania';
                            return null;
                        });
    return { companyPackages , message };
}

// async function getDeletedPackagesByCompanyList(id){
//     console.info(`Buscando todos los paquetes eliminados de la compania con id : ${id}`);
//     let message ='';
//     let CompanyPackages = await queries
//                         .packages
//                         .getForDeleteListByCompany(id)
//                         .then(data => {
//                             if(data.rows){
//                                 console.info(`Informacion de paquetes eliminados de la compania con id : ${id},  obtenida`);
//                                 let regex = /\\/g;
//                                 const paquetes = Promise.all(data.rows.map(async paq => {
//                                     paq.imagePath = paq.imagePath.replace(regex, '/');
//                                     return paq;
//                                 }));
//                                 paquetes                            
//                             }
//                             else{
//                                 console.info(`No existen paquetes eliminados para la compania con id : ${id}, registrados en la BD`);
//                                 message = `No existen paquetes eliminados para la compania con id : ${id}, registrados en la BD`;
//                                 return null;
//                             }
//                         })
//                         .catch(err => {
//                             console.error(`Error en Query SELECT de Package : ${err}`);
//                             message = 'Ocurrio un error al obtener los paquetes eliminados de la compania';
//                             return null;
//                         });
//     return { CompanyPackages , message };
// }

async function getPackageById(id){
    console.info(`Buscando paquete con id: ${id}`);
    let message = '';
    let paquete = await queries
                    .packages
                    .getOneById(id)
                    .then(async data => {
                        if(data){
                            console.info('Informacion de paquete obtenida');
                            let flag = true;
                            let { paquete, message: packageMessage } = await armarPackage(data);
                            if(paquete) data = paquete;
                            else{
                                message = packageMessage;
                                flag = false;
                            }

                            if(flag) return data;
                            else return null;
                        }
                        else{
                            console.info(`No existe paquete con ID: ${id}`);
                            message = `No existe un paquete con ID ${id}`;
                            return null;
                        }
                    })
                    .catch(err => {
                        console.error(`Error en Query SELECT de Package : ${err}`);
                        message = 'Ocurrio un error al obtener el paquete';
                        return null;
                    });
    return { paquete, message };
}

async function getPackageRollback(id){
    console.info(`Buscando paquete con id: ${id} para rollback`);
    let message = '';
    let paquete = await queries
                    .packages
                    .getOneById(id)
                    .then(async package => {
                        if(package){
                            console.info(`Paquete con ID: ${id} encontrado, armando`);
                            let { productos, message: prodMessage } = await getAllProductsByPackage(id);
                            let { categorias, message: catMessage } = await getPackageCategories(id);

                            if(productos && productos.length > 0){
                                package.productos = productos;
                            }
                            else{
                                message = prodMessage;
                                return null;
                            }

                            if(categorias && categorias.length > 0){
                                package.categorias = categorias;
                            }
                            else{
                                message = catMessage;
                                return null;
                            }

                            console.info("package", package);
                            return package;
                        }
                        else{
                            console.info(`No existe paquete con ID: ${id}`);
                            message = `No existe un paquete con ID ${id}`;
                            return null;
                        }
                    })
                    .catch(err => {
                        console.error(`Error en Query SELECT de Package : ${err}`);
                        message = 'Ocurrio un error al obtener el paquete';
                        return null;
                    });
    return { paquete, message };
}

// async function getPackageByIdList(id){
//     console.info(`Buscando paquete con id: ${id}`);
//     let message = '';
//     let paquete = await queries
//                     .packages
//                     .getOneByIdList(id)
//                     .then(data => {
//                         if(data.rows){
//                             console.info(`paquete con ID: ${id} encontrado`);
//                             let regex = /\\/g;
//                             const paquetes = Promise.all(data.rows.map(async paq => {
//                                 paq.imagePath = paq.imagePath.replace(regex, '/');
//                                 return paq;
//                             }));
//                             paquetes                            
//                         }
//                         else{
//                             console.info(`No existe paquete con id: ${id}`);
//                             message = `No existe un paquete con id ${id}`;
//                             return null;
//                         }
//                     })
//                     .catch(err => {
//                         console.error(`Error en Query SELECT de Package : ${err}`);
//                         message = 'Ocurrio un error al obtener el paquete';
//                         return null;
//                     });
//     return { paquete, message };
// }

async function getPackageByCode(code){
    console.info(`Buscando paquete con codigo: ${code}`);
    let message = '';
    let paquete = await queries
                    .packages
                    .getOneByCode(code)
                    .then(async data => {
                        if(data){
                            console.info(`Paquete con Codigo: ${code} encontrado`);
                            let flag = true;
                            let { paquete, message: packageMessage } = await armarPackage(data);
                            if(paquete) data = paquete;
                            else{
                                message = packageMessage;
                                flag = false;
                            }

                            if(flag) return data;
                            else return null;
                        }
                        else{
                            console.info(`No existe paquete con codigo: ${code}`);
                            message = `No existe un paquete con codigo ${code}`;
                            return null;
                        }
                    })
                    .catch(err => {
                        console.error(`Error en Query SELECT de Package : ${err}`);
                        message = 'Ocurrio un error al obtener el paquete';
                        return null;
                    });
    return { paquete, message };
}

// async function getPackageByCodeList(code){
//     console.info(`Buscando paquete con codigo: ${code}`);
//     let message = '';
//     let paquete = await queries
//                     .packages
//                     .getOneByCode(code)
//                     .then(data => {
//                         if(data,rows){
//                             console.info(`Paquete con Codigo: ${code} encontrado`);
//                             let regex = /\\/g;
//                             const paquetes = Promise.all(data.rows.map(async paq => {
//                                 paq.imagePath = paq.imagePath.replace(regex, '/');
//                                 return paq;
//                             }));
//                             paquetes                            
//                         }
//                         else{
//                             console.info(`No existe paquete con codigo: ${code}`);
//                             message = `No existe un paquete con codigo ${code}`;
//                             return null;
//                         }
//                     })
//                     .catch(err => {
//                         console.error(`Error en Query SELECT de Package : ${err}`);
//                         message = 'Ocurrio un error al obtener el paquete';
//                         return null;
//                     });
//     return { paquete, message };
// }

async function getAllProductsByPackage (id){
    console.info(`Buscando productos del paquete con id: ${id}`);
    let message = '';

    let productos = await queries
                    .packageProduct
                    .getAllById(id)
                    .then(data => {
                        if(data){
                            console.info(`Productos del paquete con id: ${id} encontrado`);
                            return data;
                        }
                        else{
                            console.info(`No existe productos para el paquete con id: ${id}`);
                            message = `No existe productos para el paquete con id: ${id}`;
                            return null;
                        }
                    })
                    .catch(err => {
                        console.error(`Error en Query SELECT de PackageProduct : ${err}`);
                        message = 'Ocurrio un error al obtener los productos  del paquete';
                        return null;
                    });
    return { productos, message };
};

async function getPackageCategories(id){
    console.info(`Buscando categorias del paquete con id: ${id}`);
    let message = '';
    let categorias = await queries
                    .packCategory
                    .getByPackageId(id)
                    .then(categories => {
                        if(categories){
                            console.info(`Categorias del paquete con id: ${id} encontrado`);
                            return categories;
                        }
                        else{
                            console.info(`No existe productos para el paquete con id: ${id}`);
                            message = `No existe productos para el paquete con id: ${id}`;
                            return null;
                        }
                    })
                    .catch(err => {
                        console.error(`Error en Query SELECT de PackageProduct : ${err}`);
                        message = 'Ocurrio un error al obtener los productos  del paquete';
                        return null;
                    });
    return { categorias, message };
}

async function insertPackage(paquete){
    console.info('Comenzando insert de Package');
    let message = '';
    let id = await queries
                        .packages
                        .insert(paquete)
                        .then(id => {
                            if(id){
                                console.info(`Insert de Package existoso con ID: ${id[0]}`);
                                return id[0];
                            }
                            else{
                                console.info('Ocurrio un error');
                                message = 'Ocurrio un error al intertar dar de alta';
                                return 0;
                            }
                            
                        })
                        .catch(err => {
                            console.error(`Error en Query INSERT de Package: ${err}`);
                            message = 'Ocurrio un error al intertar dar de alta';
                            return 0;
                        });
    return { id, message };
}

async function insertPackageProduct(producto){
    console.info('Comenzando insert de PackageProduct');
    let message = '';
    let id = await queries
                        .packageProduct
                        .insert(producto)
                        .then(id => {
                            if(id){
                                console.info(`Insert de PackageProduct existoso con ID: ${id[0]}`);
                                return id[0];
                            }
                            else{
                                console.info('Ocurrio un error');
                                message = 'Ocurrio un error al intertar dar de alta';
                                return 0; 
                            }
                            
                        })
                        .catch(err => {
                            console.error(`Error en Query INSERT de PackageProduct: ${err}`);
                            message = 'Ocurrio un error al intertar dar de alta';
                            return 0;
                        });
    return { id, message };
}

async function insertPackageCategory(packCategory){
    console.info('Comenzando insert de PackageCategory');
    let message = '';
    let id = await queries
                    .packCategory
                    .insert(packCategory)
                    .then(id => {
                            if(id){
                             console.info(`Insert de PackageCategory existoso con ID: ${id[0]}`);
                             return id[0];
                            }
                            else{
                                console.info('Ocurrio un error');
                                message = 'Ocurrio un error al intertar dar de alta';
                                return 0; 
                            }
                    })
                    .catch(err => {
                            console.error(`Error en Query INSERT de ProdCategory : ${err}`);
                            message = 'Ocurrio un error al intertar dar de alta';
                            return 0;
                    });
    return { id, message };
}

async function insertPrice(price){
    console.info('Comenzando insert de Price');
    let message = '';
    let id = await queries
                        .prices
                        .insert(price)
                        .then(id => {
                            console.log('insertprice', id);
                            if(id){
                                console.info(`Insert de Price existoso con ID: ${id[0]}`);
                                return id[0];
                            }
                            else{
                                console.info('Ocurrio un error');
                                message = 'Ocurrio un error al intertar dar de alta';
                                return 0; 
                            }
                            
                        })
                        .catch(err => {
                            console.error(`Error en Query INSERT de Price: ${err}`);
                            message = 'Ocurrio un error al intertar dar de alta';
                            return 0;
                        });
    return { id, message };
}

async function updatePackage(id, paquete){
    console.info('Comenzando update de Package');
    let message = '';
    let result = await queries
                .packages
                .modify(id, paquete)
                .then(res => {
                    if(res){
                        console.info(`Update de Package con ID: ${id} existoso`);
                        return res;
                    }
                    else{
                        console.info('Ocurrio un error');
                        message = 'Ocurrio un error al intertar modificar';
                        return 0;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query UPDATE de Package: ${err}`);
                    message = 'Ocurrio un error al intertar modificar';
                    return 0;
                });
    return { result, message };
}

async function updatePackageProduct(id, paquete){
    console.info('Comenzando update de PackageProduct');
    let message = '';
    let result = await queries
                .packageProduct
                .modify(id, paquete)
                .then(res => {
                    if(res){
                        console.info(`Update de PackageProduct con ID: ${id} existoso}`);
                        return res;
                    }
                    else{
                        console.info('Ocurrio un error');
                        message = 'Ocurrio un error al intertar modificar';
                        return 0;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query UPDATE de PackageProduct: ${err}`);
                    message = 'Ocurrio un error al intertar modificar';
                    return 0;
                });
    return { result, message };
}

async function deletePackage(id, date){
    console.info('Comenzando delete de Package');
    let message = '';
    let result = await queries
                .packages
                .delete(id, date)
                .then(res => {
                    if(res){
                        console.info(`Delete de Package existoso con ID: ${id}`);
                        message = `Package con ID:${id} eliminado correctamente`;
                        return res;
                    }
                    else{
                        console.info('Ocurrio un error');
                        message = 'Ocurrio un error al intertar eliminar el paquete';
                        return 0;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query Delete de Package: ${err}`);
                    message = 'Ocurrio un error al intertar eliminar el Package';
                    return 0;
                });
    return { result, message };
}

async function deletePackageProducts(id){
    console.info(`Comenzando delete de PackageProducts para el package ${id}`);
    let message = '';
    let result = await queries
                .packageProduct
                .deleteByPackage(id)
                .then(res => {
                    console.log('resdeletepackageproducts', res);
                    if(res){
                        console.info(`Delete de PackageProducts existoso para el package ID: ${id}`);
                        message = `PackageProducts para paquete ${id} eliminados correctamente`;
                        return res;
                    }
                    else{
                        console.info('Ocurrio un error');
                        message = 'Ocurrio un error al intertar eliminar los packageProducts';
                        return 0;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query Delete de PackageProducts: ${err}`);
                    message = 'Ocurrio un error al intertar eliminar los packageProducts';
                    return 0;
                });
    return { result, message };
}

async function deletePackageCategories(id){
    console.info(`Comenzando delete de PackageCategories para el package ${id}`);
    let message = '';
    let result = await queries
                .packCategory
                .deleteByPackage(id)
                .then(res => {
                    console.log('resdeletepackagecategories', res);
                    if(res){
                        console.info(`Delete de PackageCategories existoso para el package ID: ${id}`);
                        message = `PackageCategories para paquete ${id} eliminados correctamente`;
                        return res;
                    }
                    else{
                        console.info('Ocurrio un error');
                        message = 'Ocurrio un error al intertar eliminar los PackageCategories';
                        return 0;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query Delete de PackageCategory: ${err}`);
                    message = 'Ocurrio un error al intertar eliminar los PackageCategories';
                    return 0;
                });
    return { result, message };
}

async function rollbackInsertPackage(id){
    let message = '';
    let res = await queries
                    .packages
                    .delete(id)
                    .then(data => {
                        return data;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de Paquete: ', err);
                        message += `Error en Query DELETE de Paquete: ${err}`;
                    });
    return { res, message };
}

async function rollbackInsertPackageProduct(id){
    let message = '';
    let res = await queries
                    .packageProduct
                    .delete(id)
                    .then(data => {
                        return data;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de PackageProduct: ', err);
                        message += `Error en Query DELETE de PackageProduct: ${err}`;
                    });
    return { res, message };
}

async function rollbackInsertPackageCategory(id){
    let message = '';
    let res = await queries
                    .packCategory
                    .delete(id)
                    .then(data => {
                        return data;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de PackageCategory: ', err);
                        message += `Error en Query DELETE de PackageCategory: ${err}`;
                    });
    return { res, message };
}

async function rollbackInsertPrice(id){
    let message = '';
    let res = await queries
                    .prices
                    .delete(id)
                    .then(data => {
                        // console.log(`Rollback de Pedido ${id} realizado correctamente: ${data}`);
                        return data;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de Price: ', err);
                        message += `Error en Query DELETE de Price: ${err}`;
                    });
    return { res, message };
}

async function buscarCategoryInPackage(idPack, idCat){
    console.info(`Buscando categorias en paquete con id: ${idPack}`);
    let message = '';
    let category = await queries
                    .packCategory
                    .getByPackageIdByCategoryId(idPack,idCat)
                    .then(data => {
                        if(data.rowCount){
                            console.info(`Categoria con ID: ${idCat} encontrada en paquete con id: ${idPack}`);
                            return data.rows;
                        }
                        else{
                            console.info(`No existe categoria con id: ${idCat} en paquete con id: ${idPack}`);
                            message = `No existe categoria con id: ${idCat} en paquete con id: ${idPack}`;
                            return null;
                        }
                    })
                    .catch(err => {
                        console.error(`Error en Query SELECT de Price : ${err}`);
                        message = 'Ocurrio un error al obtener el precio';
                        return null;
                    });
    return { category, message };
}

async function buscarProductInPackage(idPack, idPro){
    console.info(`Buscando companyProducts en paquete con id: ${idPack}`);
    let message = '';
    let producto = await queries
                    .packageProduct
                    .getByPackageIdProductId(idPack,idPro)
                    .then(data => {
                        if(data.rowCount){
                            console.info(`Producto con ID: ${idPro} encontrada en paquete con id: ${idPack}`);
                            return data.rows;
                        }
                        else{
                            console.info(`No existe producto con id: ${idPro} en paquete con id: ${idPack}`);
                            message = `No existe producto con id: ${idPro} en paquete con id: ${idPack}`;
                            return null;
                        }
                    })
                    .catch(err => {
                        console.error(`Error en Query SELECT de PackageProduct : ${err}`);
                        message = 'Ocurrio un error al obtener el PackageProduct';
                        return null;
                    });
    return { producto, message };
}

async function getPriceById(id){
    console.info(`Buscando precio con ID: ${id}`);
    let message = '';
    let price = await queries
                .prices
                .getOneById(id)
                .then(data => {
                    if(data) {
                        console.info(`Precio con ID: ${id} encontrado`);
                        return data;
                    }
                    else{
                        console.info(`No existe precio con ID: ${id}`);
                        message = `No existe un precio con ID ${id}`;
                        return null;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query SELECT de ProductPrice: ${err}`);
                    message = 'Ocurrio un error al obtener el precio';
                });
    return { price, message };
}

async function getCurrentPrice(id){
    console.info(`Buscando precio actual para paquete con ID: ${id}`);
    let message = '';
    let price = await queries
                .prices
                .getCurrent(id)
                .then(data => {
                    if(data) {
                        console.info(`Precio con ID: ${id} encontrado`);
                        return data.rows[0];
                    }
                    else{
                        console.info(`No existe precio con ID: ${id}`);
                        message = `No existe un precio con ID ${id}`;
                        return null;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query SELECT de ProductPrice: ${err}`);
                    message = 'Ocurrio un error al obtener el precio';
                });
    return { price, message };
}

async function getLastPrices(id){
    console.info(`Buscando precio con ID: ${id}`);
    let message = '';
    let prices = await queries
                .prices
                .getLast(id)
                .then(data => {
                    if(data) {
                        console.info(`Precio con ID: ${id} encontrado`);
                        return data;
                    }
                    else{
                        console.info(`No existe precio con ID: ${id}`);
                        message = `No existe un precio con ID ${id}`;
                        return null;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query SELECT de ProductPrice: ${err}`);
                    message = 'Ocurrio un error al obtener el precio';
                });
    return { prices, message };
}

async function reducirStock(id, cantidad){
    console.log(`Comenzando reduccion de stock para paquete con ID: ${id}, cantidad a reducir: ${cantidad}`);

    let busPack = await getPackageById(id);

    if(!busPack.package){
        console.log('Error al obtener paquete para reducir');
        return false;
    }

    console.log('Reduciendo cantidad');
    busPack.package.stock = busPack.package.stock - cantidad;
    let reducido = false;
    console.log('Enviando Query UPDATE');
    await queries
        .packages
        .modify(id, busPack.package)
        .then(data => {
            if(data){
                reducido = true;
                console.log('Query UPDATE exitosa');
            }
        })
        .catch(err => {
            console.log(`Error en Query UPDATE de Package: ${err}`);
        });
        
    return reducido;
}

function validarCode(code){
    const schema = Joi.string().required();

    return Joi.validate(code, schema);
}

async function validarCategorias(categorias){
    console.log('Iniciando validacion de categorias');
    
    let message = [];
    let categories = [];

    for(let cat of categorias){
        let { category, message: categoryMessage } = await getCategoryById(cat);

        if(categoryMessage.length > 0) message.push(categoryMessage);
        else categories.push(category);
    };
    return { categories, message };
}

async function validarProductos(products, companyId){
    console.log('Iniciando validacion de productos');
    
    let message = [];
    let productos = [];

    for(let prod of products){
        let { producto, message: productMessage } = await getCompanyProductById(prod.id);

        if(!producto) message.push(productMessage);
        else if(Number(producto.companyId) !== Number(companyId)) message.push(`Producto ${producto.id} no corresponde con compania ${companyId}`);
        else productos.push({'productId': producto.id, 'quantity': prod.quantity});
    };
    return { productos, message };
}

async function validarProducto(id){
    console.log('Iniciando validacion de productos');
    
    let message = '';
    let producto = await getCompanyProductById(id)
                        .then(res => {
                        if(!res){
                                console.log(`CompanyProduct no encontrado con ID: ${id}`);
                                message += `CompanyProduct no encontrado con ID: ${id}`;
                                return null;
                            }
                            else{
                                console.log(`CompanyProduct encontrado con ID: ${id}`);
                                return res;
                            }
                        })
                        .catch(err => {
                            console.log(`Error en la Query SELECT de CompanyProduct : ${err}`);
                            message += `Error en la Query SELECT de CompanyProduct : ${err}`;
                            // res.status(500).json({message: err});
                        });
    return { producto, message };
}

/*
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
    console.log(`Conexion GET entrante : /api/package/${req.params.id}`);
    // let idCompany= req.params.idComp;

    queries
        .packages
        .getByCompanyId(req.params.id)
        .then(data => {
            //agregar revision de undefined
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
        imagePath: req.file.path
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
                            .packages
                            .getOneById(packageId)
                            .then(data => {
                                //undefined si no existe
                                if(!data) {
                                    console.log(`No existe paquete con id: ${packageId}`);
                                    message += `No existe un paquete con id ${packageId}`;
                                }
                                else console.log(`Paquete con ID: ${packageId} encontrado`);
                                return data;
                            })
                            .catch(err => {
                                console.log('Error en Query SELECT de Package: ', err);
                                message += `Error en Query SELECT de Package: ${err}`;
                            });
    return { package, message };
}
*/

function validarPackage(body) {
    const schema = {
        code: Joi.string().required(),
        name: Joi.string().min(3).max(30).required(),
        description: Joi.string().min(3).max(30).required(),
        stock: Joi.number().required(),
        price: Joi.number().required(),
        categories: Joi.array().required(),
        productos: Joi.array().required(),
        imageName: Joi.string().min(3).max(150).required(),
        imagePath: Joi.string().min(3).max(150).required(),
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
    obtenerPackages,
    obtenerAllPackages,
    obtenerDeletedPackages,
    obtenerPackagesByCompany,
    obtenerAllPackagesByCompany,
    obtenerDeletedPackagesByCompany,
    //
    obtenerPaqueteById,
    obtenerPaqueteByCode,
    obtenerAllProductsByPackage,
    altaPaquete,
    agregarPackageProduct,
    modificarPaquete,
    eliminarPaquete,
    getPriceById,
    getCurrentPrice,
    getLastPrices,
    reducirStock,
};