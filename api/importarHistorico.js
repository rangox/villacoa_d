export default async function handler(req, res) {
    // 1. Validar que la petición sea POST (envío de datos)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Solo se permiten peticiones POST' });
    }

    // 2. Obtener credenciales de Supabase desde las variables de entorno de Vercel
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    const { propietarios } = req.body;

    // 3. Validar que la información que llega sea una lista (array)
    if (!propietarios || !Array.isArray(propietarios)) {
        return res.status(400).json({ error: 'Formato de datos incorrecto. Se esperaba una lista de apartamentos.' });
    }

    try {
        // 4. Enviar el arreglo completo a Supabase para Inserción/Actualización Masiva
        // ?on_conflict=apto: Le indica a Supabase que 'apto' es la llave única.
        const respuesta = await fetch(`${supabaseUrl}/rest/v1/propietarios?on_conflict=apto`, {
            method: 'POST',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                // 'merge-duplicates' activa la actualización si el apartamento ya existe
                'Prefer': 'resolution=merge-duplicates, return=minimal'
            },
            body: JSON.stringify(propietarios)
        });

        // 5. Manejo de error desde la Base de Datos
        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            return res.status(respuesta.status).json({ success: false, error: errorData });
        }

        // 6. Éxito
        return res.status(200).json({ 
            success: true, 
            message: `${propietarios.length} registros sincronizados exitosamente en Supabase.` 
        });
        
    } catch (error) {
        // 7. Error de conexión
        return res.status(500).json({ success: false, error: 'Error de conexión con la base de datos Supabase.' });
    }
}
