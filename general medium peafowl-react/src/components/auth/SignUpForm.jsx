import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Mail, User, MapPin, Upload, X, Image } from 'lucide-react';
import { Instagram } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';


// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to update map when marker position changes
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const SignUpForm = ({ formData, setFormData }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he'; // או כל בדיקה אחרת לעברית
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Map related states
  const [mapCenter, setMapCenter] = useState([31.7767, 35.2345]); // Default to Israel's center
  const [markerPosition, setMarkerPosition] = useState([31.7767, 35.2345]);
  const [address, setAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef(null);
  const profileImageInputRef = useRef(null);


  // Image upload states
  const [previewImages, setPreviewImages] = useState([null, null, null]);
  const fileInputRefs = [useRef(null), useRef(null), useRef(null)];

  const tattooStyles = [
    'Traditional', 'New School', 'Japanese', 'Fineline', 'Geometric',
    'Micro Realism', 'Realism', 'Dot Work', 'Dark Art', 'Flowers',
    'Surrealism', 'Trash Polka'
  ];

  const getStyleTranslation = (style) => {
    const styleMap = {
      'Traditional': t('styles.traditional'),
      'New School': t('styles.newschool'),
      'Japanese': t('styles.japanese'),
      'Fineline': t('styles.fineline'),
      'Geometric': t('styles.geometric'),
      'Micro Realism': t('styles.microrealism'),
      'Realism': t('styles.realism'),
      'Dot Work': t('styles.dotwork'),
      'Dark Art': t('styles.darkart'),
      'Flowers': t('styles.flowers'),
      'Surrealism': t('styles.surrealism'),
      'Trash Polka': t('styles.trashpolka')
    };
    return styleMap[style] || style;
  };

  useEffect(() => {
    const strength = calculatePasswordStrength(formData.password);
    setPasswordStrength(strength);
  }, [formData.password]);

  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    let score = 0;
    if (password.length > 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStyleChange = (style) => {
    setFormData(prev => ({
      ...prev,
      styles: prev.styles.includes(style)
        ? prev.styles.filter(s => s !== style)
        : [...prev.styles, style]
    }));
  };

  // Function to search for locations using Nominatim
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

  // Handle search input change
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

  // Handle search result selection
  const handleSearchResultClick = (result) => {
    const newPosition = [parseFloat(result.lat), parseFloat(result.lon)];
    setMarkerPosition(newPosition);
    setMapCenter(newPosition);

    // Format the address
    const formattedAddress = formatAddress(result.display_name);
    setAddress(formattedAddress);
    setSearchQuery(formattedAddress);
    setSearchResults([]);

    // Update form data with location coordinates
    setFormData(prev => ({
      ...prev,
      location: `${newPosition[0]},${newPosition[1]}`,
      locationAddress: formattedAddress
    }));
  };

  // Helper function to format addresses
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

  // Handle map click
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

      // Update form data
      setFormData(prev => ({
        ...prev,
        location: `${lat},${lng}`,
        locationAddress: formattedAddress
      }));
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      setSearchQuery(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);

      // Update form data with coordinates only
      setFormData(prev => ({
        ...prev,
        location: `${lat},${lng}`,
        locationAddress: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      }));
    }
  };

  // Handle current location
  const handleCurrentLocation = () => {
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

            // Update form data
            setFormData(prev => ({
              ...prev,
              location: `${newPosition[0]},${newPosition[1]}`,
              locationAddress: formattedAddress
            }));
          } catch (error) {
            console.error('Error reverse geocoding:', error);
            const coordsText = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
            setAddress(coordsText);
            setSearchQuery(coordsText);

            // Update form data with coordinates only
            setFormData(prev => ({
              ...prev,
              location: `${newPosition[0]},${newPosition[1]}`,
              locationAddress: coordsText
            }));
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  // Handle image selection
  const handleImageSelect = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      // Create object URL for preview
      const imageUrl = URL.createObjectURL(file);

      // Update preview images
      const newPreviewImages = [...previewImages];
      newPreviewImages[index] = imageUrl;
      setPreviewImages(newPreviewImages);

      // Update form data with the file
      setFormData(prev => {
        const newWorkImages = [...(prev.workImages || [])];
        newWorkImages[index] = file;
        return {
          ...prev,
          workImages: newWorkImages
        };
      });
    }
  };

  // Remove an image
  const handleRemoveImage = (index) => {
    // Clear the file input
    if (fileInputRefs[index].current) {
      fileInputRefs[index].current.value = '';
    }

    // Update preview images
    const newPreviewImages = [...previewImages];
    newPreviewImages[index] = null;
    setPreviewImages(newPreviewImages);

    // Update form data
    setFormData(prev => {
      const newWorkImages = [...(prev.workImages || [])];
      newWorkImages[index] = null;
      return {
        ...prev,
        workImages: newWorkImages
      };
    });
  };

  const PasswordStrengthIndicator = () => (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-all ${index < passwordStrength
              ? 'bg-purple-600'
              : 'bg-gray-700'
              }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-400">
        {passwordStrength === 0 && t('auth.enterPassword')}
        {passwordStrength === 1 && t('auth.weak')}
        {passwordStrength === 2 && t('auth.fair')}
        {passwordStrength === 3 && t('auth.good')}
        {passwordStrength === 4 && t('auth.strong')}
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-gray-300 text-sm mb-4">{t('auth.iAm')}</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => {
              setUserType('artist');
              // Also update parent component's state
              setFormData(prev => ({
                ...prev,
                userType: 'artist'  // Add userType to formData
              }));
            }}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${userType === 'artist'
              ? 'border-purple-600 bg-purple-600/20'
              : 'border-gray-700 hover:border-purple-600/50'
              }`}
          >
            <h3 className="text-white font-medium mb-1">{t('auth.tattooArtist')}</h3>
            <p className="text-gray-400 text-sm">{t('auth.iOwnOrWorkAtATattooStudio')}</p>
          </button>
          <button
            type="button"
            onClick={() => {
              setUserType('client');
              // Also update parent component's state
              setFormData(prev => ({
                ...prev,
                userType: 'client'  // Add userType to formData
              }));
            }}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${userType === 'client'
              ? 'border-purple-600 bg-purple-600/20'
              : 'border-gray-700 hover:border-purple-600/50'
              }`}
          >
            <h3 className="text-white font-medium mb-1">{t('auth.lookingForAnArtist')}</h3>
            <p className="text-gray-400 text-sm">{t('auth.iWantToGetATattoo')}</p>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-gray-300 text-sm mb-2">{t('auth.firstName')}</label>
            <div className="relative group">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-700 group-hover:border-gray-600"
                placeholder={t('auth.firstName')}
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-gray-300 text-sm mb-2">{t('auth.lastName')}</label>
            <div className="relative group">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-700 group-hover:border-gray-600"
                placeholder={t('auth.lastName')}
              />
            </div>
          </div>
        </div>

        <div className="relative">
          <label className="block text-gray-300 text-sm mb-2">{t('auth.email')}</label>
          <div className="relative group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-gray-800 text-white rounded-lg py-3 pr-4 pl-12 focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-700 group-hover:border-gray-600 transition-colors"
              placeholder={t('auth.email')}
              style={{ textAlign: 'left', direction: 'ltr' }}
            />
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>
        </div>


        <div className="relative">
          <label className="block text-gray-300 text-sm mb-2">{t('auth.password')}</label>
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full bg-gray-800 text-white rounded-lg py-3 pr-4 pl-12 focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-700 group-hover:border-gray-600 transition-colors"
              placeholder={t('auth.chooseAPassword')}
              style={{ textAlign: 'left', direction: 'ltr' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-3 text-gray-400 hover:text-gray-300 focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <PasswordStrengthIndicator />
        </div>
      </div>

      {userType === 'artist' && (
        <div className="space-y-6">
          {/* Studio Location with Map */}
          <div className="relative space-y-4">
            <label className="block text-gray-300 text-sm mb-2">{t('auth.studioLocation')}</label>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                placeholder={t('auth.searchLocation')}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-purple-600 border border-gray-700"
              />
              <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute w-full mt-1 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10 max-h-60 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearchResultClick(result)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {formatAddress(result.display_name)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleCurrentLocation}
              className="flex items-center justify-center w-full gap-2 py-2 text-gray-300 hover:text-white border border-gray-700 rounded-lg hover:border-gray-600"
            >
              <MapPin className="w-4 h-4" />
              {t('auth.useMyCurrentLocation')}
            </button>

            <div className="h-48 rounded-lg overflow-hidden border border-gray-700">
              <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker
                  position={markerPosition}
                  draggable={true}
                  eventHandlers={{
                    dragend: (e) => {
                      const marker = e.target;
                      const position = marker.getLatLng();
                      handleMapClick({ latlng: position });
                    },
                    click: (e) => {
                      const marker = e.target;
                      const position = marker.getLatLng();
                      handleMapClick({ latlng: position });
                    }
                  }}
                />
                <MapUpdater center={mapCenter} />
              </MapContainer>
            </div>
          </div>

          {/* Image Uploads */}
          {/* Profile Image Upload - Add this code right after the artist location section */}
          <div className="space-y-3">
            <label className="block text-gray-300 text-sm mb-2">{t('auth.profileImage')}</label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                {formData.profileImage ? (
                  <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-purple-500 relative group">
                    <img
                      src={URL.createObjectURL(formData.profileImage)}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, profileImage: null }));
                        }}
                        className="p-1 rounded-full bg-red-500 text-white"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => profileImageInputRef.current.click()}
                    className="h-24 w-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-full hover:border-purple-500 transition-colors"
                  >
                    <Upload className="text-gray-400 mb-1" size={20} />
                    <span className="text-xs text-gray-400">{t('common.upload')}</span>

                  </button>
                )}
                <input
                  type="file"
                  ref={profileImageInputRef}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFormData(prev => ({ ...prev, profileImage: file }));
                    }
                  }}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div className="text-sm text-gray-400">
                <p>{t('auth.addAProfileImage')}</p>
                <p className="text-xs">{t('auth.thisWillBeDisplayedOnYourProfile')}</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <label className="block text-gray-300 text-sm mb-2">{t('auth.uploadYourWork')}</label>
            <p className="text-xs text-gray-400">{t('auth.theseImagesWillBeDisplayedInYourArtistProfile')}</p>

            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((index) => (
                <div key={index} className="relative">
                  {previewImages[index] ? (
                    // Show preview if image selected
                    <div className="h-32 rounded-lg overflow-hidden border border-purple-500 relative group">
                      <img
                        src={previewImages[index]}
                        alt={`Work preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="p-1 rounded-full bg-red-500 text-white"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Show upload button if no image
                    <button
                      type="button"
                      onClick={() => fileInputRefs[index].current.click()}
                      className="h-32 w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg hover:border-purple-500 transition-colors"
                    >
                      <Upload className="text-gray-400 mb-2" size={24} />
                      <span className="text-sm text-gray-400">{t('common.upload')}</span>
                    </button>
                  )}
                  <input
                    type="file"
                    ref={fileInputRefs[index]}
                    onChange={(e) => handleImageSelect(index, e)}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tattoo Styles */}
          <div>
            <label className="block text-gray-300 text-sm mb-3">{t('auth.tattooStyles')}</label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {tattooStyles.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => handleStyleChange(style)}
                  className={`p-2 rounded-lg text-sm transition-all duration-200 ${formData.styles.includes(style)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                  {getStyleTranslation(style)}
                </button>
              ))}
            </div>
          </div>

          {/* Instagram Handle */}
          <div className="relative">
            <label className="block text-gray-300 text-sm mb-2">{t('auth.instagramHandle')}</label>
            <div className="relative group">
              <input
                type="text"
                name="instagram"
                value={formData.instagram || ''}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white rounded-lg py-3 pr-4 pl-12 focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-700 group-hover:border-gray-600 transition-colors"
                placeholder={t('auth.instagramHandle')}
                style={{ textAlign: 'left', direction: 'ltr' }}
              />
              <Instagram className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>
          </div>

          {/* Bio */}
          <div className="relative">
            <label className="block text-gray-300 text-sm mb-2">{t('auth.bio')}</label>
            <textarea
              name="bio"
              value={formData.bio || ''}
              onChange={handleInputChange}
              rows={4}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-700 hover:border-gray-600 transition-colors"
              placeholder={t('auth.tellClientsAboutYourselfAndYourWork')}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpForm;