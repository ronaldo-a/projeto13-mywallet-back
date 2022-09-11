import db from "../index.js";
import Joi from "joi";

const transactionSchema = Joi.object({
    date: Joi.string().required(),
    description: Joi.string().empty(" ").required(),
    value: Joi.number().required(),
    type: Joi.string().required() 
})

export async function createTransaction (req, res) {

    const validation = transactionSchema.validate(req.body, {abortEarly: false})
    if (validation.error) {
        const message = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(message);
    }

    const {date, description, value, type} = req.body;
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).send("Usuário não autenticado!");
    }

    if (!date || !description || !value || !type) {
        return res.status(422).send("Dados incompletos");
    }

    let user;
    try {
        const session = await db.collection("sessions").findOne({token});
        if (!session) {
            return res.status(401).send("Favor logar novamente!");
        }
        
        user = await db.collection("users").findOne({_id: session.userId});
        if (!user) {
            return res.status(401).send("Favor logar novamente!");
        }
    } catch (error) {
        return res.send(error.response.data);
    }

    
    try {
        await db.collection("transactions").insertOne({date, description, value, type, userId: user._id});
        return res.status(201).send("Transação adicionada com sucesso!");

    } catch (error) {
        return res.status(500).send("Favor tentar novamente mais tarde!");
    }   
}

export async function getTransactions (req, res) {

    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).send("Acesso não permitido.");
    }

    const session = await db.collection("sessions").findOne({token});
    if (!session) {
        return res.status(401).send("Acesso não permitido.");
    }

    const user = await db.collection("users").findOne({_id: session.userId});

    try {
        if (user) {
            const transactions = await db.collection("transactions").find({userId: user._id}).toArray();
            if (transactions.length !== 0) {
                return res.send(transactions);
            }
            
            return 
        }
    } catch (error) {
        console.log("deu erro");
    }
}