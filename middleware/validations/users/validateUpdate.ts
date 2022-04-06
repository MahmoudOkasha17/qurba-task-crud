import { celebrate, Joi } from 'celebrate';

export const validateUpdate = celebrate({
  body: {
    email: Joi.string().email().optional(),
    name: Joi.string().optional(),
    favoriteCuisines: Joi.array().items(Joi.string()).optional(),
    password: Joi.string().optional().max(20),
  },
});
