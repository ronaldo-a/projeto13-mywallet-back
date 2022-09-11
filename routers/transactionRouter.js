import express from "express";
import { createTransaction, getTransactions } from "../controllers/transactionController.js";

const transactionRouter = express.Router();
transactionRouter.post("/transactions", createTransaction);
transactionRouter.get("/transactions", getTransactions);

export default transactionRouter;