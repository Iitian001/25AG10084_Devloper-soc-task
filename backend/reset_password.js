const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mqysxltpiuyyldognfpj.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function resetPassword() {
  try {
    // List users to find shreyash506@gmail.com
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error("Error listing users:", listError);
      return;
    }

    const adminUser = users.find(u => u.email === 'shreyash506@gmail.com');
    if (!adminUser) {
      console.error("Admin user shreyash506@gmail.com not found in auth.users.");
      return;
    }

    console.log("Found admin user with ID:", adminUser.id);
    
    // Update the password
    const newPassword = "AdminPassword@123";
    const { data, error } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      { password: newPassword }
    );

    if (error) {
      console.error("Error updating password:", error);
    } else {
      console.log("Successfully updated password to:", newPassword);
    }
  } catch (err) {
    console.error("Script error:", err);
  }
}

resetPassword();
