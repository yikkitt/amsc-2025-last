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
  fax?: string;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, profile: UserProfile) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Use the appropriate client based on context
const supabase = getSupabaseBrowserClient(); // For browser interactions like auth state changes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
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

  // Function to clear any existing session
  const clearSession = async () => {
    try {
      // Clear existing session without redirecting
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) {
        console.error('Error clearing existing session:', error);
      }
      
      // Clear local state
      setSession(null);
      setUser(null);
      
      // Clear auth cookies
      const projectRef = supabaseUrl.match(/([^.]+)\.supabase\.co/)?.[1];
      if (projectRef) {
        try {
          // Using the browser cookie API directly since we're in client code
          document.cookie = `sb-${projectRef}-auth-token=; path=/; max-age=0; samesite=lax`;
        } catch (cookieError) {
          console.error("Error removing auth cookies:", cookieError);
        }
      }
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      // Clear any previous session to avoid conflicts
      await clearSession();

      // Use Supabase auth to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Set the session in the cookies
      if (data?.session) {
        // Set auth cookie for server-side auth
        const { access_token, refresh_token } = data.session;
        
        // Extract the project reference from the Supabase URL
        const projectRef = supabaseUrl.match(/([^.]+)\.supabase\.co/)?.[1];
        
        if (projectRef) {
          try {
            console.log("Setting auth cookie with project ref:", projectRef);
            
            // Set the main auth token cookie that middleware expects
            document.cookie = `sb-${projectRef}-auth-token=${JSON.stringify(data.session)}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
            
            // Also set individual token cookies
            document.cookie = `sb-${projectRef}-access-token=${access_token}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
            document.cookie = `sb-${projectRef}-refresh-token=${refresh_token}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
            
            // For backward compatibility
            document.cookie = `sb-access-token=${access_token}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
            document.cookie = `sb-refresh-token=${refresh_token}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
          } catch (cookieError) {
            console.error("Error setting auth cookies:", cookieError);
          }
        }

        // Set the user in state
        setUser(data.session.user);
        
        console.log("Sign-in successful! User:", data.session.user.email);
        console.log("Session established, preparing navigation...");
        
        // Three-phase approach for robust session handling:
        // 1. Force a refresh to ensure session is available in middleware
        // 2. Short delay to allow cookies to propagate
        // 3. Navigate to dashboard
        router.refresh();
        
        // Increase timeout to ensure cookies are fully processed
        setTimeout(() => {
          console.log("Navigating to dashboard...");
          router.push('/dashboard');
        }, 1000);
      }

      return { success: true };
    } catch (error: any) {
      console.error("Sign-in error:", error.message);
      return {
        success: false,
        error: error.message,
      };
    } finally {
      setIsLoading(false);
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

  const signOut = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      console.log("Signing out user...");
      await supabase.auth.signOut();
      
      // Clear state
      setUser(null);
      setSession(null);
      
      // Delete all auth cookies
      const projectRef = supabaseUrl.match(/([^.]+)\.supabase\.co/)?.[1];
      if (projectRef) {
        try {
          // Clear all possible cookie variations
          const cookiesToClear = [
            `sb-${projectRef}-auth-token`,
            `sb-${projectRef}-access-token`,
            `sb-${projectRef}-refresh-token`,
            `sb-access-token`,
            `sb-refresh-token`,
            `supabase-auth-token`
          ];
          
          cookiesToClear.forEach(cookieName => {
            document.cookie = `${cookieName}=; path=/; max-age=0; samesite=lax`;
          });
          
          console.log("Auth cookies cleared");
        } catch (cookieError) {
          console.error("Error removing auth cookies:", cookieError);
        }
      }
      
      console.log("Sign-out complete, redirecting to sign-in page");
      
      // Redirect to sign-in page
      router.push('/auth/signin');
    } catch (error) {
      console.error("Sign-out error:", error);
    } finally {
      setIsLoading(false);
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