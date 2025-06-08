import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';

const USER_DATA_CACHE_KEY = 'inkscape_user_data_cache';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const currentSessionRef = useRef(null);

  const fetchUserData = useCallback(async (userId) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();  
        
      if (userError || !userData) {
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
      
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }, []);

  const hasSessionChanged = useCallback((newSession) => {
    const currentSession = currentSessionRef.current;
    
    if (!currentSession && newSession) {
      return true;
    }
    
    if (currentSession && !newSession) {
      return true;
    }
    
    if (!currentSession && !newSession) {
      return false;
    }
    
    if (currentSession && newSession) {
      return currentSession.access_token !== newSession.access_token;
    }
    
    return false;
  }, []);

  const updateUserState = useCallback(async (session) => {
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
          console.error('Cache error:', cacheError);
        }

        if (cachedUserData) {
          setUser(cachedUserData);
        } else {
          setUser(session.user);
        }

        // Fetch fresh data from server
        const userData = await fetchUserData(session.user.id);

        if (userData) {
          const completeUserData = { ...session.user, ...userData };
          setUser(completeUserData);
          
          try {
            localStorage.setItem(USER_DATA_CACHE_KEY, JSON.stringify(completeUserData));
          } catch (cacheError) {
            console.error('Cache storage error:', cacheError);
          }
        }
      } else {
        setUser(null);
        try {
          localStorage.removeItem(USER_DATA_CACHE_KEY);
        } catch (error) {
          console.error('Error removing cache:', error);
        }
      }
    } catch (error) {
      console.error('Error updating user state:', error);
      if (session) {
        setUser(session.user);
      }
    } finally {
      setLoading(false);
      if (!initialized) setInitialized(true);
    }
  }, [fetchUserData, initialized]);

  useEffect(() => {
    let isMounted = true;
    let authListener = null;

    const initializeAuth = async () => {
      if (!isMounted) return;
      
      setLoading(true);

      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Session error:', error);
          if (isMounted) setLoading(false);
          return;
        }

        if (isMounted) {
          currentSessionRef.current = session;
          await updateUserState(session);
        }

        if (isMounted) {
          const { data } = supabase.auth.onAuthStateChange(
            async (event, newSession) => {
              if (!isMounted) return;
              
              console.log('Auth state changed:', event);
              
              if (hasSessionChanged(newSession)) {
                console.log('Session actually changed - updating user state');
                currentSessionRef.current = newSession;
                await updateUserState(newSession);
              } else {
                console.log('Session unchanged - skipping update (tab focus/blur)');
                if (loading) {
                  setLoading(false);
                }
              }
            }
          );
          authListener = data;
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
      currentSessionRef.current = null;
    };
  }, []);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      setUser(null);
      currentSessionRef.current = null;
      
      try {
        localStorage.removeItem(USER_DATA_CACHE_KEY);
      } catch (error) {
        console.error('Error removing cache on signout:', error);
      }
      
      await supabase.auth.signOut();
      
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error) {
      console.error('Error signing out:', error);
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  }, []);

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