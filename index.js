import express from "express";
import cors from "cors";
import indexRouter from "./routers/indexRouter.js"

const app = express();
app.use(express.json());
app.use(cors());

app.use(indexRouter);

app.listen(process.env.PORT, () => console.log(`Listening at ${process.env.PORT}`));