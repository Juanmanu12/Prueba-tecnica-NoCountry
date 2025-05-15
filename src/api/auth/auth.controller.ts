import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AuthService, RegisterUserInput, LoginUserInput } from './auth.service';

const authService = new AuthService();

export const registerUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const userInput: RegisterUserInput = req.body;
    if (!userInput.email || !userInput.password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await authService.register(userInput);
    res.status(201).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error: any) {
    if (error.message.includes('already exists')) {
    res.status(409).json({ message: error.message });
    return; 
    }
    next(error);
  }
};

export const loginUserHandler: RequestHandler= async (req, res, next) => {
  try {
    const userInput: LoginUserInput = req.body;
    if (!userInput.email || !userInput.password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const result = await authService.login(userInput);

    if (!result) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};