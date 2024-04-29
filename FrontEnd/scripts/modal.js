import { displayDefault } from "./index.js";

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

const modalAddPhoto = document.querySelector(".modal-add-photo");
const modalGallery = document.querySelector(".modal-photo-gallery");

/**
 * Fonction ouvrant la modale
 * @returns {Promise<void>} - Promesse résolue quand le modale est ouverte.
 * @description Récupération des données disponibles via une API puis affichage de la modale avec les données récupérées.
 * Ajout d'écouteurs d'événements pour la fermeture de la modale.
 */
export async function openModal() {
  const modal = document.getElementById("modal");
  const worksData = await fetchWorksData();
  modal.style.display = "flex";
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");

  modal.addEventListener("click", closeModal);
  modal.querySelector(".closeModalBtn").addEventListener("click", closeModal);

  displayWorksInModal(worksData);
  document
    .getElementById("modal-gallery")
    .addEventListener("click", (event) => {
      event.stopPropagation();
    });
}

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

// Fonction pour afficher les projets dans la modale 1
/**
 * @param {Array<worksData>} worksData - Les données des projets à afficher.
 * @returns {Promise<void>} - Une promesse résolue lorsque l'affichage est terminé ou une promesse rejetée si une erreur survient pendant l'affichage.
 */
async function displayWorksInModal(worksData) {
  try {
    const modalContent = document.querySelector(".admin-gallery");
    modalContent.innerHTML = "";

    for (let i = 0; i < worksData.length; i++) {
      const work = worksData[i];
      const figureElement = document.createElement("figure");
      const imageElement = document.createElement("img");
      const imageTrashIcon = document.createElement("div");

      figureElement.id = work.id;
      imageElement.src = work.imageUrl;
      imageElement.alt = work.title;
      imageTrashIcon.classList = "imageTrashIcon";
      imageTrashIcon.innerHTML = `<i class="fa-solid fa-trash-can" style="color: #ffffff;"></i>`;

      modalContent.appendChild(figureElement);
      figureElement.appendChild(imageElement);
      figureElement.appendChild(imageTrashIcon);

      imageTrashIcon.addEventListener("click", () => {
        deleteWorkHandler(work.id);
      });
    }
  } catch {
    alert("Erreur d'affichage.");
  }
}

/**
 * Fonction gérant la suppression d'un projet
 * @param {number} workId - L'identifiant du projet à supprimer.
 * @returns {Promise<void>} - Une promesse résolue lorsque la suppression est terminée ou une promesse rejetée si une erreur survient lors de la suppression.
 */
async function deleteWorkHandler(workId) {
  const confirmation = confirm(
    "Êtes-vous sûr de vouloir supprimer ce projet ?"
  );
  if (confirmation) {
    const success = await deleteWork(workId);
    if (success) {
      const workToRemove = document.querySelector(`figure[id="${workId}"]`);
      if (workToRemove) {
        workToRemove.remove();
        displayDefault();
      }
    } else {
      alert("Une erreur s'est produite lors de la suppression du travail.");
    }
  }
}

/**
 * Fonction supprimant un projet du serveur
 * @param {number} workId - L'identifiant du projet à supprimer.
 * @returns {Promise<boolean>} - Une promesse résolue avec True si la suppression est réussie ou une promesse résolue avec False si la suppression échoue ou une erreur survient.
 */
async function deleteWork(workId) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la suppression du travail");
    }
    return true;
  } catch {
    alert("Erreur lors de la suppression du travail.");
    return false;
  }
}

/**
 * Fonction gérant la fermeture de la modale
 * @returns {void}
 */
function closeModal() {
  modalGallery.style.display = "flex";
  modalAddPhoto.style.display = "none";
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
}

// Fermeture de la modale en appuyant sur la touche Escape
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" || event.key === "Esc") {
    closeModal();
  }
});

// Ajout des catégories à sélectionner dans le formulaire
fetch("http://localhost:5678/api/categories")
  .then((categories) => categories.json())
  .then((categories) => {
    const categorySelect = document.getElementById("categorySelect");
    for (let i = 0; i < categories.length; i++) {
      const selectOption = document.createElement("option");
      categorySelect.appendChild(selectOption);
      selectOption.value = categories[i].id;
      selectOption.innerText = categories[i].name;
    }
  });

// Affichage de la modale 2 au clic sur le bouton Ajouter une photo
document.querySelector(".add-photo-btn").addEventListener("click", () => {
  modalGallery.style.display = "none";
  modalAddPhoto.style.display = "flex";
  document.getElementById("modal-add").addEventListener("click", (event) => {
    event.stopPropagation();
  });
  document
    .querySelector("#modal-add .closeModalBtn")
    .addEventListener("click", closeModal);
});

// Prévisualisation de l'image chargée dans le formulaire
const photoInput = document.getElementById("photoInput");
const formInputPhoto = document.querySelector(".form-input-photo");
const inputPhotoInfos = document.querySelector(".input-photo-infos");
const imagePreview = document.createElement("img");
photoInput.addEventListener("change", () => {
  if (photoInput.files && photoInput.files[0]) {
    imagePreview.id = "imagePreview";
    imagePreview.alt = "Aperçu de l'image";
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
    };
    reader.readAsDataURL(photoInput.files[0]);
    inputPhotoInfos.style.display = "none";
    formInputPhoto.appendChild(imagePreview);
  }
});

// Retour à l'affichage de la modale 1 au clic sur la flèche
document.querySelector(".arrow-backward").addEventListener("click", () => {
  modalAddPhoto.style.display = "none";
  modalGallery.style.display = "flex";
  imagePreview.remove();
  inputPhotoInfos.style.display = "flex";
  document.getElementById("titleInput").value = "";
  document.getElementById("photoInput").value = "";
});

// Envoi d'un nouveau projet au back-end
document
  .querySelector(".validate-photo-btn")
  .addEventListener("click", async (event) => {
    event.preventDefault();

    const title = document.getElementById("titleInput").value;
    const category = parseInt(document.getElementById("categorySelect").value);
    const image = document.getElementById("photoInput").files[0];

    if (!title || !category || !image) {
      alert("Veuillez remplir tous les champs du formulaire.");
      return;
    }

    if (image.size > 4 * 1024 * 1024) {
      alert("La taille de l'image de ne doit pas dépasser 4 Mo.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", image);

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        alert("Le projet a été ajouté avec succès.");
        imagePreview.remove();
        inputPhotoInfos.style.display = "flex";
        displayDefault();
        closeModal();
        document.getElementById("titleInput").value = "";
        document.getElementById("photoInput").value = "";
      } else {
        alert("Une erreur s'est produite lors de l'ajout du projet.");
      }
    } catch (error) {
      alert("Une erreur s'est produite lors de l'ajout du projet.");
    }
  });
