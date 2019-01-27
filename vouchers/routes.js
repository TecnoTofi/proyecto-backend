//Incluimos Joi para validaciones
const Joi = require('joi');
//Incluimos queries de DB
const queries = require('./dbQueries');
//Incluimos funciones de helpers
const { validarId, getCategoryById, getRubroById } = require('../helpers/routes');
//Incluimos funciones de companies
const { getCompanyById } = require('../companies/routes');

//Endpoint para obtener todos los vouchers
async function obtenerVoucher(req, res){
    console.info('Conexion GET entrante : /api/voucher');

    //Obtenemos los datos
    let { voucher, message } = await getVoucher();

    if(voucher){
        //Retornamos los datos
        console.info(`${voucher.length} voucher encontrados`);
        console.info('Preparando response');
        res.status(200).json(voucher);
    }
    else{
        //Si fallo, damos error
        console.info('No se encontraron voucher');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

//Endpoint para obtener voucher filtrando por ID
async function obtenerVoucherById(req, res){
    console.log(`Conexion GET entrante : /api/voucher/${req.params.id}`);

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
        //Obtenemos los datos
        console.info('Validacion de tipos exitosa');
        console.info(`Yendo a buscar voucher con ID: ${req.params.id}`);
        let { voucher, message } = await getVoucherById(req.params.id);

        if(voucher){
            //Retornamos los datos
            console.info('Voucher encontrado');
            console.info('Preparando response');
            res.status(200).json(voucher);
        }
        else{
            //Si fallo, damos error
            console.info('No se encontro voucher');
            console.info('Preparando response');
            res.status(400).json({message});
        }
    }
}

//Endpoint para obtener voucher filtrando por codigo
async function obtenerVoucherByCode(req, res){
    console.log(`Conexion GET entrante : /api/voucher/code/${req.params.code}`);

    //Validamos parametros de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarCode(req.params.code);

    if(error){
        //Si hay error, retornamos
        console.info(`Error en la validacion de tipos: ${error.details[0].message}`);
        console.info('Preparando response');
        res.status(400).json({message: error.details[0].message});
    }
    else{
        //Obtenemos los datos
        console.info('Validacion de tipos exitosa');
        console.info(`Yendo a buscar voucher con codigo: ${req.params.code}`);
        let { voucher, message } = await getVoucherByCode(req.params.code);

        if(voucher){
            //Retornamos los datos
            console.info('Voucher encontrado');
            console.info('Preparando response');
            res.status(200).json(voucher);
        }
        else{
            //Si fallo, damos error
            console.info('No se encontro voucher');
            console.info('Preparando response');
            res.status(400).json({message});
        }
    }
}

//Endpoint para obtener todos los datos de la relacion voucher - company
async function obtenerVoucherCompany(req, res){
    console.info('Conexion GET entrante : /api/voucher/voucherCompany');

    //Obtenemos los datos
    let { voucherCompany, message } = await getVoucherCompany();

    if(voucherCompany){
        //Retornamos los datos
        console.info(`${voucherCompany.length} voucherCompany encontrados`);
        console.info('Preparando response');
        res.status(200).json(voucherCompany);
    }
    else{
        //Si fallo, damos error
        console.info('No se encontraron voucherCompany');
        console.info('Preparando response');
        res.status(200).json({message});
    }
}

//Endpoint para obtener datos de la relacion voucher - company filtrando por ID
async function obtenerVoucherCompanyById(req, res){
    console.log(`Conexion GET entrante : /api/voucher/voucherCompany/${req.params.id}`);

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
        //Obtenemos los datos
        console.info('Validacion de tipos exitosa');
        console.info(`Yendo a buscar voucherCompany con ID: ${req.params.id}`);
        let { voucherCompany, message } = await getVoucherCompanyById(req.params.id);

        if(voucherCompany){
            //Retornamos los datos
            console.info('VoucherCompany encontrado');
            console.info('Preparando response');
            res.status(200).json(voucherCompany);
        }
        else{
            //Si fallo, damos error
            console.info('No se encontro voucherCompany');
            console.info('Preparando response');
            res.status(400).json({message});
        }
    }
}

//Endpoint para obtener datos de la relacion voucher - company filtrando por ID de voucher
async function obtenerVoucherCompanyByCompanyIdByVoucher(req, res){
    console.info(`Conexion GET entrante : /api/voucher/company/${req.params.companyId}/voucher/${req.params.voucherId}`);

    //Validamos parametros de la URL
    console.info(`Comenzando validacion de tipos`);
    let { error: errorCompany } = validarId(req.params.companyId);
    let { error: errorVoucher } = validarId(req.params.voucherId);

    if(errorCompany || errorVoucher){
        //Si hay error, retornamos
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
        //Obtenemos los datos de la company
        console.info('Validaciones de tipo de datos exitosa');
        console.info(`Comprobando existencia de company ${req.params.companyId}`);
        let { company, message: companyMessage } = await getCompanyById(req.params.companyId);

        if(!company){
            console.info(`No existe company con ID: ${req.params.companyId}`);
            console.info('Preparando response');
            res.status(400).json({message: companyMessage});
        }
        else{
            //Obtenemos los datos del voucher
            console.info(`Comprobando existencia de voucher ${req.params.voucherId}`);
            let { voucher, message: voucherMessage } = await getVoucherById(req.params.voucherId);

            if(!voucher){
                //Si fallo, damos error
                console.info('No se pudo encontrar el voucher');
                console.info('Preparando response');
                res.status(400).json({message: `No existe un voucher con ID ${req.params.voucherId}`});
            }
            else{
                //Obtenemos los datos de la relacion voucher - company
                console.info('Validacion de tipos exitosa');
                console.info(`Yendo a buscar voucherCompany con CompanyId: ${req.params.companyId} y VoucherId: ${req.params.voucherId}`);
                
                let { voucherCompany, message } = await getVoucherCompanyByIdByVoucher(req.params.companyId,req.params.voucherId);
                
                if(voucherCompany){
                    //Retornamos los datos
                    console.info('VoucherCompany encontrado');
                    console.info('Preparando response');
                    res.status(200).json(voucherCompany);
                }
                else{
                    //Si fallo, damos error
                    console.info('No se encontro voucherCompany');
                    console.info('Preparando response');
                    res.status(400).json({message});
                }
            }
        }
    }
}

//Auxiliar para validar existencia, estado y stock de un voucher
async function validacionVoucher(voucherId , fecha, companyId){
    console.info(`validando vaucher con id: ${voucherId}`);

    //Validamos tipo de datos
    console.info(`Comenzando validacion de tipos`);
    let { error } = validarId(voucherId);
    let errorVoucher = [];

    if(error){
        //Si fallo, damos error
        console.info('Erorres encontrados en la request');
        errorVoucher = error.details.map(e => {
            console.info(e.message);
            return e.message;
        });
        
        console.info('Preparando response');
        return null;
    }
    else{
        //Obtenemos los datos
        console.info('Validaciones de tipo de datos exitosa');
        console.info(`Comprobando existencia de voucher ${voucherId}`);
        let { voucher, message: voucherMessage } = await getVoucherById(voucherId);
        let { voucherCompany, message: voucherCmpanyMessage } = await getVoucherCompanyByIdByVoucher(companyId, voucherId);

        if(!voucher){
            //Si fallo, damos error
            console.info('No se pudo encontrar el voucher');
            console('Preparando response');
            return null;
        }
        else{
            //Verificamos validez
            if(voucher.cantidad <= 0 || voucher.vencimiento < fecha || voucherCompany){
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

//Endpoint para registrar un nuevo voucher
async function altaVoucherVal(req, res){
    console.log('Conexion POST entrante : /api/voucher');

    //Llamamos auxiliar para realizar alta
    let { status, message } = await altaVoucher(req.body);

    //Retornamos resultado
    res.status(status).json(message);
}

//Auxiliar para registrar un nuevo voucher
async function altaVoucher(body){
    console.log('Comenzando proceso de alta de voucher');

    //Convertimos en array los datos del voucher
     let categories = JSON.parse('[' + body.categories + ']');
     let companies = JSON.parse('[' + body.companies + ']');
     let rubros = JSON.parse('[' + body.rubros + ']');
    
    //Preparamos body para validar voucher
    let valVoucher = {
        voucher: body.voucher,
        type: body.type,
        value: body.value,
        companies:body.companies,
        rubros: body.rubros,
        categories: body.categories,
        cantidad: body.cantidad,
        vencimiento: body.vencimiento,
    }

    //Validacion de tipos
    console.log('Comenzando validacion JOI de request');
    let { error } = validarVoucher(valVoucher);
    
    if(error){
        //Si fallo, retornamos
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

        //Obtenemos los datos para validar existencia
        let { categories: valCategories, messages: categoriesMessages } = await validarCategorias(categories);
        let { companies: valCompanies, messages: companuesMessages } = await validarCompanies(companies);
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
            //Si fallo damos error
            console.info(`Se encontraron ${errorMessage.length} errores de existencia en la request`);
            errorMessage.map(err => console.log(err));
            return { status: 400, message: errorMessage };
        }
        else{
            //Preparamos body para insertar voucher
            console.log('Validaciones de existencia exitosas');
            let voucher = {
                voucher: valVoucher.voucher,
                type: valVoucher.type,
                value: valVoucher.value,
                companies: valVoucher.companies,
                rubros: valVoucher.rubros,
                categories: valVoucher.categories,
                cantidad: valVoucher.cantidad,
                vencimiento: valVoucher.vencimiento,
            }
            console.log('Enviando a insertar voucher');
            let { id: voucherId, message: voucherMessage } = await insertVoucher(voucher);

            if(voucherId){
                //Retornamos ID
                console.log(`Voucher insertado correctamente con ID: ${voucherId}`);
                return { status: 201, voucher: voucherId };
            }
            else{
                //Si fallo damos error
                console.log(`Error al insertar voucher: ${voucherMessage}`);
                return { status: 500, message: productMessage };
            }
        }
    }
}

//Endpoint para registrar el uso de un voucher por una company
async function altaVoucherCompanyVal(req, res){
    console.log('Conexion POST entrante : /api/voucher/voucherCompany');

    //Llamamos auxiliar para alta de voucher - company
    let { status, message, voucher } = await altaVoucherCompany(req.body);

    //Retornamos resultado
    if(status === 201) res.status(status).json(voucher);
    else res.status(status).json(message);
}

//Auxiliar para registrar el uso de un voucher por una company
async function altaVoucherCompany(body){
    
    //Creamos body para validacion
    let valVoucherCompany = {
        voucherId: body.voucherId,
        companyId: body.companyId,
    }

    //Validacion de tipos
    console.log('Comenzando validacion JOI de request');
    let { error } = validarVoucherCompany(valVoucherCompany);
    
    if(error){
        //Si fallo, retornamos
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

        //Obtenemos datos para validar existencias
        let { voucher: valVaucher, message: voucherMessages } = await getVoucherById(valVoucherCompany.voucherId);
        let { company: valCompany, message: companyMessages } = await getCompanyById(valVoucherCompany.companyId);

        if(!valVaucher) errorMessage.push(voucherMessages);
        if(!valCompany) errorMessage.push(companyMessages);


        if(errorMessage.length > 0){
            //Si hay error, retornamos
            console.info(`Se encontraron ${errorMessage.length} errores de existencia en la request`);
            errorMessage.map(err => console.log(err));
            return { status: 400, message: errorMessage };
        }
        else{
            //Obtenemos los datos
            let { voucherCompany: existe, message: voucherCompanyMessage} = await getVoucherCompanyByIdByVoucher(body.companyId, body.voucherId);

            if(existe){
                //Si ya existe, informamos de repetido
                console.info(`Company con ID: ${body.companyId} ya utilizo voucher con ID: ${body.voucherId} anteriormente`);
                console.info('Preparando response');
                return { status: 400, message: `Company con ID: ${body.companyId} ya utilizo voucher con ID: ${body.voucherId} anteriormente` };
            }
            else{
                //Si no existe, creamos body para insert
                console.log('Validaciones de existencia exitosas');
                let voucherCompany = {
                    voucherId: valVoucherCompany.voucherId,
                    companyId: valVoucherCompany.companyId,   
                }
                //Llamamos auxiliar para insert
                console.log('Enviando a insertar voucherCompany');
                let { id: voucherCompanyId, message: voucherCompanyMessage } = await insertVoucherCompany(voucherCompany);
    
                if(voucherCompanyId){
                    //Si salio bien, retornamos OK
                    console.log(`VoucherCompany insertado correctamente con ID: ${voucherCompanyId}`);
                    return { status: 201, voucher: voucherCompanyId };
                }
                else{
                    //Si fallo damos error
                    console.log(`Error al insertar voucher: ${voucherCompanyMessage}`);
                    return { status: 500, message: voucherCompanyMessage };
                }
            }
        }
    }
}

//Auxiliar para obtener todos los vouchers
async function getVoucher(){
    console.info(`Buscando todos los voucher`);
    let message = '';
    //Conectamos con las queries
    let voucher = await queries
                        .voucher
                        .getAll()
                        .then(async data => {
                            //Si se consiguio la info
                            if(data){
                                return data;
                            }
                            else{
                                //Si no se consiguieron datos
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

//Auxiliar para obtener voucher filtrando por ID
async function getVoucherById(id){
    console.info(`Buscando voucher con ID: ${id}`);
    let message = '';
    //Conectamos con las queries
    let voucher = await queries
                    .voucher
                    .getOneById(id)
                    .then(async data => {
                        //Si se consiguio la info
                        if(data){
                            return data
                        }
                        else{
                            //Si no se consiguieron datos
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

//Auxiliar para obtener voucher filtrando por codigo
async function getVoucherByCode(code){
    console.info(`Buscando voucher con codigo: ${code}`);
    let message = '';
    //Conectamos con las queries
    let voucher = await queries
                    .voucher
                    .getOneByCode(code)
                    .then(async data => {
                        //Si se consiguio la info
                        if(data){
                            console.log(`Voucher con codigo: ${code} encontrado`);
                            return data
                        }
                        else{
                            //Si no se consiguieron datos
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

//Auxiliar para obtener todos los datos de la relacion voucher - company
async function getVoucherCompany(){
    console.info(`Buscando todos los VoucherCompany`);
    let message = '';
    //Conectamos con las queries
    let voucherCompany = await queries
                        .voucherCompany
                        .getAll()
                        .then(async data => {
                            //Si se consiguio la info
                            if(data){
                                return data;
                            }
                            else{
                                //Si no se consiguieron datos
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

//Auxiliar para obtener todos los datos de la relacion voucher - company filtrando por ID
async function getVoucherCompanyById(id){
    console.info(`Buscando voucher con ID: ${id}`);
    let message = '';
    //Conectamos con las queries
    let voucherCompany = await queries
                    .voucherCompany
                    .getOneById(id)
                    .then(async data => {
                        //Si se consiguio la info
                        if(data){
                            return data
                        }
                        else{
                            //Si no se consiguieron datos
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

//Auxiliar para obtener todos los datos de la relacion voucher - company filtrando por ID de voucher e ID de company
async function getVoucherCompanyByIdByVoucher(companyId,voucherId){
    console.info(`Buscando todos los VoucherCompany`);
    let message = '';
    //Conectamos con las queries
    let voucherCompany = await queries
                        .voucherCompany
                        .getOneByCompanyIdByVoucher(companyId,voucherId)
                        .then(async data => {
                            //Si se consiguio la info
                            if(data){
                                return data;
                            }
                            else{
                                //Si no se consiguieron datos
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

//Auxliar para obtener todos los datos de la relacion voucher - company filtando por ID de voucher
async function getAllByVoucher(id){
    console.info(`Buscando voucher con ID: ${id}`);
    let message = '';
    //Conectamos con las queries
    let voucherCompany = await queries
                    .voucherCompany
                    .getAllByVoucher(id)
                    .then(async data => {
                        //Si se consiguio la info
                        if(data){
                            return data
                        }
                        else{
                            //Si no se consiguieron datos
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

//Auxliar para obtener todos los datos de la relacion voucher - company filtando por ID de company
async function getAllByCompany(id){
    console.info(`Buscando voucher con ID: ${id}`);
    let message = '';
    //Conectamos con las queries
    let voucherCompany = await queries
                    .voucherCompany
                    .getAllByCompany(id)
                    .then(async data => {
                        //Si se consiguio la info
                        if(data){
                            return data
                        }
                        else{
                            //Si no se consiguieron datos
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

//Auxiliar para insertar un nuevo voucher
async function insertVoucher(voucher){
    console.info('Comenzando insert de Voucher');
    let message = '';
    //Conectamos con las queries
    let id = await queries
            .voucher
            .insert(voucher)
            .then(res => {
                //Si se consiguio la info
                if(res){
                    console.log(`Insert de Voucher exitoso con ID: ${res[0]}`);
                    return res[0];
                }
                else{
                    //Si no se consiguieron datos
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

//Auxiliar para insertar una nueva realcion de voucher - company
async function insertVoucherCompany(voucherCompany){
    console.info('Comenzando insert de VoucherCompany');
    let message = '';
    //Conectamos con las queries
    let id = await queries
            .voucherCompany
            .insert(voucherCompany)
            .then(res => {
                //Si se consiguio la info
                if(res){
                    console.log(`Insert de VoucherCompany exitoso con ID: ${res[0]}`);
                    return res[0];
                }
                else{
                    //Si no se consiguieron datos
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

//Rollback de insert de voucher
async function rollbackVoucher(id){
    let message = '';
    //Conectamos con las queries
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

//Rollback de insert de voucher - company
async function rollbackVoucherCompany(id){
    let message = '';
    //Conectamos con las queries
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

//Funcion para validar los datos de un voucher
function validarVoucher(body){
    console.info('Comenzando validacion Joi de Voucher');
    //Creamos schema Joi
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
    //Validamos
    return Joi.validate(body, schema);
}

//Funcion para validar los datos de una relacion voucher - company
function validarVoucherCompany(body){
    console.info('Comenzando validacion Joi de VoucherCompany');
    //Creamos schema Joi
    const schema = Joi.object().keys({
        voucherId: Joi.number().required(),
        companyId: Joi.number().required()
    });
    console.info('Finalizando validacion Joi de VoucherCompany');
    //Validamos
    return Joi.validate(body, schema);
}

//Funcion para validar las categorias de un voucher
async function validarCategorias(categorias){
    console.log('Iniciando validacion de categorias');
    
    //Creamos arrays de retorno
    let messages = [];
    let categories = [];

    //Recorremos IDs de categorias
    for(let cat of categorias){

        //Validamos tipo
        let { error } = validarId(cat);

        if(error){
            //Si hay error agregamos mensaje
            console.log(`Id de categoria: ${cat} no es valido`);
            messages.push(`Id de categoria: ${cat} no es valido`);
        }
        else{
            //Obtenemos categoria
            let { category, message } = await getCategoryById(cat);

            //Si no falla la agregamos al array, si no agregamos mensaje
            if(category) categories.push(category);
            else messages.push(message);
        }
    };

    //Si no hay mensajes de error, retornamos categorias, si no, solo mensajes de error
    if(messages.length === 0) return { categories, messages };
    else return { messages };
}

//Funcion para validar los rubros de un voucher
async function validarRubros(rubrosList){
    console.log('Iniciando validacion de rubros');
    
    //Creamos arrays de retorno
    let messages = [];
    let rubros = [];

    //Recorremos IDs de rubros
    for(let rubro of rubrosList){

        //Validamos tipo
        let { error } = validarId(rubro);

        if(error){
            //Si hay error agregamos mensaje
            console.log(`Id de rubro: ${rubro} no es valido`);
            messages.push(`Id de rubro: ${rubro} no es valido`);
        }
        else{
            //Obtenemos rubro
            let { rubro, message } = await getRubroById(rubro);

            //Si no falla la agregamos al array, si no agregamos mensaje
            if(rubro) rubros.push(Rubro);
            else messages.push(message);
        }
    };
    //Si no hay mensajes de error, retornamos rubros, si no, solo mensajes de error
    if(messages.length === 0) return { rubros, messages };
    else return { messages };
}

//Funcion para validar las companias de un voucher
async function validarCompanies(companiesList){
    console.log('Iniciando validacion de categorias');
    
    //Creamos arrays de retorno
    let messages = [];
    let companies = [];

    //Recorremos IDs de companias
    for(let comp of companiesList){

        //Validamos tipo
        let { error } = validarId(comp);

        if(error){
            //Si hay error agregamos mensaje
            console.log(`Id de company: ${comp} no es valido`);
            messages.push(`Id de company: ${comp} no es valido`);
        }
        else{
            //Obtenemos company
            let { company, message } = getCompanyById(comp);
            if(company) companies.push(Company);
            else messages.push(message);
        }
    };
    //Si no hay mensajes de error, retornamos companies, si no, solo mensajes de error
    if(messages.length === 0) return { companies, messages };
    else return { messages };
}

//Funcion para validar el codigo de un voucher
function validarCode(code){
    console.info('Comenzando validacion Joi de Codigo');
    //Creamos schema Joi
    const schema = Joi.string().required();
    console.info('Finalizando validacion Joi de Codigo');
    //Validamos
    return Joi.validate(code, schema);
}

//Funcion para aumentar o disminuir el stock de un voucher
const ajustarStock = async (id, cantidad, tipo) => {
    console.info(`Comenzando ajuste de stock para voucher con ID: ${id}, cantidad a ${tipo}: ${cantidad}`);

    //Obtenemos voucher
    let { voucher } = await getVoucherById(id);

    if(!voucher){
        //Si no existe, retornamos
        console.info('No se pudo encontrar el voucher');
        return false;
    }
    else{
        //Ajustamos el stock del voucher
        console.log('Procediendo a ${tipo} la cantidad');
        voucher.cantidad = tipo === 'reducir' ? voucher.cantidad - cantidad : voucher.cantidad + cantidad;

        //Conectamos con las queries
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

//Exportamos endpoint
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
    validacionVoucher,
    rollbackVoucherCompany
}