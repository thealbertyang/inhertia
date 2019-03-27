import React from 'react'
import { connect } from 'react-redux'
import { Form, Field } from "react-final-form"
import { FORM_ERROR } from "final-form"
import moment from 'moment'

import Navbar from '../components/Page/Navbar'
import Header from '../components/Page/Header'
import Card from '../components/Page/Card'
import Section from '../components/Page/Section'
import Overline from '../components/Typography/Overline'

import { getLocation, redirect } from '../actions/index'
import * as User from '../actions/user'
import * as Messages from '../actions/messages'

import { fetchData, postData } from '../utils'

@connect((store)=>{
	return {
		user: store.user,
		messages: store.messages,
		location: store.location,
	}
})

export default class Orders extends React.Component {
	constructor(props){
		super(props)
		window.addEventListener("resize", this.update)
	}

	componentDidMount = async () => {
		let { props } = this
		let { location, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		if(method !== 'undefined'){
			this.setState({ loading: true })
				 const data = await this.load(page)
				 this.setState({ loading: false, data })
		}

		this.update()
	}

	update = () => {
		this.setState({
			height: window.innerHeight,
			width: window.innerWidth
		})
	}


	state = { data: {}, height: 0, width: 0 }

  load = async (id) => {
  	let model = await this.fetchOrder(id)

  	if(model.response === 200){
  	  return {
  			...model.data
  	  }
  	}
  }

	fetchOrder = async (id) => {
		return await fetchData(`/api/order/guest/${id}`)
	}

 	submitOrder = async (fields) => {
		let { props } = this
		let { dispatch } = props

		let guestOrder = await fetchData(`/api/order/guest/${fields._id}`)
		if(guestOrder.response === 200){
			//User.authToken({ dispatch })
			window.location.href = '/orders/'+fields._id
		}
		else {
			Messages.set('Guest', { type: 'danger', message: guestOrder.message }, dispatch)
		}
	}

	render(){
		let { props } = this
		let { location, messages } = props
		let { base, page, method, params } = getLocation(location)

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

		let backgroundImage = this.state.width >= 768 ? `/img/shop/LoginSide.png` : ''

		console.log('LOCATION', getLocation(location))
		return [
		    <Navbar/>,
        typeof page === 'undefined' && <Section className={`flex-fill px-5 align-items-center d-flex`} Name={`hero`} BackgroundColor={`#ffffff`} BackgroundImage={backgroundImage} BackgroundSize={`contain`} BackgroundPosition={`25% center`} Height={`50rem`}>
					<div className={`col-12 col-md-3 offset-md-6`}>
						<Overline>
							Guest & Customer
						</Overline>
						<h1 className="d-flex flex-row font-weight-light">
							 Orders
						</h1>
						<Form
				      onSubmit={this.submitOrder}
				      validate={values => {
				        const errors = {};
				        if (!values._id) {
				          errors._id = "Required";
				        }
				        return errors;
				      }}
				      render={({
				        submitError,
				        handleSubmit,
				        reset,
				        submitting,
				        pristine,
				        values
				      }) => (
				        <form onSubmit={handleSubmit}>
									{messages.Guest && <div className={`alert alert-${messages.Guest.type}`}>{messages.Guest.message}</div>}
									<div className="form-row my-4">
										<div className="form-group col-12">
											<Field name="_id">
												{({ input, meta }) => [
														<input {...input} type="text" className='form-control' placeholder="Enter order id" />,
														(meta.error || meta.submitError) &&
														meta.touched && <span>{meta.error || meta.submitError}</span>
												]}
											</Field>
										</div>
										<div className="form-group col-12">
										</div>
										<div className="form-group col-12 mb-4">
											<button type='submit' className='form-control btn btn-primary btn-lg text-uppercase shadow'>
												<i className="fas fa-search"></i> &nbsp; Find
											</button>
										</div>
									</div>
				        </form>
				      )}
				    />
					</div>
				</Section>,
				typeof page !== 'undefined' && [
					<Header className={`d-flex justify-content-center my-0 pt-5`} OverlineText={`Guest & Customer`} OverlineClassName={`text-muted`} TitleText={`Order`} Height={`15rem`}/>,
					<Section>
						<div className='container'>
							<div className='row'>
								<div className={`col-12 col-md-4`}>
									<Card
										className={`mb-4`}
										body={[
											<div className='col-6 mx-auto text-center'>
												<img src={`/img/admin/avatar.jpg`} className="w-100 rounded-circle mb-3" />

												{this.state.data.user && this.state.data.user.email}

											</div>
										]}
									/>
									<Card
										className={`mb-4`}
										body={[
												<h6 className='card-title'>Order Summary</h6>,
												<div className='row'>
													<div className="col-12">
														<div className='row'>
															<div class='col-6'>Items:</div>
															<div class='col-6 text-right'>${this.state.data.amounts && this.state.data.amounts.items}</div>
														</div>
													</div>
													<div className="col-12">
														<div className='row'>
															<div class='col-6'>Shipping:</div>
															<div class='col-6 text-right'>${this.state.data.amounts && this.state.data.amounts.shipping}</div>
														</div>
													</div>
													<div className="col-12">
														<div className='row'>
															<div class='col-6'>Discounts:</div>
															<div class='col-6 text-right'>- ${this.state.data.amounts && this.state.data.amounts.discounts}</div>
														</div>
													</div>
													<div className="col-12">
														<div className='row'>
															<div className='col-12'>
																<hr className='my-1'/>
															</div>
															<div class='col-6'>Sub-Total:</div>
															<div class='col-6 text-right'>${this.state.data.amounts && this.state.data.amounts.sub_total}</div>
														</div>
													</div>
													<div className="col-12">
														<div className='row'>
															<div class='col-6'>Tax:</div>
															<div class='col-6 text-right'>${this.state.data.amounts && this.state.data.amounts.tax}</div>
														</div>
													</div>
												</div>

										]}
										footer={[
											<div className='row'>
												<div class='col-6'>Amount Total:</div>
												<div class='col-6 text-right'>${this.state.data.amounts && this.state.data.amounts.total}</div>
											</div>
										]}
									/>
								</div>
								<div className="col-12 col-md-8">

									<Card
										className={`mb-4`}
										body={[
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
													<label>
														Pending
													</label>
												</div>
												<div className="col">
													<label>
														Shipped
													</label>
												</div>
												<div className="col">
													<label>
														Delivered
													</label>
												</div>
												<div className="col">
												<label>
													Completed
												</label>
												</div>
											</div>
										]}
									/>

									<Card
										className={`mb-4`}
										body={
											[	<h6 className='card-title'>Items</h6>,
												_.map(this.state.data.items, (item, key, arr)=>{
													return (
														<div className="text-center row d-flex align-items-center mb-4" key={key}>
															<div className="col-2">
																<img src={item.images[0]} className='w-100 mb-4' />
															</div>
															<div className="col-3 text-left">
																<h6>{item.title}</h6>
																<p>
																	{item.size}
																	<br/>
																	{item.color}
																</p>
															</div>
															<div className="col-2">
																<h6>${item.price}</h6>
															</div>
															<div className="col-3">
																<h6>x{item.quantity}</h6>
															</div>
															<div className="col-2">
																<h6>${Number(Number(item.price) * Number(item.quantity)).toFixed(2)}</h6>
															</div>
														</div>
													)
												})
											]
										}
									/>


								</div>
							</div>
						</div>
					</Section>
				]
		]
	}
}
