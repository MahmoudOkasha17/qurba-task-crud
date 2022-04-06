import { Router } from 'express';
import {
  login,
  register,
  update,
} from '../../controllers/users/usersController';
import { authenticate } from '../../middleware/authenticate';

const router = Router();

router.post('/login', login);
router.put('/signup', register);
router.patch('/update', authenticate, update);

export default router;
