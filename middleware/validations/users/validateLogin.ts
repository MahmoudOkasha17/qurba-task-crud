import { celebrate, Joi } from 'celebrate';

export const validateLogin = celebrate({
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
});
