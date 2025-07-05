import Bus from '../models/Bus';
import dbConnect from '../models/db';

export async function seedBuses() {
  await dbConnect();
  // Clear existing data - no demo data to seed
  await Bus.deleteMany({});
  console.log('Buses collection cleared!');
} 