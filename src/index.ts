import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './api/auth/auth.routes';

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

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`)
})