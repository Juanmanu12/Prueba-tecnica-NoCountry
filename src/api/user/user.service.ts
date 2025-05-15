import { emitWarning } from 'process'
import prisma from '../../db/prisma'
import type { User } from '../../generated/prisma'

export class UserService {
    public async getAllUsers(): Promise<Omit<User, 'password'>[]> {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                type: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return users;
    }

    public async getUserById(id: string): Promise<Omit<User, 'password'> | null > {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                type: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        return user;
    }
 }

