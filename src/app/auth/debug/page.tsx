'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function DebugPage() {
  const [cookies, setCookies] = useState<string[]>([]);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get all cookies
    const allCookies = document.cookie.split(';').map(cookie => cookie.trim());
    setCookies(allCookies);

    // Try to get session
    const fetchSession = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setError(error.message);
        } else {
          setSessionInfo(data);
        }
      } catch (err) {
        setError(String(err));
      }
    };

    fetchSession();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Auth Debug Page</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Cookies:</h2>
        {cookies.length > 0 ? (
          <ul className="bg-gray-100 p-4 rounded">
            {cookies.map((cookie, i) => (
              <li key={i} className="mb-1">{cookie}</li>
            ))}
          </ul>
        ) : (
          <p>No cookies found</p>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Session Info:</h2>
        {error ? (
          <div className="bg-red-100 p-4 rounded">
            <p className="text-red-700">Error: {error}</p>
          </div>
        ) : sessionInfo ? (
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(sessionInfo, null, 2)}
          </pre>
        ) : (
          <p>Loading session info...</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Next Steps:</h2>
        <ul className="list-disc pl-5">
          <li>Check if Supabase cookies exist</li>
          <li>Verify if getSession returns valid data</li>
          <li>Go to <a href="/auth/signin" className="text-blue-500 underline">Sign In</a> page</li>
        </ul>
      </div>
    </div>
  );
} 