const Joi = require('joi');
const queries = require('./dbQueries');
const { getCompanyById } = require('../companies/routes');
const { getUserByEmail } = require('../users/routes');
const { getCategoryById, getCategories, validarId } = require('../helpers/routes');


async function obtenerProducts(req, res){
    console.info('Conexion GET entrante : /api/product/');

    let { products, message } = await getProducts();

    if(products){
        console.info(`${products.length} productos encontrados`);
        console.info('Preparando response');
        res.status(200).json(products);
    }
    else{
        console.info('No se encontraron productos');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

async function obtenerCompanyProducts(req, res){
    console.log('test')
    console.info('Conexion GET entrante : /api/product/company');

    let { CompanyProducts, message } = await getCompanyProducts();
    console.log(CompanyProducts);

    if(CompanyProducts){
        console.info(`${CompanyProducts.length} productos encontrados`);
        console.info('Preparando response');
        res.status(200).json(CompanyProducts);
    }
    else{
        console.info('No se encontraron productos');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

async function obtenerAllCompanyProducts(req, res){
    console.info('Conexion GET entrante : /api/product/company/List');

    let { companyProducts, message } = await getAllCompanyProducts();
    console.log(companyProducts);

    if(companyProducts){
        console.info(`${companyProducts.length} productos encontrados`);
        console.info('Preparando response');
        res.status(200).json(companyProducts);
    }
    else{
        console.info('No se encontraron productos');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

async function obtenerDeletedCompanyProducts(req, res){
    console.info('Conexion GET entrante : /api/product/companyDeleted');

    let { CompanyProducts, message } = await getDeletedCompanyProducts();
    console.log(CompanyProducts);

    if(CompanyProducts){
        console.info(`${CompanyProducts.length} productos encontrados`);
        console.info('Preparando response');
        res.status(200).json(CompanyProducts);
    }
    else{
        console.info('No se encontraron productos');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

// async function obtenerCompanyProductsDeletedList(req, res){
//     console.info('Conexion GET entrante : /api/product/companyDeleted/List');

//     let { CompanyProducts, message } = await getDeletedCompanyProductsList();
//     console.log(CompanyProducts);

//     if(CompanyProducts){
//         console.info(`${CompanyProducts.length} productos encontrados`);
//         console.info('Preparando response');
//         res.status(200).json({CompanyProducts});
//     }
//     else{
//         console.info('No se encontraron productos');
//         console.info('Preparando response');
//         res.status(200).json({message});
//     }
// }

async function obtenerCompanyProductsByCompany(req, res){
    console.info(`Conexion GET entrante : /api/product/company/${req.params.id}`);

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
            let { companyProducts, message } = await getProductsByCompany(req.params.id);

            if(companyProducts){
                console.info(`${companyProducts.length} productos encontrados`);
                console.info('Preparando response');
                res.status(200).json(companyProducts);
            }
            else{
                console.info('No se encontraron productos');
                console.info('Preparando response');
                res.status(200).json({message});
            }
        }
    }
}

// async function obtenerCompanyProductsByCompanyList(req, res){
//     console.info(`Conexion GET entrante : /api/product/company/list/${req.params.id}`);

//     let { CompanyProducts, message } = await getProductsByCompanyList(req.params.id);
//     console.log(CompanyProducts);

//     if(CompanyProducts){
//         console.info(`${CompanyProducts.length} productos encontrados`);
//         console.info('Preparando response');
//         res.status(200).json({CompanyProducts});
//     }
//     else{
//         console.info('No se encontraron productos');
//         console.info('Preparando response');
//         res.status(200).json({message});
//     }
// }

async function obtenerAllCompanyProductsByCompany(req, res){
    console.info(`Conexion GET entrante : /api/product/company/${req.params.id}/all`);

    let { CompanyProducts, message } = await getAllCompanyProductsByCompany(req.params.id);
    console.log(CompanyProducts);

    if(CompanyProducts){
        console.info(`${CompanyProducts.length} productos encontrados`);
        console.info('Preparando response');
        res.status(200).json(CompanyProducts);
    }
    else{
        console.info('No se encontraron productos');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

// async function obtenerCompanyProductsAllByCompanyList(req, res){
//     console.info(`Conexion GET entrante : /api/product/company/all/list/${req.params.id}`);

//     let { CompanyProducts, message } = await getAllProductsByCompanyList(req.params.id);
//     console.log(CompanyProducts);

//     if(CompanyProducts){
//         console.info(`${CompanyProducts.length} productos encontrados`);
//         console.info('Preparando response');
//         res.status(200).json({CompanyProducts});
//     }
//     else{
//         console.info('No se encontraron productos');
//         console.info('Preparando response');
//         res.status(200).json({message});
//     }
// }

async function obtenerDeletedCompanyProductsByCompany(req, res){
    console.info(`Conexion GET entrante : /api/product/company/${req.params.id}/deleted`);

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
            let { companyProducts, message } = await getDeletedProductsByCompany(req.params.id);

            if(companyProducts){
                console.info(`${companyProducts.length} productos encontrados`);
                console.info('Preparando response');
                res.status(200).json(companyProducts);
            }
            else{
                console.info('No se encontraron productos');
                console.info('Preparando response');
                res.status(200).json({message});
            }
        }
    }
}

async function obtenerCompanyProductsDeletedByCompanyList(req, res){
    console.info(`Conexion GET entrante : /api/product/company/deleted/list/${req.params.id}`);

    let { CompanyProducts, message } = await getDeletedProductsByCompanyList(req.params.id);
    console.log(CompanyProducts);

    if(CompanyProducts){
        console.info(`${CompanyProducts.length} productos encontrados`);
        console.info('Preparando response');
        res.status(200).json({CompanyProducts});
    }
    else{
        console.info('No se encontraron productos');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

async function obtenerProductById(req, res){
    console.info(`Conexion GET entrante : /api/product/${req.params.id}`);

    let { producto, message } = await getProductById(req.params.id);
    console.log(producto);

    if(producto){
        console.info(`${producto.length} productos encontrados`);
        console.info('Preparando response');
        res.status(200).json(producto);
    }
    else{
        console.info('No se encontraron productos');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

async function obtenerCompanyProductById(req, res){
    console.info(`Conexion GET entrante : /api/product/company${req.params.companyId}/product/${req.params.productId}`);
    //validar relacion empresa producto

    console.info(`Comenzando validacion de tipos`);
    let { error: errorCompany } = validarId(req.params.companyId);
    let { error: errorProduct } = validarId(req.params.productId);

    if(errorCompany || errorProduct){
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
        console.info('Validaciones de tipo de datos exitosa');
        console.info(`Comprobando existencia de company ${req.params.companyId}`);
        let { company, message: companyMessage } = await getCompanyById(req.params.companyId);

        if(!company){
            console.info(`No existe company con ID: ${req.params.companyId}`);
            console.info('Preparando response');
            res.status(400).json({message: companyMessage});
        }
        else{
            console.info('Comprobando relacion usuario-empresa');
            let { user } = await getUserByEmail(req.body.userEmail);

            if(!user){
                console.info('No se pudo encontrar el usuario');
                console('Preparando response');
                res.status(500).json({message: 'Ocurrio un error al buscar la informacion'});
            }
            else{
                console.info('user.companyId', user.companyId);
                console.info('user.companyId', typeof user.companyId);
                console.info('req.params.companyId', req.params.companyId);
                console.info('req.params.companyId', typeof req.params.companyId);

                if(user.companyId === req.params.companyId){
                    let { producto, message } = await getCompanyProductById(req.params.productId);
                    console.log(producto);
    
                    if(producto){
                        console.info(`${producto.length} productos encontrados`);
                        console.info('Preparando response');
                        res.status(200).json(producto);
                    }
                    else{
                        console.info('No se encontraron productos');
                        console.info('Preparando response');
                        res.status(200).json({message});
                    }
                }
                else{
                    console.info('Usuario no corresponde con la empresa');
                    console.info('Preparando response');
                    res.status(400).json({message: 'Usuario no corresponse con la empresa'});
                }
            }
        }
    }
}

async function obtenerProductByCode(req, res){
    console.info(`Conexion GET entrante : /api/product/company/deleted/${req.params.code}`);

    console.info(`Comenzando validacion de tipos`);
    let { error } = validarCode(req.params.code);

    if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        let { producto, message } = await getProductByCode(req.params.code);

        if(producto){
            console.info(`${producto.length} productos encontrados`);
            console.info('Preparando response');
            res.status(200).json(producto);
        }
        else{
            console.info('No se encontraron productos');
            console.info('Preparando response');
            res.status(200).json({message});
        }
    }
}

async function obtenerProductsByCategory(req, res){
    console.info(`Conexion GET entrante : /api/product/category/${req.params.id}`);

    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info('Validacion de tipos exitosa');
        console.info(`Comprobando existencia de categoria ${req.params.id}`);
        let { category, message: categoryMessage } = await getCategoryById(req.params.id);

        if(!category){
            console.info(`No existe categoria con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message: categoryMessage});
        }
        else{
            console.info('Validacion de existencia exitosa');
            console.info(`Yendo a buscar productos con categoria con ID: ${req.params.id}`);
            let { productos, message } = await getProductsByCategory(req.params.id);

            if(productos){
                console.info(`${productos.length} productos encontrados`);
                console.info('Preparando response');
                res.status(200).json(productos);
            }
            else{
                console.info('No se encontraron productos');
                console.info('Preparando response');
                res.status(200).json({message});
            }
        }
    }
}

// async function obtenerCategorias(req, res){
//     console.info('Conexion GET entrante : /api/product/category');

//     let { categories, message } = await getCategories();

//     if(categories){
//         console.info(`${categories.length} categorias encontradas`);
//         console.info('Preparando response');
//         res.status(200).json({products});
//     }
//     else{
//         console.info('No se encontraron categorias');
//         console.info('Preparando response');
//         res.status(200).json({message});
//     }
// }

async function altaProductoVal(req, res){
    console.log('Conexion POST entrante : /api/product');

    let { status, message } = await altaProducto(req.body, req.file);

    res.status(status).json(message);

    // let categories = JSON.parse('[' + req.body.categories + ']');
    
    // let valproduct = {
    //     name: req.body.name,
    //     code: req.body.code,
    //     categories: req.body.categories,
    //     imageName: req.file ? req.file.filename : null,
    //     imagePath: req.file ? req.file.path : null,
    // }

    // // validacion de tipos
    // console.log('Comenzando validacion JOI de request');
    // let { error } = validarProducto(valproduct);
    
    // if(error){
    //     console.info('Erorres encontrados en la request');
    //     let errores = error.details.map(e => {
    //         console.info(e.message);
    //         return e.message;
    //     });
    //     console.info('Preparando response');
    //     res.status(400).json({message: errores});
    // }
    // else{
    //     console.info('Validaciones de tipo de datos exitosa');
    //     console.info('Comenzando validaciones de existencia');

    //     //Inicializo array de errores
    //     let errorMessage = [];

    //     let { categories: valCategories, messages: categoriesMessages } = await validarCategorias(req.body.categories);
    //     let { producto: ProductoByName } = await getProductByName(valproduct.name);
    //     let { producto: ProductoByCode } = await getProductByCode(valproduct.code);

    //     if(!valCategories){
    //         console.info('Erorres encontrados en las categorias');
    //         categoriesMessages.map(msj => {
    //             console.info(msj);
    //             errorMessage.push(msj);
    //         });
    //     }
    //     if(ProductoByCode) errorMessage.push(`Ya existe un producto con Codigo ${valproduct.code}`);
    //     if(ProductoByName) errorMessage.push(`Ya existe un producto con Nombre ${valproduct.name}`);


    //     if(errorMessage.length > 0){
    //         console.info(`Se encontraron ${errorMessage.length} errores de existencia en la request`);
    //         errorMessage.map(err => console.log(err));
    //         console.info('Enviando response')
    //         res.status(400).json({message: errorMessage});
    //     }
    //     else{
    //         console.log('Validaciones de existencia exitosas');
    //         let product = {
    //                 name: valproduct.name,
    //                 code: valproduct.code,
    //                 imageName: valproduct.imageName,
    //                 imagePath: valproduct.imagePath,
    //                 created: new Date(),
    //             }

    //         console.log('Enviando a insertar producto');
    //         let { id: productId, message: productMessage } = await insertProduct(product);

    //         if(productId){
    //             console.log(`Producto insertado correctamente con ID: ${productId}`);

    //             let prodCategoryIds = [];
    //             let rollback = false;
    //             let prodCategory = {
    //                 productId: productId
    //             }
    //             console.log(`Comenzando armado e insercion de ProductCategory para producto ${productId}`);
    //             let i = 0;
    //             let categoriesOk = true;
    //             while(i < req.body.categories.length && categoriesOk){
                    
    //                 prodCategory.categoryId = req.body.categories[i];
                    
    //                 console.log('Enviando Query INSERT para ProductCategory');
    //                 let { id: productCategoryId, message: productCategoryMessage } = await insertProductCategory(prodCategory);

    //                 if(!productCategoryId){
    //                     console.log(`Fallo insert de ProductCategory con ID: ${prodCategory.categoryId}`);
    //                     errorMessage.push(productCategoryMessage);
    //                     rollback = true;
    //                     categoriesOk = false;
    //                 }
    //                 else{
    //                     console.log(`ProductCategory insertada correctamente con ID: ${productCategoryId}`);
    //                     prodCategoryIds.push(productCategoryId);
    //                 }
    //                 i++;
    //             }

    //             if(!rollback){
    //                 console.log('Alta de producto finalizada exitosamente');
    //                 res.status(201).json(productId);
    //             }
    //             else{
    //                 console.log('Ocurrio un error en el proceso de inserts, comenzando rollback');

    //                 console.log('Comenzando rollbacks de categorias');
    //                 for(let id of prodCategoryIds){
    //                     console.log(`Enviando rollback de ProductCategory ID: ${id}`);
    //                     let rollbackProductCategory = await rollbackInsertProductCategory(id);
    //                     if(rollbackProductCategory.res) console.log(`Rollback de ProductCategory ${id} realizado correctamente`);
    //                     else console.log(`Ocurrio un error en rollback de ProductCategory ${id}`);
    //                 }
    //                 console.log('Comenzando rollbacks de producto');
    //                 let rollbackProduct = await rollbackInsertProduct(producto.id);
    //                 if(rollbackProduct.res) console.log(`Rollback de Producto ${id} realizado correctamente`);
    //                 else console.log(`Ocurrio un error en rollback de Producto ${id}`);
    //                 console.info('Preparando response');
    //                 res.status(500).json({message: 'Ocurrio un error en el alta de productos'});
    //             }   
    //         }
    //         else{
    //             console.log(`Error al insertar producto: ${productMessage}`);
    //             res.status(500).json({message: productMessage});
    //         }
    //     }
    // }
}

async function altaProducto(body, file){
    // console.log('Conexion POST entrante : /api/product');

    // let categories = JSON.parse('[' + req.body.categories + ']');
    
    let valproduct = {
        name: body.name,
        code: body.code,
        categories: body.categories,
        imageName: file ? file.filename : null,
        imagePath: file ? file.path : null,
    }

    // validacion de tipos
    console.log('Comenzando validacion JOI de request');
    let { error } = validarProducto(valproduct);
    
    if(error){
        console.info('Erorres encontrados en la request');
        let errores = error.details.map(e => {
            console.info(e.message);
            return e.message;
        });
        // console.info('Preparando response');
        // res.status(400).json({message: errores});
        return { status: 400, message: errores };
    }
    else{
        console.info('Validaciones de tipo de datos exitosa');
        console.info('Comenzando validaciones de existencia');

        //Inicializo array de errores
        let errorMessage = [];

        let { categories: valCategories, messages: categoriesMessages } = await validarCategorias(body.categories);
        let { producto: ProductoByName } = await getProductByName(valproduct.name);
        let { producto: ProductoByCode } = await getProductByCode(valproduct.code);

        if(!valCategories){
            console.info('Erorres encontrados en las categorias');
            categoriesMessages.map(msj => {
                console.info(msj);
                errorMessage.push(msj);
            });
        }
        if(ProductoByCode) errorMessage.push(`Ya existe un producto con Codigo ${valproduct.code}`);
        if(ProductoByName) errorMessage.push(`Ya existe un producto con Nombre ${valproduct.name}`);


        if(errorMessage.length > 0){
            console.info(`Se encontraron ${errorMessage.length} errores de existencia en la request`);
            errorMessage.map(err => console.log(err));
            // console.info('Enviando response')
            // res.status(400).json({message: errorMessage});
            return { status: 400, message: errorMessage };
        }
        else{
            console.log('Validaciones de existencia exitosas');
            let product = {
                    name: valproduct.name,
                    code: valproduct.code,
                    imageName: valproduct.imageName,
                    imagePath: valproduct.imagePath,
                    created: new Date(),
                }

            console.log('Enviando a insertar producto');
            let { id: productId, message: productMessage } = await insertProduct(product);

            if(productId){
                console.log(`Producto insertado correctamente con ID: ${productId}`);

                let prodCategoryIds = [];
                let rollback = false;
                let prodCategory = {
                    productId: productId
                }
                console.log(`Comenzando armado e insercion de ProductCategory para producto ${productId}`);
                let i = 0;
                let categoriesOk = true;
                while(i < body.categories.length && categoriesOk){
                    
                    prodCategory.categoryId = body.categories[i];
                    
                    console.log('Enviando Query INSERT para ProductCategory');
                    let { id: productCategoryId, message: productCategoryMessage } = await insertProductCategory(prodCategory);

                    if(!productCategoryId){
                        console.log(`Fallo insert de ProductCategory con ID: ${prodCategory.categoryId}`);
                        errorMessage.push(productCategoryMessage);
                        rollback = true;
                        categoriesOk = false;
                    }
                    else{
                        console.log(`ProductCategory insertada correctamente con ID: ${productCategoryId}`);
                        prodCategoryIds.push(productCategoryId);
                    }
                    i++;
                }

                if(!rollback){
                    console.log('Alta de producto finalizada exitosamente');
                    // res.status(201).json(productId);
                    return { status: 201, product: productId, categories: prodCategoryIds };
                }
                else{
                    console.log('Ocurrio un error en el proceso de inserts, comenzando rollback');

                    console.log('Comenzando rollbacks de categorias');
                    for(let id of prodCategoryIds){
                        console.log(`Enviando rollback de ProductCategory ID: ${id}`);
                        let rollbackProductCategory = await rollbackInsertProductCategory(id);
                        if(rollbackProductCategory.res) console.log(`Rollback de ProductCategory ${id} realizado correctamente`);
                        else console.log(`Ocurrio un error en rollback de ProductCategory ${id}`);
                    }
                    console.log('Comenzando rollbacks de producto');
                    let rollbackProduct = await rollbackInsertProduct(producto.id);
                    if(rollbackProduct.res) console.log(`Rollback de Producto ${id} realizado correctamente`);
                    else console.log(`Ocurrio un error en rollback de Producto ${id}`);
                    // console.info('Preparando response');
                    // res.status(500).json({message: 'Ocurrio un error en el alta de productos'});
                    return { status: 500, message: 'Ocurrio un error en el alta de productos'};
                }   
            }
            else{
                console.log(`Error al insertar producto: ${productMessage}`);
                // res.status(500).json({message: productMessage});
                return { status: 500, message: productMessage };
            }
        }
    }
}

async function asociarProductoVal(req, res){
    console.log('Conexion POST entrante : /api/product/associate');

    let { status, message } = await asociarProducto(req.body, req.file);

    res.status(status).json(message);

    // let valCompanyProduct = {
    //         productId: req.body.productId,
    //         companyId: req.body.companyId,
    //         name: req.body.name,
    //         description: req.body.description,
    //         stock: req.body.stock,
    //         price: req.body.price,
    //         imageName: req.file ? req.file.filename : null,
    //         imagePath: req.file ? req.file.path : null,
    // };

    // // validacion de tipos
    // console.log('Comenzando validacion JOI de request');
    // let { error } = validarAsociacion(valCompanyProduct);
    
    // if(error){
    //     console.info('Erorres encontrados en la request');
    //     let errores = error.details.map(e => {
    //         console.info(e.message);
    //         return e.message;
    //     });
    //     console.info('Preparando response');
    //     res.status(400).json({message: errores});
    // }
    // else{
    //     console.info('Validaciones de tipo de datos exitosa');

    //     let { user } = await getUserByEmail(req.body.userEmail);

    //     if(user){
    //         if(user.companyId === valCompanyProduct.companyId){
    //             console.info('Usuario corresponde con empresa');
    //             console.info('Comenzando validaciones de existencia');

    //             //Inicializo array de errores
    //             let errorMessage = [];

    //             let { producto: productoById, message: productMessage } = await getProductById(valCompanyProduct.productId);
    //             let { company, message: companyMessage } = await getCompanyById(valCompanyProduct.companyId);
    //             let { producto: companyProductByProduct } = await getCompanyProductByProduct(valCompanyProduct.productId);

    //             if(!productoById) errorMessage.push(productMessage);
    //             if(!company) errorMessage.push(companyMessage);
    //             if(companyProductByProduct) errorMessage.push(`La compania ya tiene asociado este producto`);


    //             if(errorMessage.length > 0){
    //                 console.info(`Se encontraron ${errorMessage.length} errores de existencia en la request`);
    //                 errorMessage.map(err => console.log(err));
    //                 console.info('Enviando response')
    //                 res.status(400).json({message: errorMessage});
    //             }
    //             else{
    //                 console.log('Validaciones de existencia exitosas');
    //                 console.info('Preparando objeto companyProduct para insertar');

    //                 if(!req.file){
    //                     valCompanyProduct.imageName = productoById.imageName;
    //                     valCompanyProduct.imagePath = productoById.imagePath;
    //                 }

    //                 let product = {
    //                     productId:valCompanyProduct.productId,
    //                     companyId: valCompanyProduct.companyId,
    //                     description: valCompanyProduct.description,
    //                     name: valCompanyProduct.name,
    //                     stock: valCompanyProduct.stock,
    //                     imageName: valCompanyProduct.imageName, //validar que la imagen si no es enviada, use la del producto
    //                     imagePath: valCompanyProduct.imagePath,
    //                     created: new Date(),
    //                 }

    //                 console.log('Enviando a insertar companyProduct');
    //                 let { id: companyProductId, message: companyProductMessage } = await associateProduct(product);

    //                 if(companyProductId){
    //                     console.log(`CompanyProduct insertado correctamente con ID: ${companyProductId}`);

    //                     let precio = {
    //                         price: valCompanyProduct.price,
    //                         productId: companyProductId,
    //                         validDateFrom: new Date(),
    //                     };

    //                     let {id: priceId, message: priceMessage} = await insertPrice(precio);

    //                     if(priceId){
    //                         console.log(`Price insertado correctamente con ID: ${priceId}`);

    //                         console.log('Asociacion de producto finalizada exitosamente');
    //                         res.status(201).json(companyProductId);
    //                     }
    //                     else{
    //                         console.log(`Error al insertar price: ${priceMessage}`);
    //                         console.log('Ocurrio un error en el proceso de inserts, comenzando rollback');

    //                         console.log('Comenzando rollbacks de companyProduct');
    //                         let rollbackCompanyProducto = await rollbackInsertAssociateProduct(companyProductId);
    //                         if(rollbackCompanyProducto.res) console.log(`Rollback de CompanyProduct ${companyProductId} realizado correctamente`);
    //                         else console.log(`Ocurrio un error en rollback de Producto ${companyProductId}`);
    //                         res.status(500).json({message: 'Ocurrio un error al asociar producto'});
    //                     }
    //                 }  
    //                 else{
    //                     console.log(`Error al insertar producto: ${companyProductMessage}`);
    //                     res.status(500).json({message: companyProductMessage});
    //                 }
    //             }
    //         }
    //         else{
    //             console.info('El usuario no corresponse con la empresa');
    //             console.info('Preparando response');
    //             res.status(400).json('El usuario no corresponse con la empresa');
    //         }
    //     }
    //     else{
    //         console.info('No se pudo encontrar el usuario');
    //         console.info('Preparando response');
    //         res.status(500).json('Ocurrio un error al asociar producto');
    //     }
    // }
}

async function asociarProducto(body, file){
    // console.log('Conexion POST entrante : /api/product/associate');
    let valCompanyProduct = {
            productId: body.productId,
            companyId: body.companyId,
            name: body.name,
            description: body.description,
            stock: body.stock,
            price: body.price,
            imageName: file ? file.filename : null,
            imagePath: file ? file.path : null,
    };

    // validacion de tipos
    console.log('Comenzando validacion JOI de request');
    let { error } = validarAsociacion(valCompanyProduct);
    
    if(error){
        console.info('Erorres encontrados en la request');
        let errores = error.details.map(e => {
            console.info(e.message);
            return e.message;
        });
        // console.info('Preparando response');
        // res.status(400).json({message: errores});
        return { status: 400, message: errores };
    }
    else{
        console.info('Validaciones de tipo de datos exitosa');

        let { user } = await getUserByEmail(body.userEmail);

        if(user){
            if(user.companyId === valCompanyProduct.companyId){
                console.info('Usuario corresponde con empresa');
                console.info('Comenzando validaciones de existencia');

                //Inicializo array de errores
                let errorMessage = [];

                let { producto: productoById, message: productMessage } = await getProductById(valCompanyProduct.productId);
                let { company, message: companyMessage } = await getCompanyById(valCompanyProduct.companyId);
                let { producto: companyProductByProduct } = await getCompanyProductByProduct(valCompanyProduct.productId);

                if(!productoById) errorMessage.push(productMessage);
                if(!company) errorMessage.push(companyMessage);
                if(companyProductByProduct) errorMessage.push(`La compania ya tiene asociado este producto`);


                if(errorMessage.length > 0){
                    console.info(`Se encontraron ${errorMessage.length} errores de existencia en la request`);
                    errorMessage.map(err => console.log(err));
                    // console.info('Enviando response')
                    // res.status(400).json({message: errorMessage});
                    return { status: 400, message: errorMessage };
                }
                else{
                    console.log('Validaciones de existencia exitosas');
                    console.info('Preparando objeto companyProduct para insertar');

                    if(!file){
                        valCompanyProduct.imageName = productoById.imageName;
                        valCompanyProduct.imagePath = productoById.imagePath;
                    }

                    let product = {
                        productId:valCompanyProduct.productId,
                        companyId: valCompanyProduct.companyId,
                        description: valCompanyProduct.description,
                        name: valCompanyProduct.name,
                        stock: valCompanyProduct.stock,
                        imageName: valCompanyProduct.imageName, //validar que la imagen si no es enviada, use la del producto
                        imagePath: valCompanyProduct.imagePath,
                        created: new Date(),
                    }

                    console.log('Enviando a insertar companyProduct');
                    let { id: companyProductId, message: companyProductMessage } = await associateProduct(product);

                    if(companyProductId){
                        console.log(`CompanyProduct insertado correctamente con ID: ${companyProductId}`);

                        let precio = {
                            price: valCompanyProduct.price,
                            productId: companyProductId,
                            validDateFrom: new Date(),
                        };

                        let {id: priceId, message: priceMessage} = await insertPrice(precio);

                        if(priceId){
                            console.log(`Price insertado correctamente con ID: ${priceId}`);

                            console.log('Asociacion de producto finalizada exitosamente');
                            // res.status(201).json(companyProductId);
                            return { status: 201, companyProduct: companyProductId };
                        }
                        else{
                            console.log(`Error al insertar price: ${priceMessage}`);
                            console.log('Ocurrio un error en el proceso de inserts, comenzando rollback');

                            console.log('Comenzando rollbacks de companyProduct');
                            let rollbackCompanyProducto = await rollbackInsertAssociateProduct(companyProductId);
                            if(rollbackCompanyProducto.res) console.log(`Rollback de CompanyProduct ${companyProductId} realizado correctamente`);
                            else console.log(`Ocurrio un error en rollback de Producto ${companyProductId}`);
                            // res.status(500).json({message: 'Ocurrio un error al asociar producto'});
                            return { status: 500, message: 'Ocurrio un error al asociar producto' };
                        }
                    }  
                    else{
                        console.log(`Error al insertar producto: ${companyProductMessage}`);
                        // res.status(500).json({message: companyProductMessage});
                        return { status: 500, message: companyProductMessage };
                    }
                }
            }
            else{
                console.info('El usuario no corresponse con la empresa');
                // console.info('Preparando response');
                // res.status(400).json('El usuario no corresponse con la empresa');
                return { status: 400, message: 'El usuario no corresponse con la empresa' };
            }
        }
        else{
            console.info('No se pudo encontrar el usuario');
            // console.info('Preparando response');
            // res.status(500).json('Ocurrio un error al asociar producto');
            return { status: 500, message: 'Ocurrio un error al asociar producto' };
        }
    }
}

async function altaAsociacionProducto(req, res){
    console.log('Conexion POST entrante : /api/product/company');

    console.log('body', req.body);

    let { status: altaStatus, message: altaMessage, product, categories } = await altaProducto(req.body, req.file);

    console.log('alta');
    console.log('status', altaStatus);
    console.log('message', altaMessage);
    console.log('product', product);
    console.log('categories', categories);

    if(altaStatus === 201){
        req.body.productId = Number(product);
        let { status: asociarStatus, message: asociarMessage, companyProduct } = await asociarProducto(req.body, req.file);

        console.log('asociar');
        console.log('status', asociarStatus);
        console.log('message', asociarMessage);
        console.log('companyProduct', companyProduct);

        if(asociarStatus === 201){
            res.status(201).json(Number(companyProduct));
        }
        else{
            //rollback de alta
            for(let cat of categories){
                console.log(`Enviando rollback de ProductCategory ID: ${cat}`);
                let rollbackProductCategory = await rollbackInsertProductCategory(cat);
                if(rollbackProductCategory.res) console.log(`Rollback de ProductCategory ${cat} realizado correctamente`);
                else console.log(`Ocurrio un error en rollback de ProductCategory ${cat}`);
            }
            console.log('Comenzando rollbacks de producto');
            let rollbackProduct = await rollbackInsertProduct(producto.id);
            if(rollbackProduct.res) console.log(`Rollback de Producto ${id} realizado correctamente`);
            else console.log(`Ocurrio un error en rollback de Producto ${id}`);
            
            res.status(asociarStatus).json(asociarMessage);
        }
    }
    else{
        res.status(altaStatus).json(altaMessage);
    }
}

async function modificarProducto(req, res){
    console.info(`Conexion PUT entrante : /api/product/${req.params.productId}/company/${req.params.companyId}`);

    console.info(`Comenzando validacion de tipos`);
    let { error: errorCompany } = validarId(req.params.companyId);
    let { error: errorProduct } = validarId(req.params.productId);

    if(errorCompany || errorProduct){
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

        let valCompanyProduct = {
            name: req.body.name,
            description: req.body.description,
            price: Number(req.body.price),
            stock: req.body.stock,
            imageName: req.file ? req.file.filename : req.body.imageName,
            imagePath: req.file ? req.file.path : req.body.imagePath
        };

        //Inicializo array de errores
        let errorMessage = [];

        console.info(`Comenzando validacion de tipos`);
        let { error: errorCompanyProduct} = validarModificacionCompanyProduct(valCompanyProduct);

        if(errorCompanyProduct) {
            console.info('Errores encontrados en la validacion de tipos de companyProduct');
            errorCompanyProduct.details.map(e => {
                console.info(e.message);
                errorMessage.push(e.message);
                return;
            });
        }

        if(errorMessage.length > 0){
            console.info(`Se encontraron ${errorMessage.length} errores de tipo en la request`);
            errorMessage.map(err => console.log(err));
            console.info('Enviando response');
            res.status(400).json({message: errorMessage});
        }
        else{
            console.info('Validacion de tipos exitosa');
            console.info('Comenzando validaciones de existencia');

            let { producto: productById, message: productByIdMessage } = await getCompanyProductById(req.params.productId);
            let { company: companyById, message: companyByIdMessage } = await getCompanyById(req.params.companyId);
            let { price:  precioActual, message: precioMessage } = await getCurrentPrice(req.params.productId);

            if(!productById) errorMessage.push(productByIdMessage);
            if(!precioActual) errorMessage.push(precioMessage);
            if(!companyById) errorMessage.push(companyByIdMessage);

            if(errorMessage.length > 0){
                console.info(`Se encontraron ${errorMessage.length} errores de existencia en la request`);
                errorMessage.map(err => console.log(err));
                console.info('Enviando response');
                res.status(400).json({message: errorMessage});
            }
            else{
                console.info('Validacion de existencia exitosas');

                console.info('Preparando objeto para update de CompanyProduct');
                let product = {
                    companyId: productById.companyId,
                    productId: productById.productId,
                    name: valCompanyProduct.name,
                    description: valCompanyProduct.description,
                    stock: valCompanyProduct.stock,
                    imageName: valCompanyProduct.imageName,
                    imagePath: valCompanyProduct.imagePath,
                };

                let { result, message: updateMessage } = await updateProduct(req.params.productId, product);

                if(result){
                    console.info(`Company con ID: ${req.params.productId} actualizada correctamente`);
                    if(precioActual.price !== valCompanyProduct.price){
                        
                        let precio = {
                            price: valCompanyProduct.price,
                            productId: req.params.productId,
                            validDateFrom: new Date(),
                        };

                        let { id: priceId, message: priceMessage } = await insertPrice(precio);

                        if(priceId){
                          console.log(`Price insertado correctamente con ID: ${priceId}`);

                          console.log('Modificacion de producto finalizada exitosamente');
                          res.status(200).json({message: 'Modificacion exitosa'});
                        }
                        else{
                          console.log(`Error al insertar price: ${priceMessage}`);
                          console.log('Comenzando rollbacks de companyProduct');
                          let productRollback = {
                            companyId: productById.companyId,
                            productId: productById.productId,
                            name: productById.name,
                            description: productById.description,
                            stock: productById.stock,
                            imageName: productById.imageName,
                            imagePath: productById.imagePath,
                           };

                           let { result: resultUpdateRollback, message: updateRollbackMessage } = await updateProduct(req.params.productId, productRollback);

                           if(resultUpdateRollback){
                             console.info(`Company con ID: ${req.params.id} corregida correctamente`);
                           }
                           else{
                            console.info('No se pudo realizar rollbacks de companyProduct');
                            console.info(updateRollbackMessage);
                            console.info('Preparando response');
                            res.status(500).json({message: 'Ocurrio un error al modificar el companyProduct'});
                            }
                        }
                    }
                    else{
                        console.info('Preparando response');
                        res.status(200).json({message: 'Modificacion exitosa'});
                    }
                }
                else{
                    console.info('No se pudo modificar companyProduct');
                    console.info('Preparando response');
                    res.status(500).json({message: updateMessage});
                }
            }
        }
    }
}

async function eliminarProducto(req, res){
    console.info(`Conexion DELETE entrante : /api/product/${req.params.id}`);

    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info('Comenzando validaciones de existencia');

        let { producto, message } = await getCompanyProductById(req.params.id);

        if(!producto){
            console.info(`No existe companyProduct con ID: ${req.params.id}`);
            console.info('Preparando response');
            res.status(400).json({message});
        }
        else{

            let { user } = await getUserByEmail(req.body.userEmail);

            if(user){
                if(user.companyId === producto.companyId){
                    console.info('Enviando request para eliminacion');
                    let { result, message: deleteMessage } = await deleteCompanyProduct(req.params.id, new Date());
                    
                    if(result){
                        console.info(`CompanyProduct con ID: ${req.params.id} eliminado correctamente`);
                        console.info('Preparando response');
                        res.status(201).json('Borrado exitoso');
                    }
                    else{
                        console.info('No se pudo eliminar CompanyProduct');
                        console.info('Preparando response');
                        res.status(500).json({message: deleteMessage});
                    }
                }
                else{
                    console.info('Usuario no corresponde con la empresa del producto');
                    console.info('Preparando response');
                    res.status(400).json({message: 'Usuario no corresponde con la empresa del producto'});
                }
            }
            else{
                console.info('No se pudo encontrar el usuario');
                console.info('Preparando response');
                res.status(500).json('Ocurrio un error al intener borrar el companyProduct');
            }
        }
    }
}

// async function getAllProductsGenericList(req, res){
//     console.log(`Conexion GET entrante : /api/product`);

//     console.log('Yendo a buscar productos');
//     let { products: Productos } = await getProducts();

//     if(Productos && Productos.length > 0){
//         console.log('Se encontraron productos');
//         console.log('Procediendo a armar response');

//         let response = [];

//         for(let prod of productos){

//             let { category: Category } = await getCategoryName(prod.id);
//             prod.categories = category;
//             response.push(prod);
//         }
//         res.status(200).json(response);
//     }
//     else {
//         console.log('No hay productos registrados');
//         res.status(200).json({message: 'No hay productos registrados'});
//     }
// }

async function getProducts(){
    console.info('Buscando todos los productos');
    let message ='';
    let products = await queries
                        .products
                        .getAll()
                        .then(data => {
                            if(data){
                                console.info('Informacion de productos obtenida');
                                return data;
                            }
                            else{
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

// async function getCategoryName(id){
//     console.info('Buscando datos de categorias');
//     let message ='';
//     let category = await queries
//                         .prodCategory
//                         .getByProdIdName(id)
//                         .then(data => {
//                             if(data.rows){
//                                 console.info('Informacion de categorias obtenida');
//                                 return data.rows;
//                             }
//                             else{
//                                 console.info(`No existen categorias registrados en la BD para el producto con id ${id}`);
//                                 message = `No existen categorias registrados en la BD para el producto con id ${id}`;
//                                 return null;
//                             }
//                         })
//                         .catch(err => {
//                             console.error(`Error en Query SELECT de Category : ${err}`);
//                             message = 'Ocurrio un error al obtener las Categorias+';
//                             return null;
//                         });
//     return { category , message };
// }

async function getCompanyProducts(){
    console.info('Buscando todos los productos de companias no eliminados');
    let message ='';
    let companyProducts = await queries
                        .companyProduct
                        .getCompanyProducts()
                        .then(data => {
                            if(data){
                                console.info('Informacion de productos no eliminados de companias obtenida');
                                return data;
                            }
                            else{
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

async function getAllCompanyProducts(){
    console.info('Buscando todos los productos de companias, incluyendo eliminados');
    let message ='';
    let companyProducts = await queries
                        .companyProduct
                        .getAll()
                        .then(data => {
                            if(data){
                                console.log(data);
                                console.info('Informacion de productos obtenida');
                                let regex = /\\/g;
                                const productos = Promise.all(data.map(async prod => {
                                    prod.imagePath = prod.imagePath.replace(regex, '/');
                                    return prod;
                                }));
                                return productos;
                            }
                            else{
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

async function getDeletedCompanyProducts(){
    console.info('Buscando todos los productos de companias eliminados');
    let message ='';
    let CompanyProducts = await queries
                        .companyProduct
                        .getDeleted()
                        .then(data => {
                            if(data){
                                console.info('Informacion de productos de companias eliminados obtenida');
                                return data;
                            }
                            else{
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

// async function getDeletedCompanyProductsList(){
//     console.info('Buscando todos los productos de companias eliminados');
//     let message ='';
//     let CompanyProducts = await queries
//                         .companyProduct
//                         .getAllForListDeleted()
//                         .then(data => {
//                             if(data.rows){
//                                 console.info('Informacion de productos de companias eliminados obtenida');
//                                 let regex = /\\/g;
//                                 const productos = Promise.all(data.rows.map(async prod => {
//                                     prod.imagePath = prod.imagePath.replace(regex, '/');
//                                     return prod;
//                                 }));
//                                 return productos;
//                             }
//                             else{
//                                 console.info('No existen productos de companias eliminados registrados en la BD');
//                                 message = 'No existen productos de companias eliminados registrados en la BD';
//                                 return null;
//                             }
//                         })
//                         .catch(err => {
//                             console.error(`Error en Query SELECT de CompanyProduct : ${err}`);
//                             message = 'Ocurrio un error al obtener los productos eliminados de companias';
//                             return null;
//                         });
//     return { CompanyProducts , message };
// }

async function getProductsByCompany(id){
    console.info(`Buscando todos los productos habilitados de la compania con id : ${id}`);
    let message ='';
    let companyProducts = await queries
                        .companyProduct
                        .getByCompany(id)
                        .then(data => {
                            if(data){
                                console.info(`Informacion de productos habilitados de la compania con id : ${id},  obtenida`);
                                return data;
                            }
                            else{
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

async function getProductsByCompanyList(id){
    console.info(`Buscando todos los productos habilitados de la compania con id : ${id}`);
    let message ='';
    let CompanyProducts = await queries
                        .companyProduct
                        .getForListHabilitadosByCompany(id)
                        .then(data => {
                            if(data.rows){
                                console.info(`Informacion de productos habilitados de la compania con id : ${id},  obtenida`);
                                let regex = /\\/g;
                                const productos = Promise.all(data.rows.map(async prod => {
                                    prod.imagePath = prod.imagePath.replace(regex, '/');
                                    return prod;
                                }));
                                return productos;
                            }
                            else{
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
    return { CompanyProducts , message };
}

async function getAllCompanyProductsByCompany(id){
    console.info(`Buscando todos los productos de la compania con id : ${id}`);
    let message ='';
    let CompanyProducts = await queries
                        .companyProduct
                        .getAllByCompany(id)
                        .then(data => {
                            if(data){
                                console.info(`Informacion de productos de la compania con id : ${id},  obtenida`);
                                return data;
                            }
                            else{
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

// async function getAllProductsByCompanyList(id){
//     console.info(`Buscando todos los productos de la compania con id : ${id}`);
//     let message ='';
//     let CompanyProducts = await queries
//                         .companyProduct
//                         .getAllForListByCompany(id)
//                         .then(data => {
//                             if(data.rows){
//                                 console.info(`Informacion de productos de la compania con id : ${id},  obtenida`);
//                                 let regex = /\\/g;
//                                 const productos = Promise.all(data.rows.map(async prod => {
//                                     prod.imagePath = prod.imagePath.replace(regex, '/');
//                                     return prod;
//                                 }));
//                                 return productos;
//                             }
//                             else{
//                                 console.info(`No existen productos para la compania con id : ${id}, registrados en la BD`);
//                                 message = `No existen productos para la compania con id : ${id}, registrados en la BD`;
//                                 return null;
//                             }
//                         })
//                         .catch(err => {
//                             console.error(`Error en Query SELECT de CompanyProduct : ${err}`);
//                             message = 'Ocurrio un error al obtener los productos de la compania';
//                             return null;
//                         });
//     return { CompanyProducts , message };
// }

async function getDeletedProductsByCompany(id){
    console.info(`Buscando todos los productos eliminados de la compania con id : ${id}`);
    let message ='';
    let companyProducts = await queries
                        .companyProduct
                        .getDeleteByCompany(id)
                        .then(data => {
                            if(data){
                                console.info(`Informacion de productos eliminados de la compania con id : ${id},  obtenida`);
                                return data;
                            }
                            else{
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

// async function getDeletedProductsByCompanyList(id){
//     console.info(`Buscando todos los productos eliminados de la compania con id : ${id}`);
//     let message ='';
//     let CompanyProducts = await queries
//                         .companyProduct
//                         .getForDeleteListByCompany(id)
//                         .then(data => {
//                             if(data.rows){
//                                 console.info(`Informacion de productos eliminados de la compania con id : ${id},  obtenida`);
//                                 let regex = /\\/g;
//                                 const productos = Promise.all(data.rows.map(async prod => {
//                                     prod.imagePath = prod.imagePath.replace(regex, '/');
//                                     return prod;
//                                 }));
//                                 return productos;
//                             }
//                             else{
//                                 console.info(`No existen productos eliminados para la compania con id : ${id}, registrados en la BD`);
//                                 message = `No existen productos eliminados para la compania con id : ${id}, registrados en la BD`;
//                                 return null;
//                             }
//                         })
//                         .catch(err => {
//                             console.error(`Error en Query SELECT de CompanyProduct : ${err}`);
//                             message = 'Ocurrio un error al obtener los productos eliminados de la compania';
//                             return null;
//                         });
//     return { CompanyProducts , message };
// }

async function getProductById(id){
    console.info(`Buscando producto con id: ${id}`);
    let message = '';
    let producto = await queries
                    .products
                    .getOneById(id)
                    .then(data => {
                        if(data){
                            console.info(`Producto con ID: ${id} encontrado`);
                            return data;
                        }
                        else{
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

async function getProductByCode(code){
    console.info(`Buscando producto con codigo: ${code}`);
    let message = '';
    let producto = await queries
                    .products
                    .getOneByCode(code)
                    .then(data => {
                        if(data){
                            console.info(`Producto con Codigo: ${code} encontrado`);
                            return data;
                        }
                        else{
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

async function getProductByName(name){
    console.info(`Buscando producto con nombre: ${name}`);
    let message = '';
    let producto = await queries
                    .products
                    .getByName(name)
                    .then(data => {
                        if(data){
                            console.info(`Producto con Nombre: ${name} encontrado`);
                            return data;
                        }
                        else{
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

async function getCompanyProductById(id){
    console.info(`Buscando CompanyProduct con id: ${id}`);
    let message = '';
    let producto = await queries
                    .companyProduct
                    .getOneById(id)
                    .then(data => {
                        if(data){
                            console.info(`CompanyProduct con id: ${id} encontrado`);
                            let regex = /\\/g;
                            // const productos = Promise.all(data.map(async prod => {
                                data.imagePath = data.imagePath.replace(regex, '/');
                                // return prod;
                            // }));
                            return data;
                        }
                        else{
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

async function getCompanyProductByProduct(id){
    console.info(`Buscando CompanyProduct con productId: ${id}`);
    let message = '';
    let producto = await queries
                    .companyProduct
                    .getOneById(id)
                    .then(data => {
                        if(data){
                            console.info(`CompanyProduct con productId: ${id} encontrado`);
                            let regex = /\\/g;
                            // const productos = Promise.all(data.map(async prod => {
                                data.imagePath = data.imagePath.replace(regex, '/');
                                // return prod;
                            // }));
                            return data;
                        }
                        else{
                            console.info(`No existe CompanyProduct con productId: ${id}`);
                            message = `No existe un CompanyProduct con productId ${id}`;
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

async function getProductsByCategory(categoryId){
    console.info(`Buscando productos de la categoria: ${categoryId}`);
    let message = '';
    let productos = await queries
                    .products
                    .getByCategoryId(categoryId)
                    .then(data => {
                        if(data){
                            console.info(`Productos con categoria: ${categoryId} encontrados`);
                            return data.rows;
                        }
                        else{
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

async function insertProduct(producto){
    console.info('Comenzando insert de Product');
    let message = '';
    let id = await queries
                        .products
                        .insert(producto)
                        .then(id => {
                            if(id){
                                console.info(`Insert de Product existoso con ID: ${id[0]}`);
                                return id[0];
                            }
                            else{
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

async function rollbackInsertProduct(id){
    let message = '';
    let res = await queries
                    .products
                    .delete(id)
                    .then(data => {
                        // console.log(`Rollback de Pedido ${id} realizado correctamente: ${data}`);
                        return data;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de Producto: ', err);
                        message += `Error en Query DELETE de Producto: ${err}`;
                    });
    return { res, message };
}

async function associateProduct(producto){
    console.info('Comenzando insert de CompanyProduct');
    let message = '';
    let id = await queries
                        .companyProduct
                        .insert(producto)
                        .then(id => {
                            if(id){
                                console.info(`Insert de CompanyProduct existoso con ID: ${id[0]}`);
                                return id[0];
                            }
                            else{
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

async function deleteCompanyProduct(id, date){
    console.info('Comenzando delete de CompanyProduct');
    let message = '';
    let result = await queries
                .companyProduct
                .delete(id, date)
                .then(res => {
                    if(res){
                        console.info(`Delete de CompanyProduct con ID: ${id} existoso`);
                        return res;
                    }
                    else{
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

async function rollbackInsertAssociateProduct(id){
    let message = '';
    let res = await queries
                    .companyProduct
                    .delete(id)
                    .then(data => {
                        // console.log(`Rollback de Pedido ${id} realizado correctamente: ${data}`);
                        return data;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de Producto: ', err);
                        message += `Error en Query DELETE de Producto: ${err}`;
                    });
    return { res, message };
}

async function updateProduct(id, producto){
    console.info('Comenzando update de CompanyProduct');
    let message = '';
    let result = await queries
                .companyProduct
                .modify(id, producto)
                .then(res => {
                    if(res){
                        console.info(`Update de CompanyProduct con ID: ${id} existoso}`);
                        return res;
                    }
                    else{
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

async function insertProductCategory(prodCategory){
    console.info('Comenzando insert de ProductCategory');
    let message = '';
    let id = await queries
                    .prodCategory
                    .insert(prodCategory)
                    .then(id => {
                            if(id){
                             console.info(`Insert de ProductCategory existoso con ID: ${id[0]}`);
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

async function rollbackInsertProductCategory(id){
    let message = '';
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

async function insertPrice(price){
    console.info('Comenzando insert de Price');
    let message = '';
    let id = await queries
                        .prices
                        .insert(price)
                        .then(id => {
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

async function rollbackInsertPrice(id){
    let message = '';
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
                    return null;
                });
    return { price, message };
}

async function getCurrentPrice(id){
    console.info(`Buscando precio actual para producto con ID: ${id}`);
    let message = '';
    let price = await queries
                .prices
                .getCurrent(id)
                .then(data => {
                    if(data) {
                        console.info(`Precio con ID: ${data.rows[0].id} encontrado`);
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
                    return null;
                });
    return { price, message };
}

async function getLastPrices(id){
    console.info(`Buscando ultimos 2 precios para producto con ID: ${id}`);
    let message = '';
    let prices = await queries
                .prices
                .getLast(id)
                .then(data => {
                    if(data) {
                        console.info(`Precios para producto ${id} encontrados`);
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
                    return null;
                });
    return { prices, message };
}

//Mejorar
const reducirStock = async (id, cantidad) => {
    console.log(`Comenzando reduccion de stock para producto con ID: ${id}, cantidad a reducir: ${cantidad}`);

    let busProd = await getCompanyProductById(id);

    if(!busProd.producto){
        console.log('Error al obtener paquete para reducir');
        return false;
    }
    console.log('Reduciendo cantidad');
    busProd.producto.stock = busProd.producto.stock - cantidad;
    let reducido = false;
    console.log('Enviando Query UPDATE');
    await queries
        .companyProduct
        .modify(id, busProd.producto)
        .then(data => {
            if(data){
                reducido = true;
                console.log('Query UPDATE exitosa');
            }
        })
        .catch(err => {
            console.log(`Error en Query UPDATE de Product: ${err}`);
        });
        
    return reducido;
}

/*


async function getProductByCompany(req, res){
    console.log(`Conexion GET entrante : /api/product/company/${req.params.id}`);

    console.log('Yendo a buscar empresa');
    let busquedaCompany = await getCompany(req.params.id);

    if(!busquedaCompany.company){
        console.log('Retornando error');
        res.status(404).json({message: busquedaCompany.message});
    }
    else{
        console.log('Yendo a buscar productos de la empresa');
        let companyProducts = await queries
                                    .companyProduct
                                    .getByCompany(req.params.id)
                                    .then(data => {
                                        return data;
                                    })
                                    .catch(err => {
                                        console.log(`Error al buscar los productos de la empresa: ${err}`);
                                        res.status(500).json({message: 'Error al buscar productos de una empresa'});
                                    });

        if(companyProducts && companyProducts.length > 0){
            console.log('La empresa tiene productos');
            console.log('Procediendo a armar response');

            let response = [];

            for(let cp of companyProducts){
                console.log(`Agregando nombre de emprsa a producto con ID: ${cp.id}`);
                cp.companyName = busquedaCompany.company.name;

                console.log(`Yendo a buscar categorias de producto con productId: ${cp.productId}`);
                cp.categories = await queries
                                    .prodCategory
                                    .getByProdIdName(cp.productId)
                                    .then(data => {
                                        return data.rows;
                                    })
                                    .catch(err => {
                                        console.log(`Error al buscar categorias de un producto: ${err}`);
                                        //hacer un res.status.json
                                    });

                cp.code = await queries
                                .products
                                .getOneById(cp.productId)
                                .then(data => {
                                    return data.code;
                                })
                                .catch(err => {
                                    console.log(`Error al obtener producto con ID: ${cp.productId}`);
                                    //hacer un res.status.json
                                });
                
                response.push(cp);
            }
        
            res.status(200).json(response);
        }
        else{
            console.log('La empresa no tiene productos');
            res.status(200).json({message: 'La empresa no tiene productos'});
        }
    }
}

async function getProductCompanyByProduct(req,res){
    console.log(`Conexion GET entrante : /api/product/${req.params.id}/companies`);
    console.log('id del producto', req.params.id);

    await queries
        .companyProduct
        .getByProduct(req.params.id)
        .then(async products => {
            console.log('Informacion de Products obtenida');
            let regex = /\\/g;
            const productos = await Promise.all(products.map(async prod => {
                let busComp = await getCompany(prod.companyId);
                prod.companyName = busComp.company.name;
                prod.imagePath = prod.imagePath.replace(regex, '/');
                return prod;
            }));
            // console.log(productos);
            res.status(200).json(productos);
        })
        .catch(err =>{
            console.log(`Error en Query SELECT a Company Product : ${err}`);
            res.status(500).json({message: err});
        });
}

async function getProductById(req,res){
    console.log('Conexion GET entrante : /api/product/id');

    let busProd = await getProduct2(req.params.id);

    console.log('Enviando respuesta');
    if(busProd.product) res.status(200).json(busProd.product);
    else res.status(404).json(busProd.message);
}
*/

function validarCode(code){
    const schema = Joi.string().required();

    return Joi.validate(code, schema);
}

function validarProducto(body) {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        code: Joi.string().required(),
        categories: Joi.array().required(),
        imageName: Joi.allow('').allow(null),
        imagePath: Joi.allow('').allow(null)
    };
    return Joi.validate(body, schema);
}

function validarAsociacion(body) {
    const schema = {
        productId: Joi.number().required(),
        companyId: Joi.number().required(),
        name: Joi.string().min(3).max(50).required(),
        description: Joi.string().min(5).max(50).required(),
        stock: Joi.number().required(),
        price: Joi.number().required(),
        imageName: Joi.allow('').allow(null),
        imagePath: Joi.allow('').allow(null)
    };
    return Joi.validate(body, schema);
}

function validarModificacionCompanyProduct(body) {
    const schema = {
        name: Joi.string().min(3).max(30).required(),
        description:Joi.string().min(5).max(50).required(),
        price:Joi.number().required(),
        stock:Joi.number().required(),
        imageName: Joi.allow('').allow(null),
        imagePath: Joi.allow('').allow(null),
    };
    return Joi.validate(body, schema);
}

async function validarCategorias(categorias){
    console.log('Iniciando validacion de categorias');
    
    let messages = [];
    let categories = [];

    for(let cat of categorias){

        let { error } = validarId(cat);

        if(error){
            console.log(`Id de categoria: ${cat} no es valido`);
            messages.push(`Id de categoria: ${cat} no es valido`);
        }
        else{
            let category = await queries
                            .categories
                            .getOneById(cat)
                            .then(res => {
                                if(res){
                                    console.log(`Categoria encontrada con ID: ${cat}`);
                                    return res;
                                }
                                else{
                                    console.log(`Categoria no encontrada con ID: ${cat}`);
                                    messages.push(`Categoria no encontrada con ID: ${cat}`);
                                    return null;
                                }
                            })
                            .catch(err => {
                                console.log(`Error en la Query SELECT de Category : ${err}`);
                                messages.push(`Error en la Query SELECT de Category : ${err}`);
                                return null;
                            });
            categories.push(category);
        }
    };
    if(messages.length === 0) return { categories, messages };
    else return { messages };
}

module.exports = {
    obtenerProducts,
    obtenerCompanyProducts,
    obtenerAllCompanyProducts,
    obtenerDeletedCompanyProducts,
    // obtenerCompanyProductsDeletedList,
    obtenerCompanyProductsByCompany,
    // obtenerCompanyProductsByCompanyList,
    obtenerAllCompanyProductsByCompany,
    // obtenerCompanyProductsAllByCompanyList,
    obtenerDeletedCompanyProductsByCompany,
    // obtenerCompanyProductsDeletedByCompanyList,
    obtenerProductById,
    obtenerCompanyProductById,
    obtenerProductByCode,
    obtenerProductsByCategory,
    // obtenerCategorias,
    altaProductoVal,
    asociarProductoVal,
    altaAsociacionProducto,
    modificarProducto,
    eliminarProducto,
    getProducts,
    getCompanyProducts,
    getAllCompanyProducts,
    getDeletedCompanyProducts,
    getProductsByCompany,
    // getProductsByCompanyList,
    getAllCompanyProductsByCompany,
    // getAllProductsByCompanyList,
    getDeletedProductsByCompany,
    // getDeletedProductsByCompanyList,
    getProductById,getProductByCode,
    getProductByName,
    getCompanyProductById,
    getProductsByCategory,
    getPriceById,
    getCurrentPrice,
    getLastPrices,
    reducirStock,
};