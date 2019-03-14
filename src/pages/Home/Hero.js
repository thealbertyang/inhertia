import React from 'react'
import Section from '../../components/Page/Section'

import Overline from '../../components/Typography/Overline'
import HeadingTwo from '../../components/Typography/HeadingTwo'

const Hero = () =>
<Section className={`d-flex align-items-end`} Name={`hero`} BackgroundColor={`#f3f3f3`} BackgroundImage={`/img/shop/hero.jpg`} BackgroundSize={`cover`} Height={`50rem`}>
    <div className="row flex-fill d-flex align-items-end">
      <div className='col-md-5 col-sm-12 d-flex flex-column align-items-start justify-content-center'>
        <h1 className='text-white'>
          Let Fashion
        </h1>
        <h2 className='font-weight-light text-white'>Discover <b>Places</b>.</h2>
        <p className='mb-5 text-white-50'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim </p>
        <a href='/products/new' className='btn btn-primary btn-lg'>
          Shop for latest styles
        </a>
      </div>
    </div>
</Section>

export default Hero
