import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Retrieves the complete user profile from Supabase
 * @param supabase - The Supabase client instance
 * @returns The user profile data or null if user is not authenticated
 */
export async function getUserProfileData(supabase: SupabaseClient) {
  try {
    // Get the user's session
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    // Log auth user data for debugging
    console.log('Auth user data:', JSON.stringify({
      id: user?.id,
      email: user?.email,
      has_metadata: user?.user_metadata ? true : false,
      metadata_keys: user?.user_metadata ? Object.keys(user.user_metadata) : []
    }, null, 2));
    
    // If no authenticated user, return null
    if (!user?.id) {
      console.log('No authenticated user found');
      return null
    }
    
    console.log('Fetching user profile data for ID:', user.id);
    
    // First check if the amsc_2025_user table exists
    const { data: tableInfo, error: tableError } = await supabase
      .from('amsc_2025_user')
      .select('id')
      .limit(1);
    
    if (tableError) {
      console.error('Error checking amsc_2025_user table:', tableError);
      
      // Check if profiles table exists as fallback
      const { data: profilesInfo, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
        
      if (!profilesError) {
        console.log('Trying to fetch from profiles table instead');
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (!profileError && profileData) {
          console.log('Found data in profiles table:', profileData);
          return profileData;
        }
      }
    }
    
    // Fetch the user's profile data
    const { data: profile, error } = await supabase
      .from('amsc_2025_user')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (error) {
      console.error('Error fetching user profile:', error);
      
      // If the error is because the user doesn't exist in the table,
      // try to create a profile from auth metadata
      if (error.code === 'PGRST116') {
        console.log('User profile not found, creating from auth metadata');
        console.log('Auth metadata available:', user.user_metadata);
        
        // Create a basic profile with required fields
        const metaProfile: Record<string, any> = {
          id: user.id,
          email: user.email,
        };
        
        // Safely add fields if they exist in metadata
        if (user.user_metadata?.company_name) metaProfile.company_name = user.user_metadata.company_name;
        if (user.user_metadata?.booth_number) metaProfile.booth_number = user.user_metadata.booth_number;
        if (user.user_metadata?.contact_person) metaProfile.contact_person = user.user_metadata.contact_person;
        if (user.user_metadata?.telephone) metaProfile.tel = user.user_metadata.telephone;
        if (user.user_metadata?.telephone) metaProfile.telephone = user.user_metadata.telephone;
        if (user.user_metadata?.address) metaProfile.address = user.user_metadata.address;
        
        // Optional fields
        if (user.user_metadata?.postcode) metaProfile.postcode = user.user_metadata.postcode;
        if (user.user_metadata?.state) metaProfile.state = user.user_metadata.state;
        if (user.user_metadata?.country) metaProfile.country = user.user_metadata.country;
        if (user.user_metadata?.tax_identification_number) metaProfile.tax_identification_number = user.user_metadata.tax_identification_number;
        
        console.log('Created profile data from metadata:', metaProfile);
        
        // Check if we have enough data to create a profile
        const hasRequiredFields = metaProfile.company_name && metaProfile.booth_number;
        
        if (hasRequiredFields) {
          try {
            console.log('Attempting to insert profile into amsc_2025_user table');
            const { data: createdProfile, error: createError } = await supabase
              .from('amsc_2025_user')
              .insert(metaProfile)
              .select()
              .single();
              
            if (createError) {
              console.error('Error creating profile from metadata:', createError);
              
              // As a fallback, create profile with separate API call
              try {
                console.log('Attempting to create profile with API call');
                const response = await fetch('/api/create-user-profile', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(metaProfile),
                });
                
                if (response.ok) {
                  console.log('Successfully created profile via API');
                  const apiResult = await response.json();
                  console.log('API response:', apiResult);
                  
                  // Try to fetch the newly created profile
                  const { data: refreshedProfile } = await supabase
                    .from('amsc_2025_user')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                    
                  if (refreshedProfile) {
                    console.log('Successfully retrieved newly created profile');
                    return refreshedProfile;
                  }
                }
              } catch (apiError) {
                console.error('Error with API profile creation:', apiError);
              }
              
              // As a fallback, just return what we have from metadata
              // This ensures the UserDataContainer will at least show something
              return {
                id: user.id,
                company_name: user.user_metadata?.company_name,
                booth_number: user.user_metadata?.booth_number,
                contact_person: user.user_metadata?.contact_person,
                tel: user.user_metadata?.telephone,
                telephone: user.user_metadata?.telephone,
                address: user.user_metadata?.address,
                email: user.email,
                postcode: user.user_metadata?.postcode,
                state: user.user_metadata?.state,
                country: user.user_metadata?.country,
                fax: user.user_metadata?.fax,
              };
            }
            
            console.log('Created profile from auth metadata:', createdProfile);
            return createdProfile;
          } catch (e) {
            console.error('Exception creating profile:', e);
            
            // Return metadata as a fallback
            return {
              id: user.id,
              company_name: user.user_metadata?.company_name,
              booth_number: user.user_metadata?.booth_number,
              contact_person: user.user_metadata?.contact_person,
              tel: user.user_metadata?.telephone,
              telephone: user.user_metadata?.telephone,
              address: user.user_metadata?.address,
              email: user.email,
              postcode: user.user_metadata?.postcode,
              state: user.user_metadata?.state,
              country: user.user_metadata?.country,
              fax: user.user_metadata?.fax,
            };
          }
        } else {
          console.log('Not enough metadata to create profile');
        }
      }
      
      // Return minimal data from auth if no profile exists
      return {
        id: user.id,
        company_name: user.user_metadata?.company_name,
        booth_number: user.user_metadata?.booth_number,
        contact_person: user.user_metadata?.contact_person,
        tel: user.user_metadata?.telephone,
        telephone: user.user_metadata?.telephone,
        address: user.user_metadata?.address,
        email: user.email,
        postcode: user.user_metadata?.postcode,
        state: user.user_metadata?.state,
        country: user.user_metadata?.country,
        fax: user.user_metadata?.fax,
      };
    }
    
    // Ensure tel field exists for UserDataContainer (can use either tel or telephone)
    const normalizedProfile = { ...profile };
    if (!normalizedProfile.tel && normalizedProfile.telephone) {
      normalizedProfile.tel = normalizedProfile.telephone;
    } else if (!normalizedProfile.telephone && normalizedProfile.tel) {
      normalizedProfile.telephone = normalizedProfile.tel;
    }
    
    console.log('User profile data fetched successfully:', normalizedProfile);
    return normalizedProfile;
  } catch (error) {
    console.error('Error retrieving user profile data:', error)
    return null
  }
}

/**
 * Simplified version of getUserProfileData for dashboard components
 * This function gets data from either amsc_2025_user or profiles table
 */
export async function getDashboardUserData(supabase: SupabaseClient) {
  try {
    // Get the user's session
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    // If no authenticated user, return null
    if (!user?.id) {
      console.log('No authenticated user found for dashboard');
      return null
    }
    
    console.log('Fetching dashboard user data for ID:', user.id);
    
    // First try the amsc_2025_user table (primary data source)
    const { data: amscUser, error: amscError } = await supabase
      .from('amsc_2025_user')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (!amscError && amscUser) {
      console.log('Found user data in amsc_2025_user table');
      return {
        id: amscUser.id,
        company_name: amscUser.company_name,
        contact_person: amscUser.contact_person,
        booth_number: amscUser.booth_number,
        email: amscUser.email || user.email,
        telephone: amscUser.telephone || amscUser.tel,
      };
    }
    
    // If not found in amsc_2025_user, try the profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (!profileError && profileData) {
      console.log('Found user data in profiles table');
      return {
        id: profileData.id,
        company_name: profileData.company_name,
        contact_person: profileData.first_name && profileData.last_name 
          ? `${profileData.first_name} ${profileData.last_name}`
          : null,
        booth_number: profileData.booth_number,
        email: profileData.email || user.email,
        telephone: profileData.telephone,
      };
    }
    
    // As a last resort, try to get data from user metadata
    console.log('Falling back to user metadata for dashboard');
    return {
      id: user.id,
      company_name: user.user_metadata?.company_name,
      contact_person: user.user_metadata?.contact_person,
      booth_number: user.user_metadata?.booth_number,
      email: user.email,
      telephone: user.user_metadata?.telephone,
    };
  
  } catch (error) {
    console.error('Error retrieving dashboard user data:', error);
    return null;
  }
} 