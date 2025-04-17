'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function DebugPage() {
  const [cookies, setCookies] = useState<string[]>([]);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiDebugInfo, setApiDebugInfo] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

  const fetchApiDebug = async () => {
    setLoading(true);
    setApiError(null);
    
    try {
      const response = await fetch('/api/auth-debug');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setApiDebugInfo(data);
    } catch (err) {
      setApiError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const goToDashboard = () => {
    console.log('Debug: Direct navigation to dashboard');
    window.location.href = '/dashboard';
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Auth Debug Page</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Cookies in Browser:</h2>
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
        <h2 className="text-xl font-semibold mb-2">Browser Session Info:</h2>
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

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Server Debug Info:</h2>
        <button 
          onClick={fetchApiDebug} 
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded mb-4"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Fetch Server Auth Debug'}
        </button>
        
        {apiError ? (
          <div className="bg-red-100 p-4 rounded">
            <p className="text-red-700">API Error: {apiError}</p>
          </div>
        ) : apiDebugInfo ? (
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(apiDebugInfo, null, 2)}
          </pre>
        ) : null}
      </div>

      <div className="flex gap-4 mb-6">
        <button 
          onClick={goToDashboard} 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Go to Dashboard Directly
        </button>
        <a 
          href="/dashboard" 
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-block"
        >
          Dashboard Link
        </a>
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