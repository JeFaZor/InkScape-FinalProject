import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../../lib/supabaseClient';

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
      
      // שינוי: במקום .single(), נשתמש ב-.maybeSingle() שלא יזרוק שגיאה אם אין תוצאות
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();  // שינוי כאן
        
      if (userError) {
        console.error('Error fetching user data:', userError);
        return null;
      }
      
      if (!userData) {
        console.log('No user data found for ID:', userId);
        return null;
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
    if (session) {
      console.log('Setting user from session, ID:', session.user.id);
      
      // Fetch additional user data
      const userData = await fetchUserData(session.user.id);
      
      if (userData) {
        // Combine auth data with profile data
        setUser({ ...session.user, ...userData });
      } else {
        // Fallback to just session user if we couldn't get profile data
        setUser(session.user);
      }
    } else {
      console.log('No session, clearing user state');
      setUser(null);
    }
    
    setLoading(false);
    if (!initialized) setInitialized(true);
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
  const signOut = async () => {
    try {
      console.log('Signing out user');
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      console.log('Sign out successful');
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
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