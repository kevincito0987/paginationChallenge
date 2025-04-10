console.log("Hello World"); // 📝 Verificación de ejecución del script, útil para pruebas iniciales

// 🌎 URL de la API donde obtenemos los datos de los personajes
const API_URL = "https://dattebayo-api.onrender.com/characters";

// 🎯 Configuración de paginación: cuántos personajes mostramos por página
const CHARACTERS_PER_PAGE = 4;

// 📌 Variables globales para el estado de la aplicación
let currentPage = 1; // 📄 Página actual de la galería
let characters = []; // 🗂️ Array donde guardamos los personajes obtenidos de la API

// 🚀 **Obtiene los personajes desde la API**
const fetchCharacters = async () => {
    try {
        const response = await fetch(API_URL, {
            method: "GET", // 🔍 Método HTTP para obtener datos
            headers: { "Content-Type": "application/json" } // ⚙️ Indicamos que queremos recibir JSON
        });

        if (!response.ok) throw new Error("Error al obtener los datos de la API"); // ❌ Manejo de error si la respuesta no es exitosa

        const data = await response.json(); // 📥 Convertimos la respuesta a JSON
        characters = data.characters || []; // 🗃️ Si no hay datos, asignamos un array vacío
        renderPage(currentPage); // 🖼️ Renderizamos la primera página
        setupPagination(); // 🔄 Configuramos los botones de paginación
    } catch (error) {
        console.error("❌ Error al obtener los personajes:", error); // 🛑 Muestra errores si la API falla
    }
};

// 📄 **Renderiza los personajes de la página actual**
const renderPage = (page) => {
    const startIndex = (page - 1) * CHARACTERS_PER_PAGE; // ⏪ Índice inicial basado en la página
    const endIndex = startIndex + CHARACTERS_PER_PAGE; // ⏩ Índice final basado en la página
    const visibleCharacters = characters.slice(startIndex, endIndex); // ✂️ Extraemos los personajes visibles en la página

    visibleCharacters.forEach((character, index) => {
        updateCardContent(character, index + 1); // 🔄 Actualiza el contenido textual
        updateCardImage(character, index); // 🖼️ Actualiza la imagen
    });

    updateActivePageButton(); // 🟢 Resalta el botón de la página activa
};

// 📝 **Actualiza el texto de cada tarjeta**
const updateCardContent = (character, cardIndex) => {
    updateElementText(`personaje-${cardIndex}`, character.name || "Nombre no disponible"); // ✏️ Nombre del personaje
    updateElementText(`aldea-personaje${cardIndex}`, `Aldeas donde estuvo: ${character.personal.affiliation?.join(", ") || "Desconocida"}`); // 🏘️ Aldea del personaje
    updateElementText(`clan-personaje${cardIndex}`, `Clan: ${character.personal.clan || "Desconocido"}`); // 🛡️ Clan del personaje
    updateElementText(`habilidades-personaje${cardIndex}`, `Habilidades: ${character.natureType?.join(", ") || "No disponibles"}`); // ✨ Habilidades
};

// 🎨 **Actualiza las imágenes de cada tarjeta**
const updateCardImage = (character, index) => {
    const imageElement = document.querySelectorAll(".card-image")[index]; // 🖼️ Selecciona la imagen de la tarjeta
    if (!imageElement) return; // ⛔ Si no hay imagen, no ejecutamos nada

    const images = character.images || ["./assets/default-image.jpg"]; // 🗃️ Si no hay imágenes, usamos una predeterminada
    let currentIndex = 0; // 🌀 Índice para alternar entre imágenes

    imageElement.src = images[currentIndex]; // 📤 Asigna la primera imagen
    imageElement.alt = `Imagen de ${character.name || "Personaje desconocido"}`; // 🖋️ Texto alternativo para accesibilidad

    imageElement.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % images.length; // 🔄 Alterna entre imágenes disponibles
        imageElement.src = images[currentIndex];
    });
};

// 📝 **Actualiza el texto en elementos específicos**
const updateElementText = (elementId, textContent) => {
    const element = document.getElementById(elementId); // 🔍 Busca el elemento por ID
    if (element) element.textContent = textContent; // ✏️ Actualiza el contenido de texto
};

// 🔄 **Configura los botones de paginación dinámicamente**
const setupPagination = () => {
    const container = document.querySelector(".buttom"); // 📦 Contenedor principal de botones
    const totalPages = Math.ceil(characters.length / CHARACTERS_PER_PAGE); // ➗ Calcula el total de páginas

    container.innerHTML = ""; // 🧹 Limpia el contenedor previo

    // ➕ Botón "Anterior"
    container.appendChild(createNavigationButton("previous", "Anterior", () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    }));

    // 🔢 Botones de páginas
    const pageButtonsContainer = document.createElement("div"); // 🏗️ Contenedor de botones de páginas
    pageButtonsContainer.className = "pagination-buttons";

    for (let i = 1; i <= totalPages; i++) {
        pageButtonsContainer.appendChild(createPageButton(i)); // 🔨 Agrega botones dinámicamente
    }

    container.appendChild(pageButtonsContainer);

    // ➕ Botón "Siguiente"
    container.appendChild(createNavigationButton("next", "Siguiente", () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPage(currentPage);
        }
    }));
};

// 🖱️ **Crea un botón de navegación ("Anterior" o "Siguiente")**
const createNavigationButton = (direction, label, onClick) => {
    const button = document.createElement("a"); // 🏗️ Crea un elemento de enlace
    button.href = "#";
    button.className = `arrows navigation-${direction}`;
    button.innerHTML = `
        ${direction === "previous" ? `<img src="./assets/anterior.svg" alt="arrow-left">` : ""}
        <p>${label}</p>
        ${direction === "next" ? `<img src="./assets/siguiente-boton.svg" alt="arrow-right">` : ""}
    `;
    button.addEventListener("click", (event) => {
        event.preventDefault(); // 🚫 Evita la recarga de página
        onClick();
    });
    return button;
};

// 🔢 **Crea un botón de página específico**
const createPageButton = (pageNumber) => {
    const button = document.createElement("a"); // 🏗️ Crea un elemento de enlace
    button.href = "#";
    button.className = "pagination-button";
    button.textContent = pageNumber;
    button.dataset.page = pageNumber; // 🔖 Número de página como atributo

    button.addEventListener("click", (event) => {
        event.preventDefault(); // 🚫 Evita la recarga de página
        currentPage = pageNumber; // 🔄 Cambia la página actual
        renderPage(currentPage); // 🖼️ Renderiza la nueva página
    });

    return button;
};

// 🟢 **Resalta el botón de la página activa**
const updateActivePageButton = () => {
    document.querySelectorAll(".pagination-button").forEach((button) => {
        const isActive = parseInt(button.dataset.page) === currentPage; // 🎯 Verifica si el botón es el activo
        button.classList.toggle("active", isActive); // ✨ Agrega o quita la clase `active`
    });
};

// 🚀 **Inicializa la aplicación**
const init = async () => {
    await fetchCharacters(); // 🌟 Obtiene los datos y configura la aplicación
};

init(); // 🏁 Arranque del script
