export default async function handler(req, res) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_KEY;

    if (req.method === 'POST') {
        try {
            // CORRECCIÓN: Recibimos "apartamento" exactamente como se envía desde el Dashboard
            const { apartamento, monto, referencia, fecha } = req.body;

            // Guarda el nuevo pago en la tabla "pagos"
            const respuesta = await fetch(`${url}/rest/v1/pagos`, {
                method: 'POST',
                headers: {
                    'apikey': key,
                    'Authorization': `Bearer ${key}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation' // Para confirmar que se guardó bien
                },
                body: JSON.stringify({
                    apartamento: apartamento, // CORRECCIÓN: Coincide con la columna exacta de SQL
                    monto: monto,
                    referencia: referencia,
                    fecha: fecha
                })
            });

            if (!respuesta.ok) {
                const errorData = await respuesta.json();
                return res.status(respuesta.status).json({ success: false, error: errorData });
            }
            
            return res.status(200).json({ success: true, message: "Pago guardado en la base de datos" });
        } catch (error) {
            return res.status(500).json({ success: false, error: "Error de conexión al guardar" });
        }
    } else {
        return res.status(405).json({ message: 'Método no permitido' });
    }
}
