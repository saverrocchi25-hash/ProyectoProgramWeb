import { Router } from 'express';
import gamesRouter from '../modules/games/games.routes.js'; // Agregamos la ruta de games

const indexRouter = Router();

indexRouter.use("/games", gamesRouter); // Agregamos el endpoint base de games

export default indexRouter;