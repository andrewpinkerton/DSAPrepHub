import { supabase } from "./supabase.js";

let currentProblemId = null;

document.addEventListener("DOMContentLoaded", async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    window.location.href = "/login.html";
    return;
  }
  const entriesList = document.getElementById("entriesList");
  if (entriesList) {
    entriesList.innerHTML = "<p>Loading your problems...</p>";
  }
  await renderEntries(user.id);
  addEventListeners();
});

async function renderEntries(userId) {
  const { data } = await supabase
    .from("problem_entry")
    .select()
    .eq("user_id", userId)
    .order("date_solved", { ascending: false });

  const entriesList = document.getElementById("entriesList");
  if (entriesList) {
    entriesList.innerHTML = data.length ? "" : "<p>No problems yet—add one!</p>";
    data.forEach((p, index) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${p.title}</span><span>${p.date_solved}</span>`;
      li.addEventListener("click", () => openDetail(data, index));
      entriesList.appendChild(li);
    });
  }
}

function addEventListeners() {
  const openFormBtn = document.getElementById("openFormBtn");
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");
  const problemForm = document.getElementById("problemForm");
  const problemDetail = document.getElementById("problemDetail");
  const deleteBtn = document.getElementById("delete-btn");

  openFormBtn?.addEventListener("click", () => {
    problemForm.classList.remove("hidden");
    problemDetail.classList.add("hidden");
    modal.classList.remove("hidden");
  });

  closeModal?.addEventListener("click", () => modal.classList.add("hidden"));

  problemForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();

    const entry = {
      user_id: user.id,
      title: problemForm.title.value,
      platform: problemForm.platform.value,
      difficulty: problemForm.difficulty.value,
      category: problemForm.category.value,
      time_taken_minutes: problemForm.timeTaken.value,
      language: problemForm.language.value,
      date_solved: problemForm.dateSolved.value,
      problem: problemForm.problem.value,
      solution_code: problemForm.solution.value,
      reflection: problemForm.reflection.value,
    };

    await supabase.from("problem_entry").insert([entry]);

    problemForm.reset();
    modal.classList.add("hidden");
    await renderEntries(user.id);
  });

  deleteBtn?.addEventListener("click", async () => {
    if (!currentProblemId) {
      alert("Error: No problem selected");
      return;
    }

    const confirmDelete = confirm("Are you sure you want to delete this problem entry?");
    if (!confirmDelete) return;

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("problem_entry")
      .delete()
      .eq("problem_id", currentProblemId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Delete error:", error);
      alert("Failed to delete problem. Please try again.");
      return;
    }

    modal.classList.add("hidden");
    currentProblemId = null;
    await renderEntries(user.id);
  });
}

function openDetail(problems, index) {
  const p = problems[index];
  const problemForm = document.getElementById("problemForm");
  const problemDetail = document.getElementById("problemDetail");
  const modal = document.getElementById("modal");

  currentProblemId = p.problem_id;

  problemForm.classList.add("hidden");
  problemDetail.classList.remove("hidden");

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.innerText = value || "N/A";
  };

  setText("detailTitle", p.title);
  setText("detailPlatform", p.platform);
  setText("detailDifficulty", p.difficulty);
  setText("detailCategory", p.category);
  setText("detailTime", p.time_taken_minutes);
  setText("detailLanguage", p.language);
  setText("detailDate", p.date_solved);
  setText("detailProblem", p.problem);
  setText("detailSolution", p.solution_code);
  setText("detailReflection", p.reflection);

  modal.classList.remove("hidden");
}