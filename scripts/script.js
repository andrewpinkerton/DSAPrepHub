import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", async () => {
  await loadUserStats();
  await greeting();
  
  const myButton = document.getElementById("beginButton");
  if (myButton) {
    myButton.addEventListener("click", () => {
      window.location.href = "problems.html";
    });
  }
});

async function loadUserStats() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) {
    window.location.href = "/login.html";
    return;
  }

  // Get total problems count
  const { count } = await supabase
    .from("problem_entry")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const solvedEl = document.getElementById("solvedValue");
  if (solvedEl) {
    solvedEl.innerText = count || 0;
  }

  // Update solved progress bar
  const solvedProgress = document.getElementById("solvedProgress");
  if (solvedProgress) {
    solvedProgress.style.width = `${Math.min(count, 100)}%`;
  }

  // Get all entries for streak calculation
  const { data: recentEntries } = await supabase
    .from("problem_entry")
    .select("date_solved")
    .eq("user_id", user.id)
    .order("date_solved", { ascending: false })
    .limit(100);

  const streak = calculateStreak(recentEntries);
  const streakEl = document.getElementById("streakValue");
  if (streakEl) {
    streakEl.innerText = streak;
  }

  // Update streak progress bar
  const streakProgress = document.getElementById("streakProgress");
  if (streakProgress) {
    streakProgress.style.width = `${Math.min(streak * 10, 100)}%`;
  }

  // Get difficulty breakdown
  const { data: allEntries } = await supabase
    .from("problem_entry")
    .select("difficulty, title, date_solved")
    .eq("user_id", user.id)
    .order("date_solved", { ascending: false });

  if (allEntries && allEntries.length > 0) {
    // Calculate difficulty counts
    const difficultyCounts = {
      Easy: 0,
      Medium: 0,
      Hard: 0
    };

    allEntries.forEach(entry => {
      if (difficultyCounts.hasOwnProperty(entry.difficulty)) {
        difficultyCounts[entry.difficulty]++;
      }
    });

    // Update difficulty chart
    updateDifficultyChart(difficultyCounts);

    // Determine level
    const level = getLevelFromAvg(allEntries);
    const levelEl = document.getElementById("levelValue");
    if (levelEl) {
      levelEl.innerText = level;
    }

    // Update recent activity
    updateRecentActivity(allEntries.slice(0, 5));
  }
}

function updateDifficultyChart(counts) {
  const maxHeight = 150;
  const total = counts.Easy + counts.Medium + counts.Hard;
  
  if (total === 0) return;

  setTimeout(() => {
    const easyBar = document.getElementById("easyBar");
    const mediumBar = document.getElementById("mediumBar");
    const hardBar = document.getElementById("hardBar");

    if (easyBar) {
      easyBar.style.height = `${(counts.Easy / total) * maxHeight}px`;
      document.getElementById("easyCount").textContent = counts.Easy;
    }

    if (mediumBar) {
      mediumBar.style.height = `${(counts.Medium / total) * maxHeight}px`;
      document.getElementById("mediumCount").textContent = counts.Medium;
    }

    if (hardBar) {
      hardBar.style.height = `${(counts.Hard / total) * maxHeight}px`;
      document.getElementById("hardCount").textContent = counts.Hard;
    }
  }, 300);
}

function updateRecentActivity(entries) {
  const activityList = document.getElementById("activityList");
  if (!activityList || entries.length === 0) return;

  activityList.innerHTML = '';

  entries.forEach(entry => {
    const activityItem = document.createElement("div");
    activityItem.className = "activity-item";

    const timeAgo = getTimeAgo(entry.date_solved);
    const difficultyClass = `badge-${entry.difficulty.toLowerCase()}`;

    activityItem.innerHTML = `
      <div class="activity-dot"></div>
      <span>Solved <strong>${entry.title}</strong></span>
      <span class="badge ${difficultyClass}">${entry.difficulty}</span>
      <span style="margin-left: auto; color: #6b7280;">${timeAgo}</span>
    `;

    activityList.appendChild(activityItem);
  });
}

function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return diffMins <= 1 ? "just now" : `${diffMins} minutes ago`;
    }
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  } else if (diffDays === 1) {
    return "1 day ago";
  } else {
    return `${diffDays} days ago`;
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
  if (dates[0] !== today) return 3; // change

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

    name = profile?.full_name || user.user_metadata?.full_name || "User";
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