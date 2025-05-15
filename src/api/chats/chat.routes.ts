import { Router, RequestHandler } from "express";
import { createChatHandler, getMyChatsHandler, getChatByIdHandler, deleteChatHandler } from "./chat.controller";
import { authenticateJWT } from "../../middlewares/jwt.middleware";

const chatRouter = Router();

chatRouter.post("/", authenticateJWT, createChatHandler as RequestHandler);
chatRouter.get("/:userId", authenticateJWT, getMyChatsHandler as RequestHandler);
chatRouter.get("/:id", authenticateJWT, getChatByIdHandler as RequestHandler);
chatRouter.delete("/:id", authenticateJWT, deleteChatHandler as RequestHandler);

export default chatRouter;