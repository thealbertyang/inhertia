import React from 'react'
import { connect } from 'react-redux'

import * as _ from 'lodash'


import Header from '../components/Page/Header'

import Table from './AccountOrders/Table'
import Order from './AccountOrders/Order'

import { fetchData, postData } from '../utils'
import { getLocation } from '../actions/index'
import * as Models from '../actions/models'


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
export default class AccountOrders extends React.Component {
	constructor(props){
		super(props)
	}

	render() {

		let { props } = this
		let { location } = props
		let { method } = getLocation(location)
		let id = method

		return [
			<div className='container' style={{ maxWidth: '1350px' }}>
				<div className="row">
					<div className='col-12 mb-5'>
						{typeof id !== 'undefined' ?
							(
								<Order/>
							)
							:
							(
								<Table/>
							)
						}
					</div>
				</div>
			</div>
		]
	}

}
