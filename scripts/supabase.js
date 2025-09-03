import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://siarasryfvwiinqjyzsy.supabase.co';
const supabaseKey = '';

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
