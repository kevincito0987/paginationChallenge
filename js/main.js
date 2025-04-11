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
        console.log("📥 La API de Naruto ha devuelto los siguientes personajes:", data.characters); // 🔍 Muestra los datos de la API
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
    const imageElement = document.querySelectorAll(".card-image")[index];
    if (!imageElement) {
        console.error(`❌ No se encontró el elemento de imagen para la tarjeta de índice ${index}`);
        return; // ⛔ Detenemos ejecución si no existe el elemento
    }

    // 🖼️ Imágenes predeterminadas específicas
    const defaultImages = [
        "https://preview.redd.it/ebn2tdznx1pd1.jpeg?auto=webp&s=c87056f6fed51dccc88ed7fadcaa41b350d0565b", // Imagen inicial
        "https://s0.smartresize.com/wallpaper/287/15/HD-wallpaper-sage-mode-jiraiya-anime-naruto.jpg" // Imagen alternada
    ];

    let currentIndex = 0; // 🌀 Índice para alternar entre imágenes

    // 🎯 Caso específico: tarjeta 8
    if (index === 7) {
        // Asignar directamente la primera imagen predeterminada al cargar
        validateAndAssignImage(defaultImages[0]); // Llama a la función para asignar la imagen inicial
        console.log(`✅ Imagen inicial asignada en tarjeta 8: ${defaultImages[0]}`);

        // Al hacer clic, cambiar a la imagen alternada específica
        imageElement.addEventListener("click", () => {
            imageElement.src = defaultImages[1]; // Cambia directamente a la segunda imagen
            imageElement.alt = `Imagen alternada para ${character.name || "Personaje desconocido"}`;
            console.log(`🖼️ Imagen alternada por clic en tarjeta 8: ${defaultImages[1]}`);
        });

        return; // Salimos aquí para evitar conflictos con la lógica general
    }

    // 💡 Lógica general para otras tarjetas
    const images = character.images?.length > 0 ? character.images : defaultImages;

    const validateAndAssignImage = (url, fallback = false) => {
        fetch(url)
            .then((response) => {
                if (response.ok) {
                    imageElement.src = url; // Asigna la imagen si la URL es válida
                    imageElement.alt = `Imagen de ${character.name || "Personaje desconocido"}`;
                    console.log(`✅ Imagen asignada correctamente: ${url}`);
                } else if (!fallback) {
                    console.warn(`⚠️ URL no válida (${response.status}): ${url}. Usando imagen predeterminada.`);
                    imageElement.src = defaultImages[0]; // Fallback a la primera imagen predeterminada
                    imageElement.alt = `Imagen predeterminada para ${character.name || "Personaje desconocido"}`;
                }
            })
            .catch((error) => {
                if (!fallback) {
                    console.error(`❌ Error al validar la imagen ${url}:`, error);
                    imageElement.src = defaultImages[0]; // Fallback a la primera imagen predeterminada
                    imageElement.alt = `Imagen predeterminada para ${character.name || "Personaje desconocido"}`;
                }
            });
    };

    validateAndAssignImage(images[0]); // Asignar la primera imagen dinámica o predeterminada

    // 🎭 Alternar entre imágenes dinámicas o predeterminadas al hacer clic
    imageElement.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % images.length; // Cambia entre 0 y la longitud de imágenes
        validateAndAssignImage(images[currentIndex]); // Asigna la nueva imagen
        console.log(`🖼️ Alternando imagen dinámica: ${images[currentIndex]}`);
    });
};


// 📝 **Actualiza el texto en elementos específicos**
const updateElementText = (elementId, textContent) => {
    const element = document.getElementById(elementId);
    if (element) element.textContent = textContent;
};

// 🔄 **Configura los botones de paginación dinámicamente**
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

// 🖱️ **Crea un botón de navegación**
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

// 🔢 **Crea un botón de página específico**
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
