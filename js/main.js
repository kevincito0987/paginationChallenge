console.log("Hello World"); // Mensaje inicial para verificar que el script se está ejecutando correctamente

// 📌 URL de la API que contiene los datos de los personajes
const url = "https://dattebayo-api.onrender.com/characters";

// 📌 Número de personajes mostrados por página
const charactersPerPage = 4;

// 📌 Variables para manejar el estado de la paginación
let currentPage = 1; // Página actual
let characters = []; // Array donde almacenaremos los personajes obtenidos de la API

// 🚀 **Función para obtener los personajes de la API**
const getCharacters = async () => {
    const config = { 
        method: "GET", // Método GET para obtener datos
        headers: { "Content-Type": "application/json" } // Se especifica que queremos recibir JSON
    };

    const response = await fetch(url, config); // Se hace la petición a la API
    const result = await response.json(); // Se convierte la respuesta en un objeto JSON
    console.log(result); // Se imprime el resultado en la consola para revisar los datos obtenidos

    characters = result.characters || []; // Se almacena el array de personajes, o un array vacío si no hay datos
    renderPage(currentPage); // Se renderiza la página inicial con los primeros personajes
};

// 🚀 **Función para renderizar la página actual con los personajes correspondientes**
const renderPage = (page) => {
    // 📌 Calculamos los índices de los personajes que deben mostrarse en esta página
    const startIndex = (page - 1) * charactersPerPage; // Índice de inicio basado en la página actual
    const endIndex = startIndex + charactersPerPage; // Índice de fin basado en la cantidad de personajes por página
    const visibleCharacters = characters.slice(startIndex, endIndex); // Extraemos solo los personajes de esta página

    // 📌 Recorremos los personajes visibles y los asignamos a las tarjetas
    visibleCharacters.forEach((character, index) => {
        const cardIndex = index + 1; // Se establece el número de tarjeta correspondiente

        // Se asignan los datos a los elementos HTML correspondientes
        document.getElementById(`personaje-${cardIndex}`).textContent = character.name || "Nombre no disponible";
        document.getElementById(`aldea-personaje${cardIndex}`).textContent = `Aldeas donde estuvo: ${character.personal.affiliation?.join(", ") || "Desconocida"}`;
        document.getElementById(`clan-personaje${cardIndex}`).textContent = `Clan: ${character.personal.clan || "Desconocido"}`;
        document.getElementById(`habilidades-personaje${cardIndex}`).textContent = `Habilidades: ${character.natureType?.join(", ") || "No disponibles"}`;

        // 📌 Manejo de imágenes
        let imageElement = document.querySelectorAll(".card-image")[index]; // Selecciona la imagen de la tarjeta actual
        if (imageElement) {
            let images = character.images; // Obtiene las imágenes del personaje
            let currentIndex = 0; // Se establece el índice inicial de la imagen
            
            // 📌 Se asigna la primera imagen del personaje o una imagen por defecto
            imageElement.src = images?.[currentIndex] || "./assets/default-image.jpg";
            imageElement.alt = `Imagen de ${character.name || "Personaje desconocido"}`;

            // 📌 Alternar imágenes al hacer clic
            imageElement.onclick = () => {
                currentIndex = currentIndex === 0 ? 1 : 0; // Alterna entre `images[0]` y `images[1]`
                imageElement.src = images?.[currentIndex] || "./assets/default-image.jpg"; // Cambia la imagen
            };
        }
    });
};

// 🚀 **Manejo de botones de paginación**
document.querySelector(".arrows:nth-child(1)").addEventListener("click", (event) => {
    event.preventDefault(); // 📌 Evita la recarga de la página al hacer clic
    if (currentPage > 1) { // 📌 Verifica que no estamos en la primera página
        currentPage--; // 📌 Reduce el número de página
        renderPage(currentPage); // 📌 Actualiza la vista con los personajes de la nueva página
    }
});

document.querySelector(".arrows:nth-child(2)").addEventListener("click", (event) => {
    event.preventDefault(); // 📌 Evita la recarga de la página al hacer clic
    if (currentPage < Math.ceil(characters.length / charactersPerPage)) { // 📌 Verifica que no estamos en la última página
        currentPage++; // 📌 Aumenta el número de página
        renderPage(currentPage); // 📌 Actualiza la vista con los personajes de la nueva página
    }
});

// 🚀 **Inicialización del script**
getCharacters(); // 📌 Se ejecuta la función para obtener y mostrar los personajes al cargar la página
