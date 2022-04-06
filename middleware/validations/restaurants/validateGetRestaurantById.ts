import { celebrate, Joi } from 'celebrate';

export const validateGetRestaurantsById = celebrate({
  params: {
    id: Joi.string().required(),
  },
});
