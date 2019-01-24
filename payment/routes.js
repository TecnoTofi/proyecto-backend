async function realizarPago(idPedido, amount, productos){
    console.log(`Comenzando proceso de pago para el pedido ${idPedido}`);
    console.log(`Total a pagar $${amount}`);
    console.log('Productos en la factura');
    productos.map(p => console.log(p.name));

    // const dummy = process.env.DUMMY_PAYMENT;
    const dummy = true;

    if(dummy){
        console.log('Dummy payment esta activo');
        console.log('Pago realizado con exito');
        return true;
    }
    else{
        console.log('Enviando informacion a Paypal');
        setTimeout(() => {
            console.log('Fallo pago a Paypal');
            return false;
        }, 5000);
    }
}

module.exports = { realizarPago }