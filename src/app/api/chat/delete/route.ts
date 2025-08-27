import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    const { chatId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User not authorized" },
        { status: 404 }
      );
    }

    //Connect to the database and delete the chat
    await connectDB();
    await Chat.deleteOne({ _id: chatId, userId });
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
