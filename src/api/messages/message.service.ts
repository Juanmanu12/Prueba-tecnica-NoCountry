import prisma from '../../db/prisma';
import { Message } from '../../generated/prisma';

export interface CreateMessageInput {
  text: string;
  userId: string;
  chatId: string;
}

export class MessageService {
  public async createMessage(data: { text: string; userId: string; chatId: string }) {
    try{
     const newMessage = await prisma.message.create({
      data: {
        text: data.text,
        user: { connect: { id: data.userId } },
        chat: { connect: { id: data.userId } },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        chat: { select: { id: true, name: true } },
      },
    });
    return newMessage;
    } catch(error) {
        console.error("Error creating message:", error);
        throw error;
    };
    
  }

  public async getMessagesByChat(chatId: string): Promise<Message[]> {
    return prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  public async getMessagesByUser(userId: string): Promise<Message[]> {
    return prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      include: {
        chat: { select: { id: true, name: true } }, 
      },
    });
  }
}