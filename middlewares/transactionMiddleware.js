import Joi from "joi";

const transactionSchema = Joi.object({
    date: Joi.string().required(),
    description: Joi.string().empty(" ").required(),
    value: Joi.number().required(),
    type: Joi.string().required() 
});

async function validateNewTransaction (req, res, next) {
    const validation = transactionSchema.validate(req.body, {abortEarly: false})
    if (validation.error) {
        const message = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(message);
    }

    next();
}

export default validateNewTransaction;
