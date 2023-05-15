import {Router} from "express";
import gamesRouter from "./games.router.js";
import customersRouter from "./customers.router.js";

const routers = Router();
routers.use(gamesRouter);
routers.use(customersRouter);

export default routers;