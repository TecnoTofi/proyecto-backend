const Joi = require('joi');
const queries = require('./dbQueries');
const { validarId } = require('../helpers/routes');
const { getCompanyById } = require('../companies/routes');
const { categories,rubros} = require('../helpers/dbQueries');

async function obtenerVoucher(req, res){
    console.info('Conexion GET entrante : /api/voucher');

    let { voucher, message } = await getVoucher();

    if(voucher){
        console.info(`${voucher.length} voucher encontrados`);
        console.info('Preparando response');
        res.status(200).json(voucher);
    }
    else{
        console.info('No se encontraron voucher');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

async function obtenerVoucherById(req, res){
    console.log(`Conexion GET entrante : /api/voucher/${req.params.id}`);

    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info('Validacion de tipos exitosa');
        console.info(`Yendo a buscar voucher con ID: ${req.params.id}`);
        let { voucher, message } = await getVoucherById(req.params.id);

        if(voucher){
            console.info('Voucher encontrado');
            console.info('Preparando response');
            res.status(200).json(voucher);
        }
        else{
            console.info('No se encontro voucher');
            console.info('Preparando response');
            res.status(400).json({message});
        }
    }
}

async function obtenerVoucherByCode(req, res){
    console.log(`Conexion GET entrante : /api/voucher/code/${req.params.code}`);

    console.info(`Comenzando validacion de tipos`);
    let { error } = validarCode(req.params.code);

    if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info('Validacion de tipos exitosa');
        console.info(`Yendo a buscar voucher con codigo: ${req.params.code}`);
        let { voucher, message } = await getVoucherByCode(req.params.code);

        if(voucher){
            console.info('Voucher encontrado');
            console.info('Preparando response');
            res.status(200).json(voucher);
        }
        else{
            console.info('No se encontro voucher');
            console.info('Preparando response');
            res.status(400).json({message});
        }
    }
}

async function obtenerVoucherCompany(req, res){
    console.info('Conexion GET entrante : /api/voucher/voucherCompany');

    let { voucherCompany, message } = await getVoucherCompany();

    if(voucherCompany){
        console.info(`${voucherCompany.length} voucherCompany encontrados`);
        console.info('Preparando response');
        res.status(200).json(voucherCompany);
    }
    else{
        console.info('No se encontraron voucherCompany');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

async function obtenerVoucherCompanyById(req, res){
    console.log(`Conexion GET entrante : /api/voucher/voucherCompany/${req.params.id}`);

    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(req.params.id);

    if(error){
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        console.info('Validacion de tipos exitosa');
        console.info(`Yendo a buscar voucherCompany con ID: ${req.params.id}`);
        let { voucherCompany, message } = await getVoucherCompanyById(req.params.id);

        if(voucherCompany){
            console.info('VoucherCompany encontrado');
            console.info('Preparando response');
            res.status(200).json(voucherCompany);
        }
        else{
            console.info('No se encontro voucherCompany');
            console.info('Preparando response');
            res.status(400).json({message});
        }
    }
}

async function obtenerVoucherCompanyByCompanyIdByVoucher(req, res){
    console.info(`Conexion GET entrante : /api/voucher/company/${req.params.companyId}/voucher/${req.params.voucherId}`);

    console.info(`Comenzando validacion de tipos`);
    let { error: errorCompany } = validarId(req.params.companyId);
    let { error: errorVoucher } = validarId(req.params.voucherId);

    if(errorCompany || errorVoucher){
        console.info('Erorres encontrados en la request');
        let erroresCompany = [], errorVoucher = [];

        if(errorCompany){
            erroresCompany = errorCompany.details.map(e => {
                console.info(e.message);
                return e.message;
            });
        }

        if(errorVoucher){
            erroresProduct = errorProduct.details.map(e => {
                console.info(e.message);
                return e.message;
            });
        }

        let errores = erroresCompany.concat(errorVoucher);
        
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
            console.info(`Comprobando existencia de voucher ${req.params.voucherId}`);
            let { voucher, message: voucherMessage } = await getVoucherById(req.params.voucherId);

            if(!voucher){
                console.info('No se pudo encontrar el voucher');
                console.info('Preparando response');
                res.status(400).json({message: `No existe un voucher con ID ${req.params.voucherId}`});
            }
            else{
                console.info('Validacion de tipos exitosa');
                console.info(`Yendo a buscar voucherCompany con CompanyId: ${req.params.companyId} y VoucherId: ${req.params.voucherId}`);

                let { voucherCompany, message } = await getVoucherCompanyByIdByVoucher(req.params.companyId,req.params.voucherId);

                if(voucherCompany){
                    console.info('VoucherCompany encontrado');
                    console.info('Preparando response');
                    res.status(200).json(voucherCompany);
                }
                else{
                    console.info('No se encontro voucherCompany');
                    console.info('Preparando response');
                    res.status(400).json({message});
                }
            }
        }
    }
}

async function validacionVoucher(voucherId , fecha, companyId){

    console.info(`validando vaucher con id: ${voucherId}`);

    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(voucherId);
    let errorVoucher = [];

    if(error){
        console.info('Erorres encontrados en la request');
        errorVoucher = error.details.map(e => {
            console.info(e.message);
            return e.message;
        });
        
        console.info('Preparando response');
        return null;
    }
    else{
        console.info('Validaciones de tipo de datos exitosa');
            console.info(`Comprobando existencia de voucher ${voucherId}`);
            let { voucher, message: voucherMessage } = await getVoucherById(voucherId);
            let { voucherCompany, message: voucherCmpanyMessage } = await getVoucherCompanyByIdByVoucher(companyId, voucherId);

            if(!voucher){
                console.info('No se pudo encontrar el voucher');
                console('Preparando response');
                return null;
            }
            else{
                if(voucher.cantidad <= 0 || voucher.vencimiento >= fecha || voucherCompany){
                    console.log('Voucher invalido');
                    return null;
                }
                else{
                    console.log('Voucher valido');
                    return voucher;
                }
            }
        }
}

async function altaVoucherVal(req, res){
    console.log('Conexion POST entrante : /api/voucher');

    let { status, message } = await altaVoucher(req.body);

    res.status(status).json(message);
}

async function altaVoucher(body){
    // console.log('Conexion POST entrante : /api/product');

     let categories = JSON.parse('[' + body.categories + ']');
     let companies = JSON.parse('[' + body.companies + ']');
     let rubros = JSON.parse('[' + body.rubros + ']');

     console.log(categories,companies,rubros)
    
    let valVoucher = {
        voucher: body.voucher,
        type: body.type,
        value: body.value,
        companies:body.companies,
        rubros:body.rubros,
        categories:body.categories,
        cantidad: body.cantidad,
        vencimiento: body.vencimiento,
    }

    // validacion de tipos
    console.log('Comenzando validacion JOI de request');
    let { error } = validarVoucher(valVoucher);
    
    if(error){
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

        let { categorys: valCategories, messages: categoriesMessages } = await validarCategorias(categories);
        let { companiess: valCompanies, messages: companuesMessages } = await validarCompanies(companies);
        let { rubross: valRubros, messages: rubrosMessages } = await validarRubros(rubros);
        let { voucher: valVoucherCode, messages: voucherMessages } = await getVoucherByCode(valVoucher.voucher);

        if(!valCategories){
            console.info('Erorres encontrados en las categorias');
            categoriesMessages.map(msj => {
                console.info(msj);
                errorMessage.push(msj);
            });
        }
        if(!valCompanies){
            console.info('Erorres encontrados en las companias');
            companuesMessages.map(msj => {
                console.info(msj);
                errorMessage.push(msj);
            });
        }
        if(!valRubros){
            console.info('Erorres encontrados en los rubros');
            rubrosMessages.map(msj => {
                console.info(msj);
                errorMessage.push(msj);
            });
        }
        if(valVoucherCode) errorMessage.push(`Ya existe un voucher con Codigo ${valVoucher.voucher}`);


        if(errorMessage.length > 0){
            console.info(`Se encontraron ${errorMessage.length} errores de existencia en la request`);
            errorMessage.map(err => console.log(err));
            return { status: 400, message: errorMessage };
        }
        else{
            console.log('Validaciones de existencia exitosas');
            let voucher = {
                voucher: valVoucher.voucher,
                type: valVoucher.type,
                value: valVoucher.value,
                companies:valVoucher.companies,
                rubros:valVoucher.rubros,
                categories:valVoucher.categories,
                cantidad: valVoucher.cantidad,
                vencimiento: valVoucher.vencimiento,
            }
            console.log('Enviando a insertar voucher');
            let { id: voucherId, message: voucherMessage } = await insertVoucher(voucher);

            if(voucherId){
                console.log(`Voucher insertado correctamente con ID: ${voucherId}`);
                return { status: 201, voucher: voucherId };
            }
            else{
                console.log(`Error al insertar voucher: ${voucherMessage}`);
                return { status: 500, message: productMessage };
            }
        }
    }
}

async function altaVoucherCompanyVal(req, res){
    console.log('Conexion POST entrante : /api/voucher/voucherCompany');

    let { status, message, voucher } = await altaVoucherCompany(req.body);

    if(status === 201) res.status(status).json(voucher);
    else res.status(status).json(message);
}

async function altaVoucherCompany(body){
    
    let valVoucherCompany = {
        voucherId: body.voucherId,
        companyId: body.companyId,
    }

    // validacion de tipos
    console.log('Comenzando validacion JOI de request');
    let { error } = validarVoucherCompany(valVoucherCompany);
    
    if(error){
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

        let { voucher: valVaucher, message: voucherMessages } = await getVoucherById(valVoucherCompany.voucherId);
        let { company: valCompany, message: companyMessages } = await getCompanyById(valVoucherCompany.companyId);

        if(!valVaucher) errorMessage.push(voucherMessages);
        if(!valCompany) errorMessage.push(companyMessages);


        if(errorMessage.length > 0){
            console.info(`Se encontraron ${errorMessage.length} errores de existencia en la request`);
            errorMessage.map(err => console.log(err));
            return { status: 400, message: errorMessage };
        }
        else{

            let { voucherCompany: existe, message: voucherCompanyMessage} = await getVoucherCompanyByIdByVoucher(body.companyId, body.voucherId);

            if(existe){
                console.info(`Company con ID: ${body.companyId} ya utilizo voucher con ID: ${body.voucherId} anteriormente`);
                console.info('Preparando response');
                return { status: 400, message: `Company con ID: ${body.companyId} ya utilizo voucher con ID: ${body.voucherId} anteriormente` };
            }
            else{
                console.log('Validaciones de existencia exitosas');
                let voucherCompany = {
                    voucherId: valVoucherCompany.voucherId,
                    companyId: valVoucherCompany.companyId,   
                }
                console.log('Enviando a insertar voucherCompany');
                let { id: voucherCompanyId, message: voucherCompanyMessage } = await insertVoucherCompany(voucherCompany);
    
                if(voucherCompanyId){
                    console.log(`VoucherCompany insertado correctamente con ID: ${voucherCompanyId}`);
                    return { status: 201, voucher: voucherCompanyId };
                }
                else{
                    console.log(`Error al insertar voucher: ${voucherCompanyMessage}`);
                    return { status: 500, message: voucherCompanyMessage };
                }
            }
        }
    }
}

async function getVoucher(){
    console.info(`Buscando todos los voucher`);
    let message = '';
    let voucher = await queries
                        .voucher
                        .getAll()
                        .then(async data => {
                            if(data){
                                return data;
                            }
                            else{
                                console.info(`No existen voucher registrados en la BD`);
                                message = `No existen voucher registrados en la BD`;
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de Voucher : ${err}`);
                            message = 'Ocurrio un error al obtener los voucher';
                            return null;
                        });
    return { voucher, message };
}

async function getVoucherById(id){
    console.info(`Buscando voucher con ID: ${id}`);
    let message = '';
    let voucher = await queries
                    .voucher
                    .getOneById(id)
                    .then(async data => {
                        if(data){
                            return data
                        }
                        else{
                            console.info(`No existe voucher con ID: ${id}`);
                            message = `No existe un voucher con ID ${id}`;
                            return null;
                        }
                    })
                    .catch(err => {
                        console.error(`Error en Query SELECT de Voucher : ${err}`);
                        message = 'Ocurrio un error al obtener el voucher';
                        return null;
                    });
    return { voucher, message };
}

async function getVoucherByCode(code){
    console.info(`Buscando voucher con codigo: ${code}`);
    let message = '';
    let voucher = await queries
                    .voucher
                    .getOneByCode(code)
                    .then(async data => {
                        if(data){
                            console.log(`Voucher con codigo: ${code} encontrado`);
                            return data
                        }
                        else{
                            console.info(`No existe voucher con code: ${code}`);
                            message = `No existe un voucher con code ${code}`;
                            return null;
                        }
                    })
                    .catch(err => {
                        console.error(`Error en Query SELECT de Voucher : ${err}`);
                        message = 'Ocurrio un error al obtener el voucher';
                        return null;
                    });
    return { voucher, message };
}

async function getVoucherCompany(){
    console.info(`Buscando todos los VoucherCompany`);
    let message = '';
    let voucherCompany = await queries
                        .voucherCompany
                        .getAll()
                        .then(async data => {
                            if(data){
                                return data;
                            }
                            else{
                                console.info(`No existen VoucherCompany registrados en la BD`);
                                message = `No existen VoucherCompany registrados en la BD`;
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de VoucherCompany : ${err}`);
                            message = 'Ocurrio un error al obtener los voucherCompany';
                            return null;
                        });
    return { voucherCompany, message };
}

async function getVoucherCompanyById(id){
    console.info(`Buscando voucher con ID: ${id}`);
    let message = '';
    let voucherCompany = await queries
                    .voucherCompany
                    .getOneById(id)
                    .then(async data => {
                        if(data){
                            return data
                        }
                        else{
                            console.info(`No existe VoucherCompany con ID: ${id}`);
                            message = `No existe un VoucherCompany con ID ${id}`;
                            return null;
                        }
                    })
                    .catch(err => {
                        console.error(`Error en Query SELECT de VoucherCompany : ${err}`);
                        message = 'Ocurrio un error al obtener el VoucherCompany';
                        return null;
                    });
    return { voucherCompany, message };
}

async function getVoucherCompanyByIdByVoucher(companyId,voucherId){
    console.info(`Buscando todos los VoucherCompany`);
    let message = '';
    let voucherCompany = await queries
                        .voucherCompany
                        .getOneByCompanyIdByVoucher(companyId,voucherId)
                        .then(async data => {
                            if(data){
                                return data;
                            }
                            else{
                                console.info(`No existe VoucherCompany con companyId: ${companyId} y voucherId: ${voucherId}`);
                                message = `No existe VoucherCompany con companyId: ${companyId} y voucherId: ${voucherId}`;
                                return null;
                            }
                        })
                        .catch(err => {
                            console.error(`Error en Query SELECT de VoucherCompany : ${err}`);
                            message = 'Ocurrio un error al obtener los voucherCompany';
                            return null;
                        });
    return { voucherCompany, message };
}

async function getAllByVoucher(id){
    console.info(`Buscando voucher con ID: ${id}`);
    let message = '';
    let voucherCompany = await queries
                    .voucherCompany
                    .getAllByVoucher(id)
                    .then(async data => {
                        if(data){
                            return data
                        }
                        else{
                            console.info(`No existe VoucherCompany con voucherId: ${id}`);
                            message = `No existe un VoucherCompany con voucherId ${id}`;
                            return null;
                        }
                    })
                    .catch(err => {
                        console.error(`Error en Query SELECT de VoucherCompany : ${err}`);
                        message = 'Ocurrio un error al obtener el VoucherCompany';
                        return null;
                    });
    return { voucherCompany, message };
}

async function getAllByCompany(id){
    console.info(`Buscando voucher con ID: ${id}`);
    let message = '';
    let voucherCompany = await queries
                    .voucherCompany
                    .getAllByCompany(id)
                    .then(async data => {
                        if(data){
                            return data
                        }
                        else{
                            console.info(`No existe VoucherCompany con companyId: ${id}`);
                            message = `No existe un VoucherCompany con companyId ${id}`;
                            return null;
                        }
                    })
                    .catch(err => {
                        console.error(`Error en Query SELECT de VoucherCompany : ${err}`);
                        message = 'Ocurrio un error al obtener el VoucherCompany';
                        return null;
                    });
    return { voucherCompany, message };
}

async function insertVoucher(voucher){
    console.info('Comenzando insert de Voucher');
    let message = '';
    let id = await queries
            .voucher
            .insert(voucher)
            .then(res => {
                if(res){
                    console.log(`Insert de Voucher exitoso con ID: ${res[0]}`);
                    return res[0];
                }
                else{
                    console.info('Ocurrio un error');
                    message = 'Ocurrio un error al intertar dar de alta';
                    return 0;
                }
            })
            .catch(err => {
                console.log('Error en Query INSERT de Voucher: ', err);
                message = 'Ocurrio un error al intertar dar de alta';
                return 0;
            });

    return { id, message};
}

async function insertVoucherCompany(voucherCompany){
    console.info('Comenzando insert de VoucherCompany');
    let message = '';
    let id = await queries
            .voucherCompany
            .insert(voucherCompany)
            .then(res => {
                if(res){
                    console.log(`Insert de VoucherCompany exitoso con ID: ${res[0]}`);
                    return res[0];
                }
                else{
                    console.info('Ocurrio un error');
                    message = 'Ocurrio un error al intertar dar de alta';
                    return 0;
                }
            })
            .catch(err => {
                console.log('Error en Query INSERT de VoucherCompany: ', err);
                message = 'Ocurrio un error al intertar dar de alta';
                return 0;
            });
            
    return { id, message};
}

async function rollbackVoucher(id){
    let message = '';
    let result = await queries
                    .voucher
                    .delete(id)
                    .then(res => {
                        return res;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de Voucher: ', err);
                        message += `Error en Query DELETE de Voucher: ${err}`;
                    });
    return { result, message };
}

async function rollbackVoucherCompany(id){
    let message = '';
    let result = await queries
                    .voucherCompany
                    .delete(id)
                    .then(res => {
                        return res;
                    })
                    .catch(err => {
                        console.log('Error en Query DELETE de VoucherCompany: ', err);
                        message += `Error en Query DELETE de VoucherCompany: ${err}`;
                    });
    return { result, message };
}

function validarVoucher(body){
    console.info('Comenzando validacion Joi de Voucher');
    const schema = Joi.object().keys({
        voucher: Joi.string().required(),
        type: Joi.string().required(),
        value: Joi.number().required(),
        companies: Joi.string().required(),
        rubros: Joi.string(),
        categories: Joi.string().required(),
        cantidad: Joi.number().required(),
        vencimiento: Joi.date().required()
    });
    console.info('Finalizando validacion Joi de Voucher');
    return Joi.validate(body, schema);
}

function validarVoucherCompany(body){
    console.info('Comenzando validacion Joi de VoucherCompany');
    const schema = Joi.object().keys({
        voucherId: Joi.number().required(),
        companyId: Joi.number().required()
    });
    console.info('Finalizando validacion Joi de VoucherCompany');
    return Joi.validate(body, schema);
}

async function validarCategorias(categorias){
    console.log('Iniciando validacion de categorias');
    
    let messages = [];
    let categorys = [];

    for(let cat of categorias){

        let { error } = validarId(cat);

        if(error){
            console.log(`Id de categoria: ${cat} no es valido`);
            messages.push(`Id de categoria: ${cat} no es valido`);
        }
        else{
            let category = await categories
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
            categorys.push(category);
        }
    };
    if(messages.length === 0) return { categorys, messages };
    else return { messages };
}

async function validarRubros(rubro){
    console.log('Iniciando validacion de rubros');
    
    let messages = [];
    let rubross = [];

    for(let rub of rubro){

        let { error } = validarId(rub);

        if(error){
            console.log(`Id de rubro: ${rub} no es valido`);
            messages.push(`Id de rubro: ${rub} no es valido`);
        }
        else{
            let Rubro = await rubros
                            .getOneById(rub)
                            .then(res => {
                                if(res){
                                    console.log(`Rubro encontrado con ID: ${rub}`);
                                    return res;
                                }
                                else{
                                    console.log(`Rubro no encontrado con ID: ${rub}`);
                                    messages.push(`Rubro no encontrado con ID: ${rub}`);
                                    return null;
                                }
                            })
                            .catch(err => {
                                console.log(`Error en la Query SELECT de Rubro : ${err}`);
                                messages.push(`Error en la Query SELECT de Rubro : ${err}`);
                                return null;
                            });
                            rubross.push(Rubro);
        }
    };
    if(messages.length === 0) return { rubross, messages };
    else return { messages };
}

async function validarCompanies(companies){
    console.log('Iniciando validacion de categorias');
    
    let messages = [];
    let companiess = [];

    for(let comp of companies){

        let { error } = validarId(comp);

        if(error){
            console.log(`Id de company: ${comp} no es valido`);
            messages.push(`Id de company: ${comp} no es valido`);
        }
        else{
            let Company = getCompanyById(comp);
            companiess.push(Company);
        }
    };
    if(messages.length === 0) return { companiess, messages };
    else return { messages };
}

function validarCode(code){
    console.info('Comenzando validacion Joi de Codigo');
    const schema = Joi.string().required();
    console.info('Finalizando validacion Joi de Codigo');
    return Joi.validate(code, schema);
}

const ajustarStock = async (id, cantidad, tipo) => {
    console.info(`Comenzando ajuste de stock para voucher con ID: ${id}, cantidad a ${tipo}: ${cantidad}`);

    let { voucher } = await getVoucherById(id);

    if(!voucher){
        console.info('No se pudo encontrar el voucher');
        return false;
    }
    else{
        console.log('Procediendo a ${tipo} la cantidad');
        voucher.cantidad = tipo === 'reducir' ? voucher.cantidad - cantidad : voucher.cantidad + cantidad;

        let reducido = false;
        console.log('Enviando Query UPDATE');
        await queries
                .voucher
                .modify(id, voucher)
                .then(data => {
                    if(data){
                        reducido = true;
                        console.log('Query UPDATE exitosa');
                    }
                    else{
                        console.log(`Error en Query UPDATE de Voucher: ${err}`);
                    }
                })
                .catch(err => {
                    console.log(`Error en Query UPDATE de Voucher: ${err}`);
                });
        return reducido;
    }
}

module.exports = {
    obtenerVoucher,
    obtenerVoucherById,
    obtenerVoucherByCode,
    obtenerVoucherCompany,
    obtenerVoucherCompanyById,
    obtenerVoucherCompanyByCompanyIdByVoucher,
    altaVoucherVal,
    altaVoucherCompanyVal,
    ajustarStock,
    getVoucherByCode,
    insertVoucherCompany,
    validacionVoucher
}