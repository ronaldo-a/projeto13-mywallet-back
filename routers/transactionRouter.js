import express from "express";
import { createTransaction, getTransactions } from "../controllers/transactionController.js";
import validateNewTransaction from "../middlewares/transactionMiddleware.js";
import validateToken from "../middlewares/tokenMiddleware.js";

const transactionRouter = express.Router();
transactionRouter.post("/transactions", validateToken, validateNewTransaction, createTransaction);
transactionRouter.get("/transactions", validateToken, getTransactions);

export default transactionRouter;