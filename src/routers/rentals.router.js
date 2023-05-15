import { Router } from "express";
import {
  deleteRentals,
  getRentals,
  postRentals,
  returnRentals,
} from "../controllers/rentals.controllers.js";
import rentalSchema from "../schemas/rentals.schema.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import validateId from "../middlewares/validateId.middleware.js";
import idSchema from "../schemas/id.schema.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", validateSchema(rentalSchema), postRentals);
rentalsRouter.post("/rentals/:id/return", validateId(idSchema), returnRentals);
rentalsRouter.delete("/rentals/:id", validateId(idSchema), deleteRentals);

export default rentalsRouter;
