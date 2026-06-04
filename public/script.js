// Configuración de la API - CAMBIA ESTO A TU SERVIDOR LOCAL
const apiURL = "http://localhost:3000/api/games";

// Referencias al DOM
const gamesTbody = document.getElementById("games-tbody");
const gamesForm = document.getElementById("game-form");
const gameIdInput = document.getElementById("game-id");
const gameNameInput = document.getElementById("name");
const gameMinPlayersInput = document.getElementById("minPlayers");
const gameMaxPlayersInput = document.getElementById("maxPlayers");
const gameDurationInput = document.getElementById("duration");
const gameAcquisitionDateInput = document.getElementById("acquisitionDate");
const gameStatusInput = document.getElementById("status");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");

let gamesData = [];
let editingMode = false;

// Cargar juegos al iniciar la página
document.addEventListener('DOMContentLoaded', fetchGames);

/**
 * READ - Obtiene todos los juegos del servidor
 */
async function fetchGames() {
    try {
        const resp = await fetch(apiURL);
        if (!resp.ok) throw new Error("Error al obtener los juegos");

        const data = await resp.json();
        gamesData = data.games;
        renderTable();
    } catch (error) {
        console.error("Error en fetchGames:", error);
        alert("Error al cargar los juegos");
    }
}

/**
 * READ ESPECÍFICO - Obtiene un juego por su ID
 */
async function fetchGameById(gameId) {
    try {
        const resp = await fetch(`${apiURL}/${gameId}`);
        if (!resp.ok) throw new Error("Juego no encontrado");

        const data = await resp.json();
        return data.game;
    } catch (error) {
        console.error("Error en fetchGameById:", error);
        alert("Error al obtener el juego");
        return null;
    }
}

/**
 * Renderiza la tabla de juegos con las acciones de editar y eliminar
 */
function renderTable() {
    gamesTbody.innerHTML = "";
    
    gamesData.forEach(game => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${game.id}</td>
            <td>${game.name}</td>
            <td>${game.minPlayers}</td>
            <td>${game.maxPlayers}</td>
            <td>${game.duration}</td>
            <td>${game.acquisitionDate}</td>
            <td>${game.status}</td>
            <td class="action-buttons">
                <button type="button" class="btn-edit" data-id="${game.id}">Editar</button>
                <button type="button" class="btn-delete" data-id="${game.id}">Eliminar</button>
            </td>
        `;

        gamesTbody.appendChild(tr);
    });

    // Agregar event listeners a los botones de editar y eliminar
    document.querySelectorAll(".btn-edit").forEach(btn => {
        btn.addEventListener("click", handleEdit);
    });

    document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", handleDelete);
    });
}

/**
 * CREATE - Maneja el envío del formulario (crear o actualizar)
 */
gamesForm.addEventListener("submit", async (element) => {
    element.preventDefault();

    const id = gameIdInput.value;
    const gameData = {
        name: gameNameInput.value,
        minPlayers: parseInt(gameMinPlayersInput.value),
        maxPlayers: parseInt(gameMaxPlayersInput.value),
        duration: parseInt(gameDurationInput.value),
        acquisitionDate: gameAcquisitionDateInput.value,
        status: gameStatusInput.value
    };

    try {
        if (!id) {
            // CREATE - Nuevo juego
            await createGame(gameData);
        } else {
            // UPDATE - Actualizar juego existente
            await updateGame(id, gameData);
        }
    } catch (error) {
        console.error("Error en el envío del formulario:", error);
    }
});

/**
 * CREATE - Crear un nuevo juego
 */
async function createGame(gameData) {
    try {
        const resp = await fetch(apiURL, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameData)
        });

        if (!resp.ok) throw new Error("Error al crear el juego");

        const responseData = await resp.json();
        const newGame = responseData.game;
        gamesData.push(newGame);
        
        resetForm();
        renderTable();
        alert("Juego creado exitosamente");
    } catch (error) {
        console.error("Error en createGame:", error);
        alert("Error al crear el juego");
    }
}

/**
 * UPDATE - Actualizar un juego existente
 */
async function updateGame(gameId, gameData) {
    try {
        const resp = await fetch(`${apiURL}/${gameId}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameData)
        });

        if (!resp.ok) throw new Error("Error al actualizar el juego");

        const responseData = await resp.json();
        const updatedGame = responseData.game;

        // Actualizar en la lista local
        const gameIndex = gamesData.findIndex(g => g.id === parseInt(gameId));
        if (gameIndex !== -1) {
            gamesData[gameIndex] = updatedGame;
        }

        resetForm();
        renderTable();
        alert("Juego actualizado exitosamente");
    } catch (error) {
        console.error("Error en updateGame:", error);
        alert("Error al actualizar el juego");
    }
}

/**
 * DELETE - Eliminar un juego
 */
async function deleteGame(gameId) {
    if (!confirm("¿Está seguro de que desea eliminar este juego?")) {
        return;
    }

    try {
        const resp = await fetch(`${apiURL}/${gameId}`, {
            method: "DELETE"
        });

        if (!resp.ok) throw new Error("Error al eliminar el juego");

        // Eliminar de la lista local
        gamesData = gamesData.filter(g => g.id !== parseInt(gameId));
        
        renderTable();
        alert("Juego eliminado exitosamente");
    } catch (error) {
        console.error("Error en deleteGame:", error);
        alert("Error al eliminar el juego");
    }
}

/**
 * Maneja el evento de editar juego
 */
function handleEdit(event) {
    const gameId = parseInt(event.target.dataset.id);
    const game = gamesData.find(g => g.id === gameId);

    if (game) {
        gameIdInput.value = game.id;
        gameNameInput.value = game.name;
        gameMinPlayersInput.value = game.minPlayers;
        gameMaxPlayersInput.value = game.maxPlayers;
        gameDurationInput.value = game.duration;
        gameAcquisitionDateInput.value = game.acquisitionDate;
        gameStatusInput.value = game.status;
        submitBtn.textContent = "Actualizar Juego";
        cancelBtn.classList.remove("hidden");
        editingMode = true;
        gameNameInput.focus();
    }
}

/**
 * Maneja el evento de eliminar juego
 */
function handleDelete(event) {
    const gameId = parseInt(event.target.dataset.id);
    deleteGame(gameId);
}

/**
 * Cancela la edición y resetea el formulario
 */
cancelBtn.addEventListener("click", resetForm);

/**
 * Resetea el formulario a su estado inicial
 */
function resetForm() {
    gamesForm.reset();
    gameIdInput.value = "";
    submitBtn.textContent = "Guardar Juego";
    cancelBtn.classList.add("hidden");  // ← ASEGÚRATE QUE ESTÉ ESTA LÍNEA
    editingMode = false;

    /**
 * BÚSQUEDA ESPECÍFICA - Obtener un juego por ID desde la página
 */
const searchBtn = document.getElementById("search-btn");
const searchIdInput = document.getElementById("search-id");
const searchResult = document.getElementById("search-result");

searchBtn.addEventListener("click", handleSearch);
searchIdInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        handleSearch();
    }
});

async function handleSearch() {
    const gameId = parseInt(searchIdInput.value);

    if (!gameId || gameId < 1) {
        searchResult.innerHTML = '<p style="color: red;">Por favor ingresa un ID válido</p>';
        return;
    }

    try {
        const resp = await fetch(`${apiURL}/${gameId}`);
        
        if (!resp.ok) {
            searchResult.innerHTML = '<p style="color: red;">Juego no encontrado</p>';
            return;
        }

        const data = await resp.json();
        const game = data.game;

        searchResult.innerHTML = `
            <div style="padding: 1rem; background-color: #f0f0f0; border-radius: 4px; margin-top: 1rem;">
                <h3 style="margin-top: 0;">Resultado de búsqueda:</h3>
                <p><strong>ID:</strong> ${game.id}</p>
                <p><strong>Nombre:</strong> ${game.name}</p>
                <p><strong>Mín Jugadores:</strong> ${game.minPlayers}</p>
                <p><strong>Máx Jugadores:</strong> ${game.maxPlayers}</p>
                <p><strong>Duración:</strong> ${game.duration} minutos</p>
                <p><strong>Fecha Adquisición:</strong> ${game.acquisitionDate}</p>
                <p><strong>Estado:</strong> ${game.status}</p>
            </div>
        `;
    } catch (error) {
        console.error("Error en búsqueda:", error);
        searchResult.innerHTML = '<p style="color: red;">Error al buscar el juego</p>';
    }
}
}