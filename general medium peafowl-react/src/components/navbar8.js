import React, { useState, Fragment } from 'react'
import { useHistory } from 'react-router-dom';



import PropTypes from 'prop-types'

import './navbar8.css'
import { useAuth } from './context/AuthContext';

const Navbar8 = (props) => {
  const history = useHistory();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [link5DropdownVisible, setLink5DropdownVisible] = useState(false)
  const { user, isAuthenticated, signOut } = useAuth();
  const [link5AccordionOpen, setLink5AccordionOpen] = useState(false)
  return (
    <header className="navbar8-container1">
      <header data-thq="thq-navbar" className="navbar8-navbar-interactive">
        <img
          alt={props.logoAlt}
          src={props.logoSrc}
          className="navbar8-image1"
        />
        <div data-thq="thq-navbar-nav" className="navbar8-desktop-menu">
          <nav className="navbar8-links1">
            <a href={null}>
              {props.link1 ?? (
                <Fragment>
                  <span className="navbar8-text26 thq-link thq-body-small">
                    Home
                  </span>
                </Fragment>
              )}
            </a>
            <a href={null}>
              {props.link2 ?? (
                <Fragment>
                  <span className="navbar8-text15 thq-link thq-body-small">
                    about
                  </span>
                </Fragment>
              )}
            </a>
            <a href={null} target="_blank" rel="noreferrer noopener">
              {props.link3 ?? (
                <Fragment>
                  <span className="navbar8-text22 thq-link thq-body-small">
                    contact
                  </span>
                </Fragment>
              )}
            </a>
            <div
              onClick={() => setLink5DropdownVisible(!link5DropdownVisible)}
              className="navbar8-link4-dropdown-trigger"
            >
              <span>
                {props.link4 ?? (
                  <Fragment>
                    <span className="navbar8-text14 thq-link thq-body-small">
                      search
                    </span>
                  </Fragment>
                )}
              </span>
              <div className="navbar8-icon-container1">
                {link5DropdownVisible && (
                  <div className="navbar8-container2">
                    <svg viewBox="0 0 1024 1024" className="navbar8-icon10">
                      <path d="M298 426h428l-214 214z"></path>
                    </svg>
                  </div>
                )}
                {!link5DropdownVisible && (
                  <div className="navbar8-container3">
                    <svg viewBox="0 0 1024 1024" className="navbar8-icon12">
                      <path d="M426 726v-428l214 214z"></path>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </nav>
          <div className="navbar8-buttons1">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {user?.profile_image_url ? (
                    // אם יש תמונת פרופיל, הצג אותה
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-purple-500">
                      <img
                        src={user.profile_image_url}
                        alt="Profile"
                        className="w-full h-full object-cover transform scale-125" 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentNode.classList.add('bg-purple-600', 'flex', 'justify-center', 'items-center');
                          e.target.parentNode.innerHTML = `<span class="text-white">${user?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}</span>`;
                        }}
                      />
                    </div>
                  ) : (
                    // אם אין תמונת פרופיל, הצג אות ראשונה בעיגול סגול
                    <div className="text-white bg-purple-600 rounded-full w-8 h-8 flex items-center justify-center">
                      {user?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    className="text-gray-300 hover:text-white flex items-center space-x-1"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <span>{user?.first_name || user?.email?.split('@')[0] || 'User'}</span>
                    <svg viewBox="0 0 1024 1024" className="w-4 h-4">
                      <path d="M298 426h428l-214 214z"></path>
                    </svg>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-sm rounded-md shadow-lg border border-purple-600/20 py-1 z-50">
                      <button
                        onClick={() => {
                          history.push('/dashboard');
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-purple-600/20 hover:text-white"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => {
                          signOut();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-purple-600/20 hover:text-white"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>

                <button
                  className="navbar8-action11 thq-button-filled thq-button-animated"
                  onClick={() => {
                    // Check if we're already on the /auth route
                    if (window.location.pathname === '/auth') {
                      // Just update the URL and reload the page to force re-render
                      window.location.href = '/auth?mode=signup';
                    } else {
                      // Use normal routing if not on the auth page
                      history.push('/auth?mode=signup');
                    }
                  }}
                >
                  <span className="thq-body-small">
                    {props.action1 ?? (
                      <Fragment>
                        <span className="navbar8-text18">Sign Up</span>
                      </Fragment>
                    )}
                  </span>
                </button>


                <button
                  className="navbar8-action21 thq-button-outline thq-button-animated"
                  onClick={() => {
                    // Check if we're already on the /auth route
                    if (window.location.pathname === '/auth') {
                      // Just update the URL and reload the page to force re-render
                      window.location.href = '/auth?mode=login';
                    } else {
                      // Use normal routing if not on the auth page
                      history.push('/auth?mode=login');
                    }
                  }}
                >
                  <span className="thq-body-small">
                    <span className="navbar8-text25">Log In</span>
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
        <div data-thq="thq-burger-menu" className="navbar8-burger-menu">
          <svg viewBox="0 0 1024 1024" className="navbar8-icon14">
            <path d="M128 554.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 298.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 810.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667z"></path>
          </svg>
        </div>
        <div data-thq="thq-mobile-menu" className="navbar8-mobile-menu">
          <div className="navbar8-nav">
            <div className="navbar8-top">
              <img
                alt={props.logoAlt}
                src={props.logoSrc}
                className="navbar8-logo"
              />
              <div data-thq="thq-close-menu" className="navbar8-close-menu">
                <svg viewBox="0 0 1024 1024" className="navbar8-icon16">
                  <path d="M810 274l-238 238 238 238-60 60-238-238-238 238-60-60 238-238-238-238 60-60 238 238 238-238z"></path>
                </svg>
              </div>
            </div>
            <nav className="navbar8-links2">
              <a href={props.link1Url}>
                {props.link1 ?? (
                  <Fragment>
                    <span className="navbar8-text26 thq-link thq-body-small">
                      Home
                    </span>
                  </Fragment>
                )}
              </a>
              <a href={props.link2Url}>
                {props.link2 ?? (
                  <Fragment>
                    <span className="navbar8-text15 thq-link thq-body-small">
                      about
                    </span>
                  </Fragment>
                )}
              </a>
              <a href={props.link3Url}>
                {props.link3 ?? (
                  <Fragment>
                    <span className="navbar8-text22 thq-link thq-body-small">
                      contact
                    </span>
                  </Fragment>
                )}
              </a>
              <div className="navbar8-link4-accordion">
                <div
                  onClick={() => setLink5AccordionOpen(!link5AccordionOpen)}
                  className="navbar8-trigger"
                >
                  <span>
                    {props.link4 ?? (
                      <Fragment>
                        <span className="navbar8-text14 thq-link thq-body-small">
                          search
                        </span>
                      </Fragment>
                    )}
                  </span>
                  <div className="navbar8-icon-container2">
                    {link5AccordionOpen && (
                      <div className="navbar8-container4">
                        <svg viewBox="0 0 1024 1024" className="navbar8-icon18">
                          <path d="M298 426h428l-214 214z"></path>
                        </svg>
                      </div>
                    )}
                    {!link5AccordionOpen && (
                      <div className="navbar8-container5">
                        <svg viewBox="0 0 1024 1024" className="navbar8-icon20">
                          <path d="M426 726v-428l214 214z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                {link5AccordionOpen && (
                  <div className="navbar8-container6">
                    <a href={props.linkUrlPage1}>
                      <div className="navbar8-menu-item1">
                        <img
                          alt={props.page1ImageAlt}
                          src={props.page1ImageSrc}
                          className="navbar8-page1-image1"
                        />
                        <div className="navbar8-content1">
                          <span>
                            {props.page1 ?? (
                              <Fragment>
                                <span className="navbar8-text27 thq-body-large">
                                  Home
                                </span>
                              </Fragment>
                            )}
                          </span>
                          <span>
                            {props.page1Description ?? (
                              <Fragment>
                                <span className="navbar8-text16 thq-body-small">
                                  Explore tattoo artists based on style and
                                  location
                                </span>
                              </Fragment>
                            )}
                          </span>
                        </div>
                      </div>
                    </a>
                    <a href={props.linkUrlPage2}>
                      <div className="navbar8-menu-item2">
                        <img
                          alt={props.page2ImageAlt}
                          src={props.page2ImageSrc}
                          className="navbar8-page2-image1"
                        />
                        <div className="navbar8-content2">
                          <span>
                            {props.page2 ?? (
                              <Fragment>
                                <span className="navbar8-text20 thq-body-large">
                                  About
                                </span>
                              </Fragment>
                            )}
                          </span>
                          <span>
                            {props.page2Description ?? (
                              <Fragment>
                                <span className="navbar8-text17 thq-body-small">
                                  Learn more about our mission and team
                                </span>
                              </Fragment>
                            )}
                          </span>
                        </div>
                      </div>
                    </a>
                    <a href={props.linkUrlPage3}>
                      <div className="navbar8-menu-item3">
                        <img
                          alt={props.page3ImageAlt}
                          src={props.page3ImageSrc}
                          className="navbar8-page3-image1"
                        />
                        <div className="navbar8-content3">
                          <span>
                            {props.page3 ?? (
                              <Fragment>
                                <span className="navbar8-text24 thq-body-large">
                                  Contact
                                </span>
                              </Fragment>
                            )}
                          </span>
                          <span>
                            {props.page3Description ?? (
                              <Fragment>
                                <span className="navbar8-text19 thq-body-small">
                                  Get in touch with us for any inquiries
                                </span>
                              </Fragment>
                            )}
                          </span>
                        </div>
                      </div>
                    </a>
                    <a href={props.linkUrlPage4}>
                      <div className="navbar8-menu-item4">
                        <img
                          alt={props.page4ImageAlt}
                          src={props.page4ImageSrc}
                          className="navbar8-page4-image1"
                        />
                        <div className="navbar8-content4">
                          <span>
                            {props.page4 ?? (
                              <Fragment>
                                <span className="navbar8-text21 thq-body-large">
                                  Search
                                </span>
                              </Fragment>
                            )}
                          </span>
                          <span>
                            {props.page4Description ?? (
                              <Fragment>
                                <span className="navbar8-text23 thq-body-small">
                                  Find tattoo artists by style or location
                                </span>
                              </Fragment>
                            )}
                          </span>
                        </div>
                      </div>
                    </a>
                  </div>
                )}
              </div>
            </nav>
            <div className="navbar8-buttons2">
              <button className="thq-button-filled">
                <span>
                  {props.action1 ?? (
                    <Fragment>
                      <span className="navbar8-text18">Sign Up</span>
                    </Fragment>
                  )}
                </span>
              </button>
              <button className="thq-button-outline">
                <span>
                  {props.action2 ?? (
                    <Fragment>
                      <span className="navbar8-text25">Log In</span>
                    </Fragment>
                  )}
                </span>
              </button>
            </div>
          </div>
          <div className="navbar8-icon-group">
            <svg
              viewBox="0 0 950.8571428571428 1024"
              className="thq-icon-x-small"
            >
              <path d="M925.714 233.143c-25.143 36.571-56.571 69.143-92.571 95.429 0.571 8 0.571 16 0.571 24 0 244-185.714 525.143-525.143 525.143-104.571 0-201.714-30.286-283.429-82.857 14.857 1.714 29.143 2.286 44.571 2.286 86.286 0 165.714-29.143 229.143-78.857-81.143-1.714-149.143-54.857-172.571-128 11.429 1.714 22.857 2.857 34.857 2.857 16.571 0 33.143-2.286 48.571-6.286-84.571-17.143-148-91.429-148-181.143v-2.286c24.571 13.714 53.143 22.286 83.429 23.429-49.714-33.143-82.286-89.714-82.286-153.714 0-34.286 9.143-65.714 25.143-93.143 90.857 112 227.429 185.143 380.571 193.143-2.857-13.714-4.571-28-4.571-42.286 0-101.714 82.286-184.571 184.571-184.571 53.143 0 101.143 22.286 134.857 58.286 41.714-8 81.714-23.429 117.143-44.571-13.714 42.857-42.857 78.857-81.143 101.714 37.143-4 73.143-14.286 106.286-28.571z"></path>
            </svg>
            <svg
              viewBox="0 0 877.7142857142857 1024"
              className="thq-icon-x-small"
            >
              <path d="M585.143 512c0-80.571-65.714-146.286-146.286-146.286s-146.286 65.714-146.286 146.286 65.714 146.286 146.286 146.286 146.286-65.714 146.286-146.286zM664 512c0 124.571-100.571 225.143-225.143 225.143s-225.143-100.571-225.143-225.143 100.571-225.143 225.143-225.143 225.143 100.571 225.143 225.143zM725.714 277.714c0 29.143-23.429 52.571-52.571 52.571s-52.571-23.429-52.571-52.571 23.429-52.571 52.571-52.571 52.571 23.429 52.571 52.571zM438.857 152c-64 0-201.143-5.143-258.857 17.714-20 8-34.857 17.714-50.286 33.143s-25.143 30.286-33.143 50.286c-22.857 57.714-17.714 194.857-17.714 258.857s-5.143 201.143 17.714 258.857c8 20 17.714 34.857 33.143 50.286s30.286 25.143 50.286 33.143c57.714 22.857 194.857 17.714 258.857 17.714s201.143 5.143 258.857-17.714c20-8 34.857-17.714 50.286-33.143s25.143-30.286 33.143-50.286c22.857-57.714 17.714-194.857 17.714-258.857s5.143-201.143-17.714-258.857c-8-20-17.714-34.857-33.143-50.286s-30.286-25.143-50.286-33.143c-57.714-22.857-194.857-17.714-258.857-17.714zM877.714 512c0 60.571 0.571 120.571-2.857 181.143-3.429 70.286-19.429 132.571-70.857 184s-113.714 67.429-184 70.857c-60.571 3.429-120.571 2.857-181.143 2.857s-120.571 0.571-181.143-2.857c-70.286-3.429-132.571-19.429-184-70.857s-67.429-113.714-70.857-184c-3.429-60.571-2.857-120.571-2.857-181.143s-0.571-120.571 2.857-181.143c3.429-70.286 19.429-132.571 70.857-184s113.714-67.429 184-70.857c60.571-3.429 120.571-2.857 181.143-2.857s120.571-0.571 181.143 2.857c70.286 3.429 132.571 19.429 184 70.857s67.429 113.714 70.857 184c3.429 60.571 2.857 120.571 2.857 181.143z"></path>
            </svg>
            <svg
              viewBox="0 0 602.2582857142856 1024"
              className="thq-icon-small"
            >
              <path d="M548 6.857v150.857h-89.714c-70.286 0-83.429 33.714-83.429 82.286v108h167.429l-22.286 169.143h-145.143v433.714h-174.857v-433.714h-145.714v-169.143h145.714v-124.571c0-144.571 88.571-223.429 217.714-223.429 61.714 0 114.857 4.571 130.286 6.857z"></path>
            </svg>
          </div>
        </div>
        {link5DropdownVisible && (
          <div className="navbar8-container7 thq-box-shadow">
            <div className="navbar8-link5-menu-list">
              <a href={props.linkUrlPage1}>
                <div className="navbar8-menu-item5">
                  <img
                    alt={props.page1ImageAlt}
                    src={props.page1ImageSrc}
                    className="navbar8-page1-image2 thq-img-ratio-1-1"
                  />
                  <div className="navbar8-content5">
                    <span>
                      {props.page1 ?? (
                        <Fragment>
                          <span className="navbar8-text27 thq-body-large">
                            Home
                          </span>
                        </Fragment>
                      )}
                    </span>
                    <span>
                      {props.page1Description ?? (
                        <Fragment>
                          <span className="navbar8-text16 thq-body-small">
                            Explore tattoo artists based on style and location
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                </div>
              </a>
              <a href={props.linkUrlPage2}>
                <div className="navbar8-menu-item6">
                  <img
                    alt={props.page2ImageAlt}
                    src={props.page2ImageSrc}
                    className="navbar8-page2-image2 thq-img-ratio-1-1"
                  />
                  <div className="navbar8-content6">
                    <span>
                      {props.page2 ?? (
                        <Fragment>
                          <span className="navbar8-text20 thq-body-large">
                            About
                          </span>
                        </Fragment>
                      )}
                    </span>
                    <span>
                      {props.page2Description ?? (
                        <Fragment>
                          <span className="navbar8-text17 thq-body-small">
                            Learn more about our mission and team
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                </div>
              </a>
              <a href={props.linkUrlPage3}>
                <div className="navbar8-menu-item7">
                  <img
                    alt={props.page3ImageAlt}
                    src={props.page3ImageSrc}
                    className="navbar8-page3-image2 thq-img-ratio-1-1"
                  />
                  <div className="navbar8-content7">
                    <span>
                      {props.page3 ?? (
                        <Fragment>
                          <span className="navbar8-text24 thq-body-large">
                            Contact
                          </span>
                        </Fragment>
                      )}
                    </span>
                    <span>
                      {props.page3Description ?? (
                        <Fragment>
                          <span className="navbar8-text19 thq-body-small">
                            Get in touch with us for any inquiries
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                </div>
              </a>
              <a href={props.linkUrlPage4}>
                <div className="navbar8-menu-item8">
                  <img
                    alt={props.page4ImageAlt}
                    src={props.page4ImageSrc}
                    className="navbar8-page4-image2 thq-img-ratio-1-1"
                  />
                  <div className="navbar8-content8">
                    <span>
                      {props.page4 ?? (
                        <Fragment>
                          <span className="navbar8-text21 thq-body-large">
                            Search
                          </span>
                        </Fragment>
                      )}
                    </span>
                    <span>
                      {props.page4Description ?? (
                        <Fragment>
                          <span className="navbar8-text23 thq-body-small">
                            Find tattoo artists by style or location
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        )}
      </header>
      {link5DropdownVisible && (
        <div
          onClick={() => setLink5DropdownVisible(false)}
          className="navbar8-container8"
        ></div>
      )}
    </header>
  )
}

Navbar8.defaultProps = {
  link4: undefined,
  link2: undefined,
  page1Description: undefined,
  page2Description: undefined,
  action1: undefined,
  link3Url: 'https://www.teleporthq.io',
  page4ImageAlt: 'Search Icon',
  link1Url: 'https://www.teleporthq.io',
  page3Description: undefined,
  page2ImageAlt: 'About Icon',
  page2: undefined,
  logoSrc:
    'https://i.imghippo.com/files/6xaHf1724968614.png',
  page3ImageSrc:
    'https://images.unsplash.com/photo-1529589585661-8fb5cdc75c48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNDg4MzM5OHw&ixlib=rb-4.0.3&q=80&w=1080',
  page1ImageSrc:
    'https://images.unsplash.com/photo-1587377838865-38ab492fdad3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNDg4MzM5N3w&ixlib=rb-4.0.3&q=80&w=1080',
  page4: undefined,
  link3: undefined,
  page3ImageAlt: 'Contact Icon',
  page2ImageSrc:
    'https://images.unsplash.com/photo-1561883088-039e53143d73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNDg4MzM5N3w&ixlib=rb-4.0.3&q=80&w=1080',
  page4ImageSrc:
    'https://images.unsplash.com/photo-1603714196939-6f6436c8d0c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNDg4MzM5N3w&ixlib=rb-4.0.3&q=80&w=1080',
  linkUrlPage1: 'https://www.teleporthq.io',
  page4Description: undefined,
  link2Url: 'https://www.teleporthq.io',
  page1ImageAlt: 'Home Icon',
  page3: undefined,
  linkUrlPage4: 'https://www.teleporthq.io',
  action2: undefined,
  logoAlt: 'Tattoo Artist Finder Logo',
  link1: undefined,
  linkUrlPage3: 'https://www.teleporthq.io',
  linkUrlPage2: 'https://www.teleporthq.io',
  page1: undefined,
}

Navbar8.propTypes = {
  link4: PropTypes.element,
  link2: PropTypes.element,
  page1Description: PropTypes.element,
  page2Description: PropTypes.element,
  action1: PropTypes.element,
  link3Url: PropTypes.string,
  page4ImageAlt: PropTypes.string,
  link1Url: PropTypes.string,
  page3Description: PropTypes.element,
  page2ImageAlt: PropTypes.string,
  page2: PropTypes.element,
  logoSrc: PropTypes.string,
  page3ImageSrc: PropTypes.string,
  page1ImageSrc: PropTypes.string,
  page4: PropTypes.element,
  link3: PropTypes.element,
  page3ImageAlt: PropTypes.string,
  page2ImageSrc: PropTypes.string,
  page4ImageSrc: PropTypes.string,
  linkUrlPage1: PropTypes.string,
  page4Description: PropTypes.element,
  link2Url: PropTypes.string,
  page1ImageAlt: PropTypes.string,
  page3: PropTypes.element,
  linkUrlPage4: PropTypes.string,
  action2: PropTypes.element,
  logoAlt: PropTypes.string,
  link1: PropTypes.element,
  linkUrlPage3: PropTypes.string,
  linkUrlPage2: PropTypes.string,
  page1: PropTypes.element,
}

export default Navbar8
