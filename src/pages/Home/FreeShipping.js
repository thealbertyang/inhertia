import React from 'react'
import Section from '../../components/Page/Section'

import Overline from '../../components/Typography/Overline'
import HeadingTwo from '../../components/Typography/HeadingTwo'

const FreeShipping = () =>
<Section Name={`lookbook`} BackgroundColor={`#232323`}>
    <div className="container" style={{ padding: '6rem 5rem' }}>
      <div className="row">
        <div className='col-12 col-md-4 mb-4'>
          <div className='row d-flex flex-column pb-4' style={{ flex: '1 1', height: '100%' }}>
            <div className='col-12 d-flex flex-column justify-content-start align-items-start' style={{ flex: '1 1' }}>
              <HeadingTwo className='mb-4 text-white'>Fast shipping</HeadingTwo>
              <p className='body-one text-white-50'>Express shipping 5-7 days. Love yourself. Don't feel guilty. Get what you want.</p>
              <p className='body-two text-muted'>† On every purchase you spend over 50$ we will donate a percentage to a meaningful cause.</p>
            </div>

          </div>
        </div>
        <div className='col-12 col-md-8'>
          <ul className='row' style={{ listStyle: 'none', padding: '0' }}>
            <li className='col-4 col-md-4'>
                <div className='card border-0'>
                  <div className='card-body p-0 d-flex flex-column align-items-center justify-content-center'>
                    <img src='/img/shop/cat/new.jpg' style={{ width: '100%', height: 'auto' }}/>
                  </div>
                </div>
            </li>
            <li className='col-4'>
                <div className='card border-0'>
                  <div className='card-body p-0 d-flex flex-column align-items-center justify-content-center'>
                    <img src='/img/shop/cat/dresses.jpg' style={{ width: '100%', height: 'auto' }}/>
                  </div>
                </div>
            </li>
            <li className='col-4'>
                <div className='card border-0'>
                  <div className='card-body p-0 d-flex flex-column align-items-center justify-content-center'>
                    <img src='/img/shop/cat/clothing.jpg' style={{ width: '100%', height: 'auto' }}/>
                  </div>
                </div>
            </li>
          </ul>

          <ul className='row' style={{ listStyle: 'none', padding: '0' }}>
            <li className='col-4'>
                <div className='card border-0'>
                  <div className='card-body p-0 d-flex flex-column align-items-center justify-content-center'>
                    <img src='/img/shop/cat/shoes.jpg' style={{ width: '100%', height: 'auto' }}/>
                  </div>
                </div>
            </li>
            <li className='col-4'>
                <div className='card border-0'>
                  <div className='card-body p-0 d-flex flex-column align-items-center justify-content-center'>
                    <img src='/img/shop/cat/accessories.jpg' style={{ width: '100%', height: 'auto' }}/>
                  </div>
                </div>
            </li>
            <li className='col-4'>
                <div className='card border-0'>
                  <div className='card-body p-0 d-flex flex-column align-items-center justify-content-center'>
                    <img src='/img/shop/cat/sale.jpg' style={{ width: '100%', height: 'auto' }}/>
                  </div>
                </div>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </Section>

export default FreeShipping
