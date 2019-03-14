import React from 'react'
import Section from '../../components/Page/Section'

import Overline from '../../components/Typography/Overline'
import HeadingTwo from '../../components/Typography/HeadingTwo'

const SignUp = () =>
<div className="container-fluid" style={{ background: 'url(/img/shop/bg-signup.png) center center / cover no-repeat' }}>
  <div className="container-fluid pt-5" style={{ maxWidth: '1350px' }}>
    <div className="row">
      <div className='col-12'>
          <div className='row'>
            <div className='col-6'>
              <div className='card bg-transparent border-0 rounded-0 '>
                <div className="card-img-top rounded-0" style={{background: 'url(/img/shop/ladydress.png) center center / cover no-repeat', height: '50rem' }}>
                </div>
              </div>
            </div>
            <div className='col-6'>
              <div className='row d-flex flex-column pb-4' style={{ flex: '1 1', height: '100%' }}>
                <div className='col-12 d-flex justify-content-center align-items-center flex-column' style={{ flex: '1 1' }}>
                  <h1 style={{ fontFamily: '"Cedarville Cursive", cursive', fontSize: '10rem', marginBottom: '4rem' }} className='mb-5'><b>25% off</b></h1>
                  <h2 className={`text-dark mb-5 font-weight-light`}>your first order!</h2>
                  <a href='/register' className='btn btn-outline-primary btn-lg'>Create an account to activate your offer</a>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</div>

export default SignUp
