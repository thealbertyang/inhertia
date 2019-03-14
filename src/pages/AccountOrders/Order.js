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
/*
	loadOrders = async () => {
		let { props } = this
		let { user, dispatch } = props

		console.log('USER', user)
		let orders = await fetchData(`/api/orders/customer/${user.customer._id}`)
		if(orders.response === 200){
			await Models.set('orders', orders.data, dispatch)
		}
		console.log('this.props', this.props)
	}

	componentDidUpdate = async (prevProps) => {
		if(!_.isEqual(prevProps.user, this.props.user) && this.props.user.customer){
			await this.loadOrders()
		}
	}
*/

	replyTicket = async (e) => {
		e.preventDefault()

		let { props } = this
		let { user, forms, models, location, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		/*
	    	let hasRoles = _.has(user,'roles') && ((_.indexOf(user.roles, 'admin') > -1)  || (_.indexOf(user.roles, 'customer') > -1) || (_.indexOf(user.roles, 'guest') > -1)  || (_.indexOf(user.roles, 'support') > -1))
		*/

		let fields = Form.fetchAll({ formName: 'replyTicket', forms})

		if(!_.has(models,'order.ticket_id')){
			fields = {
		        type: {
		        	value: 'order'
		        },
		        order_id: {
		        	value: method
		        },
	            user_id: {
	            	 value: user._id
	            },
	            message: fields.message,
		     }

			let ticket = await postData(`/api/ticket/create`, fields)
			if(ticket.response === 200){
				this.loadOrder()
			}
		}
		else {
			/*

				if logged in

				_.has(user, '_id')

			*/
			if(_.has(user, '_id')){
				let ticket = await postData(`/api/ticket/update/${models.order.ticket._id}/messages`, { ...fields, user_id: { value: user._id } })
				if(ticket.response === 200){
					this.loadOrder()
				}
			}
			else if(_.has(models,'ticket.user_id')){
				let ticket = await postData(`/api/ticket/update/${models.order.ticket._id}/messages`, { ...fields, user_id: { value: models.ticket.user_id } })
				if(ticket.response === 200){
					this.loadOrder()
				}
			}

		}

	}

	loadOrder = async () => {
		let { props } = this
		let { models, location, dispatch } = props
		let { base, page, method } = getLocation(location)
		let id = method
		let order = await fetchData(`/api/order/${id}`)
		if(order.response === 200){
			await Models.set('order', order.data, dispatch)
		}
	}

	componentDidMount = async () => {
		this.loadOrder()
	}

	render() {
		let { props } = this
		let { models, location } = props
		let { base, page, method } = getLocation(location)

		console.log('this.props', this.props)
		return [
			<Form name={`search`}>
	        	<div className="form-group d-flex justify-content-end mb-4 search">
					<Input name='term' style={{ width: '10rem' }} placeholder={`Search orders`} /><button className="btn btn-outline-success d-flex align-items-center" type="submit"><i className='material-icons'>search</i></button>
				</div>
			</Form>,
			<div className='row'>
				<div className='col-4'>
					{models['order'] && <div className='card mb-4'>
						<div className='card-header'>
							<div className='row'>
								<div className='col-12 mb-0'>
									Order Summary
								</div>
							</div>
						</div>
						<div className='card-body'>
							<div className='row'>
								<div className="col-12">
						   			<div className='row'>
						   				<div class='col-6'>Items:</div>
						   				<div class='col-6 text-right'>{models['order'].amount.items}</div>
						   			</div>
						   		</div>
						   		<div className="col-12">
						   			<div className='row'>
						   				<div class='col-6'>Shipping:</div>
						   				<div class='col-6 text-right'>{models['order'].amount.shipping}</div>
						   			</div>
						   		</div>
						   		<div className="col-12">
						   			<div className='row'>
						   				<div class='col-6'>Discounts:</div>
						   				<div class='col-6 text-right'>-{models['order'].amount.discounts}</div>
						   			</div>
						   		</div>
						   		<div className="col-12">
						   			<div className='row'>
						   				<div className='col-12'>
						   					<hr className='my-1'/>
						   				</div>
						   				<div class='col-6'>Sub-Total:</div>
						   				<div class='col-6 text-right'>{models['order'].amount.sub_total}</div>
						   			</div>
						   		</div>
						   		<div className="col-12">
						   			<div className='row'>
						   				<div class='col-6'>Tax:</div>
						   				<div class='col-6 text-right'>{models['order'].amount.tax}</div>
						   			</div>
						   		</div>
						   	</div>
						</div>
						<div className='card-footer'>
							<div className='row'>
								<div class='col-6'>Amount Total:</div>
							   	<div class='col-6 text-right'>{models['order'].amount.total}</div>
							</div>
						</div>
					</div>}


					{models['order'] && <div className='card'>
						<div className='card-header'>
							Items
						</div>
						<div className='card-body'>
							{_.map(models['order'].items, (item, key, arr)=>{
								return (
									<div className='row text-center'>
										<div className="col-12">
											<img src='/img/admin/uploads/41025693_025_b4.jpg' className='mb-4' style={{ maxWidth: '35%' }} />
											<h5>{item.title}</h5>
										</div>
										<div className="col-12">
											<h6>{item.size}</h6>
										</div>
										<div className="col-12">
											<h6>{item.color}</h6>
										</div>
										<div className="col-12">
											<h6>Price: {item.price}</h6>
										</div>
										<div className="col-12">
											<h6>Qty: {item.quantity}</h6>
										</div>
										<div className="col-12">
											<h6>Total: {Number(Number(item.price) * Number(item.quantity)).toFixed(2)}</h6>
										</div>
									</div>
								)
							})}
						</div>
					</div>}

				</div>

				<div className="col-8">

					<div className='card mb-4'>
						<div className='card-body'>
							<div className='row'>
								<div className='col-6 mb-2'>
									<h6 style={{ fontFamily: 'Graphik Web', fontWeight: '300', fontSize: '1.25rem', letterSpacing: '3px' }}>PURCHASE DATE</h6>
									<span className='delivery-date' style={{ color: '#00a2e1', fontSize: '1.25rem', fontWeight: '400' }}>Sep 18, 2017</span>
									<hr/>
									Visa<br/>
									Ending in 4267<br/>
								</div>


								<div className='col-6 mb-2 text-right'>
									<h6 style={{ fontFamily: 'Graphik Web', fontWeight: '300', fontSize: '1.25rem', letterSpacing: '3px' }}>EST. DELIVERY</h6>
									<span className='delivery-date' style={{ color: '#00a2e1', fontSize: '1.25rem', fontWeight: '400' }}>Sep 16 - Sep 18, 2017</span>
									<hr/>

								</div>

								<div className='col-12'>
									<hr className='hr'/>
								</div>

								<div className="col-12 mt-3 mb-3">
									<div className="progress">
										<div className="progress-bar bg-success opacity-50" role="progressbar" style={{width: '25%'}} aria-valuenow={15} aria-valuemin={0} aria-valuemax={100} />
										<div className="progress-bar bg-success" role="progressbar" style={{width: '25%'}} aria-valuenow={30} aria-valuemin={0} aria-valuemax={100} />
									</div>
								</div>
								<div className="col">
									<span>Pending</span>
									<br />
									<small className="text-muted"><i className="icon-check mr-1" />Completed: 24th March</small>
								</div>
								<div className="col">
									<span>Shipped</span>
									<br />
									<small className="text-muted"><i className="icon-calendar mr-1" />Due: 3rd April</small>
								</div>
								<div className="col">
									<span>Delivered</span>
									<br />
									<small className="text-muted"><i className="icon-calendar mr-1" />Due: 19th April</small>
								</div>
								<div className="col">
									<span>Compeleted</span>
									<br />
									<small className="text-muted"><i className="icon-calendar mr-1" />Due: 31st April</small>
								</div>

							</div>
						</div>
					</div>



					<div className='card mb-4'>
						<div className='card-header'>
							Quick Support
						</div>


						<div className='card-body border-bottom text-center'>
							<h1 className='font-weight-normal mb-3'>
								Hi, need help?
							</h1>
							{/*<textarea className='form-control'>
							</textarea>
							<a href='#' className='btn btn-success mt-3'>Send</a>*/}

							<Form name='replyTicket'>
								<div className='form-row'>
									<div className="form-group col-12">
										<div className="input-group">
											<Input type="text" name='message' placeholder='Message'/>
											<div className="input-group-append">
												<a href='#' className='btn btn-outline-success d-flex flex-row align-items-center' onClick={e=>this.replyTicket(e)}>
													<i className='material-icons'>add</i>
												</a>
											</div>
										</div>
									</div>
								</div>
							</Form>

						</div>

						{_.has(models,'order.ticket.log') &&
							_.map(models.order.ticket.log, (item, key, arr)=>{
								return (
									<div className='card-body border-bottom'>
										<div className='row'>
											<div className='col-1'>
												<img src='/img/admin/avatar.jpg' className='rounded-circle w-100'/>
											</div>
											<div className='col-11'>
												{item.kind === 'system'
												?
													(<h5></h5>)
												:
													[
														<h5>
															{item.user.first_name} {item.user.last_name}
														</h5>,
														<h6>{_.includes(item.user.roles, 'guest') ? 'Guest' : 'Support'} </h6>
													]
												}

												<p>
													{item.message}
												</p>

												{moment(item.date).format('MMMM Do YYYY • h:mma')}
											</div>
										</div>
									</div>
								)
							})
						}

					</div>



				</div>
			</div>
		]
	}

}
