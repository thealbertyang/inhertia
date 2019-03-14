import React from 'react'
import { connect } from 'react-redux'
//import Breadcrumbs from './Breadcrumbs'
import * as _ from 'lodash'
import Link, { NavLink } from 'redux-first-router-link'

import { getLocation } from '../../actions/index'
import * as Models from '../../actions/models'

import { fetchData, postData } from '../../utils'

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
export default class Related extends React.Component {
	constructor(props){
		super(props)
	}

	loadRelated = async () => {
		let { props } = this
		let { models, dispatch } = props
		if(!_.has(models,'productRelated')){
			let productRelated = await fetchData(`/api/product/related/${models['product']._id}`)
			if(productRelated.response === 200){
				await Models.set('productRelated', productRelated.data, dispatch)
			}
		}
	}

	componentDidMount = async () => {
		await this.loadRelated()
	}

	render() { 
		let { props } = this
		let { location, forms, models, user, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		let productModel = _.has(models, 'product') && models['product']
		let { slug, title, description, price, stock, _id, images, flash_status, flash_sale_amount, importData } = productModel


		if(productModel){


			return [
				<h5 className="text-left mt-4"><span className="sub">You May Also Like</span></h5>,
				<hr className='mb-4' />,
				<div className="row">
					{models['productRelated'] && _.map(models['productRelated'], (item, key, arr)=>{
						return (
							<div className="col-4">
								<div className="card">
									<a href={`/product/${item.slug}`}>
										<div className="card-body" style={{ background: 'url('+item.images[0]+') center center / cover no-repeat', height: '20rem' }}>
										</div>
										<div className='card-footer border-0'>
											{item.title}
										</div>
									</a>
								</div>
							</div>
						)
					})}
				</div>
			]
		}
		else {
			return <div>Loading</div>
		}
	}
}
