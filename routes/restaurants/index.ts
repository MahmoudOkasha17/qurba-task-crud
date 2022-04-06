import { Router } from 'express';
import {
  createRestaurant,
  getRestaurantByIdOrUniqueName,
  getAllRestaurants,
  findNearRestaurants,
} from '../../controllers/restaurants/restaurantsController';
import { authenticate } from '../../middleware/authenticate';
import { validateCreateRestaurant } from '../../middleware/validations/restaurants/validateCreateRestaurant';
import { validateFindNearRestaurants } from '../../middleware/validations/restaurants/validateFindNearRestaurants';
import { validateGetAllRestaurants } from '../../middleware/validations/restaurants/validateGetAllRestaurants';
import { validateGetRestaurantsById } from '../../middleware/validations/restaurants/validateGetRestaurantById';

const router = Router();

router.get('/', validateGetAllRestaurants, getAllRestaurants);
router.put('/', validateCreateRestaurant, authenticate, createRestaurant);
router.get('/findNear', validateFindNearRestaurants, findNearRestaurants);
router.get(
  '/restaurants/:id?',
  validateGetRestaurantsById,
  getRestaurantByIdOrUniqueName
);

export default router;
