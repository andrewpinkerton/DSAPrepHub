import { supabase } from "./supabase.js";
document.addEventListener("DOMContentLoaded", () => {
  let isLogin = true;
  const authForm = document.getElementById("authForm");
  const toggleForm = document.getElementById("toggleForm");
  const authBtn = document.getElementById("authBtn");
  const toggleText = document.getElementById("toggleText");
  const formTitle = document.getElementById("formTitle");
  const formSubtitle = document.getElementById("formSubtitle");

  toggleForm?.addEventListener("click", (e) => {
    e.preventDefault();
    isLogin = !isLogin;

    if (!isLogin) {
      const nameGroup = document.createElement("div");
      nameGroup.className = "form-group";
      nameGroup.id = "nameGroup";
      nameGroup.innerHTML = `
        <label for="fullName">Full Name</label>
        <input type="text" id="fullName" required />
      `;
      authForm.insertBefore(nameGroup, authBtn);

      authBtn.textContent = "Sign Up";
      formTitle.textContent = "Sign Up";
      formSubtitle.textContent = "Create a new account";
      toggleForm.textContent = "Login";
      toggleText.textContent = "Already have an account?";
    } else {
      const nameGroup = document.getElementById("nameGroup");
      if (nameGroup) authForm.removeChild(nameGroup);

      authBtn.textContent = "Login";
      formTitle.textContent = "Login";
      formSubtitle.textContent = "Sign in to your account";
      toggleForm.textContent = "Sign Up";
      toggleText.textContent = "Don’t have an account?";
    }
  });
  async function signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: fullName,
      });

      if (data.user.confirmed_at) {
        window.location.href = "/account.html";
      } else {
        alert("Check your email to confirm your account.");
        window.location.href = "/login.html";
      }
    }
  }

  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
      return;
    }
    window.location.href = "/account.html";
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login.html";
  }

  async function displayProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login.html";
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    const fullName =
      profile?.full_name || user.user_metadata?.full_name || "User";
    document.getElementById("username").textContent = fullName;
    document.getElementById("greeting").textContent = `Welcome, ${fullName}!`;
  }

  authForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const fullNameInput = document.getElementById("fullName");
    const fullName = fullNameInput ? fullNameInput.value : null;

    if (isLogin) {
      await login(email, password);
    } else {
      await signUp(email, password, fullName);
    }
  });
});
