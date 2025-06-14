// src/components/search-results/artist-card/ArtistCard.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Star, MapPin, MessageCircle, ExternalLink, Check, ZoomIn, X } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Custom hook to convert GPS coordinates to a readable address
 */
const useReverseGeocode = (coordinates) => {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      const coordString = coordinates.replace(/[()]/g, '');
      const coordRegex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;

      if (!coordinates || !coordRegex.test(coordString)) {
        if (isMounted.current) {
          setAddress(coordinates);
        }
        return;
      }

      const [lat, lng] = coordString.split(',').map(coord => parseFloat(coord.trim()));

      try {
        if (isMounted.current) {
          setLoading(true);
        }

        const controller = new AbortController();
        const signal = controller.signal;

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
          {
            signal: signal,
            headers: {
              'Accept-Language': 'he',
              'User-Agent': 'INKSCAPE-App/1.0'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch address');
        }

        const data = await response.json();

        if (isMounted.current) {
          if (data && data.address) {
            const { road, city, town, village, suburb, neighbourhood, state } = data.address;

            const locality = city || town || village || suburb || state || '';
            const street = road || neighbourhood || '';

            if (locality && street) {
              setAddress(`${street}, ${locality}`);
            } else if (locality) {
              setAddress(locality);
            } else if (street) {
              setAddress(street);
            } else {
              setAddress(data.display_name);
            }
          } else {
            setAddress(`${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`);
          }
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch request was aborted');
          return;
        }

        console.error('Error fetching address:', error);

        if (isMounted.current) {
          setError(error);
          setAddress(`${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    if (coordinates) {
      fetchAddress();
    }
  }, [coordinates]);

  return { address, loading, error };
};

/**
 * Format a name for use in URL
 */
const formatNameForUrl = (name) => {
  if (!name) return 'unknown-artist';

  return name
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\w\_]+/g, '')
    .replace(/\_\_+/g, '_')
    .replace(/^_+/, '')
    .replace(/_+$/, '');
};

/**
 * ImageModal Component for Lightbox functionality
 */
const ImageModal = ({ isOpen, onClose, images, currentIndex, setCurrentIndex }) => {
  const [scale, setScale] = useState(1);

  if (!isOpen) return null;

  const nextImage = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
    setScale(1); // Reset zoom when changing image
  };

  const prevImage = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
    setScale(1); // Reset zoom when changing image
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 3));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.5, 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700"
      >
        <X size={24} />
      </button>

      {/* Navigation buttons */}
      <button
        onClick={prevImage}
        className="absolute left-4 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700"
      >
        &lt;
      </button>
      <button
        onClick={nextImage}
        className="absolute right-4 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700"
      >
        &gt;
      </button>

      {/* Image container */}
      <div className="relative max-w-4xl max-h-screen p-4">
        <img
          src={images[currentIndex]}
          alt={`Tattoo work ${currentIndex + 1}`}
          className="max-h-[80vh] transition-transform duration-200 ease-in-out"
          style={{ transform: `scale(${scale})` }}
        />

        {/* Zoom controls */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            onClick={zoomOut}
            className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 disabled:opacity-50"
            disabled={scale <= 1}
          >
            -
          </button>
          <button
            onClick={zoomIn}
            className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 disabled:opacity-50"
            disabled={scale >= 3}
          >
            +
          </button>
        </div>

        {/* Image counter */}
        <div className="absolute bottom-4 left-4 text-white bg-gray-800 px-2 py-1 rounded-md">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

const ArtistCard = ({ artist = {} }) => {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredImageIndex, setHoveredImageIndex] = useState(null);

  const {
    id,
    name = 'Unknown Artist',
    profileImage = '/api/placeholder/400/400',
    profile_image_url,
    location = 'Location not specified',
    styles = [],
    rating = 0,
    reviewCount = 0,
    recentWorks = [
      '/api/placeholder/400/400',
      '/api/placeholder/400/400',
      '/api/placeholder/400/400'
    ],
    recent_works_urls = [],
    instagramHandle = '',
    isVerified = false,
    serviceArea = '',
    bio = '',
    avg_rating
  } = artist;

  const displayRating = avg_rating || rating;
  const displayProfileImage = profile_image_url || profileImage;
  const displayRecentWorks = recent_works_urls.length > 0
    ? recent_works_urls
    : recentWorks;

  const { address: formattedLocation, loading: addressLoading } = useReverseGeocode(location);

  const displayLocation = addressLoading
    ? 'Loading location...'
    : (formattedLocation || serviceArea || 'Location not specified');

  const openImageModal = (index) => {
    if (isMounted.current) {
      setCurrentImageIndex(index);
      setModalOpen(true);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-lg bg-gray-900 border border-gray-800" >
      {/* Header Bar with Profile and Name */}
      <div className="flex items-center p-3 bg-gray-900 border-b border-gray-700">
        {/* Profile Image */}
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow mr-3 flex-shrink-0">
          <img
            src={displayProfileImage}
            alt={`${name}'s profile`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Artist Name and Verification */}
        <div className="flex items-center justify-between w-full">
          <div className="flex-1 mr-1 min-w-0">
            <Link
              to={{
                pathname: `/artist/${formatNameForUrl(name)}`,
                state: { artistId: id }
              }}
              className="text-lg font-semibold text-white hover:text-purple-400 transition-colors block truncate"
            >
              {name}
            </Link>
          </div>
          {isVerified && (
            <span className="flex items-center text-green-400 text-sm whitespace-nowrap flex-shrink-0">
              <Check size={16} className="mr-1" />
              <span>verified</span>
            </span>
          )}
        </div>
      </div>

      {/* Tattoo Gallery - with hover and click functionality */}
      <div className="relative bg-gray-800" style={{ height: "160px" }}>
        <div className="grid grid-cols-3 gap-1 h-full">
          {displayRecentWorks.slice(0, 3).map((work, index) => (
            <div
              key={index}
              className="relative overflow-hidden cursor-pointer group"
              onClick={() => openImageModal(index)}
              onMouseEnter={() => isMounted.current && setHoveredImageIndex(index)}
              onMouseLeave={() => isMounted.current && setHoveredImageIndex(null)}
            >
              <img
                src={work}
                alt={`Recent work ${index + 1}`}
                className={`w-full h-full object-cover transition-transform duration-200 ${hoveredImageIndex === index ? 'scale-110' : 'scale-100'
                  }`}
              />
              {/* Zoom icon on hover */}
              <div className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-200 ${hoveredImageIndex === index ? 'opacity-100' : 'opacity-0'
                }`}>
                <ZoomIn className="text-white" size={24} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4">
        {/* Location and Rating - First row */}
        <div className="flex items-center">
          <div className="flex items-center gap-1 text-sm text-gray-400 flex-1 min-w-0">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">
              {displayLocation}
              {artist.distance && ` (${artist.distance}km away)`}
            </span>
          </div>
          <div className="flex items-center gap-0.5 ml-1 flex-shrink-0">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-white text-sm">{displayRating.toFixed(1)}</span>
            <span className="text-sm text-gray-400">({reviewCount})</span>
          </div>
        </div>

        {/* Bio */}
        {bio && (
          <div className="text-gray-300 my-3 line-clamp-2 text-sm">
            {bio}
          </div>
        )}

        {/* Styles */}
        {styles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 mt-3">
            {styles.map((style, index) => (
              <span
                key={index}
                className="px-2.5 py-0.5 rounded-full text-xs bg-purple-900/50 text-purple-200 border border-purple-500/50"
              >
                {style}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pb-4 flex gap-2">
        <button
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Contact
        </button>
        {instagramHandle && (
          <button
            className="px-4 py-2 rounded-md border border-gray-700 hover:bg-gray-800 transition-colors"
            onClick={() => window.open(`${instagramHandle}`, '_blank')}
          >
            <ExternalLink className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Image modal (lightbox) */}
      <ImageModal
        isOpen={modalOpen}
        onClose={() => isMounted.current && setModalOpen(false)}
        images={displayRecentWorks}
        currentIndex={currentImageIndex}
        setCurrentIndex={(index) => isMounted.current && setCurrentImageIndex(index)}
      />
    </div>
  );
};

export default ArtistCard;