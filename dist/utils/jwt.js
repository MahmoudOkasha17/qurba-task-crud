"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signToken = (user) => jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
});
exports.signToken = signToken;
//# sourceMappingURL=jwt.js.map