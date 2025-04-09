console.log("Hello World");

const url = "https://dattebayo-api.onrender.com/characters";
const charactersPerPage = 4;
let currentPage = 1;
let characters = [];

const getCharacters = async () => {
    const config = { method: "GET", headers: { "Content-Type": "application/json" } };
    const response = await fetch(url, config);
    const result = await response.json();
    console.log(result);
    characters = result.characters || [];
    renderPage(currentPage);
};

const renderPage = (page) => {
    const startIndex = (page - 1) * charactersPerPage;
    const endIndex = startIndex + charactersPerPage;
    const visibleCharacters = characters.slice(startIndex, endIndex);

    visibleCharacters.forEach((character, index) => {
        const cardIndex = index + 1;
        
        document.getElementById(`personaje-${cardIndex}`).textContent = character.name || "Nombre no disponible";
        document.getElementById(`aldea-personaje${cardIndex}`).textContent = `Aldeas donde estuvo: ${character.personal.affiliation?.join(", ") || "Desconocida"}`;
        document.getElementById(`clan-personaje${cardIndex}`).textContent = `Clan: ${character.personal.clan || "Desconocido"}`;
        document.getElementById(`habilidades-personaje${cardIndex}`).textContent = `Habilidades: ${character.natureType?.join(", ") || "No disponibles"}`;

        let imageElement = document.querySelectorAll(".card-image")[index];
        if (imageElement) {
            let images = character.images;
            let currentIndex = 0;
            
            imageElement.src = images?.[currentIndex] || "./assets/default-image.jpg";
            imageElement.alt = `Imagen de ${character.name || "Personaje desconocido"}`;

            imageElement.onclick = () => {
                currentIndex = currentIndex === 0 ? 1 : 0;
                imageElement.src = images?.[currentIndex] || "./assets/default-image.jpg";
            };
        }
    });
};

// 🚀 **Manejo de botones de paginación**
document.querySelector(".arrows:nth-child(1)").addEventListener("click", (event) => {
    event.preventDefault();
    if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
    }
});

document.querySelector(".arrows:nth-child(2)").addEventListener("click", (event) => {
    event.preventDefault();
    if (currentPage < Math.ceil(characters.length / charactersPerPage)) {
        currentPage++;
        renderPage(currentPage);
    }
});

getCharacters();
