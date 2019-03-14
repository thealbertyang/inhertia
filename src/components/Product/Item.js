import React from 'react'
import { connect } from 'react-redux'
//import Breadcrumbs from './Breadcrumbs'
import * as _ from 'lodash'
import Link, { NavLink } from 'redux-first-router-link'

import { getLocation } from '../../actions/index'

@connect((store)=>{
	return {
		forms: store.forms,
		models: store.models,
		location: store.location,
		jwtToken: store.jwtToken,
		cart: store.cart,
		user: store.user,
	}
})
export default class Item extends React.Component {
	constructor(props){
		super(props)
	}

	render() { 
		let { props } = this
		let { location, forms, models, user, dispatch } = props
		let { base, page, method, params } = getLocation(location)
		let productModel = _.has(models, 'product') && models['product']
		let { slug, title, description, price, stock, _id, images, flash_status, flash_sale_amount, importData } = productModel


		if(productModel){
			let average = 0;

			if(models['productReviews']){
				for(let i=0; i < models['productReviews'].length; i++){
					let rating = models['productReviews'][i]
					average = average + models['productReviews'][i].rating
				}

				average = Math.round(average / models['productReviews'].length)
			}

			return [
				<div className='col-12 text-center mb-5'>
					<h1 className="heading mt-4 mb-4 font-weight-normal" style={{ color: '#393940' }}>{title}</h1>
					<p><h3 className="heading-secondary font-weight-light" style={{ color: '#3a3a3a' }}>${(flash_status && flash_status === 'on' ? (<span>{price} <span className='ml-2' style={{ textDecoration: 'line-through', opacity: '0.6' }}> {(Number(Number(flash_sale_amount) + Number(price)).toFixed(2))}</span> </span>) : price)}</h3></p>
					<p style={{ color: '#5c5c5f' }}>{description}</p>
					{(average == 1) && [
						<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
						<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star_border</i>,
						<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star_border</i>,
						<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star_border</i>,
						<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star_border</i>,
					]}
					{(average == 2) && [
						<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
						<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
						<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star_border</i>,
						<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star_border</i>,
						<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star_border</i>,
					]}
					{(average == 3) && [
						<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
						<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
						<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
						<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star_border</i>,
						<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star_border</i>,

					]}
					{(average == 4) && [
						<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
						<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
						<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
						<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
						<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star_border</i>,
					]}
					{(average == 5) && [
						<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
						<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
						<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
						<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
						<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
					]}
					<span className="heading-secondary font-weight-light" style={{ color: '#3a3a3a', 'lineHeight': '1', fontSize: '0.9rem', marginLeft: '0.25rem' }}>{(average ? average : [

							<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star_border</i>,
							<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star_border</i>,
							<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star_border</i>,
							<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star_border</i>,
							<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star_border</i>,

						])}</span> <span style={{ color: '#f2f0eb', margin: '0 1rem' }}>|</span> <span><a href='#reviews' style={{ color: '#05728c', letterSpacing: '.06rem', borderBottom: '1px solid #05728c' }}>{models['productReviews'] && models['productReviews'].length} Reviews</a></span>
				</div>
			]
		}
		else {
			return <div>Loading</div>
		}
	}
}
