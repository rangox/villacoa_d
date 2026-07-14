// api/addPago.js
import { createClient } from '@supabase/supabase-js'

// Vercel inyecta estas variables de entorno de forma segura
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { apartamento, monto, fecha } = req.body;

    // Inserción en la base de datos
    const { data, error } = await supabase
      .from('pagos')
      .insert([{ apartamento, monto, fecha }]);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true, data });
  } else {
    res.status(405).json({ message: 'Solo se permite el método POST' });
  }
}
