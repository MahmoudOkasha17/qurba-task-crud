import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { User, UserModel } from '../../database/models/userModel';
import { signToken } from '../../utils/jwt';
import { getSimilarUsersAggregate } from '../../middleware/aggregation/getSimilarUsersAggregate';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const login = asyncHandler(async (req: any, res: any) => {
  const { email, password }: User = req.body;
  //find user by email
  const user: User = await UserModel.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      favoriteCuisines: user.favoriteCuisines,
      ownedRestaurants: user.ownedRestaurants,
      token: signToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});
// @desc    Register a new user
// @route   PUT /api/users/signup
// @access  Public
const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, favoriteCuisines }: User = req.body;
  //check if user exists
  const userExists: User = await UserModel.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  //create the user then return it
  const user = await UserModel.create({
    name,
    email,
    password,
    favoriteCuisines,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      favoriteCuisines: user.favoriteCuisines,
      ownedRestaurants: user.ownedRestaurants,
      token: signToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Update user
// @route   PATCH /api/users
// @access  Private
const update = asyncHandler(
  async (req: Request & { user: User }, res: Response) => {
    const { name, email, favoriteCuisines, password }: User = req.body;
    const user: User = req.user;
    //update user if changes are valid
    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.favoriteCuisines = favoriteCuisines || user.favoriteCuisines;
      user.password = password || user.password;

      const updatedUser = await user.save();
      //return the new user
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        favoriteCuisines: updatedUser.favoriteCuisines,
        ownedRestaurants: user.ownedRestaurants,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  }
);

// @desc    Get User by cuisine
// @route   GET /api/users/cuisine?cuisine
// @access  Private
const getUsersByCuisine = asyncHandler(
  async (req: Request & { user: User }, res: Response) => {
    const { page, limit, cuisine } = req.query;
    const similarUsersAggregation = getSimilarUsersAggregate({
      page: Number(page),
      limit: Number(limit),
      cuisine: String(cuisine),
    });
    const countAggregation = similarUsersAggregation.slice(0, -2);
    countAggregation.push({
      $count: 'count',
    });

    const [users, total] = await Promise.all([
      UserModel.aggregate(similarUsersAggregation),
      UserModel.aggregate(countAggregation),
    ]);

    res.status(200).json({
      users,
      total: total[0]?.count || 0,
      limit: Number(limit) || 10,
      page: Number(page) || 1,
      pages: Math.ceil(total[0]?.count / (Number(limit) || 10)) || 1,
    });
  }
);

export { login, register, update, getUsersByCuisine };
