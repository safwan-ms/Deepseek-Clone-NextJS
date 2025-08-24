import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User not authorized" },
        { status: 404 }
      );
    }

    await connectDB();
    const { chatId, name } = await req.json();

    // Connect to the database and update the chat name
    await Chat.findOneAndUpdate({ _id: chatId, userId }, { name });

    return NextResponse.json({
      success: true,
      message: "Chat Renamed successfully",
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      {
        success: false,
        message: "",
        error: error instanceof Error ? error.message : "Unknown Error",
      },
      { status: 500 }
    );
  }
}
