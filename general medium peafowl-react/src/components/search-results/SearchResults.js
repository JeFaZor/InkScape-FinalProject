import React, { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import ArtistCard from './artist-card/ArtistCard';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

/**
 * Helper function to calculate distance between two coordinates
 * @param {Array} point1 [latitude, longitude]
 * @param {Array} point2 [latitude, longitude]
 * @returns {number} distance in kilometers
 */
const calculateDistance = (point1, point2) => {
  const [lat1, lon1] = point1;
  const [lat2, lon2] = point2;
  
  // Convert latitude and longitude from degrees to radians
  const latRad1 = (lat1 * Math.PI) / 180;
  const lonRad1 = (lon1 * Math.PI) / 180;
  const latRad2 = (lat2 * Math.PI) / 180;
  const lonRad2 = (lon2 * Math.PI) / 180;
  
  // Haversine formula
  const dLat = latRad2 - latRad1;
  const dLon = lonRad2 - lonRad1;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
           Math.cos(latRad1) * Math.cos(latRad2) *
           Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  // Earth's radius in kilometers
  const radius = 6371;
  const distance = radius * c;
  
  return distance;
};

/**
 * Function to parse coordinates from string
 * @param {string} coordString - Coordinates in "lat,lng" format
 * @returns {Array|null} - [latitude, longitude] or null if invalid
 */
const parseCoordinates = (coordString) => {
  if (!coordString) return null;
  
  try {
    // Check if it's JSON string
    if (coordString.startsWith('[') && coordString.endsWith(']')) {
      return JSON.parse(coordString);
    }
    
    // Handle "lat,lng" format
    const parts = coordString.replace(/[()]/g, '').split(',').map(part => parseFloat(part.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return parts;
    }
  } catch (error) {
    console.error('Error parsing coordinates:', error);
  }
  
  return null;
};

/**
 * Mapping of style names to their corresponding IDs in the database
 */
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

/**
 * SearchResults component
 * Handles fetching and displaying artist results based on search criteria
 */
const SearchResults = () => {
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();

  // States
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  
  // State to track current search parameters
  const [currentSearch, setCurrentSearch] = useState('');

  // Function to get search parameters from URL
  const getSearchParams = useCallback(() => {
    const searchParams = new URLSearchParams(location.search);
    
    return {
      searchQuery: searchParams.get('q') || '',
      styleName: searchParams.get('style') || '',
      location: searchParams.get('location') || '',
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || [],
      coordinates: searchParams.get('coords') ? JSON.parse(searchParams.get('coords')) : null,
      radius: searchParams.get('radius') ? parseFloat(searchParams.get('radius')) : null
    };
  }, [location.search]);
  
  // Memoized search parameters
  const searchParams = getSearchParams();

  /**
   * Fetches artists from Supabase based on search criteria
   */
  const fetchArtists = useCallback(async (resetPage = false) => {
    try {
      // Track the new search params as string to detect changes
      const searchParamsString = JSON.stringify(searchParams);
      
      // If starting a new search, reset page to 1
      const currentPage = resetPage ? 1 : page;
      
      if (resetPage) {
        setArtists([]);
        setPage(1);
        setHasMore(true);
        setCurrentSearch(searchParamsString);
      }
      
      setIsLoading(true);
      setError(null);

      // Apply pagination
      const pageSize = 10;
      const startRange = (currentPage - 1) * pageSize;
      const endRange = startRange + pageSize - 1;

      // Initialize an array to store artist IDs
      let artistIds = [];
      let userMatches = [];

      // If we have a search query, first look for users/artists by name
      if (searchParams.searchQuery && searchParams.searchQuery.trim() !== '') {
        const searchTerm = searchParams.searchQuery.trim();
        
        // Search for users by name (first_name or last_name)
        const { data: matchingUsers, error: userError } = await supabase
          .from('users')
          .select('id, first_name, last_name')
          .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`);
          
        if (!userError && matchingUsers && matchingUsers.length > 0) {
          userMatches = matchingUsers;
        }
      }

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
          recent_works_urls
        `, { count: 'exact' });
        
      // Apply user name filter if we found matching users
      if (userMatches.length > 0) {
        const userIds = userMatches.map(user => user.id);
        query = query.in('user_id', userIds);
      }
      // If we have a search query but no matching users, also try bio as a fallback
      else if (searchParams.searchQuery && searchParams.searchQuery.trim() !== '') {
        query = query.or(`bio.ilike.%${searchParams.searchQuery.trim()}%,instagram_handle.ilike.%${searchParams.searchQuery.trim()}%`);
      }

      // Filter by style if provided
      if (searchParams.styleName && searchParams.styleName.trim() !== '') {
        try {
          // Get style ID - try both as-is and lowercase for better matching
          const styleNameInput = searchParams.styleName.trim();
          
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
          const styleArtistIds = artistsWithStyle.map(a => a.artist_id);
          artistIds = styleArtistIds;
          
          // Add IDs to the main query
          query = query.in('id', styleArtistIds);
        } catch (styleFilterError) {
          throw styleFilterError;
        }
      }

      // Filter by location string if provided but no coordinates
      if (searchParams.location && searchParams.location.trim() !== '' && (!searchParams.coordinates || !searchParams.radius)) {
        query = query.ilike('location', `%${searchParams.location.trim()}%`);
      }
      
      // If we're not filtering by coordinates yet, apply pagination and execute query
      // Otherwise, we'll fetch all results first and filter by distance later
      if (!searchParams.coordinates || !searchParams.radius) {
        // Apply pagination
        query = query.range(startRange, endRange);
      }

      // Execute the query with timeout
      const queryPromise = query;
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Query timeout')), 10000)
      );

      const { data: artistsData, error: artistError, count } = await Promise.race([
        queryPromise,
        timeoutPromise
      ]);

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
      
      // If we have coordinates and radius, filter artists by distance
      let filteredArtistsData = [...artistsData];
      let totalCount = count || 0;
      
      if (searchParams.coordinates && searchParams.radius && searchParams.coordinates.length === 2) {
        // Filter artists by distance
        filteredArtistsData = artistsData.filter(artist => {
          // Parse artist location from string format
          const artistCoords = parseCoordinates(artist.location);
          
          // Skip artists with invalid coordinates
          if (!artistCoords) return false;
          
          // Calculate distance
          const distance = calculateDistance(searchParams.coordinates, artistCoords);
          
          // Include artist if within radius
          return distance <= searchParams.radius;
        });
        
        // Update count for pagination
        totalCount = filteredArtistsData.length;
        
        // Apply pagination manually
        filteredArtistsData = filteredArtistsData.slice(startRange, endRange + 1);
      }

      // Update total results count on first page
      if (currentPage === 1) {
        setTotalResults(totalCount);
      }

      // Extract artist IDs for additional queries
      const currentArtistIds = filteredArtistsData.map(artist => artist.id);

      // Get user data for these artists
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, first_name, last_name, email')
        .in('id', filteredArtistsData.map(artist => artist.user_id));

      // Get styles for these artists in one efficient query
      const { data: artistStyles, error: stylesError } = await supabase
        .from('styles_artists')
        .select(`
          artist_id,
          styles(id, name)
        `)
        .in('artist_id', currentArtistIds);

      // Get review counts for these artists - using a manual count approach
      let reviewCounts = [];
      try {
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('artist_id')
          .in('artist_id', currentArtistIds);

        if (!reviewsError && reviewsData) {
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
        // Continue without review counts if there's an error
      }

      // Process the results to format them for the frontend
      const formattedArtists = filteredArtistsData.map(artist => {
        // Get user data for this artist
        const user = userData?.find(u => u.id === artist.user_id);

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
          
        // Calculate distance if coordinates are available
        let distance = null;
        if (searchParams.coordinates && searchParams.coordinates.length === 2) {
          const artistCoords = parseCoordinates(artist.location);
          if (artistCoords) {
            distance = calculateDistance(searchParams.coordinates, artistCoords);
          }
        }

        return {
          id: artist.id,
          name: user ? `${user.first_name} ${user.last_name}` : 'Unknown Artist',
          profileImage: artist.profile_image_url || '/api/placeholder/400/400',
          recentWorks: artist.recent_works_urls || Array(3).fill('/api/placeholder/400/400'),
          location: artist.location || 'Location not specified',
          distance: distance !== null ? distance.toFixed(1) : null, // Add distance information
          styles: styles,
          rating: artist.avg_rating || 0,
          reviewCount: reviewData ? reviewData.count : 0,
          instagramHandle: artist.instagram_handle || '',
          isVerified: artist.is_verified,
          serviceArea: artist.service_area,
          email: user?.email || ''
        };
      });
      
      // Sort by distance if we have coordinates
      if (searchParams.coordinates && searchParams.coordinates.length === 2) {
        formattedArtists.sort((a, b) => {
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return parseFloat(a.distance) - parseFloat(b.distance);
        });
      }

      // Update state
      setArtists(prev => resetPage ? formattedArtists : [...prev, ...formattedArtists]);
      setHasMore(formattedArtists.length === pageSize);
      setError(null);
    } catch (err) {
      // Improved error handling
      if (err.message === 'Query timeout') {
        setError('The search is taking too long. Please try again with more specific criteria.');
      } else if (err.message && err.message.includes('Failed to fetch')) {
        setError('Connection error: Unable to reach the server. Please check your internet connection and try again.');
      } else {
        setError('Failed to load artists. Please try again.');
      }
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, searchParams]);

  // Reset and reload when search parameters change
  useEffect(() => {
    // Convert search params to string for comparison
    const searchParamsString = JSON.stringify(searchParams);
    
    // If search parameters changed, reset the page and fetch new results
    if (searchParamsString !== currentSearch) {
      // Reset artists array and page number, then fetch new results
      fetchArtists(true);
    }
  }, [location.search, fetchArtists, currentSearch, searchParams]);

  // Load more results when page changes
  useEffect(() => {
    if (page > 1 && !isLoading) {
      fetchArtists(false);
    }
  }, [page, isLoading, fetchArtists]);

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
          {searchParams.searchQuery && ` for "${searchParams.searchQuery}"`}
          {searchParams.styleName && ` in ${searchParams.styleName} style`}
          {searchParams.location && ` in ${searchParams.location}`}
          {searchParams.radius && searchParams.coordinates && ` within ${searchParams.radius}km`}
          {searchParams.tags.length > 0 && ` with tags: ${searchParams.tags.join(', ')}`}
        </p>
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {artists.map((artist, index) => (
          <ArtistCard key={`${artist.id}-${index}`} artist={artist} />
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