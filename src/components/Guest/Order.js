import React from 'react'
import { connect } from 'react-redux'

import * as _ from 'lodash'

import Header from './Header'

import { Form, Input } from '../Form'

import { fetchData, postData } from '../../utils'
import { getLocation } from '../../actions/index'
import * as Models from '../../actions/models'


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

	loadOrder = async () => {
		let { props } = this
		let { forms, dispatch, location } = props
		let { method } = getLocation(location)

		let id = method

		let guestOrder = await fetchData(`/api/order/guest/${id}`)
		if(guestOrder.response === 200){
			Models.set('order', guestOrder.data, dispatch)
		}
		else {
			Form.set({ name: 'guestOrder', inputs: forms['guestOrder'].inputs, status: 'error', message: guestOrder.message, dispatch })
		}
	}

	componentWillMount = async () => {
		let { props } = this
		let { models } = props
		if(!_.has(models, 'order')){
			this.loadOrder()
		}
	}

	render() { 

		let { props } = this
		let { models, location } = props
		let { method } = getLocation(location)
		let id = method
		console.log('this.prosp', this.props)
		return [
			<div className="page page-guest container-fluid px-0" style={{ flex: '1 1' }}>

				<Header/>

				<div className="header container-fluid" style={{  background: 'url() center center / cover no-repeat'}}>
					<div className='container py-5' style={{ maxWidth: '1350px' }}>
						<div className="row">
							<div className='col-12 mb-5' style={{ color: '#5c5c5f' }}>
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
												Support
											</div>

						
											<div className='card-body border-bottom text-center'>
												<h1 className='font-weight-normal mb-3'>
													Hi, need help?
												</h1>
												<textarea className='form-control'>
												</textarea>
												<a href='#' className='btn btn-success mt-3'>Send</a>
											</div>

											<div className='card-body border-bottom'>
												<div className='row'>
													<div className='col-1'>
														<img src='/img/admin/avatar.jpg' className='rounded-circle w-100'/>
													</div>
													<div className='col-11'>
														Albert Yang<br/>
														Customer<br/>

														<p>
															Hi, please send a copy of the return and we will response shortly.
														</p>

														Dec 1st, 2018
													</div>
												</div>
											</div>

											<div className='card-body border-bottom'>
												<div className='row'>
													<div className='col-1'>
														<img src='/img/admin/avatar.jpg' className='rounded-circle w-100'/>
													</div>
													<div className='col-11'>
														Albert Yang<br/>
														Inhertia Support Team<br/>

														<p>
															Hi, please send a copy of the return and we will response shortly.
														</p>

														Dec 1st, 2018
													</div>
												</div>
											</div>


											
										</div>


												
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		]
	}

}
