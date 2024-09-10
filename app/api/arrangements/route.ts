import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET all arrangements
export async function GET() {
    try {
        const { db } = await connectToDatabase();
        const arrangements = await db.collection("arrangements").find({}).toArray();
        return NextResponse.json(arrangements);
    } catch (error) {
        console.error("Error fetching arrangements:", error);
        return NextResponse.json({ error: "Failed to fetch arrangements" }, { status: 500 });
    }
}

// POST a new arrangement
export async function POST(request: Request) {
    try {
        const { db } = await connectToDatabase();
        const arrangement = await request.json();
        const result = await db.collection("arrangements").insertOne(arrangement);
        const newArrangement = await db.collection("arrangements").findOne({ _id: result.insertedId });
        return NextResponse.json(newArrangement);
    } catch (error) {
        console.error("Error adding arrangement:", error);
        return NextResponse.json({ error: "Failed to add arrangement" }, { status: 500 });
    }
}
