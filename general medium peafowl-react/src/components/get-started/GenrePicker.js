import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const colors = {
  background: '#0f0312',
  containerBg: '#170720',
  borderColor: '#4f2175',
  hoverEffect: 'rgba(94, 20, 135, 0.8)',
  textColor: '#D1C4E9',
  shadowColor: 'rgba(64, 0, 64, 0.5)'
};

const GenrePickerContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 30px;
  background-color: ${colors.background};
  border: 2px solid ${colors.borderColor};
  border-radius: 20px;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.5);
  position: relative;
  top: 3vh;
  z-index: 10;
  max-width: 100%;
  overflow-x: auto;
  white-space: nowrap;
`;

const GenreImageContainer = styled.div`
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 12px;
  overflow: hidden;
  transition: 
    transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
    box-shadow 0.4s ease;
  background-color: ${colors.containerBg};
  padding: 10px;
  border: 1px solid ${colors.borderColor};
  
  &:hover {
    transform: scale(1.07);
    box-shadow: 
      0 0 25px ${colors.hoverEffect},
      0 5px 15px rgba(0,0,0,0.3);
  }
  
  &:active {
    transform: scale(0.95);
  }

  cursor: pointer;
  position: relative;
`;

const GenreImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
  filter: brightness(0.9) contrast(1.2);
  transition: 
    transform 0.3s ease,
    filter 0.3s ease;

  ${GenreImageContainer}:hover & {
    transform: scale(1.1);
    filter: brightness(1.1) contrast(1.3);
  }
`;

// Memomized image component to prevent unnecessary re-renders
const MemoizedGenreImage = React.memo(({ src, alt, onError, onLoad }) => {
  return (
    <GenreImage
      src={src}
      alt={alt}
      onError={onError}
      onLoad={onLoad}
    />
  );
});

const GenrePicker = ({ genres, onSelectGenre }) => {
  const [hoveredGenre, setHoveredGenre] = useState(null);
  const [imageCache, setImageCache] = useState({});
  const [loading, setLoading] = useState(true);

  // Preload all images to avoid loading issues
  useEffect(() => {
    const preloadImages = async () => {
      setLoading(true);
      const cache = {};
      
      try {
        await Promise.all(
          genres.map((genre) => {
            return new Promise((resolve) => {
              const img = new Image();
              
              img.onload = () => {
                cache[genre.name] = {
                  loaded: true,
                  src: genre.image
                };
                resolve();
              };
              
              img.onerror = () => {
                console.warn(`Failed to load image for genre: ${genre.name}`);
                cache[genre.name] = {
                  loaded: false,
                  src: '/fallback-image.jpg' // Default fallback image
                };
                resolve();
              };
              
              img.src = genre.image;
            });
          })
        );
        
        setImageCache(cache);
      } catch (error) {
        console.error("Error preloading images:", error);
      } finally {
        setLoading(false);
      }
    };
    
    preloadImages();
  }, [genres]);

  // Memoized error handler to prevent recreating on each render
  const handleImageError = useCallback((genreName) => {
    console.warn(`Image error occurred for genre: ${genreName}`);
    setImageCache(prev => ({
      ...prev,
      [genreName]: {
        loaded: false,
        src: '/fallback-image.jpg'
      }
    }));
  }, []);

  // Get the appropriate image source (from cache or original)
  const getImageSrc = useCallback((genre) => {
    if (imageCache[genre.name]) {
      return imageCache[genre.name].src;
    }
    return genre.image;
  }, [imageCache]);

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', padding: '20px' }}>Loading genres...</div>;
  }

  return (
    <GenrePickerContainer>
      {genres.map((genre, index) => (
        <GenreImageContainer
          key={`genre-${genre.name}-${index}`}
          onMouseEnter={() => setHoveredGenre(genre.name)}
          onMouseLeave={() => setHoveredGenre(null)}
          onClick={() => onSelectGenre(genre)}
          data-tooltip-id="genre-tooltip"
        >
          <MemoizedGenreImage
            src={getImageSrc(genre)}
            alt={genre.name}
            onError={() => handleImageError(genre.name)}
          />
          <span style={{ 
            marginTop: '8px', 
            color: '#fff', 
            fontSize: '14px', 
            textAlign: 'center', 
            fontFamily: 'Raleway, sans-serif' 
          }}>
            {genre.name}
          </span>
        </GenreImageContainer>
      ))}
      <ReactTooltip id="genre-tooltip" place="top" />
    </GenrePickerContainer>
  );
};

export default React.memo(GenrePicker);