import { Router } from 'express';
import { registerUserHandler, loginUserHandler } from '../auth/auth.controller';

const authRouter = Router();

authRouter.post('/register', registerUserHandler);
authRouter.post('/login', loginUserHandler);

export default authRouter;