const Joi = require('joi');
const productQueries = require('./dbQueries');
const companyQueries = require('../companies/dbQueries');

const getCategories = (req, res) => {
    console.log('Conexion GET entrante : /api/product');

    productQueries
        .categories
        .getAll()
        .then(categories => {
            console.log('Informacion de ProductCategory obtenida');
            res.status(200).json(categories);
        })
        .catch(err => {
            console.log(`Error en Query SELECT a ProductCategory : ${err}`);
            res.status(500).json({message: err});
        });
};

const getAllProducts = (req, res) => {
    console.log('Conexion GET entrante : /api/product');

    productQueries
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
    //no me gusta como anda esto, ya que hace muchos recorridos innecesarios
    let productos = await productQueries
                    .products
                    .getAll()
                    .then(data => {
                        return data;
                    });
    let prodCategories = await productQueries
                            .prodCategory
                            .getAll()
                            .then(data => {
                                return data;
                            });
    let categories = await productQueries
                            .categories
                            .getAll()
                            .then(data => {
                                return data;
                            })
    console.log(categories);
    let response = productos.map(prod => {
        prod.categories = [];
        prodCategories.map(cat => {
            if(cat.productId === prod.id){
                let name = categories.filter(cate => {
                    return cate.id === cat.categoryId
                });
                let category = {id: cat.categoryId, name: name[0].name};
                prod.categories.push(category);
            }
        })
        return prod;
    });
    res.status(200).json(response);
}

async function getProductByCompany(req, res){

    let productos = await productQueries
                            .products
                            .getAll()
                            .then(data => {
                                return data;
                            });

    let companyProducts = await productQueries
                                    .companyProduct
                                    .getAll()
                                    .then(data => {
                                        return data;
                                    });
    // console.log('companyProducts', companyProducts);
    let companies = await companyQueries
                            .companies
                            .getAll()
                            .then(data => {
                                return data;
                            });
    let prodCategories = await productQueries
                                .prodCategory
                                .getAll()
                                .then(data => {
                                    return data;
                                });
    let categories = await productQueries
                            .categories
                            .getAll()
                            .then(data => {
                                return data;
                            })
    // console.log(categories);
    let response = companyProducts.map(prod => {
        prod.categories = [];
        prod.companyName = '';
        prod.code = '';
        prodCategories.map(cat => {
            if(cat.productId === prod.productId){
                let name = categories.filter(cate => {
                    return cate.id === cat.categoryId
                });
                let category = {id: cat.categoryId, name: name[0].name};
                prod.categories.push(category);
            }
        });
        companies.map(comp => {
            if(comp.id === prod.companyId){
                prod.companyName = comp.name;
            }
        });
        productos.map(p => {
            if(prod.productId === p.id){
                prod.code = p.code;
            }
        });
        return prod;
    });
    res.status(200).json(response);

    // let products = await productQueries
    //                         .companyProduct
    //                         .getByCompany(req.params.id)
    //                         .then(result =>{
    //                             console.log(result.rows);
    //                             return result.rows
    //                         })
    //                         .catch(err =>{
    //                             console.log(err);
    //                             res.status(500).json({message:'Error al obtener listado de productos'})
    //                         });
    // res.status(200).json({products: products});
}

//POST /api/product
async function insertProduct(req, res){
    console.log('Conexion POSTR entrante : /api/product');

    let valProduct = {
        productName: req.body.name,
        productCode: req.body.code
    }
    //no validar una categoria, sino un array
    let categories = JSON.parse('[' + req.body.categories + ']');

    let {error} = await validarRegistroProducto(valProduct);
    let valCategories = await validarCategorias(categories);

    if(!error && !valCategories){

            let product = {
                name: req.body.name,
                code : req.body.code,
                imageName: req.file.filename,
                imagePath: req.file.path
            };
        
            productId = await productQueries
                            .products
                            .insert(product)
                            .then(id => {
                                console.log('Producto insertado correctamente');
                                return id;
                                // res.status(201).json(productId);
                            })
                            .catch(err => {
                                console.log(`Error en Query INSERT de Product : ${err}`);
                                res.status(500).json({message: err});
                            });


            for(let cat in categories){

                let prodCategory = {
                    productId: productId[0],
                    categoryId: categories[cat]
                }

                await productQueries
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

            if(productId){
                res.status(201).json({message: 'insertado correctamente'});
            }
            else{
                console.log(`Error inesperado`);
                res.status(500).json({message: 'Error inesperado'});
            }
        // }
        // else{
        //     console.log(`No existe ProductCategory con id ${req.body.category}`);
        //     res.status(400).json({message: `No existe ProductCategory con id ${req.body.category}`});
        // }
    }
    else{
        console.log(`Error en la validacion de tipos de dato : ${error.details[0].message}`);
        res.status(400).json({message: error.details[0].message});
    }
    
};

async function insertCompanyProduct(req, res){
    console.log('Conexion POST entrante : /api/product/company');

    let valProduct = {
        companyId: req.body.companyId,
        productId: req.body.productId,
        productName: req.body.productName,
        productDescription: req.body.productDescription,
        productPrice: req.body.productPrice,
        productStock: req.body.productStock
    }

    console.log(valProduct);

    let {error} = await validarRegistroEmpresaProducto(valProduct);

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

        let product = await productQueries
                            .products
                            .getOneById(req.body.productId)
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
                price: req.body.productPrice,
                stock: req.body.productStock
                //imagen
            }

            productQueries
                .companyProduct
                .insert(companyProduct)
                .then(productId => {
                    console.log('CompanyProduct insertado correctamente');
                    res.status(201).json(productId);
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
};

function validarRegistroProducto(body) {
    const schema = {
        productName: Joi.string().min(3).max(30).required(),
        productCode: Joi.string().required()
    };
    return Joi.validate(body, schema);
}

async function validarCategorias(categorias){
    console.log('Iniciando validacion de categorias');
    
    let error = false;

    for(let cat in categorias){
        error = await productQueries
                        .categories
                        .getOneById(categorias[cat])
                        .then(res => {
                            if(!res) return true
                        })
                        .catch(err => {
                            console.log(`Error en la Query SELECT de Category : ${err}`);
                            // res.status(500).json({message: err});
                        });
    }
    //se esta retornando al mismo timepo que se recorre el for, arreglar esto
    return error;
}

function validarRegistroEmpresaProducto(body) {
    const schema = {
        companyId:Joi.number().required(),
        productId:Joi.number().required(),
        productName: Joi.string().min(3).max(30).required(),
        productDescription:Joi.string().min(5).max(50).required(),
        productPrice:Joi.number().required(),
        productStock:Joi.number().required(),
    };
    return Joi.validate(body, schema);
}


module.exports = { getCategories, getAllProducts, insertProduct, insertCompanyProduct, getProductByCompany, getAllProductsGenericList };