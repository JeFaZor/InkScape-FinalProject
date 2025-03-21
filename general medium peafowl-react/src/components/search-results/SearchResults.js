import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import ArtistCard from './artist-card/ArtistCard';

// Custom hook to get search params
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



const SearchResults = () => {
  // Get URL params using our custom hook
  const searchParams = useSearchParams();
  
  // State
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Get search parameters
  const query = searchParams.get('q') || '';
  const style = searchParams.get('style') || '';
  const location = searchParams.get('location') || '';
  const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];

  // Mock function to fetch artists (replace with actual API call later)
  const fetchArtists = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data
      const mockArtists = [
        {
          name: "Tal Cohen",
          profileImage: "/api/placeholder/400/400",
          location: "Tel Aviv",
          styles: ["Traditional", "Neo Traditional", "Japanese"],
          rating: 4.8,
          reviewCount: 124,
          recentWorks: Array(6).fill("/api/placeholder/400/400"),
          instagramHandle: "tal_tattoos"
        },
        {
          name: "Maya Levi",
          profileImage: "/api/placeholder/400/400",
          location: "Jerusalem",
          styles: ["Minimalist", "Fine Line", "Geometric"],
          rating: 4.9,
          reviewCount: 89,
          recentWorks: Array(6).fill("/api/placeholder/400/400"),
          instagramHandle: "maya_ink"
        }
      ];

      setArtists(prev => [...prev, ...mockArtists]);
      setHasMore(page < 3); // Mock limit of 3 pages
      
    } catch (err) {
      setError('Failed to load artists. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset and fetch artists when search params change
  useEffect(() => {
    setArtists([]);
    setPage(1);
    setHasMore(true);
    fetchArtists();
  }, [query, style, location, tags.join(',')]);

  // Fetch more artists when scrolling
  useEffect(() => {
    if (!hasMore || isLoading) return;
    fetchArtists();
  }, [page]);

  // Infinite scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const scrollThreshold = document.documentElement.scrollHeight - 1000;
      
      if (scrollPosition >= scrollThreshold) {
        if (hasMore && !isLoading) {
          setPage(prev => prev + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading]);

  // Show initial loading state
  if (isLoading && artists.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  // Show error state
  if (error && artists.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-500">
        {error}
      </div>
    );
  }

  // Show no results state
  if (!isLoading && artists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
        <p className="text-xl mb-2">No artists found</p>
        <p>Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Search summary */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">
          Search Results
        </h2>
        <p className="text-gray-400">
          Found {artists.length} artists
          {query && ` for "${query}"`}
          {style && ` in ${style} style`}
          {location && ` near ${location}`}
          {tags.length > 0 && ` with tags: ${tags.join(', ')}`}
        </p>
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {artists.map((artist, index) => (
          <ArtistCard key={`${artist.name}-${index}`} artist={artist} />
        ))}
      </div>

      {/* Loading more indicator */}
      {isLoading && artists.length > 0 && (
        <div className="flex justify-center mt-8">
          <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
        </div>
      )}
    </div>
  );
};

export default SearchResults;