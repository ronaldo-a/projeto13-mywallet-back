import express from "express";

import { createUser, userLogin, userLogout } from "../controllers/userController.js";

const userRouter = express.Router();
userRouter.post("/signup", createUser);
userRouter.post("/signin", userLogin);
userRouter.delete("/logout", userLogout);

export default userRouter;