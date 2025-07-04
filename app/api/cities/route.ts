import { NextRequest, NextResponse } from 'next/server';
import City from '../models/City';
import dbConnect from '../models/db';

export async function GET() {
  await dbConnect();
  const cities = await City.find();
  const mappedCities = cities.map(city => ({
    id: city._id.toString(),
    name: city.name,
    state: city.state,
    country: city.country,
  }));
  return NextResponse.json({ cities: mappedCities });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const { name, state, country } = await req.json();
  const city = await City.create({ name, state, country });
  return NextResponse.json({ city: { id: city._id.toString(), name: city.name, state: city.state, country: city.country } });
} 