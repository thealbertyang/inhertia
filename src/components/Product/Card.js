import React from 'react'
import * as _ from 'lodash'

import Section from '../Page/Section'

import Overline from '../Typography/Overline'
import HeadingTwo from '../Typography/HeadingTwo'

import Ratings from './Ratings'

const Card = ({ url, ratings, title, images, price, className}) =>
  <div className={`card bg-transparent border-0 ${className}`}>
    <a href={getUrl(url)}
    >
      <img src={getImage(images)} className="rounded img-fluid" alt="..." />
    </a>
    <div className="card-body p-0 mt-3">
      <h6 className="card-title mb-1">{title ? title : 'Blue Lacy Dress'}</h6>
      {getRatings(ratings) ? <Ratings size={`small`}/> : null}
      <p className="card-subtitle text-muted mb-3">${price}</p>
      <div className='mt-2'>
        <a href="#" className="card-link" onClick={()=>alert(  getRatings(ratings) )}>
          <i className='material-icons'>add_shopping_cart</i>
        </a>
        <a href="#" className="card-link">
          <i className='material-icons'>favorite</i>
        </a>
      </div>
    </div>
  </div>

const getImage = images =>
  typeof typeof image !== 'undefined' && !_.isEmpty(images)
  ? images[0]
  : '/img/admin/uploads/41025693_025_b5.jpg'

const getUrl = url =>
  typeof url !== undefined && url
  ? url
  : '#'

const getRatings = ratings =>
  (typeof ratings === undefined || ratings === 'hidden')
  ? false
  : (ratings == 'visible'
    ? true
    : false)


export default Card
