import React from 'react';
import { Star, MapPin, MessageCircle, ExternalLink } from 'lucide-react';

const ArtistCard = ({ artist = {} }) => {
  const {
    name = 'Unknown Artist',
    profileImage = '/api/placeholder/400/400',
    location = 'Location not specified',
    styles = [],
    rating = 0,
    reviewCount = 0,
    recentWorks = [
      '/api/placeholder/400/400',
      '/api/placeholder/400/400',
      '/api/placeholder/400/400'
    ],
    instagramHandle = ''
  } = artist;

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-lg bg-gray-900 border border-gray-800">
      <div className="relative group">
        {/* Profile Image */}
        <img 
          src={profileImage} 
          alt={`${name}'s profile`}
          className="w-full h-48 object-cover"
        />
        
        {/* Recent Works Preview - Shown on Hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-1 h-full">
            {recentWorks.slice(0, 3).map((work, index) => (
              <img 
                key={index}
                src={work}
                alt="Recent work"
                className="w-1/3 h-full object-cover"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Artist Name and Rating */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-semibold text-white">{name}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-white">{rating.toFixed(1)}</span>
            <span className="text-sm text-gray-400">({reviewCount})</span>
          </div>
        </div>

        {/* Styles */}
        {styles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
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
            onClick={() => window.open(`https://instagram.com/${instagramHandle}`, '_blank')}
          >
            <ExternalLink className="w-4 h-4 text-white" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ArtistCard;