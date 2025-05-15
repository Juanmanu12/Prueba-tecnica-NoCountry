import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../db/prisma';
import { PrismaClient, User } from '../../generated/prisma';
import { config } from '../../index';


export interface RegisterUserInput {
  email: string;
  password: string;
  name: string;
  type: 'USER' | 'ADMIN'; 
  role: 'FULLSTACK' |
  'FRONTEND'        |
  'BACKEND'         |
  'UXUI'            |
  'QA'              |
  'PM'              |
  'DATASCIENCE'     |
  'DATAANALYST';
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export class AuthService {
  public async register(data: RegisterUserInput): Promise<Omit<User, 'password'>> {
    const { email, password, name, role, type } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        type: type || 'USER'
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  public async login(
    data: LoginUserInput
  ): Promise<{ user: Omit<User, 'password'>; token: string } | null> {
    const { email, password } = data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return null; 
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null; 
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwtSecret || 'fallback-secret',
      { expiresIn: '1h' } 
    );

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
}