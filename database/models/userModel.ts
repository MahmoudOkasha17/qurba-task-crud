import { Schema, Document, model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { NextFunction } from 'express';

interface User extends Document {
  id: string;
  name: string;
  email: string;
  favoriteCuisines?: Array<string>;
  ownedRestaurants?: Array<string>;
  password: string;
  matchPassword: (pw: string) => Promise<boolean>;
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    favoriteCuisines: [
      {
        type: String,
        trim: true,
        default: [],
      },
    ],
    ownedRestaurants: [
      {
        type: Schema.Types.ObjectId,
        trim: true,
        default: [],
      },
    ],
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next: NextFunction) {
  if (!this.isModified('password')) {
    next();
  }
  //incase password was modified rehash it
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const UserModel = model('User', userSchema);
export { User, UserModel };
