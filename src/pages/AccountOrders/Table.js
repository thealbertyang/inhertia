import React from 'react'
import { connect } from 'react-redux'

import * as _ from 'lodash'

import { Form, Input } from '../../components/Form'

import { fetchData, postData } from '../../utils'
import * as Models from '../../actions/models'
import { getLocation } from '../../actions/index'

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
export default class Table extends React.Component {
	constructor(props){
		super(props)
	}

	loadOrders = async () => {
		let { props } = this
		let { user, dispatch } = props

		console.log('USER', user)
		let orders = await fetchData(`/api/orders/user/${user._id}`)
		if(orders.response === 200){
			await Models.set('orders', orders.data, dispatch)
		}
		console.log('this.props', this.props)
	}

	componentDidMount = () => {
		let { props } = this
		let { models } = props
		if(!_.has(models, 'orders')){
			this.loadOrders()
		}
	}

	componentDidUpdate = async (prevProps) => {
		if(!_.isEqual(prevProps.user, this.props.user) && this.props.user.customer){
			await this.loadOrders()
		}
	}

	render() {
		let { props } = this
		let { models, location } = props
		let { base, page, method } = getLocation(location)
		return [
			<div className="table-responsive border bg-white">
				<table className="table table-striped table-hover mb-0">
					<thead>
						<tr>
							<th>
								Order Date
							</th>
							<th>
								Est. Delivery Date
							</th>
							<th>
								Status
							</th>
							<th>
								Amount
							</th>
							<th className='text-right'>
								Actions
							</th>
						</tr>
					</thead>
					{models['orders'] && (
						<tbody>
							{_.map(models['orders'], (item, key, arr)=> {
								return (
									<tr>
										<td>{item.date}</td>
										<td>--</td>
										<td>{item.status}</td>
										<td>{item.amounts.total}</td>
										<td className='text-right'>
											<a href={`/${base}/${page}/${item._id}`}><i className='material-icons'>open_in_browser</i></a>
										</td>
									</tr>
								)
							})}
						</tbody>
					)}
				</table>
			</div>
		]
	}

}
