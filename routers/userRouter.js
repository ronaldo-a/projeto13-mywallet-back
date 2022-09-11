import express from "express";

import { createUser, userLogin, userLogout } from "../controllers/userController.js";
import { validateNewUser, validateUser } from "../middlewares/userMiddleware.js";

const userRouter = express.Router();
userRouter.post("/signup", validateNewUser, createUser);
userRouter.post("/signin", validateUser, userLogin);
userRouter.delete("/logout", userLogout);

export default userRouter;