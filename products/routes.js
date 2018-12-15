const Joi = require('joi');
const queries = require('./dbQueries');
const companyQueries = require('../companies/dbQueries');
const { getCompany } = require('../companies/routes');

const getCategories = (req, res) => {
    console.log('Conexion GET entrante : /api/product/category');

    queries
        .categories
        .getAll()
        .then(categories => {
            console.log('Informacion de categories obtenida');
            res.status(200).json(categories);
        })
        .catch(err => {
            console.log(`Error en Query SELECT a Category : ${err}`);
            res.status(500).json({message: err});
        });
};

const getAllProducts = (req, res) => {
    console.log('Conexion GET entrante : /api/product');

    queries
        .products
        .getAll()
        .then(products => {
            console.log('Informaicon de Product obtenida');
            let regex = /\\/g;
            const productos = products.map(prod => {
                prod.imagePath = prod.imagePath.replace(regex, '/');
                return prod;
            });
            // console.log(productos);
            res.status(200).json(productos);
        })
        .catch(err =>{
            console.log(`Error en Query SELECT a Product : ${err}`);
            res.status(500).json({message: err});
        });
};

async function getAllProductsGenericList(req, res){
    console.log(`Conexion GET entrante : /api/product`);

    console.log('Yendo a buscar productos');
    let productos = await queries
                        .products
                        .getAll()
                        .then(data => {
                            return data;
                        })
                        .catch(err => {
                            console.log(`Error al obtener productos: ${err}`);
                            res.status(500).json(`Error al obtener productos`);
                        });

    if(productos && productos.length > 0){
        console.log('Se encontraron productos');
        console.log('Procediendo a armar response');

        let response = [];

        for(let prod of productos){

            prod.categories = await queries
                                    .prodCategory
                                    .getByProdIdName(prod.id)
                                    .then(data => {
                                        return data.rows;
                                    })
                                    .catch(err => {
                                        console.log(`Error al buscar categorias de un producto: ${err}`);
                                        //hacer un res.status.json
                                    });
            response.push(prod);
        }
        res.status(200).json(response);
    }
    else {
        console.log('No hay productos registrados');
        res.status(200).json({message: 'No hay productos registrados'});
    }
}

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

//POST /api/product
async function insertProduct(req, res){
    console.log('Conexion POSTR entrante : /api/product');

    //Armo array de categorias
    let categories = JSON.parse('[' + req.body.categories + ']');

    //Armo producto para validacion e insercion
    let valproduct = {
        name: req.body.name,
        code: req.body.code,
        categories: categories
    }

    //Mando a validar tipos de datos
    let { error } = await validarRegistroProducto(valproduct);

    if(error){
        //Si hay algun error en el tipo de datos, doy error
        console.log(`Error en la validacion de tipo de datos: ${error}`);
        res.status(400).json({message: `Error en la validacion de tipo de datos: ${error}`});
    }
    else{
        console.log('Validacion de tipos exitosa');
        //Busco el producto para ver si ya tiene ese producto en su inventario y si existe
        let busquedaProducto = await getProductByCode(valproduct.code);
        
        if(busquedaProducto.product){
            res.status(400).json({message: `Ya existe un producto con codigo: ${valproduct.code}`});
        }
        else{
            // Mando a validar existencia de categorias
            let valCategories = await validarCategorias(categories);

            if(valCategories.error){
                //Si hubo error, devuelvo el error
                console.log('Error en la validacion de existencia de categorias');
                res.status(400).json({message: valCategories.message});
            }
            else{
                console.log('Validaciones de existencia exitosas');
                //Agrego la imagen al producto a insertar
                let product = {
                    name: valproduct.name,
                    code: valproduct.code,
                    imageName: req.file.filename,
                    imagePath: req.file.path
                }

                console.log('Enviando a insertar producto');
                let insertProducto = await insertarProducto(product);

                if(insertProducto.productId){
                    console.log(`Producto insertado correctamente con ID: ${insertProducto.productId}`);
                    // console.log('product id', typeof insertProducto.productId);
                    let prodCategory = {
                        productId: insertProducto.productId
                    }

                    for(let cat in categories){

                        prodCategory.categoryId = categories[cat];

                        //mover a funcion auxiliar, guardar array de inserts
                        await queries
                                .prodCategory
                                .insert(prodCategory)
                                .then(id => {
                                    //Ver si hay que condicionar algo
                                    console.log('ProdCategory insertado correctamente');
                                    return id;
                                })
                                .catch(err => {
                                    console.log(`Error en Query INSERT de ProdCategory : ${err}`);
                                    res.status(500).json({message: err});
                                });
                        //Realizar rollbacks necesarios
                        res.status(201).json({message: 'Alta exitosa'});
                    }
                }
                else{
                    console.log(`Error al insertar producto: ${insertProducto.message}`);
                    res.status(500).json({message: insertProducto.message});
                }
            }
        }
    }    
};

async function insertarProducto(producto){
    let message = '';
    let productId = await queries
                        .products
                        .insert(producto)
                        .then(id => {
                            //Ver si hay que condicionar algo
                            // console.log('Producto insertado correctamente', id);
                            return id[0];
                        })
                        .catch(err => {
                            console.log(`Error en Query INSERT de Product : ${err}`);
                            message += `Error al insertar producto: ${err}`;
                        });
    return { productId, message };
}

async function insertCompanyProduct(req, res){
    console.log('Conexion POST entrante : /api/product/company');

    let valProduct = {
        companyId: req.body.companyId,
        productId: req.body.productId,
        productName: req.body.productName,
        productDescription: req.body.productDescription,
        productPrice: req.body.productPrice,
        productStock: req.body.productStock,
        //cambiar esto, debe recibir una imagen O los strings si no se cambio
        imageName: req.body.imageName,
        imagePath: req.body.imagePath
    }

    console.log(valProduct);

    let {error} = await validarRegistroEmpresaProducto(valProduct);

    if(!error){

        let busComp = await getCompany(req.body.companyId);
        // await companyQueries
        //                     .companies
        //                     .getOneById(req.body.companyId)
        //                     .then(comp => {
        //                         console.log('Informacion de Company obtenida');
        //                         return comp;
        //                     })
        //                     .catch(err => {
        //                         console.log(`Error en Query SELECT de Company : ${err}`);
        //                         res.status(500).json()
        //                     });

        let busProd = await getProduct2(req.body.productId);
                        // queries
                        //     .products
                        //     .getOneById(req.body.productId)
                        //     .then(prod => {
                        //         console.log('Informacion de Product obtenida');
                        //         return prod;
                        //     })
                        //     .catch(err => {
                        //         console.log(`Error en Query SELECT de Product : ${err}`);
                        //         res.status(500).json()
                        //     });
        if(busComp.company && busProd.product){

            let companyProduct = {
                companyId: busComp.company.id,
                productId: busProd.product.id,
                name: req.body.productName,
                description: req.body.productDescription,
                // price: req.body.productPrice,
                stock: req.body.productStock,
                imageName: req.body.imageName,
                imagePath: req.body.imagePath,
                created: new Date()
            }

            queries
                .companyProduct
                .insert(companyProduct)
                .then(productId => {
                    console.log('CompanyProduct insertado correctamente');
                    res.status(201).json(productId[0]);
                })
                .catch(err => {
                    console.log(`Error en Query INSERT de CompanyProduct : ${err}`);
                    res.status(500).json({message: err});
                });
        }
        else if(!busComp.company){
            console.log(busComp.message);
            console.log(`No existe Company con id ${req.body.companyId}`);
            res.status(400).json({message: `No existe Company con id ${req.body.companyId}`});
        }
        else if(!busProd.product){
            console.log(busProd.message);
            console.log(`No existe Product con id ${req.body.productId}`);
            res.status(400).json({message: `No existe Product con id ${req.body.productId}`});
        }
    }
    else{
        console.log(`Error en la validacion de tipos de dato : ${error.details[0].message}`);
        res.status(400).json({message: error.details[0].message});
    }
};

async function updateCompanyProduct(req, res){
    console.log('Conexion POST entrante : /api/product/update/company');
    let idProduct = req.params.id;
    console.log('idProduct', idProduct);

    let valProduct = {
        companyId: req.body.companyId,
        productId: req.body.productId,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock,
    }

    if(req.file){
        valProduct.imageName = req.file.filename,
        valProduct.imagePath = req.file.path
    }

    console.log(valProduct);

    let {error} = await validarRegistroEmpresaProducto2(valProduct);

    if(!error){

            queries
                .companyProduct
                .modify(idProduct ,valProduct)
                .then(productId => {
                    console.log('CompanyProduct modificado correctamente');
                    res.status(201).json(productId);
                })
                .catch(err => {
                    console.log(`Error en Query Update de CompanyProduct : ${err}`);
                    res.status(500).json({message: err});
                });
        }
    else{
        console.log(`Error en la validacion de tipos de dato : ${error.details[0].message}`);
        res.status(400).json({message: error.details[0].message});
    }
};

async function deleteCompanyProduct(req, res){
    console.log('Conexion POST entrante : /api/product/delete/company');
    
    let idProduct= req.params.id;
    
    console.log('idProduct', idProduct);

            queries
                .companyProduct
                .delete(idProduct)
                .then(productId => {
                    console.log('CompanyProduct eliminado correctamente');
                    res.status(201).json(productId);
                })
                .catch(err => {
                    console.log(`Error en Query delete de CompanyProduct : ${err}`);
                    res.status(500).json({message: err});
                });
};

const reducirStock = async (id, cantidad) => {
    console.log(`Comenzando reduccion de stock para producto con ID: ${id}, cantidad a reducir: ${cantidad}`);

    let busProd = await getProduct(id);

    if(!busProd.product){
        console.log('Error al obtener paquete para reducir');
        return false;
    }

    console.log('Reduciendo cantidad');
    busProd.product.stock = busProd.product.stock - cantidad;
    let reducido = false;
    console.log('Enviando Query UPDATE');
    await queries
        .companyProduct
        .modify(id, busProd.product)
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

function validarRegistroProducto(body) {
    const schema = {
        productName: Joi.string().min(3).max(30).required(),
        productCode: Joi.string().required(),
        categories: Joi.array().required()
    };
    return Joi.validate(body, schema);
}

async function validarCategorias(categorias){
    console.log('Iniciando validacion de categorias');
    
    let message = '';
    let categories = [];

    for(let cat in categorias){
        let category = await queries
                        .categories
                        .getOneById(categorias[cat])
                        .then(res => {
                            if(!res){
                                console.log(`Categoria no encontrada con ID: ${categorias[cat]}`);
                                message += `Categoria no encontrada con ID: ${categorias[cat]}`;
                                return null;
                            }
                            else{
                                console.log(`Categoria encontrada con ID: ${categorias[cat]}`);
                                return res;
                            }
                        })
                        .catch(err => {
                            console.log(`Error en la Query SELECT de Category : ${err}`);
                            message += `Error en la Query SELECT de Category : ${err}`;
                            // res.status(500).json({message: err});
                        });
        categories.push(category);
    };
    return { categories, message };
}

async function getProduct(productId){
    console.log(`Buscando producto con id: ${productId}`);
    let message = '';
    let product = await queries
                        .companyProduct
                        .getOneById(productId)
                        .then(data => {
                            //undefined si no existe
                            if(!data) {
                                console.log(`No existe producto con id: ${productId}`);
                                message += `No existe un producto con id ${productId}`;
                            }
                            else console.log(`Producto con ID: ${productId} encontrado`);
                            return data;
                        })
                        .catch(err => {
                            console.log('Error en Query SELECT de CompanyProduct: ', err);
                            message += `Error en Query SELECT de CompanyProduct: ${err}`;
                        });
    return { product, message };
}

async function getProductByCode(code){
    console.log(`Buscando producto con code: ${code}`);
    let message = '';
    let product = await queries
                        .products
                        .getOneByCode(code)
                        .then(data => {
                            //undefined si no existe
                            if(!data) {
                                console.log(`No existe producto con code: ${code}`);
                                message += `No existe un producto con code ${code}`;
                            }
                            else console.log(`Producto con code: ${code} encontrado`);
                            return data;
                        })
                        .catch(err => {
                            console.log('Error en Query SELECT de CompanyProduct: ', err);
                            message += `Error en Query SELECT de CompanyProduct: ${err}`;
                        });
    return { product, message };
}

async function insertProductYAssociacion(req, res){
    console.log('Conexion POST entrante : /api/product/');
    console.log('request', req.body);

    console.log('nombre imagen', req.file.filename);
    console.log('path imagen', req.file.path);


    let categories = JSON.parse('[' + req.body.categories + ']');

    let valProduct = {
        productName: req.body.productName,
        productCode: req.body.productCode,
        categories: categories
    };

    let {error} = await validarRegistroProducto(valProduct);
    let valCategories = await validarCategorias(categories);
    console.log('valCategories', valCategories);
    
    if(!error && !valCategories.message){

            let product = {
                name: req.body.productName,
                code : req.body.productCode,
                //imageName: req.body.imageName,
                //imagePath: req.body.imagePath
                imageName: req.file.filename,
                imagePath: req.file.path
            };
        
            productRes = await insertarProducto(product);
                        // queries
                        //     .products
                        //     .insert(product)
                        //     .then(id => {
                        //         console.log('Producto insertado correctamente');
                        //         return id;
                        //         // res.status(201).json(productId);
                        //     })
                        //     .catch(err => {
                        //         console.log(`Error en Query INSERT de Product : ${err}`);
                        //         res.status(500).json({message: err});
                        //     });


            for(let cat of categories){

                let prodCategory = {
                    productId: productRes.productId,
                    categoryId: cat
                }

                await queries
                        .prodCategory
                        .insert(prodCategory)
                        .then(id => {
                            console.log('ProdCategory insertado correctamente');
                            return id;
                        })
                        .catch(err => {
                            console.log(`Error en Query INSERT de ProdCategory : ${err}`);
                            res.status(500).json({message: err});
                        });
            }

            if(productRes.productId){
                let valProductCompany = {
                    companyId: req.body.companyId,
                    productId: Number(productRes.productId),
                    productName: req.body.productName,
                    productDescription: req.body.productDescription,
                    // productPrice: req.body.productPrice,
                    productStock: req.body.productStock,
                    //imageName: req.body.imageName,
                    //imagePath: req.body.imagePath
                    imageName: req.file.filename,
                    imagePath: req.file.path
                }
                console.log(valProductCompany);

                let {error} = await validarRegistroEmpresaProducto(valProductCompany);

                if(!error){

                let company = await companyQueries
                                .companies
                                .getOneById(req.body.companyId)
                                .then(comp => {
                                console.log('Informacion de Company obtenida');
                                return comp;
                                })
                                .catch(err => {
                                console.log(`Error en Query SELECT de Company : ${err}`);
                                res.status(500).json()
                                });

                let product = await queries
                                .products
                                .getOneById(Number(productId[0]))
                                .then(prod => {
                                    console.log('Informacion de Product obtenida');
                                    return prod;
                                })
                                .catch(err => {
                                console.log(`Error en Query SELECT de Product : ${err}`);
                                res.status(500).json()
                                });

                if(company && product){

                    let companyProduct = {
                    companyId: company.id,
                    productId: product.id,
                    name: req.body.productName,
                    description: req.body.productDescription,
                    // price: req.body.productPrice,
                    stock: req.body.productStock,
                    imageName: req.file.filename,
                    imagePath: req.file.path
                }

                queries
                    .companyProduct
                    .insert(companyProduct)
                    .then(productId => {
                        console.log('CompanyProduct insertado correctamente');
                        //res.status(201).json(productId);
                    })
                    .catch(err => {
                    console.log(`Error en Query INSERT de CompanyProduct : ${err}`);
                    res.status(500).json({message: err});
                });
                }
                else if(!company){
                    console.log(`No existe Company con id ${req.body.companyId}`);
                    res.status(400).json({message: `No existe Company con id ${req.body.companyId}`});
                }
                else if(!product){
                    console.log(`No existe Product con id ${req.body.productId}`);
                    res.status(400).json({message: `No existe Product con id ${req.body.productId}`});
                }
                }
                else{
                console.log(`Error en la validacion de tipos de dato : ${error.details[0].message}`);
                res.status(400).json({message: error.details[0].message});
                }
                res.status(201).json({message: 'insertado correctamente'});
            }
            else{
                console.log(`Error inesperado`);
               res.status(500).json({message: 'Error inesperado'});
           }
        }
        // }
        // else{
        //     console.log(`No existe ProductCategory con id ${req.body.category}`);
        //     res.status(400).json({message: `No existe ProductCategory con id ${req.body.category}`});
        // }
    else{
        console.log(`Error en la validacion de tipos de dato : ${error.details[0].message}`);
        res.status(400).json({message: error.details[0].message});
    }
    
};

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

//arreglar estos nombres
async function getProduct2(id){
    let message = '';
    let product = await queries
                        .products
                        .getOneById(id)
                        .then(product => {
                            if(product){
                                console.log(`Producto con ID: ${id} encontrado`);
                                return product
                            }
                            else return null
                            /*let regex = /\\/g;
                            const productos = products.imagePath.replace(regex,'/');*/
                            // console.log(productos);
                            // res.status(200).json(products);
                        })
                        .catch(err =>{
                            console.log(`Error en Query SELECT a Product : ${err}`);
                            message = err;
                        });
    return {product, message}
}

function validarRegistroEmpresaProducto(body) {
    const schema = {
        companyId:Joi.number().required(),
        productId:Joi.number().required(),
        productName: Joi.string().min(3).max(30).required(),
        productDescription:Joi.string().min(5).max(50).allow(''),
        productPrice:Joi.number().required(),
        productStock:Joi.number().required(),
        imageName: Joi.string().min(3).max(150).required().allow('').allow(null),
        imagePath: Joi.string().min(3).max(150).required().allow('').allow(null)
    };
    return Joi.validate(body, schema);
}

function validarRegistroEmpresaProducto2(body) {
    const schema = {
        companyId:Joi.number().required(),
        productId:Joi.number().required(),
        name: Joi.string().min(3).max(30).required(),
        description:Joi.string().min(5).max(50).required(),
        price:Joi.number().required(),
        stock:Joi.number().required(),
    };
    return Joi.validate(body, schema);
}


module.exports = {
    getCategories,
    getAllProducts,
    insertProduct,
    insertCompanyProduct,
    getProductByCompany,
    getAllProductsGenericList,
    reducirStock,
    updateCompanyProduct,
    deleteCompanyProduct,
    getProduct,
    insertProductYAssociacion,
    getProductCompanyByProduct,
    getProductById,
    getProductByCode
};