import { Schema, model, models } from 'mongoose';

const ExamSchema = new Schema({
  name: { type: String, required: true, unique: true },
  cities: { type: [String], required: true },
});

const Exam = models.Exam || model('Exam', ExamSchema);

export default Exam; 