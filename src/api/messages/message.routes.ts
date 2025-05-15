import { RequestHandler, Router } from 'express';
import { createMessageHandler, getChatMessagesHandler, getUserMessagesHandler } from './message.controller';
import { authenticateJWT } from '../../middlewares/jwt.middleware';

const messageRouter = Router();

messageRouter.post("/", authenticateJWT, createMessageHandler as RequestHandler);
messageRouter.get("/:id", authenticateJWT, getChatMessagesHandler);
messageRouter.get("/user/:id", authenticateJWT, getUserMessagesHandler as RequestHandler);

export default messageRouter;