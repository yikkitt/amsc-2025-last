'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { createClientComponentClient } from '@/lib/supabase';

export default function FixProfileButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Function to fix the user profile
  const fixProfile = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      // Get user data from auth context or create mock data if not available
      const supabase = createClientComponentClient();
      const { data: userData } = await supabase.auth.getUser();
      
      console.log("Auth check result:", userData?.user ? "User authenticated" : "No user found");
      
      // Use authenticated user or create a mock user ID
      const userId = userData?.user?.id || '00000000-0000-0000-0000-000000000000';
      const userEmail = userData?.user?.email || 'guest@example.com';
      
      console.log("Using user ID:", userId);
      
      // Create profile data using available information or defaults
      const profileData = {
        id: userId,
        email: userEmail,
        company_name: 'My Company Name',
        booth_number: 'A123',
        contact_person: 'Contact Person',
        telephone: '123-456-7890',
        tel: '123-456-7890',
        address: '123 Example Street',
      };
      
      // Get the host from the window for absolute URL
      const host = window.location.origin;
      console.log('Making request to:', `${host}/api/update-user-profile`);
      
      // Call API endpoint with absolute URL
      const response = await fetch(`${host}/api/update-user-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      console.log("API response status:", response.status);
      
      // Handle non-OK responses
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.error || `Server error (${response.status})`);
        } catch (e) {
          throw new Error(`Server error (${response.status}): Could not process response`);
        }
      }
      
      // Parse the successful response
      const result = await response.json();
      console.log("API success result:", result);
      
      // Show success message and reload page
      setMessage('Profile fixed successfully! Refreshing page...');
      setTimeout(() => window.location.reload(), 1500);
    } catch (error: any) {
      console.error('Profile update error:', error);
      setMessage(`Error fixing profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="mt-4 mb-6">
      <button
        onClick={fixProfile}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? 'Fixing Profile...' : 'Fix My Profile Data'}
      </button>
      
      {message && (
        <div className={`mt-2 text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </div>
      )}
    </div>
  );
} 