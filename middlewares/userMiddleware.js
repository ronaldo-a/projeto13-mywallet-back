import Joi from "joi";
import db from "../db.js";

const signUpSchema = Joi.object({
    name: Joi.string().empty(" ").required(),
    email: Joi.string().email().required(),
    password: Joi.string().empty(" ").required()
});

const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().empty(" ").required()
});

async function validateNewUser (req, res, next) {
    const validation = signUpSchema.validate(req.body, { abortEarly: false});
    if (validation.error) {
        const message = validation.error.details.map((detail) => detail.message)
        return res.status(422).send(message);
    }

    const {email} = req.body;

    const isEmailUsed = await db.collection("users").findOne({email});
    if (isEmailUsed) {
        return res.status(422).send("Email já cadastrado!");
    } 

    next();
}

async function validateUser (req, res, next) {
    const validation = signInSchema.validate(req.body, {abortEarly: false});
    if (validation.error) {
        const message = validation.error.details.map((detail) => detail.message)
        return res.status(422).send(message);
    }

    next();
}

export {validateNewUser, validateUser};
