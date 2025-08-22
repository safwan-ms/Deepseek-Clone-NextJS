import { NextResponse, type NextRequest } from "next/server";
import connectDB from "@/config/db";
import User from "@/models/User";

// This is a debugging route to simulate Clerk webhook events
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, email, firstName, lastName, imageUrl, eventType = "user.created" } = body;

    if (!userId || !email) {
      return NextResponse.json(
        { message: "Missing required fields: userId, email" },
        { status: 400 }
      );
    }

    await connectDB();

    const userData = {
      _id: userId,
      email: email,
      name: `${firstName || ""} ${lastName || ""}`.trim() || "Test User",
      image: imageUrl || "",
    };

    console.log(`Simulating webhook event: ${eventType} for user: ${userData.email}`);

    let result;
    switch (eventType) {
      case "user.created":
        const existingUser = await User.findById(userId);
        if (!existingUser) {
          result = await User.create(userData);
          console.log("Debug: User created successfully:", result._id);
        } else {
          result = existingUser;
          console.log("Debug: User already exists:", userId);
        }
        break;

      case "user.updated":
        result = await User.findByIdAndUpdate(
          userId, 
          { 
            email: userData.email,
            name: userData.name,
            image: userData.image
          },
          { new: true, runValidators: true }
        );
        console.log("Debug: User updated successfully:", result?._id);
        break;

      case "user.deleted":
        result = await User.findByIdAndDelete(userId);
        console.log("Debug: User deleted successfully:", result?._id);
        break;

      default:
        return NextResponse.json(
          { message: `Unsupported event type: ${eventType}` },
          { status: 400 }
        );
    }

    return NextResponse.json({ 
      message: `Debug webhook event processed successfully`,
      eventType,
      user: result,
      userData
    });

  } catch (error) {
    console.error("Debug webhook processing error:", error);
    return NextResponse.json(
      { message: "Debug webhook processing failed", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// GET route to test database connection and show current users
export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).sort({ createdAt: -1 }).limit(10).lean();
    
    return NextResponse.json({
      message: "Debug endpoint - Database connection successful",
      userCount: users.length,
      users: users.map(user => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return NextResponse.json(
      { message: "Debug endpoint failed", error: (error as Error).message },
      { status: 500 }
    );
  }
}