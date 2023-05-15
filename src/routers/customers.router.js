import { Router } from "express";
import { getCustomers } from "../controllers/customers.controllers.js";

const customersRouter = Router();

customersRouter.get("/games", getCustomers)

export default customersRouter;
