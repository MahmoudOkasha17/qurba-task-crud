import jwt from 'jsonwebtoken';
import { User } from '../database/models/userModel';

export const signToken = (user: User) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
