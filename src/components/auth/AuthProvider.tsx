'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/config';
import { createClient } from '@supabase/supabase-js';

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

// Function to create an admin client for direct database access
const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase admin credentials');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function initializeAuth() {
      try {
        setLoading(true);
        
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
            console.log('Auth state changed:', event);
            setSession(newSession);
            setUser(newSession?.user ?? null);
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
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in with:', { email });
      
      // In development mode with mock auth enabled, allow login with any credentials for testing
      if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true') {
        console.log('Mock authentication enabled: Bypassing authentication');
        
        // Set a timeout to simulate network request
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Force navigation to dashboard - more reliable than router
        console.log('Navigating to dashboard...');
        
        // Try multiple approaches to ensure the redirect works
        setTimeout(() => {
          // Fallback approach - direct page change
          window.location.href = '/dashboard';
        }, 100);
        
        return;
      }
      
      // In production or when mock auth is disabled, use Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });
      
      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      
      console.log('Sign in successful, redirecting to dashboard');
      
      // Set user and session state
      if (data && data.user) {
        setUser(data.user);
        setSession(data.session);
      }
      
      // Ensure we have a clean redirect to dashboard
      // Using replace instead of push to prevent back button issues
      window.location.href = '/dashboard';
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
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
      const { error } = await supabase.auth.updateUser({
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