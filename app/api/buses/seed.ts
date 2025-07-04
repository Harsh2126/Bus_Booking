import Bus from '../models/Bus';
import dbConnect from '../models/db';

export async function seedBuses() {
  await dbConnect();
  const buses = [
    {
      name: 'jdnwbdk',
      number: 'BUS123',
      capacity: 40,
      type: 'AC',
      status: 'active',
      exams: [],
      routeFrom: 'orai',
      routeTo: 'kanpur',
      date: '2025-07-05',
      contactNumber: '9876543210',
      timing: '10:00 AM'
    },
    {
      name: 'cityexpress',
      number: 'BUS456',
      capacity: 30,
      type: 'Non-AC',
      status: 'active',
      exams: [],
      routeFrom: 'delhi',
      routeTo: 'lucknow',
      date: '2025-07-06',
      contactNumber: '9123456789',
      timing: '2:00 PM'
    }
  ];
  await Bus.deleteMany({}); // Clear existing data
  await Bus.insertMany(buses);
  console.log('Buses seeded!');
} 