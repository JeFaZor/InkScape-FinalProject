import React, { useState, useEffect } from 'react';
import { Instagram } from 'lucide-react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { supabase } from '../../lib/supabaseClient';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('client');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    location: '',
    styles: []
  });
  
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('%c Current Session:', 'color: #9C27B0; font-weight: bold', {
        session,
        error
      });
      
      // אם המשתמש כבר מחובר, נעביר אותו לדף הבית
      if (session) {
        window.location.href = '/';
      }
    };
    
    checkSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        // טיפול בהתחברות
        console.log('%c Starting sign in process...', 'color: #bada55; font-weight: bold');
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (error) {
          console.error('%c Sign in Error:', 'color: #FF5252; font-weight: bold', error);
          throw error;
        }
        
        console.log('%c Sign in Successful:', 'color: #4CAF50; font-weight: bold', data);
        
        // לאחר התחברות מוצלחת, נעביר את המשתמש לדף הבית
        window.location.href = '/';
      } else {
        // טיפול בהרשמה - הקוד הקיים שלך להרשמה
        console.log('%c Starting signup process...', 'color: #bada55; font-weight: bold');

        const userData = {
          email: formData.email,
          user_type: userType,
          first_name: formData.username,
          is_active: true,
          preferences: {},
          created_at: new Date().toISOString()
        };

        console.log('%c Data to be inserted:', 'color: #2196F3; font-weight: bold', userData);

        // Create auth user first
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (signUpError) {
          console.error('%c Auth Error:', 'color: #FF5252; font-weight: bold', signUpError);
          throw signUpError;
        }

        console.log('%c Auth Successful:', 'color: #4CAF50; font-weight: bold', authData);

        if (authData.user) {
          // Use the user ID from authData
          userData.id = authData.user.id;  // Add the user ID to our data

          const { data: insertedData, error: userError } = await supabase
            .from('users')
            .insert([userData])
            .select();

          if (userError) {
            console.error('%c Database Insert Error:', 'color: #FF5252; font-size: 14px; font-weight: bold', {
              message: userError.message,
              code: userError.code,
              details: userError.details,
              hint: userError.hint
            });
            throw userError;
          }

          console.log('%c Database Insert Successful:', 'color: #4CAF50; font-weight: bold', insertedData);
          
          // אם הגענו לכאן, הכל עבד בהצלחה
          setIsLogin(true);
          setFormData({
            username: '',
            email: '',
            password: '',
            location: '',
            styles: []
          });
          
          alert('Registration successful! Please check your email and then sign in.');
        }
      }
    } catch (error) {
      console.error('%c Error in submission:', 'color: #FF5252; font-size: 16px; font-weight: bold', {
        message: error.message,
        stack: error.stack
      });
      setError(error.message);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: '',
      email: '',
      password: '',
      location: '',
      styles: []
    });
  };

  return (
    <div className="bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-150/15 via-black to-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
      {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
            <p className="text-red-500 text-sm text-center">{error}</p>
          </div>
        )}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-400">
            {isLogin ? 'Enter your details to sign in' : 'Enter your details to get started'}
          </p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-purple-600/20">
          {isLogin && (
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setUserType('client')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  userType === 'client'
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                I'm Looking for a Tattoo
              </button>
              <button
                onClick={() => setUserType('artist')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  userType === 'artist'
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                I'm a Tattoo Artist
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isLogin ? (
              <SignInForm formData={formData} setFormData={setFormData} />
            ) : (
              <SignUpForm 
                formData={formData} 
                setFormData={setFormData}
                userType={userType}
                setUserType={setUserType}
              />
            )}

            <div className="space-y-4">
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-3 font-medium transition-colors"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>

              {!isLogin && (
                <p className="text-xs text-center text-gray-400">
                  By creating an account, you agree to our{' '}
                  <a href="#" className="text-purple-400 hover:text-purple-300">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-purple-400 hover:text-purple-300">Privacy Policy</a>
                </p>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-400 bg-gray-900">or</span>
              </div>
            </div>

            {userType === 'artist' ? (
              <button
                type="button"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-lg py-3 font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Instagram className="w-5 h-5" />
                <span>Continue with Instagram</span>
              </button>
            ) : (
              <button
                type="button"
                className="w-full bg-gray-800 hover:bg-gray-700 text-white rounded-lg py-3 font-medium transition-colors border border-gray-700"
              >
                Continue with Google
              </button>
            )}

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={switchMode}
                className="text-purple-400 hover:text-purple-300 text-sm"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;