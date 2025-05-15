import { Request, Response, NextFunction } from 'express';
import { MessageService } from './message.service';

const messageService = new MessageService();

export const createMessageHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { text, chatId } = req.body;
    const userId = req.user?.id;

    if (!userId || !chatId || !text) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const message = await messageService.createMessage({ text, userId, chatId });
    res.status(201).json({ status: 'success', data: message });
  } catch (error) {
    next(error);
  }
};

export const getChatMessagesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;
    const messages = await messageService.getMessagesByChat(chatId);
    res.status(200).json({ status: 'success', data: messages });
  } catch (error) {
    next(error);
  }

  
};

export const getUserMessagesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(403).json({ message: 'Usuario no autenticado' });
    }

    const messages = await messageService.getMessagesByUser(userId);
    res.status(200).json({ status: 'success', data: messages });
  } catch (error) {
    next(error);
  }
};