import { supabase } from "./supabase.js";

const usernameEl = document.getElementById("username");
const emailEl = document.getElementById("emailDisplay");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("password");
const form = document.querySelector("form");
const logoutBtn = document.getElementById("logoutBtn");

async function loadUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    window.location.href = "/login.html";
    return;
  }

  emailEl.textContent = user.email;
  emailInput.value = user.email;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  if (profile) {
    usernameEl.textContent = profile.full_name || "User";
    nameInput.value = profile.full_name || "";
  } else {
    await supabase.from("profiles").upsert({
      id: user.id,
      full_name: user.user_metadata?.full_name || "User",
      updated_at: new Date(),
    });
    usernameEl.textContent = user.user_metadata?.full_name || "User";
    nameInput.value = user.user_metadata?.full_name || "";
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const { data: { user } } = await supabase.auth.getUser();

  await supabase.from("profiles").upsert({
    id: user.id,
    full_name: nameInput.value,
    updated_at: new Date(),
  });

  if (passwordInput.value) {
    await supabase.auth.updateUser({ password: passwordInput.value });
    alert("Password updated!");
  }

  alert("Profile updated!");
  loadUser();
});

logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location.href = "/login.html";
});

loadUser();
