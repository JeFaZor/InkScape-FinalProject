import React, { useState, useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Search, Image, MapPin, Filter, Tag, X, Loader2 } from 'lucide-react';
import GenrePicker from './get-started/GenrePicker';
import LocationSearch from './LocationSearch/LocationSearch';
import SearchResults from './search-results/SearchResults';
import { useAuth } from './context/AuthContext';
import ImageProcessingAnimation from './ImageProcessingAnimation';

// Import tattoo style images
import traditional from './assets/tat1.jpg';
import newSchool from './assets/tat2.png';
import japanese from './assets/tat3.png';
import fineline from './assets/tat4.jpg';
import geometric from './assets/tat5.jpg';
import microRealism from './assets/tat6.jpg';
import realism from './assets/tat7.jpg';
import dotWork from './assets/tat8.jpg';
import darkArt from './assets/tat9.jpg';
import flowers from './assets/tat10.jpg';
import surrealism from './assets/tat11.jpg';
import trashPolka from './assets/tat12.jpg';

const genres = [
  { name: 'Traditional', image: traditional },
  { name: 'New School', image: newSchool },
  { name: 'Japanese', image: japanese },
  { name: 'Fineline', image: fineline },
  { name: 'Geometric', image: geometric },
  { name: 'Micro Realism', image: microRealism },
  { name: 'Realism', image: realism },
  { name: 'Dot Work', image: dotWork },
  { name: 'Dark Art', image: darkArt },
  { name: 'Flowers', image: flowers },
  { name: 'Surrealism', image: surrealism },
  { name: 'Trash Polka', image: trashPolka },
];

const tags = [
  'Black & Grey',
  'Color',
  'Cover Up',
  'Small',
  'Large',
  'Lettering',
  'Portrait',
  'Minimalist',
  'Watercolor'
];

const SearchSection = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const history = useHistory();
  const location = useLocation();

  // State initialization
  const [tagSearchTerm, setTagSearchTerm] = useState('');
  const [showStyleFilter, setShowStyleFilter] = useState(false);
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [filteredGenres, setFilteredGenres] = useState(genres);
  const [selectedImage, setSelectedImage] = useState(null);

  // Initialize all search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [locationCoordinates, setLocationCoordinates] = useState(null);
  const [locationRadius, setLocationRadius] = useState(5);

  const fileInputRef = React.useRef(null);

  // Parse URL parameters on component mount and when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    // Get search parameters from URL
    const queryTerm = params.get('q') || '';
    const styleParam = params.get('style') || '';
    const locationParam = params.get('location') || '';
    const tagsParam = params.get('tags') ? params.get('tags').split(',') : [];
    const coordsParam = params.get('coords') || '';
    const radiusParam = params.get('radius') || '5';

    // Update state only if the URL parameters are different from current state
    // This prevents infinite loops or unnecessary updates
    if (queryTerm !== searchTerm) setSearchTerm(queryTerm);

    // Handle style parameter
    if (styleParam) {
      const matchedStyle = genres.find(g => g.name === styleParam);
      if (matchedStyle && (!selectedStyle || selectedStyle.name !== styleParam)) {
        setSelectedStyle(matchedStyle);
      }
    } else if (selectedStyle) {
      setSelectedStyle(null);
    }

    // Handle location parameter
    if (locationParam !== selectedLocation) {
      setSelectedLocation(locationParam);
    }

    // Handle coordinates parameter
    if (coordsParam) {
      try {
        const coords = JSON.parse(coordsParam);
        if (!locationCoordinates ||
          coords[0] !== locationCoordinates[0] ||
          coords[1] !== locationCoordinates[1]) {
          setLocationCoordinates(coords);
        }
      } catch (e) {
        console.error("Failed to parse coordinates", e);
      }
    } else if (locationCoordinates) {
      setLocationCoordinates(null);
    }

    // Handle radius parameter
    if (radiusParam) {
      const radius = parseFloat(radiusParam);
      if (!isNaN(radius) && radius !== locationRadius) {
        setLocationRadius(radius);
      }
    }

    // Handle tags parameter
    if (JSON.stringify(tagsParam) !== JSON.stringify(selectedTags)) {
      setSelectedTags(tagsParam);
    }

    // If there are any search parameters, consider it a search
    if (queryTerm || styleParam || locationParam || tagsParam.length > 0) {
      setHasSearched(true);
    }
  }, [location.search]);

  // Filter tags based on search term
  const filteredTags = useMemo(() => {
    return tags.filter(tag =>
      tag.toLowerCase().includes(tagSearchTerm.toLowerCase())
    );
  }, [tagSearchTerm]);

  // Handle search button click
  const handleSearch = () => {
    // Prevent search if already searching
    if (isSearching) return;

    setIsSearching(true);

    // Create search parameters object
    const params = new URLSearchParams();

    // Add parameters if they exist
    if (searchTerm) params.set('q', searchTerm);
    if (selectedStyle) params.set('style', selectedStyle.name);
    if (selectedLocation) {
      params.set('location', selectedLocation);

      // Add coordinates and radius
      if (locationCoordinates && locationCoordinates.length === 2) {
        params.set('coords', JSON.stringify(locationCoordinates));
        params.set('radius', locationRadius.toString());
      }
    }
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));

    // Update URL with new search parameters - this will trigger the useEffect above
    const searchString = params.toString();
    const newUrl = searchString ? `?${searchString}` : '/';
    history.push(newUrl);

    // Always set hasSearched to true after search
    setHasSearched(true);
    setIsSearching(false);
  };

  // Handle image upload and analysis
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));


      setIsProcessing(true);

      try {
        const formData = new FormData();
        formData.append('image', file);


        const response = await fetch('http://localhost:5000/api/analyze-tattoo', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to analyze image');
        }

        const result = await response.json();

        const processingStartTime = Date.now();
        const minimumProcessingTime = 3000;

        const remainingTime = minimumProcessingTime - (Date.now() - processingStartTime);
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }


        if (result.style) {
          const matchedStyle = genres.find(genre => genre.name === result.style);

          if (matchedStyle) {
            setSelectedStyle(matchedStyle);
            setShowStyleFilter(false);
          }


          if (result.tags && result.tags.length > 0) {
            setSelectedTags(result.tags);
          }


          alert(`Style detected: ${result.style}\nTags: ${result.tags.join(', ')}`);
        }
      } catch (error) {
        console.error('Error analyzing image:', error);
        alert('Failed to analyze the image. Please try again.');
      } finally {

        setIsProcessing(false);
      }
    }
  };

  // Reset all search parameters
  const handleReset = () => {
    // Reset all state values
    setSearchTerm('');
    setSelectedStyle(null);
    setSelectedLocation('');
    setLocationCoordinates(null);
    setLocationRadius(5);
    setSelectedTags([]);
    setSelectedImage(null);

    // Reset URL to home page
    history.push('/');

    // Close any open filters
    setShowStyleFilter(false);
    setShowLocationFilter(false);
    setShowTagFilter(false);
  };

  // Handle style selection
  const handleStyleSelect = (style) => {
    setSelectedStyle(style);
    setShowStyleFilter(false);
  };

  // Handle location selection
  const handleLocationSelect = (locationData) => {
    setSelectedLocation(locationData.address);
    setLocationCoordinates(locationData.coordinates);
    setLocationRadius(locationData.radius);
    setShowLocationFilter(false);
  };

  // Handle tag selection
  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  // Handle tag removal
  const handleTagRemove = (tag) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  return (
    <div className="relative w-full max-w-8xl mx-auto">
      <div className={`relative w-full max-w-2xl mx-auto ${showStyleFilter ? 'mb-80' : 'mb-0'}`}>
        {/* Main Search Options */}
        <div className="flex flex-col space-y-4">
          {/* Text Search */}
          <div className="relative flex items-center">
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for tattoo artist by name or style..."
                className="w-full h-14 px-6 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setShowStyleFilter(!showStyleFilter);
                setShowLocationFilter(false);
                setShowTagFilter(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${selectedStyle
                ? 'border-purple-500 text-purple-500'
                : 'border-gray-600 text-gray-300'
                }`}
            >
              <Filter className="w-4 h-4" />
              {selectedStyle ? selectedStyle.name : 'Style'}
            </button>

            <button
              onClick={() => {
                setShowLocationFilter(!showLocationFilter);
                setShowStyleFilter(false);
                setShowTagFilter(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${selectedLocation
                ? 'border-purple-500 text-purple-500'
                : 'border-gray-600 text-gray-300'
                }`}
            >
              <MapPin className="w-4 h-4" />
              {selectedLocation || 'Location'}
            </button>

            <button
              onClick={() => {
                setShowTagFilter(!showTagFilter);
                setShowStyleFilter(false);
                setShowLocationFilter(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${selectedTags.length > 0
                ? 'border-purple-500 text-purple-500'
                : 'border-gray-600 text-gray-300'
                }`}
            >
              <Tag className="w-4 h-4" />
              {selectedTags.length > 0 ? `${selectedTags.length} Tags` : 'Tags'}
            </button>

            {(selectedStyle || selectedLocation || selectedImage || selectedTags.length > 0) && (
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg text-gray-300 hover:text-white"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Filter Dropdowns Container */}
          <div className="relative isolate">
            {/* Style Filter Dropdown */}
            {showStyleFilter && (
              <div className="relative w-full flex justify-center mt-4 mb-10">
                <div className="px-4">
                  <GenrePicker
                    genres={filteredGenres}
                    onSelectGenre={handleStyleSelect}
                  />
                </div>
              </div>
            )}

            {/* Location Filter Dropdown */}
            {showLocationFilter && (
              <div className="relative w-full flex justify-center mt-4 mb-10">
                <LocationSearch
                  onLocationSelect={handleLocationSelect}
                  onClose={() => setShowLocationFilter(false)}
                />
              </div>
            )}

            {/* Tag Filter Dropdown */}
            {showTagFilter && (
              <div className="relative w-full flex justify-center mt-4 mb-4 w-100">
                <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg">
                  {/* Search field for tags */}
                  <div className="p-2 border-b border-gray-700">
                    <input
                      type="text"
                      value={tagSearchTerm}
                      onChange={(e) => setTagSearchTerm(e.target.value)}
                      placeholder="Search tags..."
                      className="w-full px-2 py-1 text-sm bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  {/* Filtered tags list */}
                  <div className="max-h-60 overflow-y-auto">
                    {filteredTags.map((tagItem) => (
                      <button
                        key={tagItem}
                        className="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white"
                        onClick={() => handleTagSelect(tagItem)}
                      >
                        {tagItem}
                      </button>
                    ))}

                    {/* Message if no results */}
                    {filteredTags.length === 0 && (
                      <div className="px-3 py-2 text-gray-500 text-sm">
                        No matching tags found
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Selected Tags Display */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedTags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-900/50 border border-purple-500 text-purple-200"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => handleTagRemove(tag)}
                    className="ml-1 text-purple-300 hover:text-purple-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleSearch}
            disabled={isSearching}
            className={`flex items-center justify-center gap-2 w-fit mx-auto py-3 px-7 rounded-lg ${isSearching
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-purple-600/80 hover:bg-purple-600'
              } text-white transition-all`}
          >
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            {isSearching ? 'Searching...' : 'Search Artists'}
          </button>

          {/* Divider with "or" text */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 text-gray-400 bg-black/30">or</span>
            </div>
          </div>

          {/* AI Image Search */}
          <div className="flex flex-col items-center space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-violet-800 to-fuchsia-800 text-white hover:from-violet-900 hover:to-fuchsia-900 transition-all"
            >
              <Image className="w-5 h-5" />
              Find Artists Using AI Image Analysis
            </button>

            {/* Explanation text */}
            <p className="text-sm text-gray-400 text-center max-w-md py-6">
              Upload a tattoo image and our AI will analyze its style to find artists who specialize in similar work
            </p>

            {/* Preview uploaded image if exists */}
            {selectedImage && (
              <div className="mt-4 relative group">
                <img
                  src={selectedImage}
                  alt="Uploaded tattoo reference"
                  className="h-40 object-cover rounded-lg border-2 border-purple-500"
                />
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="text-white hover:text-red-500"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full" style={{ width: '100%', maxWidth: '100%' }}>
        {hasSearched && <SearchResults />}
      </div>

      {/* הוסף את האנימציה כאן */}
      {isProcessing && (
        <ImageProcessingAnimation
          isVisible={true}
          processingTime={5}
        />
      )}

    </div>
  );
};

export default SearchSection;