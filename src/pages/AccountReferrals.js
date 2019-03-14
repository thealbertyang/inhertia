import React from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'

import Footer from '../components/Page/Footer'
import Navbar from '../components/Page/Navbar'
import Header from '../components/Page/Header'
import Account from './AccountProfile/Account'
import Shipping from './AccountProfile/Shipping'
import Payment from './AccountProfile/Payment'

import { Form, Input } from '../components/Form'
import Cart from '../actions/cart'
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
export default class Profile extends React.Component {
	constructor(props){
		super(props)
	}


	render() {
		let { props } = this
		let { user, location } = props
		let { page } = getLocation(location)

		if(page == 'login'){
			return <Component component={this.loadComponent()}/>
		}
		console.log('tjhis. props', this.props)
		return [
		<div className={`shop page page-login`}>
			<Header/>
			<div className='container my-5 py-5' style={{ maxWidth: '1350px' }}>
				<div className="row">
					<div className='col-6 mb-5' style={{ color: '#5c5c5f' }}>
						<Account/>
					</div>
					<div className='col-6 mb-5' style={{ color: '#5c5c5f' }}>
						<Shipping/>
					</div>
					<div className='col-6 mb-5' style={{ color: '#5c5c5f' }}>
						<Payment/>
					</div>
				</div>
			</div>
		</div>
		]
	}

}
