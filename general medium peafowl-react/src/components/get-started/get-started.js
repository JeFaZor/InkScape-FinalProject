import React, { useState } from 'react';
import './get-started.css';

// Importing images
import traditional from '../assets/tat1.jpg';
import newSchool from '../assets/tat2.png';
import Japnese from '../assets/tat3.png';
import fineline from '../assets/tat4.jpg';
import geometric from '../assets/tat5.jpg';
import microRealism from '../assets/tat6.jpg';
import realism from '../assets/tat7.jpg';
import dotWork from '../assets/tat8.jpg';
import darkArt from '../assets/tat9.jpg';
import flowers from '../assets/tat10.jpg';
import surrealism from '../assets/tat11.jpg';
import trashPolka from '../assets/tat12.jpg';
import styled from 'styled-components';
import GenrePicker from './GenrePicker';


// Updated genres array with the imported images
const genres = [
  { name: 'Traditional', image: traditional },
  { name: 'New School', image: newSchool },
  { name: 'Japnese', image: Japnese },
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

const SearchTattoo = () => {
  const [isGenrePickerOpen, setIsGenrePickerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredGenres, setFilteredGenres] = useState(genres);
  const [selectedGenre, setSelectedGenre] = useState(null); // To save the chosen genre

  // Handle the input change
  const handleInputChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);

    // Filter the genres by the search term
    const filtered = genres.filter((genre) =>
      genre.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredGenres(filtered);
  };

  // Handle genre click
  const handleGenreClick = (genre) => {
    setSelectedGenre(genre); // Save the selected genre to the state
  };

  // Reset the selected genre to go back to the default view
  const handleReset = () => {
    setSelectedGenre(null); // Clear the selected genre and go back to default layout
    setSearchTerm(''); // Clear the search term
    setFilteredGenres(genres); // Reset the filtered genres
  };
  const GenrePickerContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
  `;

  const GenreImage = styled.img`
    width: 100px;
    height: 100px;
    object-fit: cover;
    cursor: pointer;
    border-radius: 8px;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.1);
    }
  `;
  const handleOpenGenrePicker = () => {
    setIsGenrePickerOpen(!isGenrePickerOpen);
  };

  const handleSelectGenre = (genre) => {
    setSelectedGenre(genre);
    console.log("Selected Genre:", genre);
  };


  return (
    <StyledWrapper>
      {selectedGenre && (
    <div
      style={{
        padding: '1em',
        backgroundColor: '#f8f9fa',
        color: '#333',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '20%' ,          // Button takes full width on smaller screens
     
        textAlign: 'center',
        marginBottom: '10px',
        margin: '0 auto', // Center the box horizontally
      }}
        
          >
            <div style={{ fontSize: '1em', fontWeight: 'bold' }}>
              Selected Genre: {selectedGenre.name}
            </div>
            <button
              onClick={() => setSelectedGenre(null)}
              style={{
                padding: '0.5em 1em',
                marginTop: '10px',
                backgroundColor: '#ff4d4f',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                width: '50%' ,          // Button takes full width on smaller screens
                maxWidth: '200px',      // Restricts width on larger screens
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#ff7875')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ff4d4f')}
            >
              Clear Selection
            </button>
          </div>
        )}
      <div style={{
  marginTop: '80px',
}}>
  
        <div className="grid" />
        <div id="poda">

          {!isGenrePickerOpen && <div className="glow" />}
          {!isGenrePickerOpen && <div className="darkBorderBg" />}
          {!isGenrePickerOpen && <div className="darkBorderBg" />}
          {!isGenrePickerOpen && <div className="darkBorderBg" />}
          {!isGenrePickerOpen && <div className="white" />}
          {!isGenrePickerOpen && <div className="border" />}
          <div id="main">
            <input placeholder="Search..." type="text" name="text" className="input" />
            <div id="input-mask" />
            <div id="pink-mask" />
            <div className="filterBorder" />
            <div id="filter-icon" onClick={handleOpenGenrePicker}>
              <svg preserveAspectRatio="none" height={27} width={27} viewBox="4.8 4.56 14.832 15.408" fill="none">
                <path d="M8.16 6.65002H15.83C16.47 6.65002 16.99 7.17002 16.99 7.81002V9.09002C16.99 9.56002 16.7 10.14 16.41 10.43L13.91 12.64C13.56 12.93 13.33 13.51 13.33 13.98V16.48C13.33 16.83 13.1 17.29 12.81 17.47L12 17.98C11.24 18.45 10.2 17.92 10.2 16.99V13.91C10.2 13.5 9.97 12.98 9.73 12.69L7.52 10.36C7.23 10.08 7 9.55002 7 9.20002V7.87002C7 7.17002 7.52 6.65002 8.16 6.65002Z" stroke="#d6d6e6" strokeWidth={1} strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>



            {isGenrePickerOpen && <GenrePicker genres={genres} selectedGenre={selectedGenre} onSelectGenre={handleSelectGenre} />}





            <div id="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width={24} viewBox="0 0 24 24" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" height={24} fill="none" className="feather feather-search">
                <circle stroke="url(#search)" r={8} cy={11} cx={11} />
                <line stroke="url(#searchl)" y2="16.65" y1={22} x2="16.65" x1={22} />
                <defs>
                  <linearGradient gradientTransform="rotate(50)" id="search">
                    <stop stopColor="#f8e7f8" offset="0%" />
                    <stop stopColor="#b6a9b7" offset="50%" />
                  </linearGradient>
                  <linearGradient id="searchl">
                    <stop stopColor="#b6a9b7" offset="0%" />
                    <stop stopColor="#837484" offset="50%" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper >
  );
}

const StyledWrapper = styled.div`
  .grid {
    height: 800px;
    width: 800px;
    background-image: linear-gradient(to right, #0f0f10 1px, transparent 1px),
      linear-gradient(to bottom, #0f0f10 1px, transparent 1px);
    background-size: 1rem 1rem;
    background-position: center center;
    position: absolute;
    z-index: -1;
    filter: blur(1px);
  }
  .white,
  .border,
  .darkBorderBg,
  .glow {
    max-height: 70px;
    max-width: 314px;
    height: 100%;
    width: 100%;
    position: absolute;
    overflow: hidden;
    z-index: -1;
    /* Border Radius */
    border-radius: 12px;
    filter: blur(3px);
  }
  .input {
    background-color: #010201;
    border: none;
    /* padding:7px; */
    width: 301px;
    height: 56px;
    border-radius: 10px;
    color: white;
    padding-inline: 59px;
    font-size: 18px;
  }
  #poda {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .input::placeholder {
    color: #c0b9c0;
  }

  .input:focus {
    outline: none;
  }

  #main:focus-within > #input-mask {
    display: none;
  }

  #input-mask {
    pointer-events: none;
    width: 100px;
    height: 20px;
    position: absolute;
    background: linear-gradient(90deg, transparent, black);
    top: 18px;
    left: 70px;
  }
  #pink-mask {
    pointer-events: none;
    width: 30px;
    height: 20px;
    position: absolute;
    background: #cf30aa;
    top: 10px;
    left: 5px;
    filter: blur(20px);
    opacity: 0.8;
    //animation:leftright 4s ease-in infinite;
    transition: all 2s;
  }
  #main:hover > #pink-mask {
    //animation: rotate 4s linear infinite;
    opacity: 0;
  }

  .white {
    max-height: 63px;
    max-width: 307px;
    border-radius: 10px;
    filter: blur(2px);
  }

  .white::before {
    content: "";
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(83deg);
    position: absolute;
    width: 600px;
    height: 600px;
    background-repeat: no-repeat;
    background-position: 0 0;
    filter: brightness(1.4);
    background-image: conic-gradient(
      rgba(0, 0, 0, 0) 0%,
      #a099d8,
      rgba(0, 0, 0, 0) 8%,
      rgba(0, 0, 0, 0) 50%,
      #dfa2da,
      rgba(0, 0, 0, 0) 58%
    );
    //  animation: rotate 4s linear infinite;
    transition: all 2s;
  }
  .border {
    max-height: 59px;
    max-width: 303px;
    border-radius: 11px;
    filter: blur(0.5px);
  }
  .border::before {
    content: "";
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(70deg);
    position: absolute;
    width: 600px;
    height: 600px;
    filter: brightness(1.3);
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(
      #1c191c,
      #402fb5 5%,
      #1c191c 14%,
      #1c191c 50%,
      #cf30aa 60%,
      #1c191c 64%
    );
    // animation: rotate 4s 0.1s linear infinite;
    transition: all 2s;
  }
  .darkBorderBg {
    max-height: 65px;
    max-width: 312px;
  }
  .darkBorderBg::before {
    content: "";
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(82deg);
    position: absolute;
    width: 600px;
    height: 600px;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(
      rgba(0, 0, 0, 0),
      #18116a,
      rgba(0, 0, 0, 0) 10%,
      rgba(0, 0, 0, 0) 50%,
      #6e1b60,
      rgba(0, 0, 0, 0) 60%
    );
    transition: all 2s;
  }
  #poda:hover > .darkBorderBg::before {
    transform: translate(-50%, -50%) rotate(262deg);
  }
  #poda:hover > .glow::before {
    transform: translate(-50%, -50%) rotate(240deg);
  }
  #poda:hover > .white::before {
    transform: translate(-50%, -50%) rotate(263deg);
  }
  #poda:hover > .border::before {
    transform: translate(-50%, -50%) rotate(250deg);
  }

  #poda:hover > .darkBorderBg::before {
    transform: translate(-50%, -50%) rotate(-98deg);
  }
  #poda:hover > .glow::before {
    transform: translate(-50%, -50%) rotate(-120deg);
  }
  #poda:hover > .white::before {
    transform: translate(-50%, -50%) rotate(-97deg);
  }
  #poda:hover > .border::before {
    transform: translate(-50%, -50%) rotate(-110deg);
  }

  #poda:focus-within > .darkBorderBg::before {
    transform: translate(-50%, -50%) rotate(442deg);
    transition: all 4s;
  }
  #poda:focus-within > .glow::before {
    transform: translate(-50%, -50%) rotate(420deg);
    transition: all 4s;
  }
  #poda:focus-within > .white::before {
    transform: translate(-50%, -50%) rotate(443deg);
    transition: all 4s;
  }
  #poda:focus-within > .border::before {
    transform: translate(-50%, -50%) rotate(430deg);
    transition: all 4s;
  }

  .glow {
    overflow: hidden;
    filter: blur(30px);
    opacity: 0.4;
    max-height: 130px;
    max-width: 354px;
  }
  .glow:before {
    content: "";
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(60deg);
    position: absolute;
    width: 999px;
    height: 999px;
    background-repeat: no-repeat;
    background-position: 0 0;
    /*border color, change middle color*/
    background-image: conic-gradient(
      #000,
      #402fb5 5%,
      #000 38%,
      #000 50%,
      #cf30aa 60%,
      #000 87%
    );
    /* change speed here */
    //animation: rotate 4s 0.3s linear infinite;
    transition: all 2s;
  }

  @keyframes rotate {
    100% {
      transform: translate(-50%, -50%) rotate(450deg);
    }
  }
  @keyframes leftright {
    0% {
      transform: translate(0px, 0px);
      opacity: 1;
    }

    49% {
      transform: translate(250px, 0px);
      opacity: 0;
    }
    80% {
      transform: translate(-40px, 0px);
      opacity: 0;
    }

    100% {
      transform: translate(0px, 0px);
      opacity: 1;
    }
  }

  #filter-icon {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    max-height: 40px;
    max-width: 38px;
    height: 100%;
    width: 100%;

    isolation: isolate;
    overflow: hidden;
    /* Border Radius */
    border-radius: 10px;
    background: linear-gradient(180deg, #161329, black, #1d1b4b);
    border: 1px solid transparent;
  }
  .filterBorder {
    height: 42px;
    width: 40px;
    position: absolute;
    overflow: hidden;
    top: 7px;
    right: 7px;
    border-radius: 10px;
  }

  .filterBorder::before {
    content: "";

    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(90deg);
    position: absolute;
    width: 600px;
    height: 600px;
    background-repeat: no-repeat;
    background-position: 0 0;
    filter: brightness(1.35);
    background-image: conic-gradient(
      rgba(0, 0, 0, 0),
      #3d3a4f,
      rgba(0, 0, 0, 0) 50%,
      rgba(0, 0, 0, 0) 50%,
      #3d3a4f,
      rgba(0, 0, 0, 0) 100%
    );
    animation: rotate 4s linear infinite;
  }
  #main {
    position: relative;
  }
  #search-icon {
    position: absolute;
    left: 20px;
    top: 15px;
  }
`;


export default SearchTattoo;
