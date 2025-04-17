'use client';

import { createContext, useContext, useEffect, useState } from 'react';
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
  fax?: string;
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
            setSession(newSession);
            setUser(newSession?.user ?? null);
            
            // On successful sign-in, refresh the current route
            // The middleware should then detect the session and redirect.
            if (event === 'SIGNED_IN') {
              console.log('Detected SIGNED_IN event, refreshing route...');
              router.refresh(); 
            }
          }
        );
        
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
  }, []); // Remove router from dependency array

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
      
      // SIMPLIFIED LOGIN APPROACH
      console.log('Using simplified login approach...');
      
      // 1. Sign out first to clear any existing sessions
      await supabase.auth.signOut();
      
      // 2. Wait a moment to ensure the session is cleared
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 3. Sign in with password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });
      
      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      
      console.log('Login successful for user ID:', data.user?.id);
      
      // Store session in context - This is the correct way
      setUser(data.user);
      setSession(data.session);

      // WORKAROUND: Explicitly set cookies to ensure they're accessible to the server
      if (data.session) {
        try {
          console.log('Setting explicit auth cookies for server access');
          
          // Set access token cookie
          document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=3600; SameSite=Lax`;
          
          // Set refresh token cookie
          if (data.session.refresh_token) {
            document.cookie = `sb-refresh-token=${data.session.refresh_token}; path=/; max-age=2592000; SameSite=Lax`;
          }
        } catch (cookieError) {
          console.error('Error setting explicit cookies:', cookieError);
        }
      }

      // After successful sign-in, first refresh the route
      // to ensure cookies are set in the browser
      router.refresh();
      
      // Then explicitly redirect to dashboard after a short delay
      // This ensures the cookies have time to be processed
      console.log('Redirecting to dashboard...');
      setTimeout(() => {
        // Use direct browser navigation instead of Next.js router
        console.log('Executing redirect to dashboard...');
        window.location.href = '/dashboard';
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
            // Only include optional fields if they exist
            ...(profile.postcode ? { postcode: profile.postcode } : {}),
            ...(profile.state ? { state: profile.state } : {}),
            ...(profile.country ? { country: profile.country } : {}),
            ...(profile.fax ? { fax: profile.fax } : {})
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
          fax: profile.fax
        };
        
        const response = await fetch('/api/create-user-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userProfileData),
        });
        
        // Check for error response from API
        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch (e) {
            console.error('Failed to parse error response:', e);
            throw new Error(`API error (${response.status}): Unable to create user profile`);
          }
          
          console.error('Failed to create user profile via API:', errorData);
          throw new Error(errorData.error || 'Failed to create user profile via API');
        }
        
        console.log('User profile created successfully via API');
        
        // Step 3: Set the user and session in the context
        setUser(authData.user);
        if (authData.session) {
          setSession(authData.session);
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/auth/signin');
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