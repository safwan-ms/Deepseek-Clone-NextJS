import connectDB from "@/config/db";
import User from "@/models/User";
import { Webhook } from "svix";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const wh = new Webhook(process.env.SIGNING_SECRET ?? "");
  const headerPayload = await headers();
  const svixHeader = {
    "svix-id": headerPayload.get("svix-id"),
    "svix-signature": headerPayload.get("svix-signature"),
  };
  //Get the payload and verify it
  const payload = await req.json();
  const body = JSON.stringify(payload);
  const { data, type } = wh.verify(body, svixHeader);

  // Prepare the user data to be stored in database

  const userData = {
    clerkId: data.id,
    email: data.email_addresses?.[0]?.email_address || "",
    name: `${data.first_name} ${data.last_name}` || "",
    image: data.image_url || "",
  };

  await connectDB();
  await User.findOneAndUpdate({ clerkId: userData.clerkId }, userData, {
    upsert: true,
    new: true,
  });
}
