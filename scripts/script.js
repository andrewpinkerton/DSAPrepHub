import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", async () => {
  const { count } = await supabase
    .from("problem_entry")
    .select("*", { count: "exact", head: true });

  document.getElementById("streak").innerText = count;
});
