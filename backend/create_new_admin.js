const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mqysxltpiuyyldognfpj.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  console.log("Creating new admin user...");
  
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'iitianshreyash01@gmail.com',
    password: 'Iitian01@#',
    email_confirm: true,
    user_metadata: { name: 'Shreyash Admin' },
    app_metadata: { role: 'admin' }
  });

  if (error) {
    if (error.message.includes("already exists")) {
      console.log("User already exists, updating password and confirming email instead...");
      const { data: { users } } = await supabase.auth.admin.listUsers();
      const existingUser = users.find(u => u.email === 'iitianshreyash01@gmail.com');
      
      if (existingUser) {
        await supabase.auth.admin.updateUserById(existingUser.id, {
          password: 'Iitian01@#',
          email_confirm: true,
          app_metadata: { role: 'admin' }
        });
        console.log("Password updated successfully for existing user.");
      }
    } else {
      console.error("Failed to create user:", error.message);
    }
  } else {
    console.log("User created and verified successfully!", data.user.id);
  }
}

createAdminUser();
