"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const restaurantsController_1 = require("../../controllers/restaurants/restaurantsController");
const authenticate_1 = require("../../middleware/authenticate");
const router = (0, express_1.Router)();
router.get('/findNear/:distance?', restaurantsController_1.findNear);
router.get('/:filter?', restaurantsController_1.getRestaurants);
router.get('/:id', restaurantsController_1.getRestaurantByIdOrUniqueName);
router.put('/create', authenticate_1.authenticate, restaurantsController_1.createRestaurant);
exports.default = router;
//# sourceMappingURL=index.js.map