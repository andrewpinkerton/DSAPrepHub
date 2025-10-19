(function() {
  const savedTheme = document.cookie.split('; ').find(row => row.startsWith('theme='));
  const theme = savedTheme ? savedTheme.split('=')[1] : 'dark';
  document.documentElement.setAttribute('data-theme', theme);
})();

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const html = document.documentElement;

  const currentTheme = getTheme();
  html.setAttribute("data-theme", currentTheme);

  if (themeToggle) {
    themeToggle.checked = currentTheme === "light";
  }

  themeToggle?.addEventListener("change", () => {
    const newTheme = themeToggle.checked ? "light" : "dark";
    html.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  });
});

function getTheme() {
  const savedTheme = document.cookie.split('; ').find(row => row.startsWith('theme='));
  return savedTheme ? savedTheme.split('=')[1] : 'dark';
}

function setTheme(theme) {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `theme=${theme}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}