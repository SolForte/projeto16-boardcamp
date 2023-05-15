import joi from "joi";
import dayjs from "dayjs";

const customerSchema = joi.object({
  name: joi.string().required(),
  phone: joi
    .string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .max(11)
    .required(),
  cpf: joi
    .string()
    .pattern(/^[0-9]{11}$/)
    .length(11)
    .required(),
  birthday: joi.date().max(dayjs().format("YYYY-MM-DD")).required(),
});

export default customerSchema;
