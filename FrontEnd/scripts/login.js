const log = document.querySelector(`a[href="login.html"]`);

// Gestion des erreurs
const errorLogin = document.querySelector(".errorLogin");

// Au clic, désactivation du lien cliquable de login dans le menu
const loginLink = document.querySelector(`a[href="login.html"]`);
loginLink.addEventListener("click", (event) => {
  event.preventDefault();
});

// Au clic, récupération des informations rentrées par l'utilisateur
const form = document.getElementById("login-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = event.target.email.value.trim();
  const password = event.target.password.value.trim();
  /**
   * Définition d'un objet contenant les informations de connexion de l'utilisateur
   * @typedef {Object} userData
   * @property {string} email
   * @property {string} password
   */
  const userData = {
    email: email,
    password: password,
  };
  login(userData);
});

/**
 * Fonction permettant d'authentifier l'utilisateur
 * @param {userData} userData - Les données d'identification de l'utilisateur (email et mot de passe).
 * @returns {Promise<void>} - Une promesse résolue lorsque la connexion est faite ou une promesse rejetée si une erreur survient lors de la connexion.
 * @description Récupération du jeton d'authentification si la promesse est résolue et redirection vers la page d'accueil.
 */
async function login(userData) {
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error("Erreur dans l'identifiant ou le mot de passe");
    }
    const data = await response.json();
    localStorage.setItem("token", data.token);
    window.location.href = "./index.html";
  } catch (err) {
    errorLogin.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${err.message}`;
  }
}
