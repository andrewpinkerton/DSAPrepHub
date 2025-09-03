import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", async () => {
  renderEntries();
  addEventListeners();
});

async function renderEntries() {
  const { data, error } = await supabase.from("problem_entry").select();

  let problems = data.reverse();

  try {
    entriesList.innerHTML = "";
    problems.forEach((p, index) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${p.title}</span><span>${p.date_solved}</span>`;
      li.addEventListener("click", () => openDetail(problems, index));
      entriesList.appendChild(li);
    });
  } catch {
    console.log(error);
  }
}

function addEventListeners() {
  const openFormBtn = document.getElementById("openFormBtn");
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");
  const problemForm = document.getElementById("problemForm");
  const entriesList = document.getElementById("entriesList");
  const problemDetail = document.getElementById("problemDetail");
  const deleteBtn = document.getElementById("delete-btn");

  openFormBtn.addEventListener("click", () => {
    problemForm.classList.remove("hidden");
    problemDetail.classList.add("hidden");
    modal.classList.remove("hidden");
  });

  closeModal.addEventListener("click", () => modal.classList.add("hidden"));

  problemForm.addEventListener("submit", async () => {
    let entry = {
      title: problemForm.title.value,
      platform: problemForm.platform.value,
      difficulty: problemForm.difficulty.value,
      category: problemForm.category.value,
      time_taken_minutes: problemForm.timeTaken.value,
      language: problemForm.language.value,
      date_solved: problemForm.dateSolved.value,
      solution_code: problemForm.solution.value,
      reflection: problemForm.reflection.value,
    };

    const { newProblem, error } = await supabase
      .from("problem_entry")
      .insert([entry])
      .select();
    problems.unshift(newProblem);
    problemForm.reset();
    modal.classList.add("hidden");
    renderEntries();
  });

  deleteBtn.addEventListener("click", async () => {
    const { response, error } = await supabase
      .from("problem_entry")
      .delete()
      .eq("problem_id", document.getElementById("detailId").innerText);
    modal.classList.add("hidden");
    renderEntries();
  });
}

function openDetail(problems, index) {
  const p = problems[index];
  console.log(p);
  problemForm.classList.add("hidden");
  problemDetail.classList.remove("hidden");

  document.getElementById("detailId").innerText = p.problem_id;
  document.getElementById("detailTitle").innerText = p.title;
  document.getElementById("detailPlatform").innerText = p.platform;
  document.getElementById("detailDifficulty").innerText = p.difficulty;
  document.getElementById("detailCategory").innerText = p.category;
  document.getElementById("detailTime").innerText = p.time_taken_minutes;
  document.getElementById("detailLanguage").innerText = p.language;
  document.getElementById("detailDate").innerText = p.date_solved;
  document.getElementById("detailSolution").innerText = p.solution_code;
  document.getElementById("detailReflection").innerText = p.reflection;

  modal.classList.remove("hidden");
}
