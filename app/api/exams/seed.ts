import dbConnect from '../models/db';
import Exam from '../models/Exam';

export async function seedExams() {
  await dbConnect();
  const exams = [
    { name: 'NPTEL', cities: ['Delhi', 'Mumbai', 'Chennai', 'Kolkata'] },
    { name: 'GATE', cities: ['Bangalore', 'Hyderabad', 'Pune', 'Lucknow'] },
    { name: 'JEE', cities: ['Kanpur', 'Patna', 'Ahmedabad', 'Bhopal'] },
    { name: 'NEET', cities: ['Jaipur', 'Indore', 'Nagpur', 'Surat'] },
    // Add more exams/cities as needed
  ];
  await Exam.deleteMany({}); // Clear existing data
  await Exam.insertMany(exams);
  console.log('Exams seeded!');
} 