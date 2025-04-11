// 🟢 Verificación inicial para asegurarnos de que el script esté corriendo
console.log("Hello World");

// 🌐 Configuración global de la API y paginación
const API_URL = "https://dattebayo-api.onrender.com/characters"; // 🌎 URL de la API para obtener los datos de los personajes
const CHARACTERS_PER_PAGE = 4; // 🔢 Cantidad de personajes mostrados por página

// 🗂️ Variables globales para el estado de la aplicación
let currentPage = 1; // 📄 Página actual del sistema de paginación
let characters = []; // 🗂️ Almacenamos los datos de los personajes obtenidos de la API

/*********************** 🔄 Funciones Principales ***********************/

// 🌟 **Obtiene los datos de la API**
const fetchCharacters = async () => {
    try {
        const response = await fetch(API_URL, {
            method: "GET", // 🔍 Método HTTP GET para obtener datos
            headers: { "Content-Type": "application/json" } // 🛠️ Indicamos que queremos recibir datos en formato JSON
        });

        // ❌ Si la respuesta no es exitosa, lanzamos un error
        if (!response.ok) throw new Error("Error al obtener los datos de la API");

        // 📥 Convertimos la respuesta en un objeto JSON y mostramos los datos en la consola
        const data = await response.json();
        console.log("🗂️ Datos obtenidos de la API:", data.characters);

        // 🚀 Guardamos los datos en la variable global y configuramos la primera página
        characters = data.characters || [];
        renderPage(currentPage); // 🖼️ Renderiza la primera página de personajes
        setupPagination(); // 🔘 Configura los botones de navegación
    } catch (error) {
        console.error("❌ Error al obtener los personajes:", error); // ⚠️ Mostramos un mensaje de error en caso de falla
    }
};

// 📄 **Renderiza los personajes de la página actual**
const renderPage = (page) => {
    // 🔢 Calculamos los índices de inicio y fin según la página actual
    const startIndex = (page - 1) * CHARACTERS_PER_PAGE;
    const endIndex = startIndex + CHARACTERS_PER_PAGE;

    // ✂️ Extraemos los personajes visibles para esta página
    const visibleCharacters = characters.slice(startIndex, endIndex);

    // 🔄 Actualizamos el contenido de cada tarjeta visible
    visibleCharacters.forEach((character, index) => {
        updateCardContent(character, index + 1); // 📝 Actualiza el contenido textual
        updateCardImage(character, index); // 🖼️ Actualiza la imagen correspondiente
    });

    updateActivePageButton(); // 🟢 Resalta el botón de la página activa
};

/*********************** 🖼️ Funciones de Actualización ***********************/
// ✏️ **Actualiza el texto dentro de un elemento HTML por su ID**
const updateElementText = (elementId, textContent) => {
    // 🔍 Busca el elemento en el DOM por su ID
    const element = document.getElementById(elementId);

    if (element) {
        // ✏️ Actualiza el contenido del texto solo si el elemento existe
        element.textContent = textContent;
    } else {
        // ⚠️ Muestra una advertencia en la consola si no se encuentra el elemento
        console.warn(`⚠️ Elemento con ID "${elementId}" no encontrado.`);
    }
};

// 🔤 **Actualiza el contenido textual de una tarjeta**
const updateCardContent = (character, cardIndex) => {
    updateElementText(`personaje-${cardIndex}`, character.name || "Nombre no disponible"); // ✏️ Nombre del personaje
    updateElementText(`aldea-personaje${cardIndex}`, `Aldeas donde estuvo: ${character.personal.affiliation?.join(", ") || "Desconocida"}`); // 🏘️ Afiliaciones del personaje
    updateElementText(`clan-personaje${cardIndex}`, `Clan: ${character.personal.clan || "Desconocido"}`); // 🛡️ Clan al que pertenece
    updateElementText(`habilidades-personaje${cardIndex}`, `Habilidades: ${character.natureType?.join(", ") || "No disponibles"}`); // ✨ Habilidades conocidas
};

// 🎨 **Actualiza las imágenes de una tarjeta**
const updateCardImage = (character, index) => {
    const imageElement = document.querySelectorAll(".card-image")[index];
    if (!imageElement) return; // ⛔ Salimos si no se encuentra el elemento de imagen

    const images = character.images?.length > 0 ? character.images : []; // 📸 Usamos las imágenes de la API o un array vacío
    let currentIndex = 0; // 🔄 Índice actual para alternar entre imágenes

    // 🎯 **Caso especial: imágenes específicas para Jiraiya**
    if (character.name === "Jiraiya") {
        const jiraiyaImages = [
            "https://preview.redd.it/ebn2tdznx1pd1.jpeg?auto=webp&s=c87056f6fed51dccc88ed7fadcaa41b350d0565b",
            "https://s0.smartresize.com/wallpaper/287/15/HD-wallpaper-sage-mode-jiraiya-anime-naruto.jpg"
        ];

        assignImage(imageElement, jiraiyaImages[currentIndex], character.name); // 🖼️ Asigna la imagen inicial

        // 🔄 Alterna entre las imágenes específicas de Jiraiya al hacer clic
        imageElement.addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % jiraiyaImages.length;
            assignImage(imageElement, jiraiyaImages[currentIndex], character.name);
        });

        return; // 🚫 Salimos porque ya manejamos este caso especial
    }

    // 💡 **Lógica general para otros personajes**
    if (images.length > 0) {
        assignImage(imageElement, images[currentIndex], character.name);

        // 🔄 Alterna entre las imágenes dinámicas de la API al hacer clic
        imageElement.addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % images.length;
            assignImage(imageElement, images[currentIndex], character.name);
        });
    } else {
        console.warn(`⚠️ No hay imágenes disponibles para ${character.name}.`);
        assignImage(imageElement, "./assets/default-image.jpg", character.name); // 🖼️ Asigna una imagen predeterminada
    }
};

// 🖼️ **Asigna una imagen a un elemento**
const assignImage = (imageElement, url, characterName) => {
    imageElement.src = url; // 🎯 Asigna la fuente de la imagen
    imageElement.alt = `Imagen de ${characterName || "Personaje desconocido"}`; // ✏️ Texto alternativo para accesibilidad
};

/*********************** 🔘 Funciones de Navegación ***********************/

// 🔢 **Configura la paginación dinámica**
const setupPagination = () => {
    const container = document.querySelector(".buttom");
    const totalPages = Math.ceil(characters.length / CHARACTERS_PER_PAGE);

    container.innerHTML = ""; // 🧹 Limpiamos el contenedor antes de agregar los botones

    // ⏪ Botón "Anterior"
    container.appendChild(createNavigationButton("previous", "Anterior", () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    }));

    // 🔢 Botones de páginas
    const pageButtonsContainer = document.createElement("div");
    pageButtonsContainer.className = "pagination-buttons";

    for (let i = 1; i <= totalPages; i++) {
        pageButtonsContainer.appendChild(createPageButton(i));
    }

    container.appendChild(pageButtonsContainer);

    // ⏩ Botón "Siguiente"
    container.appendChild(createNavigationButton("next", "Siguiente", () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPage(currentPage);
        }
    }));
};

// 🖱️ **Crea un botón de navegación (anterior/siguiente)**
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
        event.preventDefault(); // 🚫 Previene la recarga de la página
        onClick();
    });
    return button;
};

// 🔢 **Crea un botón de página específica**
const createPageButton = (pageNumber) => {
    const button = document.createElement("a");
    button.href = "#";
    button.className = "pagination-button";
    button.textContent = pageNumber;
    button.dataset.page = pageNumber;

    button.addEventListener("click", (event) => {
        event.preventDefault(); // 🚫 Previene la recarga de la página
        currentPage = pageNumber;
        renderPage(currentPage);
    });

    return button;
};

// 🟢 **Resalta el botón de la página activa**
const updateActivePageButton = () => {
    // 🔄 Iteramos sobre todos los botones de paginación
    document.querySelectorAll(".pagination-button").forEach((button) => {
        const isActive = parseInt(button.dataset.page) === currentPage; // 🎯 Verifica si el botón es el activo
        button.classList.toggle("active", isActive); // ✨ Agrega o quita la clase `active`
    });
};

/*********************** 🚀 Inicialización ***********************/

// 🏁 **Inicializa la aplicación**
const init = async () => {
    await fetchCharacters(); // 🌟 Obtiene los datos de la API y configura la aplicación
};

init(); // 🏁 Ejecuta el script inicial

