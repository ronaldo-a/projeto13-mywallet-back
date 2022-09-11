import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import indexRouter from "./routers/indexRouter.js"

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

try {
    await mongoClient.connect();
    db = mongoClient.db("testeFull");
} catch (error) {
    console.log(error.response.data);
}

const app = express();
app.use(express.json());
app.use(cors());

app.use(indexRouter);

export default db;

app.listen(5000, () => console.log("Listening at 5000"))