import { celebrate, Joi } from 'celebrate';

export const validateGetAllRestaurants = celebrate({
  query: {
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    cuisine: Joi.string().optional(),
  },
});
