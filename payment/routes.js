//Funcion para connectar con el sistema de pagos
async function realizarPago(idPedido, amount, productos){
    console.log(`Comenzando proceso de pago para el pedido ${idPedido}`);
    console.log(`Total a pagar $${amount}`);
    console.log('Productos en la factura');
    productos.map(p => console.log(p.name));
    
    //Obtenemos la configuracion de pagos dummy
    // const dummy = process.env.DUMMY_PAYMENT;
    const dummy = true;

    //Verificamos la configuracion
    if(dummy){
        //Retornamos OK por pago dummy
        console.log('Dummy payment esta activo');
        console.log('Pago realizado con exito');
        return true;
    }
    else{
        //Connectamos con metodo de pago
        console.log('Enviando informacion a Paypal');
        setTimeout(() => {
            console.log('Fallo pago a Paypal');
            return false;
        }, 5000);
    }
}

//Exportamos funciones
module.exports = { realizarPago }