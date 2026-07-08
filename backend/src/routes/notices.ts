import { Router } from 'express';
import { supabase } from '../supabaseClient';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /notices - Create a new notice
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, content, category, posted_by } = req.body;
    const file = req.file;
    
    if (!title || !content || !category || !posted_by) {
      return res.status(400).json({ error: 'title, content, category, and posted_by are required.' });
    }

    let image_url = null;
    if (file) {
      const fileName = `notices/${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
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
      .from('notices')
      .insert([{ title, content, category, posted_by, image_url }])
      .select('*, posted_by(*)')
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err: any) {
    console.error('Error creating notice:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /notices - List all notices (with optional category filter)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = supabase
      .from('notices')
      .select('*, posted_by(*)')
      .order('created_at', { ascending: false });
      
    if (category && typeof category === 'string') {
      query = query.ilike('category', `%${category}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.status(200).json(data);
  } catch (err: any) {
    console.error('Error fetching notices:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /notices/:id - Get a single notice
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('notices')
      .select('*, posted_by(*)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Notice not found' });
      }
      throw error;
    }
    
    res.status(200).json(data);
  } catch (err: any) {
    console.error('Error fetching notice:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
