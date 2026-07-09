const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mqysxltpiuyyldognfpj.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function confirmAndReset() {
  try {
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) return console.error(listError);

    const adminUser = users.find(u => u.email === 'shreyash506@gmail.com');
    if (!adminUser) return console.error("User not found");

    console.log("Current user status:", {
      email: adminUser.email,
      email_confirmed_at: adminUser.email_confirmed_at,
      last_sign_in_at: adminUser.last_sign_in_at
    });

    // Auto confirm the user just in case
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(adminUser.id, {
      email_confirm: true,
      user_metadata: { name: 'Shreyash' },
      app_metadata: { role: 'admin' },
      password: 'AdminPassword@123'
    });

    if (updateError) {
      console.error("Failed to update user:", updateError);
    } else {
      console.log("User updated successfully, forced email confirmation and password reset.");
    }
  } catch (e) {
    console.error(e);
  }
}

confirmAndReset();
