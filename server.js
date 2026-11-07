require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Login endpoint - uses Supabase Auth
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return res.status(401).json({ message: error.message });
  }
  // data.session.access_token is a JWT
  return res.json({ access_token: data.session.access_token, user: data.user });
});

// Simple marketplace page (public)
app.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"><title>Versand Marketplace</title></head>
    <body>
      <h1>Versand Marketplace</h1>
      <p>Selecciona el módulo que deseas acceder:</p>
      <ul>
        <li><a href="/api/operator/shipping-queue">Envíos y órdenes de pedidos</a></li>
        <li><a href="/api/payments">Pasarela de pago (placeholder)</a></li>
        <li><a href="/api/notifications">Notificaciones</a></li>
        <li><a href="/api/products">Gestión de productos y carritos</a></li>
        <li><a href="/api/tracking">Seguimiento</a></li>
        <li><a href="/api/accounting">Contabilidad</a></li>
        <li><a href="/api/catalogo">Catálogo</a></li>
      </ul>
    </body>
    </html>`;
  res.set('Content-Type', 'text/html');
  res.send(html);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Auth service listening on port ${port}`));
