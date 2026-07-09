const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mqysxltpiuyyldognfpj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xeXN4bHRwaXV5eWxkb2duZnBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0MzA1ODksImV4cCI6MjA5OTAwNjU4OX0.-I2g6WIiDJ5uApjHj1LZnpCyojl0bMKxr1tGSTjLadQ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  console.log("Attempting login...");
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'shreyash506@gmail.com',
    password: 'AdminPassword@123',
  });

  if (error) {
    console.error("Login failed:", error.message);
  } else {
    console.log("Login succeeded! Token:", data.session.access_token.substring(0, 20) + "...");
  }
}

testLogin();
