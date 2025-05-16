'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Session, User } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

type UserProfile = {
  company_name: string;
  booth_number: string;
  contact_person: string;
  email: string;
  telephone: string;
  address: string;
  postcode?: string;
  state?: string;
  country?: string;
  tax_identification_number?: string;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, profile: UserProfile) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Use the appropriate client based on context
const supabase = getSupabaseBrowserClient(); // For browser interactions like auth state changes

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Track initial mount to identify real sign-ins vs page loads
  const isInitialMount = useRef(true);
  
  useEffect(() => {
    async function initializeAuth() {
      try {
        setLoading(true);
        
        // Use the browser client for auth operations
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }
        
        if (data && data.session) {
          setSession(data.session);
          setUser(data.session.user);
        }
        
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, newSession) => {
            // Log all events
            console.log(`Auth state changed: Event - ${event}, Session Exists - ${!!newSession}`);
            
            // Update the session and user state
            setSession(newSession);
            setUser(newSession?.user ?? null);
            
            // Only redirect on actual sign-in (not initial load)
            if (event === 'SIGNED_IN' && !isInitialMount.current) {
              console.log('Sign-in detected, refreshing with active session');
              
              // Set the user in our state
              setUser(newSession?.user || null);
              
              // Just refresh the current route to ensure cookies are set
              router.refresh();
            }
          }
        );
        
        // No longer a first-time mount
        isInitialMount.current = false;
        
        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    }
    
    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in with email:', email);
      
      // In development mode with mock auth enabled, allow login with any credentials for testing
      if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true') {
        console.log('Mock authentication enabled: Bypassing authentication');
        await new Promise(resolve => setTimeout(resolve, 800));
        window.location.href = '/dashboard';
        return;
      }
      
      // First, clear any existing session
      await supabase.auth.signOut();
      
      // Wait briefly to ensure the session is cleared
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Sign in with password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });
      
      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      
      console.log('Login successful for user ID:', data.user?.id);
      
      // Store session in context
      setUser(data.user);
      setSession(data.session);
      
      if (data.session) {
        // Explicitly set cookies for better compatibility
        try {
          console.log('Setting explicit auth cookies');
          
          // Get project ref from URL or use default
          let projectRef = 'kiotgupdmepdyiscbrmb';
          try {
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
            const matches = url.match(/https:\/\/(.*?)\.supabase\.co/);
            if (matches && matches[1]) {
              projectRef = matches[1];
            }
          } catch (e) {
            console.error('Error extracting project ref:', e);
          }
          
          // Set all necessary cookies with appropriate settings
          document.cookie = `sb-${projectRef}-access-token=${data.session.access_token}; path=/; max-age=3600; SameSite=Lax`;
          
          if (data.session.refresh_token) {
            document.cookie = `sb-${projectRef}-refresh-token=${data.session.refresh_token}; path=/; max-age=2592000; SameSite=Lax`;
          }
          
          document.cookie = `sb-${projectRef}-auth-token=${JSON.stringify(data.session)}; path=/; max-age=3600; SameSite=Lax`;
        } catch (cookieError) {
          console.error('Error setting explicit cookies:', cookieError);
        }
      }
      
      // IMPORTANT: Use a two-step navigation process
      // First, refresh the current route to properly set cookies
      router.refresh();
      
      // Log cookie status after setting them for diagnostic purposes
      console.log('Cookie status after setting:', {
        accessTokenExists: document.cookie.includes('access-token'),
        refreshTokenExists: document.cookie.includes('refresh-token'),
        authTokenExists: document.cookie.includes('auth-token'),
        allCookies: document.cookie.split(';').map(c => c.trim().split('=')[0])
      });
      
      // Then wait and use a full page navigation
      console.log('Login successful, waiting briefly before navigation');
      setTimeout(() => {
        // Use window.location for a full page refresh that ensures
        // the server sees all the cookies on the next request
        window.location.href = '/';
      }, 1500);
    } catch (error: any) {
      console.error('Error in signIn function:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, profile: UserProfile) => {
    try {
      console.log('Signing up user with profile:', profile);
      
      // Step 1: Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/signin`,
          data: {
            company_name: profile.company_name,
            booth_number: profile.booth_number,
            contact_person: profile.contact_person,
            email: profile.email,
            telephone: profile.telephone,
            address: profile.address,
            ...(profile.postcode ? { postcode: profile.postcode } : {}),
            ...(profile.state ? { state: profile.state } : {}),
            ...(profile.country ? { country: profile.country } : {}),
            ...(profile.tax_identification_number ? { tax_identification_number: profile.tax_identification_number } : {})
          }
        }
      });

      if (authError) {
        console.error('Error during auth signup:', authError);
        throw authError;
      }
      
      if (!authData.user) {
        console.error('User creation failed - no user returned');
        throw new Error('User creation failed');
      }

      console.log('Auth signup successful with user ID:', authData.user.id);
      
      // Step 2: Create profile in the amsc_2025_user table
      try {
        console.log('Creating user profile with ID:', authData.user.id);
        
        // Special case: If we suspect database might not be initialized yet,
        // we can still proceed with auth-only signup
        const isDevEnvironment = process.env.NODE_ENV === 'development' || 
                                process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';
        
        // Create a user profile directly using the API endpoint
        console.log('Using API endpoint for creating user profile...');
        
        const userProfileData = {
          id: authData.user.id,
          company_name: profile.company_name || '',
          booth_number: profile.booth_number || '',
          contact_person: profile.contact_person || '',
          email: profile.email || '',
          telephone: profile.telephone || '',
          tel: profile.telephone || '',
          address: profile.address || '',
          postcode: profile.postcode,
          state: profile.state,
          country: profile.country,
          tax_identification_number: profile.tax_identification_number
        };
        
        // Set user regardless of profile creation success
        // This ensures the user can at least sign in
        setUser(authData.user);
        if (authData.session) {
          setSession(authData.session);
        }
        
        let profileCreated = false;
        let attempts = 0;
        const maxAttempts = 3;
        let lastError = null;
        
        // Only try to create profile if not in special dev mode with mocked auth
        if (!isDevEnvironment || process.env.NEXT_PUBLIC_REQUIRE_PROFILE === 'true') {
          // Retry profile creation a few times with exponential backoff
          while (!profileCreated && attempts < maxAttempts) {
            attempts++;
            try {
        const response = await fetch('/api/create-user-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userProfileData),
        });
        
              if (response.ok) {
                console.log('User profile created successfully via API');
                profileCreated = true;
                break; // Exit the retry loop on success
              } else {
                // Process error response
          let errorData;
          try {
            errorData = await response.json();
          } catch (e) {
            console.error('Failed to parse error response:', e);
                  errorData = { error: `API error (${response.status}): Unable to create user profile` };
          }
          
                console.error(`Failed to create user profile via API (attempt ${attempts}):`, errorData);
                lastError = new Error(errorData.error || 'Failed to create user profile via API');
                
                // If this is a database setup issue, we can't retry meaningfully
                if (errorData.error && errorData.error.includes('does not exist - database setup issue')) {
                  console.warn('Database table missing - profile creation will be handled by admin');
                  break;
                }
                
                // Wait with exponential backoff before retrying
                if (attempts < maxAttempts) {
                  const backoffTime = Math.pow(2, attempts) * 500; // 1s, 2s, 4s
                  console.log(`Retrying in ${backoffTime}ms...`);
                  await new Promise(resolve => setTimeout(resolve, backoffTime));
                }
              }
            } catch (apiError) {
              console.error(`Network error during profile creation (attempt ${attempts}):`, apiError);
              lastError = apiError;
              
              // Wait before retrying
              if (attempts < maxAttempts) {
                const backoffTime = Math.pow(2, attempts) * 500;
                console.log(`Retrying after network error in ${backoffTime}ms...`);
                await new Promise(resolve => setTimeout(resolve, backoffTime));
              }
            }
          }
        } else {
          console.log('Development mode: Skipping profile creation in database');
          profileCreated = true; // Consider it created in dev mode
        }
        
        if (!profileCreated && !isDevEnvironment) {
          console.warn('Failed to create user profile, but allowing authentication to proceed');
          // Add special user metadata to indicate profile needs creation
          try {
            await supabase.auth.updateUser({
              data: { 
                ...userProfileData,
                needs_profile_creation: true 
              }
            });
          } catch (updateError) {
            console.error('Failed to update user metadata:', updateError);
          }
        }
        
      } catch (profileError: any) {
        console.error("Error saving profile data:", profileError);
        
        // Try to delete the auth user if profile creation fails
        try {
          console.log('Profile creation failed, trying to clean up auth user...');
          // We can't easily delete the auth user without admin access
          // So we'll leave it and let admin clean up later
        } catch (cleanupError) {
          console.error('Failed to clean up auth user after profile creation failure:', cleanupError);
        }
        
        throw new Error(`Database error saving new user: ${profileError.message || 'Unknown error'}`);
      }

      // In development mode, show success message and redirect without actual email confirmation
      if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true') {
        console.log('Development mode: Bypassing email confirmation');
        router.push('/dashboard');
        return;
      }

      // In production, redirect to signin page with registered flag
      router.push('/auth/signin?registered=true');
    } catch (error: any) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };

  const resetPassword = async (password: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      router.push('/auth/signin?reset=true');
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user...');
      
      // First, sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('Sign out successful, clearing cookies and redirecting to signin page...');
      
      // Clear cookies explicitly to ensure proper sign out
      const projectRef = 'kiotgupdmepdyiscbrmb'; // Your Supabase project ref
      
      // Clear all possible Supabase cookies
      document.cookie = `sb-${projectRef}-access-token=; path=/; max-age=0; SameSite=Lax`;
      document.cookie = `sb-${projectRef}-refresh-token=; path=/; max-age=0; SameSite=Lax`;
      document.cookie = `sb-${projectRef}-auth-token=; path=/; max-age=0; SameSite=Lax`;
      document.cookie = `sb-access-token=; path=/; max-age=0; SameSite=Lax`;
      document.cookie = `sb-refresh-token=; path=/; max-age=0; SameSite=Lax`;
      
      // Reset state
      setUser(null);
      setSession(null);

      // Add a short delay to ensure cookies are cleared before redirect
      setTimeout(() => {
        // Use window.location.href for a full page refresh and navigation
        window.location.href = '/auth/signin';
      }, 100);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    forgotPassword,
    resetPassword,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 