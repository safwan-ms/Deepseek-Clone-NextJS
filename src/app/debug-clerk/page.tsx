"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

type WindowWithClerk = Window & { Clerk?: unknown };

export default function DebugClerkPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [clerkLoaded, setClerkLoaded] = useState<boolean>(false);
  const [networkStatus, setNetworkStatus] = useState<string>("Checking...");
  const [openRouterResponse, setOpenRouterResponse] = useState<string>("");
  const [openRouterLoading, setOpenRouterLoading] = useState<boolean>(false);
  const [openRouterError, setOpenRouterError] = useState<string>("");

  useEffect(() => {
    // Check if Clerk script is loaded
    const checkClerkScript = () => {
      const script = document.querySelector(
        'script[data-clerk-js-script="true"]'
      );
      if (script) {
        setClerkLoaded(true);
        console.log("✅ Clerk script found in DOM");
      } else {
        setClerkLoaded(false);
        console.log("❌ Clerk script not found in DOM");
      }
    };

    // Check network connectivity to Clerk
    const checkNetwork = async () => {
      try {
        await fetch(
          "https://immortal-doberman-76.clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js",
          {
            method: "HEAD",
            mode: "no-cors",
          }
        );
        setNetworkStatus("✅ Network accessible");
      } catch (error) {
        setNetworkStatus(
          "❌ Network error: " +
            (error instanceof Error ? error.message : "Unknown error")
        );
      }
    };

    checkClerkScript();
    checkNetwork();

    // Check for Clerk global object
    const checkClerkGlobal = () => {
      if (typeof window !== "undefined") {
        const clerkGlobal = (window as WindowWithClerk).Clerk;
        if (clerkGlobal) {
          console.log("✅ Clerk global object found:", clerkGlobal);
        } else {
          console.log("❌ Clerk global object not found");
        }
      }
    };

    // Wait a bit for Clerk to load
    const timer = setTimeout(checkClerkGlobal, 2000);
    return () => clearTimeout(timer);
  }, []);

  const testOpenRouterAPI = async () => {
    setOpenRouterLoading(true);
    setOpenRouterError("");
    setOpenRouterResponse("");

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${
              process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || "YOUR_API_KEY_HERE"
            }`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "DeepSeek Clone Debug",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-r1:free",
            messages: [
              {
                role: "user",
                content: "What is the meaning of life?",
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOpenRouterResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setOpenRouterError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setOpenRouterLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Clerk Debug Information</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Clerk Script Status</h2>
          <p>
            <strong>Script Loaded:</strong> {clerkLoaded ? "✅ Yes" : "❌ No"}
          </p>
          <p>
            <strong>Network Status:</strong> {networkStatus}
          </p>
          <p>
            <strong>Environment:</strong> {process.env.NODE_ENV}
          </p>
        </div>

        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Clerk Hook State</h2>
          <p>
            <strong>isLoaded:</strong> {String(isLoaded)}
          </p>
          <p>
            <strong>isSignedIn:</strong> {String(isSignedIn)}
          </p>
          <p>
            <strong>user:</strong> {user ? "Present" : "Null"}
          </p>
        </div>

        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
          <p>
            <strong>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:</strong>{" "}
            {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
              ? "✅ Present"
              : "❌ Missing"}
          </p>
          <p>
            <strong>CLERK_SECRET_KEY:</strong>{" "}
            {process.env.CLERK_SECRET_KEY ? "✅ Present" : "❌ Missing"}
          </p>
          <p>
            <strong>NEXT_PUBLIC_OPENROUTER_API_KEY:</strong>{" "}
            {process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
              ? "✅ Present"
              : "❌ Missing"}
          </p>
          <p>
            <strong>Key Preview:</strong>{" "}
            {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
              ? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.substring(0, 20) +
                "..."
              : "N/A"}
          </p>
        </div>

        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Browser Information</h2>
          <p>
            <strong>User Agent:</strong>{" "}
            {typeof window !== "undefined"
              ? window.navigator.userAgent.substring(0, 50) + "..."
              : "Server-side"}
          </p>
          <p>
            <strong>Online:</strong>{" "}
            {typeof window !== "undefined"
              ? navigator.onLine
                ? "✅ Yes"
                : "❌ No"
              : "Unknown"}
          </p>
          <p>
            <strong>Cookies Enabled:</strong>{" "}
            {typeof window !== "undefined"
              ? navigator.cookieEnabled
                ? "✅ Yes"
                : "❌ No"
              : "Unknown"}
          </p>
        </div>
      </div>

      {user && (
        <div className="mt-4 p-4 bg-green-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">User Information</h2>
          <p>
            <strong>User ID:</strong> {user.id}
          </p>
          <p>
            <strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}
          </p>
          <p>
            <strong>Name:</strong> {user.fullName}
          </p>
          <p>
            <strong>Created:</strong> {user.createdAt?.toLocaleDateString()}
          </p>
        </div>
      )}

      {!isLoaded && (
        <div className="mt-4 p-4 bg-red-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Troubleshooting Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-red-200">
            <li>Check browser console for JavaScript errors</li>
            <li>Verify your Clerk dashboard configuration</li>
            <li>Ensure your domain is allowed in Clerk settings</li>
            <li>Try clearing browser cache and cookies</li>
            <li>
              Check if you&apos;re using an ad blocker that might block Clerk
            </li>
            <li>Verify your internet connection</li>
          </ol>
        </div>
      )}

      {isLoaded && !isSignedIn && (
        <div className="mt-4 p-4 bg-yellow-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Next Steps</h2>
          <p className="text-yellow-200">
            ✅ Clerk is loaded successfully! You&apos;re just not signed in yet.
            Go back to the main page and click the profile icon to sign in.
          </p>
        </div>
      )}

      <div className="mt-4 p-4 bg-blue-800 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Manual Test</h2>
        <button
          onClick={() => {
            console.log("=== Clerk Debug Info ===");
            console.log("Window Clerk:", (window as WindowWithClerk).Clerk);
            console.log(
              "Document scripts:",
              document.querySelectorAll('script[src*="clerk"]')
            );
            console.log("Environment:", process.env.NODE_ENV);
            console.log(
              "Publishable Key:",
              process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
            );
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Log Debug Info to Console
        </button>
      </div>

      <div className="mt-4 p-4 bg-purple-800 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">OpenRouter API Test</h2>
        <p className="text-purple-200 mb-4">
          Test the OpenRouter API with DeepSeek model. Make sure to set your
          NEXT_PUBLIC_OPENROUTER_API_KEY environment variable.
        </p>

        <button
          onClick={testOpenRouterAPI}
          disabled={openRouterLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {openRouterLoading ? "Testing..." : "Test OpenRouter API"}
        </button>

        {openRouterError && (
          <div className="mt-4 p-3 bg-red-900 rounded">
            <h3 className="font-semibold text-red-200">Error:</h3>
            <p className="text-red-300">{openRouterError}</p>
          </div>
        )}

        {openRouterResponse && (
          <div className="mt-4 p-3 bg-green-900 rounded">
            <h3 className="font-semibold text-green-200 mb-2">Response:</h3>
            <pre className="text-green-300 text-sm overflow-auto max-h-96 whitespace-pre-wrap">
              {openRouterResponse}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
