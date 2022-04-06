import { Router } from 'express';
import usersRouter from './users';
import restaurantsRouter from './restaurants';

const router = Router();

router.use('/users', usersRouter);
router.use('/restaurants', restaurantsRouter);

export default router;
