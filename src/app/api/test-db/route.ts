import connectDB from "@/config/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Testing database connection...");
    
    // Test database connection
    await connectDB();
    console.log("✅ Database connection successful");
    
    // Test basic operations
    const userCount = await User.countDocuments();
    console.log("✅ User count:", userCount);
    
    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("❌ Database test failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
