import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../../lib/supabaseClient';

// Create auth context
const AuthContext = createContext(null);

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active session when the component mounts
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session) {
        console.log('%c Session found:', 'color: #4CAF50; font-weight: bold', session);
        // If we have a session, fetch user data from our users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (!userError) {
          // Combine auth data with profile data
          setUser({ ...session.user, ...userData });
        } else {
          console.error('%c Error fetching user data:', 'color: #FF5252; font-weight: bold', userError);
          setUser(session.user);
        }
      } else {
        setUser(null);
        if (error) {
          console.error('%c Session error:', 'color: #FF5252; font-weight: bold', error);
        }
      }
      
      setLoading(false);
    };

    getSession();

    // Set up listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('%c Auth state changed:', 'color: #2196F3; font-weight: bold', event);
        
        if (session) {
          // When auth state changes with a valid session
          console.log('%c New session established:', 'color: #4CAF50; font-weight: bold', session);
          
          // Fetch user data from our users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (!userError) {
            // Combine auth data with profile data
            setUser({ ...session.user, ...userData });
          } else {
            console.error('%c Error fetching user data:', 'color: #FF5252; font-weight: bold', userError);
            setUser(session.user);
          }
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Sign out function
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('%c Error signing out:', 'color: #FF5252; font-weight: bold', error);
    } else {
      setUser(null);
      window.location.href = '/';
    }
  };

  // Auth context value
  const value = {
    user,
    loading,
    signOut,
    isAuthenticated: !!user
  };

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