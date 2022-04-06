import { Router } from 'express';
import {
  login,
  register,
  update,
  getUsersByCuisine,
} from '../../controllers/users/usersController';
import { authenticate } from '../../middleware/authenticate';
import { validateGetUsersByCuisine } from '../../middleware/validations/users/validateGetUsersByCuisine';
import { validateLogin } from '../../middleware/validations/users/validateLogin';
import { validateSignup } from '../../middleware/validations/users/validateSignup';
import { validateUpdate } from '../../middleware/validations/users/validateUpdate';

const router = Router();

router.post('/login', validateLogin, login);
router.put('/signup', validateSignup, register);
router.patch('/update', validateUpdate, authenticate, update);
router.get(
  '/cuisines',
  validateGetUsersByCuisine,
  authenticate,
  getUsersByCuisine
);

export default router;
