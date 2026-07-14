export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Solo se permiten peticiones POST' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    const { propietarios } = req.body;

    if (!propietarios || !Array.isArray(propietarios)) {
        return res.status(400).json({ error: 'Formato de datos incorrecto' });
    }

    try {
        // Enviar el arreglo completo a Supabase. 
        // on_conflict=apto le dice a Supabase que si el apto ya existe, lo actualice en lugar de dar error.
        const respuesta = await fetch(`${supabaseUrl}/rest/v1/propietarios?on_conflict=apto`, {
            method: 'POST',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates, return=minimal'
            },
            body: JSON.stringify(propietarios)
        });

        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            return res.status(respuesta.status).json({ success: false, error: errorData });
        }

        return res.status(200).json({ success: true, message: `${propietarios.length} registros sincronizados.` });
        
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error de conexión con la base de datos' });
    }
}
