import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Starting reset process...");
  
  // 1. Delete all events
  const { error: errEvents } = await supabase.from('events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (errEvents) console.error("Error deleting events:", errEvents);
  else console.log("Deleted all events.");

  // 2. Delete all notices
  const { error: errNotices } = await supabase.from('notices').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (errNotices) console.error("Error deleting notices:", errNotices);
  else console.log("Deleted all notices.");

  // 3. Find and reset admin user
  const adminEmail = 'shreyash506@gmail.com';
  const newPassword = 'AdminPassword123!';

  const { data: usersData, error: usersErr } = await supabase.auth.admin.listUsers();
  if (usersErr) {
    console.error("Error listing users:", usersErr);
    return;
  }

  const adminUser = usersData.users.find((u: any) => u.email === adminEmail);
  if (adminUser) {
    const { error: updateErr } = await supabase.auth.admin.updateUserById(adminUser.id, {
      password: newPassword,
    });
    if (updateErr) {
      console.error("Error updating admin password:", updateErr);
    } else {
      console.log(`Successfully reset admin password.\nEmail: ${adminEmail}\nPassword: ${newPassword}`);
    }
  } else {
    console.log("Admin user not found. Creating a new admin user...");
    const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: newPassword,
      email_confirm: true
    });
    if (createErr) {
      console.error("Error creating admin user:", createErr);
    } else {
      console.log(`Successfully created admin user.\nEmail: ${adminEmail}\nPassword: ${newPassword}`);
    }
  }
}

main().catch(console.error);
