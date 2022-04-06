import { Router } from 'express';
import {
  createRestaurant,
  getRestaurantByIdOrUniqueName,
  getRestaurants,
} from '../../controllers/restaurants/restaurantsController';
import { authenticate } from '../../middleware/authenticate';

const router = Router();

router.get('/:filter?', getRestaurants);

router.get('/:id', getRestaurantByIdOrUniqueName);

router.put('/create', authenticate, createRestaurant);

export default router;
