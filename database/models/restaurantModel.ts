import { Schema, Document, model } from 'mongoose';

interface Location extends Document {
  type: 'Point' | 'Polygon';
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
restaurantSchema.index({ location: '2dsphere' });
const RestaurantModel = model('Restaurant', restaurantSchema);
export { Location, Restaurant, RestaurantModel };
