'use client';

import { useState } from 'react';
import { createClient, Session } from '@supabase/supabase-js';

export default function LoginDebugPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [sessionData, setSessionData] = useState<Session | null>(null);

  const createSupabase = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    return createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: window.localStorage
      }
    });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Starting login process...');
    
    try {
      // Create a fresh client
      const supabase = createSupabase();
      setStatus('Supabase client created');
      
      // Clear any existing session
      await supabase.auth.signOut();
      setStatus('Signed out previous session');
      
      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Attempt login
      setStatus('Attempting login...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });
      
      if (error) {
        setStatus(`Error: ${error.message}`);
        return;
      }
      
      setStatus('Login successful! User ID: ' + data.user?.id);
      if (data.session) {
        setSessionData(data.session);

        // Set cookies manually
        document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=${60*60*24}; SameSite=Lax`;
        document.cookie = `sb-refresh-token=${data.session.refresh_token}; path=/; max-age=${60*60*24*7}; SameSite=Lax`;
        
        setStatus('Cookies set. Waiting 2 seconds before redirect...');
        
        // Store session in localStorage
        localStorage.setItem('sb-access-token', data.session.access_token);
        localStorage.setItem('sb-refresh-token', data.session.refresh_token);
        
        // Wait and redirect
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      }
      
    } catch (err) {
      let errorMessage = 'An unknown error occurred';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setStatus(`Exception: ${errorMessage}`);
      console.error('Login error:', err);
    }
  };
  
  const checkSession = async () => {
    try {
      const supabase = createSupabase();
      setStatus('Checking session...');
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setStatus(`Session check error: ${error.message}`);
        return;
      }
      
      if (data.session) {
        setStatus(`Session exists! User ID: ${data.session.user.id}`);
        setSessionData(data.session);
      } else {
        setStatus('No session found');
        setSessionData(null);
      }
    } catch (err) {
      let errorMessage = 'An unknown error occurred during session check';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setStatus(`Session check error: ${errorMessage}`);
      setSessionData(null);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Debug Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Direct login page for debugging authentication issues
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              className="group relative flex-1 justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Debug Login
            </button>
            
            <button
              type="button"
              onClick={checkSession}
              className="group relative flex-1 justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Check Session
            </button>
          </div>
          
          {status && (
            <div className="mt-4 p-3 rounded bg-gray-100 text-sm">
              <div className="font-medium mb-1">Status:</div>
              <div className="whitespace-pre-wrap text-gray-700">{status}</div>
            </div>
          )}
          
          {sessionData && (
            <div className="mt-4 p-3 rounded bg-gray-100 text-sm">
              <div className="font-medium mb-1">Session:</div>
              <div className="max-h-40 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-xs text-gray-700">
                  {JSON.stringify(sessionData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 