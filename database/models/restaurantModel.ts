import { Schema, Document, model } from 'mongoose';
import getSlug from 'speakingurl';

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
      unique: true,
    },
    cuisine: {
      type: String,
      required: true,
    },
    location: {
      type: location,
      required: false,
      default: {
        type: 'Point',
        coordinates: [0, 0],
      },
    },
  },
  {
    timestamps: true,
  }
);
restaurantSchema.index({ location: '2dsphere' });

restaurantSchema.pre('save', function setUniqueName(next) {
  this.uniqueName = getSlug(`${this.name}-${this.user}`, {
    uric: false,
  });

  next();
});

const RestaurantModel = model('Restaurant', restaurantSchema);
export { Location, Restaurant, RestaurantModel };
