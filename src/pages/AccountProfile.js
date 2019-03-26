import React from 'react'
import { connect } from 'react-redux'

import * as _ from 'lodash'

import Footer from '../components/Page/Footer'
import Navbar from '../components/Page/Navbar'
import Header from '../components/Page/Header'

import Account from './AccountProfile/Account'
import Shipping from './AccountProfile/Shipping'
import Payment from './AccountProfile/Payment'

import * as User from '../actions/user'
import { fetchData } from '../utils'

@connect((store)=>{
	return {
		forms: store.forms,
		user: store.user,
		location: store.location,
	}
})
export default class AccountProfile extends React.Component {
	constructor(props){
		super(props)
	}

	render() {
		let { props } = this
		let { forms, user, dispatch } = props
		return [
			<div className={`row ${_.has(user, '_id') ? (User.isEmailVerified(user) ? '' : '') : ''}`}>
				<div className='col-12 mb-5'>
					<Account/>
				</div>
				<div className='col-12 mb-5'>
					{(typeof this.props.user.customer !== 'undefined') && <Shipping/>}
				</div>
				<div className='col-12 mb-5'>
						{(typeof this.props.user.customer !== 'undefined') && <Payment/>}
				</div>
			</div>
		]
	}

}
