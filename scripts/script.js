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

  greeting()
});

function greeting() {
   const now = new Date();
   const hours = now.getHours();
   let greetingString;

   if (hours >= 0 && hours < 12) {
    greetingString = "Morning";
   } else if (hours >= 12 && hours < 17) {
    greetingString = "Afternoon"
   } else if (hours >= 17 && hours < 24) {
    greetingString = "Evening"
   }
  console.log(now.getHours())
  document.getElementById("greeting").innerText = "Good " + greetingString+ ", Andrew"
}