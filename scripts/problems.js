import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    window.location.href = "/login.html";
    return;
  }
  // Show loading
  const entriesList = document.getElementById("entriesList");
  if (entriesList) {
    entriesList.innerHTML = "<p>Loading your problems...</p>";
  } else {
    console.warn("Element with id='entriesList' not found");
  }
  await renderEntries(user.id);
  addEventListeners();
});

async function renderEntries(userId) {
  const { data, error } = await supabase
    .from("problem_entry")
    .select()
    .eq("user_id", userId)
    .order("date_solved", { ascending: false });

  if (error) {
    console.error(error);
    const entriesList = document.getElementById("entriesList");
    if (entriesList) {
      entriesList.innerHTML = "<p>Error loading problems: " + error.message + "</p>";
    }
    return;
  }

  const entriesList = document.getElementById("entriesList");
  if (entriesList) {
    entriesList.innerHTML = data.length ? "" : "<p>No problems yet—add one!</p>";
    data.forEach((p, index) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${p.title}</span><span>${p.date_solved}</span>`;
      li.addEventListener("click", () => openDetail(data, index));
      entriesList.appendChild(li);
    });
  } else {
    console.warn("Element with id='entriesList' not found");
  }
}

function addEventListeners() {
  const openFormBtn = document.getElementById("openFormBtn");
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");
  const problemForm = document.getElementById("problemForm");
  const problemDetail = document.getElementById("problemDetail");
  const deleteBtn = document.getElementById("delete-btn");

  if (openFormBtn && modal && problemForm && problemDetail) {
    openFormBtn.addEventListener("click", () => {
      problemForm.classList.remove("hidden");
      problemDetail.classList.add("hidden");
      modal.classList.remove("hidden");
    });
  } else {
    console.warn("Missing elements for form/modal functionality");
  }

  if (closeModal && modal) {
    closeModal.addEventListener("click", () => modal.classList.add("hidden"));
  } else {
    console.warn("Missing closeModal or modal element");
  }

  if (problemForm) {
    problemForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login.html";
        return;
      }

      const entry = {
        user_id: user.id,
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

      const { data: newProblem, error } = await supabase
        .from("problem_entry")
        .insert([entry])
        .select();

      if (error) {
        console.error(error);
        alert("Error adding problem: " + error.message);
        return;
      }

      problemForm.reset();
      if (modal) modal.classList.add("hidden");
      await renderEntries(user.id);
    });
  } else {
    console.warn("Element with id='problemForm' not found");
  }

  if (deleteBtn) {
    deleteBtn.addEventListener("click", async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login.html";
        return;
      }
      const problemId = document.getElementById("detailId")?.innerText;
      if (!problemId) {
        alert("No problem selected to delete");
        return;
      }

      const { error } = await supabase
        .from("problem_entry")
        .delete()
        .eq("problem_id", problemId)
        .eq("user_id", user.id);

      if (error) {
        console.error(error);
        alert("Error deleting problem: " + error.message);
      } else {
        if (modal) modal.classList.add("hidden");
        await renderEntries(user.id);
      }
    });
  } else {
    console.warn("Element with id='delete-btn' not found");
  }
}

function openDetail(problems, index) {
  const p = problems[index];
  const problemForm = document.getElementById("problemForm");
  const problemDetail = document.getElementById("problemDetail");
  const modal = document.getElementById("modal");

  if (!problemForm || !problemDetail || !modal) {
    console.warn("Missing elements for problem detail view");
    return;
  }

  problemForm.classList.add("hidden");
  problemDetail.classList.remove("hidden");

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.innerText = value || "N/A";
    else console.warn(`Element with id='${id}' not found`);
  };

  setText("detailId", p.problem_id);
  setText("detailTitle", p.title);
  setText("detailPlatform", p.platform);
  setText("detailDifficulty", p.difficulty);
  setText("detailCategory", p.category);
  setText("detailTime", p.time_taken_minutes);
  setText("detailLanguage", p.language);
  setText("detailDate", p.date_solved);
  setText("detailSolution", p.solution_code);
  setText("detailReflection", p.reflection);

  modal.classList.remove("hidden");
}