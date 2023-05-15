import joi from "joi";

const idSchema = joi.object({
  id: joi
    .string()
    .pattern(/^[0-9]+$/)
    .required(),
});

export default idSchema;
