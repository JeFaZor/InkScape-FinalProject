import React, { useState, Fragment } from 'react'

import PropTypes from 'prop-types'

import './pricing14.css'

const Pricing14 = (props) => {
  const [isMonthly, setIsMonthly] = useState(true)
  return (
    <div
      className={`pricing14-pricing23 thq-section-padding ${props.rootClassName} `}
    >
      <div className="pricing14-max-width thq-section-max-width">
        <div className="pricing14-section-title">
          <span>
            {props.content1 ?? (
              <Fragment>
                <span className="pricing14-text184 thq-body-small">
                  Choose the perfect plan for you
                </span>
              </Fragment>
            )}
          </span>
          <div className="pricing14-content">
            <h2>
              {props.heading1 ?? (
                <Fragment>
                  <h2 className="pricing14-text169 thq-heading-2">
                    Pricing plan
                  </h2>
                </Fragment>
              )}
            </h2>
            <p>
              {props.content2 ?? (
                <Fragment>
                  <p className="pricing14-text199 thq-body-large">
                    <span>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      <span
                        dangerouslySetInnerHTML={{
                          __html: ' ',
                        }}
                      />
                    </span>
                    <span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: ' ',
                        }}
                      />
                    </span>
                  </p>
                </Fragment>
              )}
            </p>
          </div>
        </div>
        <div className="pricing14-tabs">
          {isMonthly && (
            <button
              onClick={() => setIsMonthly(true)}
              className="pricing14-button10 thq-button-filled thq-button-animated"
            >
              <span className="thq-body-small">Monthly</span>
            </button>
          )}
          {!isMonthly && (
            <button
              onClick={() => setIsMonthly(true)}
              className="pricing14-button11 thq-button-outline thq-button-animated"
            >
              <span className="thq-body-small">Monthly</span>
            </button>
          )}
          {!isMonthly && (
            <button
              onClick={() => setIsMonthly(false)}
              className="pricing14-button12 thq-button-filled thq-button-animated"
            >
              <span className="thq-body-small">Yearly</span>
            </button>
          )}
          {isMonthly && (
            <button
              onClick={() => setIsMonthly(false)}
              className="pricing14-button13 thq-button-outline thq-button-animated"
            >
              <span className="thq-body-small">Yearly</span>
            </button>
          )}
        </div>
        {isMonthly && (
          <div className="pricing14-container1">
            <div className="pricing14-column1 thq-card">
              <div className="pricing14-price10">
                <div className="pricing14-price11">
                  <p>
                    {props.plan1 ?? (
                      <Fragment>
                        <p className="pricing14-text174 thq-body-large">
                          Basic plan
                        </p>
                      </Fragment>
                    )}
                  </p>
                  <h3>
                    {props.plan1Price ?? (
                      <Fragment>
                        <h3 className="pricing14-text198 thq-heading-3">$50</h3>
                      </Fragment>
                    )}
                  </h3>
                  <p>
                    {props.plan1Yearly ?? (
                      <Fragment>
                        <p className="pricing14-text188 thq-body-large">$500</p>
                      </Fragment>
                    )}
                  </p>
                </div>
                <div className="pricing14-list1">
                  <div className="pricing14-list-item10">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span>
                      {props.plan1Feature1 ?? (
                        <Fragment>
                          <span className="pricing14-text157 thq-body-small">
                            Access to 100 tattoo artists
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing14-list-item11">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span>
                      {props.plan1Feature2 ?? (
                        <Fragment>
                          <span className="pricing14-text180 thq-body-small">
                            Search by tattoo style and location
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing14-list-item12">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span>
                      {props.plan1Feature3 ?? (
                        <Fragment>
                          <span className="pricing14-text156 thq-body-small">
                            View artist portfolios
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <button className="pricing14-button14 thq-button-outline thq-button-animated">
                <span>
                  {props.plan1Action ?? (
                    <Fragment>
                      <span className="pricing14-text178 thq-body-small">
                        Book Now
                      </span>
                    </Fragment>
                  )}
                </span>
              </button>
            </div>
            <div className="pricing14-column2 thq-card">
              <div className="pricing14-price12">
                <div className="pricing14-price13">
                  <p>
                    {props.plan2 ?? (
                      <Fragment>
                        <p className="pricing14-text158 thq-body-large">
                          Business plan
                        </p>
                      </Fragment>
                    )}
                  </p>
                  <h3>
                    {props.plan2Price ?? (
                      <Fragment>
                        <h3 className="pricing14-text176 thq-heading-3">
                          $100
                        </h3>
                      </Fragment>
                    )}
                  </h3>
                  <p>
                    {props.plan2Yearly ?? (
                      <Fragment>
                        <p className="pricing14-text193 thq-body-large">
                          $1000
                        </p>
                      </Fragment>
                    )}
                  </p>
                </div>
                <div className="pricing14-list2">
                  <div className="pricing14-list-item13">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span>
                      {props.plan2Feature1 ?? (
                        <Fragment>
                          <span className="pricing14-text166 thq-body-small">
                            Access to 250 tattoo artists
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing14-list-item14">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span>
                      {props.plan2Feature2 ?? (
                        <Fragment>
                          <span className="pricing14-text185 thq-body-small">
                            Priority listing in search results
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing14-list-item15">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span>
                      {props.plan2Feature3 ?? (
                        <Fragment>
                          <span className="pricing14-text194 thq-body-small">
                            Direct messaging with artists
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing14-list-item16">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span>
                      {props.plan2Feature4 ?? (
                        <Fragment>
                          <span className="pricing14-text205 thq-body-small">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <button className="pricing14-button15 thq-button-filled thq-button-animated">
                <span>
                  {props.plan2Action ?? (
                    <Fragment>
                      <span className="pricing14-text175 thq-body-small">
                        Book Now
                      </span>
                    </Fragment>
                  )}
                </span>
              </button>
            </div>
            <div className="pricing14-column3 thq-card">
              <div className="pricing14-price14">
                <div className="pricing14-price15">
                  <p>
                    {props.plan3 ?? (
                      <Fragment>
                        <p className="pricing14-text202 thq-body-large">
                          Enterprise plan
                        </p>
                      </Fragment>
                    )}
                  </p>
                  <h3>
                    {props.plan3Price ?? (
                      <Fragment>
                        <h3 className="pricing14-text160 thq-heading-3">
                          $150
                        </h3>
                      </Fragment>
                    )}
                  </h3>
                  <p>
                    {props.plan3Yearly ?? (
                      <Fragment>
                        <p className="pricing14-text203 thq-body-large">
                          $1500
                        </p>
                      </Fragment>
                    )}
                  </p>
                </div>
                <div className="pricing14-list3">
                  <div className="pricing14-list-item17">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span>
                      {props.plan3Feature1 ?? (
                        <Fragment>
                          <span className="pricing14-text196 thq-body-small">
                            Access to all tattoo artists
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing14-list-item18">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span>
                      {props.plan3Feature2 ?? (
                        <Fragment>
                          <span className="pricing14-text177 thq-body-small">
                            Featured artist placement
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing14-list-item19">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span>
                      {props.plan3Feature3 ?? (
                        <Fragment>
                          <span className="pricing14-text159 thq-body-small">
                            Exclusive discounts on tattoos
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing14-list-item20">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span>
                      {props.plan3Feature4 ?? (
                        <Fragment>
                          <span className="pricing14-text187 thq-body-small">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing14-list-item21">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span>
                      {props.plan3Feature5 ?? (
                        <Fragment>
                          <span className="pricing14-text163 thq-body-small">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <button className="pricing14-button16 thq-button-filled thq-button-animated">
                <span>
                  {props.plan3Action ?? (
                    <Fragment>
                      <span className="pricing14-text192 thq-body-small">
                        Book Now
                      </span>
                    </Fragment>
                  )}
                </span>
              </button>
            </div>
          </div>
        )}
        {!isMonthly && (
          <div className="pricing14-container2">
            <div className="pricing14-column4 thq-card">
              <div className="pricing14-price16">
                <div className="pricing14-price17">
                  <span>
                    {props.plan11 ?? (
                      <Fragment>
                        <span className="pricing14-text164 thq-body-large">
                          Basic plan
                        </span>
                      </Fragment>
                    )}
                  </span>
                  <h3>
                    {props.plan1Price1 ?? (
                      <Fragment>
                        <h3 className="pricing14-text165 thq-heading-3">
                          $200/yr
                        </h3>
                      </Fragment>
                    )}
                  </h3>
                  <span>
                    {props.plan1Yearly1 ?? (
                      <Fragment>
                        <span className="pricing14-text190 thq-body-large">
                          or $20 monthly
                        </span>
                      </Fragment>
                    )}
                  </span>
                </div>
                <div className="pricing14-list4">
                  <div className="pricing14-list-item22">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span>
                      {props.plan1Feature11 ?? (
                        <Fragment>
                          <span className="pricing14-text183 thq-body-small">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing14-list-item23">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span>
                      {props.plan1Feature21 ?? (
                        <Fragment>
                          <span className="pricing14-text168 thq-body-small">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing14-list-item24">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span>
                      {props.plan1Feature31 ?? (
                        <Fragment>
                          <span className="pricing14-text155 thq-body-small">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <button className="pricing14-button17 thq-button-outline thq-button-animated">
                <span>
                  {props.plan1Action1 ?? (
                    <Fragment>
                      <span className="pricing14-text162 thq-body-small">
                        Get started
                      </span>
                    </Fragment>
                  )}
                </span>
              </button>
            </div>
            <div className="pricing14-column5 thq-card">
              <div className="pricing14-price18">
                <div className="pricing14-price19">
                  <span>
                    {props.plan21 ?? (
                      <Fragment>
                        <span className="pricing14-text206 thq-body-large">
                          Business plan
                        </span>
                      </Fragment>
                    )}
                  </span>
                  <h3>
                    {props.plan2Price1 ?? (
                      <Fragment>
                        <h3 className="pricing14-text181 thq-heading-3">
                          $299/yr
                        </h3>
                      </Fragment>
                    )}
                  </h3>
                  <span>
                    {props.plan2Yearly1 ?? (
                      <Fragment>
                        <span className="pricing14-text161 thq-body-large">
                          or $29 monthly
                        </span>
                      </Fragment>
                    )}
                  </span>
                </div>
                <div className="pricing14-list5">
                  <div className="pricing14-list-item25">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span>
                      {props.plan2Feature11 ?? (
                        <Fragment>
                          <span className="pricing14-text170 thq-body-small">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing14-list-item26">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span>
                      {props.plan2Feature21 ?? (
                        <Fragment>
                          <span className="pricing14-text207 thq-body-small">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing14-list-item27">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span>
                      {props.plan2Feature31 ?? (
                        <Fragment>
                          <span className="pricing14-text167 thq-body-small">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing14-list-item28">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span>
                      {props.plan2Feature41 ?? (
                        <Fragment>
                          <span className="pricing14-text195 thq-body-small">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <button className="pricing14-button18 thq-button-filled thq-button-animated">
                <span>
                  {props.plan2Action1 ?? (
                    <Fragment>
                      <span className="pricing14-text182 thq-body-small">
                        Get started
                      </span>
                    </Fragment>
                  )}
                </span>
              </button>
            </div>
            <div className="pricing14-column6 thq-card">
              <div className="pricing14-price20">
                <div className="pricing14-price21">
                  <span>
                    {props.plan31 ?? (
                      <Fragment>
                        <span className="pricing14-text171 thq-body-large">
                          Enterprise plan
                        </span>
                      </Fragment>
                    )}
                  </span>
                  <h3>
                    {props.plan3Price1 ?? (
                      <Fragment>
                        <h3 className="pricing14-text197 thq-heading-3">
                          $499/yr
                        </h3>
                      </Fragment>
                    )}
                  </h3>
                  <span>
                    {props.plan3Yearly1 ?? (
                      <Fragment>
                        <span className="pricing14-text186 thq-body-large">
                          or $49 monthly
                        </span>
                      </Fragment>
                    )}
                  </span>
                </div>
                <div className="pricing14-list6">
                  <div className="pricing14-list-item29">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span>
                      {props.plan3Feature11 ?? (
                        <Fragment>
                          <span className="pricing14-text204 thq-body-small">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing14-list-item30">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span>
                      {props.plan3Feature21 ?? (
                        <Fragment>
                          <span className="pricing14-text172 thq-body-small">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing14-list-item31">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span>
                      {props.plan3Feature31 ?? (
                        <Fragment>
                          <span className="pricing14-text173 thq-body-small">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing14-list-item32">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span>
                      {props.plan3Feature41 ?? (
                        <Fragment>
                          <span className="pricing14-text189 thq-body-small">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing14-list-item33">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span>
                      {props.plan3Feature51 ?? (
                        <Fragment>
                          <span className="pricing14-text179 thq-body-small">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <button className="pricing14-button19 thq-button-filled thq-button-animated">
                <span>
                  {props.plan3Action1 ?? (
                    <Fragment>
                      <span className="pricing14-text191 thq-body-small">
                        Get started
                      </span>
                    </Fragment>
                  )}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

Pricing14.defaultProps = {
  plan1Feature31: undefined,
  plan1Feature3: undefined,
  plan1Feature1: undefined,
  plan2: undefined,
  plan3Feature3: undefined,
  plan3Price: undefined,
  plan2Yearly1: undefined,
  plan1Action1: undefined,
  plan3Feature5: undefined,
  plan11: undefined,
  plan1Price1: undefined,
  plan2Feature1: undefined,
  plan2Feature31: undefined,
  plan1Feature21: undefined,
  heading1: undefined,
  plan2Feature11: undefined,
  plan31: undefined,
  plan3Feature21: undefined,
  plan3Feature31: undefined,
  plan1: undefined,
  plan2Action: undefined,
  plan2Price: undefined,
  plan3Feature2: undefined,
  plan1Action: undefined,
  plan3Feature51: undefined,
  plan1Feature2: undefined,
  plan2Price1: undefined,
  plan2Action1: undefined,
  plan1Feature11: undefined,
  content1: undefined,
  plan2Feature2: undefined,
  plan3Yearly1: undefined,
  plan3Feature4: undefined,
  plan1Yearly: undefined,
  plan3Feature41: undefined,
  plan1Yearly1: undefined,
  plan3Action1: undefined,
  plan3Action: undefined,
  plan2Yearly: undefined,
  plan2Feature3: undefined,
  plan2Feature41: undefined,
  plan3Feature1: undefined,
  plan3Price1: undefined,
  plan1Price: undefined,
  content2: undefined,
  plan3: undefined,
  plan3Yearly: undefined,
  plan3Feature11: undefined,
  rootClassName: '',
  plan2Feature4: undefined,
  plan21: undefined,
  plan2Feature21: undefined,
}

Pricing14.propTypes = {
  plan1Feature31: PropTypes.element,
  plan1Feature3: PropTypes.element,
  plan1Feature1: PropTypes.element,
  plan2: PropTypes.element,
  plan3Feature3: PropTypes.element,
  plan3Price: PropTypes.element,
  plan2Yearly1: PropTypes.element,
  plan1Action1: PropTypes.element,
  plan3Feature5: PropTypes.element,
  plan11: PropTypes.element,
  plan1Price1: PropTypes.element,
  plan2Feature1: PropTypes.element,
  plan2Feature31: PropTypes.element,
  plan1Feature21: PropTypes.element,
  heading1: PropTypes.element,
  plan2Feature11: PropTypes.element,
  plan31: PropTypes.element,
  plan3Feature21: PropTypes.element,
  plan3Feature31: PropTypes.element,
  plan1: PropTypes.element,
  plan2Action: PropTypes.element,
  plan2Price: PropTypes.element,
  plan3Feature2: PropTypes.element,
  plan1Action: PropTypes.element,
  plan3Feature51: PropTypes.element,
  plan1Feature2: PropTypes.element,
  plan2Price1: PropTypes.element,
  plan2Action1: PropTypes.element,
  plan1Feature11: PropTypes.element,
  content1: PropTypes.element,
  plan2Feature2: PropTypes.element,
  plan3Yearly1: PropTypes.element,
  plan3Feature4: PropTypes.element,
  plan1Yearly: PropTypes.element,
  plan3Feature41: PropTypes.element,
  plan1Yearly1: PropTypes.element,
  plan3Action1: PropTypes.element,
  plan3Action: PropTypes.element,
  plan2Yearly: PropTypes.element,
  plan2Feature3: PropTypes.element,
  plan2Feature41: PropTypes.element,
  plan3Feature1: PropTypes.element,
  plan3Price1: PropTypes.element,
  plan1Price: PropTypes.element,
  content2: PropTypes.element,
  plan3: PropTypes.element,
  plan3Yearly: PropTypes.element,
  plan3Feature11: PropTypes.element,
  rootClassName: PropTypes.string,
  plan2Feature4: PropTypes.element,
  plan21: PropTypes.element,
  plan2Feature21: PropTypes.element,
}

export default Pricing14
