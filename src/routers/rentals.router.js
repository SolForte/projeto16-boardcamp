import { Router } from "express";
import { getRentals, postRentals, returnRentals } from "../controllers/rentals.controllers.js";
import rentalSchema from "../schemas/rentals.schema.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", validateSchema(rentalSchema), postRentals);
rentalsRouter.post("/rentals/:id/return", returnRentals);

export default rentalsRouter;
