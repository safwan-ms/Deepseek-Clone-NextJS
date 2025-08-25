"use client";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export default function TestAuthPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [authResult, setAuthResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    setDebugInfo(`isLoaded: ${isLoaded}, isSignedIn: ${isSignedIn}, user: ${user ? 'present' : 'null'}`);
  }, [isLoaded, isSignedIn, user]);

  const testAuthEndpoint = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      setAuthResult(data);
    } catch (error) {
      setAuthResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Test Page</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Debug Information</h2>
          <p className="text-sm font-mono">{debugInfo}</p>
        </div>

        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Clerk User State</h2>
          <p><strong>Is Loaded:</strong> {isLoaded ? '✅ Yes' : '⏳ Loading...'}</p>
          <p><strong>Is Signed In:</strong> {isSignedIn ? '✅ Yes' : '❌ No'}</p>
          {user && (
            <div className="mt-2">
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}</p>
              <p><strong>Name:</strong> {user.fullName}</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Test API Endpoint</h2>
          <button
            onClick={testAuthEndpoint}
            disabled={loading || !isSignedIn}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {loading ? 'Testing...' : 'Test /api/auth/me'}
          </button>
          
          {authResult && (
            <div className="mt-4 p-3 bg-gray-700 rounded">
              <h3 className="font-semibold mb-2">API Response:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(authResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {!isSignedIn && isLoaded && (
          <div className="p-4 bg-yellow-800 rounded-lg">
            <p className="text-yellow-200">
              ⚠️ You need to sign in first to test the authentication endpoint.
              Go back to the main page and click on the profile icon to sign in.
            </p>
          </div>
        )}

        {!isLoaded && (
          <div className="p-4 bg-red-800 rounded-lg">
            <p className="text-red-200 mb-2">
              🔴 Clerk is not loading properly. This might be due to:
            </p>
            <ul className="list-disc list-inside text-red-200">
              <li>Missing or incorrect Clerk environment variables</li>
              <li>Network connectivity issues</li>
              <li>Clerk service being down</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
