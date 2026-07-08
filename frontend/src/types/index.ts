export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url: string | null;
  posted_by: User;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  venue: string;
  start_time: string;
  end_time: string;
  image_url: string | null;
  organizer: string;
  created_at: string;
}
