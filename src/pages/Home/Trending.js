import React from 'react'
import Section from '../../components/Page/Section'

import Overline from '../../components/Typography/Overline'
import HeadingTwo from '../../components/Typography/HeadingTwo'

import ButtonAlt from '../../components/Form/ButtonAlt'

import Card from '../../components/Product/Card'

const Trending = () =>
<Section Name={`trending`} BackgroundColor={`#f3f3f3`}>
  <div className='container' style={{ maxWidth: '1350px', flex: '1 1' }}>
    <div className="row pb-5">
      <div className='col-12 col-md-4 offset-md-4 offset-sm-0 d-flex flex-column align-items-center'>
        <Overline className='text-muted'>
          Products
        </Overline>
        <HeadingTwo className='font-weight-light'>
          Trending
        </HeadingTwo>
      </div>
      <div className='col-12 col-md-4 d-flex align-items-center justify-content-center justify-content-md-end'>
        <ButtonAlt url={`/collection`} className={``}>
          More <i className={`material-icons`}>keyboard_arrow_right</i>
        </ButtonAlt>
      </div>
    </div>
    <div className={`row`}>
      <div className='col-12 col-md-3 px-0 px-md-5 d-flex flex-column align-items-center'>
        <Card url={`/product`} className={`my-5`} ratings={`visible`}/>
      </div>
      <div className='col-12 col-md-3 px-0 px-md-5 d-flex flex-column align-items-center'>
        <Card ratings={`visible`}/>
      </div>
      <div className='col-12 col-md-3 px-0 px-md-5 d-flex flex-column align-items-start'>
        <Card ratings={`visible`} className={`my-5`} />
      </div>
      <div className='col-12 col-md-3 px-0 px-md-5 d-flex flex-column align-items-center'>
        <Card ratings={`visible`}/>
      </div>
    </div>
  </div>
</Section>

export default Trending
