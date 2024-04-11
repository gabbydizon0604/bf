function culqi() {
    if (Culqi.token) {
        var payment_event = new CustomEvent("payment_event", {
            detail: Culqi.token,
        });
        document.dispatchEvent(payment_event);
        document.getElementById("culqi_checkout_frame").remove();
    }
}

Culqi.publicKey = 'pk_test_bded8ec6438187ee';

Culqi.settings({
    title: 'Bettics',
    currency: 'PEN',
    amount: 2000,
    order: 'ord_live_0CjjdWhFpEAZlxlz' // Este parámetro es requerido para realizar pagos con pagoEfectivo, billeteras y Cuotéalo
});

Culqi.options({
    lang: 'auto',
    installments: false,
    paymentMethods: {
        tarjeta: true,
        yape: true,
        billetera: true
    }
});

Culqi.options({
    style: {
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Soccer_ball_animated.svg/150px-Soccer_ball_animated.svg.png',
        bannerColor: '#ffc722', // hexadecimal
        buttonBackground: '', // hexadecimal
        menuColor: '#ffc722', // hexadecimal
        linksColor: '#ffc722', // hexadecimal
        buttonText: 'Pagar suscripción', // texto que tomará el botón
        buttonTextColor: '##363533', // hexadecimal
        priceColor: '##363533' // hexadecimal
    }
});

function suscribirseCulqi() {
    // Culqi.open();
    console.log("Cambios")
}