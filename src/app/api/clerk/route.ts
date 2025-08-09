import { Webhook } from "svix";
import type { WebhookRequiredHeaders } from "svix";
import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import User from "@/models/User";

type ClerkUserEvent = {
  data: {
    id: string;
    email_addresses?: Array<{ email_address: string }>;
    email_address?: string;
    first_name?: string;
    last_name?: string;
    image_url?: string;
  };
  type: string;
};

export async function POST(req: Request) {
  try {
    const signingSecret = process.env.SIGNING_SECRET;
    if (!signingSecret) {
      return NextResponse.json(
        { message: "SIGNING_SECRET is missing from environment variables" },
        { status: 500 }
      );
    }

    const svixHeaders: WebhookRequiredHeaders = {
      "svix-id": req.headers.get("svix-id") || "",
      "svix-timestamp": req.headers.get("svix-timestamp") || "",
      "svix-signature": req.headers.get("svix-signature") || "",
    };

    if (!svixHeaders["svix-id"] || !svixHeaders["svix-timestamp"] || !svixHeaders["svix-signature"]) {
      return NextResponse.json({ message: "Missing Svix headers" }, { status: 400 });
    }

    const wh = new Webhook(signingSecret);

    const payload = await req.json();
    const body = JSON.stringify(payload);
    const evt = wh.verify(body, svixHeaders) as ClerkUserEvent;
    const { data, type } = evt;

    await connectDB();

    const email = data?.email_addresses?.[0]?.email_address ?? data?.email_address ?? "";
    const name = `${data?.first_name ?? ""} ${data?.last_name ?? ""}`.trim();
    const image = data?.image_url ?? "";

    const userData = {
      _id: data.id,
      email,
      name,
      image,
    };

    await User.findByIdAndUpdate(
      userData._id,
      { $set: userData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ ok: true, type });
  } catch (error) {
    console.error("Clerk webhook handling failed", error);
    return NextResponse.json({ message: "Webhook handling failed" }, { status: 400 });
  }
}
