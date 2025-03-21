import React from 'react';
import { useHistory } from 'react-router-dom';
import { Search, Image, MapPin, Filter, Tag, X } from 'lucide-react';
import GenrePicker from './get-started/GenrePicker';
import LocationSearch from './LocationSearch/LocationSearch';
import SearchResults from './search-results/SearchResults';


// Import tattoo style images (kept from original)
import traditional from './assets/tat1.jpg';
import newSchool from './assets/tat2.png';
import anime from './assets/tat3.png';
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
  { name: 'Anime', image: anime },
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
  const [tagSearchTerm, setTagSearchTerm] = React.useState('');
  const filteredTags = React.useMemo(() => {
    return tags.filter(tag =>
      tag.toLowerCase().includes(tagSearchTerm.toLowerCase())
    );
  }, [tagSearchTerm]);
  const history = useHistory();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showStyleFilter, setShowStyleFilter] = React.useState(false);
  const [showLocationFilter, setShowLocationFilter] = React.useState(false);
  const [selectedStyle, setSelectedStyle] = React.useState(null);
  const [selectedLocation, setSelectedLocation] = React.useState('');
  const [filteredGenres, setFilteredGenres] = React.useState(genres);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const fileInputRef = React.useRef(null);
  const [showTagFilter, setShowTagFilter] = React.useState(false);
  const [selectedTags, setSelectedTags] = React.useState([]);
  const [hasSearched, setHasSearched] = React.useState(false);

  // Modified handleSearch
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('q', searchTerm);
    if (selectedStyle) params.append('style', selectedStyle.name);
    if (selectedLocation) params.append('location', selectedLocation);
    if (selectedTags.length > 0) params.append('tags', selectedTags.join(','));
    
    // Update URL without navigation
    window.history.pushState({}, '', `?${params.toString()}`);
    
    // Show search results
    setHasSearched(true);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      
      // העברת הקובץ לשרת לניתוח
      const formData = new FormData();
      formData.append('image', file);
      
      try {
        const response = await fetch('http://localhost:5000/api/analyze-tattoo', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Failed to analyze image');
        }
        
        const result = await response.json();
        
        // מצא את האובייקט של סגנון הקעקוע המתאים
        const matchedGenre = genres.find(genre => genre.name === result.style);
        
        if (matchedGenre) {
          setSelectedStyle(matchedGenre);
          setShowStyleFilter(false);
        }
        
        // הוסף את התגיות שזוהו
        if (result.tags && result.tags.length > 0) {
          setSelectedTags(result.tags);
        }
        
        // הצג הודעה למשתמש
        alert(`Style detected: ${result.style}\nTags: ${result.tags.join(', ')}`);
        
        
      } catch (error) {
        console.error('Error analyzing image:', error);
        alert('Failed to analyze the image. Please try again.');
      }
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedStyle(null);
    setSelectedLocation('');
    setFilteredGenres(genres);
    setSelectedImage(null);
    setSelectedTags([]);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className={`relative w-full max-w-2xl mx-auto ${showStyleFilter ? 'mb-80' : 'mb-0'}`}>        {/* Main Search Options */}
        <div className="flex flex-col space-y-4">
          {/* Text Search */}
          <div className="relative flex items-center">
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for tattoo artist by name..."
                className="w-full h-14 px-6 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
              />

            </div>
          </div>

          {/* Filter Buttons */}

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setShowStyleFilter(!showStyleFilter);
                setShowLocationFilter(false);
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
                <div className=" px-4"> {/* Custom 1500px width */}
                  <GenrePicker
                    genres={filteredGenres}
                    onSelectGenre={(genre) => {
                      setSelectedStyle(genre);
                      setShowStyleFilter(false);
                    }}
                  />
                </div>
              </div>
            )}

            {/* Location Filter Dropdown */}
            {showLocationFilter && (
              <div className="relative w-full flex justify-center mt-4 mb-10">

                <LocationSearch
                  onLocationSelect={(locationData) => {
                    setSelectedLocation(`${locationData.address} (${locationData.radius}km)`);
                    setShowLocationFilter(false);
                  }}
                  onClose={() => setShowLocationFilter(false)}
                />
              </div>
            )}

            {/* Tag Filter Dropdown */}
            {showTagFilter && (
              <div className="relative w-full flex justify-center mt-4 mb-4 w-100">
                <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg">
                  {/* שדה חיפוש תגיות */}
                  <div className="p-2 border-b border-gray-700">
                    <input
                      type="text"
                      value={tagSearchTerm}
                      onChange={(e) => setTagSearchTerm(e.target.value)}
                      placeholder="Search tags..."
                      className="w-full px-2 py-1 text-sm bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  {/* רשימת התגיות המסוננת */}
                  <div className="max-h-60 overflow-y-auto">
                    {filteredTags.map((tagItem) => (
                      <button
                        key={tagItem}
                        className="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white"
                        onClick={() => {
                          if (!selectedTags.includes(tagItem)) {
                            setSelectedTags(prev => [...prev, tagItem]);
                          }
                        }}
                      >
                        {tagItem}
                      </button>
                    ))}

                    {/* הודעה אם אין תוצאות */}
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
                    onClick={() => {
                      setSelectedTags(prev => prev.filter(t => t !== tag));
                    }}
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
            className="flex items-center justify-center gap-2 w-fit mx-auto py-3 px-7 rounded-lg bg-purple-600/80 text-white hover:bg-purple-600 transition-all"
          >
            <Search className="w-5 h-5" />
            Search Artists
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
      {hasSearched && <SearchResults />}
    </div>
  );
};

export default SearchSection;