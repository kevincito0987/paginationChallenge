console.log("Hello World"); // 📝 Verificación de ejecución del script, útil para pruebas iniciales

// 🌎 URL de la API donde obtenemos los datos de los personajes
const API_URL = "https://dattebayo-api.onrender.com/characters";

// 🎯 Configuración de paginación: cuántos personajes mostramos por página
const CHARACTERS_PER_PAGE = 4;

// 📌 Variables globales para el estado de la aplicación
let currentPage = 1; // Página actual de la galería
let characters = []; // Array donde guardamos los personajes obtenidos de la API

// 🚀 **Función para obtener los personajes desde la API**
const fetchCharacters = async () => {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: { "Content-Type": "application/json" } // Indicamos que queremos recibir JSON
        });

        if (!response.ok) throw new Error("Error al obtener los datos de la API");

        const data = await response.json();
        characters = data.characters || []; // Si la API no devuelve datos, asignamos un array vacío
        renderPage(currentPage); // Renderizamos la primera página con los personajes obtenidos
    } catch (error) {
        console.error("❌ Error:", error); // Muestra errores si la API falla
    }
};

// 📌 **Función para renderizar los personajes de la página actual**
const renderPage = (page) => {
    // 🏗 Calculamos qué personajes deben mostrarse en esta página
    const startIndex = (page - 1) * CHARACTERS_PER_PAGE;
    const endIndex = startIndex + CHARACTERS_PER_PAGE;
    const visibleCharacters = characters.slice(startIndex, endIndex); // Extraemos los personajes de esta página

    // 🔄 Iteramos sobre los personajes visibles y los asignamos a las tarjetas
    visibleCharacters.forEach((character, index) => {
        updateCardContent(character, index + 1); // Actualiza la info textual de la tarjeta
        updateCardImage(character, index); // Maneja la imagen de la tarjeta
    });
};

// 📝 **Actualiza la información textual de cada tarjeta**
const updateCardContent = (character, cardIndex) => {
    document.getElementById(`personaje-${cardIndex}`).textContent = character.name || "Nombre no disponible";
    document.getElementById(`aldea-personaje${cardIndex}`).textContent = `Aldeas donde estuvo: ${character.personal.affiliation?.join(", ") || "Desconocida"}`;
    document.getElementById(`clan-personaje${cardIndex}`).textContent = `Clan: ${character.personal.clan || "Desconocido"}`;
    document.getElementById(`habilidades-personaje${cardIndex}`).textContent = `Habilidades: ${character.natureType?.join(", ") || "No disponibles"}`;
};

// 🎨 **Manejo de imágenes en cada tarjeta**
const updateCardImage = (character, index) => {
    const imageElement = document.querySelectorAll(".card-image")[index];
    if (!imageElement) return; // 🛑 Si no hay imagen en la tarjeta, no ejecutamos nada

    let images = character.images || ["./assets/default-image.jpg"]; // 🖼 Si no hay imágenes en la API, usamos una predeterminada
    let currentIndex = 0; // 🔄 Índice para alternar entre imágenes

    imageElement.src = images[currentIndex];
    imageElement.alt = `Imagen de ${character.name || "Personaje desconocido"}`;

    // 🎭 **Alterna imágenes al hacer clic en ellas**
    imageElement.addEventListener("click", () => {
        currentIndex = currentIndex === 0 ? 1 : 0; // Cambia entre `images[0]` y `images[1]`
        imageElement.src = images[currentIndex] || "./assets/default-image.jpg";
    });
};

// 🔄 **Configuración de botones de paginación**
const setupPagination = () => {
    document.querySelector(".arrows:nth-child(1)").addEventListener("click", (event) => {
        event.preventDefault(); // 🚫 Evita la recarga de la página
        if (currentPage > 1) { // ⏪ Solo permite retroceder si no estamos en la primera página
            currentPage--;
            renderPage(currentPage);
        }
    });

    document.querySelector(".arrows:nth-child(2)").addEventListener("click", (event) => {
        event.preventDefault(); // 🚫 Evita la recarga de la página
        if (currentPage < Math.ceil(characters.length / CHARACTERS_PER_PAGE)) { // ⏩ Solo avanza si no estamos en la última página
            currentPage++;
            renderPage(currentPage);
        }
    });
};

// 🚀 **Inicialización de la aplicación**
const init = () => {
    fetchCharacters(); // Obtiene los personajes y carga la primera página
    setupPagination(); // Configura la funcionalidad de los botones "Anterior" y "Siguiente"
};

init(); // 🏁 Arranque del script