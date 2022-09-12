import db from "../db.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export async function createUser (req, res) {
    
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

    const {email, password} = req.body;

    try {
        const isUser = await db.collection("users").find({email}).toArray();
        
        if (isUser.length !== 0) {
            if (bcrypt.compareSync(password, isUser[0].encryptedPassword)) {
                const oldSession = await db.collection("sessions").findOne({userId: isUser[0]._id});
                if (oldSession) {
                    await db.collection("sessions").deleteOne({userId: isUser[0]._id});
                }

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