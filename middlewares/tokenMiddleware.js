import db from "../db.js";

async function validateToken (req, res, next) {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).send("Usuário não autenticado!");
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

    res.locals.user = user;

    next();
}

export default validateToken;