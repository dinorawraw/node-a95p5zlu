import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function createAdmin() {
  try {
    console.log('Creating admin user...');
    
    // Sign up admin user
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email: 'contato@dinoraw.com.br',
      password: '@Dino24413'
    });

    if (signUpError) throw signUpError;
    
    console.log('User created in auth system:', user.id);

    // Create admin profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: user.id,
        username: 'admin',
        name: 'Admin',
        email: 'contato@dinoraw.com.br',
        role: 'admin'
      }])
      .select()
      .single();

    if (profileError) throw profileError;

    console.log('Admin profile created successfully:', profile);
    console.log('\nIMPORTANT: Check your email to confirm your account!');
    
    return profile;
  } catch (error) {
    console.error('Failed to create admin user:', error);
    throw error;
  }
}

createAdmin()
  .then(() => {
    console.log('Admin user creation completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Admin user creation failed:', error);
    process.exit(1);
  });