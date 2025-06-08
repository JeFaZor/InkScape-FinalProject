// src/components/artist/ArtistProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Loader2, Star, MapPin, Instagram, User, MessageCircle } from 'lucide-react';

/**
 * ArtistProfile Component
 * 
 * Displays detailed information about a specific tattoo artist
 * Fetches artist data using either the ID from location state or name from URL parameters
 */
const ArtistProfile = () => {
  // Get artist name from URL parameters
  const { name } = useParams();
  // Get location state (might contain artistId)
  const location = useLocation();
  // Extract artistId from location state if available
  const artistId = location.state?.artistId;

  // Component state
  const [loading, setLoading] = useState(true);
  const [artist, setArtist] = useState(null);
  const [error, setError] = useState(null);

  // Fetch artist data when component mounts or parameters change
  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        setLoading(true);

        // Preferred method: Use artistId from location state if available
        if (artistId) {
          console.log("Fetching artist with ID:", artistId);
          // Fetch artist profile directly by ID
          const { data: artistProfile, error: artistError } = await supabase
            .from('artist_profiles')
            .select('*')
            .eq('id', artistId)
            .single();

          if (artistError) {
            console.error("Error fetching artist profile:", artistError);
            throw artistError;
          }

          if (!artistProfile) {
            console.error("Artist profile not found for ID:", artistId);
            throw new Error('Artist profile not found');
          }

          // Fetch user data
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('first_name, last_name, email')
            .eq('id', artistProfile.user_id)
            .single();

          if (userError) {
            console.error("Error fetching user data:", userError);
            throw userError;
          }

          // Fetch artist's tattoo styles
          const { data: stylesData, error: stylesError } = await supabase
            .from('styles_artists')
            .select('styles(name)')
            .eq('artist_id', artistId);

          if (stylesError) {
            console.error("Error fetching styles:", stylesError);
            throw stylesError;
          }

          // Fetch reviews for this artist
          const { data: reviewsData, error: reviewsError } = await supabase
            .from('reviews')
            .select('*')
            .eq('artist_id', artistId);

          if (reviewsError) {
            console.error("Error fetching reviews:", reviewsError);
            throw reviewsError;
          }

          // Construct complete artist object with all related data
          const fullArtistData = {
            ...artistProfile,
            name: userData ? `${userData.first_name} ${userData.last_name}` : 'Unknown Artist',
            email: userData ? userData.email : '',
            styles: stylesData
              ? stylesData.map(item => item.styles?.name).filter(Boolean)
              : [],
            reviews: reviewsData || []
          };

          setArtist(fullArtistData);
          console.log("Artist data loaded successfully:", fullArtistData);
        }
        // Fallback method: Search by name if no ID is available
        else {
          console.log("No artist ID in state, trying to find by name:", name);
          // Convert URL name format back to search format
          const decodedName = name.replace(/_/g, ' ');

          // First, try to find user by matching first name + last name
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, first_name, last_name, email')
            .or(`first_name.ilike.%${decodedName}%,last_name.ilike.%${decodedName}%`)
            .limit(1);

          if (userError) {
            console.error("Error searching for user by name:", userError);
            throw userError;
          }

          if (!userData || userData.length === 0) {
            console.error("No user found with name:", decodedName);
            throw new Error('Artist not found');
          }

          console.log("Found user by name:", userData[0]);
          const userId = userData[0].id;

          // Now find the artist profile using the user ID
          const { data: artistProfile, error: artistError } = await supabase
            .from('artist_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

          if (artistError && artistError.code !== 'PGRST116') {
            console.error("Error fetching artist profile by user ID:", artistError);
            throw artistError;
          }

          if (!artistProfile) {
            console.error("No artist profile found for user ID:", userId);
            throw new Error('Artist profile not found');
          }

          // Fetch artist's tattoo styles
          const { data: stylesData, error: stylesError } = await supabase
            .from('styles_artists')
            .select('styles(name)')
            .eq('artist_id', artistProfile.id);

          if (stylesError) {
            console.error("Error fetching styles:", stylesError);
            throw stylesError;
          }

          // Fetch reviews for this artist
          const { data: reviewsData, error: reviewsError } = await supabase
            .from('reviews')
            .select('*')
            .eq('artist_id', artistProfile.id);

          if (reviewsError) {
            console.error("Error fetching reviews:", reviewsError);
            throw reviewsError;
          }

          // Construct complete artist object with all related data
          const fullArtistData = {
            ...artistProfile,
            name: `${userData[0].first_name} ${userData[0].last_name}`,
            email: userData[0].email || '',
            styles: stylesData
              ? stylesData.map(item => item.styles?.name).filter(Boolean)
              : [],
            reviews: reviewsData || []
          };

          setArtist(fullArtistData);
          console.log("Artist data loaded successfully via name search:", fullArtistData);
        }
      } catch (error) {
        console.error('Error fetching artist:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have a name or ID
    if (name || artistId) {
      fetchArtistData();
    }
  }, [name, artistId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-150/15 via-black to-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  // Error state
  if (error || !artist) {
    return (
      <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-150/15 via-black to-black flex items-center justify-center">
        <div className="text-center p-6 bg-gray-900/50 rounded-lg border border-red-500/30 max-w-md">
          <h2 className="text-xl text-red-400 mb-2">Error Loading Artist</h2>
          <p className="text-gray-300">{error || 'Artist not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-150/15 via-black to-black pt-10">
      <div className="container mx-auto px-4 py-8">
        {/* Artist Header Section - Profile and Basic Info */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-600/20 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-purple-500/30">
                <img
                  src={artist.profile_image_url || '/api/placeholder/400/400'}
                  alt={`${artist.name}'s profile`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Artist Info */}
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white">{artist.name}</h1>

                  {/* Verification Badge */}
                  {artist.is_verified && (
                    <div className="inline-flex items-center gap-1 text-green-400 text-sm mt-1">
                      <span className="text-xs px-2 py-0.5 bg-green-500/20 rounded-full">Verified</span>
                    </div>
                  )}
                </div>

                {/* Artist Rating */}
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-white ml-1 font-medium">
                      {artist.avg_rating ? artist.avg_rating.toFixed(1) : '0.0'}
                    </span>
                    <span className="text-gray-400 ml-1">({artist.reviews.length} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              {artist.service_area && (
                <div className="flex items-start gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-purple-400 mt-0.5" />
                  <span className="text-gray-300">{artist.service_area}</span>
                </div>
              )}

              {/* Instagram Handle */}
              {artist.instagram_handle && (
                <div className="flex items-center gap-2 mb-4">
                  <Instagram className="w-5 h-5 text-purple-400" />
                  <a
                    href={`https://instagram.com/${artist.instagram_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    @{artist.instagram_handle}
                  </a>
                </div>
              )}

              {/* Contact Button */}
              <button className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 transition-colors">
                <MessageCircle className="w-4 h-4" />
                Contact Artist
              </button>

              {/* Artist Bio */}
              {artist.bio && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-white mb-2">About</h3>
                  <p className="text-gray-300 whitespace-pre-wrap">{artist.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tattoo Styles Section */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-600/20 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Specializes In</h2>

          <div className="flex flex-wrap gap-2">
            {artist.styles.length > 0 ? (
              artist.styles.map((style) => (
                <span
                  key={style}
                  className="px-3 py-1 rounded-full text-purple-200 bg-purple-900/50 border border-purple-500/50"
                >
                  {style}
                </span>
              ))
            ) : (
              <span className="text-gray-400">No styles specified</span>
            )}
          </div>
        </div>

        {/* Portfolio / Recent Work Section */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-600/20 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Recent Work</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {artist.recent_works_urls && artist.recent_works_urls.length > 0 ? (
              artist.recent_works_urls.map((imageUrl, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden group">
                  <img
                    src={imageUrl}
                    alt={`Work by ${artist.name}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-400">
                No portfolio images available
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-600/20">
          <h2 className="text-xl font-bold text-white mb-4">Reviews</h2>

          {artist.reviews.length > 0 ? (
            <div className="space-y-4">
              {artist.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-800 last:border-none pb-4 mb-4 last:pb-0 last:mb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-white font-medium">Client</span>
                    </div>
                    {/* Star Ratings */}
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Review Comment */}
                  {review.comment && (
                    <p className="text-gray-300">{review.comment}</p>
                  )}
                  {/* Review Date */}
                  <p className="text-gray-500 text-sm mt-2">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No reviews yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;