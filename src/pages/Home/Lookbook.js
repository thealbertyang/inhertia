import React from 'react'
import Section from '../../components/Page/Section'

const Lookbook = () =>
<Section className={`flex-fill px-5`} Name={`lookbook`}>
    <div className="row">
        <div className='col-6'>
          <div className='card border-0 rounded-0'>
            <div className="card-img-top rounded-0" style={{background: 'url(/img/shop/tall1.jpg) center center / cover no-repeat', height: '50rem' }}>
            </div>
          </div>
        </div>
        <div className='col-6'>
          <div className='row d-flex flex-column pb-4' style={{ flex: '1 1', height: '50%' }}>
            <div className='col-12 d-flex flex-column' style={{ flex: '1 1' }}>
              <div className='card border-0 rounded-0 d-flex flex-column' style={{ flex: '1 1' }}>
                <div className="card-img-top rounded-0 d-flex flex-column" style={{background: 'url(/img/shop/sideflat1.jpg) center center / cover no-repeat', flex: '1 1' }}></div>
              </div>
            </div>
          </div>
          <div className='row d-flex flex-column' style={{ flex: '1 1', height: '50%' }}>
            <div className='col-12 d-flex flex-column' style={{ flex: '1 1' }}>
              <div className='card border-0 rounded-0 d-flex flex-column' style={{ flex: '1 1' }}>
                <div className="card-img-top rounded-0 d-flex flex-column" style={{background: 'url(/img/shop/sideflat2.jpg) center center / cover no-repeat', flex: '1 1' }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-12 pt-4'>
          <div className='card border-0 rounded-0'>
            <div className="card-img-top rounded-0" style={{background: 'url(/img/shop/flat1.jpg) center center / cover no-repeat', height: '25rem' }}>
            </div>
          </div>
        </div>
    </div>
</Section>

export default Lookbook
