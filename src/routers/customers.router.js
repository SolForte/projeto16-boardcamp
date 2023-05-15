import { Router } from "express";
import {
  getCustomers,
  postCustomers,
} from "../controllers/customers.controllers.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import customerSchema from "../schemas/customer.schema.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.post(
  "/customers",
  validateSchema(customerSchema),
  postCustomers
);

export default customersRouter;
