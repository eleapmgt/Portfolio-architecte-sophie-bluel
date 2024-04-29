import { logButton, adminPage } from "./adminSession.js";

const log = document.querySelector(`a[href="login.html"]`);
const gallerySection = document.querySelector(".gallery");

// Fonction d'affichage par défaut de la page d'accueil
export async function displayDefault() {
  // Fonction pour récupérer les projets disponibles via l'API
  function fetchWorksData() {
    return fetch("http://localhost:5678/api/works")
      .then((response) => response.json())
      .catch(() => alert("Une erreur est survenue."));
  }

  const worksData = await fetchWorksData();
  await displayWorks(worksData);
}

// Fonction permettant d'afficher les projets
async function displayWorks(worksData) {
  // Effacer le contenu de la galerie précédente
  gallerySection.innerHTML = "";

  for (let i = 0; i < worksData.length; i++) {
    const work = worksData[i];
    // Création des éléments HTML pour afficher chaque projet
    const figureElement = document.createElement("figure");
    const imageElement = document.createElement("img");
    const titleElement = document.createElement("figcaption");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;
    titleElement.innerText = work.title;
    // Ajout des éléments à la galerie
    gallerySection.appendChild(figureElement);
    figureElement.appendChild(imageElement);
    figureElement.appendChild(titleElement);
  }
}

// Fonction pour afficher les boutons filtres et filtrer par catégorie
function displayButtons() {
  // Récupération des catégories existantes via l'API
  fetch("http://localhost:5678/api/categories")
    .then((categories) => categories.json())
    .then((categories) => {
      // Récupération de l'élément du DOM qui accueillera les buttons
      const filters = document.querySelector(".filters");

      // Création et ajout des buttons à la structure HTML
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

// Fonction de déconnexion
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
