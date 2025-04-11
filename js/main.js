// 🟢 Log inicial para verificar que el script esté activo
console.log("Hello World");

// 🌐 Configuración global de la API y paginación
const API_URL = "https://dattebayo-api.onrender.com/characters";
const CHARACTERS_PER_PAGE = 4;

// 🗂️ Variables globales para el estado de la aplicación
let currentPage = 1;
let characters = [];

/*********************** 🔄 Funciones Principales ***********************/

// 🌟 Función para obtener los datos de la API
const fetchCharacters = async () => {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error("Error al obtener los datos de la API");

        const data = await response.json();
        console.log("Datos obtenidos de la API:", data.characters);

        characters = data.characters || [];
        renderPage(currentPage); // Renderiza la primera página
        setupPagination(); // Configura los botones de navegación
    } catch (error) {
        console.error("Error al obtener los personajes:", error);
    }
};

// 📄 Función para renderizar los personajes de la página actual
const renderPage = (page) => {
    const startIndex = (page - 1) * CHARACTERS_PER_PAGE;
    const endIndex = startIndex + CHARACTERS_PER_PAGE;

    const visibleCharacters = characters.slice(startIndex, endIndex);

    visibleCharacters.forEach((character, index) => {
        updateCardContent(character, index + 1);
        updateCardImage(character, index);
    });

    updateActivePageButton();
};

/*********************** 🖼️ Funciones de Actualización ***********************/
// 📝 Actualiza el texto dentro de un elemento HTML por su ID
const updateElementText = (elementId, textContent) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = textContent; // Actualiza el texto si el elemento existe
    } else {
        console.warn(`⚠️ Elemento con ID "${elementId}" no encontrado.`);
    }
};

// 🔤 Actualiza el contenido textual de una tarjeta
const updateCardContent = (character, cardIndex) => {
    updateElementText(`personaje-${cardIndex}`, character.name || "Nombre no disponible");
    updateElementText(`aldea-personaje${cardIndex}`, `Aldeas donde estuvo: ${character.personal.affiliation?.join(", ") || "Desconocida"}`);
    updateElementText(`clan-personaje${cardIndex}`, `Clan: ${character.personal.clan || "Desconocido"}`);
    updateElementText(`habilidades-personaje${cardIndex}`, `Habilidades: ${character.natureType?.join(", ") || "No disponibles"}`);
};

// 🎨 Actualiza las imágenes de una tarjeta
const updateCardImage = (character, index) => {
    const imageElement = document.querySelectorAll(".card-image")[index];
    if (!imageElement) return;

    const images = character.images?.length > 0 ? character.images : []; // Imágenes de la API
    let currentIndex = 0;

    // 🎯 Caso especial: imágenes específicas para Jiraiya
    if (character.name === "Jiraiya") {
        const jiraiyaImages = [
            "https://preview.redd.it/ebn2tdznx1pd1.jpeg?auto=webp&s=c87056f6fed51dccc88ed7fadcaa41b350d0565b",
            "https://s0.smartresize.com/wallpaper/287/15/HD-wallpaper-sage-mode-jiraiya-anime-naruto.jpg"
        ];

        assignImage(imageElement, jiraiyaImages[currentIndex], character.name);

        imageElement.addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % jiraiyaImages.length;
            assignImage(imageElement, jiraiyaImages[currentIndex], character.name);
        });

        return;
    }

    // 💡 Lógica general para otros personajes
    if (images.length > 0) {
        assignImage(imageElement, images[currentIndex], character.name);

        imageElement.addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % images.length;
            assignImage(imageElement, images[currentIndex], character.name);
        });
    } else {
        console.warn(`No hay imágenes disponibles para ${character.name}.`);
        assignImage(imageElement, "./assets/default-image.jpg", character.name);
    }
};

// 🖼️ Función auxiliar para asignar una imagen
const assignImage = (imageElement, url, characterName) => {
    imageElement.src = url;
    imageElement.alt = `Imagen de ${characterName || "Personaje desconocido"}`;
};

/*********************** 🔘 Funciones de Navegación ***********************/

// 🔢 Configura la paginación dinámica
const setupPagination = () => {
    const container = document.querySelector(".buttom");
    const totalPages = Math.ceil(characters.length / CHARACTERS_PER_PAGE);

    container.innerHTML = "";

    // Botón "Anterior"
    container.appendChild(createNavigationButton("previous", "Anterior", () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    }));

    // Botones de páginas
    const pageButtonsContainer = document.createElement("div");
    pageButtonsContainer.className = "pagination-buttons";

    for (let i = 1; i <= totalPages; i++) {
        pageButtonsContainer.appendChild(createPageButton(i));
    }

    container.appendChild(pageButtonsContainer);

    // Botón "Siguiente"
    container.appendChild(createNavigationButton("next", "Siguiente", () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPage(currentPage);
        }
    }));
};

// 🖱️ Crea un botón de navegación (anterior/siguiente)
const createNavigationButton = (direction, label, onClick) => {
    const button = document.createElement("a");
    button.href = "#";
    button.className = `arrows navigation-${direction}`;
    button.innerHTML = `
        ${direction === "previous" ? `<img src="./assets/anterior.svg" alt="Flecha izquierda">` : ""}
        <p>${label}</p>
        ${direction === "next" ? `<img src="./assets/siguiente-boton.svg" alt="Flecha derecha">` : ""}
    `;
    button.addEventListener("click", (event) => {
        event.preventDefault();
        onClick();
    });
    return button;
};

// 🔢 Crea un botón de página específico
const createPageButton = (pageNumber) => {
    const button = document.createElement("a");
    button.href = "#";
    button.className = "pagination-button";
    button.textContent = pageNumber;
    button.dataset.page = pageNumber;

    button.addEventListener("click", (event) => {
        event.preventDefault();
        currentPage = pageNumber;
        renderPage(currentPage);
    });

    return button;
};

// 🟢 Resalta el botón de la página activa
const updateActivePageButton = () => {
    document.querySelectorAll(".pagination-button").forEach((button) => {
        const isActive = parseInt(button.dataset.page) === currentPage;
        button.classList.toggle("active", isActive);
    });
};

/*********************** 🚀 Inicialización ***********************/

// Inicializa la aplicación
const init = async () => {
    await fetchCharacters(); // Obtiene los datos de la API y configura la aplicación
};

init(); // Arranque del script
