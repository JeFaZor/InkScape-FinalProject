import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
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

const Dashboard = () => {
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

  // State for file uploads
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [workImages, setWorkImages] = useState([null, null, null]);
  const [workImageUrls, setWorkImageUrls] = useState([]);

  // References for file inputs
  const profileImageRef = React.useRef(null);
  const workImageRefs = [React.useRef(null), React.useRef(null), React.useRef(null)];

  // List of tattoo styles
  const tattooStyles = [
    'Traditional', 'New School', 'Anime', 'Fineline', 'Geometric',
    'Micro Realism', 'Realism', 'Dot Work', 'Dark Art', 'Flowers',
    'Surrealism', 'Trash Polka'
  ];

  // Fetch artist profile data
  useEffect(() => {
    const fetchArtistProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch user's artist profile
        const { data: profileData, error: profileError } = await supabase
          .from('artist_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
          throw profileError;
        }

        // Fetch artist's styles
        let artistStyles = [];
        if (profileData) {
          const { data: stylesData, error: stylesError } = await supabase
            .from('styles_artists')
            .select('styles(name)')
            .eq('artist_id', profileData.id);

          if (!stylesError && stylesData) {
            artistStyles = stylesData.map(item => item.styles.name);
          }
        }

        // Set artist profile data
        setArtistProfile(profileData || null);

        // Set form data
        setFormData({
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          bio: profileData?.bio || '',
          instagram: profileData?.instagram_handle || '',
          location: profileData?.service_area || '',
          styles: artistStyles
        });

        // Set profile image URL
        if (profileData?.profile_image_url) {
          setProfileImageUrl(profileData.profile_image_url);
        }

        // Set work image URLs
        if (profileData?.recent_works_urls && Array.isArray(profileData.recent_works_urls)) {
          setWorkImageUrls(profileData.recent_works_urls);
        }
      } catch (error) {
        console.error('Error in profile fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistProfile();
  }, [user]);

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

  // Handle work image selection
  const handleWorkImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newWorkImages = [...workImages];
      newWorkImages[index] = file;
      setWorkImages(newWorkImages);

      const newWorkImageUrls = [...workImageUrls];
      newWorkImageUrls[index] = URL.createObjectURL(file);
      setWorkImageUrls(newWorkImageUrls);
    }
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

      // Upload profile image if changed
      let profileImageUrlToSave = profileImageUrl;
      if (profileImage) {
        const uploadedUrl = await uploadImage(profileImage);
        if (uploadedUrl) {
          profileImageUrlToSave = uploadedUrl;
        }
      }

      // Upload work images if changed
      const workImageUrlsToSave = [...workImageUrls];
      for (let i = 0; i < workImages.length; i++) {
        if (workImages[i]) {
          const uploadedUrl = await uploadImage(workImages[i]);
          if (uploadedUrl) {
            workImageUrlsToSave[i] = uploadedUrl;
          }
        }
      }

      // Update user data (first_name, last_name)
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName
        })
        .eq('id', user.id);

      if (userUpdateError) throw userUpdateError;

      // Check if artist profile exists
      let artistId = artistProfile?.id;

      if (!artistProfile) {
        // Create new artist profile
        const { data: newProfile, error: createError } = await supabase
          .from('artist_profiles')
          .insert({
            user_id: user.id,
            bio: formData.bio,
            instagram_handle: formData.instagram,
            service_area: formData.location,
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
        // Update existing artist profile
        const { error: updateError } = await supabase
          .from('artist_profiles')
          .update({
            bio: formData.bio,
            instagram_handle: formData.instagram,
            service_area: formData.location,
            profile_image_url: profileImageUrlToSave,
            recent_works_urls: workImageUrlsToSave.filter(Boolean)
          })
          .eq('id', artistProfile.id);

        if (updateError) throw updateError;
      }

      // Handle styles
      if (artistId) {
        // Clear existing styles
        await supabase
          .from('styles_artists')
          .delete()
          .eq('artist_id', artistId);

        // Add selected styles
        if (formData.styles.length > 0) {
          // Get style IDs
          const { data: styleData } = await supabase
            .from('styles')
            .select('id, name')
            .in('name', formData.styles);

          if (styleData && styleData.length > 0) {
            // Create associations
            const styleAssociations = styleData.map(style => ({
              artist_id: artistId,
              style_id: style.id,
              expertise_level: 3,
              added_at: new Date().toISOString()
            }));

            await supabase
              .from('styles_artists')
              .insert(styleAssociations);
          }
        }
      }

      // Turn off edit mode
      setEditMode(false);

      // Show success message
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
    let totalFields = 7; // Total number of fields to check
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-150/15 via-black to-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-150/15 via-black to-black -mt-8">
  

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h2 className="text-3xl font-bold text-white">My Profile</h2>
            <p className="text-gray-400 mt-1">Manage your professional profile</p>
          </div>

          <div className="flex space-x-3">
            {editMode ? (
              <>
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 transition-colors"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white flex items-center gap-2 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="mb-6 border-b border-gray-800">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-4 text-white relative ${activeTab === 'profile'
                  ? 'font-medium border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-gray-200'
                }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`py-2 px-4 text-white relative ${activeTab === 'portfolio'
                  ? 'font-medium border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-gray-200'
                }`}
            >
              Portfolio
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-2 px-4 text-white relative ${activeTab === 'stats'
                  ? 'font-medium border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-gray-200'
                }`}
            >
              Statistics
            </button>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Profile Image */}
            <div className="md:col-span-1">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-600/20">
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
                        className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full text-white hover:bg-purple-700 transition-colors"
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
                        placeholder="First Name"
                        className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-700 text-center"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                        className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-700 text-center"
                      />
                    </div>
                  ) : (
                    <h3 className="text-xl font-bold text-white text-center">
                      {formData.firstName} {formData.lastName}
                    </h3>
                  )}

                  {/* Verification Status */}
                  {artistProfile?.is_verified && (
                    <div className="flex items-center gap-1 text-green-400 text-sm">
                      <span className="text-xs px-2 py-0.5 bg-green-500/20 rounded-full">Verified</span>
                    </div>
                  )}

                  {/* Rating */}
                  {artistProfile && (
                    <div className="flex items-center space-x-1">
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
                        className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-700"
                      />
                      <Instagram className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    </div>
                  ) : (
                    formData.instagram && (
                      <a
                        href={`https://instagram.com/${formData.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
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
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-600/20">
                <h3 className="text-xl font-bold text-white mb-4">Professional Info</h3>

                {/* Bio */}
                <div className="mb-6">
                  <label className="block text-gray-300 text-sm mb-2">Bio</label>
                  {editMode ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-700"
                      placeholder="Describe your experience and tattooing style..."
                    />
                  ) : (
                    <p className="text-gray-300 whitespace-pre-wrap">
                      {formData.bio || 'No bio provided'}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="mb-6">
                  <label className="block text-gray-300 text-sm mb-2">Location</label>
                  {editMode ? (
                    <div className="relative">
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-700"
                        placeholder="Enter your studio location"
                      />
                      <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-purple-400 mt-0.5" />
                      <span className="text-gray-300">
                        {formData.location || 'No location specified'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tattoo Styles */}
                <div>
                  <label className="block text-gray-300 text-sm mb-3">Tattoo Styles</label>
                  {editMode ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                          {style}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {formData.styles.length > 0 ? (
                        formData.styles.map((style) => (
                          <span
                            key={style}
                            className="px-3 py-1 rounded-full text-xs bg-purple-900/50 text-purple-200 border border-purple-500/50"
                          >
                            {style}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">No styles selected</span>
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
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-600/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Portfolio</h3>
              {editMode && (
                <p className="text-sm text-gray-400">
                  Upload up to 3 images of your work
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[0, 1, 2].map((index) => (
                <div key={index} className="relative group">
                  {editMode ? (
                    <>
                      {workImageUrls[index] ? (
                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-purple-500/30 relative">
                          <img
                            src={workImageUrls[index]}
                            alt={`Work ${index + 1}`}
                            className="w-full h-full object-cover"
                          />

                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button
                              onClick={() => workImageRefs[index].current?.click()}
                              className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                            >
                              <Upload className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                const newUrls = [...workImageUrls];
                                newUrls[index] = null;
                                setWorkImageUrls(newUrls);

                                const newImages = [...workImages];
                                newImages[index] = null;
                                setWorkImages(newImages);
                              }}
                              className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => workImageRefs[index].current?.click()}
                          className="aspect-square w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg hover:border-purple-500 transition-colors"
                        >
                          <Upload className="text-gray-400 mb-2" size={24} />
                          <span className="text-sm text-gray-400">Upload Image</span>
                        </button>
                      )}

                      <input
                        type="file"
                        ref={workImageRefs[index]}
                        onChange={(e) => handleWorkImageChange(index, e)}
                        accept="image/*"
                        className="hidden"
                      />
                    </>
                  ) : (
                    workImageUrls[index] ? (
                      <div className="aspect-square rounded-lg overflow-hidden border-2 border-purple-500/30">
                        <img
                          src={workImageUrls[index]}
                          alt={`Work ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square flex items-center justify-center border-2 border-dashed border-gray-800 rounded-lg bg-gray-800/30">
                        <span className="text-gray-600">No image</span>
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-600/20">
            <h3 className="text-xl font-bold text-white mb-6">Statistics</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-800/50 rounded-xl p-4 border border-purple-600/10">
                <h4 className="text-gray-400 text-sm mb-1">Profile Views</h4>
                <p className="text-3xl font-bold text-white">0</p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 border border-purple-600/10">
                <h4 className="text-gray-400 text-sm mb-1">Messages</h4>
                <p className="text-3xl font-bold text-white">0</p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 border border-purple-600/10">
                <h4 className="text-gray-400 text-sm mb-1">Reviews</h4>
                <p className="text-3xl font-bold text-white">0</p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 border border-purple-600/10">
                <h4 className="text-gray-400 text-sm mb-1">Average Rating</h4>
                <div className="flex items-center">
                  <p className="text-3xl font-bold text-white mr-2">
                    {artistProfile?.avg_rating ? artistProfile.avg_rating.toFixed(1) : '0.0'}
                  </p>
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="text-center py-10">
              <h4 className="text-lg font-medium text-white mb-3">Profile Completion</h4>

              {/* Simple progress bar */}
              <div className="w-full bg-gray-800 rounded-full h-2.5 mb-4">
                <div
                  className="bg-purple-600 h-2.5 rounded-full"
                  style={{
                    width: `${calculateCompletionPercentage()}%`
                  }}
                ></div>
              </div>

              <p className="text-gray-400 text-sm">
                Complete your profile to get more visibility in search results
              </p>

              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Complete Profile
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