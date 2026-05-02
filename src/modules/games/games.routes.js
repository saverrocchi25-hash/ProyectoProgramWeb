import { Router } from 'express';
import gamesController from './games.controller.js';

const gamesRouter = Router();

gamesRouter.get("/", gamesController.getGames);
gamesRouter.get("/:idGame", gamesController.getGame);
gamesRouter.post("/", gamesController.addGame);
gamesRouter.put("/:idGame", gamesController.updateGame);
gamesRouter.delete("/:idGame", gamesController.deleteGame);

export default gamesRouter;