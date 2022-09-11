import db from "../index.js";

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
    console.log(user);
    try {
        const transactions = await db.collection("transactions").find({userId: user._id}).toArray();
        if (transactions.length !== 0) {
            return res.send(transactions);
        }
            
    } catch (error) {
        return res.status(500).send("Favor tentar novamente mais tarde!");
    }
}