import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../../lib/supabaseClient';
const USER_DATA_CACHE_KEY = 'inkscape_user_data_cache';


// Create auth context
const AuthContext = createContext(null);

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchUserData = async (userId) => {
    try {
      console.log('Fetching user data for ID:', userId);
      
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();  
        
      if (userError) {
        console.error('Error fetching user data:', userError);
        return null;
      }
      
      if (!userData) {
        console.log('No user data found for ID:', userId);
        return null;
      }
      

      if (userData.user_type === 'artist') {
     
        const { data: artistData, error: artistError } = await supabase
          .from('artist_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
          
        if (!artistError && artistData) {
          
          userData.profile_image_url = artistData.profile_image_url;
       
        }
      }
      
      console.log('User data fetched successfully:', userData);
      return userData;
    } catch (error) {
      console.error('Exception fetching user data:', error);
      return null;
    }
  };

  // Unified method to handle user state updates
  const updateUserState = async (session) => {
    try {
      if (session) {
        console.log('Setting user from session, ID:', session.user.id);

        // Check if we have cached user data first
        let cachedUserData = null;
        try {
          const cachedData = localStorage.getItem(USER_DATA_CACHE_KEY);
          if (cachedData) {
            const parsed = JSON.parse(cachedData);
            // Verify it's the same user before using cache
            if (parsed && parsed.id === session.user.id) {
              cachedUserData = parsed;
              console.log('Using cached user data');
            }
          }
        } catch (cacheError) {
          console.warn('Error reading from cache:', cacheError);
        }

        // If we have valid cached data, use it immediately
        if (cachedUserData) {
          setUser(cachedUserData);
        } else {
          // Set basic user info immediately to prevent loading state issues
          setUser(session.user);
        }

        // Always fetch fresh data from server
        const userData = await fetchUserData(session.user.id);

        if (userData) {
          // Create a complete user object
          const completeUserData = { ...session.user, ...userData };

          // Update state with complete data
          setUser(completeUserData);
          console.log('User data fully loaded:', completeUserData);

          // Cache the complete user data
          try {
            localStorage.setItem(USER_DATA_CACHE_KEY, JSON.stringify(completeUserData));
          } catch (cacheError) {
            console.warn('Error caching user data:', cacheError);
          }
        } else {
          console.log('No user profile data found, using basic session data');
        }
      } else {
        console.log('No session, clearing user state');
        setUser(null);
        // Clear cache when session ends
        localStorage.removeItem(USER_DATA_CACHE_KEY);
      }
    } catch (error) {
      console.error('Error updating user state:', error);
      // Still set the basic user info to prevent blank state
      if (session) {
        setUser(session.user);
      }
    } finally {
      setLoading(false);
      if (!initialized) setInitialized(true);
    }
  };
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('Initializing auth state...');
      setLoading(true);

      try {
        // First, check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        console.log('Initial session check:', session ? 'Session found' : 'No session');

        // Handle the current session state
        await updateUserState(session);

        // Set up auth state change listener
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log('Auth state changed:', event);
            await updateUserState(newSession);
          }
        );

        // Return cleanup function
        return () => {
          console.log('Cleaning up auth listener');
          if (authListener && authListener.subscription) {
            authListener.subscription.unsubscribe();
          }
        };
      } catch (error) {
        console.error('Error in auth initialization:', error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Sign out function
  // Improved sign out function with better error handling and state management
  const signOut = async () => {
    try {
      console.log('Signing out user');
      setLoading(true);

      // Set user to null first to prevent UI issues during sign out
      setUser(null);

      // Clear user data cache
      localStorage.removeItem(USER_DATA_CACHE_KEY);

      // Then perform the actual sign out
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Supabase signOut error:', error);
        // Don't throw, continue with local cleanup
      }

      console.log('Sign out successful');

      // Redirect to home page after a slight delay
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error) {
      console.error('Error during sign out process:', error);
      // Force redirect anyway in case of error
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  // Enhanced context value with debugging info
  const value = {
    user,
    loading,
    signOut,
    isAuthenticated: !!user,
    initialized,
    authStatus: {
      hasUser: !!user,
      isLoading: loading,
      isInitialized: initialized
    }
  };

  // Log state changes for debugging
  useEffect(() => {
    console.log('Auth context state updated:', {
      hasUser: !!user,
      userId: user?.id,
      isLoading: loading,
      isInitialized: initialized
    });
  }, [user, loading, initialized]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}