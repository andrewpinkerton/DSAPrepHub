import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", async () => {
  const { count } = await supabase
    .from("problem_entry")
    .select("*", { count: "exact", head: true });
    const myButton = document.getElementById("beginButton");

  document.getElementById("solved").innerText = count;

  myButton.addEventListener("click", () => {
    window.location.href = "problems.html"
  });
});
