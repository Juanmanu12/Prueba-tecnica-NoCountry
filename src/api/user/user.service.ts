import { emitWarning } from 'process'
import prisma from '../../db/prisma'
import type { User } from '../../generated/prisma'

export class UserService {
    public async getAllUsers(): Promise<Omit<User, 'password'>[]> {
        const users = await prisma.user.findMany({
            id: true,
            email: true,
            name: true,
            type: true,
            role: true,
            createdAt: true,
            updatedAt: true
        });
        return users;
    }
 }

