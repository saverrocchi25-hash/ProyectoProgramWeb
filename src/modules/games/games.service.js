const gamesService = {};

let games = [];
let counterID = 1;

gamesService.getGames = () => {
    return games;
}

gamesService.getGame = (id) => {
    for (let game of games) {
        if (game.id === Number(id)) return game;
    }
    return null;
}

gamesService.addGame = (name, minPlayers, maxPlayers, duration, acquisitionDate, status) => {
    const newGame = {
        id: counterID,
        name: name,
        minPlayers: minPlayers,
        maxPlayers: maxPlayers,
        duration: duration,
        acquisitionDate: acquisitionDate,
        status: status
    }
    counterID++;
    games.push(newGame);
    return newGame;
}

gamesService.updateGame = (id, dataToUpdate) => {
    for (let i = 0; i < games.length; i++) {
        if (games[i].id === Number(id)) {
            // Actualiza manteniendo lo que no se modificó
            games[i] = { ...games[i], ...dataToUpdate };
            return games[i];
        }
    }
    return null;
}

gamesService.deleteGame = (id) => {
    for (let i = 0; i < games.length; i++) {
        if (games[i].id === Number(id)) {
            const deletedGame = games.splice(i, 1);
            return deletedGame[0];
        }
    }
    return null;
}

export default gamesService;