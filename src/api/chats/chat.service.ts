import prisma from '../../db/prisma'
import type { User, Chat, ChatType} from '../../generated/prisma'

export interface CreateChatInput {
    name: string;
    creatorId: string;
    type: ChatType
    membersId?: string[];
    otherParticipantId?: string; 
}

export type ChatWithRelations = Chat & {
    members: Pick<User, 'id' | 'name' | 'email'>[];
    creator: Pick<User, 'id' | 'name' | 'email'>;
}

export class ChatService {
    public async createChat(data: CreateChatInput): Promise<Chat> {
        const { name, creatorId, type, membersId = [], otherParticipantId } = data;

        let chatName = name;
        const initialMemberIds = new Set<string>([creatorId]);

        if(type === 'ONE_TO_ONE') {
            if(!otherParticipantId) {
                throw new Error(`otherParticipantId es necesario para chats ONE_TO_ONE`);
            }
            initialMemberIds.add(otherParticipantId);
        }

        if(!name) {
            const user1 = await prisma.user.findUnique({ where: { id: creatorId }, select: { name: true, email: true } });
            const user2 = await prisma.user.findUnique({ where: { id: otherParticipantId }, select: { name: true, email: true } })
            chatName = `Chat entre ${user1?.name || user1?.email} y ${user2?.name || user2?.email}`;
        } else {
            if (!name) {
                throw new Error('Nombre del chat es requerido para chats grupales o subgrupales')
            }
            membersId.forEach(id => initialMemberIds.add(id));
        }

        const chat = await prisma.chat.create({
            data: {
                name: chatName,
                type,
                creatorId,
                members: {
                    connect: Array.from(initialMemberIds).map(id => ({id})),
                },
            },
            include: {
                members: { select: {id: true, name: true, email: true } },
                creator: { select: { id: true, name: true, email: true } },
            }
        });
        return chat;
    }

    public async getChatById(chatId: string): Promise<ChatWithRelations | null> {
        return prisma.chat.findUnique({
            where: {id: chatId},
            include: {
                members: { select: { id: true, name: true, email: true }},
                creator: { select: { id: true, name: true, email: true }},
            }
        })
    }

    public async getChatByUserId(userId: string): Promise<ChatWithRelations[]> {
        const chats = await prisma.chat.findMany({
            where: { 
                members: {
                    some: {
                        id: userId,
                    },
                },
            },
            include: {
                members: {
                    select: { id: true, name: true, email: true },
                },
                creator: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: {
                updatedAt: 'desc'
            },
        });
        return chats;
    }

    public async deleteChat(chatId: string, userId: string): Promise<Chat> {
        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
        });

        if(!chat) {
            throw new Error('No se ha encontrado el chat')
        }

        if(chat.creatorId !== userId) {
            throw new Error('No está autorizado a eliminar el chat')
        }

        return prisma.chat.delete({
            where: { id: chatId }
        })

    }
}