import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../models/db';
import Exam from '../../models/Exam';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  const update = await req.json();
  const exam = await Exam.findByIdAndUpdate(id, update, { new: true });
  return NextResponse.json({ exam });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  await Exam.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
} 