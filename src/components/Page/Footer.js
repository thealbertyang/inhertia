import React from 'react'
import { connect } from 'react-redux'
import Link, { NavLink } from 'redux-first-router-link'

import Overline from '../Typography/Overline'

const Footer = () =>
    <div className="footer container-fluid p-5">
      <div className={`row`}>
        <div className={`col-3 offset-2`}>
          <img src='/img/shop/logo-footer.png' style={{ height: '5rem', width: 'auto' }}/>
        </div>
        <div className="col-2">
          <h6>Customer Service</h6>
          <ul className="nav flex-column px-0 py-2">
            <li className="nav-item">
              <a className="nav-link active p-0" href="/support/sizeGuide">Size Guide</a>
            </li>
            <li className="nav-item">
              <a className="nav-link active p-0" href="/support/deliveryAndShipping">Delivery & Shipping</a>
            </li>
            <li className="nav-item">
              <a className="nav-link active p-0" href="/support/returns">Returns</a>
            </li>
            <li className="nav-item">
              <a className="nav-link active p-0" href="/support/privacyPolicy">Privacy Policy</a>
            </li>
            <li className="nav-item">
              <a className="nav-link active p-0" href="/support/contact">Contact Us</a>
            </li>
          </ul>
        </div>
        <div className="col-2 offset-1">
          <h6>Company</h6>
          <ul className="nav flex-column px-0 py-2">
            <li className="nav-item">
              <a className="nav-link active p-0" href="/about">About Us</a>
            </li>
            <li className="nav-item">
              <a className="nav-link active p-0" href="/lookbook/2018">2018 Lookbook</a>
            </li>
            <li className="nav-item">
              <a className="nav-link active p-0" href="/guest">Guest Orders</a>
            </li>
            <li className="nav-item">
              <a className="nav-link active p-0" href="/account">Account</a>
            </li>

             <li className='d-flex flex-row justify-content-center'><input type='text' className='form-control bg-transparent' placeholder='Enter email to receive goodies!' style={{ marginTop: '0.5rem', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: '1px solid #dedede !important' }} /><a href='#' className='pt-3'>💌</a></li>
          </ul>
        </div>
        <div className='col-12'>
          <hr/>
        </div>
        <div className="col-4 d-flex align-items-center text-secondary">
          2018 Albert Yang -- All Rights Reserved
        </div>
        <div className="col-4 d-flex flex-column align-items-center text-secondary">
        </div>
      </div>
    </div>

export default Footer
