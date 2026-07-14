// Ejemplo de cómo guardar un pago desde tu dashboard
async function registrarPago(apartamento, monto) {
    const respuesta = await fetch('/api/addPago', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            apartamento: apartamento,
            monto: monto,
            fecha: new Date().toISOString()
        })
    });

    const resultado = await respuesta.json();
    if (resultado.success) {
        alert("Pago registrado exitosamente en la base de datos");
        // Aquí llamas a tu función para actualizar las tablas visualmente
    }
}