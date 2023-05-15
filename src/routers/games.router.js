import { Router } from "express";
import { getGames } from "../controllers/games.controllers.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import gameSchema from "../schemas/games.schema.js";

const gamesRouter = Router();

gamesRouter.get("/games", validateSchema(gameSchema), getGames);

export default gamesRouter;