import { Router } from 'express';
import { supabase } from '../supabaseClient';

const router = Router();

// POST /users - Create a new user
router.post('/', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, role: role || 'student' }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Postgres unique violation
        return res.status(400).json({ error: 'Email already exists.' });
      }
      throw error;
    }

    res.status(201).json(data);
  } catch (err: any) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /users - List all users
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (err: any) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
