import { PipelineStage } from 'mongoose';

export const getSimilarUsersAggregate = (filters: {
  page: number;
  limit: number;
  cuisine: string;
}): Array<PipelineStage> => {
  let pipeline = [];
  const { cuisine } = filters;
  const page = filters.page || 1;
  const limit = filters.limit || 10;

  // Lookup stage
  pipeline.push({
    $lookup: {
      from: 'restaurants',
      let: {
        ownedRestaurants: '$ownedRestaurants',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $in: ['$_id', '$$ownedRestaurants'],
            },
          },
        },
        {
          $project: {
            _id: 0,
            name: 1,
            cuisine: 1,
            location: {
              type: 1,
              coordinates: 1,
            },
          },
        },
      ],
      as: 'ownedRestaurants',
    },
  });

  // Filteration stage (here by cuisine) (can be abstracted to a function)
  pipeline.push({
    $match: {
      $or: [
        {
          'ownedRestaurants.cuisine': cuisine,
        },
        {
          favoriteCuisines: {
            $in: [cuisine],
          },
        },
      ],
    },
  });

  // Projection stage, filter owned restaurants to only include restaurants with the cuisine
  pipeline.push({
    $project: {
      _id: 0,
      name: 1,
      email: 1,
      favoriteCuisines: 1,
      ownedRestaurants: {
        $filter: {
          input: '$ownedRestaurants',
          as: 'ownedRestaurant',
          cond: {
            $eq: ['$$ownedRestaurant.cuisine', cuisine],
          },
        },
      },
    },
  });

  // Pagination stage
  pipeline.push(
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    }
  );

  return pipeline;
};
