console.log("Hello World"); // 📝 Verificación de ejecución del script, útil para pruebas iniciales

// 🌎 URL de la API donde obtenemos los datos de los personajes
const API_URL = "https://dattebayo-api.onrender.com/characters";

// 🎯 Configuración de paginación: cuántos personajes mostramos por página
const CHARACTERS_PER_PAGE = 4;

// 📌 Variables globales para el estado de la aplicación
let currentPage = 1; // Página actual de la galería
let characters = []; // Array donde guardamos los personajes obtenidos de la API

// 🚀 Obtiene los personajes desde la API
const fetchCharacters = async () => {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error("Error al obtener los datos de la API");

        const data = await response.json();
        characters = data.characters || []; // Si no hay datos, asignamos un array vacío
        renderPage(currentPage); // Renderiza la primera página
        setupPagination(); // Configura los botones de paginación
    } catch (error) {
        console.error("❌ Error al obtener los personajes:", error);
    }
};

// 📄 Renderiza los personajes de la página actual
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

// 📝 Actualiza la información textual en cada tarjeta
const updateCardContent = (character, cardIndex) => {
    updateElementText(`personaje-${cardIndex}`, character.name || "Nombre no disponible");
    updateElementText(`aldea-personaje${cardIndex}`, `Aldeas donde estuvo: ${character.personal.affiliation?.join(", ") || "Desconocida"}`);
    updateElementText(`clan-personaje${cardIndex}`, `Clan: ${character.personal.clan || "Desconocido"}`);
    updateElementText(`habilidades-personaje${cardIndex}`, `Habilidades: ${character.natureType?.join(", ") || "No disponibles"}`);
};

// 🎨 Actualiza la imagen en cada tarjeta
const updateCardImage = (character, index) => {
    const imageElement = document.querySelectorAll(".card-image")[index];
    if (!imageElement) return;

    const images = character.images || ["./assets/default-image.jpg"];
    let currentIndex = 0;

    imageElement.src = images[currentIndex];
    imageElement.alt = `Imagen de ${character.name || "Personaje desconocido"}`;

    imageElement.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % images.length; // Alterna entre las imágenes disponibles
        imageElement.src = images[currentIndex];
    });
};

// 📝 Actualiza el contenido textual de un elemento
const updateElementText = (elementId, textContent) => {
    const element = document.getElementById(elementId);
    if (element) element.textContent = textContent;
};

// 🔄 Configuración de botones de paginación dinámicos
const setupPagination = () => {
    const container = document.querySelector(".buttom");
    const totalPages = Math.ceil(characters.length / CHARACTERS_PER_PAGE);

    // Limpia los botones previos
    container.innerHTML = "";

    // Crea el botón "Anterior"
    container.appendChild(createNavigationButton("previous", "Anterior", () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    }));

    // Crea los botones para las páginas
    const pageButtonsContainer = document.createElement("div");
    pageButtonsContainer.className = "pagination-buttons";

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = createPageButton(i);
        pageButtonsContainer.appendChild(pageButton);
    }

    container.appendChild(pageButtonsContainer);

    // Crea el botón "Siguiente"
    container.appendChild(createNavigationButton("next", "Siguiente", () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPage(currentPage);
        }
    }));
};

// 🖱️ Crea un botón de navegación ("Anterior" o "Siguiente")
const createNavigationButton = (direction, label, onClick) => {
    const button = document.createElement("a");
    button.href = "#";
    button.className = `arrows navigation-${direction}`;
    button.innerHTML = `
        ${direction === "previous" ? `<img src="./assets/anterior.svg" alt="arrow-left">` : ""}
        <p>${label}</p>
        ${direction === "next" ? `<img src="./assets/siguiente-boton.svg" alt="arrow-right">` : ""}
    `;
    button.addEventListener("click", (event) => {
        event.preventDefault();
        onClick();
    });
    return button;
};

// 🔢 Crea un botón de página
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

// 🟢 Actualiza el estilo del botón de la página activa
const updateActivePageButton = () => {
    document.querySelectorAll(".pagination-button").forEach((button) => {
        const isActive = parseInt(button.dataset.page) === currentPage;
        button.classList.toggle("active", isActive);
    });
};

// 🚀 Inicialización de la aplicación
const init = async () => {
    await fetchCharacters();
};

init(); // 🏁 Arranque del script