import { Router } from 'express';
import { supabase } from '../supabaseClient';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /events - Create a new event
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, venue, start_time, end_time, organizer } = req.body;
    const file = req.file;
    
    // Required fields check
    if (!title || !description || !category || !venue || !start_time || !end_time || !organizer) {
      return res.status(400).json({ error: 'title, description, category, venue, start_time, end_time, and organizer are required.' });
    }

    // Time validation check
    const start = new Date(start_time);
    const end = new Date(end_time);
    if (start >= end) {
      return res.status(400).json({ error: 'start_time must come before end_time.' });
    }

    let image_url = null;
    if (file) {
      const fileName = `events/${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { error: uploadError } = await supabase.storage
        .from('campus-images')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });
        
      if (uploadError) throw uploadError;
      
      const { data: publicUrlData } = supabase.storage
        .from('campus-images')
        .getPublicUrl(fileName);
        
      image_url = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase
      .from('events')
      .insert([{ title, description, category, venue, start_time, end_time, organizer, image_url }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err: any) {
    console.error('Error creating event:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /events - List all events (with optional filtering)
router.get('/', async (req, res) => {
  try {
    const { category, from } = req.query;
    
    let query = supabase
      .from('events')
      .select('*')
      .order('start_time', { ascending: true });
      
    if (category && typeof category === 'string') {
      query = query.ilike('category', `%${category}%`);
    }
    
    if (from && typeof from === 'string') {
      // Filter events that happen on or after the 'from' date
      query = query.gte('start_time', from);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.status(200).json(data);
  } catch (err: any) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /events/:id - Get a single event
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Event not found' });
      }
      throw error;
    }
    
    res.status(200).json(data);
  } catch (err: any) {
    console.error('Error fetching event:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
