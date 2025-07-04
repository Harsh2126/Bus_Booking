import { Schema, model, models } from 'mongoose';

const CitySchema = new Schema({
  name: { type: String, required: true, unique: true },
  state: { type: String },
  country: { type: String },
});

const City = models.City || model('City', CitySchema);

export default City; 