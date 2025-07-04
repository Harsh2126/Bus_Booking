import { Schema, model, models } from 'mongoose';

const BookingSchema = new Schema({
  exam: { type: String, required: true },
  city: { type: String, required: true },
  date: { type: String, required: true },
  bus: { type: String, required: true },
  busNumber: { type: String },
  userId: { type: String, required: true },
  seatNumbers: { type: [String], required: true },
  routeFrom: { type: String },
  routeTo: { type: String },
  contactNumber: { type: String },
  timing: { type: String },
  upiScreenshot: { type: String },
  upiTxnId: { type: String },
  status: { type: String, default: 'confirmed' },
  createdAt: { type: Date, default: Date.now },
});

const Booking = models.Booking || model('Booking', BookingSchema);

export default Booking; 