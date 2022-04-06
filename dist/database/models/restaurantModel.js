"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantModel = void 0;
const mongoose_1 = require("mongoose");
const location = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ['Point', 'Polygon'],
        required: true,
    },
    coordinates: {
        type: [Number],
        required: true,
    },
});
const restaurantSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    uniqueName: {
        type: String,
        required: true,
        unique: true,
    },
    cuisine: {
        type: String,
        required: true,
    },
    location: location,
}, {
    timestamps: true,
});
const RestaurantModel = (0, mongoose_1.model)('Restaurant', restaurantSchema);
exports.RestaurantModel = RestaurantModel;
//# sourceMappingURL=restaurantModel.js.map