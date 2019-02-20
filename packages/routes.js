//Incluimos Joi para validaciones
const Joi = require('joi');
//Incluimos queries de DB
const queries = require('./dbQueries');
//Incluimos funciones de companies
const { getCompanyById } = require('../companies/routes');
//Incluimos funciones de users
const { getUserByEmail } = require('../users/routes');
//Incluimos funciones de helpers
const { validarId, getCategoryById } = require('../helpers/routes');
//Incluimos funciones de products
const { getCompanyProductById } = require('../products/routes');

//Endpoint para obtener todos los paquetes no borrados
async function obtenerPackages(req, res){
    console.info('Conexion GET entrante : /api/package/');

    //Obtenemos los datos
    let { paquetes, message } = await getPackages();

    if(paquetes){
        //Retornamos los datos
        console.info(`${paquetes.length} paquetes encontrados`);
        console.info('Preparando response');
        res.status(200).json(paquetes);
    }
    else{
        //Si fallo, damos error
        console.info('No se encontraron productos');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

//Endpoint para obtener todos los paquetes borrados y no borrados
async function obtenerAllPackages(req, res){
    console.info('Conexion GET entrante : /api/package/all');

    //Obtenemos los datos
    let { paquetes, message } = await getAllPackages();

    if(paquetes){
        //Retornamos los datos
        console.info(`${paquetes.length} paquetes encontrados`);
        console.info('Preparando response');
        res.status(200).json(paquetes);
    }
    else{
        //Si fallo, damos error
        console.info('No se encontraron paquetes');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

//Endpoint para obtener todos los paquetes borrados
async function obtenerDeletedPackages(req, res){
    console.info('Conexion GET entrante : /api/package/deleted');

    //Obtenemos los datos
    let { paquetes, message } = await getDeletedPackages();

    if(paquetes){
        //Retornamos los datos
        console.info(`${paquetes.length} paquetes encontrados`);
        console.info('Preparando response');
        res.status(200).json(paquetes);
    }
    else{
        //Si fallo, damos error
        console.info('No se encontraron productos');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

//Endpoint para obtener todos los paquetes no borrados de una compania
async function obtenerPackagesByCompany(req, res){
    console.info(`Conexion GET entrante : /api/package/company/${req.params.id}`);

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
        //Obtenemos la company
        console.info(`Comprobando existencia de company ${req.params.id}`);
        let { company, message: companyMessage } = await getCompanyById(req.params.id);

        if(!company){
            //Si no se encuentra, retornamos error
            console.info(`No existe company con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message: companyMessage});
        }
        else{
            //Obtenemos los datos
            let { companyPackages, message } = await getPackagesByCompany(req.params.id);

            if(companyPackages){
                //Retornamos los datos
                console.info(`${companyPackages.length} paquetes encontrados`);
                console.info('Preparando response');
                res.status(200).json(companyPackages);
            }
            else{
                //Si fallo damos error
                console.info('No se encontraron paquetes');
                console.info('Preparando response');
                res.status(200).json({message});
            }
        }
    }
}

//Endpoint para obtener todos los paquetes de una compania
async function obtenerAllPackagesByCompany(req, res){
    console.info(`Conexion GET entrante : /api/package/company/${req.params.id}/all`);

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
        //Obtenemos la company
        console.info(`Comprobando existencia de company ${req.params.id}`);
        let { company, message: companyMessage } = await getCompanyById(req.params.id);

        if(!company){
            //Si no se encuentra, retornamos error
            console.info(`No existe company con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message: companyMessage});
        }
        else{
            //Obtenemos los datos
            let { companyPackages, message } = await getAllPackagesByCompany(req.params.id);
            console.log(companyPackages);

            if(companyPackages){
                //Retornamos los datos
                console.info(`${companyPackages.length} productos encontrados`);
                console.info('Preparando response');
                res.status(200).json(companyPackages);
            }
            else{
                //Si fallo damos error
                console.info('No se encontraron productos');
                console.info('Preparando response');
                res.status(200).json({message});
            }
        }
    }
}

//Endpoint para obtener todos los paquetes borrados de una compania
async function obtenerDeletedPackagesByCompany(req, res){
    console.info(`Conexion GET entrante : /api/package/company/${req.params.id}/deleted`);

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
        //Obtenemos la company
        console.info(`Comprobando existencia de company ${req.params.id}`);
        let { company, message: companyMessage } = await getCompanyById(req.params.id);

        if(!company){
            //Si no se encuentra, retornamos error
            console.info(`No existe company con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message: companyMessage});
        }
        else{
            //Obtenemos los datos
            let { companyPackages, message } = await getDeletedPackagesByCompany(req.params.id);

            if(companyPackages){
                //Retornamos los datos
                console.info(`${companyPackages.length} productos encontrados`);
                console.info('Preparando response');
                res.status(200).json(companyPackages);
            }
            else{
                //Si fallo damos error
                console.info('No se encontraron productos');
                console.info('Preparando response');
                res.status(200).json({message});
            }
        }
    }
}

//Endpoint para obtener paquete filtrado por Id
async function obtenerPaqueteById(req, res){
    console.info(`Conexion GET entrante : /api/package/${req.params.id}`);

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
        //Obtenemos el paquete
        console.info('Validacion de tipos exitosa');
        console.info(`Yendo a buscar paquete con ID: ${req.params.id}`);
        let { paquete, message } = await getPackageById(req.params.id);

        if(paquete){
            //Retornamos los datos
            console.info(`Paquete encontrado`);
            console.info('Preparando response');
            res.status(200).json(paquete);
        }
        else{
            //Si no se encuentra, retornamos error
            console.info('No se encontro paquete');
            console.info('Preparando response');
            res.status(200).json({message});
        }
    }
}

//Endpoint para obtener paquete filtrado por Id
async function obtenerPaqueteByCode(req, res){
    console.info(`Conexion GET entrante : /api/package/code/${req.params.code}`);

    //Validamos parametro de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarCode(req.params.code);

    if(error){
        //Si hay error retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        //Obtenemos el paquete
        let { paquete, message } = await getPackageByCode(req.params.code);

        if(paquete){
            //Retornamos los datos
            console.info(`Paquete encontrado`);
            console.info('Preparando response');
            res.status(200).json(paquete);
        }
        else{
            //Si no se encuentra, retornamos error
            console.info('No se encontro paquete');
            console.info('Preparando response');
            res.status(200).json({message});
        }
    }
}

//Endpoint para obtener todos los productos de un paquete filtrado por Id
async function obtenerAllProductsByPackage(req, res) {
    console.info(`Conexion GET entrante : /api/package/${req.params.id}/products`);
}

//Auxiliar para registrar un nuevo paquete
async function altaPaquete(req, res){
    console.info('Conexion POST entrante : /api/package');
    console.info(req.body);

    req.body.categories = JSON.parse('[' + req.body.categories + ']');

    //Creamos body para validacion de paquete
    let valPackage = {
        code: req.body.code,
        name: req.body.name,
        description: req.body.description,
        stock: req.body.stock,
        price: req.body.price,
        categories: req.body.categories,
        productos: req.body.productos,
        imageName: req.file ? req.file.filename : 'package.jpg',
        imagePath: req.file ? req.file.path : 'uploads/packages/package.jpg',
    };

    //Enviamos a validar los datos
    console.log('Comenzando validacion JOI de request');
    let { error } = validarPackage(valPackage);
    
    if(error){
        //Si hay error, rentornamos
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
        //Buscamos el usuario
        let { user: userByEmail, message: userMessage } = await getUserByEmail(req.body.userEmail);

        if(!userByEmail){
            console.info('Ocurrio un error al buscar el usuario');
            console.info('Preparando response');
            res.status(500).json({message: 'Ocurrio un error con la solicitud'});
        }
        else{
            //Buscamos todas las entidades
            let { productos, message: messageProductos } = await validarProductos(req.body.productos, userByEmail.companyId);
            let { categories, message: messageCategorias } = await validarCategorias(req.body.categories);
            let { paquete: packageByCode } = await getPackageByCode(valPackage.code);

            if(messageCategorias.length > 0) errorMessage = errorMessage.concat(messageCategorias);
            if(messageProductos.length > 0) errorMessage = errorMessage.concat(messageProductos);
            if(packageByCode) errorMessage.push(`Ya existe un paquete con Codigo ${valPackage.code}`);
            
            //Si hay algun error, retornamos
            if(errorMessage.length > 0){
                console.info(`Se encontraron ${errorMessage.length} errores de existencia en la request`);
                errorMessage.map(err => console.log(err));
                console.info('Enviando response')
                res.status(400).json({message: errorMessage});
            }
            else{
                console.log('Validaciones de existencia exitosas');
                //Creamos body para insert
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
                    //Paquete insertado
                    console.log(`Paquete insertado correctamente con ID: ${packageId}`);
    
                    let packCategoryIds = [];
                    let rollback = false;
                    let packCategory = {
                        packageId
                    }
                    console.log(`Comenzando armado e insercion de PackageCategory para paquete ${packageId}`);
                    let i = 0;
                    let categoriesOk = true;
                    //Insertamos cada categoria del paquete
                    while(i < categories.length && categoriesOk){
                        
                        //Creamos body para insert de categoria - paquete
                        packCategory.categoryId = categories[i].id;

                        console.log('Enviando Query INSERT para PackageCategory');
                        let { id: packageCategoryId, message: packageCategoryMessage} = await insertPackageCategory(packCategory);
    
                        if(!packageCategoryId){
                            //Fallo insert, marcamos para rollback
                            console.log(`Fallo insert de PackageCategory con ID: ${packCategory.categoryId}`);
                            errorMessage.push(packageCategoryMessage);
                            rollback = true;
                            categoriesOk = false;
                        }
                        else{
                            // Categoria insertada correctamente en paquete
                            console.log(`PackageCategory insertada correctamente con ID: ${packageCategoryId}`);
                            packCategoryIds.push(packageCategoryId);
                        }
                        i++;
                    }

                    console.log(`Comenzando armado e insercion de PackageProduct para paquete ${packageId}`);
                    let packProductIds = [];
                    let productsOk = true;
                    
                    let j = 0;
                    //Insertamos cada producto en el paquete
                    while(j < req.body.productos.length && productsOk){

                        //Creamos body para insert de producto - paquete
                        let packageProduct = {
                            productId: req.body.productos[j].id,
                            packageId,
                            quantity: req.body.productos[j].cantidad,
                        }
                        j++;

                        console.log('Enviando a insertar PackageProduct');
                        let { id: packageProductId, message: packageProductMessage } = await insertPackageProduct(packageProduct);
                        
                        if(!packageProductId){
                            //Fallo insert, marcamos para rollback
                            console.log(`Fallo insert de PackageProduct con product ID: ${packageProduct.productId}`);
                            errorMessage.push(packageProductMessage);
                            rollback = true;
                            productsOk = false;
                        }
                        else{
                            // Producto insertado correctamente en paquete
                            console.log(`PackageProduct insertada correctamente con ID: ${packageProductId}`);
                            packProductIds.push(packageProductId);
                        }
                    }

                    //Creamos body para insert de precio
                    let precio = {
                        price: valPackage.price,
                        packageId,
                        validDateFrom: new Date(),
                    };

                    let { id: priceId, message: priceMessage } = await insertPrice(precio);

                    if(priceId && !rollback){
                        //Precio insertado
                        console.log(`Price insertado correctamente con ID: ${priceId}`);

                        console.log('Paquete finalizado exitosamente');
                        res.status(201).json({message: 'Paquete creado con exito', id: packageId});
                    }
                    else{
                        //Fallo insert, marcamos para rollback
                        rollback = true;
                        productsOk = false;
                        console.info(`Ocurrio un error al insertar el precio para el paquete ${packageId}`);
                        errorMessage.push(`Ocurrio un error al insertar el precio para el paquete ${packageId}`);
                    }

                    //Marcado para rollback
                    if(rollback){
                        console.log('Ocurrio un error en el proceso de inserts, comenzando rollback');
                        //Realizamos rollbacks de cada categoria - paquete
                        console.log('Comenzando rollbacks de categorias');
                        for(let id of packCategoryIds){
                            console.log(`Enviando rollback de PackageCategory ID: ${id}`);
                            let rollbackPackageCategory = await rollbackInsertPackageCategory(id)
                            if(rollbackPackageCategory.res) console.log(`Rollback de PackageCategory ${id} realizado correctamente`);
                            else console.log(`Ocurrio un error en rollback de PackageCategory ${id}`);
                        }

                        //Realizamos rollbacks de cada producto - paquete
                        console.log('Comenzando rollbacks de packageProducts');
                        for(let id of packProductIds){
                            console.log(`Enviando rollback de PackageProduct ID: ${id}`);
                            let rollbackPackageProduct = await rollbackInsertPackageCategory(id)
                            if(rollbackPackageProduct.res) console.log(`Rollback de PackageProduct ${id} realizado correctamente`);
                            else console.log(`Ocurrio un error en rollback de PackageProduct ${id}`);
                        }

                        //Realizamos rollback de paquete
                        console.log('Comenzando rollbacks de package');
                        let rollbackProduct = await rollbackInsertPackage(packageId);
                        if(rollbackProduct.res) console.log(`Rollback de Package ${packageId} realizado correctamente`);
                        else console.log(`Ocurrio un error en rollback de Package ${packageId}`);
                    }
                }
                else{
                    //Fallo insert de paquete
                    console.info('Error en la insercion de paquete');
                    console.info('Preparando response');
                    res.status(500).json({message: packageMessage});
                }
            }
        }
    }
}

//Auxiliar para registrar un nuevo productCompany en paquete
async function agregarPackageProduct(req, res){
    console.log(`Conexion POST entrante : /api/package/${req.params.id}/product`);

    //Validamos parametros de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        //Si hay error, retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{

    //Cremoas body para validacion de datos
    let valPackageProducts = {
        packageId: req.body.req.params.id,
        productId: req.body.productId,
        quantity: quantity,
    }

    // validacion de tipos
    console.log('Comenzando validacion JOI de request');
    let { error } = validarRegistroPackageProduct(valPackageProducts);
    
    if(error){
        //Si hay error, retornamos
        console.log(`Error en la validacion de tipos de datos: ${error.details[0].message}`)
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info('Validaciones de tipo de datos exitosa');
        console.info('Comenzando validaciones de existencia');

        //Inicializo array de errores
        let errorMessage = [];

        //Buscamos las entidades
        let valProducts = await validarProducto(valPackageProducts.productId);
        let valPackage = await getPackageById(valPackageProducts.packageId);
        
        //Si hay errores, agregamos al array
        if(valProducts.message) errorMessage.push(valProducts.message);
        if(valPackage.message) errorMessage.push(valPackage.message);


        if(errorMessage.length > 0){
            //Si hay error, retornamos
            console.info(`Se encontraron ${errorMessage.length} errores de existencia en la request`);
            errorMessage.map(err => console.log(err));
            console.info('Enviando response')
            res.status(400).json({message: errorMessage});
        }
        else{
            console.log('Validaciones de existencia exitosas');

            //Llamamos auxiliar para insert de companyProduct en paquete
                console.log('Enviando a insertar packageProduct');
                let packageProduct = await insertPackageProduct(valPackageProducts);

                if(packageProduct.id){
                    //Insert exitoso
                    console.log(`Producto insertado correctamente con ID: ${packageProduct.id}`);   
                }
                else{
                    //Fallo insert de companyProduct en paquete
                    console.log(`Error al insertar producto: ${packageProduct.message}`);
                    res.status(500).json({message: packageProduct.message});
                }
        }   
    }
}
}

//Endpoint para modificar paquete existente
async function modificarPaquete(req, res){
    console.info(`Conexion PUT entrante : /api/package/${req.params.id}`);
    console.info('request', req.body)

    //Validamos parametros de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        //Si hay error, retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        //Obtenemos el paquete
        let { paquete: paqueteById, message: packageMessage } = await getPackageById(req.params.id);

        if(!paqueteById){
            //Si no se encontro, retornamos
            console.info(`No se encontro paquete con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message: packageMessage});
        }
        else{
            //Obtenemos el usuario
            console.info('Paquete encontrado, buscando usuario');
            let { user: userByEmail } = await getUserByEmail(req.body.userEmail);

            if(!userByEmail){
                //Si no existe usuario
                console.info('Ocurrio un error al buscar el usuario');
                console.info('Preparando response');
                res.status(500).json({message: 'Ocurrio un error al procesar la solicitud'});
            }
            else{
                //Verificamos relacion usuario - paquete
                console.info('Usuario encontrado, verificando correspondencia');
                if(userByEmail.companyId !== paqueteById.companyId){
                    //Si no existe relacion usuario - paquete
                    console.info('Usuario no corresponde con compania dueña del paquete');
                    console.info('Preparando response');
                    res.status(400).json({message: 'Usuario no corresponde con compania dueña del paquete'});
                }
                else{
                    //Creamos body para validacion de paquete
                    console.info('Usuario y compania corresponden con el paquete');
                    console.info('Armando paquete para validacion');
                    let valPackage = {
                        code: req.body.code,
                        name: req.body.name,
                        description: req.body.description,
                        stock: req.body.stock,
                        price: req.body.price,
                        categories: req.body.categories,
                        productos: req.body.products,
                        imageName: req.file ? req.file.filename : paqueteById.imageName,
                        imagePath: req.file ? req.file.path : paqueteById.imagePath,
                    };

                    //Enviamos a validar los datos
                    let { error } = validarPackage(valPackage);

                    if(error){
                        //Si hay error, rentornamos
                        console.info('Erorres encontrados en la request');
                        let errores = error.details.map(e => {
                            console.info(e.message);
                            return e.message;
                        });
                        res.status(400).json(errores);
                    }
                    else{
                        //Obtenemos el precio
                        console.info('Validacion de request exitosa');
                        console.info('Obteniendo precio actual');
                        let { price: currentPrice } = await getCurrentPrice(req.params.id);

                        if(!currentPrice){
                            //Si no existe precio
                            console.info('Ocurrio un error al buscar el precio');
                            console.info('Preparando response');
                            res.status(500).json({message: 'Ocurrio un error al procesar la solicitud'});
                        }
                        else {
                            console.info('Precio obtenido');
                            let newPriceId = 0, rollback = false, errorMessage = [];

                            //Obtenemos datos del paquete
                            console.info('Obteniendo datos del paquete en caso de rollback');
                            let { paquete: paqueteRollback } = await getPackageRollback(req.params.id);
                            
                            if(!paqueteRollback){
                                //Si no se obtuvieron datos
                                console.info('No se pudo obtener el paquete original en caso de rollback');
                                console.info('Preparando response');
                                res.status(500).json({message: 'Ocurrio un error con la solicitud'});
                            }
                            else{
                                //Llamamos auxiliar para insert de precio nuevo en paquete
                                if(currentPrice.price !== req.body.price){
                                    console.info('Insertando nuevo precio');
                                    newPriceId = insertPrice({packageId: req.params.id, price: req.body.price, validDateFrom: new Date()});
                                }
                                //Llamamos auxiliar para delete de companyProduct del paquete
                                console.info('Borrando packageProducts viejos');
                                let { result: packProdsResult, message: delPackProdsMessage } = await deletePackageProducts(req.params.id);
                                //Llamamos auxiliar para insert de categorias del paquete
                                console.info('Borrando packageCategories viejos');
                                let { result: packCatsResult, message: delPackCatsMessage } = await deletePackageCategories(req.params.id);
                                let packProductIds = [];
                                let packCategoriesIds = [];
    
                                if(packProdsResult){
                                    console.info('PackageProducts viejos borrados');
                                    console.info('Preparandose para insertar nuevos packageProducts');
                                    let productsOk = true;
                                    let i = 0;
                                    //Recorro array de productos
                                    while(i < req.body.products.length && productsOk){
                                        let packageProduct = {
                                            productId: req.body.products[i].productId,
                                            packageId: req.params.id,
                                            quantity: req.body.products[i].quantity,
                                        };
    
                                        //Obtenemos el CompanyProducto
                                        console.log('Verificando existencia de productos');
                                        let {producto: companyProduct, message: companyProductMessage} = await getCompanyProductById(packageProduct.productId);
    
                                        if(!companyProduct){
                                            //Si no se encontro, retornamos
                                            console.info(`No existe companyProduct con ID: ${packageProduct.productId}`);
                                            rollback = true;
                                            productsOk = false;
                                            errorMessage.push(companyProductMessage);
                                        }
                                        //Si se encontro el companyProduct y pertenece a la empresa
                                        //Llamamos auxiliar para insert de companyProduct en paquete
                                        else if(companyProduct && companyProduct.companyId === userByEmail.companyId){
                                            console.info('Enviando insert PackageProduct');
                                            let { id, message } = await insertPackageProduct(packageProduct);
    
                                            if(id){
                                                //Insertamos companyProduct en paquete
                                                console.info(`PackageProduct insertado con ID: ${id}`);
                                                packProductIds.push(id);
                                            }
                                            else{
                                                //No se pudo insertar, retornamos error
                                                console.info(`No se pudo insertar el packageProduct, comienza rollback`);
                                                console.info(message);
                                                productsOk = false;
                                                rollback = true;
                                                errorMessage.push(`No se pudo insertar el packageProduct con ID: ${packageProduct.productId}`);
                                            }
                                        }
                                        else{
                                            //El companyProduct no pertenece a la empresa
                                            console.info(`CompanyProduct con ID: ${packageProduct.productId} no corresponde con la compania`);
                                            rollback = true;
                                            productsOk = false;
                                            errorMessage.push(`CompanyProduct con ID: ${packageProduct.productId} no corresponde con la compania`);
                                        }
                                        i++;
                                    }
                                }
                                else{
                                    //Fallo deleted, marcamos para rollback
                                    console.info('Ocurrio un error en el borrado de packageProducts, preparando rollback');
                                    console.info(delPackProdsMessage);
                                    rollback = true;
                                }
    
                                if(packCatsResult){
                                    console.info('PackageCategories viejos borrados');
                                    console.info('Preparandose para insertar nuevos packageCategories');
                                    let categoriesOk = true;
                                    let j = 0;
                                    //Recorro categorias
                                    while(j < req.body.categories.length && categoriesOk){
                                        let packCategory = {
                                            packageId: req.params.id,
                                            categoryId: req.body.categories[j]
                                        };
    
                                        //Obtenemos categoria
                                        console.info('Verificando existencia de categorias');
                                        let { category, message: categoryMessage } = await getCategoryById(packCategory.categoryId);
    
                                        if(!category){
                                            //Si no se encontro, retornamos
                                            console.info(`No existe categoria con ID: ${packCategory.categoryId}`);
                                            rollback = true;
                                            productsOk = false;
                                            errorMessage.push(categoryMessage);
                                        }
                                        else{
                                            //Llamamos auxiliar para insert de categoria en paquete
                                            console.log('Enviando insert PackageCategory');
                                            let { id, message } = await insertPackageCategory(packCategory);
    
                                            if(id){
                                                //Insertamos categoria en paquete correctamente
                                                console.info(`PackageCategory insertado con ID: ${id}`);
                                                packCategoriesIds.push(id);
                                            }
                                            else{
                                                //No se pudo insertar, marcamos para rollback
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
                                    //Fallo deleted, marcamos para rollback
                                    console.info('Ocurrio un error en el borrado de packageCategories, preparando rollback');
                                    console.info(delPackCatsMessage);
                                    rollback = true;
                                }
    
                                //Armamos body para insert
                                let package = {
                                    companyId: userByEmail.companyId,
                                    code: valPackage.code,
                                    name: valPackage.name,
                                    description: valPackage.description,
                                    stock: valPackage.stock,
                                    imageName: valPackage.imageName,
                                    imagePath: valPackage.imagePath
                                };
    
                                //Enviamos update de paquete
                                let { result: updatePackResult, message: updatePackMessage } = await updatePackage(req.params.id, package);
    
                                if(updatePackResult){
                                    //Paquete modificado correctamente
                                    console.info('Paquete modificado con exito');
                                }
                                else{
                                    //No se pudo modificar, marcamos para rollback
                                    console.info('Ocurrio un error al actualizar el paquete');
                                    console.info(updatePackMessage);
                                    rollback = true;
                                }
    
                                //Marcado para rollback
                                if(rollback){
                                    console.info('Comenzando rollback');
                                    console.info(`${errorMessage.length} errores encontrados`);
                                    errorMessage.map(e => {
                                        console.info(e);
                                    });
    
                                    //Llamamos auxiliar para delete de companyProduct del paquete
                                    console.info('Borrando packageProducts insertados');
                                    let { result: packProdsResult, message: delPackProdsMessage } = await deletePackageProducts(req.params.id);
                                    //Llamamos auxiliar para delete de categorias del paquete
                                    console.info('Borrando packageCategories insertados');
                                    let { result: packCatsResult, message: delPackCatsMessage } = await deletePackageCategories(req.params.id);
    
                                    //Recorro productos del paquete anterior
                                    for(let p of paqueteRollback.productos){
                                        //Armo body para insert companyProduct en paquete
                                        let prod = {
                                            packageId: p.packageId,
                                            productId: p.productId,
                                            quantity: p.quantity
                                        };
    
                                        //Llamamos auxiliar para insert de companyProduct en paquete
                                        let { id, message } = await insertPackageProduct(prod);
    
                                    }

                                    //Recorro categorias del paquete anterior
                                    for(let c of paqueteRollback.categorias){
                                        //Armo body para insert de categorias en paquete
                                        let cat = {
                                            packageId: c.packageId,
                                            categoryId: c.categoryId
                                        };
    
                                        //Llamamos auxiliar para insert de categorias en paquete
                                        let { id, message } = await insertPackageCategory(cat);
    
                                    }
    
                                    //Armo body para update de paquete
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
                                    let { paquete: paq, message: paqMessage } = await getPackageById(req.params.id);
                                    console.info('Preparando response');
                                    res.status(200).json({message: 'Modificacion completada', package: paq});
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

//Endpoint para eliminar paquete existente
async function eliminarPaquete(req, res){
    console.info(`Conexion DELETE entrante : /api/package/${req.params.id}`);

    //Validamos parametro de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        //Si hay error, retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        //Obtenemos el paquete
        console.info('Comenzando validaciones de existencia');
        let { paquete, message } = await getPackageById(req.params.id);

        if(!paquete){
            //Si no se encontro, retornamos
            console.info(`No existe paquete con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message});
        }
        else{

            //Obtenemos el usuario
            let { user, message: userMessage } = await getUserByEmail(req.body.userEmail);
            
            if(!user){
                //Si no existe usuario
                console.info('Ocurrio un error buscando el usuario');
                console.info('Preparando request');
                res.status(500).json({message: 'Ocurrio un error al procesar la solicitud'});
            }
            //Verificamos relacion usuario - paquete
            else if(user.companyId === paquete.companyId){
                //Enviamos a borrar el paquete (update que inserta timestamp en campo 'deleted')
                console.info('Enviando request para eliminacion');
                let { result, message } = await deletePackage(req.params.id, new Date());
                
                if(result){
                    //Si salio bien, retornamos
                    console.info(`Package eliminado correctamente con ID: ${req.params.id}`);
                    console.info('Preparando response');
                    res.status(200).json({message});
                }
                else{
                    //Si fallo damos error
                    console.info('No se pudo eliminar Package');
                    console.info('Preparando response');
                    res.status(500).json({message: message});
                }
            }
            else{
                //Si no existe relacion usuario - paquete
                console.info('Paquete no corresponde con la compania del usuario');
                console.info('Preparando responde');
                res.status(400).json({message: 'Paquete no corresponde con la compania del usuario'});
            }
        }
    }
}

async function restaurarPaquete(req, res){
    console.info(`Conexion DELETE entrante : /api/package/${req.params.id}/restore`);

    //Validamos parametro de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        //Si hay error, retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        //Obtenemos el paquete
        console.info('Comenzando validaciones de existencia');
        let { paquete, message } = await getPackageById(req.params.id);

        if(!paquete){
            //Si no se encontro, retornamos
            console.info(`No existe paquete con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message});
        }
        else{
            //Obtenemos el usuario
            let { user, message: userMessage } = await getUserByEmail(req.body.userEmail);
            
            if(!user){
                //Si no existe usuario
                console.info('Ocurrio un error buscando el usuario');
                console.info('Preparando request');
                res.status(500).json({message: 'Ocurrio un error al procesar la solicitud'});
            }
            //Verificamos relacion usuario - paquete
            else if(user.companyId === paquete.companyId){
                //Enviamos a restaurar el paquete (update que inserta null en campo 'deleted')
                console.info('Enviando request para restauracion');

                let package = {
                    companyId: paquete.companyId,
                    code: paquete.code,
                    name: paquete.name,
                    description: paquete.description,
                    stock: paquete.stock,
                    imageName: paquete.imageName,
                    imagePath: paquete.imagePath,
                    created: paquete.created,
                    deleted: null,
                };

                let { result, message } = await updatePackage(req.params.id, package);
                
                if(result){
                    //Si salio bien, retornamos
                    console.info(`Package restaurado correctamente con ID: ${req.params.id}`);
                    console.info('Preparando response');
                    res.status(200).json({message});
                }
                else{
                    //Si fallo damos error
                    console.info('No se pudo restaurar Package');
                    console.info('Preparando response');
                    res.status(500).json({message: message});
                }
            }
            else{
                //Si no existe relacion usuario - paquete
                console.info('Paquete no corresponde con la compania del usuario');
                console.info('Preparando responde');
                res.status(400).json({message: 'Paquete no corresponde con la compania del usuario'});
            }
        }
    }
}

//Funcion para obtener todos los datos de un paquete
async function armarPackage(paquete){
    console.info(`Comenzando armado de paquete con ID: ${paquete.id}`);

    //Inicializo array, mensaje y bandera
    let categories = [], message = '', flag = true;

    //Arreglamos el path de las imagenes
    if(paquete.imagePath) paquete.imagePath = paquete.imagePath.replace(/\\/g, '/');
    
    //Obtenemos la compania
    let { company } = await getCompanyById(paquete.companyId);
    if(company) paquete.companyName = company.name;
    else {
        //No se obtuvo la compania, se retorna error
        flag = false;
        message = 'Ocurrio un error al obtener los productos';
        console.info('Ocurrio un error obteniendo la company del producto');
    }

    //Obtenemos el precio
    let { price } = await getCurrentPrice(paquete.id);
    if(price){
        //Se encontraron datos
        paquete.priceId = price.id;
        paquete.price = price.price;
    }
    else{
        //Si no se encontro, retornamos
        flag = false;
        message = 'Ocurrio un error al obtener los paquetes';
        console.info('Ocurrio un error al obtener el precio del paquete');
    }
    
    //Obtengo categorias del paquete
    let { categorias: categoriesIds } = await getPackageCategories(paquete.id);
    if(categoriesIds){
        //Se encontraron datos
        //Recorro array de categorias
        for(let c of categoriesIds){
            //Obtenemos esa categoria
            let { category } = await getCategoryById(c.categoryId);
            //Agregamos la categoria al array
            categories.push(category);
        }
        paquete.categories = categories;
    }
    else{
        //Si no se encontro, retornamos
        flag = false;
        message = 'Ocurrio un problema al buscar los paquetes';
        console.info('Ocurrio un problema al buscar las categorias del paquete');
    }
    
    //Obtenemos todos los productos del paquete
    let { productos } = await getAllProductsByPackage(paquete.id);
    //inicializo array de productos
    let products = [];
    if(productos){
        //Recorro array de productos
        for(let p of productos){
            
            //Obtengo el producto
            let { producto } = await getCompanyProductById(p.productId);

            //Agrego al array el producto y la cantidad
            if(producto){
                producto.quantity = p.quantity;
                products.push(producto);
            }
            else{
                //Si no se encontro, retornamos
                flag = false;
                message = 'Ocurrio un problema al buscar los paquetes';
                console.info('Ocurrio un problema al buscar los productos del paquete');
            }
        }
        paquete.products = products;
    }
    else{
        //Si no se encontro, retornamos
        flag = false;
        message = 'Ocurrio un problema al buscar los paquetes';
        console.info('Ocurrio un problema al buscar los productos del paquete');
    }

    if(flag) return { paquete, message };
    else return { message };
}

//Auxiliar para obtener todos los paquetes habilitados
async function getPackages(){
    console.info('Buscando todos los paquetes habilitados');
    let message ='';
    //Conectamos con las queries
    let paquetes = await queries
                        .packages
                        .getPackages()
                        .then(async data => {
                            //Si se consiguio la info
                            if(data){
                                console.info('Informacion de paquetes obtenida');
                                let flag = true;
                                for(let p of data){
                                    //Obtenemos todos los datos de ese paquete
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
                                //Si no se consiguieron datos
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

//Auxiliar para obtener todos los paquetes
async function getAllPackages(){
    console.info('Buscando todos los paquetes');
    let message ='';
    //Conectamos con las queries
    let paquetes = await queries
                        .packages
                        .getAll()
                        .then(async data => {
                            //Si se consiguio la info
                            if(data){
                                console.info('Informacion de paquetes obtenida');
                                let flag = true;
                                for(let p of data){
                                    //Obtenemos todos los datos de ese paquete
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
                                //Si no se consiguieron datos
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

//Auxiliar para obtener todos los paquetes borrados
async function getDeletedPackages(){
    console.info('Buscando todos los paquetes borrados');
    let message ='';
    //Conectamos con las queries
    let paquetes = await queries
                        .packages
                        .getDeleted()
                        .then(async data => {
                            //Si se consiguio la info
                            if(data){
                                console.info('Informacion de paquetes obtenida');
                                let flag = true;
                                for(let p of data){
                                    //Obtenemos todos los datos de ese paquete
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
                                //Si no se consiguieron datos
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

//Auxiliar para obtener todos los paquetes habilitados filtrando por Id de compania
async function getPackagesByCompany(id){
    console.info(`Buscando todos los paquetes habilitados de la compania con id : ${id}`);
    let message ='';
    //Conectamos con las queries
    let companyPackages = await queries
                        .packages
                        .getByCompany(id)
                        .then(async data => {
                            //Si se consiguio la info
                            if(data){
                                console.info(`Informacion de paquetes habilitados de la compania con id : ${id},  obtenida`);
                                let flag = true;
                                for(let p of data.rows){
                                    //Obtenemos todos los datos de ese paquete
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
                                //Si no se consiguieron datos
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

//Auxiliar para obtener todos los paquetes filtrando por Id de compania
async function getAllPackagesByCompany(id){
    console.info(`Buscando todos los paquetes de la compania con id : ${id}`);
    let message ='';
    //Conectamos con las queries
    let companyPackages = await queries
                        .packages
                        .getAllByCompany(id)
                        .then(async data => {
                            //Si se consiguio la info
                            if(data){
                                console.info(`Informacion de paquetes de la compania con id : ${id},  obtenida`);
                                let flag = true;
                                for(let p of data){
                                    //Obtenemos todos los datos de ese paquete
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
                                //Si no se consiguieron datos
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

//Auxiliar para obtener todos los paquetes borrados filtrando por Id de compania
async function getDeletedPackagesByCompany(id){
    console.info(`Buscando todos los paquetes eliminados de la compania con id : ${id}`);
    let message ='';
    //Conectamos con las queries
    let companyPackages = await queries
                        .packages
                        .getDeleteByCompany(id)
                        .then(async data => {
                            //Si se consiguio la info
                            if(data){
                                console.info(`Informacion de paquetes eliminados de la compania con id : ${id},  obtenida`);
                                let flag = true;
                                for(let p of data){
                                    //Obtenemos todos los datos de ese paquete
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
                                //Si no se consiguieron datos
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

//Auxiliar para obtener paquete filtrando por Id de paquete
async function getPackageById(id){
    console.info(`Buscando paquete con id: ${id}`);
    let message = '';
    //Conectamos con las queries
    let paquete = await queries
                    .packages
                    .getOneById(id)
                    .then(async data => {
                        //Si se consiguio la info
                        if(data){
                            console.info('Informacion de paquete obtenida');
                            let flag = true;
                            //Obtenemos todas los datos de ese paquete
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
                            //Si no se consiguieron datos
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

//Auxiliar para obtener todos los datos del paquete para realizar roolback filtrado por Id
async function getPackageRollback(id){
    console.info(`Buscando paquete con id: ${id} para rollback`);
    let message = '';
    //Conectamos con las queries
    let paquete = await queries
                    .packages
                    .getOneById(id)
                    .then(async package => {
                        //Si se consiguio la info
                        if(package){
                            console.info(`Paquete con ID: ${id} encontrado, armando`);
                            //Obtenemos todos los productos de ese paquete
                            let { productos, message: prodMessage } = await getAllProductsByPackage(id);
                            //Obtenemos todas las categorias de ese paquete
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
                            //Si no se consiguieron datos
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

//Auxiliar para obtener paquete filtrando por Codigo de paquete
async function getPackageByCode(code){
    console.info(`Buscando paquete con codigo: ${code}`);
    let message = '';
    //Conectamos con las queries
    let paquete = await queries
                    .packages
                    .getOneByCode(code)
                    .then(async data => {
                        //Si se consiguio la info
                        if(data){
                            console.info(`Paquete con Codigo: ${code} encontrado`);
                            let flag = true;
                            //Obtenemos el paquete con todos su datos
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
                            //Si no se consiguieron datos
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

//Auxiliar para obtener relacion producto - paquete filtrando por ID de paquete
async function getAllProductsByPackage (id){
    console.info(`Buscando productos del paquete con id: ${id}`);
    let message = '';
    //Conectamos con las queries
    let productos = await queries
                    .packageProduct
                    .getAllById(id)
                    .then(data => {
                        //Si se consiguio la info
                        if(data){
                            console.info(`Productos del paquete con id: ${id} encontrado`);
                            return data;
                        }
                        else{
                            //Si no se consiguieron datos
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

//Auxiliar para obtener relacion paquete - categoria filtrando por ID de paquete
async function getPackageCategories(id){
    console.info(`Buscando categorias del paquete con id: ${id}`);
    let message = '';
    //Conectamos con las queries
    let categorias = await queries
                    .packCategory
                    .getByPackageId(id)
                    .then(categories => {
                        //Si se consiguio la info
                        if(categories){
                            console.info(`Categorias del paquete con id: ${id} encontrado`);
                            return categories;
                        }
                        else{
                            //Si no se consiguieron datos
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

//Auxiliar para insertar paquete 
async function insertPackage(paquete){
    console.info('Comenzando insert de Package');
    let message = '';
    //Conectamos con las queries
    let id = await queries
                        .packages
                        .insert(paquete)
                        .then(id => {
                            if(id){
                                //Si se inserto correctamente
                                console.info(`Insert de Package existoso con ID: ${id[0]}`);
                                return id[0];
                            }
                            else{
                                //Si fallo
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

//Auxiliar para insertar relacion paquete - producto
async function insertPackageProduct(producto){
    console.info('Comenzando insert de PackageProduct');
    let message = '';
    //Conectamos con las queries
    let id = await queries
                        .packageProduct
                        .insert(producto)
                        .then(id => {
                            //Si se inserto correctamente
                            if(id){
                                console.info(`Insert de PackageProduct existoso con ID: ${id[0]}`);
                                return id[0];
                            }
                            else{
                                //Si fallo
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

//Auxiliar para insertar relacion paquete - categoria
async function insertPackageCategory(packCategory){
    console.info('Comenzando insert de PackageCategory');
    let message = '';
    //Conectamos con las queries
    let id = await queries
                    .packCategory
                    .insert(packCategory)
                    .then(id => {
                            //Si se inserto correctamente
                            if(id){
                             console.info(`Insert de PackageCategory existoso con ID: ${id[0]}`);
                             return id[0];
                            }
                            else{
                                //Si fallo
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

//Auxiliar para insertar precio a un package existente
async function insertPrice(price){
    console.info('Comenzando insert de Price');
    let message = '';
    //Conectamos con las queries
    let id = await queries
                        .prices
                        .insert(price)
                        .then(id => {
                            console.log('insertprice', id);
                            //Si se inserto correctamente
                            if(id){
                                console.info(`Insert de Price existoso con ID: ${id[0]}`);
                                return id[0];
                            }
                            else{
                                //Si fallo
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

//Auxiliar para modificar package existente
async function updatePackage(id, paquete){
    console.info('Comenzando update de Package');
    let message = '';
    //Conectamos con las queries
    let result = await queries
                .packages
                .modify(id, paquete)
                .then(res => {
                    //Si se actualizo correctamente
                    if(res){
                        console.info(`Update de Package con ID: ${id} existoso`);
                        return res;
                    }
                    else{
                        //Si fallo
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

//Auxiliar para modificar packageProduct existente
async function updatePackageProduct(id, paquete){
    console.info('Comenzando update de PackageProduct');
    let message = '';
    //Conectamos con las queries
    let result = await queries
                .packageProduct
                .modify(id, paquete)
                .then(res => {
                    //Si se actualizo correctamente
                    if(res){
                        console.info(`Update de PackageProduct con ID: ${id} existoso}`);
                        return res;
                    }
                    else{
                        //Si fallo
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

//Auxiliar para eliminar el paquete dado
async function deletePackage(id, date){
    console.info('Comenzando delete de Package');
    let message = '';
    //Conectamos con las queries
    let result = await queries
                .packages
                .delete(id, date)
                .then(res => {
                    //Si se elimino correctamente
                    if(res){
                        console.info(`Delete de Package existoso con ID: ${id}`);
                        message = `Package con ID:${id} eliminado correctamente`;
                        return res;
                    }
                    else{
                        //Si fallo
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

//Auxiliar para eliminar los productos de un paquete existente
async function deletePackageProducts(id){
    console.info(`Comenzando delete de PackageProducts para el package ${id}`);
    let message = '';
    //Conectamos con las queries
    let result = await queries
                .packageProduct
                .deleteByPackage(id)
                .then(res => {
                    console.log('resdeletepackageproducts', res);
                    //Si se elimino correctamente
                    if(res){
                        console.info(`Delete de PackageProducts existoso para el package ID: ${id}`);
                        message = `PackageProducts para paquete ${id} eliminados correctamente`;
                        return res;
                    }
                    else{
                        //Si fallo
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

//Auxiliar para eliminar las categorias de un paquete existente
async function deletePackageCategories(id){
    console.info(`Comenzando delete de PackageCategories para el package ${id}`);
    let message = '';
    //Conectamos con las queries
    let result = await queries
                .packCategory
                .deleteByPackage(id)
                .then(res => {
                    console.log('resdeletepackagecategories', res);
                    //Si se elimino correctamente
                    if(res){
                        console.info(`Delete de PackageCategories existoso para el package ID: ${id}`);
                        message = `PackageCategories para paquete ${id} eliminados correctamente`;
                        return res;
                    }
                    else{
                        //Si fallo
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

//Rollback de insercion de paquete 
async function rollbackInsertPackage(id){
    let message = '';
    //Conectamos con las queries
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

//Rollback de insercion relacion paquete - product
async function rollbackInsertPackageProduct(id){
    let message = '';
    //Conectamos con las queries
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

//Rollback de insercion relacion paquete - categoria
async function rollbackInsertPackageCategory(id){
    let message = '';
    //Conectamos con las queries
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

//Rollback de insercion de precio de un paquete existente
async function rollbackInsertPrice(id){
    let message = '';
    //Conectamos con las queries
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

//Auxiliar para buscar una categoria en un paquete dado
async function buscarCategoryInPackage(idPack, idCat){
    console.info(`Buscando categorias en paquete con id: ${idPack}`);
    let message = '';
    //Conectamos con las queries
    let category = await queries
                    .packCategory
                    .getByPackageIdByCategoryId(idPack,idCat)
                    .then(data => {
                        //Si se consiguio la info
                        if(data.rowCount){
                            console.info(`Categoria con ID: ${idCat} encontrada en paquete con id: ${idPack}`);
                            return data.rows;
                        }
                        else{
                            //Si no se consiguieron datos
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

//Auxiliar para buscar un companyProduct en un paquete dado
async function buscarProductInPackage(idPack, idPro){
    console.info(`Buscando companyProducts en paquete con id: ${idPack}`);
    let message = '';
    //Conectamos con las queries
    let producto = await queries
                    .packageProduct
                    .getByPackageIdProductId(idPack,idPro)
                    .then(data => {
                        //Si se consiguio la info
                        if(data.rowCount){
                            console.info(`Producto con ID: ${idPro} encontrada en paquete con id: ${idPack}`);
                            return data.rows;
                        }
                        else{
                            //Si no se consiguieron datos
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

//Auxiliar para obtener precios filtrando por ID
async function getPriceById(id){
    console.info(`Buscando precio con ID: ${id}`);
    let message = '';
    //Conectamos con las queries
    let price = await queries
                .prices
                .getOneById(id)
                .then(data => {
                    //Si se consiguio la info
                    if(data) {
                        console.info(`Precio con ID: ${id} encontrado`);
                        return data;
                    }
                    else{
                        //Si no se consiguieron datos
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

//Auxiliar para obtener el precio mas reciente de un paquete dado
async function getCurrentPrice(id){
    console.info(`Buscando precio actual para paquete con ID: ${id}`);
    let message = '';
    //Conectamos con las queries
    let price = await queries
                .prices
                .getCurrent(id)
                .then(data => {
                    //Si se consiguio la info
                    if(data) {
                        console.info(`Precio con ID: ${id} encontrado`);
                        return data.rows[0];
                    }
                    else{
                        //Si no se consiguieron datos
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

//Auxiliar para obtener los 2 precios mas recientes de un paquete dado
async function getLastPrices(id){
    console.info(`Buscando ultimos 2 precios para paquete con ID: ${id}`);
    let message = '';
    //Conectamos con las queries
    let prices = await queries
                .prices
                .getLast(id)
                .then(data => {
                    //Si se consiguio la info
                    if(data) {
                        console.info(`Precios para paquete ${id} encontrados`);
                        return data.rows;
                    }
                    else{
                        //Si no se consiguieron datos
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

//Auxiliar para aumentar o disminuir el stock de un paquete dado
async function ajustarStock(id, cantidad, tipo){
    console.log(`Comenzando ajuste de stock para paquete con ID: ${id}, cantidad a ${tipo}: ${cantidad}`);

    //Obtenemos el paquete
    let { paquete } = await getPackageById(id);

    if(!paquete){
        //Si no se obtuvo, doy error
        console.log('Error al obtener paquete para reducir');
        return false;
    }
    else{
        //Si se encontro
        console.log(`Procediendo a ${tipo} la cantidad`);
        //Creamos body para update
        let pack = {
            code: paquete.code,
            companyId: paquete.companyId,
            name: paquete.name,
            description: paquete.description,
            stock: tipo === 'reducir' ? paquete.stock - cantidad : paquete.stock + cantidad,
            imageName: paquete.imageName,
            imagePath: paquete.imagePath,
            created: paquete.created,
            deleted: paquete.deleted
        }

        let reducido = false;
        console.log('Enviando Query UPDATE');
        //Conectamos con las queries
        await queries
            .packages
            .modify(id, pack)
            .then(data => {
                //Si se actualizo correctamente
                if(data){
                    reducido = true;
                    console.log('Query UPDATE exitosa');
                }
                else{
                    //Si fallo
                    console.log(`Error en Query UPDATE de Package: ${err}`);
                }
            })
            .catch(err => {
                console.log(`Error en Query UPDATE de Package: ${err}`);
            });
            
        return reducido;
    }
}

//Funcion para validar codigos
function validarCode(code){
    //Creamos schema Joi
    const schema = Joi.string().min(1).max(20).required();

    //Validamos
    return Joi.validate(code, schema);
}

//Funcion para validar array de categorias
async function validarCategorias(categorias){
    console.log('Iniciando validacion de categorias');
    
    //Creamos arrays de response
    let message = [];
    let categories = [];

    //Recorremos las categorias
    for(let cat of categorias){
        //Obtenemos la categoria
        let { category, message: categoryMessage } = await getCategoryById(cat);

        //Si se encontro, se agrega al array, si no se agrega mensaje
        if(categoryMessage.length > 0) message.push(categoryMessage);
        else categories.push(category);
    };
    return { categories, message };
}

//Funcion para validar array de productos
async function validarProductos(products, companyId){
    console.log('Iniciando validacion de productos');
    
    //Creamos arrays de response
    let message = [];
    let productos = [];

    //Recorremos los productos
    for(let prod of products){
        //Obtenemos el producto
        let { producto, message: productMessage } = await getCompanyProductById(prod.id);

        //Si no hay producto, agregamos al array
        if(!producto) message.push(productMessage);
        //Si se encontro y pertenece a esa empresa se agrega al array, si no se agrega mensaje
        else if(Number(producto.companyId) !== Number(companyId)) message.push(`Producto ${producto.id} no corresponde con compania ${companyId}`);
        else productos.push({'productId': producto.id, 'quantity': prod.quantity});
    };
    return { productos, message };
}

//Auxiliar para validar si existe el producto con el id recibido
async function validarProducto(id){
    console.log('Iniciando validacion de productos');
    
    let message = '';
    //Conectamos con las queries
    let producto = await getCompanyProductById(id)
                        .then(res => {
                        //Si no se consiguio la info    
                        if(!res){
                                console.log(`CompanyProduct no encontrado con ID: ${id}`);
                                message += `CompanyProduct no encontrado con ID: ${id}`;
                                return null;
                            }
                            //Si se consiguio la info
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

//Funcion para validar datos de un paquete
function validarPackage(body) {
    //Creamos schema Joi
    const schema = {
        code: Joi.string().min(0).max(20).required(),
        name: Joi.string().min(3).max(30).required(),
        description: Joi.string().min(3).max(30).required(),
        stock: Joi.number().min(0).max(999999).required(),
        price: Joi.number().min(1).max(999999).required(),
        categories: Joi.array().required(),
        productos: Joi.array().required(),
        imageName: Joi.string().min(3).max(150).required(),
        imagePath: Joi.string().min(3).max(150).required(),
    };
    //Validamos
    return Joi.validate(body, schema);
}

//Funcion para validar datos de un producto en un paquete
function validarRegistroPackageProduct(body) {
    //Creamos schema Joi
    const schema = {
        packageId: Joi.number().min(0).max(999999999).required(),
        productId: Joi.number().min(0).max(999999999).required(),
        quantity: Joi.number().min(0).max(999999999).required(),
    };
    //Validamos
    return Joi.validate(body, schema);
}

//Exportamos endpoints
module.exports = {
    obtenerPackages,
    obtenerAllPackages,
    obtenerDeletedPackages,
    obtenerPackagesByCompany,
    obtenerAllPackagesByCompany,
    obtenerDeletedPackagesByCompany,
    obtenerPaqueteById,
    obtenerPaqueteByCode,
    obtenerAllProductsByPackage,
    altaPaquete,
    agregarPackageProduct,
    modificarPaquete,
    eliminarPaquete,
    restaurarPaquete,
    getPackageById,
    getPriceById,
    getCurrentPrice,
    getLastPrices,
    ajustarStock,
};