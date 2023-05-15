import { Router } from "express";
import {
  getCustomers,
  postCustomers,
  getCustomersById,
} from "../controllers/customers.controllers.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import validateId from "../middlewares/validateId.middleware.js";
import customerSchema from "../schemas/customer.schema.js";
import idSchema from "../schemas/id.schema.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.post(
  "/customers",
  validateSchema(customerSchema),
  postCustomers
);
customersRouter.get("/customers/:id", validateId(idSchema), getCustomersById);

export default customersRouter;
