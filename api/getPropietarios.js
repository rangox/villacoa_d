export default async function handler(req, res) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    try {
        const respuesta = await fetch(`${supabaseUrl}/rest/v1/propietarios?select=*&order=apto.asc`, {
            method: 'GET',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json'
            }
        });

        const datos = await respuesta.json();
        
        if (!respuesta.ok) return res.status(500).json({ success: false, error: datos });
        return res.status(200).json({ success: true, data: datos });
        
    } catch (error) {
        return res.status(500).json({ success: false, error: "Fallo general" });
    }
}
