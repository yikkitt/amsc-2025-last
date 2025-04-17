'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function DebugPage() {
  const [sessionData, setSessionData] = useState<any>(null);
  const [cookieData, setCookieData] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        // Get all cookies for debugging
        const cookies = document.cookie.split(';').map(c => c.trim());
        setCookieData(cookies);
        
        // Get the client-side session
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        // Set the session data for display
        setSessionData(data);
      } catch (e) {
        console.error('Error checking session:', e);
      } finally {
        setLoading(false);
      }
    }
    
    checkSession();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug Page</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Session Status</h2>
        {loading ? (
          <p>Loading session data...</p>
        ) : (
          <div>
            <p className="mb-2">
              <strong>Session Exists:</strong>{' '}
              {sessionData?.session ? 'Yes' : 'No'}
            </p>
            
            {sessionData?.session ? (
              <div className="p-4 bg-gray-100 rounded-md overflow-auto">
                <p><strong>User ID:</strong> {sessionData.session.user.id}</p>
                <p><strong>Email:</strong> {sessionData.session.user.email}</p>
                <p><strong>Access Token Exists:</strong> {sessionData.session.access_token ? 'Yes' : 'No'}</p>
                <p><strong>Refresh Token Exists:</strong> {sessionData.session.refresh_token ? 'Yes' : 'No'}</p>
                <p><strong>Expires At:</strong> {new Date(sessionData.session.expires_at * 1000).toLocaleString()}</p>
              </div>
            ) : (
              <p className="text-red-500">No active session found.</p>
            )}
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Cookie Inspection</h2>
        {cookieData.length > 0 ? (
          <div className="p-4 bg-gray-100 rounded-md overflow-auto">
            <ul className="list-disc pl-5">
              {cookieData.map((cookie, index) => (
                <li key={index}>{cookie}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No cookies found.</p>
        )}
      </div>
      
      <div className="mt-4 space-y-2">
        <h2 className="text-xl font-semibold mb-2">Actions</h2>
        <button 
          onClick={() => window.location.href = '/auth/signin'}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Go to Sign In
        </button>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
} 