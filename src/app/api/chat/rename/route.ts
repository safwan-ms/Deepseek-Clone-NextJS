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
        { status: 404 },
      );
    }

    await connectDB();
    const { chatId, name } = await req.json();

    // Connect to the database and update the chat name
    const updatedChat = await Chat.findOneAndUpdate(
      { _id: chatId, userId },
      { name },
      { new: true },
    );

    return NextResponse.json({
      success: true,
      message: "Chat Renamed successfully",
      data: updatedChat,
    });
  } catch (error) {
    console.error("Error naming chat:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to rename chat",
        error: error instanceof Error ? error.message : "Unknown Error",
      },
      { status: 500 },
    );
  }
}
