import { Schema, Document, model } from 'mongoose';

interface Location extends Document {
  type: string;
  coordinates: number[];
}

interface Restaurant extends Document {
  id: string;
  user: Schema.Types.ObjectId;
  name: string;
  uniqueName: string;
  cuisine: Array<string>;
  location: Location;
}

const location = new Schema({
  type: {
    type: String,
    enum: ['Point', 'Polygon'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const restaurantSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    uniqueName: {
      type: String,
      required: true,
      unique: true,
    },
    cuisine: {
      type: String,
      required: true,
    },

    location: location,
  },
  {
    timestamps: true,
  }
);

const RestaurantModel = model('Restaurant', restaurantSchema);
export { Restaurant, RestaurantModel };
