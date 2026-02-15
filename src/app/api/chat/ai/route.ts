export const maxDuration = 60;
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    //Extract chatId and prompt from the request body
    const { chatId, prompt } = await req.json();

    console.log("📨 API Request received");
    console.log(
      "🔑 GROQ_API_KEY Status:",
      process.env.GROQ_API_KEY ? "Present" : "Missing",
    );
    console.log("💬 Chat ID:", chatId);
    console.log("📝 Prompt:", prompt);

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User not authorized",
      });
    }
    // Find in the database based on userId and chatId
    await connectDB();
    const data = await Chat.findOne({ userId, _id: chatId });

    if (!data) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }

    //Create a user message object
    const userPrompt = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    };

    data.messages.push(userPrompt);

    // Prepare messages for Groq API (OpenAI compatible)
    // Map existing messages to { role, content } format
    const apiMessages = data.messages.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    }));

    const completion = await openai.chat.completions.create({
      messages: apiMessages,
      model: "llama-3.3-70b-versatile",
    });

    const message = completion.choices[0].message as any;
    message.timestamp = Date.now();

    data.messages.push(message);
    data.save();

    return NextResponse.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error("Error fetching chats:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch chats",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
