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

const getProducts = (req, res) => {
    console.log('Conexion GET entrante : /api/product');

    productQueries
        .products
        .getAll()
        .then(products => {
            console.log('Informaicon de Product obtenida');
            res.status(200).json(products);
        })
        .catch(err =>{
            console.log(`Error en Query SELECT a Product : ${err}`);
            res.status(500).json({message: err});
        });
};

//POST /api/product
async function insertProduct(req, res){
    console.log('Conexion POSTR entrante : /api/product');

    let valProduct = {
        productName: req.body.productName,
        productCode: req.body.productCode,
        category: req.body.category
        //imagen
    }

    let {error} = await validarRegistroProducto(valProduct);

    if(!error){
        let categoria = await productQueries
                                    .categories
                                    .getOneById(valProduct.category)
                                    .then(cat => {
                                        console.log('Informacion de ProductCategory obtenida');
                                        return cat;
                                    })
                                    .catch(err => {
                                        console.log(`Error en Query SELECT de ProductCategory : ${err}`);
                                        res.status(500).json()
                                    });
        if(categoria){

            let product = {
                name: req.body.productName,
                code : req.body.productCode,
                //agregar imagen aca
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

            let prodCategory = {
                productId: productId[0],
                categoryId: categoria.id
            }

            prodCatId = await productQueries
                            .products
                            .insertProdCategory(prodCategory)
                            .then(id => {
                                console.log('ProdCategory insertado correctamente');
                                return id;
                            })
                            .catch(err => {
                                console.log(`Error en Query INSERT de ProdCategory : ${err}`);
                                res.status(500).json({message: err});
                            });

            if(productId && prodCatId){
                res.status(201).json({message: 'insertado correctamente'});
            }
            else{
                console.log(`Error inesperado`);
                res.status(500).json({message: 'Error inesperado'});
            }
        }
        else{
            console.log(`No existe ProductCategory con id ${req.body.category}`);
            res.status(400).json({message: `No existe ProductCategory con id ${req.body.category}`});
        }
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
        productCode: Joi.string().required(),
        category: Joi.number().required(),
    };
    return Joi.validate(body, schema);
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


module.exports = { getCategories, getProducts, insertProduct, insertCompanyProduct };