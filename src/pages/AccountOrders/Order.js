import React from 'react'
import { connect } from 'react-redux'

import * as _ from 'lodash'
import moment from 'moment'

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
export default class Order extends React.Component {
	constructor(props){
		super(props)
	}

	state = { data: {} }

	load = async (id) => {
		let model = await this.fetchModel(id)

		if(model.response === 200){
			return {
				...model.data
			}
		}
	}

	fetchModel = async (id) => {
		return await fetchData(`/api/order/${id}`)
	}

	componentDidMount = async () => {
		let { base, page, method, params } = getLocation(this.props.location)
		let id = method

		this.setState({ loading: true })
	     const data = await this.load(id)
	     this.setState({ loading: false, data })
	}

	render() {
		let { props } = this
		let { models, location } = props
		let { base, page, method } = getLocation(location)

		let progressStyle = () => {
			if(this.state.data.status === 'pending'){
				return { width: '25%'}
			}
			else if(this.state.data.status === 'shipped'){
				return { width: '50%'}
			}
			else if(this.state.data.status === 'delivered'){
				return { width: '75%'}
			}
			else if(this.state.data.status === 'completed'){
				return { width: '100%'}
			}
		}


		console.log('this.props', this.props)
		return [
			<div className='row'>
				<div className='card mb-4'>
					<div className='card-body'>
						<div className='row'>
							<div className='col-6 mb-2'>
								<h6>Purchase Date</h6>
								<p>{this.state.data.date && moment(this.state.data.date).format("MMM D, YYYY")}</p>
								<hr/>
								{_.has(this.state.data, 'stripe_charge.source.brand') && this.state.data.stripe_charge.source.brand}<br/>
								Ending in {_.has(this.state.data, 'stripe_charge.source.last4') && this.state.data.stripe_charge.source.last4}<br/>
							</div>


							<div className='col-6 mb-2 text-right'>
								<h6>Est. Delivery</h6>
								<p>{this.state.data.date && moment(this.state.data.date).add(5,'days').format("MMM D")} - {this.state.data.date && moment(this.state.data.date).add(7,'days').format("MMM D, YYYY")}</p>
								<hr/>
								{this.state.data.shipping && this.state.data.shipping.first_name} {this.state.data.shipping && this.state.data.shipping.last_name}<br/>
								{this.state.data.shipping && this.state.data.shipping.line1}?<br/>
								{this.state.data.shipping && this.state.data.shipping.line2}<br/>
								{this.state.data.shipping && this.state.data.shipping.city} {this.state.data.shipping && this.state.data.shipping.state} {this.state.data.shipping && this.state.data.shipping.postal_code}<br/>
								{this.state.data.shipping && this.state.data.shipping.country}<br/>
							</div>

							<div className='col-12'>
								<hr className='hr'/>
							</div>

							<div className="col-12 mt-3 mb-3">
								<div className="progress">
									<div className="progress-bar bg-success" role="progressbar" style={progressStyle()} />
								</div>
							</div>
							<div className="col">
								<span>Pending</span>
							</div>
							<div className="col">
								<span>Shipped</span>
							</div>
							<div className="col">
								<span>Delivered</span>
							</div>
							<div className="col">
								<span>Compeleted</span>
							</div>
						</div>
					</div>
				</div>
				<div className='card mb-4'>
					<div className='card-body'>
						<div className='row'>
							<div className='col-12 mb-0'>
								<h6>Order Summary</h6>
							</div>
						</div>
						<div className='row'>
							<div className="col-12">
				   			<div className='row'>
				   				<div class='col-6'>Items:</div>
				   				<div class='col-6 text-right'>${_.has(this.state.data, 'amounts.items') && this.state.data.amounts.items}</div>
				   			</div>
				   		</div>
				   		<div className="col-12">
				   			<div className='row'>
				   				<div class='col-6'>Shipping:</div>
				   				<div class='col-6 text-right'>${_.has(this.state.data, 'amounts.shipping') && this.state.data.amounts.shipping}</div>
				   			</div>
				   		</div>
				   		<div className="col-12">
				   			<div className='row'>
				   				<div class='col-6'>Discounts:</div>
				   				<div class='col-6 text-right'>- ${_.has(this.state.data, 'amounts.discounts') && this.state.data.amounts.discounts}</div>
				   			</div>
				   		</div>
				   		<div className="col-12">
				   			<div className='row'>
				   				<div className='col-12'>
				   					<hr className='my-1'/>
				   				</div>
				   				<div class='col-6'>Sub-Total:</div>
				   				<div class='col-6 text-right'>${_.has(this.state.data, 'amounts.sub_total') && this.state.data.amounts.sub_total}</div>
				   			</div>
				   		</div>
				   		<div className="col-12">
				   			<div className='row'>
				   				<div class='col-6'>Tax:</div>
				   				<div class='col-6 text-right'>${_.has(this.state.data, 'amounts.tax') && this.state.data.amounts.tax}</div>
				   			</div>
				   		</div>
				   	</div>
					</div>
					<div className='card-footer bg-transparent'>
						<div className='row'>
							<div class='col-6'>Amount Total:</div>
						   	<div class='col-6 text-right'>${_.has(this.state.data, 'amounts.total') && this.state.data.amounts.total}</div>
						</div>
					</div>
				</div>

				<div className='card'>
					<div className='card-body'>
						<div className='row'>
							<div className='col-12'>
								<h6>Items</h6>
							</div>
						</div>
						{_.map(this.state.data.items, (item, key, arr)=>{
							return (
								<div className='row text-center d-flex align-items-center'>
									<div className="col-2">
										<img src={item.images[0]} className='mb-4 img-fluid' />
									</div>
									<div className="col-4 text-left">
										<h6>{item.title}</h6>
										<p className='mb-0'>{item.size}</p>
										<p>{item.color}</p>
									</div>
									<div className="col-2">
										<h6>${item.price}</h6>
									</div>
									<div className="col-2">
										<h6>x{item.quantity}</h6>
									</div>
									<div className="col-2">
										<h6>${Number(Number(item.price) * Number(item.quantity)).toFixed(2)}</h6>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		]
	}

}
