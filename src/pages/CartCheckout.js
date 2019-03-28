import React from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'

import OrderSummary from './Cart/OrderSummary'
import Shipping from './CartCheckout/Shipping'
import Payment from './CartCheckout/Payment'

import Footer from '../components/Page/Footer'
import Navbar from '../components/Page/Navbar'
import Avatar from '../components/Page/Avatar'

import * as Cart from '../actions/cart'
import * as Messages from '../actions/messages'

import { getLocation } from '../actions/index'
import { fetchData, postData } from '../utils'


@connect((store)=>{
	return {
		cart: store.cart,
		models: store.models,
		messages: store.messages,
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
		let { user, dispatch, messages } = props

		return [
			<div className='container'>
				<div className='row'>
					<div className='col-12'>
						{messages.checkout && <div className={`alert alert-${messages.checkout.type}`}>{messages.checkout.message}</div>}
					</div>
					<div className="col-12 col-md-8">
						{(user && _.isEmpty(user))
							? [
									<h3 className='font-weight-light'>Guest</h3>,
									<div className='card mb-5'>
										<div className='card-body'>
											You are checking out as guest. <a href='/register'>Create</a> an account or <a href='/login'>login</a> to easily track your orders.
										</div>
									</div>
							] : [
									<h3 className='font-weight-light'>User</h3>,
									<div className='card mb-5'>
										<div className='card-body'>
											<div><Avatar size={`medium`} src={user.avatar} className='mr-2'/> Logged in as {user.username}</div>
										</div>
									</div>
							]
						 }
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
