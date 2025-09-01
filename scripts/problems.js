const openFormBtn = document.getElementById('openFormBtn');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const problemForm = document.getElementById('problemForm');
const entriesList = document.getElementById('entriesList');
const problemDetail = document.getElementById('problemDetail');

// Sample data
let problems = [
  { title: "Two Sum", dateSolved: "2025-09-01", platform: "LeetCode", difficulty: "Easy", category: "Arrays", timeTaken: 20, language: "Python", solution: "Used hash map", reflection: "Check duplicates" },
  { title: "Longest Substring", dateSolved: "2025-08-28", platform: "LeetCode", difficulty: "Medium", category: "Strings", timeTaken: 35, language: "Java", solution: "Sliding window", reflection: "Sliding window is useful" }
];

// Render compact list
function renderEntries() {
  entriesList.innerHTML = '';
  problems.forEach((p, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${p.title}</span><span>${p.dateSolved}</span>`;
    li.addEventListener('click', () => openDetail(index));
    entriesList.appendChild(li);
  });
}

// Open modal for form
openFormBtn.addEventListener('click', () => {
  problemForm.classList.remove('hidden');
  problemDetail.classList.add('hidden');
  modal.classList.remove('hidden');
});

// Close modal
closeModal.addEventListener('click', () => modal.classList.add('hidden'));

// Submit new problem
problemForm.addEventListener('submit', e => {
  e.preventDefault();
  const newProblem = {
    title: problemForm.title.value,
    dateSolved: problemForm.dateSolved.value,
    platform: problemForm.platform.value,
    difficulty: problemForm.difficulty.value,
    category: problemForm.category.value,
    timeTaken: problemForm.timeTaken.value,
    language: problemForm.language.value,
    solution: problemForm.solution.value,
    reflection: problemForm.reflection.value
  };
  problems.unshift(newProblem);
  renderEntries();
  problemForm.reset();
  modal.classList.add('hidden');
});

// Open problem detail modal
function openDetail(index) {
  const p = problems[index];
  problemForm.classList.add('hidden');
  problemDetail.classList.remove('hidden');

  document.getElementById('detailTitle').innerText = p.title;
  document.getElementById('detailPlatform').innerText = p.platform;
  document.getElementById('detailDifficulty').innerText = p.difficulty;
  document.getElementById('detailCategory').innerText = p.category;
  document.getElementById('detailTime').innerText = p.timeTaken;
  document.getElementById('detailLanguage').innerText = p.language;
  document.getElementById('detailDate').innerText = p.dateSolved;
  document.getElementById('detailSolution').innerText = p.solution;
  document.getElementById('detailReflection').innerText = p.reflection;

  modal.classList.remove('hidden');
}

renderEntries();
