import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User not authorized",
        },
        { status: 404 }
      );
    }

    // Connect to the database and fetch all chats for the user.
    await connectDB();
    const data = await Chat.find({ userId });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch chats",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
