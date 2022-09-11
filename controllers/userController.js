import db from "../index.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import Joi from "joi";

const signUpSchema = Joi.object({
    name: Joi.string().empty(" ").required(),
    email: Joi.string().email().required(),
    password: Joi.string().empty(" ").required()
});

const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().empty(" ").required()
});

export async function createUser (req, res) {

    const validation = signUpSchema.validate(req.body, { abortEarly: false});
    if (validation.error) {
        const message = validation.error.details.map((detail) => detail.message)
        return res.status(422).send(message);
    }
    
    const {name, email, password} = req.body;

    const encryptedPassword = bcrypt.hashSync(password, 10);

    try {
        await db.collection("users").insertOne({name, email, encryptedPassword});
        return res.status(201).send("Usuário criado com sucesso!");

    } catch (error) {
        return res.status(500).send("Favor tentar novamente mais tarde!");
    }  
}

export async function userLogin (req, res) {
    const validation = signInSchema.validate(req.body, {abortEarly: false});
    if (validation.error) {
        const message = validation.error.details.map((detail) => detail.message)
        return res.status(422).send(message);
    }

    const {email, password} = req.body;

    try {
        const isUser = await db.collection("users").find({email}).toArray();
        
        if (isUser.length !== 0) {
            if (bcrypt.compareSync(password, isUser[0].encryptedPassword)) {
                const token = uuid();
                const userName = isUser[0].name 
                await db.collection("sessions").insertOne({userId: isUser[0]._id, token});
                return res.status(200).send({token, userName});
            }
        }

        return res.status(401).send("E-mail ou senha incorretos!");
    } catch (error) {
        return res.status(500).send("Favor tentar novamente mais tarde!");   
    }  
}

export async function userLogout (req, res) {
    const token = req.headers.authorization.replace("Bearer ", "");

    try {
        await db.collection("sessions").deleteOne({token});
        return res.status(200).send("Sessão finalizada com sucesso!")
    } catch (error) {
        return (error.response.data);
    }
}