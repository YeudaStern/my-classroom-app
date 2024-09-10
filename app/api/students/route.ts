import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from 'mongodb';

// Helper function to handle errors
function handleError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// GET students and arrangements
export async function GET(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const students = await db.collection('students').find({ userId }).toArray();
    const arrangements = await db.collection('arrangements').find({ userId }).toArray();
    
    return NextResponse.json({ students, arrangements });
  } catch (error) {
    console.error('Error in GET operation:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

// POST a new student
export async function POST(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await req.json();

    if (!body.userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const newStudent = {
      _id: new ObjectId(),
      userId: body.userId,
      ...body
    };

    const result = await db.collection('students').insertOne(newStudent);
    const insertedStudent = await db.collection('students').findOne({ _id: result.insertedId });
    return NextResponse.json(insertedStudent, { status: 201 });
  } catch (error) {
    console.error('Error in POST operation:', error);
    return NextResponse.json({ error: 'Failed to add student', details: handleError(error) }, { status: 500 });
  }
}

// DELETE a student
export async function DELETE(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const id = req.nextUrl.searchParams.get('_id');
    const userId = req.nextUrl.searchParams.get('userId');

    if (!id || !userId) {
      return NextResponse.json({ error: 'Student ID and User ID are required' }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const objectId = new ObjectId(id);

    const result = await db.collection('students').deleteOne({ _id: objectId, userId });

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: 'Student deleted successfully' });
    } else {
      return NextResponse.json({ message: 'Student not found or does not belong to the user' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error in DELETE operation:', error);
    return NextResponse.json({ error: 'Failed to delete student', details: handleError(error) }, { status: 500 });
  }
}