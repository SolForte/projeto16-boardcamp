import { Router } from "express";
import gamesRouter from "./games.router.js";
import customersRouter from "./customers.router.js";
import rentalsRouter from "./rentals.router.js";

const routers = Router();
routers.use(gamesRouter);
routers.use(customersRouter);
routers.use(rentalsRouter);

export default routers;
