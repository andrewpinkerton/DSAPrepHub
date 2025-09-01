import { supabase } from "./supabase.js"
import 'dotenv/config';

const { data, error } = await supabase  .from('problem_entry')  .select()

console.log(data);