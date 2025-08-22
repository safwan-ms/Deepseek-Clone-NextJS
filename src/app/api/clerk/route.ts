import connectDB from "@/config/db";
import User from "@/models/User";
import { Webhook } from "svix";
import { NextResponse, type NextRequest } from "next/server";

interface ClerkWebhookData {
  id: string;
  email_addresses?: { email_address: string }[];
  first_name?: string;
  last_name?: string;
  image_url?: string;
}

interface ClerkWebhookResult {
  data: ClerkWebhookData;
  type: string;
}

export async function POST(req: NextRequest) {
  try {
    // Check if signing secret is configured
    const signingSecret = process.env.SIGNING_SECRET;
    if (!signingSecret) {
      console.error("SIGNING_SECRET is not configured");
      return NextResponse.json(
        { error: "Webhook signing secret not configured" },
        { status: 500 }
      );
    }

    const wh = new Webhook(signingSecret);
    const headerPayload = req.headers;

    const svixHeader = {
      "svix-id": headerPayload.get("svix-id") ?? "",
      "svix-timestamp": headerPayload.get("svix-timestamp") ?? "",
      "svix-signature": headerPayload.get("svix-signature") ?? "",
    };

    // Log headers for debugging
    console.log("Webhook headers:", {
      "svix-id": svixHeader["svix-id"],
      "svix-timestamp": svixHeader["svix-timestamp"],
      "svix-signature": svixHeader["svix-signature"] ? "present" : "missing"
    });

    //Get the payload and verify it
    const payload = await req.json();
    const body = JSON.stringify(payload);
    
    console.log("Webhook payload received:", JSON.stringify(payload, null, 2));
    
    const { data, type } = wh.verify(body, svixHeader) as ClerkWebhookResult;

    // Prepare the user data to be stored in database
    const userData = {
      _id: data.id,
      email: data.email_addresses?.[0]?.email_address || "",
      name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || "",
      image: data.image_url || "",
    };

    console.log("Processing webhook type:", type);
    console.log("User data to store:", userData);

    // Connect to database
    try {
      await connectDB();
      console.log("✅ Connected to MongoDB successfully");
    } catch (dbError) {
      console.error("❌ Database connection failed:", dbError);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    switch (type) {
      case "user.created":
        try {
          const newUser = await User.create(userData);
          console.log("✅ User created successfully:", newUser._id);
        } catch (createError) {
          console.error("❌ Error creating user:", createError);
          return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
          );
        }
        break;

      case "user.updated":
        try {
          const updatedUser = await User.findByIdAndUpdate(
            userData._id, 
            userData, 
            { new: true, upsert: true }
          );
          console.log("✅ User updated successfully:", updatedUser._id);
        } catch (updateError) {
          console.error("❌ Error updating user:", updateError);
          return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
          );
        }
        break;

      case "user.deleted":
        try {
          await User.findByIdAndDelete(userData._id);
          console.log("✅ User deleted successfully:", userData._id);
        } catch (deleteError) {
          console.error("❌ Error deleting user:", deleteError);
          return NextResponse.json(
            { error: "Failed to delete user" },
            { status: 500 }
          );
        }
        break;

      default:
        console.log("⚠️ Unhandled event type:", type);
        break;
    }
    
    return NextResponse.json({ message: "Event processed successfully" });
  } catch (error) {
    console.error("❌ Error handling webhook:", error);
    
    // Check if it's a webhook verification error
    if (error instanceof Error && error.message.includes("verification")) {
      return NextResponse.json(
        { error: "Webhook verification failed" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to process event" },
      { status: 500 }
    );
  }
}
