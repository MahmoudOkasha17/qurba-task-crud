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
exports.update = exports.register = exports.login = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userModel_1 = require("../../database/models/userModel");
const jwt_1 = require("../../utils/jwt");
// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const login = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    //find user by email
    const user = yield userModel_1.UserModel.findOne({ email });
    if (user && (yield user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            favoriteCuisines: user.favoriteCuisines,
            ownedRestaurants: user.ownedRestaurants,
            token: (0, jwt_1.signToken)(user._id),
        });
    }
    else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
}));
exports.login = login;
// @desc    Register a new user
// @route   PUT /api/users/signup
// @access  Public
const register = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    //check if user exists
    const userExists = yield userModel_1.UserModel.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    //create the user then return it
    const user = yield userModel_1.UserModel.create({
        name,
        email,
        password,
    });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            favoriteCuisines: user.favoriteCuisines,
            ownedRestaurants: user.ownedRestaurants,
            token: (0, jwt_1.signToken)(user._id),
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid user data');
    }
}));
exports.register = register;
// @desc    Update user
// @route   PATCH /api/users
// @access  Private
const update = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, favoriteCuisines, password } = req.body;
    const user = req.user;
    //update user if changes are valid
    if (user) {
        user.name = name || user.name;
        user.email = email || user.email;
        user.favoriteCuisines = favoriteCuisines || user.favoriteCuisines;
        user.password = password || user.password;
        const updatedUser = yield user.save();
        //return the new user
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            favoriteCuisines: updatedUser.favoriteCuisines,
            ownedRestaurants: user.ownedRestaurants,
        });
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
}));
exports.update = update;
//# sourceMappingURL=usersController.js.map