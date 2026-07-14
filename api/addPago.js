export default async function handler(req, res) {
    // 1. Validar que sea una petición de guardado (POST)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Solo se permiten peticiones POST' });
    }

    // 2. Traer las llaves de Vercel
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    // 3. Capturar los datos que envía el Dashboard
    const { apartamento, monto, fecha, referencia } = req.body;

    try {
        // 4. Enviar los datos a la tabla 'pagos' en Supabase
        const respuesta = await fetch(`${supabaseUrl}/rest/v1/pagos`, {
            method: 'POST',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation' // Le pide a Supabase que confirme el guardado
            },
            body: JSON.stringify({
                apartamento: apartamento,
                monto: monto,
                fecha: fecha,
                referencia: referencia || 'Pago vía web'
            })
        });

        // 5. Si Supabase rechaza el guardado
        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            return res.status(respuesta.status).json({ success: false, error: errorData });
        }

        // 6. Si se guardó con éxito
        const data = await respuesta.json();
        return res.status(200).json({ success: true, data: data });
        
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error de conexión con la base de datos' });
    }
}
