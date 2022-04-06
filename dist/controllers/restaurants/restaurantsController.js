"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNear = exports.getRestaurants = exports.getRestaurantByIdOrUniqueName = exports.createRestaurant = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const mongoose_1 = __importDefault(require("mongoose"));
const restaurantModel_1 = require("../../database/models/restaurantModel");
// @desc    Create Restaurant
// @route   PUT /api/restaurants/create
// @access  Private
const createRestaurant = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, uniqueName, cuisine, location } = req.body;
    const user = req.user;
    // create restaurant
    const restaurant = yield restaurantModel_1.RestaurantModel.create({
        name,
        uniqueName,
        cuisine,
        location,
        user: user._id,
    });
    // add restaurant id to user if created succesfully then return it
    if (restaurant) {
        user.ownedRestaurants.push(restaurant._id);
        yield user.save();
        res.status(201).json({
            _id: restaurant._id,
            name: restaurant.name,
            uniqueName: restaurant.uniqueName,
            cuisine: restaurant.cuisine,
            location: restaurant.location,
            user: restaurant.user,
        });
    }
    else {
        res.status(404);
        throw new Error('Invalid restaurant data');
    }
}));
exports.createRestaurant = createRestaurant;
// @desc    Get Restaurant by id
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantByIdOrUniqueName = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let restaurant;
    //check if id is valid
    if (mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        restaurant = yield restaurantModel_1.RestaurantModel.findById(req.params.id);
    }
    else {
        //if not valid id, try to find by uniqueName
        restaurant = yield restaurantModel_1.RestaurantModel.find({
            uniqueName: req.params.id,
        });
    }
    //return if found
    if (restaurant) {
        res.json(restaurant);
    }
    else {
        res.status(404);
        throw new Error('restaurant not found');
    }
}));
exports.getRestaurantByIdOrUniqueName = getRestaurantByIdOrUniqueName;
// @desc    Get all Restaurants or filter by cuisine
// @route   GET /api/restaurants/:filter?
// @access  Public
const getRestaurants = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurants = yield restaurantModel_1.RestaurantModel.find(req.params.filter ? { cuisine: req.params.filter } : {});
    res.json(restaurants);
}));
exports.getRestaurants = getRestaurants;
// @desc    Get all Restaurants near specific location
// @route   GET /api/restaurants/find/:distance?
// @access  Public
const findNear = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, coordinates } = req.body;
    const restaurants = yield restaurantModel_1.RestaurantModel.find({
        location: {
            $nearSphere: {
                $geometry: { type: type, coordinates: coordinates },
                $maxDistance: req.params.distance ? req.params.distance : 1000,
            },
        },
    });
    res.json(restaurants);
}));
exports.findNear = findNear;
//# sourceMappingURL=restaurantsController.js.map