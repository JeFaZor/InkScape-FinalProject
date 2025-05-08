import React, { useState, useEffect } from 'react';
import { Instagram } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { supabase } from '../../lib/supabaseClient';

const AuthScreen = () => {
  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get('mode');
  
  // Set initial state based on mode parameter
  const [isLogin, setIsLogin] = useState(mode !== 'signup');
  const [userType, setUserType] = useState('artist'); // Default to artist
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    location: '',
    locationAddress: '',
    styles: [],
    workImages: [],
    profileImage: null, // Field for profile image
    instagram: '',
    bio: '',
    userType: 'artist' // Initialize form data with userType
  });

  // Add effect to sync userType with formData.userType
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      userType // Update formData when userType changes
    }));
  }, [userType]);
  
  // Style ID mapping
  const styleNameToIdMap = {
    'Traditional': 1,
    'New School': 2,
    'Anime': 3,
    'Fineline': 4,
    'Geometric': 5,
    'Micro Realism': 6,
    'Realism': 7,
    'Dot Work': 8,
    'Dark Art': 9,
    'Flowers': 10,
    'Surrealism': 11,
    'Trash Polka': 12
  };
  
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('%c Current Session:', 'color: #9C27B0; font-weight: bold', {
        session,
        error
      });
      
      // If user is already logged in, redirect to home page
      if (session) {
        window.location.href = '/';
      }
    };
    
    checkSession();
  }, []);

  useEffect(() => {
    // Update login/signup mode when URL query parameter changes
    setIsLogin(mode !== 'signup');
  }, [mode]);

  // Function to upload an image to Supabase Storage
  const uploadImage = async (file, bucketName = 'artist-images') => {
    if (!file) return null;
    
    try {
      // Skip bucket creation - assume it exists
      // Generate a unique filename
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      console.log('%c Uploading file:', 'color: #2196F3; font-weight: bold', { 
        bucket: bucketName, 
        path: filePath, 
        type: file.type,
        size: file.size
      });
      
      // Upload the file
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);
        
      if (error) {
        console.error('%c Storage upload error:', 'color: #FF5252; font-weight: bold', error);
        return null;
      }
      
      console.log('%c Upload successful:', 'color: #4CAF50; font-weight: bold', data);
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
        
      console.log('%c Public URL:', 'color: #2196F3; font-weight: bold', publicUrlData);
      
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('%c Unexpected upload error:', 'color: #FF5252; font-weight: bold', error);
      return null;
    }
  };
  
  // Function to create artist profile
  const createArtistProfile = async (userId, profileData) => {
    try {
      console.log('%c Creating artist profile for user:', 'color: #2196F3; font-weight: bold', userId);
      console.log('%c Profile data:', 'color: #2196F3; font-weight: bold', profileData);
      
      // Create the profile
      const { data, error } = await supabase
        .from('artist_profiles')
        .insert([{
          user_id: userId,
          ...profileData
        }])
        .select();
        
      if (error) {
        console.error('%c Artist profile creation error:', 'color: #FF5252; font-weight: bold', error);
        console.error('%c Error details:', 'color: #FF5252; font-weight: bold', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }
      
      console.log('%c Artist profile created:', 'color: #4CAF50; font-weight: bold', data);
      
      return data[0];
    } catch (error) {
      console.error('%c Failed to create artist profile:', 'color: #FF5252; font-weight: bold', error);
      throw error;
    }
  };
  
  // Function to associate styles with artist
  const createStyleAssociations = async (artistId, styles) => {
    try {
      if (!styles || styles.length === 0) {
        console.log('%c No styles to associate:', 'color: #FFA500; font-weight: bold');
        return [];
      }
      
      // Map style names to IDs
      const stylesData = styles.map(styleName => {
        const styleId = styleNameToIdMap[styleName];
        if (!styleId) {
          console.warn('%c Style not found in mapping:', 'color: #FFA500; font-weight: bold', styleName);
        }
        return styleId ? {
          artist_id: artistId,
          style_id: styleId,
          expertise_level: 3, // Default middle level
          added_at: new Date().toISOString()
        } : null;
      }).filter(Boolean); // Remove null values
      
      if (stylesData.length === 0) {
        console.warn('%c No valid styles to associate:', 'color: #FFA500; font-weight: bold');
        return [];
      }
      
      console.log('%c Associating styles with artist:', 'color: #2196F3; font-weight: bold', {
        artistId,
        styles: stylesData
      });
      
      // Insert style associations
      const { data, error } = await supabase
        .from('styles_artists')
        .insert(stylesData)
        .select();
        
      if (error) {
        console.error('%c Style association error:', 'color: #FF5252; font-weight: bold', error);
        console.error('%c Error details:', 'color: #FF5252; font-weight: bold', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }
      
      console.log('%c Styles associated successfully:', 'color: #4CAF50; font-weight: bold', data);
      
      return data;
    } catch (error) {
      console.error('%c Failed to associate styles:', 'color: #FF5252; font-weight: bold', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    // Critical debug logs
    console.log('%c Form submission - userType State:', 'color: #FF5252; font-weight: bold', userType);
    console.log('%c Form submission - formData.userType:', 'color: #FF5252; font-weight: bold', formData.userType);
    console.log('%c All Form data:', 'color: #2196F3; font-weight: bold', {
      ...formData,
      workImages: formData.workImages ? formData.workImages.map(img => 
        img ? { name: img.name, type: img.type, size: img.size } : null
      ) : [],
      profileImage: formData.profileImage ? {
        name: formData.profileImage.name,
        type: formData.profileImage.type,
        size: formData.profileImage.size
      } : null
    });
    
    // Determine final user type from either state
    const finalUserType = formData.userType || userType;
    console.log('%c Final user type for registration:', 'color: #4CAF50; font-weight: bold', finalUserType);
    
    try {
      if (isLogin) {
        // Handle login - existing code
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
        
        // After successful login, redirect to home page
        window.location.href = '/';
      } else {
        // Handle registration
        console.log('%c Starting signup process...', 'color: #bada55; font-weight: bold');
        console.log('%c Form data:', 'color: #2196F3; font-weight: bold', formData);

        // Basic validation
        if (!formData.firstName || !formData.email || !formData.password) {
          throw new Error('Please fill in all required fields');
        }
        
        // For artist registrations, ensure location and styles are provided
        if (finalUserType === 'artist') {
          if (!formData.location) {
            throw new Error('Please set your studio location');
          }
          
          if (formData.styles.length === 0) {
            throw new Error('Please select at least one tattoo style');
          }
        }

        // Prepare user data for the users table
        const userData = {
          email: formData.email,
          user_type: finalUserType, // Use the determined final type
          first_name: capitalizeFirstLetter(formData.firstName) || '',
          last_name: capitalizeFirstLetter(formData.lastName) || '',
          is_active: true,
          preferences: {},
          created_at: new Date().toISOString()
        };

        console.log('%c User data to be inserted:', 'color: #2196F3; font-weight: bold', userData);

        // 1. Create auth user first
        console.log('%c Creating auth user...', 'color: #2196F3; font-weight: bold');
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (signUpError) {
          console.error('%c Auth Error:', 'color: #FF5252; font-weight: bold', signUpError);
          throw signUpError;
        }

        console.log('%c Auth Successful:', 'color: #4CAF50; font-weight: bold', authData);

        if (!authData.user) {
          throw new Error('Failed to create user account');
        }

        // Use the user ID from authData
        userData.id = authData.user.id;

        // 2. Insert user data into the users table
        console.log('%c Creating user record...', 'color: #2196F3; font-weight: bold');
        const { data: insertedUserData, error: userError } = await supabase
          .from('users')
          .insert([userData])
          .select();

        if (userError) {
          console.error('%c User Insert Error:', 'color: #FF5252; font-weight: bold', userError);
          throw userError;
        }

        console.log('%c User Insert Successful:', 'color: #4CAF50; font-weight: bold', insertedUserData);

        // 3. For artist users, create artist profile and handle styles/images
        if (finalUserType === 'artist') {
          try {
            // Handle profile image upload first
            let profileImageUrl = null;
            if (formData.profileImage) {
              try {
                console.log('%c Uploading profile image...', 'color: #2196F3; font-weight: bold');
                profileImageUrl = await uploadImage(formData.profileImage);
                console.log('%c Profile image uploaded successfully:', 'color: #4CAF50; font-weight: bold', profileImageUrl);
              } catch (uploadError) {
                console.error('%c Error uploading profile image:', 'color: #FF5252; font-weight: bold', uploadError);
              }
            }

            // Upload work images
            console.log('%c Uploading artist work images...', 'color: #2196F3; font-weight: bold');
            const imageUrls = [];

            // Process each work image upload sequentially
            for (let i = 0; i < (formData.workImages || []).length; i++) {
              if (formData.workImages[i]) {
                try {
                  console.log('%c Uploading work image %d...', 'color: #2196F3; font-weight: bold', i + 1);
                  const url = await uploadImage(formData.workImages[i]);

                  if (url) {
                    imageUrls.push(url);
                    console.log('%c Work image %d uploaded successfully:', 'color: #4CAF50; font-weight: bold', i + 1, url);
                  } else {
                    console.warn('%c Failed to upload work image %d', 'color: #FFA500; font-weight: bold', i + 1);
                  }
                } catch (uploadError) {
                  console.error('%c Error uploading work image %d:', 'color: #FF5252; font-weight: bold', i + 1, uploadError);
                  // Continue with other images even if one fails
                }
              }
            }

            console.log('%c Uploaded work image URLs:', 'color: #2196F3; font-weight: bold', imageUrls);

            // Prepare location data as a PostgreSQL point
            let locationPoint = null;
            if (formData.location) {
              try {
                // Parse coordinates from string (e.g. "31.7767,35.2345")
                const [lat, lng] = formData.location.split(',').map(parseFloat);

                // Use PostgreSQL POINT format
                locationPoint = `(${lat},${lng})`;

                console.log('%c Formatted location point:', 'color: #2196F3; font-weight: bold', locationPoint);
              } catch (locationError) {
                console.error('%c Error formatting location:', 'color: #FF5252; font-weight: bold', locationError);
                // Continue without location if there's an error
              }
            }

            // Prepare artist profile data
            const artistProfileData = {
              instagram_handle: formData.instagram || null,
              bio: formData.bio || null,
              location: locationPoint,
              service_area: formData.locationAddress || null,
              avg_rating: 0,
              is_verified: false,
              profile_image_url: profileImageUrl, // Now this is from the dedicated profile image
              recent_works_urls: imageUrls,
              created_at: new Date().toISOString()
            };

            // Create artist profile
            const artistProfile = await createArtistProfile(userData.id, artistProfileData);

            // Associate styles with artist if we have the profile
            if (artistProfile && artistProfile.id) {
              await createStyleAssociations(artistProfile.id, formData.styles);
            } else {
              console.error('%c Cannot associate styles - no valid artist profile:', 'color: #FF5252; font-weight: bold');
            }
          } catch (artistError) {
            console.error('%c Artist profile setup error:', 'color: #FF5252; font-weight: bold', artistError);
            // Continue even if artist profile creation fails
            // The user account is created, they can complete profile later
            setError(`Account created, but there was an error setting up your artist profile: ${artistError.message}`);
          }
        }
        
        // Successfully registered
        setIsLogin(true);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          location: '',
          locationAddress: '',
          styles: [],
          workImages: [],
          profileImage: null,
          instagram: '',
          bio: '',
          userType: 'artist' // Reset to default
        });
        
        // Show success message
        alert('Registration successful! Please check your email and then sign in.');
      }
    } catch (error) {
      console.error('%c Error in submission:', 'color: #FF5252; font-size: 16px; font-weight: bold', {
        message: error.message,
        stack: error.stack
      });
      setError(error.message || 'An error occurred during the process');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    // Change URL based on current mode
    const newMode = isLogin ? 'signup' : 'login';
    window.history.pushState({}, '', `/auth?mode=${newMode}`);
    
    setIsLogin(!isLogin);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      location: '',
      locationAddress: '',
      styles: [],
      workImages: [],
      profileImage: null,
      instagram: '',
      bio: '',
      userType: 'artist' // Reset to default
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
          {/* Display selected user type for signup */}
        
        
          {isLogin && (
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => {
                  setUserType('client');
                  setFormData(prev => ({ ...prev, userType: 'client' }));
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  (formData.userType || userType) === 'client'
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                I'm Looking for a Tattoo
              </button>
              <button
                onClick={() => {
                  setUserType('artist');
                  setFormData(prev => ({ ...prev, userType: 'artist' }));
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  (formData.userType || userType) === 'artist'
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
                userType={formData.userType || userType}
                setUserType={(type) => {
                  setUserType(type);
                  setFormData(prev => ({ ...prev, userType: type }));
                }}
              />
            )}

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 ${
                  isSubmitting 
                    ? 'bg-purple-700 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-700'
                } text-white rounded-lg py-3 font-medium transition-colors`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
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