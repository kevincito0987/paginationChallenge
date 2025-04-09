console.log("Hello World");
//Los datos de la API son almacenados en un objeto llamado `persons`
const url = "https://dattebayo-api.onrender.com/characters";

const getCharacters = async () => {
    const config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    const response = await fetch(url, config);
    const result = await response.json();
    return result;
};

console.log(await getCharacters());
const getFirstFourCharacters = async () => {
    const persons = await getCharacters();
    
    // Asegúrate de acceder al array correcto dentro de la respuesta
    const firstFour = persons.characters ? persons.characters.slice(0, 4) : [];
    
    return firstFour;
};

console.log(await getFirstFourCharacters());


const getFirstFourNames = async () => {
    try {
        const persons = await getCharacters();

        // Verifica que la API devuelva un array válido
        if (!Array.isArray(persons.characters)) {
            throw new Error("No se encontró un array de personajes en la respuesta de la API.");
        }

        return persons.characters.slice(0, 4).map(character => character.name);
    } catch (error) {
        console.error("Error obteniendo los nombres:", error);
        return [];
    }
};

let getNames = async () => {
    let names = await getFirstFourNames(); // Obtiene los primeros cuatro nombres de la API
    
    // Itera y asigna cada nombre a su respectivo ID
    for (let i = 0; i < names.length; i++) {
        let nameElement = document.getElementById(`personaje-${i + 1}`);
        if (nameElement) {
            nameElement.innerHTML = names[i] || "Nombre no disponible";
        }
    }
};

await getNames();

let getVillages = async () => {
    let characters = await getFirstFourCharacters(); // Obtiene los primeros cuatro personajes de la API

    for (let i = 0; i < characters.length; i++) {
        let villageElement = document.getElementById(`aldea-personaje${i + 1}`);
        
        if (villageElement) {
            let affiliations = characters[i].personal.affiliation;

            // Unimos todas las afiliaciones en un solo string separado por comas
            let formattedAffiliations = affiliations ? affiliations.join(", ") : "Desconocida";
            
            villageElement.innerHTML = `Aldeas donde estuvo: ${formattedAffiliations}`;
        }
    }
};

await getVillages();

let getClans = async () => {
    let characters = await getFirstFourCharacters(); // Obtiene los primeros cuatro personajes de la API

    for (let i = 0; i < characters.length; i++) {
        let clanElement = document.getElementById(`clan-personaje${i + 1}`);

        if (clanElement) {
            let clans = characters[i].personal.clan;

            // Aseguramos que `clans` sea un array antes de aplicar `.join()`
            let formattedClans = Array.isArray(clans) ? clans.join(", ") : (clans || "Desconocido");

            clanElement.innerHTML = `Clan: ${formattedClans}`;
        }
    }
};

await getClans();

let getAbilities = async () => {
    let characters = await getFirstFourCharacters(); // Obtiene los primeros cuatro personajes de la API

    for (let i = 0; i < characters.length; i++) {
        let abilitiesElement = document.getElementById(`habilidades-personaje${i + 1}`);

        if (abilitiesElement) {
            let abilities = characters[i].natureType;
            
            // Verificamos si `natureType` es un array antes de unir los valores
            let formattedAbilities = Array.isArray(abilities) ? abilities.join(", ") : (abilities || "No disponibles");

            abilitiesElement.innerHTML = `Habilidades: ${formattedAbilities}`;
        }
    }
};

await getAbilities();







