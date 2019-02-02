//Incluimos Joi para validaciones
const Joi = require('joi');
//Incluimos queries de DB
const queries = require('./dbQueries');
//Incluimos funciones de companies
const { getCompanyById } = require('../companies/routes');
//Incluimos funciones de users
const { getUserByEmail } = require('../users/routes');
//Incluimos funciones de helpers
const { getCategoryById, validarId } = require('../helpers/routes');

//Endpoint para obtener todos los productos
async function obtenerProducts(req, res){
    console.info('Conexion GET entrante : /api/product/');

    //Obtenemos los datos
    let { products, message } = await getProducts();

    if(products){
        //Retornamos los datos
        console.info(`${products.length} productos encontrados`);
        console.info('Preparando response');
        res.status(200).json(products);
    }
    else{
        //Si fallo, damos error
        console.info('No se encontraron productos');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

//Endpoint para obtener todos los companyProducts no borrados
async function obtenerCompanyProducts(req, res){
    console.info('Conexion GET entrante : /api/product/company');

    //Obtenemos los datos
    let { companyProducts, message } = await getCompanyProducts();

    if(companyProducts){
        //Retornamos los datos
        console.info(`${companyProducts.length} productos encontrados`);
        console.info('Preparando response');
        res.status(200).json(companyProducts);
    }
    else{
        //Si fallo, damos error
        console.info('No se encontraron productos');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

//Endpoint para obtener todos los companyProducts
async function obtenerAllCompanyProducts(req, res){
    console.info('Conexion GET entrante : /api/product/company/List');

    //Obtenemos los datos
    let { companyProducts, message } = await getAllCompanyProducts();

    if(companyProducts){
        //Retornamos los datos
        console.info(`${companyProducts.length} productos encontrados`);
        console.info('Preparando response');
        res.status(200).json(companyProducts);
    }
    else{
        //Si fallo, damos error
        console.info('No se encontraron productos');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

//Endpoint para obtener todos los companyProducts borrados
async function obtenerDeletedCompanyProducts(req, res){
    console.info('Conexion GET entrante : /api/product/companyDeleted');

    //Obtenemos los datos
    let { CompanyProducts, message } = await getDeletedCompanyProducts();

    if(CompanyProducts){
        //Retornamos los datos
        console.info(`${CompanyProducts.length} productos encontrados`);
        console.info('Preparando response');
        res.status(200).json(CompanyProducts);
    }
    else{
        //Si fallo, damos error
        console.info('No se encontraron productos');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

//Endpoint para obtener companyProducts filtrando por producto
async function obtenerCompanyProductsByProduct(req, res){
    console.info(`Conexion GET entrante : /api/product/${req.params.id}/companies`);

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
        //Obtenemos el producto
        console.info(`Comprobando existencia de product ${req.params.id}`);
        let { producto, message: productMessage } = await getProductById(req.params.id);

        if(!producto){
            //Si no se encuentra, retornamos error
            console.info(`No existe producto con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message: productMessage});
        }
        else{
            //Obtenemos los datos
            console.log(`Obteniendo los companyProducts con productId: ${req.params.id}`);
            let { companyProducts, message } = await getCompanyProductsByProduct(req.params.id);

            if(companyProducts){
                //Retornamos los datos
                console.info(`${companyProducts.length} productos encontrados`);
                console.info('Preparando response');
                res.status(200).json(companyProducts);
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

//Endpoint para obtener companyProducts no borrados filtrando por ID de compania
async function obtenerCompanyProductsByCompany(req, res){
    console.info(`Conexion GET entrante : /api/product/company/${req.params.id}`);

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
            console.log(`Obteniendo los companyProducts con companyId: ${req.params.id}`);
            let { companyProducts, message } = await getCompanyProductsByCompany(req.params.id);

            if(companyProducts){
                //Retornamos los datos
                console.info(`${companyProducts.length} productos encontrados`);
                console.info('Preparando response');
                res.status(200).json(companyProducts);
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

//Endpoint para obtener companyProducts filtrando por ID de compania
async function obtenerAllCompanyProductsByCompany(req, res){
    console.info(`Conexion GET entrante : /api/product/company/${req.params.id}/all`);

    //Obtenemos los datos
    let { CompanyProducts, message } = await getAllCompanyProductsByCompany(req.params.id);

    if(CompanyProducts){
        //Retornamos los datos
        console.info(`${CompanyProducts.length} productos encontrados`);
        console.info('Preparando response');
        res.status(200).json(CompanyProducts);
    }
    else{
        //Si fallo, damos error
        console.info('No se encontraron productos');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}
//Endpoint para obtener companyProducts borrados filtrando por ID de compania
async function obtenerDeletedCompanyProductsByCompany(req, res){
    console.info(`Conexion GET entrante : /api/product/company/${req.params.id}/deleted`);

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
            console.log(`Obteniendo los companyProducts con companyId: ${req.params.id}`);
            let { companyProducts, message } = await getDeletedProductsByCompany(req.params.id);

            if(companyProducts){
                //Retornamos los datos
                console.info(`${companyProducts.length} productos encontrados`);
                console.info('Preparando response');
                res.status(200).json(companyProducts);
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

//Endpoint para obtener productos filtrando por ID
async function obtenerProductById(req, res){
    console.info(`Conexion GET entrante : /api/product/${req.params.id}`);

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
        console.log(`Obteniendo producto con ID: ${req.params.id}`);
        let { producto, message } = await getProductById(req.params.id);
    
        if(producto){
            //Retornamos los datos
            console.info(`${producto.length} productos encontrados`);
            console.info('Preparando response');
            res.status(200).json(producto);
        }
        else{
            //Si fallo damos error
            console.info('No se encontraron productos');
            console.info('Preparando response');
            res.status(200).json({message});
        }
    }    
}

//Endpoint para obtener companyProducts filtrando por ID
async function obtenerCompanyProductById(req, res){
    console.info(`Conexion GET entrante : /api/product/company${req.params.companyId}/product/${req.params.productId}`);

    //Validamos parametros de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error: errorCompany } = validarId(req.params.companyId);
    let { error: errorProduct } = validarId(req.params.productId);

    if(errorCompany || errorProduct){
        //Si hay error retornamos
        console.info('Erorres encontrados en la request');
        let erroresCompany = [], erroresProduct = [];

        if(errorCompany){
            erroresCompany = errorCompany.details.map(e => {
                console.info(e.message);
                return e.message;
            });
        }

        if(errorProduct){
            erroresProduct = errorProduct.details.map(e => {
                console.info(e.message);
                return e.message;
            });
        }

        let errores = erroresCompany.concat(erroresProduct);
        
        console.info('Preparando response');
        res.status(400).json({message: errores});
    }
    else{
        //Obtenemos la company
        console.info('Validaciones de tipo de datos exitosa');
        console.info(`Comprobando existencia de company ${req.params.companyId}`);
        let { company, message: companyMessage } = await getCompanyById(req.params.companyId);

        if(!company){
            //Si no se encuentra, retornamos error
            console.info(`No existe company con ID: ${req.params.companyId}`);
            console.info('Preparando response');
            res.status(400).json({message: companyMessage});
        }
        else{
            //Obtenemos el usuario
            console.info('Comprobando relacion usuario-empresa');
            let { user } = await getUserByEmail(req.body.userEmail);

            if(!user){
                //Si no se encuentra, retornamos error
                console.info('No se pudo encontrar el usuario');
                console('Preparando response');
                res.status(500).json({message: 'Ocurrio un error al buscar la informacion'});
            }
            else{
                //Verificamos relacion usuario - compania
                if(user.companyId === req.params.companyId){
                    //Obtenemos el companyProduct
                    console.info(`Obteniendo el companyProduct con ID: ${req.params.productId}`);
                    let { producto, message } = await getCompanyProductById(req.params.productId);
    
                    if(producto){
                        //Retornamos los datos
                        console.info(`Producto encontrado`);
                        console.info('Preparando response');
                        res.status(200).json(producto);
                    }
                    else{
                        //Si fallo damos error
                        console.info('No se encontraron productos');
                        console.info('Preparando response');
                        res.status(200).json({message});
                    }
                }
                else{
                    //Si usuario no corresponde con compania damos error
                    console.info('Usuario no corresponde con la empresa');
                    console.info('Preparando response');
                    res.status(400).json({message: 'Usuario no corresponse con la empresa'});
                }
            }
        }
    }
}

//Endpoint para obtener productos filtrando por code
async function obtenerProductByCode(req, res){
    console.info(`Conexion GET entrante : /api/product/company/deleted/${req.params.code}`);

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
        //Obtenemos los datos
        console.info(`Obteniendo producto con codigo: ${req.params.code}`);
        let { producto, message } = await getProductByCode(req.params.code);

        if(producto){
            //Retornamos los datos
            console.info(`Producto encontrado`);
            console.info('Preparando response');
            res.status(200).json(producto);
        }
        else{
            //Si fallo damos error
            console.info('No se encontraron productos');
            console.info('Preparando response');
            res.status(200).json({message});
        }
    }
}

//Endpoint para obtener productos filtrando por categoria
async function obtenerProductsByCategory(req, res){
    console.info(`Conexion GET entrante : /api/product/category/${req.params.id}`);

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
        //Obtenemos la categoria
        console.info('Validacion de tipos exitosa');
        console.info(`Comprobando existencia de categoria ${req.params.id}`);
        let { category, message: categoryMessage } = await getCategoryById(req.params.id);

        if(!category){
            //Si no se encuentra, retornamos error
            console.info(`No existe categoria con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message: categoryMessage});
        }
        else{
            //Obtenemos los datos
            console.info('Validacion de existencia exitosa');
            console.info(`Yendo a buscar productos con categoria con ID: ${req.params.id}`);
            let { productos, message } = await getProductsByCategory(req.params.id);

            if(productos){
                //Retornamos los datos
                console.info(`${productos.length} productos encontrados`);
                console.info('Preparando response');
                res.status(200).json(productos);
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

//Endpoint para obtener productos no asociados a una compania dada
async function obtenerNotAssociatedProductsByCompany(req, res){
    console.info(`Conexion GET entrante : /api/product/company/${req.params.id}/notassociated`);

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
            console.log(`Obteniendo los productos no asociados de la compania con ID: ${req.params.id}`);
            let { productos, message } = await getNotAssociatedProductsByCompany(req.params.id);

            if(productos){
                //Retornamos los datos
                console.info(`${productos.length} productos encontrados`);
                console.info('Preparando response');
                res.status(200).json(productos);
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

//Endpoint para registrar un nuevo producto
async function altaProductoVal(req, res){
    console.log('Conexion POST entrante : /api/product');

    //Llamamos auxiliar para registro de producto
    let { status, message } = await altaProducto(req.body, req.file);

    //Retornamos resultado
    res.status(status).json(message);
}

//Auxiliar para registrar un nuevo producto
async function altaProducto(body, file){
    
    //Creamos body para validacion de producto
    let valProduct = {
        name: body.name,
        code: body.code,
        categories: body.categories,
        imageName: file ? file.filename : 'producto.jpg',
        imagePath: file ? file.path : 'uploads/products/producto.jpg',
    };

    //Enviamos a validar los datos
    console.log('Comenzando validacion JOI de request');
    let { error } = validarProducto(valProduct);
    
    if(error){
        //Si hay error, rentornamos
        console.info('Erorres encontrados en la request');
        let errores = error.details.map(e => {
            console.info(e.message);
            return e.message;
        });
        return { status: 400, message: errores };
    }
    else{
        console.info('Validaciones de tipo de datos exitosa');
        console.info('Comenzando validaciones de existencia');

        //Inicializo array de errores
        let errorMessage = [];

        //Buscamos todas las entidades
        let { categories: valCategories, messages: categoriesMessages } = await validarCategorias(body.categories);
        let { producto: ProductoByName } = await getProductByName(valProduct.name);
        let { producto: ProductoByCode } = await getProductByCode(valProduct.code);

        if(!valCategories){
            //Si fallo la validacion de categorias
            console.info('Erorres encontrados en las categorias');
            categoriesMessages.map(msj => {
                console.info(msj);
                errorMessage.push(msj);
            });
        }
        if(ProductoByCode) errorMessage.push(`Ya existe un producto con Codigo ${valProduct.code}`);
        if(ProductoByName) errorMessage.push(`Ya existe un producto con Nombre ${valProduct.name}`);


        if(errorMessage.length > 0){
            //Si hay algun error, retornamos
            console.info(`Se encontraron ${errorMessage.length} errores de existencia en la request`);
            errorMessage.map(err => console.log(err));
            return { status: 400, message: errorMessage };
        }
        else{
            console.log('Validaciones de existencia exitosas');
            //Creamos body para insert
            let product = {
                    name: valProduct.name,
                    code: valProduct.code,
                    imageName: valProduct.imageName,
                    imagePath: valProduct.imagePath,
                    created: new Date(),
                }

            console.log('Enviando a insertar producto');
            let { id: productId, message: productMessage } = await insertProduct(product);

            if(productId){
                //Producto insertado
                console.log(`Producto insertado correctamente con ID: ${productId}`);

                //Preparamos para insert de relacion producto - categoria
                let prodCategoryIds = [];
                let rollback = false;
                let prodCategory = {
                    productId: productId
                }

                console.log(`Comenzando armado e insercion de ProductCategory para producto ${productId}`);
                let i = 0;
                let categoriesOk = true;
                //Insertamos cada categoria del producto
                while(i < body.categories.length && categoriesOk){
                    
                    prodCategory.categoryId = body.categories[i];
                    
                    console.log('Enviando Query INSERT para ProductCategory');
                    let { id: productCategoryId, message: productCategoryMessage } = await insertProductCategory(prodCategory);

                    if(!productCategoryId){
                        //Fallo insert, marcamos para rollback
                        console.log(`Fallo insert de ProductCategory con ID: ${prodCategory.categoryId}`);
                        errorMessage.push(productCategoryMessage);
                        rollback = true;
                        categoriesOk = false;
                    }
                    else{
                        //Insert exitoso, agregamos a array de IDs de producto - categoria
                        console.log(`ProductCategory insertada correctamente con ID: ${productCategoryId}`);
                        prodCategoryIds.push(productCategoryId);
                    }
                    i++;
                }

                if(!rollback){
                    //Retornamos OK
                    console.log('Alta de producto finalizada exitosamente');
                    return { status: 201, product: productId, categories: prodCategoryIds };
                }
                else{
                    //Marcado para rollback
                    console.log('Ocurrio un error en el proceso de inserts, comenzando rollback');

                    //Realizamos rollbacks de cada producto - categoria
                    console.log('Comenzando rollbacks de categorias');
                    for(let id of prodCategoryIds){
                        console.log(`Enviando rollback de ProductCategory ID: ${id}`);
                        let rollbackProductCategory = await rollbackInsertProductCategory(id);
                        if(rollbackProductCategory.res) console.log(`Rollback de ProductCategory ${id} realizado correctamente`);
                        else console.log(`Ocurrio un error en rollback de ProductCategory ${id}`);
                    }
                    //Realizamos rollback de producto
                    console.log('Comenzando rollbacks de producto');
                    let rollbackProduct = await rollbackInsertProduct(producto.id);
                    if(rollbackProduct.res) console.log(`Rollback de Producto ${id} realizado correctamente`);
                    else console.log(`Ocurrio un error en rollback de Producto ${id}`);
                    return { status: 500, message: 'Ocurrio un error en el alta de productos'};
                }   
            }
            else{
                //Fallo insert de producto
                console.log(`Error al insertar producto: ${productMessage}`);
                return { status: 500, message: productMessage };
            }
        }
    }
}

//Endpoint para asociar un producto existente a una compania
async function asociarProductoVal(req, res){
    console.log('Conexion POST entrante : /api/product/associate');

    //Llamamos auxiliar para asociar producto existente
    let { status, message } = await asociarProducto(req.body, req.file);

    //Retornamos resultado
    res.status(status).json(message);
}

//Auxiliar para asociar un producto existente a una compania
async function asociarProducto(body, file){
    console.log('Comenzando proceso de asociacion de producto');
    let valCompanyProduct = {
            productId: body.productId,
            companyId: body.companyId,
            name: body.name,
            description: body.description,
            stock: body.stock,
            price: body.price,
            imageName: file ? file.filename : 'producto.jpg',
            imagePath: file ? file.path : 'uploads/products/producto.jpg',
    };

    //Enviamos a validar datos
    console.log('Comenzando validacion JOI de request');
    let { error } = validarAsociacion(valCompanyProduct);
    
    if(error){
        //Si hay error, retornamos
        console.info('Erorres encontrados en la request');
        let errores = error.details.map(e => {
            console.info(e.message);
            return e.message;
        });
        return { status: 400, message: errores };
    }
    else{
        console.info('Validaciones de tipo de datos exitosa');
        //Obtenemos el usuario
        let { user } = await getUserByEmail(body.userEmail);

        if(user){
            //Verificamos relacion usuario compania de producto
            if(user.companyId === valCompanyProduct.companyId){
                console.info('Usuario corresponde con empresa');
                console.info('Comenzando validaciones de existencia');

                //Inicializo array de errores
                let errorMessage = [];
                //Obtenemos las entidades
                let { producto: productoById, message: productMessage } = await getProductById(valCompanyProduct.productId);
                let { company, message: companyMessage } = await getCompanyById(valCompanyProduct.companyId);
                let { producto: companyProductByProduct } = await getCompanyProductByProduct(valCompanyProduct.companyId, valCompanyProduct.productId);

                if(!productoById) errorMessage.push(productMessage);
                if(!company) errorMessage.push(companyMessage);
                if(companyProductByProduct) errorMessage.push(`La compania ya tiene asociado este producto`);

                if(errorMessage.length > 0){
                    //Si hay error, retornamos
                    console.info(`Se encontraron ${errorMessage.length} errores de existencia en la request`);
                    errorMessage.map(err => console.log(err));
                    return { status: 400, message: errorMessage };
                }
                else{
                    console.log('Validaciones de existencia exitosas');
                    console.info('Preparando objeto companyProduct para insertar');

                    //Si no se agrego una imagen, se usa la imagen del producto generico
                    if(!file){
                        valCompanyProduct.imageName = productoById.imageName;
                        valCompanyProduct.imagePath = productoById.imagePath;
                    }

                    //Creamos body para insert de companyProduct
                    let product = {
                        productId:valCompanyProduct.productId,
                        companyId: valCompanyProduct.companyId,
                        description: valCompanyProduct.description,
                        name: valCompanyProduct.name,
                        stock: valCompanyProduct.stock,
                        imageName: valCompanyProduct.imageName,
                        imagePath: valCompanyProduct.imagePath,
                        created: new Date(),
                    }

                    console.log('Enviando a insertar companyProduct');
                    let { id: companyProductId, message: companyProductMessage } = await associateProduct(product);

                    if(companyProductId){
                        //Insertado correctamente
                        console.log(`CompanyProduct insertado correctamente con ID: ${companyProductId}`);

                        //Preparamos body para insert de precio
                        let precio = {
                            price: valCompanyProduct.price,
                            productId: companyProductId,
                            validDateFrom: new Date(),
                        };

                        //Enviamos a insertar precio
                        let {id: priceId, message: priceMessage} = await insertPrice(precio);

                        if(priceId){
                            //Precio insertado correctamente
                            console.log(`Price insertado correctamente con ID: ${priceId}`);

                            console.log('Asociacion de producto finalizada exitosamente');
                            return { status: 201, companyProduct: companyProductId };
                        }
                        else{
                            //Fallo insertar precio, procedemos con rollback
                            console.log(`Error al insertar price: ${priceMessage}`);
                            console.log('Ocurrio un error en el proceso de inserts, comenzando rollback');

                            console.log('Comenzando rollbacks de companyProduct');
                            let rollbackCompanyProducto = await rollbackInsertAssociateProduct(companyProductId);
                            if(rollbackCompanyProducto.res) console.log(`Rollback de CompanyProduct ${companyProductId} realizado correctamente`);
                            else console.log(`Ocurrio un error en rollback de Producto ${companyProductId}`);
                            return { status: 500, message: 'Ocurrio un error al asociar producto' };
                        }
                    }  
                    else{
                        //Si fallo insertar companyProduct
                        console.log(`Error al insertar producto: ${companyProductMessage}`);
                        return { status: 500, message: companyProductMessage };
                    }
                }
            }
            else{
                //Si no hay relacion usuario - compania
                console.info('El usuario no corresponse con la empresa');
                return { status: 400, message: 'El usuario no corresponse con la empresa' };
            }
        }
        else{
            //Si no existe el usuario
            console.info('No se pudo encontrar el usuario');
            return { status: 500, message: 'Ocurrio un error al asociar producto' };
        }
    }
}

//Endpoint para registrar y asociar un nuevo producto
async function altaAsociacionProducto(req, res){
    console.log('Conexion POST entrante : /api/product/company');

    //Preparamos array de categorias
    req.body.categories = JSON.parse('[' + req.body.categories + ']');

    //Llamamos a auxiliar para registrar nuevo producto
    let { status: altaStatus, message: altaMessage, product, categories } = await altaProducto(req.body, req.file);

    if(altaStatus === 201){
        //Alta de producto exitosa, agregamos ID
        req.body.productId = Number(product);
        //Llamamos auxiliar para asociar producto
        let { status: asociarStatus, message: asociarMessage, companyProduct } = await asociarProducto(req.body, req.file);

        if(asociarStatus === 201){
            //Asociacion exitosa, retornamos OK
            res.status(201).json({id: Number(companyProduct)});
        }
        else{
            //Fallo asociacion, realiamos rollbacks
            for(let cat of categories){
                //Rollbacks de producto - categoria
                console.log(`Enviando rollback de ProductCategory ID: ${cat}`);
                let rollbackProductCategory = await rollbackInsertProductCategory(cat);
                if(rollbackProductCategory.res) console.log(`Rollback de ProductCategory ${cat} realizado correctamente`);
                else console.log(`Ocurrio un error en rollback de ProductCategory ${cat}`);
            }
            //Rollback de producto
            console.log('Comenzando rollbacks de producto');
            let rollbackProduct = await rollbackInsertProduct(product);
            if(rollbackProduct.res) console.log(`Rollback de Producto ${product} realizado correctamente`);
            else console.log(`Ocurrio un error en rollback de Producto ${product}`);
            
            res.status(asociarStatus).json(asociarMessage);
        }
    }
    else{
        //Fallo registro de producto
        res.status(altaStatus).json(altaMessage);
    }
}

//Endpoint para modificar companyProduct existente
async function modificarProducto(req, res){
    console.info(`Conexion PUT entrante : /api/product/${req.params.productId}/company/${req.params.companyId}`);

    //Validamos parametros de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error: errorCompany } = validarId(req.params.companyId);
    let { error: errorProduct } = validarId(req.params.productId);

    if(errorCompany || errorProduct){
        //Si hay error, retornamos
        console.info('Erorres encontrados en la request');
        let erroresCompany = [], erroresProduct = [];

        if(errorCompany){
            erroresCompany = errorCompany.details.map(e => {
                console.info(e.message);
                return e.message;
            });
        }

        if(errorProduct){
            erroresProduct = errorProduct.details.map(e => {
                console.info(e.message);
                return e.message;
            });
        }

        let errores = erroresCompany.concat(erroresProduct);
        
        console.info('Preparando response');
        res.status(400).json({message: errores});
    }
    else{
        console.info('Enviando a validar tipos de datos en request');

        //Cremoas body para validacion de datos
        let valCompanyProduct = {
            name: req.body.name,
            description: req.body.description,
            price: Number(req.body.price),
            stock: req.body.stock,
            imageName: req.file ? req.file.filename : null,
            imagePath: req.file ? req.file.path : null
        };

        //Inicializo array de errores
        let errorMessage = [];

        //Enviamos a validar datos
        console.info(`Comenzando validacion de tipos`);
        let { error: errorCompanyProduct} = validarModificacionCompanyProduct(valCompanyProduct);

        if(errorCompanyProduct) {
            //Si hay error, agregamos al array
            console.info('Errores encontrados en la validacion de tipos de companyProduct');
            errorCompanyProduct.details.map(e => {
                console.info(e.message);
                errorMessage.push(e.message);
                return;
            });
        }

        if(errorMessage.length > 0){
            //Si hay error, retornamos
            console.info(`Se encontraron ${errorMessage.length} errores de tipo en la request`);
            errorMessage.map(err => console.log(err));
            console.info('Enviando response');
            res.status(400).json({message: errorMessage});
        }
        else{
            console.info('Validacion de tipos exitosa');
            console.info('Comenzando validaciones de existencia');

            //Buscamos las entidades
            let { producto: productById, message: productByIdMessage } = await getCompanyProductById(req.params.productId);
            let { company: companyById, message: companyByIdMessage } = await getCompanyById(req.params.companyId);
            let { price:  precioActual, message: precioMessage } = await getCurrentPrice(req.params.productId);

            //Si hay errores, agregamos al array
            if(!productById) errorMessage.push(productByIdMessage);
            if(!precioActual) errorMessage.push(precioMessage);
            if(!companyById) errorMessage.push(companyByIdMessage);

            if(errorMessage.length > 0){
                //Si hay error, retornamos
                console.info(`Se encontraron ${errorMessage.length} errores de existencia en la request`);
                errorMessage.map(err => console.log(err));
                console.info('Enviando response');
                res.status(400).json({message: errorMessage});
            }
            else{
                console.info('Validacion de existencia exitosas');
                console.info('Preparando objeto para update de CompanyProduct');
                //Creamos body para update
                let product = {
                    companyId: productById.companyId,
                    productId: productById.productId,
                    name: valCompanyProduct.name,
                    description: valCompanyProduct.description,
                    stock: valCompanyProduct.stock,
                    imageName: valCompanyProduct.imageName ? valCompanyProduct.imageName : productById.imageName,
                    imagePath: valCompanyProduct.imagePath ? valCompanyProduct.imagePath : productById.imagePath
                };

                //Llamamos auxiliar para update de companyProduct
                let { result, message: updateMessage } = await updateProduct(req.params.productId, product);

                if(result){
                    //Update exitoso
                    console.info(`CompanyProduct con ID: ${req.params.productId} actualizada correctamente`);

                    if(precioActual.price !== valCompanyProduct.price){
                        //Creamos body para nuevo precio
                        let precio = {
                            price: valCompanyProduct.price,
                            productId: req.params.productId,
                            validDateFrom: new Date(),
                        };

                        //enviamos a insertar nuevo precio
                        let { id: priceId, message: priceMessage } = await insertPrice(precio);

                        if(priceId){
                            //Precio insertado correctamente
                            console.log(`Price insertado correctamente con ID: ${priceId}`);

                            console.log('Modificacion de producto finalizada exitosamente');
                            res.status(200).json({message: 'Modificacion exitosa'});
                        }
                        else{
                            //Fallo insert de precio, procediendo con rollback
                            console.log(`Error al insertar price: ${priceMessage}`);
                            console.log('Comenzando rollbacks de companyProduct');
                            //Creamos body con datos de companyProduct anterior
                            let productRollback = {
                                companyId: productById.companyId,
                                productId: productById.productId,
                                name: productById.name,
                                description: productById.description,
                                stock: productById.stock,
                                imageName: productById.imageName,
                                imagePath: productById.imagePath,
                            };

                            //Llamamos auxiliar de update de companyProduct
                            let { result: resultUpdateRollback, message: updateRollbackMessage } = await updateProduct(req.params.productId, productRollback);

                            if(resultUpdateRollback){
                                //Rollback exitoso
                                console.info(`CompanyProduct con ID: ${req.params.productId} corregido correctamente`);
                            }
                            else{
                                //Fallo rollback
                                console.info('No se pudo realizar rollbacks de companyProduct');
                                console.info(updateRollbackMessage);
                                console.info('Preparando response');
                                res.status(500).json({message: 'Ocurrio un error al modificar el companyProduct'});
                            }
                        }
                    }
                    else{
                        //Update exitoso
                        console.info('Modificacion termianda');
                        let { producto: prod, message: prodMessage } = await getCompanyProductById(req.params.productId);
                        console.info('Preparando response');
                        res.status(200).json({message: 'Modificacion exitosa', product: prod});
                    }
                }
                else{
                    //Fallo update de companyProduct
                    console.info('No se pudo modificar companyProduct');
                    console.info('Preparando response');
                    res.status(500).json({message: updateMessage});
                }
            }
        }
    }
}

//Endpoint para eliminar companyProduct existente
async function eliminarProducto(req, res){
    console.info(`Conexion DELETE entrante : /api/product/${req.params.id}`);

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
        console.info('Comenzando validaciones de existencia');
        //Obtenemos el companyProduct
        let { producto, message } = await getCompanyProductById(req.params.id);

        if(!producto){
            //Si no se encontro, retornamos
            console.info(`No existe companyProduct con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message});
        }
        else{
            //Obtenemos el usuario
            let { user } = await getUserByEmail(req.body.userEmail);

            if(user){
                //Verificamos relacion usuario - compania
                if(user.companyId === producto.companyId){

                    let { packageProducts } = await comprobarParaEliminar(producto.id, producto.companyId);

                    if(packageProducts && packageProducts.length > 0){
                        console.info(`Producto existe en ${packageProducts.length} paquetes activos`);
                        console.info(`No se puede eliminar producto`);
                        console.info('Preparando response');
                        res.status(400).json({ message: `Producto existe en ${packageProducts.length} paquetes activos` });
                    }
                    else{
                        console.info('Enviando request para eliminacion');
                        //Enviamos a borrar el companyProduct (update que inserta timestamp en campo 'deleted')
                        let { result, message: deleteMessage } = await deleteCompanyProduct(req.params.id, new Date());
                        
                        if(result){
                            //Si salio bien, retornamos
                            console.info(`CompanyProduct con ID: ${req.params.id} eliminado correctamente`);
                            console.info('Preparando response');
                            res.status(200).json({message: 'Borrado exitoso'});
                        }
                        else{
                            //Si fallo damos error
                            console.info('No se pudo eliminar CompanyProduct');
                            console.info('Preparando response');
                            res.status(500).json({message: deleteMessage});
                        }  
                    }                 
                }
                else{
                    //Si no existe relacion usuario - compania
                    console.info('Usuario no corresponde con la empresa del producto');
                    console.info('Preparando response');
                    res.status(400).json({message: 'Usuario no corresponde con la empresa del producto'});
                }
            }
            else{
                //Si no existe usuario
                console.info('No se pudo encontrar el usuario');
                console.info('Preparando response');
                res.status(500).json('Ocurrio un error al intener borrar el companyProduct');
            }
        }
    }
}

//Auxiliar para obtener todos los productos no borrados
async function getProducts(){
    console.info('Buscando todos los productos');
    let message ='';
    //Conectamos con las queries
    let products = await queries
                        .products
                        .getAll()
                        .then(async data => {
                            //Si se consiguio la info
                            if(data){
                                console.info('Informacion de productos obtenida');
                                let flag = true;
                                for(let p of data){
                                    let categories = [];
                                    //Arreglamos el path de las imagenes
                                    if(p.imagePath) p.imagePath = p.imagePath.replace(/\\/g, '/');
                                    //Obtenemos las categorias de cada producto
                                    let { categorias: categoriesIds } = await getProductCategoryByProduct(p.id);
                                    if(categoriesIds){
                                        for(let c of categoriesIds){
                                            //Obtenemos los datos de la categoria
                                            let { category } = await getCategoryById(c.categoryId);
                                            categories.push(category);
                                        }
                                        p.categories = categories;
                                    }
                                    else{
                                        //Fallo la busqueda de categorias
                                        console.info('Ocurrio un error obteniendo las categorias del producto');
                                        message = 'Ocurrio un error al obtener los productos';
                                        flag = false;
                                    }
                                    
                                }
                                if(flag) return data;
                                else return null;
                            }
                            else{
                                //Si no se consiguieron datos
                                console.info('No existen productos registrados en la BD');
                                message = 'No existen productos registrados en la BD';
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de Product : ${err}`);
                            message = 'Ocurrio un error al obtener los productos';
                            return null;
                        });
    return { products , message };
}

//Auxiliar para obtener todos los companyProducts no borrados
async function getCompanyProducts(){
    console.info('Buscando todos los productos de companias no eliminados');
    let message ='';
    //Conectamos con las queries
    let companyProducts = await queries
                        .companyProduct
                        .getCompanyProducts()
                        .then(async data => {
                            //Si se consiguio la info
                            if(data){
                                console.info('Informacion de productos no eliminados de companias obtenida');
                                let flag = true;
                                for(let p of data.rows){
                                    let categories = [];
                                    //Arreglamos el path de las imagenes
                                    if(p.imagePath) p.imagePath = p.imagePath.replace(/\\/g, '/');
                                    //Obtenemos las categorias de cada producto
                                    let { categorias: categoriesIds } = await getProductCategoryByProduct(p.productId);
                                    if(categoriesIds){
                                        for(let c of categoriesIds){
                                            //Obtenemos los datos de la categoria
                                            let { category } = await getCategoryById(c.categoryId);
                                            categories.push(category);
                                        }
                                        p.categories = categories;
                                    }
                                    else{
                                        //Fallo la busqueda de categorias
                                        console.info('Ocurrio un error obteniendo las categorias del producto');
                                        message = 'Ocurrio un error al obtener los productos';
                                        flag = false;
                                    }
                                }
                                if(flag) return data.rows;
                                else return null;
                            }
                            else{
                                //Si no se consiguieron datos
                                console.info('No existen productos no eliminados de companias registrados en la BD');
                                message = 'No existen productos no eliminados de companias registrados en la BD';
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de CompanyProduct : ${err}`);
                            message = 'Ocurrio un error al obtener los productos de companias';
                            return null;
                        });
    return { companyProducts , message };
}

//Auxiliar para obtener todos los companyProducts
async function getAllCompanyProducts(){
    console.info('Buscando todos los productos de companias, incluyendo eliminados');
    let message ='';
    //Conectamos con las queries
    let companyProducts = await queries
                        .companyProduct
                        .getAll()
                        .then(async data => {
                            //Si se consiguio la info
                            if(data){
                                console.info('Informacion de productos obtenida');
                                let flag = true;
                                for(let p of data.rows){
                                    let categories = [];
                                    //Arreglamos el path de las imagenes
                                    if(p.imagePath) p.imagePath = p.imagePath.replace(/\\/g, '/');
                                    //Obtenemos las categorias de cada producto
                                    let { categorias: categoriesIds } = await getProductCategoryByProduct(p.productId);
                                    if(categoriesIds){
                                        for(let c of categoriesIds){
                                            //Obtenemos los datos de la categoria
                                            let { category } = await getCategoryById(c.categoryId);
                                            categories.push(category);
                                        }
                                        p.categories = categories;
                                    }
                                    else{
                                        //Fallo la busqueda de categorias
                                        console.info('Ocurrio un error obteniendo las categorias del producto');
                                        message = 'Ocurrio un error al obtener los productos';
                                        flag = false;
                                    }
                                }
                                if(flag) return data.rows;
                                else return null;
                            }
                            else{
                                //Si no se consiguieron datos
                                console.info('No existen productos de companias registrados en la BD');
                                message = 'No existen productos de companias registrados en la BD';
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de CompanyProduct : ${err}`);
                            message = 'Ocurrio un error al obtener los productos de companias';
                            return null;
                        });
    return { companyProducts , message };
}

//Auxiliar para obtener todos los companyProducts borrados
async function getDeletedCompanyProducts(){
    console.info('Buscando todos los productos de companias eliminados');
    let message ='';
    //Conectamos con las queries
    let CompanyProducts = await queries
                        .companyProduct
                        .getDeleted()
                        .then(async data => {
                            //Si se consiguio la info
                            if(data){
                                console.info('Informacion de productos de companias eliminados obtenida');
                                let flag = true;
                                for(let p of data.rows){
                                    let categories = [];
                                    //Arreglamos el path de las imagenes
                                    if(p.imagePath) p.imagePath = p.imagePath.replace(/\\/g, '/');
                                    //Obtenemos las categorias de cada producto
                                    let { categorias: categoriesIds } = await getProductCategoryByProduct(p.productId);
                                    if(categoriesIds){
                                        for(let c of categoriesIds){
                                            //Obtenemos los datos de la categoria
                                            let { category } = await getCategoryById(c.categoryId);
                                            categories.push(category);
                                        }
                                        p.categories = categories;
                                    }
                                    else{
                                        //Fallo la busqueda de categorias
                                        console.info('Ocurrio un error obteniendo las categorias del producto');
                                        message = 'Ocurrio un error al obtener los productos';
                                        flag = false;
                                    }
                                }
                                if(flag) return data.rows;
                                else return null;
                            }
                            else{
                                //Si no se consiguieron datos
                                console.info('No existen productos de companias eliminados registrados en la BD');
                                message = 'No existen productos de companias eliminados registrados en la BD';
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de CompanyProduct : ${err}`);
                            message = 'Ocurrio un error al obtener los productos eliminados de companias';
                            return null;
                        });
    return { CompanyProducts , message };
}

//Auxiliar para obtener conmpanyProducts filtrando por ID de compania
async function getCompanyProductsByCompany(id){
    console.info(`Buscando todos los productos habilitados de la compania con id : ${id}`);
    let message ='';
    //Conectamos con las queries
    let companyProducts = await queries
                        .companyProduct
                        .getByCompany(id)
                        .then(async data => {
                            //Si se consiguio la info
                            if(data){
                                console.info(`Informacion de productos habilitados de la compania con id : ${id},  obtenida`);
                                let flag = true;
                                for(let p of data.rows){
                                    let categories = [];
                                    //Arreglamos el path de las imagenes
                                    if(p.imagePath) p.imagePath = p.imagePath.replace(/\\/g, '/');
                                    //Obtenemos las categorias de cada producto
                                    let { categorias: categoriesIds } = await getProductCategoryByProduct(p.productId);
                                    if(categoriesIds){
                                        for(let c of categoriesIds){
                                            //Obtenemos los datos de la categoria
                                            let { category } = await getCategoryById(c.categoryId);
                                            categories.push(category);
                                        }
                                        p.categories = categories;
                                    }
                                    else{
                                        //Fallo la busqueda de categorias
                                        console.info('Ocurrio un error obteniendo las categorias del producto');
                                        message = 'Ocurrio un error al obtener los productos';
                                        flag = false;
                                    }
                                }
                                if(flag) return data.rows;
                                else return null;
                            }
                            else{
                                //Si no se consiguieron datos
                                console.info(`No existen productos habilitados para la compania con id : ${id}, registrados en la BD`);
                                message = `No existen productos habilitados para la compania con id : ${id}, registrados en la BD`;
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de CompanyProduct : ${err}`);
                            message = 'Ocurrio un error al obtener los productos hanilitados de la compania';
                            return null;
                        });
    return { companyProducts , message };
}

//Auxiliar para obtener productos no asociados a una compania dada
async function getNotAssociatedProductsByCompany(id){
    console.info(`Buscando todos los productos no associados a la compania con ID: ${id}`);
    let message ='';
    //Conectamos con las queries
    let productos = await queries
                        .products
                        .getNotAssociated(id)
                        .then(async data => {
                            //Si se consiguio la info
                            if(data){
                                console.info(`Informacion de productos no asociados a la compania con ID : ${id},  obtenida`);
                                let flag = true;
                                for(let p of data.rows){
                                    let categories = [];
                                    //Arreglamos el path de las imagenes
                                    if(p.imagePath) p.imagePath = p.imagePath.replace(/\\/g, '/');
                                    //Obtenemos las categorias de cada producto
                                    let { categorias: categoriesIds } = await getProductCategoryByProduct(p.id);
                                    if(categoriesIds){
                                        for(let c of categoriesIds){
                                            //Obtenemos los datos de la categoria
                                            let { category } = await getCategoryById(c.categoryId);
                                            categories.push(category);
                                        }
                                        p.categories = categories;
                                    }
                                    else{
                                        //Fallo la busqueda de categorias
                                        console.info('Ocurrio un error obteniendo las categorias del producto');
                                        message = 'Ocurrio un error al obtener los productos';
                                        flag = false;
                                    }
                                }
                                if(flag) return data.rows;
                                else return null;
                            }
                            else{
                                //Si no se consiguieron datos
                                console.info(`No existen productos habilitados para la compania con id : ${id}, registrados en la BD`);
                                message = `No existen productos habilitados para la compania con id : ${id}, registrados en la BD`;
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de CompanyProduct : ${err}`);
                            message = 'Ocurrio un error al obtener los productos hanilitados de la compania';
                            return null;
                        });
    return { productos , message };
}

//Auxiliar para obtener companyProducts filtrando por ID de producto
async function getCompanyProductsByProduct(id){
    console.info(`Buscando todos los companyProduct para el producto: ${id}`);
    let message ='';
    //Conectamos con las queries
    let companyProducts = await queries
                        .companyProduct
                        .getByProduct(id)
                        .then(async data => {
                            //Si se consiguio la info
                            if(data){
                                console.info(`Informacion de companyProducts de producto con ID : ${id},  obtenida`);
                                let flag = true;
                                for(let p of data.rows){
                                    let categories = [];
                                    //Arreglamos el path de las imagenes
                                    if(p.imagePath) p.imagePath = p.imagePath.replace(/\\/g, '/');
                                    //Obtengo la compania del companyProduct
                                    let { company } = await getCompanyById(p.companyId);
                                    if(company) p.companyName = company.name;
                                    else {
                                        //Fallo busqueda de compania
                                        flag = false;
                                        console.info('Ocurrio un error obteniendo la company del producto');
                                        message = 'Ocurrio un error al obtener los productos';
                                    }
                                    //Obtenemos las categorias de cada producto
                                    let { categorias: categoriesIds } = await getProductCategoryByProduct(p.productId);
                                    if(categoriesIds){
                                        for(let c of categoriesIds){
                                            //Obtenemos los datos de la categoria
                                            let { category } = await getCategoryById(c.categoryId);
                                            categories.push(category);
                                        }
                                        p.categories = categories;
                                    }
                                    else{
                                        //Fallo la busqueda de categorias
                                        console.info('Ocurrio un error obteniendo las categorias del producto');
                                        message = 'Ocurrio un error al obtener los productos';
                                        flag = false;
                                    }
                                }
                                if(flag) return data.rows;
                                else return null;
                            }
                            else{
                                //Si no se consiguieron datos
                                console.info(`No existen companyProduct para el producto con ID : ${id}, registrados en la BD`);
                                message = `No existen companyProduct para el producto con ID : ${id}, registrados en la BD`;
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de CompanyProduct : ${err}`);
                            message = 'Ocurrio un error al obtener los companyProducts para el producto';
                            return null;
                        });
    return { companyProducts , message };
}

//Auxiliar para obtener todos los companyProducts filtrando por ID de company
async function getAllCompanyProductsByCompany(id){
    console.info(`Buscando todos los productos de la compania con id : ${id}`);
    let message ='';
    //Conectamos con las queries
    let CompanyProducts = await queries
                        .companyProduct
                        .getAllByCompany(id)
                        .then(async data => {
                            //Si se consiguio la info
                            if(data){
                                console.info(`Informacion de productos de la compania con id : ${id},  obtenida`);
                                let flag = true;
                                for(let p of data.rows){
                                    let categories = [];
                                    //Arreglamos el path de las imagenes
                                    if(p.imagePath) p.imagePath = p.imagePath.replace(/\\/g, '/');
                                    //Obtenemos las categorias de cada producto
                                    let { categorias: categoriesIds } = await getProductCategoryByProduct(p.productId);
                                    if(categoriesIds){
                                        for(let c of categoriesIds){
                                            //Obtenemos los datos de la categoria
                                            let { category } = await getCategoryById(c.categoryId);
                                            categories.push(category);
                                        }
                                        p.categories = categories;
                                    }
                                    else{
                                        //Fallo la busqueda de categorias
                                        console.info('Ocurrio un error obteniendo las categorias del producto');
                                        message = 'Ocurrio un error al obtener los productos';
                                        flag = false;
                                    }
                                }
                                if(flag) return data.rows;
                                else return null;
                            }
                            else{
                                //Si no se consiguieron datos
                                console.info(`No existen productos para la compania con id : ${id}, registrados en la BD`);
                                message = `No existen productos para la compania con id : ${id}, registrados en la BD`;
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de CompanyProduct : ${err}`);
                            message = 'Ocurrio un error al obtener los productos de la compania';
                            return null;
                        });
    return { CompanyProducts , message };
}

//Auxiliar para obtener companyProducts borrados filtrando por ID de company
async function getDeletedProductsByCompany(id){
    console.info(`Buscando todos los productos eliminados de la compania con id : ${id}`);
    let message ='';
    //Conectamos con las queries
    let companyProducts = await queries
                        .companyProduct
                        .getDeleteByCompany(id)
                        .then(async data => {
                            //Si se consiguio la info
                            if(data){
                                console.info(`Informacion de productos eliminados de la compania con id : ${id},  obtenida`);
                                let flag = true;
                                for(let p of data.rows){
                                    let categories = [];
                                    //Arreglamos el path de las imagenes
                                    if(p.imagePath) p.imagePath = p.imagePath.replace(/\\/g, '/');
                                    //Obtenemos las categorias de cada producto
                                    let { categorias: categoriesIds } = await getProductCategoryByProduct(p.productId);
                                    if(categoriesIds){
                                        for(let c of categoriesIds){
                                            //Obtenemos los datos de la categoria
                                            let { category } = await getCategoryById(c.categoryId);
                                            categories.push(category);
                                        }
                                        p.categories = categories;
                                    }
                                    else{
                                        //Fallo la busqueda de categorias
                                        console.info('Ocurrio un error obteniendo las categorias del producto');
                                        message = 'Ocurrio un error al obtener los productos';
                                        flag = false;
                                    }
                                }
                                if(flag) return data.rows;
                                else return null;
                            }
                            else{
                                //Si no se consiguieron datos
                                console.info(`No existen productos eliminados para la compania con id : ${id}, registrados en la BD`);
                                message = `No existen productos eliminados para la compania con id : ${id}, registrados en la BD`;
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de CompanyProduct : ${err}`);
                            message = 'Ocurrio un error al obtener los productos eliminados de la compania';
                            return null;
                        });
    return { companyProducts , message };
}

//Auxiliar para obtener productos filtrando por ID
async function getProductById(id){
    console.info(`Buscando producto con id: ${id}`);
    let message = '';
    //Conectamos con las queries
    let producto = await queries
                    .products
                    .getOneById(id)
                    .then(async data => {
                        //Si se consiguio la info
                        if(data){
                            console.info(`Producto con ID: ${id} encontrado`);
                            let flag = true;
                            let categories = [];
                            //Arreglamos el path de las imagenes
                            if(data.imagePath) data.imagePath = data.imagePath.replace(/\\/g, '/');
                            //Obtenemos las categorias de cada producto
                            let { categorias: categoriesIds } = await getProductCategoryByProduct(data.id);
                            if(categoriesIds){
                                for(let c of categoriesIds){
                                    //Obtenemos los datos de la categoria
                                    let { category } = await getCategoryById(c.categoryId);
                                    categories.push(category);
                                }
                                data.categories = categories;
                            }
                            else{
                                //Fallo la busqueda de categorias
                                console.info('Ocurrio un error obteniendo las categorias del producto');
                                message = 'Ocurrio un error al obtener los productos';
                                flag = false;
                            }

                            if(flag) return data;
                            else return null;
                        }
                        else{
                            //Si no se consiguieron datos
                            console.info(`No existe producto con id: ${id}`);
                            message = `No existe un producto con id ${id}`;
                            return null;
                        }
                    })
                    .catch(err => {
                        console.error(`Error en Query SELECT de Product : ${err}`);
                        message = 'Ocurrio un error al obtener el producto';
                        return null;
                    });
    return { producto, message };
}

//Auxiliar para obtener productos filtrando por code
async function getProductByCode(code){
    console.info(`Buscando producto con codigo: ${code}`);
    let message = '';
    //Conectamos con las queries
    let producto = await queries
                    .products
                    .getOneByCode(code)
                    .then(async data => {
                        //Si se consiguio la info
                        if(data){
                            console.info(`Producto con Codigo: ${code} encontrado`);
                            let flag = true;
                            let categories = [];
                            //Arreglamos el path de las imagenes
                            if(data.imagePath) data.imagePath = data.imagePath.replace(/\\/g, '/');
                            //Obtenemos las categorias de cada producto
                            let { categorias: categoriesIds } = await getProductCategoryByProduct(data.id);
                            if(categoriesIds){
                                for(let c of categoriesIds){
                                    //Obtenemos los datos de la categoria
                                    let { category } = await getCategoryById(c.categoryId);
                                    categories.push(category);
                                }
                                data.categories = categories;
                            }
                            else{
                                //Fallo la busqueda de categorias
                                console.info('Ocurrio un error obteniendo las categorias del producto');
                                message = 'Ocurrio un error al obtener los productos';
                                flag = false;
                            }

                            if(flag) return data;
                            else return null;
                        }
                        else{
                            //Si no se consiguieron datos
                            console.info(`No existe producto con codigo: ${code}`);
                            message = `No existe un producto con codigo ${code}`;
                            return null;
                        }
                    })
                    .catch(err => {
                        console.error(`Error en Query SELECT de Product : ${err}`);
                        message = 'Ocurrio un error al obtener el producto';
                        return null;
                    });
    return { producto, message };
}

//Auxiliar para obtener productos filtrando por nombre
async function getProductByName(name){
    console.info(`Buscando producto con nombre: ${name}`);
    let message = '';
    //Conectamos con las queries
    let producto = await queries
                    .products
                    .getByName(name)
                    .then(data => {
                        //Si se consiguio la info
                        if(data){
                            console.info(`Producto con Nombre: ${name} encontrado`);
                            return data;
                        }
                        else{
                            //Si no se consiguieron datos
                            console.info(`No existe producto con nombre: ${name}`);
                            message = `No existe un producto con nombre ${name}`;
                            return null;
                        }
                    })
                    .catch(err => {
                        console.error(`Error en Query SELECT de Product : ${err}`);
                        message = 'Ocurrio un error al obtener el producto';
                        return null;
                    });
    return { producto, message };
}

//Auxiliar para obtener companyProducts filtrando por ID
async function getCompanyProductById(id){
    console.info(`Buscando CompanyProduct con id: ${id}`);
    let message = '';
    //Conectamos con las queries
    let producto = await queries
                    .companyProduct
                    .getOneById(id)
                    .then(async data => {
                        //Si se consiguio la info
                        if(data){
                            console.info(`CompanyProduct con id: ${id} encontrado`);
                            let flag = true;
                            let categories = [];
                            //Arreglamos el path de las imagenes
                            if(data.rows[0].imagePath) data.rows[0].imagePath = data.rows[0].imagePath.replace(/\\/g, '/');
                            //Obtenemos las categorias de cada producto
                            let { categorias: categoriesIds } = await getProductCategoryByProduct(data.rows[0].productId);
                            if(categoriesIds){
                                for(let c of categoriesIds){
                                    //Obtenemos los datos de la categoria
                                    let { category } = await getCategoryById(c.categoryId);
                                    categories.push(category);
                                }
                                data.rows[0].categories = categories;
                            }
                            else{
                                //Fallo la busqueda de categorias
                                console.info('Ocurrio un error obteniendo las categorias del producto');
                                message = 'Ocurrio un error al obtener los productos';
                                flag = false;
                            }

                            if(flag) return data.rows[0];
                            else return null;
                        }
                        else{
                            //Si no se consiguieron datos
                            console.info(`No existe CompanyProduct con ID: ${id}`);
                            message = `No existe un CompanyProduct con ID ${id}`;
                            return null;
                        }
                    })
                    .catch(err => {
                        console.error(`Error en Query SELECT de CompanyProduct : ${err}`);
                        message = 'Ocurrio un error al obtener el producto';
                        return null;
                    });
    return { producto, message };
}

//Auxiliar para obtener companyProducts filtrando por ID de producto
async function getCompanyProductByProduct(idComp, idProd){
    console.info(`Buscando CompanyProduct con productId: ${idProd} para la compania ${idComp}`);
    let message = '';
    //Conectamos con las queries
    let producto = await queries
                    .companyProduct
                    .getOneByProductByCompany(idComp, idProd)
                    .then(data => {
                        //Si se consiguio la info
                        if(data.rows.length > 0){
                            console.info(`CompanyProduct con productId: ${idProd} para compania ${idComp} encontrado`);
                            //Arreglamos el path de las imagenes
                            if(data.rows[0].imagePath) data.rows[0].imagePath = data.rows[0].imagePath.replace(/\\/g, '/');
                            return data.rows[0];
                        }
                        else{
                            //Si no se consiguieron datos
                            console.info(`No existe CompanyProduct con productId: ${idProd} para la compania ${idComp}`);
                            message = `No existe un CompanyProduct con productId ${idProd} para la compania ${idComp}`;
                            return null;
                        }
                    })
                    .catch(err => {
                        console.error(`Error en Query SELECT de CompanyProduct : ${err}`);
                        message = 'Ocurrio un error al obtener el producto';
                        return null;
                    });
    return { producto, message };
}

//Auxiliar para obtener companyProducts filtrando por categoria
async function getProductsByCategory(categoryId){
    console.info(`Buscando productos de la categoria: ${categoryId}`);
    let message = '';
    //Conectamos con las queries
    let productos = await queries
                    .products
                    .getByCategoryId(categoryId)
                    .then(async data => {
                        //Si se consiguio la info
                        if(data){
                            console.info(`Productos con categoria: ${categoryId} encontrados`);
                            let flag = true;
                                for(let p of data.rows){
                                    let categories = [];
                                    //Arreglamos el path de las imagenes
                                    if(p.imagePath) p.imagePath = p.imagePath.replace(/\\/g, '/');
                                    //Obtenemos las categorias de cada producto
                                    let { categorias: categoriesIds } = await getProductCategoryByProduct(p.id);
                                    if(categoriesIds){
                                        for(let c of categoriesIds){
                                            //Obtenemos los datos de la categoria
                                            let { category } = await getCategoryById(c.categoryId);
                                            categories.push(category);
                                        }
                                        p.categories = categories;
                                    }
                                    else{
                                        //Fallo la busqueda de categorias
                                        console.info('Ocurrio un error obteniendo las categorias del producto');
                                        message = 'Ocurrio un error al obtener los productos';
                                        flag = false;
                                    }
                                }
                                if(flag) return data.rows;
                                else return null;
                        }
                        else{
                            //Si no se consiguieron datos
                            console.info(`No existen productos con categoria: ${categoryId}`);
                            message = `No existen productos con categoria ${categoryId}`;
                            return null;
                        }
                    })
                    .catch(err => {
                        console.error(`Error en Query SELECT de Product : ${err}`);
                        message = 'Ocurrio un error al obtener el producto';
                        return null;
                    });
    return { productos, message };
}

//Auxiliar para obtener relacion producto - categoria filtrando por ID de producto
async function getProductCategoryByProduct(productId){
    console.info(`Buscando categorias del producto: ${productId}`);
    let message = '';
    //Conectamos con las queries
    let categorias = await queries
                    .prodCategory
                    .getByProductId(productId)
                    .then(data => {
                        //Si se consiguio la info
                        if(data){
                            console.info(`Categorias del producto: ${productId} encontradas`);
                            return data;
                        }
                        else{
                            //Si no se consiguieron datos
                            console.info(`No existen categorias para el producto: ${productId}`);
                            message = `No existen categorias para el producto: ${productId}`;
                            return null;
                        }
                    })
                    .catch(err => {
                        console.error(`Error en Query SELECT de ProductCategory : ${err}`);
                        message = 'Ocurrio un error al obtener las categorias';
                        return null;
                    });
    return { categorias, message };
}

//Auxiliar para registrar un nuevo producto
async function insertProduct(producto){
    console.info('Comenzando insert de Product');
    let message = '';
    //Conectamos con las queries
    let id = await queries
                        .products
                        .insert(producto)
                        .then(id => {
                            //Si se inserto correctamente
                            if(id){
                                console.info(`Insert de Product existoso con ID: ${id[0]}`);
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
                            console.error(`Error en Query INSERT de Product: ${err}`);
                            message = 'Ocurrio un error al intertar dar de alta';
                            return 0;
                        });
    return { id, message };
}

//Rollback de insert de producto
async function rollbackInsertProduct(id){
    let message = '';
    //Conectamos con las queries
    let res = await queries
                    .products
                    .deleteRollback(id)
                    .then(data => {
                        return data;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de Producto: ', err);
                        message += `Error en Query DELETE de Producto: ${err}`;
                    });
    return { res, message };
}

//Auxiliar para asociar un producto existente
async function associateProduct(producto){
    console.info('Comenzando insert de CompanyProduct');
    let message = '';
    //Conectamos con las queries
    let id = await queries
                        .companyProduct
                        .insert(producto)
                        .then(id => {
                            //Si se inserto correctamente
                            if(id){
                                console.info(`Insert de CompanyProduct existoso con ID: ${id[0]}`);
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
                            console.error(`Error en Query INSERT de CompanyProduct: ${err}`);
                            message = 'Ocurrio un error al intertar dar de alta';
                            return 0;
                        });
    return { id, message };
}

//Endpoint para realizar una carga en bulk de productos
async function cargaBulkVal(req,res){
    console.log('Conexion POST entrante : /api/product/bulk');

    //Llamamos auxiliar para carga bulk de productos
    let { status, product, productCompany, errores} = await cargaBulk(req.body);
    
    //Retornamos resultado
    res.status(status).json(errores);
}

//Auxiliar para realizar una carga en bulk de productos
async function cargaBulk(body){
    console.info('Comenzando carga bulk de productos');

    //Creamos array de productos
    console.info('Obteniendo array de productos');
    let productsArray = JSON.parse(body.products);
    
    //Iniciamos arrays de response
    let productError = [];
    let productRet = [];
    let productCompanyRet = [];

    if(!productsArray){
        //Si esta vacio, retornamos
        console.info('No se encontraron productos');
        productError.push('No se encontraron productos');
        return { status: 500, product: productRet, productCompany: productCompanyRet, errores: productError };
    }
    else{
        console.info('Productos encontrados');
        //Procesamos cada producto
        for(prod in productsArray){
            let producto = productsArray[prod];
            let altaFlag = true, asociacionFlag = true;
            let altaOK = false, asociacionOK = false;
            let idProd;

            //Obtenemos el producto
            let { producto: productoByCode } = await getProductByCode(producto.code);
            
            if(productoByCode){
                //Producto existe, no es necesario registrarlo nuevamente
                altaFlag = false;
                idProd = productoByCode.id;
                console.info(`Producto con codigo ${producto.code} encontrado`);
                console.info(`Buscando companyProduct con productId ${productoByCode.id}`);
                //Buscamos companyProduct
                let { producto: companyProduct } = await getCompanyProductByProduct(body.companyId, productoByCode.id);

                if(companyProduct){
                    //CompanyProduct existe, no es necesario asociar el producto nuevamente
                    console.info(`CompanyProduct con productId: ${productoByCode.id} encontrado`);
                    console.info('Agregando error');
                    productError.push({ codigo: producto.code, mensaje: `Ya existe un producto con Codigo ${producto.code} asociado a la compania con ID: ${companyProduct.companyId}` });
                    asociacionFlag = false;
                }
                else console.info(`No existe companyProducto con productId ${productoByCode.id}, continuando con asociacion`);
            }
            
            if(altaFlag){
                //Registrar nuevo producto
                console.log('Preparando insert de product');
                //Creamos body de insert
                let nuevoProducto = {
                    name: producto.name,
                    code: producto.code,
                    categories: JSON.parse('[' + producto.categories + ']'),
                }

                console.info('Enviando insert de producto');
                let { status: altaStatus, message: altaMessage, product, categories } = await altaProducto(nuevoProducto);

                if(altaStatus === 201){
                    //Registro de producto exitoso
                    console.info(`Alta de producto con codigo ${producto.code} exitosa`)
                    idProd = Number(product);
                    productRet.push(product);
                    altaOK = true;
                }
                else{
                    //Fallo insert, agregamos error
                    console.info(`Error en alta de producto con codigo ${producto.code}`);
                    console.info(altaMessage);
                    productError.push({ codigo: producto.code, mensaje: altaMessage });
                    asociacionFlag = false;
                }
            }

            if(asociacionFlag){
                //Asociacion de producto existente
                console.log('Preparando insert de companyProduct');
                //Creamos body de asociacion
                let nuevoCompanyProduct = {
                    productId: idProd,
                    companyId: body.companyId,
                    name: producto.name,
                    description: producto.description,
                    stock: producto.stock,
                    price: producto.price,
                    userEmail: body.userEmail,
                }

                console.info(`Enviando producto con codigo ${producto.code} a asociar`);
                let { status: asociarStatus, message: asociarMessage, companyProduct } = await asociarProducto(nuevoCompanyProduct);

                if(asociarStatus === 201){
                    //Asociacion exitosa
                    console.log(`Producto con codigo ${producto.code} asociado correctamente`);
                    productCompanyRet.push({ productId: idProd, companyId: companyProduct });
                    asociacionOK = true;
                }
                else{
                    //Fallo asociacion
                     console.info(`Fallo asociacion de producto con codigo ${producto.code}`);
                     console.info(asociarMessage);
                     productError.push({ codigo: producto.code, mensaje: asociarMessage });
                }
            }

            if(!asociacionOK && altaOK){
                //Si fallo asociacion pero se registro un nuevo producto, realizamos rollback de producto
                console.info('Comenzando rollbacks');
                //Realizamos rollback de producto - categoria
                for(let cat of categories){
                    console.log(`Enviando rollback de ProductCategory ID: ${cat}`);
                    let rollbackProductCategory = await rollbackInsertProductCategory(cat);
                    if(rollbackProductCategory.res) console.log(`Rollback de ProductCategory ${cat} realizado correctamente`);
                    else console.log(`Ocurrio un error en rollback de ProductCategory ${cat}`);
                }
                //Rollback de producto
                console.log('Comenzando rollbacks de producto');
                let rollbackProduct = await rollbackInsertProduct(product);
                if(rollbackProduct.res) console.log(`Rollback de Producto ${product} realizado correctamente`);
                else console.log(`Ocurrio un error en rollback de Producto ${product}`);
            }
        }

        if(productRet.length === 0 && productCompanyRet.length === 0){
            //Si no se registraron ni asociaron productos, damos error
            console.info('No se pudo dar de alta ni asociar ningun producto');
            console.log('Enviando response');
            return { status: 400, product: productRet, productCompany: productCompanyRet, errores: productError };
        }
        else{
            //Si se registro o asocio al menos un producto, damos OK
            console.info(`Se dieron de alta ${productRet.length} productos y se asociaron ${productCompanyRet.length} productos`);
            console.log('Enviando response');
            return { status: 201, product: productRet, productCompany: productCompanyRet, errores: productError };
        } 
    }
}

//Auxiliar para eliminar un companyProduct existente
async function deleteCompanyProduct(id, date){
    console.info('Comenzando delete de CompanyProduct');
    let message = '';
    //Conectamos con las queries
    let result = await queries
                .companyProduct
                .delete(id, date)
                .then(res => {
                    //Si se elimino correctamente
                    if(res){
                        console.info(`Delete de CompanyProduct con ID: ${id} existoso`);
                        return res;
                    }
                    else{
                        //Si fallo
                        console.info('Ocurrio un error');
                        message = 'Ocurrio un error al intertar eliminar el companyProduct';
                        return 0;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query Delete de CompanyProduct: ${err}`);
                    message = 'Ocurrio un error al intertar eliminar el CompanyProduct';
                    return 0;
                });
    return { result, message };
}

//Rollback de asociacion de producto existente
async function rollbackInsertAssociateProduct(id){
    let message = '';
    //Conectamos con las queries
    let res = await queries
                    .companyProduct
                    .delete(id)
                    .then(data => {
                        return data;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de Producto: ', err);
                        message += `Error en Query DELETE de Producto: ${err}`;
                    });
    return { res, message };
}

//Auxiliar para modificar companyProducts existentes
async function updateProduct(id, producto){
    console.info('Comenzando update de CompanyProduct');
    let message = '';
    //Conectamos con las queries
    let result = await queries
                .companyProduct
                .modify(id, producto)
                .then(res => {
                    //Si se actualizo correctamente
                    if(res){
                        console.info(`Update de CompanyProduct con ID: ${id} existoso`);
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
                    console.error(`Error en Query UPDATE de CompanyProduct: ${err}`);
                    message = 'Ocurrio un error al intertar modificar';
                    return 0;
                });
    return { result, message };
}

//Auxiliar para insertar relacion producto - categoria
async function insertProductCategory(prodCategory){
    console.info('Comenzando insert de ProductCategory');
    let message = '';
    //Conectamos con las queries
    let id = await queries
                    .prodCategory
                    .insert(prodCategory)
                    .then(id => {
                        //Si se inserto correctamente
                        if(id){
                            console.info(`Insert de ProductCategory existoso con ID: ${id[0]}`);
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

//Rollback de insercion relacion producto - categoria
async function rollbackInsertProductCategory(id){
    let message = '';
    //Conectamos con las queries
    let res = await queries
                    .prodCategory
                    .delete(id)
                    .then(data => {
                        return data;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de ProductCategory: ', err);
                        message += `Error en Query DELETE de ProductCategory: ${err}`;
                    });
    return { res, message };
}

//Auxiliar para insertar precio a un companyProduct existente
async function insertPrice(price){
    console.info('Comenzando insert de Price');
    let message = '';
    //Conectamos con las queries
    let id = await queries
                        .prices
                        .insert(price)
                        .then(id => {
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

//Rollback de insercion de precio de companyProduct existente
async function rollbackInsertPrice(id){
    let message = '';
    //Conectamos con las queries
    let res = await queries
                    .prices
                    .delete(id)
                    .then(data => {
                        return data;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de Price: ', err);
                        message += `Error en Query DELETE de Price: ${err}`;
                    });
    return { res, message };
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
                    return null;
                });
    return { price, message };
}

//Auxiliar para obtener el precio mas reciente de un companyProduct dado
async function getCurrentPrice(id){
    console.info(`Buscando precio actual para producto con ID: ${id}`);
    let message = '';
    //Conectamos con las queries
    let price = await queries
                .prices
                .getCurrent(id)
                .then(data => {
                    //Si se consiguio la info
                    if(data) {
                        console.info(`Precio con ID: ${data.rows[0].id} encontrado`);
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
                    return null;
                });
    return { price, message };
}

//Auxiliar para obtener los 2 precios mas recientes de un companyProduct dado
async function getLastPrices(id){
    console.info(`Buscando ultimos 2 precios para producto con ID: ${id}`);
    let message = '';
    //Conectamos con las queries
    let prices = await queries
                .prices
                .getLast(id)
                .then(data => {
                    //Si se consiguio la info
                    if(data) {
                        console.info(`Precios para producto ${id} encontrados`);
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
                    return null;
                });
    return { prices, message };
}

async function getCompapnyProductsByCompanyByCategory(companyId, categoryId){
    console.info(`Buscando companyProducts de company: ${companyId} con categoria ${categoryId}`);
    let message = '';
    //Conectamos con las queries
    let companyProducts = await queries
                .companyProduct
                .getByCompanyByCategory(companyId, categoryId)
                .then(data => {
                    //Si se consiguio la info
                    if(data) {
                        console.info(`Informacion de companyProducts encontrada`);
                        return data.rows;
                    }
                    else{
                        //Si no se consiguieron datos
                        console.info(`No existen companyProducts para la compania: ${companyId} con categoria ${categoryId}`);
                        message = `No existen companyProducts para la compania: ${companyId} con categoria ${categoryId}`;
                        return null;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query SELECT de CompanyProduct: ${err}`);
                    message = 'Ocurrio un error al obtener los companyProduct';
                    return null;
                });
    return { companyProducts, message };
}

async function ajustarPrecioByCompanyByCategory(req, res){
    console.info('Conexion GET entrante : /api/product/company/:companyId/category/:categoryId/price');

    //Validamos parametro de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error: companyError } = validarId(req.params.companyId);
    let { error: categoryError } = validarId(req.params.categoryId);
    let { error: errorAjuste} = await validarAjuste({ type: req.body.type, aumento: req.body.aumento, difference: req.body.difference });

    if(companyError || categoryError || errorAjuste){
        //Si hay error retornamos
        let errores = [];
        console.info(`Error en la validacion de tipos`);
        if(companyError){
            console.info(companyError.details[0].message);
            errores.push(companyError.details[0].message);
        }
        if(categoryError){
            console.info(categoryError.details[0].message);
            errores.push(categoryError.details[0].message);
        }
        if(errorAjuste){
            for(let e of errorAjuste.details){
                console.info(e);
                errores.push(e);
            }
        }
        console.info('Preparando response');
        res.status(400).json({message: errores});
    }
    else{
        console.info('Validaciones de tipo exitosas');
        //Iniciamos array de errores
        let errorMessage = [];

        //Obtenemos las entidades
        let { company, message: companyMessage } = await getCompanyById(req.params.companyId);
        let { category, message: categoryMessage } = await getCategoryById(req.params.categoryId);
        let { user, message: userMessage } = await getUserByEmail(req.body.userEmail);

        //Verificamos por errores
        if(!company) errorMessage.push(companyMessage);
        if(!category) errorMessage.push(categoryMessage);
        if(!user) errorMessage.push(userMessage);
        if(user && company && user.companyId !== company.id) errorMessage.push(`Compania con ID ${company.id} no corresponde con usuario con email ${user.email}`);

        if(errorMessage.length > 0){
            //Si hay algun error, retornamos
            console.info(`Se encontraron ${errorMessage.length} errores de existencia en la request`);
            errorMessage.map(err => console.log(err));
            return { status: 400, message: errorMessage };
        }
        else{
            console.log('Validaciones de existencia exitosas');
            console.info('Obteniendo companyProducts');
            //Buscamos los datos
            let { companyProducts, message: companyProductsMessage } = await getCompapnyProductsByCompanyByCategory(req.params.companyId, req.params.categoryId);

            if(!companyProducts){
                console.info('No existen companyProducts que cumplan los requisitos');
                console.info(companyProductsMessage);
                console.info('Preparando response');
                res.status(400).json({ message: 'No existen companyProducts que cumplan los requisitos' });
            }
            else{
                console.info(`${companyProducts.length} companyProducts encontrados`);

                //Creo array para guardado de Ids de nuevos precios en caso de rollback
                let pricesIds = [], rollback = false;

                console.info('Comenzado de insert de nuevos precios');
                for(let p of companyProducts){
                    console.info(`Calculando precio para companyProduct con ID: ${p.id}`);
                    
                    //Calculando ajuste de nuevo precio
                    let price = 0;
                    let valor = req.body.difference;

                    console.info(`Precio actual: ${p.price}`)

                    if(req.body.type === 'valor'){
                        if(req.body.aumento) price = p.price + valor;
                        else price = p.price - valor;
                    }
                    else{
                        price = p.price;
                        if(req.body.aumento) price += p.price * (valor / 100);
                        else price -= p.price * (valor / 100);
                    }

                    console.info(`Nuevo precio: ${price}`);

                    //Creamos body para insert de precio
                    let newPrice = {
                        productId: p.id,
                        price: price,
                        validDateFrom: new Date()
                    }

                    console.info('Precio calculado, enviado insert');
                    let { id, message } = await insertPrice(newPrice);

                    if(id){
                        console.info('Precio insertado correctamente');
                        pricesIds.push(id);
                    }
                    else{
                        console.info('Fallo insert de precio, marcando rollback');
                        console.info(message);
                        rollback = true;
                    }
                }

                if(pricesIds.length === companyProducts.length){
                    console.info(`${pricesIds.length} precios ajustados`);
                    console.info('Preparando response');
                    res.status(200).json({ message: 'Ajustes exitosos' });
                }
                else rollback = true;

                if(rollback){
                    for(let p of pricesIds){
                        console.log(`Enviando rollback de precio ID: ${p}`);
                        let rollbackRes = await rollbackInsertPrice(p);
                        if(rollbackRes.res) console.log(`Rollback de precio ${p} realizado correctamente`);
                        else console.log(`Ocurrio un error en rollback de precio ${p}`);
                    }
                }
            }
        }
    }
}

async function comprobarParaEliminar(productId, companyId){
    console.info(`Buscando paquetes activos para compania ${companyId} con producto ${productId}`);
    let message = '';
    //Conectamos con las queries
    let packageProducts = await queries
                .companyProduct
                .getByPackageNonDeleted(productId, companyId)
                .then(data => {
                    //Si se consiguio la info
                    if(data) {
                        console.info(`Paquetes encontrados`);
                        return data.rows;
                    }
                    else{
                        //Si no se consiguieron datos
                        console.info(`No existen paquetes activos con producto ${productId} para la compania ${companyId}`);
                        message = `No existen paquetes activos con producto ${productId} para la compania ${companyId}`;
                        return null;
                    }
                })
                .catch(err => {
                    console.error(`Error en Query SELECT de PackageProduct: ${err}`);
                    message = 'Ocurrio un error al obtener los PackageProducts';
                    return null;
                });
    return { packageProducts, message };
}

//Auxiliar para aumentar o disminuir el stock de un companyProduct dado
const ajustarStock = async (id, cantidad, tipo) => {
    console.info(`Comenzando ajuste de stock para producto con ID: ${id}, cantidad a ${tipo}: ${cantidad}`);

    //Obtenemos el companyProduct
    console.info(`Obteniendo el companyProduct con ID: ${id}`);
    let { producto } = await getCompanyProductById(id);

    if(!producto){
        //Si no se obtuvo, doy error
        console.info('No se pudo encontrar el producto');
        return false;
    }
    else{
        //Si se encontro
        console.log(`Procediendo a ${tipo} la cantidad`);

        //Creamos body para update
        let prod = {
            companyId: producto.companyId,
            productId: producto.productId,
            name: producto.name,
            description: producto.description,
            stock: tipo === 'reducir' ? producto.stock - cantidad : producto.stock + cantidad,
            imagePath: producto.imagePath,
            imageName: producto.imageName,
            created: producto.created,
            deleted: producto.deleted
        }

        let reducido = false;
        console.log('Enviando Query UPDATE');
        //Conectamos con las queries
        await queries
                .companyProduct
                .modify(id, prod)
                .then(data => {
                    //Si se actualizo correctamente
                    if(data){
                        reducido = true;
                        console.log('Query UPDATE exitosa');
                    }
                    else{
                        //Si fallo
                        console.log(`Error en Query UPDATE de Product: ${err}`);
                    }
                })
                .catch(err => {
                    console.log(`Error en Query UPDATE de Product: ${err}`);
                });
        return reducido;
    }
}

//Funcion para validar codigos
function validarCode(code){
    console.info('Comenzando validacion Joi de codigo');
    //Creamos schema Joi
    const schema = Joi.string().min(1).max(20).required();
    console.info('Finalizando validacion Joi de codigo');
    //Validamos
    return Joi.validate(code, schema);
}

//Funcion para validar datos de un producto
function validarProducto(body) {
    console.info('Comenzando validacion Joi de producto');
    //Creamos schema Joi
    const schema = Joi.object().keys({
        name: Joi.string().min(3).max(50).required(),
        code: Joi.string().min(1).max(20).required(),
        categories: Joi.array().required(),
        imageName: Joi.allow('').allow(null),
        imagePath: Joi.allow('').allow(null)
    });
    console.info('Finalizando validacion Joi de producto');
    //Validamos
    return Joi.validate(body, schema);
}

//Funcion para validar datos de un companyProduct
function validarAsociacion(body) {
    console.info('Comenzando validacion Joi de companyProduct');
    //Creamos schema Joi
    const schema = {
        productId: Joi.number().min(0).max(999999999).required(),
        companyId: Joi.number().min(0).max(999999999).required(),
        name: Joi.string().min(3).max(50).required(),
        description: Joi.string().min(5).max(50).required(),
        stock: Joi.number().min(0).max(999999).required(),
        price: Joi.number().min(1).max(999999).required(),
        imageName: Joi.allow('').allow(null),
        imagePath: Joi.allow('').allow(null)
    };
    console.info('Finalizando validacion Joi de companyProduct');
    //Validamos
    return Joi.validate(body, schema);
}

function validarAjuste(body){
    console.info('Comenzando validacion Joi de ajuste de precios');
    //Creamos schema Joi
    const schema = {
        type: Joi.string().min(1).max(20).required(),
        aumento: Joi.bool().required(),
        difference: Joi.number().min(1).max(999999).required(),
    };
    console.info('Finalizando validacion Joi de ajuste de precios');
    //Validamos
    return Joi.validate(body, schema);
}

//Funcion para validar datos para modificar un companyProduct
function validarModificacionCompanyProduct(body) {
    console.info('Comenzando validacion Joi de companyProduct');
    //Creamos schema Joi
    const schema = {
        name: Joi.string().min(3).max(30).required(),
        description:Joi.string().min(5).max(50).required(),
        price:Joi.number().min(1).max(999999).required(),
        stock:Joi.number().min(0).max(999999).required(),
        imageName: Joi.allow('').allow(null),
        imagePath: Joi.allow('').allow(null),
    };
    console.info('Finalizando validacion Joi de companyProduct');
    //Validamos
    return Joi.validate(body, schema);
}

//Funcion para validar array de categorias
async function validarCategorias(categorias){
    console.log('Iniciando validacion de categorias');
    
    //Creamos arrays de response
    let messages = [];
    let categories = [];

    //Recorremos las categorias
    for(let cat of categorias){

        //Validamos tipo de dato
        let { error } = validarId(cat);

        if(error){
            //Si hay error, agregamos al array
            console.log(`Id de categoria: ${cat} no es valido`);
            messages.push(`Id de categoria: ${cat} no es valido`);
        }
        else{
            //Obtenemos la categoria
            console.info(`Obteniendo categoria con ID: ${cat}`);
            let { category, message } = await getCategoryById(cat);
            
            //Si se encontro, se agrega al array, si no se agrega mensaje
            if(category) categories.push(category);
            else messages.push(message)
        }
    };
    //Si no se encontraron errores, devuelvo categorias, si no, solo mensajes
    if(messages.length === 0) return { categories, messages };
    else return { messages };
}

//Exportamos endpoints
module.exports = {
    obtenerProducts,
    obtenerCompanyProducts,
    obtenerAllCompanyProducts,
    obtenerDeletedCompanyProducts,
    obtenerCompanyProductsByCompany,
    obtenerAllCompanyProductsByCompany,
    obtenerNotAssociatedProductsByCompany,
    obtenerDeletedCompanyProductsByCompany,
    obtenerCompanyProductsByProduct,
    obtenerProductById,
    obtenerCompanyProductById,
    obtenerProductByCode,
    obtenerProductsByCategory,
    altaProductoVal,
    asociarProductoVal,
    altaAsociacionProducto,
    cargaBulkVal,
    ajustarPrecioByCompanyByCategory,
    modificarProducto,
    eliminarProducto,
    getProducts,
    getCompanyProducts,
    getAllCompanyProducts,
    getDeletedCompanyProducts,
    getCompanyProductsByCompany,
    getAllCompanyProductsByCompany,
    getDeletedProductsByCompany,
    getProductById,
    getProductByCode,
    getProductByName,
    getCompanyProductById,
    getProductsByCategory,
    getPriceById,
    getCurrentPrice,
    getLastPrices,
    ajustarStock,
};