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
    const wh = new Webhook(process.env.SIGNING_SECRET ?? "");
    const headerPayload = req.headers;
    const svixHeader = {
      "svix-id": headerPayload.get("svix-id") ?? "",
      "svix-timestamp": headerPayload.get("svix-timestamp") ?? "",
      "svix-signature": headerPayload.get("svix-signature") ?? "",
    };
    
    // Get the payload and verify it
    const payload = await req.json();
    const body = JSON.stringify(payload);
    const { data, type } = wh.verify(body, svixHeader) as ClerkWebhookResult;

    // Connect to database
    await connectDB();

    // Prepare the user data to be stored in database
    const userData = {
      _id: data.id, // Use _id instead of clerkId to match schema
      email: data.email_addresses?.[0]?.email_address || "",
      name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || "Unknown User",
      image: data.image_url || "",
    };

    console.log(`Processing webhook event: ${type} for user: ${userData.email}`);

    switch (type) {
      case "user.created":
        try {
          const existingUser = await User.findById(data.id);
          if (!existingUser) {
            const newUser = await User.create(userData);
            console.log("User created successfully:", newUser._id);
          } else {
            console.log("User already exists:", data.id);
          }
        } catch (createError) {
          console.error("Error creating user:", createError);
          // If it's a duplicate key error, that's okay - user already exists
          if ((createError as any).code !== 11000) {
            throw createError;
          }
        }
        break;

      case "user.updated":
        try {
          const updatedUser = await User.findByIdAndUpdate(
            data.id, 
            { 
              email: userData.email,
              name: userData.name,
              image: userData.image
            },
            { new: true, runValidators: true }
          );
          console.log("User updated successfully:", updatedUser?._id);
        } catch (updateError) {
          console.error("Error updating user:", updateError);
          throw updateError;
        }
        break;

      case "user.deleted":
        try {
          const deletedUser = await User.findByIdAndDelete(data.id);
          console.log("User deleted successfully:", deletedUser?._id);
        } catch (deleteError) {
          console.error("Error deleting user:", deleteError);
          throw deleteError;
        }
        break;
        
      default:
        console.log(`Unhandled webhook event type: ${type}`);
        break;
    }
    
    return NextResponse.json({ message: "Event processed successfully", type });
    
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { message: "Webhook processing failed", error: (error as Error).message },
      { status: 500 }
    );
  }
}
