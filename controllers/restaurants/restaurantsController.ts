import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import {
  Restaurant,
  RestaurantModel,
} from '../../database/models/restaurantModel';
import { User } from '../../database/models/userModel';

// @desc    Create Restaurant
// @route   PUT /api/restaurants/create
// @access  Private
const createRestaurant = asyncHandler(
  async (req: Request & { user: User }, res: Response) => {
    const { name, uniqueName, cuisine, location }: Restaurant = req.body;
    const user = req.user;
    // create restaurant
    const restaurant: Restaurant = await RestaurantModel.create({
      name,
      uniqueName,
      cuisine,
      location,
      user: user._id,
    });
    // add restaurant id to user if created succesfully then return it
    if (restaurant) {
      user.ownedRestaurants.push(restaurant._id);
      await user.save();

      res.status(201).json({
        _id: restaurant._id,
        name: restaurant.name,
        uniqueName: restaurant.uniqueName,
        cuisine: restaurant.cuisine,
        location: restaurant.location,
        user: restaurant.user,
      });
    } else {
      res.status(404);
      throw new Error('Invalid restaurant data');
    }
  }
);

// @desc    Get Restaurant by id
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantByIdOrUniqueName = asyncHandler(
  async (req: Request, res: Response) => {
    let restaurant: Restaurant | any[];
    //check if id is valid
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      restaurant = await RestaurantModel.findById(req.params.id);
    } else {
      //if not valid id, try to find by uniqueName
      restaurant = await RestaurantModel.find({
        uniqueName: req.params.id,
      });
    }
    //return if found
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404);
      throw new Error('restaurant not found');
    }
  }
);

// @desc    Get all Restaurants or filter by cuisine
// @route   GET /api/restaurants/:filter?
// @access  Public
const getRestaurants = asyncHandler(async (req: Request, res: Response) => {
  const restaurants: Restaurant[] = await RestaurantModel.find(
    req.params.filter ? { cuisine: req.params.filter } : {}
  );
  res.json(restaurants);
});

export { createRestaurant, getRestaurantByIdOrUniqueName, getRestaurants };
