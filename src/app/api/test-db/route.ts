import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ message: "Database is connected" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Database connection failed" }, { status: 500 });
  }
}
