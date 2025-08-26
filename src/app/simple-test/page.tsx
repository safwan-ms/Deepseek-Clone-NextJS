"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function SimpleTestPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [mountTime, setMountTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    setMountTime(new Date());
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Simple Clerk Test</h1>

      <div className="space-y-4">
        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Page Info</h2>
          <p>
            <strong>Mount Time:</strong>{" "}
            {mountTime?.toLocaleTimeString() || "Not set"}
          </p>
          <p>
            <strong>Current Time:</strong> {currentTime.toLocaleTimeString()}
          </p>
          <p>
            <strong>Time Since Mount:</strong>{" "}
            {mountTime
              ? Math.floor((currentTime.getTime() - mountTime.getTime()) / 1000)
              : 0}
            s
          </p>
        </div>

        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Clerk State</h2>
          <p>
            <strong>isLoaded:</strong> {String(isLoaded)}
          </p>
          <p>
            <strong>isSignedIn:</strong> {String(isSignedIn)}
          </p>
          <p>
            <strong>user:</strong> {user ? "Present" : "Null"}
          </p>
          {user && (
            <div className="mt-2 p-2 bg-gray-700 rounded">
              <p>
                <strong>User ID:</strong> {user.id}
              </p>
              <p>
                <strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}
              </p>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Environment Check</h2>
          <p>
            <strong>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:</strong>{" "}
            {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
              ? "Present"
              : "Missing"}
          </p>
          <p>
            <strong>CLERK_SECRET_KEY:</strong>{" "}
            {process.env.CLERK_SECRET_KEY ? "Present" : "Missing"}
          </p>
        </div>

        {!isLoaded && (
          <div className="p-4 bg-red-800 rounded-lg">
            <p className="text-red-200 mb-2">
              🔴 Clerk is not loading. This could be due to:
            </p>
            <ul className="list-disc list-inside text-red-200">
              <li>Network issues preventing Clerk script from loading</li>
              <li>Incorrect environment variables</li>
              <li>Clerk service being down</li>
              <li>Browser console errors</li>
            </ul>
          </div>
        )}

        {isLoaded && !isSignedIn && (
          <div className="p-4 bg-yellow-800 rounded-lg">
            <p className="text-yellow-200">
              ✅ Clerk is loaded but you're not signed in. This is normal
              behavior.
            </p>
          </div>
        )}

        {isLoaded && isSignedIn && (
          <div className="p-4 bg-green-800 rounded-lg">
            <p className="text-green-200">
              ✅ Clerk is loaded and you're signed in!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
