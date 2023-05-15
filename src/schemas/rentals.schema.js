import joi from "joi"

const rentalSchema = joi.object({
    customerId: joi.number().positive().min(1).integer().required(),
    gameId: joi.number().positive().min(1).integer().required(),
    daysRented: joi.number().positive().min(1).integer().required(),
});

export default rentalSchema