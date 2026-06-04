import { Router } from 'express';
import gamesRouter from '../modules/games/games.routes.js'; // Agregamos la ruta de games

const indexRouter = Router();

indexRouter.use("/games", gamesRouter); 

export default indexRouter;