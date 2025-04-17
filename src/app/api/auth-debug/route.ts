import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  // Collect all debug information
  const debug: {
    cookies: any;
    supabaseCookies: any;
    sessionCheck: any;
    headers: any;
    environment: any;
  } = {
    cookies: {},
    supabaseCookies: {},
    sessionCheck: {},
    headers: {},
    environment: {}
  };

  try {
    // Get all cookies
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();
    
    debug.cookies = {
      count: allCookies.length,
      list: allCookies.map(c => ({ 
        name: c.name, 
        value: c.name.startsWith('sb-') ? '[REDACTED]' : c.value.substring(0, 10) + '...',
      }))
    };
    
    // Look for Supabase cookies specifically
    const supabaseCookies = allCookies.filter(c => c.name.startsWith('sb-'));
    debug.supabaseCookies = {
      found: supabaseCookies.length > 0,
      count: supabaseCookies.length,
      names: supabaseCookies.map(c => c.name),
    };

    // Try to get the user session
    const supabase = createSupabaseServerClient();
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    debug.sessionCheck = {
      success: !!sessionData && !sessionError,
      hasSession: !!sessionData?.session,
      error: sessionError ? {
        message: sessionError.message,
        name: sessionError.name,
      } : null,
    };

    // Check auth user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    debug.sessionCheck.user = {
      success: !!userData && !userError,
      hasUser: !!userData?.user,
      userId: userData?.user?.id || null,
      email: userData?.user?.email || null,
      error: userError ? {
        message: userError.message,
        name: userError.name,
      } : null,
    };

    // Get request headers
    debug.headers = {
      host: request.headers.get('host'),
      referrer: request.headers.get('referer'),
      userAgent: request.headers.get('user-agent'),
    };

    // Environment info (safe to expose)
    debug.environment = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      nodeEnv: process.env.NODE_ENV,
    };

    return NextResponse.json({ success: true, debug }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: (error as Error).message,
        debug 
      }, 
      { status: 500 }
    );
  }
} 