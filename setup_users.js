require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

(async () => {
  const users = [
    { email: 'admin@versand', password: 'admin123', role: 'admin' },
    { email: 'vendedor@versand', password: 'vendedor123', role: 'vendedor' },
    { email: 'cliente@versand', password: 'cliente123', role: 'cliente' }
  ];
  for (const u of users) {
    // Create user via Supabase Auth admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      // Store role in user_metadata
      user_metadata: { role: u.role }
    });
    if (error) {
      console.error('Error creating', u.email, ':', error.message);
    } else {
      console.log('Created', data.user.email);
    }
  }
})();
