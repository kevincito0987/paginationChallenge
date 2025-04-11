// 🟢 Verificación inicial para asegurarnos de que el script esté corriendo correctamente
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

    // 🎯 **Casos especiales: personajes con imágenes adicionales**
    const specialCases = {
        "Jiraiya": [
            "https://preview.redd.it/ebn2tdznx1pd1.jpeg?auto=webp&s=c87056f6fed51dccc88ed7fadcaa41b350d0565b",
            "https://s0.smartresize.com/wallpaper/287/15/HD-wallpaper-sage-mode-jiraiya-anime-naruto.jpg"
        ],
        // Otros personajes que necesitan imágenes alternadas:
        "Madara Uchiha": [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVsgS9bbR2ZpKXeY6Bor2oYI2RD5wTCEWzyw&s"
        ],
        // Puedes seguir añadiendo más personajes aquí...
        "Mitsuki": [
            "   https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6H73qPGjBglfkPUjy2gjfgIQUghEA7nKPWQ&s"
        ],
        "Minato Namikaze": [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtnFhchSWypdsknVAVh-iGEjpsjjKZLxsF8w&s"
        ],
        "Boruto Uzumaki": [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfvqmCqboLygsrvTSd_WNtNWr07oeDAbi6uA&s"
        ],
        "Itachi Uchiha": [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS32U2ujmK5aaqqHjmoTRDcZ5HQKhIcZCXDbQ&s"
        ],
        "Hashirama Senju": [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOcrTZE_7SpN2ELwSwMP4Gzldh-hGOpedtag&s"
        ],
        "Tsunade": [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQssogct9VZXp0f-Kw8O2kFeT8HZc3b-Hi06w&s"
        ],
        "Koji Kashin": [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS89xDKABraO3v-p2MB0KYSctkxRW4fq6t5qg&s"
        ]
    };

    const isSpecialCase = specialCases[character.name];
    const defaultImage = images[0] || "./assets/default-image.jpg"; // 📸 La primera imagen de la API es la predeterminada

    if (isSpecialCase) {
        const allImages = [defaultImage, ...specialCases[character.name]]; // 🌟 Imagen API + URLs adicionales

        // 🔄 Mostrar siempre la primera imagen al iniciar
        assignImage(imageElement, allImages[currentIndex], character.name);
        console.log(`📷 Imagen inicial para ${character.name} mostrada: ${allImages[currentIndex]}`);

        // 🔄 Alterna entre imágenes al hacer clic
        imageElement.addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % allImages.length; // 🎯 Solo alterna entre las imágenes disponibles
            assignImage(imageElement, allImages[currentIndex], character.name);
            console.log(`🔄 Alternando imagen de ${character.name}: ${allImages[currentIndex]}`);
        });

        return;
    }

    // 💡 **Lógica general para otros personajes**
    assignImage(imageElement, defaultImage, character.name);
    console.log(`📷 Imagen predeterminada mostrada para ${character.name}`);
};

// 🖼️ **Asigna una imagen a un elemento**
const assignImage = (imageElement, url, characterName) => {
    imageElement.src = url; // 🎯 Asigna la fuente de la imagen
    imageElement.alt = `Imagen de ${characterName || "Personaje desconocido"}`; // ✏️ Texto alternativo para accesibilidad
};

/*********************** 🔘 Funciones de Navegación ***********************/

// 🔢 **Configura la paginación dinámica**
const setupPagination = () => {
    const container = document.querySelector(".buttom"); // 🧱 Seleccionamos el contenedor de los botones
    const totalPages = Math.ceil(characters.length / CHARACTERS_PER_PAGE); // 🔢 Calculamos el número total de páginas

    container.innerHTML = ""; // 🧹 Limpiamos el contenedor antes de agregar nuevos botones

    // ⏪ Botón "Anterior"
    container.appendChild(createNavigationButton("previous", "Anterior", () => {
        if (currentPage > 1) {
            currentPage--; // 🔄 Restamos 1 a la página actual
            renderPage(currentPage); // 🖼️ Renderizamos los personajes de la nueva página
        }
    }));

    // 🔢 Botones de páginas dinámicos
    const pageButtonsContainer = document.createElement("div"); // 📦 Contenedor para los botones de paginación
    pageButtonsContainer.className = "pagination-buttons"; // 🎨 Clase CSS para estilizar los botones

    for (let i = 1; i <= totalPages; i++) {
        pageButtonsContainer.appendChild(createPageButton(i)); // ➕ Añadimos un botón por cada página
    }

    container.appendChild(pageButtonsContainer); // 🔗 Añadimos el contenedor de botones de páginas al principal

    // ⏩ Botón "Siguiente"
    container.appendChild(createNavigationButton("next", "Siguiente", () => {
        if (currentPage < totalPages) {
            currentPage++; // 🔄 Sumamos 1 a la página actual
            renderPage(currentPage); // 🖼️ Renderizamos los personajes de la nueva página
        }
    }));
};

// 🖱️ **Crea un botón de navegación (anterior/siguiente)**
const createNavigationButton = (direction, label, onClick) => {
    // 📌 Creamos el botón como un enlace
    const button = document.createElement("a");
    button.href = "#"; // 🔗 Evitamos una redirección no deseada
    button.className = `arrows navigation-${direction}`; // 🎨 Clase CSS para estilizar el botón según la dirección (anterior/siguiente)

    // 🖼️ Agregamos contenido dinámico con iconos y etiquetas según la dirección
    button.innerHTML = `
        ${direction === "previous" ? `<img src="./assets/anterior.svg" alt="Flecha izquierda">` : ""}
        <p>${label}</p>
        ${direction === "next" ? `<img src="./assets/siguiente-boton.svg" alt="Flecha derecha">` : ""}
    `;

    // 🖱️ Evento de clic para manejar la acción personalizada
    button.addEventListener("click", (event) => {
        event.preventDefault(); // 🚫 Prevenimos el comportamiento predeterminado del enlace
        onClick(); // 🚀 Ejecutamos la función proporcionada en el parámetro `onClick`
    });

    return button; // 🔙 Retornamos el botón para integrarlo dinámicamente
};

// 🔢 **Crea un botón de página específica**
const createPageButton = (pageNumber) => {
    // 📌 Creamos el botón como un enlace para cada página disponible
    const button = document.createElement("a");
    button.href = "#"; // 🔗 Enlace vacío para evitar redirecciones
    button.className = "pagination-button"; // 🎨 Clase CSS para estilizar los botones de paginación
    button.textContent = pageNumber; // 🔢 Establecemos el número de página como contenido del botón
    button.dataset.page = pageNumber; // 🗂️ Agregamos un atributo `data-page` para identificar el número de página

    // 🖱️ Evento de clic para manejar la navegación entre páginas
    button.addEventListener("click", (event) => {
        event.preventDefault(); // 🚫 Prevenimos la recarga de la página
        currentPage = pageNumber; // 🔄 Actualizamos la página actual con el número seleccionado
        renderPage(currentPage); // 🖼️ Renderizamos los personajes correspondientes a esta página
    });

    return button; // 🔙 Retornamos el botón para integrarlo dinámicamente
};

// 🟢 **Resalta el botón de la página activa**
const updateActivePageButton = () => {
    document.querySelectorAll(".pagination-button").forEach((button) => {
        const isActive = parseInt(button.dataset.page) === currentPage; // 🎯 Verificamos si el botón corresponde a la página activa
        button.classList.toggle("active", isActive); // ✨ Agregamos o removemos la clase `active` según el estado
    });
};

/*********************** 🚀 Inicialización ***********************/

// 🏁 **Inicializa la aplicación**
const init = async () => {
    await fetchCharacters(); // 🌟 Llamamos a la función para obtener los datos de la API
};

init(); // 🏁 Ejecutamos la función inicial para configurar la aplicación

