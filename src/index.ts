import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './api/auth/auth.routes';
import userRouter from './api/user/user.routes';
import chatRouter from './api/chats/chat.routes';
import messageRouter from './api/messages/message.routes';

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cors());
const port: number = parseInt('3000');

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in environment variables');
}

export const config = {
  port: process.env.PORT || '3000',
  jwtSecret: process.env.JWT_SECRET, 
  databaseUrl: process.env.DATABASE_URL,
}

app.get('/', (req: Request, res: Response) => {
    res.send('¡Hola desde Express con TypeScript!');
  });

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`)
})