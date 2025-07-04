import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../models/db';
import Exam from '../../models/Exam';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const update = await req.json();
  const exam = await Exam.findByIdAndUpdate(params.id, update, { new: true });
  return NextResponse.json({ exam });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  await Exam.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
} 