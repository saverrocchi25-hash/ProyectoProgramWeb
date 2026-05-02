import gamesService from './games.service.js';

const gamesController = {};

gamesController.getGames = (req, res) => {
    const games = gamesService.getGames();
    res.status(200).send({
        games: games
    });
}

gamesController.getGame = (req, res) => {
    const idGame = req.params.idGame;
    const game = gamesService.getGame(idGame);
    
    if (game) {
        res.status(200).send({ game: game });
    } else {
        res.status(404).send({ msg: "Juego no encontrado" });
    }
}

gamesController.addGame = (req, res) => {
    const name = req.body.name;
    const minPlayers = req.body.minPlayers;
    const maxPlayers = req.body.maxPlayers;
    const duration = req.body.duration;
    const acquisitionDate = req.body.acquisitionDate;
    const status = req.body.status;

    const game = gamesService.addGame(name, minPlayers, maxPlayers, duration, acquisitionDate, status);

    res.status(201).send({
        msg: "Done :)",
        game: game
    });
}

gamesController.updateGame = (req, res) => {
    const idGame = req.params.idGame;
    const updatedGame = gamesService.updateGame(idGame, req.body);

    if (updatedGame) {
        res.status(200).send({
            msg: "Juego actualizado",
            game: updatedGame
        });
    } else {
        res.status(404).send({ msg: "Juego no encontrado" });
    }
}

gamesController.deleteGame = (req, res) => {
    const idGame = req.params.idGame;
    const deletedGame = gamesService.deleteGame(idGame);

    if (deletedGame) {
        res.status(200).send({
            msg: "Juego eliminado",
            game: deletedGame
        });
    } else {
        res.status(404).send({ msg: "Juego no encontrado" });
    }
}

export default gamesController;