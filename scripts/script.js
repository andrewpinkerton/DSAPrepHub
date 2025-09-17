import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", async () => {
  await loadUserStats();
  const myButton = document.getElementById("beginButton");
  if (myButton) {
    myButton.addEventListener("click", () => {
      window.location.href = "problems.html";
    });
  }
  await greeting();
});

async function loadUserStats() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    window.location.href = "/login.html";
    return;
  }

  const { count } = await supabase
    .from("problem_entry")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const solvedEl = document.getElementById("solved");
  if (solvedEl) {
    solvedEl.innerText = count || 0;
  }

  const { data: recentEntries } = await supabase
    .from("problem_entry")
    .select("date_solved")
    .eq("user_id", user.id)
    .order("date_solved", { ascending: false })
    .limit(10);

  const streak = calculateStreak(recentEntries);
  const streakEl = document.getElementById("streak");
  if (streakEl) {
    streakEl.innerText = `${streak} days`;
  }

  const { data: avgDifficulty } = await supabase
    .from("problem_entry")
    .select("difficulty")
    .eq("user_id", user.id);

  const level =
    avgDifficulty?.length > 0 ? getLevelFromAvg(avgDifficulty) : "Easy";
  const levelEl = document.querySelector(".level-box p");
  if (levelEl) {
    levelEl.innerText = level;
  }
}

function calculateStreak(entries) {
  if (!entries || entries.length === 0) return 0;

  let streak = 1;
  const dates = entries
    .map((e) => new Date(e.date_solved).toDateString())
    .sort()
    .reverse();

  const today = new Date().toDateString();
  if (dates[0] !== today) return 0;

  for (let i = 1; i < dates.length; i++) {
    const prevDate = new Date(dates[i - 1]);
    const currDate = new Date(dates[i]);
    currDate.setDate(currDate.getDate() + 1);
    if (currDate.toDateString() !== prevDate.toDateString()) break;
    streak++;
  }

  return streak;
}

function getLevelFromAvg(entries) {
  const scores = entries.map(
    (e) => ({ Easy: 1, Medium: 2, Hard: 3 }[e.difficulty] || 1)
  );
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return avg < 1.5 ? "Easy" : avg < 2.5 ? "Medium" : "Hard";
}

async function greeting() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let name = "User";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    name = user.user_metadata?.full_name;
  }

  const now = new Date();
  const hours = now.getHours();
  let greetingString =
    hours < 12 ? "Morning" : hours < 17 ? "Afternoon" : "Evening";

  const greetingEl = document.getElementById("greeting");
  if (greetingEl) {
    greetingEl.innerText = `Good ${greetingString}, ${name}`;
  }
}
