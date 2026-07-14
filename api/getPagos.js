export default async function handler(req, res) {
    // 1. Aquí Vercel saca las llaves secretas que guardaste sin que nadie las vea
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    // 2. Comprobamos que el Dashboard nos esté pidiendo datos (GET)
    if (req.method === 'GET') {
        try {
            // 3. El mensajero va al castillo a la cajita "pagos"
            const respuesta = await fetch(`${supabaseUrl}/rest/v1/pagos?select=*`, {
                method: 'GET',
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json'
                }
            });

            // 4. Abrimos el paquetito que nos dio el castillo
            const datos = await respuesta.json();

            // Si el castillo nos dio un error, avisamos
            if (!respuesta.ok) {
                 return res.status(500).json({ error: datos });
            }

            // 5. ¡Éxito! Le enviamos los datos al Dashboard
            return res.status(200).json({ success: true, data: datos });
            
        } catch (error) {
            // Si el mensajero se tropezó en el camino
            return res.status(500).json({ error: "Error al conectar con el castillo" });
        }
    } else {
        // Si alguien intenta hacer otra cosa que no sea pedir datos
        return res.status(405).json({ message: 'Solo se permite pedir datos' });
    }
}
