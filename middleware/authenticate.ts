import passport from 'passport';
import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';
import { User } from '../database/models/userModel';

export const authenticate = asyncHandler(
  async (req: Request & { user: User }, res: Response, next: NextFunction) => {
    passport.authenticate(
      'jwt',
      { session: false },
      (err: any, user: any, info: any) => {
        if (!user || err) {
          throw new Error('Authentication failed');
        } else {
          req.user = user;
          next();
        }
      }
    )(req, res, next);
  }
);
