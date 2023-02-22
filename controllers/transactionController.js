import db from "../db.js";
import { ObjectId } from "mongodb";

export async function createTransaction (req, res) {

    const {date, description, value, type} = req.body;
    if (!date || !description || !value || !type) {
        return res.status(422).send("Dados incompletos");
    }
    
    const user = res.locals.user;
    
    try {
        await db.collection("transactions").insertOne({date, description, value, type, userId: user._id});
        return res.status(201).send("Transação adicionada com sucesso!");

    } catch (error) {
        return res.status(500).send("Favor tentar novamente mais tarde!");
    }   
}

export async function getTransactions (req, res) {

    const user = res.locals.user;
    try {
        const transactions = await db.collection("transactions").find({userId: user._id}).toArray();
        return res.status(200).send(transactions);       
    } catch (error) {
        return res.status(500).send("Favor tentar novamente mais tarde!");
    }
}

export async function deleteTransaction (req, res) {
    const {id} = req.params
    try {
        await db.collection("transactions").deleteOne({_id: new ObjectId(id)});
        return res.sendStatus(200);
    } catch (error) {
        console.log(error)
        return res.status(500).send("Favor tentar novamente mais tarde!");
    }
}