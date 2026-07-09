const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mqysxltpiuyyldognfpj.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  // realistic IIT KGP events
  const events = [
    {
      title: "Spring Fest 2027: Theme Reveal",
      description: "Join us at the Tagore Open Air Theatre (TOAT) for the grand theme reveal of Spring Fest 2027, IIT Kharagpur's annual social and cultural festival. Expect amazing performances by the WT (Western Technology) and ET (Eastern Technology) music societies, followed by the official trailer launch!",
      start_time: "2026-08-15T18:30:00Z",
      end_time: "2026-08-15T21:00:00Z",
      venue: "Tagore Open Air Theatre (TOAT)",
      category: "General",
      organizer: "Spring Fest Team"
    },
    {
      title: "Kshitij Guest Lecture: AI in Robotics",
      description: "Kshitij, the techno-management fest of IIT Kharagpur, presents an exclusive guest lecture on 'The Future of AI in Autonomous Robotics' by Dr. Andrew Ng. The session will cover modern computer vision techniques and reinforcement learning applications.",
      start_time: "2026-09-02T10:00:00Z",
      end_time: "2026-09-02T12:00:00Z",
      venue: "Kalidas Auditorium",
      category: "Academic",
      organizer: "Kshitij Team"
    },
    {
      title: "Inter-IIT Sports Meet Tryouts",
      description: "Selection trials for the IIT Kharagpur Athletics, Basketball, and Volleyball teams for the upcoming Inter-IIT Sports Meet. Students of all years are welcome to participate. Please report in proper sports attire.",
      start_time: "2026-07-20T16:00:00Z",
      end_time: "2026-07-20T19:00:00Z",
      venue: "Tata Sports Complex",
      category: "Sports",
      organizer: "TSG Sports"
    }
  ];

  const { error: eventErr } = await supabase.from('events').insert(events);
  if (eventErr) console.log("Error inserting events:", eventErr);
  else console.log("Events inserted successfully!");
}

seed();
