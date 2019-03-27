import React from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'

import Section from '../Page/Section'

import Overline from '../Typography/Overline'
import HeadingTwo from '../Typography/HeadingTwo'

import Ratings from './Ratings'
import { fetchData, postData, deleteData } from '../../utils'

@connect((store)=>{
    return {
      user: store.user
    }
})
export default class Card extends React.Component {
  constructor(props){
    super(props)
  }

  likeProduct = async (e) => {
    e.preventDefault()
    let user = this.props.user
    let wishlist = await postData(`/api/customer/wishlist/push/${user.customer._id}`, { product_id: this.props.id })
    if(wishlist.response === 200){
      console.log('successfully added to wishlist')
    }
  }

  render() {
   let { id, url, ratings, title, images, price, className, user } = this.props

    return <div className={`card bg-transparent border-0 ${className}`}>
      <a href={getUrl(url)}>
        <img src={getImage(images)} className="rounded img-fluid" alt="..." />
      </a>
      <div className="card-body p-0 mt-3 mb-5">
        <h6 className="card-title mb-1">{title ? title : 'Blue Lacy Dress'}</h6>
        {getRatings(ratings) ? <Ratings size={`small`} ratings={ratings} /> : null}
        <p className="card-subtitle text-muted mb-3">${price}</p>
        <div className='mt-2'>
          <a href={getUrl(url)} className="card-link">
            <i className='material-icons'>add_shopping_cart</i>
          </a>
          <a href="#" className={`card-link ${_.isEmpty(user) && 'disabled' }`} onClick={e=>this.likeProduct(e)}>
            <i className='material-icons'>favorite</i>
          </a>
        </div>
      </div>
    </div>
  }
}

const getImage = images =>
  typeof typeof image !== 'undefined' && !_.isEmpty(images)
  ? images[0]
  : '/img/admin/uploads/41025693_025_b5.jpg'

const getUrl = url =>
  typeof url !== undefined && url
  ? url
  : '#'

const getRatings = ratings =>
  (typeof ratings === undefined)
  ? false
  : true
