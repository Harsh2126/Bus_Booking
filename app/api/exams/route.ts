import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../models/db';
import Exam from '../models/Exam';

// GET /api/exams
export async function GET() {
  await dbConnect();
  const exams = await Exam.find();
  return NextResponse.json({ exams });
}

// POST /api/exams
export async function POST(req: NextRequest) {
  await dbConnect();
  const { name, cities } = await req.json();
  const exam = await Exam.create({ name, cities });
  return NextResponse.json({ exam });
} 