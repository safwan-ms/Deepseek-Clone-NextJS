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
  const wh = new Webhook(process.env.SIGNING_SECRET ?? "");
  const headerPayload = req.headers;
  const svixHeader = {
    "svix-id": headerPayload.get("svix-id") ?? "",
    "svix-timestamp": headerPayload.get("svix-timestamp") ?? "",
    "svix-signature": headerPayload.get("svix-signature") ?? "",
  };
  //Get the payload and verify it
  const payload = await req.json();
  const body = JSON.stringify(payload);
  const { data, type } = wh.verify(body, svixHeader) as ClerkWebhookResult;

  // Prepare the user data to be stored in database

  const userData = {
    clerkId: data.id,
    email: data.email_addresses?.[0]?.email_address || "",
    name: `${data.first_name} ${data.last_name}` || "",
    image: data.image_url || "",
  };

  await connectDB();

  switch (type) {
    case "user.created":
      await User.create(userData);
      break;

    case "user.updated":
      await User.findByIdAndUpdate(data.id, userData);
      break;

    case "user.deleted":
      await User.findByIdAndDelete(data.id, userData);
      break;
    default:
      break;
  }
  return NextResponse.json({ message: "Event Received" });
}
