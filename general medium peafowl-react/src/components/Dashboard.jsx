import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import {
  User,
  MapPin,
  Instagram,
  Image as ImageIcon,
  Edit,
  Save,
  X,
  Upload,
  Loader2,
  Star
} from 'lucide-react';

// Helper function to get location in current language
const getLocationInCurrentLanguage = async (coordinates, language) => {
  if (!coordinates || !coordinates.includes(',')) {
    return coordinates;
  }

  try {
    const cleanCoordinates = coordinates.replace(/[()]/g, '');
    const [lat, lng] = cleanCoordinates.split(',').map(coord => parseFloat(coord.trim()));

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=${language}&addressdetails=1&zoom=18`
    );

    const data = await response.json();

    if (data && data.display_name) {
      const parts = data.display_name.split(',');
      const relevantParts = parts
        .slice(0, 3)
        .map(part => part.trim())
        .filter(part => part && !/^\d+$/.test(part));

      return relevantParts.join(', ');
    }

    return coordinates;
  } catch (error) {
    console.error('Error getting location:', error);
    return coordinates;
  }
};

// Style ID mapping for tattoo styles
const styleNameToIdMap = {
  'Traditional': 1,
  'New School': 2,
  'Japanese': 3,
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

// Reverse mapping for ID to name conversion
const styleIdToNameMap = Object.fromEntries(
  Object.entries(styleNameToIdMap).map(([name, id]) => [id, name])
);

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  useEffect(() => {
    // Force re-render when language changes
  }, [i18n.language]);

  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [artistProfile, setArtistProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);

  // State for editable fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    instagram: '',
    location: '',
    styles: []
  });

  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [displayLocation, setDisplayLocation] = useState('');
  const [editableLocation, setEditableLocation] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  // References for file inputs
  const profileImageRef = React.useRef(null);

  // List of tattoo styles
  const tattooStyles = [
    'Traditional', 'New School', 'Japanese', 'Fineline', 'Geometric',
    'Micro Realism', 'Realism', 'Dot Work', 'Dark Art', 'Flowers',
    'Surrealism', 'Trash Polka'
  ];

  // Fetch artist profile data
  useEffect(() => {
    const fetchArtistProfile = async () => {
      if (!user) return;
      if (document.visibilityState !== 'visible') return;

      try {
        setLoading(true);

        const { data: profileData, error: profileError } = await supabase
          .from('artist_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
          throw profileError;
        }

        let artistStyles = [];
        if (profileData && profileData.id) {
          const { data: stylesData, error: stylesError } = await supabase
            .from('styles_artists')
            .select('style_id')
            .eq('artist_id', profileData.id);

          if (!stylesError && stylesData) {
            artistStyles = stylesData
              .map(item => styleIdToNameMap[item.style_id])
              .filter(Boolean);
          }
        }

        setArtistProfile(profileData || null);

        setFormData({
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          bio: profileData?.bio || '',
          instagram: profileData?.instagram_handle || '',
          location: profileData?.location || '', 
          styles: artistStyles
        });

        if (profileData?.profile_image_url) {
          setProfileImageUrl(profileData.profile_image_url);
        }

        if (profileData?.recent_works_urls && Array.isArray(profileData.recent_works_urls)) {
          const existingImages = profileData.recent_works_urls.map((url, index) => ({
            id: `existing_${index}`,
            url: url,
            file: null,
            isNew: false
          }));
          setPortfolioImages(existingImages);
        }
      } catch (error) {
        console.error('Error in profile fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistProfile();
  }, [user]);

  useEffect(() => {
    const updateLocation = async () => {
      if (formData.location) {
        const currentLang = i18n.language === 'he' ? 'he' : 'en';
        const locationText = await getLocationInCurrentLanguage(formData.location, currentLang);
        setDisplayLocation(locationText);
      }
    };
  
    updateLocation();
  }, [formData.location, i18n.language]);

  // Search for location suggestions
  const searchLocationSuggestions = async (query) => {
    if (!query.trim() || query.length < 3) {
      setLocationSuggestions([]);
      return;
    }

    setIsSearchingLocation(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' Israel')}&limit=5`
      );
      const data = await response.json();
      setLocationSuggestions(data);
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsSearchingLocation(false);
    }
  };

  // Convert address to coordinates
  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ' Israel')}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        return `${lat},${lon}`;
      }
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  };

  // Handle location input change with debounced search
  const handleLocationInputChange = (e) => {
    const value = e.target.value;
    setEditableLocation(value);

    // Debounce search
    clearTimeout(window.locationSearchTimeout);
    window.locationSearchTimeout = setTimeout(() => {
      searchLocationSuggestions(value);
    }, 300);
  };

  // Handle location suggestion selection
  const handleLocationSuggestionSelect = (suggestion) => {
    const newPosition = [parseFloat(suggestion.lat), parseFloat(suggestion.lon)];
    const formattedAddress = suggestion.display_name.split(',').slice(0, 3).join(', ');

    setEditableLocation(formattedAddress);
    setFormData(prev => ({
      ...prev,
      location: `${newPosition[0]},${newPosition[1]}`
    }));
    setLocationSuggestions([]);
  };
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle style selection
  const handleStyleChange = (style) => {
    setFormData(prev => ({
      ...prev,
      styles: prev.styles.includes(style)
        ? prev.styles.filter(s => s !== style)
        : [...prev.styles, style]
    }));
  };

  // Handle profile image selection
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImageUrl(URL.createObjectURL(file));
    }
  };

  // Generate unique ID for new images
  const generateImageId = () => Date.now() + Math.random();

  // Handle adding new images
  const handleAddNewImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;

    input.onchange = (e) => {
      const files = Array.from(e.target.files);
      const newImages = files.map(file => ({
        id: generateImageId(),
        url: URL.createObjectURL(file),
        file: file,
        isNew: true
      }));

      setPortfolioImages(prev => [...prev, ...newImages]);
    };

    input.click();
  };

  // Handle removing image
  const handleRemoveImage = (imageId) => {
    setPortfolioImages(prev => prev.filter(img => img.id !== imageId));
  };

  // Handle replacing existing image
  const handleReplaceImage = (imageId) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setPortfolioImages(prev => prev.map(img =>
          img.id === imageId
            ? {
              ...img,
              url: URL.createObjectURL(file),
              file: file,
              isNew: true
            }
            : img
        ));
      }
    };

    input.click();
  };

  // Upload image to Supabase storage
  const uploadImage = async (file, bucket = 'artist-images') => {
    if (!file) return null;

    try {
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  // Save profile changes
  const saveProfile = async () => {
    if (!user) return;

    try {
      setSaving(true);

      let profileImageUrlToSave = profileImageUrl;
      if (profileImage) {
        const uploadedUrl = await uploadImage(profileImage);
        if (uploadedUrl) {
          profileImageUrlToSave = uploadedUrl;
        }
      }

      const workImageUrlsToSave = [];

      for (const image of portfolioImages) {
        if (image.isNew && image.file) {
          const uploadedUrl = await uploadImage(image.file);
          if (uploadedUrl) {
            workImageUrlsToSave.push(uploadedUrl);
          }
        } else if (!image.isNew && image.url) {
          workImageUrlsToSave.push(image.url);
        }
      }
      let coordinatesToSave = formData.location;
      if (editMode && editableLocation && editableLocation !== displayLocation) {
        const newCoordinates = await geocodeAddress(editableLocation);
        if (newCoordinates) {
          coordinatesToSave = newCoordinates;
        }
      }

      const { error: userUpdateError } = await supabase
        .from('users')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName
        })
        .eq('id', user.id);

      if (userUpdateError) throw userUpdateError;

      let artistId = artistProfile?.id;

      if (!artistProfile) {
        const { data: newProfile, error: createError } = await supabase
          .from('artist_profiles')
          .insert({
            user_id: user.id,
            bio: formData.bio,
            instagram_handle: formData.instagram,
            location: coordinatesToSave,
            profile_image_url: profileImageUrlToSave,
            recent_works_urls: workImageUrlsToSave.filter(Boolean),
            avg_rating: 0,
            is_verified: false,
            created_at: new Date().toISOString()
          })
          .select();

        if (createError) throw createError;

        artistId = newProfile[0].id;
        setArtistProfile(newProfile[0]);
      } else {
        const { error: updateError } = await supabase
          .from('artist_profiles')
          .update({
            bio: formData.bio,
            instagram_handle: formData.instagram,
            location: coordinatesToSave,
            profile_image_url: profileImageUrlToSave,
            recent_works_urls: workImageUrlsToSave.filter(Boolean)
          })
          .eq('id', artistProfile.id);

        if (updateError) throw updateError;
      }

      if (artistId) {
        const { error: deleteError } = await supabase
          .from('styles_artists')
          .delete()
          .eq('artist_id', artistId);

        if (deleteError) {
          console.error('Error deleting existing styles:', deleteError);
          throw deleteError;
        }

        if (formData.styles.length > 0) {
          const styleAssociations = formData.styles
            .map(styleName => {
              const styleId = styleNameToIdMap[styleName];
              if (styleId) {
                return {
                  artist_id: artistId,
                  style_id: styleId,
                  expertise_level: 3,
                  added_at: new Date().toISOString()
                };
              }
              return null;
            })
            .filter(Boolean);

          if (styleAssociations.length > 0) {
            const { error: stylesError } = await supabase
              .from('styles_artists')
              .upsert(styleAssociations);

            if (stylesError) {
              console.error('Error saving styles:', stylesError);
              throw stylesError;
            }
          }
        }
      }

      setProfileImage(null);
      setPortfolioImages(prev => prev.map(img => ({ ...img, file: null, isNew: false })));
      setEditMode(false);

      alert('Profile updated successfully!');

    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  // Helper function to calculate profile completion percentage
  const calculateCompletionPercentage = () => {
    let totalFields = 7;
    let completedFields = 0;

    if (formData.firstName) completedFields++;
    if (formData.lastName) completedFields++;
    if (formData.bio) completedFields++;
    if (formData.instagram) completedFields++;
    if (formData.location) completedFields++;
    if (formData.styles.length > 0) completedFields++;
    if (profileImageUrl) completedFields++;

    return Math.floor((completedFields / totalFields) * 100);
  };
  const translateStyle = (style) => {
    if (isRTL) {
      return t(`dashboard.styles.${style}`) || style;
    }
    return style;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-150/15 via-black to-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-150/15 via-black to-black -mt-8 ${isRTL ? 'dashboard-container' : ''}`}>
      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        {/* Dashboard Header */}
        <div className={`flex flex-col md:flex-row md:items-center md:justify-between mb-8 ${isRTL ? 'dashboard-content' : ''}`}>
          <div className="mb-4 md:mb-0">
            <h2 className={`text-3xl font-bold text-white ${isRTL ? 'dashboard-text-right' : ''}`}>{t('dashboard.myProfile')}</h2>
            <p className={`text-gray-400 mt-1 ${isRTL ? 'dashboard-text-right' : ''}`}>{t('dashboard.manageProfile')}</p>
          </div>

          <div className={`flex space-x-3 ${isRTL ? 'dashboard-flex-reverse space-x-reverse' : ''}`}>
            {editMode ? (
              <>
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className={`px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 transition-colors ${isRTL ? 'btn-with-icon' : ''}`}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? t('dashboard.saving') : t('dashboard.saveChanges')}
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  disabled={saving}
                  className={`px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white flex items-center gap-2 transition-colors ${isRTL ? 'btn-with-icon' : ''}`}
                >
                  <X className="w-4 h-4" />
                  {t('dashboard.cancel')}
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className={`px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 transition-colors ${isRTL ? 'btn-with-icon' : ''}`}
              >
                <Edit className="w-4 h-4" />
                {t('dashboard.editProfile')}
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="mb-6 border-b border-gray-800">
          <div className={`flex space-x-4 ${isRTL ? '' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-4 text-white relative ${activeTab === 'profile'
                ? 'font-medium border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-gray-200'
                }`}
            >
              {t('dashboard.profile')}
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`py-2 px-4 text-white relative ${activeTab === 'portfolio'
                ? 'font-medium border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-gray-200'
                }`}
            >
              {t('dashboard.portfolio')}
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-2 px-4 text-white relative ${activeTab === 'stats'
                ? 'font-medium border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-gray-200'
                }`}
            >
              {t('dashboard.statistics')}
            </button>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${isRTL ? 'dashboard-grid' : ''}`}>
            {/* Left Column - Profile Image */}
            <div className="md:col-span-1">
              <div className={`bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-600/20 h-full ${isRTL ? 'dashboard-profile-section' : ''}`}>
                <div className="flex flex-col items-center space-y-4">
                  {/* Profile Image */}
                  <div className="relative">
                    <div className="h-36 w-36 rounded-full overflow-hidden border-4 border-purple-500/30">
                      <img
                        src={profileImageUrl || '/api/placeholder/400/400'}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {editMode && (
                      <button
                        onClick={() => profileImageRef.current?.click()}
                        className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                    )}

                    <input
                      type="file"
                      ref={profileImageRef}
                      onChange={handleProfileImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  {/* User Name */}
                  {editMode ? (
                    <div className="w-full space-y-3">
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder={isRTL ? "First Name" : "First Name"}
                        className={`w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-700 text-center ${isRTL ? 'dashboard-form-input' : ''}`}
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder={isRTL ? "Last Name" : "Last Name"}
                        className={`w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-700 text-center ${isRTL ? 'dashboard-form-input' : ''}`}
                      />
                    </div>
                  ) : (
                    <h3 className={`text-xl font-bold text-white text-center ${isRTL ? 'dashboard-text-right' : ''}`}>
                      {formData.firstName} {formData.lastName}
                    </h3>
                  )}

                  {/* Verification Status */}
                  {artistProfile?.is_verified && (
                    <div className="flex items-center gap-1 text-green-400 text-sm">
                      <span className="text-xs px-2 py-0.5 bg-green-500/20 rounded-full">{t('dashboard.verified')}</span>
                    </div>
                  )}

                  {/* Rating */}
                  {artistProfile && (
                    <div className={`flex items-center space-x-1 ${isRTL ? 'rating-display' : ''}`}>
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-white font-medium">
                        {artistProfile.avg_rating ? artistProfile.avg_rating.toFixed(1) : '0.0'}
                      </span>
                    </div>
                  )}

                  {/* Instagram Handle */}
                  {editMode ? (
                    <div className="w-full relative">
                      <input
                        type="text"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleInputChange}
                        placeholder="Instagram Username"
                        className={`w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-700 instagram-handle ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                      />
                      <Instagram className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-2.5 text-gray-400`} size={16} />
                    </div>
                  ) : (
                    formData.instagram && (
                      <a
                        href={`https://instagram.com/${formData.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors instagram-handle ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <Instagram className="w-4 h-4" />
                        <span>@{formData.instagram}</span>
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Profile Details */}
            <div className="md:col-span-2">
              <div
                className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-600/20"
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                <h3 className={`text-xl font-bold text-white mb-4 ${isRTL ? 'dashboard-text-right' : ''}`}>{t('dashboard.professionalInfo')}</h3>

                {/* Bio */}
                <div className="mb-6">
                  <label className={`block text-gray-300 text-sm mb-2 ${isRTL ? 'dashboard-text-right' : ''}`}>{t('dashboard.bio')}</label>
                  {editMode ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={5}
                      className={`w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-700 ${isRTL ? 'dashboard-form-input' : ''}`}
                      placeholder={t('dashboard.bioPlaceholder')}
                    />
                  ) : (
                    <p className={`text-gray-300 whitespace-pre-wrap ${isRTL ? 'text-content' : ''}`}>
                      {formData.bio || t('dashboard.noBio')}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="mb-6" dir={isRTL ? 'rtl' : 'ltr'}>
                  <label className={`block text-gray-300 text-sm mb-2 ${isRTL ? 'dashboard-text-right' : ''}`}>{t('dashboard.location')}</label>
                  {editMode ? (
                    <div className="relative">
                      <input
                        type="text"
                        value={editableLocation}
                        onChange={handleLocationInputChange}
                        className={`w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-700 ${isRTL ? 'dashboard-form-input pr-10 pl-4' : 'pl-10 pr-4'}`}
                        placeholder={isRTL ? "Enter studio address" : "Enter studio address"}
                      />
                      <MapPin className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 text-gray-400`} size={20} />

                      {/* Location suggestions dropdown */}
                      {locationSuggestions.length > 0 && (
                        <div className="absolute w-full mt-1 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10 max-h-60 overflow-y-auto">
                          {locationSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleLocationSuggestionSelect(suggestion)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                            >
                              {suggestion.display_name.split(',').slice(0, 3).join(', ')}
                            </button>
                          ))}
                        </div>
                      )}

                      {isSearchingLocation && (
                        <div className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-3`}>
                          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={`${isRTL ? 'text-right' : 'text-left'}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                      <MapPin className={`w-5 h-5 text-purple-400 ${isRTL ? 'float-right ml-2' : 'float-left mr-2'}`} style={{ marginTop: '2px' }} />
                      <span className={`text-gray-300 ${isRTL ? 'text-content' : ''}`}>
                        {displayLocation || t('dashboard.noLocation')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tattoo Styles */}
                <div>
                  <label className={`block text-gray-300 text-sm mb-3 ${isRTL ? 'dashboard-text-right' : ''}`}>{t('dashboard.tattooStyles')}</label>
                  {editMode ? (
                    <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2 ${isRTL ? 'grid-rtl' : ''}`}>
                      {tattooStyles.map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => handleStyleChange(style)}
                          className={`p-2 rounded-lg text-sm transition-colors ${formData.styles.includes(style)
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                          {translateStyle(style)}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div
                      className="flex flex-wrap gap-2"
                      dir={isRTL ? 'rtl' : 'ltr'}
                      style={isRTL ? { justifyContent: 'flex-start' } : {}}
                    >
                      {formData.styles.length > 0 ? (
                        formData.styles.map((style) => (
                          <span
                            key={style}
                            className="px-3 py-1 rounded-full text-xs bg-purple-900/50 text-purple-200 border border-purple-500/50"
                          >
                            {translateStyle(style)}
                          </span>
                        ))
                      ) : (
                        <span className={`text-gray-400 ${isRTL ? 'text-content' : ''}`}>{t('dashboard.noStyles')}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className={`bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-600/20 ${isRTL ? 'dashboard-content' : ''}`}>
            <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <h3 className={`text-xl font-bold text-white ${isRTL ? 'dashboard-text-right' : ''}`}>{t('dashboard.portfolio')}</h3>
              {editMode && (
                <p className={`text-sm text-gray-400 ${isRTL ? 'dashboard-text-right' : ''}`}>
                  {t('dashboard.portfolioDesc')} ({portfolioImages.length} {t('dashboard.uploaded')})
                </p>
              )}
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ${isRTL ? 'dashboard-portfolio-grid' : ''}`}>
              {/* Existing images */}
              {portfolioImages.map((image) => (
                <div key={image.id} className="relative group">
                  {editMode ? (
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-purple-500/30 relative">
                      <img
                        src={image.url}
                        alt="Portfolio work"
                        className="w-full h-full object-cover"
                      />
                      {/* New image badge */}
                      {image.isNew && (
                        <div className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} bg-green-500 text-white text-xs px-2 py-1 rounded-full`}>
                          {t('dashboard.new')}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleReplaceImage(image.id)}
                          className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveImage(image.id)}
                          className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-purple-500/30">
                      <img
                        src={image.url}
                        alt="Portfolio work"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  )}
                </div>
              ))}

              {/* Add new image button */}
              {editMode && (
                <div className="relative group">
                  <button
                    onClick={handleAddNewImage}
                    className="aspect-square w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg hover:border-purple-500 transition-colors"
                  >
                    <Upload className="text-gray-400 mb-2" size={24} />
                    <span className="text-sm text-gray-400">{t('dashboard.addImages') || 'Add Images'}</span>
                    <span className="text-xs text-gray-500 mt-1">
                      {portfolioImages.length} {t('dashboard.uploaded')}
                    </span>
                  </button>
                </div>
              )}

              {/* No images message */}
              {!editMode && portfolioImages.length === 0 && (
                <div className="col-span-full flex items-center justify-center py-12 text-gray-500">
                  <div className={`text-center ${isRTL ? 'text-content' : ''}`}>
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{t('dashboard.noPortfolioImages')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className={`bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-600/20 ${isRTL ? 'dashboard-content' : ''}`}>
            <h3 className={`text-xl font-bold text-white mb-6 ${isRTL ? 'dashboard-text-right' : ''}`}>{t('dashboard.statistics')}</h3>

            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ${isRTL ? 'dashboard-stats-grid' : ''}`}>
              <div className={`bg-gray-800/50 rounded-xl p-4 border border-purple-600/10 ${isRTL ? 'text-content' : ''}`}>
                <h4 className={`text-gray-400 text-sm mb-1 ${isRTL ? 'dashboard-text-right' : ''}`}>{t('dashboard.profileViews')}</h4>
                <p className={`text-3xl font-bold text-white ${isRTL ? 'dashboard-text-right' : ''}`}>0</p>
              </div>

              <div className={`bg-gray-800/50 rounded-xl p-4 border border-purple-600/10 ${isRTL ? 'text-content' : ''}`}>
                <h4 className={`text-gray-400 text-sm mb-1 ${isRTL ? 'dashboard-text-right' : ''}`}>{t('dashboard.messages')}</h4>
                <p className={`text-3xl font-bold text-white ${isRTL ? 'dashboard-text-right' : ''}`}>0</p>
              </div>

              <div className={`bg-gray-800/50 rounded-xl p-4 border border-purple-600/10 ${isRTL ? 'text-content' : ''}`}>
                <h4 className={`text-gray-400 text-sm mb-1 ${isRTL ? 'dashboard-text-right' : ''}`}>{t('dashboard.reviews')}</h4>
                <p className={`text-3xl font-bold text-white ${isRTL ? 'dashboard-text-right' : ''}`}>0</p>
              </div>

              <div className={`bg-gray-800/50 rounded-xl p-4 border border-purple-600/10 ${isRTL ? 'text-content' : ''}`}>
                <h4 className={`text-gray-400 text-sm mb-1 ${isRTL ? 'dashboard-text-right' : ''}`}>{t('dashboard.averageRating')}</h4>
                <div className={`flex items-center ${isRTL ? 'rating-display' : ''}`}>
                  <p className={`text-3xl font-bold text-white ${isRTL ? 'ml-2' : 'mr-2'}`}>
                    {artistProfile?.avg_rating ? artistProfile.avg_rating.toFixed(1) : '0.0'}
                  </p>
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
            </div>

            <div className={`text-center py-10 ${isRTL ? 'text-content' : ''}`}>
              <h4 className={`text-lg font-medium text-white mb-3 ${isRTL ? 'dashboard-text-right' : ''}`}>{t('dashboard.profileCompletion')}</h4>

              {/* Progress bar */}
              <div className={`w-full bg-gray-800 rounded-full h-2.5 mb-4 ${isRTL ? 'progress-container' : ''}`}>
                <div
                  className="bg-purple-600 h-2.5 rounded-full"
                  style={{
                    width: `${calculateCompletionPercentage()}%`
                  }}
                ></div>
              </div>

              <p className={`text-gray-400 text-sm ${isRTL ? 'dashboard-text-right' : ''}`}>
                {t('dashboard.completeProfileDesc')}
              </p>

              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className={`mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors ${isRTL ? 'btn-with-icon' : ''}`}
                >
                  {t('dashboard.completeProfile')}
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;