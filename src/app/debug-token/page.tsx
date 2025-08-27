"use client";
import { useAuth } from "@clerk/nextjs";

export default function DebugToken() {
  const { getToken, userId } = useAuth();

  async function logToken() {
    const token = await getToken({ template: "default" }); // "default" is Clerk's built-in JWT template
    console.log("User ID:", userId);
    console.log("JWT:", token);
  }

  return <button onClick={logToken}>Get Clerk Token</button>;
}
