import React from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'

import OrderSummary from './Cart/OrderSummary'
import Shipping from './CartCheckout/Shipping'
import Payment from './CartCheckout/Payment'

import Footer from '../components/Page/Footer'
import Navbar from '../components/Page/Navbar'

import * as Cart from '../actions/cart'
import { getLocation } from '../actions/index'
import { fetchData, postData } from '../utils'


@connect((store)=>{
	return {
		cart: store.cart,
		models: store.models,
		location: store.location,
		forms: store.forms,
		user: store.user,
		jwtToken: store.jwtToken,
	}
})
export default class Checkout extends React.Component {
	constructor(props){
		super(props)
	}

	render() {
		console.log('tjhis. props', this.props)
		let { props } = this
		let { user, dispatch } = props

		return [
			<div className='container'>
				<div className='row'>
					<div className="col-12 col-md-8">
						<Shipping/>
						<Payment/>
					</div>
					<div className="col-12 col-md-4">
						<OrderSummary/>
					</div>
				</div>
			</div>
		]
	}

}
