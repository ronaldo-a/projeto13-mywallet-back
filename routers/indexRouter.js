import express from "express";
import transactionRouter from "./transactionRouter.js";
import userRouter from "./userRouter.js";

const indexRouter = express.Router();
indexRouter.use(transactionRouter);
indexRouter.use(userRouter);

export default indexRouter;