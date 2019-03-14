import React from 'react'
import { connect } from 'react-redux'
//import Breadcrumbs from './Breadcrumbs'
import * as _ from 'lodash'
import Link, { NavLink } from 'redux-first-router-link'
import { Form, Input, ColorRadio, SizeRadio } from '../Form'
import * as Cart from '../../actions/cart'

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
export default class ImageViewer extends React.Component {
	constructor(props){
		super(props)
	}

	componentDidMount = () => {
		let { props } = this
		let { forms, dispatch } = props

		if(!_.has(forms, 'cartAdd')){
			Form.updateOne({ cartAdd: 'quantity' }, { value: 1 }, dispatch)
		}
	}

	cartAdd = (e, id) => {
		e.preventDefault()
		//Cart.addItem({  id, color, size, quantity })
		let { props } = this
		let { forms, models, location, dispatch } = props
		console.log('we are trying to cart Add', this.props)
		let color = forms['cartAdd'].inputs['color'].value
		let size = forms['cartAdd'].inputs['size'].value
		let quantity = forms['cartAdd'].inputs['quantity'].value
		
		Cart.incrementItem({ id, color, size, quantity, dispatch })

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
				<Form name={'cartAdd'} className='row h-100 d-flex flex-row align-content-center'>
						<div className='col-12 mt-2 mb-4 pb-5 text-right'>
							{models['product'] && <ColorRadio name='color' label='Color' options={models['product'].importData.attributes[0].items} />}
						</div>

						<div className='col-12 mb-4 mb-4 text-right'>
							{models['product'] && <SizeRadio name='size' label='Size' options={models['product'].importData.attributes[1].items} />}
						</div>

						<div className='col-4 mb-4 pb-5 ml-auto'>
							<Input type='number' name={`quantity`} label='Qty:' className='form-control' defaultValue={1}/>
				    		<a href='#' className="btn btn-success rounded-0 d-flex justify-content-center align-items-center text-white" onClick={e=>{this.cartAdd(e, _id) /* addCart(_id, 1, color, size) */ }} style={{ letterSpacing: '.11rem', textTransform: 'uppercase', height: '2.5rem', fontSize: '0.8rem' }}>Add to Cart</a>
					    </div>

				</Form>,
			]
		}
		else {
			return <div>Loading</div>
		}
	}
}
