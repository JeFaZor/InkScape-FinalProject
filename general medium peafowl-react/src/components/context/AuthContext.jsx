import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../../lib/supabaseClient';

const USER_DATA_CACHE_KEY = 'inkscape_user_data_cache';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchUserData = async (userId) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();  
        
      if (userError || !userData) {
        return null;
      }

      // If user is an artist, fetch their profile image
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
      
      return userData;
    } catch (error) {
      return null;
    }
  };

  const updateUserState = async (session) => {
    try {
      if (session) {
        // Check for cached user data
        let cachedUserData = null;
        try {
          const cachedData = localStorage.getItem(USER_DATA_CACHE_KEY);
          if (cachedData) {
            const parsed = JSON.parse(cachedData);
            if (parsed && parsed.id === session.user.id) {
              cachedUserData = parsed;
            }
          }
        } catch (cacheError) {
          // Continue without cache
        }

        if (cachedUserData) {
          setUser(cachedUserData);
        } else {
          setUser(session.user);
        }

        // Always fetch fresh data from server
        const userData = await fetchUserData(session.user.id);

        if (userData) {
          const completeUserData = { ...session.user, ...userData };
          setUser(completeUserData);
          
          // Cache the complete user data
          try {
            localStorage.setItem(USER_DATA_CACHE_KEY, JSON.stringify(completeUserData));
          } catch (cacheError) {
            // Continue without caching
          }
        }
      } else {
        setUser(null);
        localStorage.removeItem(USER_DATA_CACHE_KEY);
      }
    } catch (error) {
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
      setLoading(true);

      try {
        // First, check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          setLoading(false);
          return;
        }

        // Handle the current session state
        await updateUserState(session);

        // Set up auth state change listener
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            await updateUserState(newSession);
          }
        );

        // Return cleanup function
        return () => {
          if (authListener && authListener.subscription) {
            authListener.subscription.unsubscribe();
          }
        };
      } catch (error) {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      setUser(null);
      localStorage.removeItem(USER_DATA_CACHE_KEY);
      
      await supabase.auth.signOut();
      
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error) {
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signOut,
    isAuthenticated: !!user,
    initialized
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}