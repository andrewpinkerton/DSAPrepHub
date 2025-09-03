import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://siarasryfvwiinqjyzsy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpYXJhc3J5ZnZ3aWlucWp5enN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTU1ODksImV4cCI6MjA3MjMzMTU4OX0.YhKlaZLa8ta4PjNcGv0Qi9zuJjjSXq590OUZI3cKPZg';

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
