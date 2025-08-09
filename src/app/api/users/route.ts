import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).sort({ createdAt: -1 }).limit(50).lean();
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Failed to fetch users", error);
    return NextResponse.json({ message: "Failed to fetch users" }, { status: 500 });
  }
}


