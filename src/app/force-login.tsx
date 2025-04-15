'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function ForceLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus('Logging in...');
    
    try {
      // Create a fresh client
      const supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        {
          auth: {
            persistSession: true,
            storage: localStorage
          }
        }
      );
      
      // Attempt login
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });
      
      if (error) {
        setStatus(`Error: ${error.message}`);
        return;
      }
      
      setStatus('Login successful! Redirecting in 2 seconds...');
      
      // Store session in localStorage
      localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
      
      // Wait and redirect
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
      
    } catch (err) {
      setStatus(`Exception: ${err.message}`);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Emergency Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Use when normal login isn't working
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
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
              <label htmlFor="password" className="sr-only">Password</label>
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
          
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Force Login
            </button>
          </div>
          
          {status && (
            <div className="mt-4 p-2 rounded bg-gray-100 text-center text-sm">
              {status}
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 