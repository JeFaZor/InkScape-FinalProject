import React, { useState } from 'react'; // Add useState import

import styled from 'styled-components';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'; // Import the tooltip CSS

const colors = {
    background: '#0f0312', // Deep, almost black purple
    containerBg: '#170720', // Very dark, rich purple
    borderColor: '#4f2175', // Deep, muted purple border
    hoverEffect: 'rgba(94, 20, 135, 0.8)', // Deep purple with opacity
    textColor: '#D1C4E9', // Soft lavender for text
    shadowColor: 'rgba(64, 0, 64, 0.5)' // Deep purple shadow
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



const GenrePicker = ({ genres, onSelectGenre }) => {
    const [hoveredGenre, setHoveredGenre] = useState(null); // Move useState inside the component

    return (
        <GenrePickerContainer>
            {genres.map((genre, index) => (
                <GenreImageContainer
                    key={index}
                    onMouseEnter={() => setHoveredGenre(genre.name)}
                    onMouseLeave={() => setHoveredGenre(null)}
                    onClick={() => onSelectGenre(genre)}
                    data-tooltip-id="genre-tooltip"
                >
                    <GenreImage src={genre.image} alt={genre.name} />
                    <span style={{ marginTop: '8px',  color: '#fff', fontSize: '14px', textAlign: 'center', fontFamily: 'Raleway, sans-serif' }}>{genre.name}</span>

                </GenreImageContainer>
            ))}
        </GenrePickerContainer>
    );
};



export default GenrePicker;
