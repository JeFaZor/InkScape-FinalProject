import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import ArtistCard from './artist-card/ArtistCard';
import { supabase } from '../../lib/supabaseClient';

// Custom hook for getting URL parameters
const useSearchParams = () => {
  const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search));

  useEffect(() => {
    const handleUrlChange = () => {
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  return searchParams;
};

// Mapping of style names to IDs
const styleNameToIdMap = {
  'traditional': 1,
  'Traditional': 1,
  'new school': 2,
  'New School': 2,
  'japanese': 3,
  'Japanese': 3,
  'fineline': 4,
  'Fineline': 4,
  'geometric': 5,
  'Geometric': 5,
  'micro realism': 6,
  'Micro Realism': 6,
  'realism': 7,
  'Realism': 7,
  'dot work': 8,
  'Dot Work': 8,
  'dark art': 9,
  'Dark Art': 9,
  'flowers': 10,
  'Flowers': 10,
  'surrealism': 11,
  'Surrealism': 11,
  'trash polka': 12,
  'Trash Polka': 12
};

const SearchResults = () => {
  // Get search parameters from URL
  const searchParams = useSearchParams();

  // States
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  // Extract search parameters
  const searchQuery = searchParams.get('q') || '';
  const styleName = searchParams.get('style') || '';
  const location = searchParams.get('location') || '';
  const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];

  // Function to fetch artists from Supabase
  const fetchArtists = async () => {
    try {
      setIsLoading(true);

      // Apply pagination
      const pageSize = 10;
      const startRange = (page - 1) * pageSize;
      const endRange = startRange + pageSize - 1;

      // Base query for artist profiles
      let query = supabase
        .from('artist_profiles')
        .select(`
          id,
          user_id,
          instagram_handle,
          bio,
          location,
          avg_rating,
          service_area,
          is_verified,
          profile_image_url,
          recent_works_urls,
          users!inner(first_name, last_name, email)
        `, { count: 'exact' });

      // Filter by style if provided
      if (styleName && styleName.trim() !== '') {
        try {
          // Get style ID - try both as-is and lowercase for better matching
          const styleNameInput = styleName.trim();
          // Look up style ID in our map with more flexible matching
          let styleId = styleNameToIdMap[styleNameInput] || 
                       styleNameToIdMap[styleNameInput.toLowerCase()] || 
                       styleNameToIdMap[styleNameInput.charAt(0).toUpperCase() + styleNameInput.slice(1).toLowerCase()];
          
          // If no direct match, try partial matching
          if (!styleId) {
            for (const [key, id] of Object.entries(styleNameToIdMap)) {
              if (key.includes(styleNameInput.toLowerCase()) || 
                  styleNameInput.toLowerCase().includes(key.toLowerCase())) {
                styleId = id;
                break;
              }
            }
          }

          if (!styleId) {
            // If no style ID found, return empty results
            setArtists([]);
            setTotalResults(0);
            setHasMore(false);
            setIsLoading(false);
            return;
          }

          // Find artists linked to this style
          const { data: artistsWithStyle, error: artistsError } = await supabase
            .from('styles_artists')
            .select('artist_id')
            .eq('style_id', styleId);

          if (artistsError) {
            throw artistsError;
          }

          if (!artistsWithStyle || artistsWithStyle.length === 0) {
            // No artists with this style, return empty results
            setArtists([]);
            setTotalResults(0);
            setHasMore(false);
            setIsLoading(false);
            return;
          }

          // Extract the artist IDs
          const artistIds = artistsWithStyle.map(a => a.artist_id);
          
          // Add IDs to the main query
          query = query.in('id', artistIds);
        } catch (styleFilterError) {
          console.error("Error in style filtering:", styleFilterError);
          throw styleFilterError;
        }
      }

      // Filter by location if provided
      if (location && location.trim() !== '') {
        query = query.ilike('location', `%${location.trim()}%`);
      }

      // Filter by free text search if provided
      if (searchQuery && searchQuery.trim() !== '') {
        query = query.or(
          `bio.ilike.%${searchQuery.trim()}%, users.first_name.ilike.%${searchQuery.trim()}%, users.last_name.ilike.%${searchQuery.trim()}%`
        );
      }

      // Apply pagination
      query = query.range(startRange, endRange);

      // Execute the query
      const { data: artistsData, error: artistError, count } = await query;

      if (artistError) {
        throw artistError;
      }

      // If no artists found, return empty results
      if (!artistsData || artistsData.length === 0) {
        setArtists([]);
        setTotalResults(0);
        setHasMore(false);
        setIsLoading(false);
        return;
      }

      // Update total results count on first page
      if (page === 1) {
        setTotalResults(count || 0);
      }

      // Extract artist IDs for additional queries
      const artistIds = artistsData.map(artist => artist.id);

      // Get styles for these artists in one efficient query
      const { data: artistStyles, error: stylesError } = await supabase
        .from('styles_artists')
        .select(`
          artist_id,
          styles(id, name)
        `)
        .in('artist_id', artistIds);

      if (stylesError) {
        console.error("Error fetching styles:", stylesError);
      }

      // Get review counts for these artists - using a manual count approach
      let reviewCounts = [];
      try {
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('artist_id')
          .in('artist_id', artistIds);

        if (reviewsError) {
          console.error("Error fetching reviews:", reviewsError);
        } else if (reviewsData) {
          // Count reviews for each artist manually
          const countMap = {};
          reviewsData.forEach(review => {
            countMap[review.artist_id] = (countMap[review.artist_id] || 0) + 1;
          });

          // Convert to required structure
          reviewCounts = Object.entries(countMap).map(([artist_id, count]) => ({
            artist_id,
            count
          }));
        }
      } catch (error) {
        console.error("Error processing review counts:", error);
      }

      // Process the results to format them for the frontend
      const formattedArtists = artistsData.map(artist => {
        // Get styles for this artist
        const styles = artistStyles
          ? artistStyles
            .filter(s => s.artist_id === artist.id)
            .map(s => s.styles?.name)
            .filter(Boolean)
          : [];

        // Get review count for this artist
        const reviewData = reviewCounts
          ? reviewCounts.find(r => r.artist_id === artist.id)
          : null;

        return {
          id: artist.id,
          name: `${artist.users.first_name} ${artist.users.last_name}`,
          profileImage: artist.profile_image_url || '/api/placeholder/400/400',
          recentWorks: artist.recent_works_urls || Array(3).fill('/api/placeholder/400/400'),
          location: artist.location || 'Location not specified',
          styles: styles,
          rating: artist.avg_rating || 0,
          reviewCount: reviewData ? reviewData.count : 0,
          instagramHandle: artist.instagram_handle || '',
          isVerified: artist.is_verified,
          serviceArea: artist.service_area,
          email: artist.users.email
        };
      });

      // Update state
      setArtists(prev => page === 1 ? formattedArtists : [...prev, ...formattedArtists]);
      setHasMore(formattedArtists.length === pageSize);
      setError(null);
    } catch (err) {
      console.error("Error in fetchArtists:", err);
      // Improved error handling
      if (err.message && err.message.includes('Failed to fetch')) {
        setError('Connection error: Unable to reach the server. Please check your internet connection and try again.');
      } else {
        setError('Failed to load artists. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset and reload when search parameters change
  useEffect(() => {
    setArtists([]);
    setPage(1);
    setHasMore(true);
    fetchArtists();
  }, [searchQuery, styleName, location, tags.join(',')]);

  // Load more results when page changes
  useEffect(() => {
    if (page > 1 && !isLoading) {
      fetchArtists();
    }
  }, [page]);

  // Infinite scroll detection
  useEffect(() => {
    const handleScroll = () => {
      // Check if user is near bottom of page
      const scrollPosition = window.innerHeight + window.scrollY;
      const scrollThreshold = document.documentElement.scrollHeight - 500;

      if (scrollPosition >= scrollThreshold) {
        if (hasMore && !isLoading) {
          setPage(prev => prev + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading]);

  // Display initial loading state
  if (isLoading && artists.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  // Display error state
  if (error && artists.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-500">
        {error}
      </div>
    );
  }

  // Display "no results" state
  if (!isLoading && artists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
        <p className="text-xl mb-2">No results found</p>
        <p>Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="p-8 mx-auto px-4 w-full">
      {/* Search results summary */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">
          Search Results
        </h2>
        <p className="text-gray-400">
          Found {totalResults} artists
          {searchQuery && ` for "${searchQuery}"`}
          {styleName && ` in ${styleName} style`}
          {location && ` in ${location} area`}
          {tags.length > 0 && ` with tags: ${tags.join(', ')}`}
        </p>
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {artists.map((artist, index) => (
          <ArtistCard key={`${artist.id || index}`} artist={artist} />
        ))}
      </div>

      {/* Additional loading indicator */}
      {isLoading && artists.length > 0 && (
        <div className="flex justify-center mt-8">
          <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
        </div>
      )}
    </div>
  );
};

export default SearchResults;