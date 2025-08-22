import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).sort({ createdAt: -1 }).limit(50).lean();
    console.log(`Fetched ${users.length} users from database`);
    return NextResponse.json({ 
      users, 
      count: users.length,
      message: "Users fetched successfully" 
    });
  } catch (error) {
    console.error("Failed to fetch users", error);
    return NextResponse.json(
      { message: "Failed to fetch users", error: (error as Error).message }, 
      { status: 500 }
    );
  }
}

// Add a POST route for manual user creation (for testing)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { _id, name, email, image } = body;

    if (!_id || !name || !email) {
      return NextResponse.json(
        { message: "Missing required fields: _id, name, email" },
        { status: 400 }
      );
    }

    await connectDB();
    
    const existingUser = await User.findById(_id);
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists", user: existingUser },
        { status: 409 }
      );
    }

    const newUser = await User.create({ _id, name, email, image });
    console.log("Manual user creation successful:", newUser._id);
    
    return NextResponse.json({ 
      message: "User created successfully", 
      user: newUser 
    });
    
  } catch (error) {
    console.error("Failed to create user", error);
    return NextResponse.json(
      { message: "Failed to create user", error: (error as Error).message },
      { status: 500 }
    );
  }
}


