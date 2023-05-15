import { Router } from "express";
import { getGames, postGames } from "../controllers/games.controllers.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import gameSchema from "../schemas/games.schema.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", validateSchema(gameSchema), postGames);

export default gamesRouter;
