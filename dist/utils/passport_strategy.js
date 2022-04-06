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
exports.initializePassport = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_1 = __importDefault(require("passport"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userModel_1 = require("../database/models/userModel");
// import dotenv from 'dotenv';
// dotenv.config();
const options = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};
const initializePassport = (app) => {
    passport_1.default.use(new passport_jwt_1.Strategy(options, (0, express_async_handler_1.default)((jwt_payload, done) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield userModel_1.UserModel.findById(jwt_payload.id);
        if (user) {
            return done(null, user);
        }
        else {
            throw new Error('Token verification failed.');
        }
    }))));
    app.use(passport_1.default.initialize());
};
exports.initializePassport = initializePassport;
//# sourceMappingURL=passport_strategy.js.map