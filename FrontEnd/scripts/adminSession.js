import { openModal } from "./modal.js";

/**
 * Fonction vérifiant si l'utilisateur est connecté
 * @returns {boolean} - True si l'utilisateur est connecté, sinon False.
 */
function isLoggedIn() {
  return localStorage.getItem("token") ? true : false;
}

/**
 * Fonction affichant le bouton de connexion ou de déconnexion en fonction de l'état de connexion
 * @param {HTMLElement} log - L'élément HTML qui représente le bouton de connexion.
 * @returns {void}
 */
export function logButton(log) {
  log.innerHTML = isLoggedIn() ? "logout" : "login";
}

/**
 * Fonction affichant la page d'accueil de l'utilisateur authentifié avec les fonctionnalités d'administration
 * @returns {void}
 */
export function adminPage() {
  /**
   * Fonction ajoutant le bouton "modifier" à la page d'accueil
   * @returns {void}
   * @private
   */
  function addModifyButton() {
    const sectionPortfolio = document.getElementById("portfolio");
    const modifyBtn = document.createElement("a");
    modifyBtn.classList.add("modifyBtn", "openModalBtn");
    modifyBtn.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>
  modifier`;
    modifyBtn.setAttribute("href", "#modal");
    sectionPortfolio
      .querySelector("h2")
      .insertAdjacentElement("afterend", modifyBtn);
  }
  /**
   * Fonction ajoutant la bannière du mode édition à la page d'accueil
   * @returns {void}
   * @private
   */
  function addBanner() {
    const body = document.querySelector("body");
    const adminBanner = document.createElement("div");
    adminBanner.classList = "adminBanner";
    adminBanner.innerHTML = `<a href="#">
    <i class="fa-regular fa-pen-to-square"></i>
    Mode édition</a>`;
    body.insertBefore(adminBanner, body.firstChild);
  }
  if (isLoggedIn()) {
    addBanner();
    addModifyButton();
    document
      .querySelector(".openModalBtn")
      .addEventListener("click", openModal);
    document.querySelector(".adminBanner").addEventListener("click", openModal);
  }
}
