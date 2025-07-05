import dbConnect from '../models/db';
import Exam from '../models/Exam';

export async function seedExams() {
  await dbConnect();
  // Clear existing data - no demo data to seed
  await Exam.deleteMany({});
  console.log('Exams collection cleared!');
} 