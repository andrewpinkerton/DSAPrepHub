import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", async () => {
  const openFormBtn = document.getElementById("openFormBtn");
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");
  const problemForm = document.getElementById("problemForm");
  const entriesList = document.getElementById("entriesList");
  const problemDetail = document.getElementById("problemDetail");
  const { data, error } = await supabase.from("problem_entry").select();

  let problems = data;

  function renderEntries() {
    try {
      entriesList.innerHTML = "";
      problems.forEach((p, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${p.title}</span><span>${p.date_solved}</span>`;
        li.addEventListener("click", () => openDetail(index));
        entriesList.appendChild(li);
      });
    } catch {
      console.log(error);
    }
  }

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

    console.log(entry)

    const { newProblem, error } = await supabase
      .from("problem_entry")
      .insert([entry])
      .select();
    console.log(error);
    problems.unshift(newProblem);
    renderEntries();
    problemForm.reset();
    modal.classList.add("hidden");
  });

  function openDetail(index) {
    const p = problems[index];
    problemForm.classList.add("hidden");
    problemDetail.classList.remove("hidden");

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

  renderEntries();
});
