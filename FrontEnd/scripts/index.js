import { logButton, adminPage } from "./adminSession.js";

/**
 * @typedef {Array<object>} worksData - Un tableau d'objets représentant des projets.
 * @property {number} id - L'identifiant du projet.
 * @property {string} title - Le titre du projet.
 * @property {string} imageUrl - L'URL de l'image du projet.
 * @property {number} categoryId - L'identifiant de la catégorie du projet.
 * @property {number} userId - L'identifiant de l'utilisateur associé au projet.
 * @property {object} category - L'objet représentant la catégorie du projet.
 * @property {number} category.id - L'identifiant de la catégorie.
 * @property {string} category.name - Le nom de la catégorie.
 */

const log = document.querySelector(`a[href="login.html"]`);
const gallerySection = document.querySelector(".gallery");

/**
 * Fonction permettant d'afficher la galerie de projets par défaut
 * @returns {void}
 * @description Cette fonction récupère les données des projets disponibles via une API, puis les affiche.
 * En cas d'erreur lors de la récupération des données, une alerte survient.
 */
export async function displayDefault() {
  /**
   * Requête pour récupérer les projets disponibles via l'API
   * @returns {Promise<worksData>} Données des projets au format JSON ou alerte en cas d'erreur.
   * @description Cette fonction envoie une requête à l'URL spécifiée pour récupérer les données des projets.
   * Si la requête réussit, elle retourne une promesse résolue avec les données des projets au format JSON.
   * Si une erreur survient lors de la requête, une alerte est affichée pour informer l'utilisateur.
   */
  function fetchWorksData() {
    return fetch("http://localhost:5678/api/works")
      .then((response) => response.json())
      .catch(() => alert("Une erreur est survenue."));
  }
  const worksData = await fetchWorksData();
  await displayWorks(worksData);
}

/**
 * Fonction permettant d'afficher les projets
 * @param {Array<worksData>} worksData - Les données des projets à afficher.
 * @returns {Promise<void>} - Une promesse résolue une fois que les projets sont affichés.
 */
async function displayWorks(worksData) {
  gallerySection.innerHTML = "";
  for (let i = 0; i < worksData.length; i++) {
    const work = worksData[i];
    const figureElement = document.createElement("figure");
    const imageElement = document.createElement("img");
    const titleElement = document.createElement("figcaption");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;
    titleElement.innerText = work.title;
    gallerySection.appendChild(figureElement);
    figureElement.appendChild(imageElement);
    figureElement.appendChild(titleElement);
  }
}

/**
 * Fonction permettant d'afficher les boutons filtres et de filtrer par catégorie
 * @returns {void}
 */
function displayButtons() {
  // Récupération des catégories existantes via l'API
  fetch("http://localhost:5678/api/categories")
    .then((categories) => categories.json())
    .then((categories) => {
      const filters = document.querySelector(".filters");
      for (let i = 0; i < categories.length; i++) {
        const categoryName = categories[i].name;
        const categoryId = categories[i].id;
        const filterButton = document.createElement("button");
        filterButton.className = `filter-btn btn-id-${categoryId}`;
        filterButton.setAttribute("data-category-id", categoryId);
        filterButton.innerText = categoryName;
        filters.appendChild(filterButton);
      }

      // Au clic sur un filtre, affichage des projets concernés
      filters.querySelectorAll(".filter-btn").forEach((button) => {
        button.addEventListener("click", function () {
          filters.querySelectorAll(".filter-btn").forEach((btn) => {
            btn.classList.remove("active");
          });
          button.classList.add("active");
          const categoryId = button.getAttribute("data-category-id");
          // Si la catégorie n'a pas d'id, displayDefault()
          if (!categoryId) {
            displayDefault();
          } else {
            // Sinon, récupération des projets en fonction de l'id de leur catégorie
            fetch(`http://localhost:5678/api/works`)
              .then((worksData) => worksData.json())
              .then((worksData) => {
                const filteredWorks = worksData.filter(
                  (work) => work.categoryId == categoryId
                );
                if (filteredWorks.length > 0) {
                  displayWorks(filteredWorks);
                } else {
                  gallerySection.innerHTML = `<div class="empty-works">Pas de projet actuellement disponible dans cette catégorie.</div>`;
                }
              })
              .catch(() => alert("Une erreur est survenue."));
          }
        });
      });
    })
    .catch(() => alert("Une erreur est survenue."));
}

/**
 * Fonction de déconnexion
 * @returns {void}
 * @description Suppression du token d'authentification enregistré localement et redirection de l'utilisateur vers la page de connexion.
 */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// Affichage du bouton de connexion en fonction de l'état de connexion
logButton(log);

// Démarrer l'affichage par défaut
displayDefault();
displayButtons();

const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click", logout);

adminPage();
