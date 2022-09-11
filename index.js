import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import Joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { MongoClient } from "mongodb";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const signUpSchema = Joi.object({
    name: Joi.string().empty(" ").required(),
    email: Joi.string().email().required(),
    password: Joi.string().empty(" ").required()
});

const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().empty(" ").required()
});

const transactionSchema = Joi.object({
    date: Joi.string().required(),
    description: Joi.string().empty(" ").required(),
    value: Joi.number().required(),
    type: Joi.string().required() 
})

const mongoClient = new MongoClient("mongodb://localhost:27017");
let db;

mongoClient.connect().then(() => {
	db = mongoClient.db("testeFull");
});

app.post("/signup", async (req, res) => {

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
})

app.post("/signin", async (req, res) => {
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
    
})

app.post("/transactions", async (req, res) => {
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
})

app.get("/transactions", async (req, res) => {
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
})

app.delete("/logout", async (req, res) => {
    const token = req.headers.authorization.replace("Bearer ", "");

    try {
        await db.collection("sessions").deleteOne({token});
        return res.status(200).send("Sessão finalizada com sucesso!")
    } catch (error) {
        return (error.response.data);
    }
})

app.listen(5000, () => console.log("Listening at 5000"))