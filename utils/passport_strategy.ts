import { ExtractJwt, Strategy } from 'passport-jwt';
import passport from 'passport';
import asyncHandler from 'express-async-handler';
import { UserModel } from '../database/models/userModel';
import { Application } from 'express';
// import dotenv from 'dotenv';
// dotenv.config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

export const initializePassport = (app: Application) => {
  passport.use(
    new Strategy(
      options,
      asyncHandler(async (jwt_payload: any, done: any) => {
        const user = await UserModel.findById(jwt_payload.id);
        if (user) {
          return done(null, user);
        } else {
          throw new Error('Token verification failed.');
        }
      })
    )
  );
  app.use(passport.initialize());
};
