import React from 'react'
import Section from '../../components/Page/Section'

import Overline from '../../components/Typography/Overline'
import HeadingTwo from '../../components/Typography/HeadingTwo'

const FreeShipping = () =>
<Section Name={`lookbook`} BackgroundColor={`#232323`}>
    <div className="container" style={{ padding: '6rem 5rem' }}>
      <div className="row">
        <div className='col-4 mb-4'>
          <div className='row d-flex flex-column pb-4' style={{ flex: '1 1', height: '100%' }}>
            <div className='col-12 d-flex flex-column justify-content-start align-items-start' style={{ flex: '1 1' }}>
              <HeadingTwo className='mb-4 text-white'>Free shipping</HeadingTwo>
              <p className='body-one text-white-50'>When you spend $50 or more. Love yourself. Don't feel guilty. Get what you want.</p>
              <p className='body-two text-muted'>† On every purchase you spend over 50$ we will donate a percentage to a meaningful cause.</p>
            </div>

          </div>
        </div>
        <div className='col-8'>
          <ul className='row' style={{ listStyle: 'none', padding: '0' }}>
            <li className='col-4'>
              <a href='/products/new'>
                <div className='card border-0'>
                  <div className='card-body p-0 d-flex flex-column align-items-center justify-content-center'>
                    <img src='/img/shop/cat/new.jpg' style={{ width: '100%', height: 'auto' }}/>
                    <span className='p-2'>New!</span>
                  </div>
                </div>
              </a>
            </li>
            <li className='col-4'>
              <a href='/products/dresses'>
                <div className='card border-0'>
                  <div className='card-body p-0 d-flex flex-column align-items-center justify-content-center'>
                    <img src='/img/shop/cat/dresses.jpg' style={{ width: '100%', height: 'auto' }}/>
                    <span className='p-2'>Dresses</span>
                  </div>
                </div>
              </a>
            </li>
            <li className='col-4'>
              <a href='/products/clothing'>
                <div className='card border-0'>
                  <div className='card-body p-0 d-flex flex-column align-items-center justify-content-center'>
                    <img src='/img/shop/cat/clothing.jpg' style={{ width: '100%', height: 'auto' }}/>
                    <span className='p-2'>Clothing</span>
                  </div>
                </div>
              </a>
            </li>
          </ul>

          <ul className='row' style={{ listStyle: 'none', padding: '0' }}>
            <li className='col-4'>
              <a href='/products/shoes'>
                <div className='card border-0'>
                  <div className='card-body p-0 d-flex flex-column align-items-center justify-content-center'>
                    <img src='/img/shop/cat/shoes.jpg' style={{ width: '100%', height: 'auto' }}/>
                    <span className='p-2'>Shoes</span>
                  </div>
                </div>
              </a>
            </li>
            <li className='col-4'>
              <a href='/products/accessories'>
                <div className='card border-0'>
                  <div className='card-body p-0 d-flex flex-column align-items-center justify-content-center'>
                    <img src='/img/shop/cat/accessories.jpg' style={{ width: '100%', height: 'auto' }}/>
                    <span className='p-2'>Accessories</span>
                  </div>
                </div>
              </a>
            </li>
            <li className='col-4'>
              <a href='/products/sale'>
                <div className='card border-0'>
                  <div className='card-body p-0 d-flex flex-column align-items-center justify-content-center'>
                    <img src='/img/shop/cat/sale.jpg' style={{ width: '100%', height: 'auto' }}/>
                    <span className='p-2'>Sale</span>
                  </div>
                </div>
              </a>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </Section>

export default FreeShipping
