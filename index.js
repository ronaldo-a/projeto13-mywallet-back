import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express();
app.use(express.json());
app.use(cors());
///HAHAHAHA
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

    try {
        await db.collection("users").insertOne({name, email, password});
        return res.status(201).send("Usuário criado com sucesso!");

    } catch (error) {
        return res.status(500).send("Favor tentar novamente mais tarde!");
    }  
})

app.post("/signin", (req, res) => {
    const {email, password} = req.body;
    
    const isUser = users.find((user) => user.email === email);
    if (isUser) {
        if (isUser.password === password) {
           return res.status(200).send("Usuário logado com sucesso!");
        } 
    }

    return res.status(401).send("E-mail ou senha incorretos!");
})

app.post("/transactions", async (req, res) => {
    const {date, description, value, type} = req.body;

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
    try {
        const transactions = await db.collection("transactions").find().toArray();
        res.send(transactions);
        return
    } catch (error) {
        console.log("deu erro");
        return
    }
})

app.listen(5000, () => console.log("Listening at 5000"))