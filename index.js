import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { MongoClient } from "mongodb";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const mongoClient = new MongoClient("mongodb://localhost:27017");
let db;

mongoClient.connect().then(() => {
	db = mongoClient.db("testeFull");
});


app.post("/signup", async (req, res) => {
    const {name, email, password} = req.body;
    if (!name || !email || !password) {
        return res.status(422).send("Dados incompletos");
    }

    const encryptedPassword = bcrypt.hashSync(password, 10);

    try {
        await db.collection("users").insertOne({name, email, encryptedPassword});
        return res.status(201).send("Usuário criado com sucesso!");

    } catch (error) {
        return res.status(500).send("Favor tentar novamente mais tarde!");
    }  
})

app.post("/signin", async (req, res) => {
    const {email, password} = req.body;

    try {
        const isUser = await db.collection("users").find({email}).toArray();
        
        if (isUser.length !== 0) {
            if (bcrypt.compareSync(password, isUser[0].encryptedPassword)) {
                const token = uuid(); 
                await db.collection("sessions").insertOne({userId: isUser[0]._id, token});
                return res.status(200).send(token);
            }
        }

        return res.status(401).send("E-mail ou senha incorretos!");
    } catch (error) {
        return res.status(500).send("Favor tentar novamente mais tarde!");   
    }
    
})

app.post("/transactions", async (req, res) => {
    const {date, description, value, type} = req.body;
    //const { authorization } = req.header;

    if (!date && !description && !value && !type) {
        return res.status(422).send("Dados incompletos");
    }

    try {
        await db.collection("transactions").insertOne({date, description, value, type});
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
            const transactions = await db.collection("transactions").find().toArray();
            if (transactions.length !== 0) {
                return res.send(transactions);
            }
            
            return 
        }
    } catch (error) {
        console.log("deu erro");
    }
})

app.listen(5000, () => console.log("Listening at 5000"))