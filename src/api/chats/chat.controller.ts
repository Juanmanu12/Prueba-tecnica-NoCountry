import { Request, Response, NextFunction } from 'express';
import { ChatService, CreateChatInput } from './chat.service';
import { ChatType } from '../../generated/prisma';

const chatService = new ChatService();


export const createChatHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, type, membersId, otherParticipantId } = req.body;
    const creatorId = req.user?.id;

    if (!creatorId) {
      return res.status(403).json({ message: 'User not authenticated' });
    }
    if (!type || !Object.values(ChatType).includes(type as ChatType)) {
        return res.status(400).json({ message: 'Valid chat type is required' });
    }
    if (type === ChatType.ONE_TO_ONE && !otherParticipantId) {
        return res.status(400).json({ message: 'otherParticipantId is required for ONE_TO_ONE chat type' });
    }
    if ((type === ChatType.GROUP || type === ChatType.SUBGROUP) && !name) {
        return res.status(400).json({ message: 'Chat name is required for GROUP or SUBGROUP chat types' });
    }


    const chatInput: CreateChatInput = {
      name,
      type: type as ChatType,
      creatorId,
      membersId,
      otherParticipantId,
    };

    const chat = await chatService.createChat(chatInput);
    res.status(201).json({ status: 'success', data: chat });
  } catch (error: any) {
    if (error.message.includes('required for')) {
        return res.status(400).json({message: error.message});
    }
    next(error);
  }
};

export const getMyChatsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(403).json({ message: 'User not authenticated' });
    }
    const chats = await chatService.getChatByUserId(userId);
    res.status(200).json({ status: 'success', results: chats.length, data: chats });
  } catch (error) {
    next(error);
  }
};

export const getChatByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { chatId } = req.params;

    if (!userId) {
      return res.status(403).json({ message: 'User not authenticated' });
    }

    const chat = await chatService.getChatById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const isMember = chat.members.some((member: { id: string }) => member.id === userId);
    if (!isMember && chat.creatorId !== userId) {
        return res.status(403).json({ message: 'User not authorized to view this chat' });
    }

    res.status(200).json({ status: 'success', data: chat });
  } catch (error) {
    next(error);
  }
};


export const deleteChatHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(403).json({ message: 'User not authenticated' });
    }

    await chatService.deleteChat(chatId, userId);
    res.status(204).send(); 
  } catch (error: any) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('not authorized')) {
      return res.status(403).json({ message: error.message });
    }
    next(error);
  }
};