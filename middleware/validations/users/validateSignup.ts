import { celebrate, Joi } from 'celebrate';

export const validateSignup = celebrate({
  body: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    favoriteCuisines: Joi.array().items(Joi.string()).optional(),
  },
});
