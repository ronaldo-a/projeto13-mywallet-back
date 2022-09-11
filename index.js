import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

import { createUser, userLogin, userLogout } from "./controllers/userController.js";
import { createTransaction, getTransactions } from "./controllers/transactionController.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

try {
    await mongoClient.connect();
    db = mongoClient.db("testeFull");
} catch (error) {
    console.log(error.response.data);
}

export default db;

app.post("/signup", createUser);

app.post("/signin", userLogin);

app.post("/transactions", createTransaction);

app.get("/transactions", getTransactions);

app.delete("/logout", userLogout);

app.listen(5000, () => console.log("Listening at 5000"))