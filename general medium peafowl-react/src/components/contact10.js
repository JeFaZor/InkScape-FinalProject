import React, { Fragment } from 'react'

import PropTypes from 'prop-types'

import './contact10.css'

const Contact10 = (props) => {
  return (
    <div className="contact10-container1 thq-section-padding">
      <div className="contact10-max-width thq-section-max-width">
        <div className="contact10-content1 thq-flex-row">
          <div className="contact10-content2">
            <h2>
              {props.heading1 ?? (
                <Fragment>
                  <h2 className="contact10-text16 thq-heading-2">Contact Us</h2>
                </Fragment>
              )}
            </h2>
            <p>
              {props.content1 ?? (
                <Fragment>
                  <p className="contact10-text17 thq-body-large">
                    Have a question or want to get in touch with us? Feel free
                    to reach out using the contact information below.
                  </p>
                </Fragment>
              )}
            </p>
          </div>
        </div>
        <div className="contact10-content3 thq-flex-row">
          <div className="contact10-container2">
            <img
              alt={props.location1ImageAlt}
              src={props.location1ImageSrc}
              className="contact10-image1 thq-img-ratio-16-9"
            />
            <h3>
              {props.location1 ?? (
                <Fragment>
                  <h3 className="contact10-text18 thq-heading-3">
                    New York City, NY
                  </h3>
                </Fragment>
              )}
            </h3>
            <p>
              {props.location1Description ?? (
                <Fragment>
                  <p className="contact10-text20 thq-body-large">
                    Our main office is located in the heart of New York City.
                    Stop by for a consultation or just to say hello!
                  </p>
                </Fragment>
              )}
            </p>
            <div className="contact10-container3">
              <a
                href="https://example.com"
                target="_blank"
                rel="noreferrer noopener"
                className="thq-body-small thq-button-flat"
              >
                Get directions
              </a>
            </div>
          </div>
          <div className="contact10-container4">
            <img
              alt={props.location2ImageAlt}
              src={props.location2ImageSrc}
              className="contact10-image2 thq-img-ratio-16-9"
            />
            <h3>
              {props.location2 ?? (
                <Fragment>
                  <h3 className="contact10-text19 thq-heading-3">
                    Los Angeles, CA
                  </h3>
                </Fragment>
              )}
            </h3>
            <p>
              {props.location2Description ?? (
                <Fragment>
                  <p className="contact10-text21 thq-body-large">
                    Visit our Los Angeles location for a different vibe and meet
                    our talented artists.
                  </p>
                </Fragment>
              )}
            </p>
            <div className="contact10-container5">
              <a
                href="https://example.com"
                target="_blank"
                rel="noreferrer noopener"
                className="thq-body-small thq-button-flat"
              >
                Get directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Contact10.defaultProps = {
  heading1: undefined,
  location1ImageSrc:
    'https://images.unsplash.com/photo-1613238906889-26b3eb9cf9a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNDg4MzM5OHw&ixlib=rb-4.0.3&q=80&w=1080',
  content1: undefined,
  location1: undefined,
  location2: undefined,
  location1Description: undefined,
  location2ImageSrc:
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNDg4MzM5N3w&ixlib=rb-4.0.3&q=80&w=1080',
  location1ImageAlt: 'New York City Office Image',
  location2ImageAlt: 'Los Angeles Office Image',
  location2Description: undefined,
}

Contact10.propTypes = {
  heading1: PropTypes.element,
  location1ImageSrc: PropTypes.string,
  content1: PropTypes.element,
  location1: PropTypes.element,
  location2: PropTypes.element,
  location1Description: PropTypes.element,
  location2ImageSrc: PropTypes.string,
  location1ImageAlt: PropTypes.string,
  location2ImageAlt: PropTypes.string,
  location2Description: PropTypes.element,
}

export default Contact10
