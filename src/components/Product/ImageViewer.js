import React from 'react'
import { connect } from 'react-redux'
//import Breadcrumbs from './Breadcrumbs'
import * as _ from 'lodash'
import Link, { NavLink } from 'redux-first-router-link'

import { getLocation } from '../../actions/index'
import ReactImageMagnify from 'react-image-magnify';

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
export default class ImageViewer extends React.Component {
	constructor(props){
		super(props)
	}

	render() { 
		let { props } = this
		let { location, forms, models, user, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		let productModel = _.has(models, 'product') && models['product']


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
				<div className='row'>
					<div className='col-2'>
						{models['product'].images && _.map(models['product'].images, (item, key, arr)=>{
							if(key <= 4){
						 		return (
						 			<a href='#'>
						 				
						 				<div style={{ background: 'url('+item+') center center / cover no-repeat', height: '150px', border: '1px solid transparent', margin: '3px 0' }}>
						 				</div>
						 			</a>
						 		)
						 	}
						})}
					</div>
					<div className='col-10' style={{background: 'url('+(models['product'].images[0] ? models['product'].images[0] : '')+') center center / cover no-repeat', height: '770px' }}>
					
					</div>
				</div>
			]
		}
		else {
			return <div>Loading</div>
		}
	}
}
