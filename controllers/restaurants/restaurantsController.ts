import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import {
  Location,
  Restaurant,
  RestaurantModel,
} from '../../database/models/restaurantModel';
import { User } from '../../database/models/userModel';

// @desc    Create Restaurant
// @route   PUT /api/restaurants
// @access  Private
const createRestaurant = asyncHandler(
  async (req: Request & { user: User }, res: Response) => {
    const { name, cuisine, location }: Restaurant = req.body;
    const user = req.user;
    // create restaurant
    const restaurant: Restaurant = await RestaurantModel.create({
      name,
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
    let restaurant: Restaurant;

    //check if id is valid
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      restaurant = await RestaurantModel.findById(req.params.id);
    } else {
      //if not valid id, try to find by uniqueName
      restaurant = await RestaurantModel.findOne({
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
// @route   GET /api/restaurants?cuisine
// @access  Public
const getAllRestaurants = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, cuisine } = req.query;
  const query = cuisine ? { cuisine: cuisine } : {};

  const total = await RestaurantModel.countDocuments(query);
  const restaurants: Restaurant[] = await RestaurantModel.find(query)
    .limit(Number(limit) || 10)
    .skip(Number(limit) || 10 * (Number(page) || 1 - 1));

  res.json({
    restaurants,
    total: total,
    limit: Number(limit) || 10,
    page: Number(page) || 1,
    pages: Math.ceil(total / (Number(limit) || 10)) || 1,
  });
});

// @desc    Get all Restaurants near specific location
// @route   GET /api/restaurants/findNear
// @access  Public
const findNearRestaurants = asyncHandler(
  async (req: Request, res: Response) => {
    const { type, coordinates }: Location = req.body;
    const { page, limit } = req.query;

    const pipeline: any = [
      {
        $geoNear: {
          near: {
            type: type,
            coordinates: coordinates,
          },
          distanceField: 'distance',
          maxDistance: 1000,
          spherical: true,
        },
      },
    ];

    const [restaurants, total] = await Promise.all([
      RestaurantModel.aggregate([
        ...pipeline,
        {
          $skip: (Number(page) || 1 - 1) * (Number(limit) || 10),
        },
        {
          $limit: Number(limit) || 10,
        },
      ]),
      RestaurantModel.aggregate([
        ...pipeline,
        {
          $count: 'count',
        },
      ]),
    ]);

    res.json({
      restaurants,
      total: total[0]?.count,
      limit: Number(limit) || 10,
      page: Number(page) || 1,
      pages: Math.ceil(total[0]?.count / (Number(limit) || 10)) || 1,
    });
  }
);

export {
  createRestaurant,
  getRestaurantByIdOrUniqueName,
  getAllRestaurants,
  findNearRestaurants,
};
