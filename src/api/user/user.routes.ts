import { getAllUsersHandler, getUserByIdHandler } from "./user.controller";
import { RequestHandler, Router } from "express";

const userRouter = Router();

userRouter.get("/", getAllUsersHandler as RequestHandler);
userRouter.get("/:id", getUserByIdHandler as RequestHandler);

export default userRouter;