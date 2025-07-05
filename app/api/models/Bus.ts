import { model, models, Schema } from 'mongoose';
import './Exam';

const BusSchema = new Schema({
  name: { type: String, required: true },
  number: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true, default: 'active' },
  exams: [{ type: Schema.Types.ObjectId, ref: 'Exam' }],
  routeFrom: { type: String, required: true },
  routeTo: { type: String, required: true },
  date: { type: String, required: true },
  contactNumber: { type: String },
  timing: { type: String },
  price: { type: Number, required: true, default: 0 },
});

const Bus = models.Bus || model('Bus', BusSchema);

export default Bus; 