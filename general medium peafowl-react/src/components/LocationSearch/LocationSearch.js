import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const formatAddress = (fullAddress) => {
  const parts = fullAddress.split(',');
 
  const relevantParts = parts
    .map(part => part.trim())
    .filter(part => {
      if (/^\d+$/.test(part)) return false; // Remove postal codes
      if (part.includes('מחוז')) return false; // Remove districts
      if (part.includes('נפת')) return false; // Remove districts
      if (part.trim() === 'ישראל') return false; // Remove country
      return true;
    })
    .slice(0, 3); // Keep only first 3 relevant parts

  return relevantParts.join(', ');
};

const LocationSearch = ({ onLocationSelect, onClose }) => {
  const { t, i18n } = useTranslation(); // עדכן את השורה הזאת
    // useEffect כאן
    useEffect(() => {
      // Force re-render when language changes
    }, [i18n.language]);
  const [searchQuery, setSearchQuery] = useState('');
  const [address, setAddress] = useState('');
  const [radius, setRadius] = useState(1.5);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [mapCenter, setMapCenter] = useState([31.7767, 35.2345]); // Default to Israel's center
  const [markerPosition, setMarkerPosition] = useState([31.7767, 35.2345]);
  const searchTimeout = useRef(null);

  const searchLocation = async (query) => { 
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' Israel')}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      searchLocation(value);
    }, 500);
  };

  const handleSearchResultClick = (result) => {
    const newPosition = [parseFloat(result.lat), parseFloat(result.lon)];
    setMarkerPosition(newPosition);
    setMapCenter(newPosition);
    const formattedAddress = formatAddress(result.display_name);
    setAddress(formattedAddress);
    setSearchQuery(formattedAddress);
    setSearchResults([]); // Clear results after selection
  };

  const handleCurrentLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newPosition = [position.coords.latitude, position.coords.longitude];
          setMarkerPosition(newPosition);
          setMapCenter(newPosition);

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
            );
            const data = await response.json();
            const formattedAddress = formatAddress(data.display_name);
            setAddress(formattedAddress);
            setSearchQuery(formattedAddress);
          } catch (error) {
            console.error('Error reverse geocoding:', error);
            setAddress(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
            setSearchQuery(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
          }

          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoadingLocation(false);
        }
      );
    }
  };

  const handleConfirm = () => {
    if (address) {
      onLocationSelect({
        address,
        radius,
        coordinates: markerPosition
      });
      onClose();
    }
  };

  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
    setMarkerPosition([lat, lng]);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      const formattedAddress = formatAddress(data.display_name);
      setAddress(formattedAddress);
      setSearchQuery(formattedAddress);
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      setSearchQuery(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 w-[800px] shadow-lg">
      <h3 className="text-white text-lg mb-4">{t('search.setLocation')}</h3>



      <div className="flex gap-4">
        {/* Map Section */}
        <div className="flex-1">
          <div className="h-64 rounded-lg overflow-hidden border border-gray-700">
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              onClick={handleMapClick}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={markerPosition}
                eventHandlers={{
                  dragend: async (e) => {
                    const marker = e.target;
                    const position = marker.getLatLng();
                    setMarkerPosition([position.lat, position.lng]);

                    try {
                      const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`
                      );
                      const data = await response.json();
                      const formattedAddress = formatAddress(data.display_name);
                      setAddress(formattedAddress);
                      setSearchQuery(formattedAddress);
                    } catch (error) {
                      console.error('Error reverse geocoding:', error);
                      setAddress(`${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`);
                      setSearchQuery(`${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`);
                    }
                  }
                }}
                draggable={true}
              />
              <Circle
                center={markerPosition}
                radius={radius * 1000}
                pathOptions={{ color: 'purple', fillColor: 'purple', fillOpacity: 0.2 }}
              />
              <MapUpdater center={mapCenter} />
            </MapContainer>
          </div>
        </div>

        {/* Controls Section */}
        <div className="w-72 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                placeholder={t('search.searchLocation')}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 border border-gray-600"
              />
              {isSearching ? (
                <Loader2 className="w-4 h-4 absolute left-3 top-3 text-gray-400 animate-spin" />
              ) : (
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              )}
            </div>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute w-full mt-1 bg-gray-700 rounded-lg shadow-lg border border-gray-600 z-10">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchResultClick(result)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg truncate"
                  >
                    {formatAddress(result.display_name)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Current Location Button */}
          <button
            onClick={handleCurrentLocation}
            disabled={isLoadingLocation}
            className="flex items-center justify-center w-full gap-2 py-2 text-gray-300 hover:text-white border border-gray-600 rounded-lg hover:border-gray-500"
          >
            {isLoadingLocation ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
            {t('search.currentLocation')}
          </button>

          {/* Radius Slider */}
          <div className="space-y-2">
            <label className="block text-sm text-gray-400">
            {t('search.searchRadius')}: {radius} km
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="w-full accent-purple-500"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1km</span>
              <span>50km</span>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            disabled={!address}
            className={`w-full py-2 rounded-lg ${address
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
          >
            {t('search.confirmLocation')}



          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationSearch;