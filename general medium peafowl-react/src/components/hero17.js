import React, { Fragment } from 'react'
import { useHistory } from 'react-router-dom';
import SearchSection from './SearchSection' 


import Script from 'dangerous-html/react'
import PropTypes from 'prop-types'
import image1 from './assets/img1.jpg';
import image2 from './assets/img2.jpg';
import image3 from './assets/img3.jpg';
import image4 from './assets/img4.jpg';
import image5 from './assets/img5.jpg';
import image6 from './assets/img6.jpg';
import image7 from './assets/img7.jpg';
import image8 from './assets/img8.jpg';
import image9 from './assets/img9.jpg';
import image10 from './assets/img10.jpg';
import image11 from './assets/img11.jpg';
import image12 from './assets/img12.jpg';

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


import './hero17.css'

const Hero17 = (props) => {
  const history = useHistory();

  const handleClick = () => {
    history.push('/get-started');
  };
  return (
    <div className="hero17-header78" style={{ padding: '0' }}>
      <div className="hero17-column thq-section-max-width thq-section-padding" >
        <div className="hero17-content1">
          <h1>
            {props.heading1 ?? (
              <Fragment>
                <h1 className="hero17-text8 thq-heading-1">
                  Find Your Perfect Tattoo Artist
                </h1>
              </Fragment>
            )}
          </h1>
          <p>
            {props.content1 ?? (
              <Fragment>
                <p className="hero17-text7 thq-body-large">
                  Discover talented tattoo artists based on their unique styles
                  and specialties. Search by location or explore the map to find
                  the perfect match for your next tattoo.
                </p>
              </Fragment>
            )}
          </p>
        </div>
        <div className="hero17-actions">
         
        <SearchSection />
        </div>
      </div>
      <div className="hero17-content2">
        <div className="hero17-row-container1 thq-mask-image-horizontal thq-animated-group-container-horizontal">
          <div className="thq-animated-group-horizontal">
            <img
              alt="New Image 1"
              src={image1}
              className="hero17-placeholder-image10 thq-img-ratio-1-1 thq-img-scale"
            />
            <img
              alt="New Image 2"
              src={image2}
              className="hero17-placeholder-image11 thq-img-ratio-1-1 thq-img-scale"
            />
            <img
              alt="New Image 3"
              src={image3}
              className="hero17-placeholder-image12 thq-img-ratio-1-1 thq-img-scale"
            />
            <img
              alt="New Image 4"
              src={image4}
              className="hero17-placeholder-image13 thq-img-ratio-1-1 thq-img-scale"
            />
            <img
              alt="New Image 5"
              src={image5}
              className="hero17-placeholder-image14 thq-img-ratio-1-1 thq-img-scale"
            />
            <img
              alt="New Image 6"
              src={image6}
              className="hero17-placeholder-image15 thq-img-ratio-1-1 thq-img-scale"
            />
          </div>
          <div className="thq-animated-group-horizontal">
            <img
              alt="New Image 7"
              src={image7}
              className="hero17-placeholder-image16 thq-img-ratio-1-1 thq-img-scale"
            />
            <img
              alt="New Image 8"
              src={image8}
              className="hero17-placeholder-image17 thq-img-ratio-1-1 thq-img-scale"
            />
            <img
              alt="New Image 9"
              src={image9}
              className="hero17-placeholder-image18 thq-img-ratio-1-1 thq-img-scale"
            />
            <img
              alt="New Image 10"
              src={image10}
              className="hero17-placeholder-image19 thq-img-ratio-1-1 thq-img-scale"
            />
            <img
              alt="New Image 11"
              src={image11}
              className="hero17-placeholder-image20 thq-img-ratio-1-1 thq-img-scale"
            />
            <img
              alt="New Image 12"
              src={image12}
              className="hero17-placeholder-image21 thq-img-ratio-1-1 thq-img-scale"
            />
          </div>
        </div>
        <div className="hero17-row-container2 thq-mask-image-horizontal thq-animated-group-container-horizontal">
          <div className="thq-animated-group-horizontal-reverse">
            <img
              alt="trash polka"
              src={trashPolka}
              className="hero17-placeholder-image22 thq-img-ratio-1-1 thq-img-scale"
            />
            <img
              alt="surrealism"
              src={surrealism}
              className="hero17-placeholder-image23 thq-img-ratio-1-1 thq-img-scale"
            />
            <img
              alt="flowers"
              src={flowers}
              className="hero17-placeholder-image24 thq-img-ratio-1-1 thq-img-scale"
            />
            <img
              alt="dark art"
              src={darkArt}
              className="hero17-placeholder-image25 thq-img-ratio-1-1 thq-img-scale"
            />
            <img
              alt="dot work"
              src={dotWork}
              className="hero17-placeholder-image26 thq-img-ratio-1-1 thq-img-scale"
            />
            <img
              alt="realism"
              src={realism}
              className="hero17-placeholder-image27 thq-img-ratio-1-1 thq-img-scale"
            />
          </div>
          <div className="thq-animated-group-horizontal-reverse">
            <img
              alt="micro realism"
              src={microRealism}
              className="hero17-placeholder-image28 thq-img-ratio-1-1 thq-img-scale"
            />
            <img
              alt="geometric"
              src={geometric}
              className="hero17-placeholder-image29 thq-img-ratio-1-1 thq-img-scale"
            />
            <img
              alt="fineline"
              src={fineline}
              className="hero17-placeholder-image30 thq-img-ratio-1-1 thq-img-scale"
            />
            <img
              alt="anime"
              src={anime}
              className="hero17-placeholder-image31 thq-img-ratio-1-1 thq-img-scale"
            />
            <img
              alt="new school"
              src={newSchool}
              className="hero17-placeholder-image32 thq-img-ratio-1-1 thq-img-scale"
            />
            <img
              alt="traditional"
              src={traditional}
              className="hero17-placeholder-image33 thq-img-ratio-1-1 thq-img-scale"
            />
          </div>
        </div>
      </div>
      <div>
        <div className="hero17-container2">
          <Script
            html={`<style>
  @keyframes scroll-x {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(calc(-100% - 16px));
    }
  }

  @keyframes scroll-y {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(calc(-100% - 16px));
    }
  }
</style>
`}
          ></Script>
        </div>
      </div>
    </div>
  )
}

Hero17.defaultProps = {
  image10Alt: 'Hero Image',
  image11Src:
    'https://images.unsplash.com/photo-1573496546735-c274b1fd186b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNDg4MzM5OHw&ixlib=rb-4.0.3&q=80&w=1080',
  image12Alt: 'Hero Image',
  image4Src:
    'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNDg4MzQwMHw&ixlib=rb-4.0.3&q=80&w=1080',
  image7Alt: 'Hero Image',
  action1: undefined,
  image3Src:
    'https://images.unsplash.com/photo-1564933983845-b9c52e170500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNDg4MzM5N3w&ixlib=rb-4.0.3&q=80&w=1080',
  action2: undefined,
  image9Alt: 'Hero Image',
  image11Alt: 'Hero Image',
  image12Src:
    'https://images.unsplash.com/photo-1635425542915-6da07160887c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNDg4MzM5OXw&ixlib=rb-4.0.3&q=80&w=1080',
  content1: undefined,
  image8Src:
    'https://images.unsplash.com/photo-1508970566-7e0cca18e5d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNDg4MzM5OXw&ixlib=rb-4.0.3&q=80&w=1080',
  image6Src:
    'https://images.unsplash.com/photo-1535119512-9e6a24a532c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNDg4MzM5OHw&ixlib=rb-4.0.3&q=80&w=1080',
  image10Src:
    'https://images.unsplash.com/photo-1501556424050-d4816356b73e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNDg4MzQwMHw&ixlib=rb-4.0.3&q=80&w=1080',
  image3Alt: 'Hero Image',
  image7Src:
    'https://images.unsplash.com/photo-1487700160041-babef9c3cb55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNDg4MzM5OHw&ixlib=rb-4.0.3&q=80&w=1080',
  image5Alt: 'Hero Image',
  image2Alt: 'Tattoo Artist Search Bar',
  image9Src:
    'https://images.unsplash.com/photo-1712246754649-119c1cef4a43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNDg4MzM5OXw&ixlib=rb-4.0.3&q=80&w=1080',
  image6Alt: 'Hero Image',
  image5Src:
    'https://images.unsplash.com/45/eDLHCtzRR0yfFtU0BQar_sylwiabartyzel_themap.jpg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNDg4MzM5OXw&ixlib=rb-4.0.3&q=80&w=1080',
  image1Src:
    'https://images.unsplash.com/photo-1598449935381-54511437c927?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNDg4MzQwMXw&ixlib=rb-4.0.3&q=80&w=1080',
  image8Alt: 'Hero Image',
  image1Alt: 'Tattoo Artist Map',
  image2Src:
    'https://images.unsplash.com/photo-1551385917-889e48f92c21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNDg4MzM5OHw&ixlib=rb-4.0.3&q=80&w=1080',
  heading1: undefined,
  image4Alt: 'Hero Image',
}

Hero17.propTypes = {
  image10Alt: PropTypes.string,
  image11Src: PropTypes.string,
  image12Alt: PropTypes.string,
  image4Src: PropTypes.string,
  image7Alt: PropTypes.string,
  action1: PropTypes.element,
  image3Src: PropTypes.string,
  action2: PropTypes.element,
  image9Alt: PropTypes.string,
  image11Alt: PropTypes.string,
  image12Src: PropTypes.string,
  content1: PropTypes.element,
  image8Src: PropTypes.string,
  image6Src: PropTypes.string,
  image10Src: PropTypes.string,
  image3Alt: PropTypes.string,
  image7Src: PropTypes.string,
  image5Alt: PropTypes.string,
  image2Alt: PropTypes.string,
  image9Src: PropTypes.string,
  image6Alt: PropTypes.string,
  image5Src: PropTypes.string,
  image1Src: PropTypes.string,
  image8Alt: PropTypes.string,
  image1Alt: PropTypes.string,
  image2Src: PropTypes.string,
  heading1: PropTypes.element,
  image4Alt: PropTypes.string,
}

export default Hero17
