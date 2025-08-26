import { getAuth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId, sessionId } = getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 401 }
      );
    }

    const clerk = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    const user = await clerk.users.getUser(userId);

    return NextResponse.json({
      success: true,
      userId,
      sessionId,
      email: user.emailAddresses[0]?.emailAddress,
    });
  } catch (error) {
    console.error("❌ Auth route error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
        error: error instanceof Error ? error.message : "Unknown Error",
      },
      { status: 500 }
    );
  }
}
