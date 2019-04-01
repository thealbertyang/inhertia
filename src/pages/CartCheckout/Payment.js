import React from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'

import { OnChange } from 'react-final-form-listeners'
import { Form, Field } from 'react-final-form'
import * as Forms from '../../actions/forms'
import * as Cart from '../../actions/cart'
import { getLocation } from '../../actions/index'
import { fetchData, postData } from '../../utils'

import MyStoreCheckout from '../../components/Stripe/MyStoreCheckout'
import {StripeProvider} from 'react-stripe-elements'

@connect((store)=>{
	return {
		cart: store.cart,
		models: store.models,
		location: store.location,
		forms: store.forms,
		form: store.form,
		user: store.user,
		jwtToken: store.jwtToken,
	}
})
export default class Shipping extends React.Component {
	constructor(props){
		super(props)
		this.state = { stripe: null }
	}

	componentDidMount = async () => {
		this.setState({ stripe: window.Stripe('') });

		let { props } = this
		let { dispatch } = props
		this.clearPayment()
		//let payment = await Cart.loadPayment(dispatch)
	}


	createPaymentToken = (e, stripe) => {
		let { props } = this
		let {  user, forms, models, location, dispatch } = props

		console.log('forms', forms)
		console.log('got stripe', stripe)
		/*

			Only if we get
			address_line1:
			address_line2:
			address_city:
			address_state:
			address_zip:
			address_country:
		*/


		let { name, address_line1,
			address_line2,
			address_city,
			address_state,
			address_zip,
			address_country } = forms.payment.values


			stripe.createToken({
					name: name,
					card: {
						address_line1,
						address_line2,
						address_city,
						address_state,
						address_zip,
						address_country
					}
				}).then( async ({token}) => {

					console.log('Received Stripe token:', token, this.props, this);
					await Cart.updatePayment({ name, address_line1, address_line2, address_city, address_state, address_zip, address_country, token }, dispatch)
					await Cart.updateToken( token, dispatch)
					console.log('after', this.props)

				})

      //Save token to shop redux props cart token
      //once you get cart token save it to customer user token
      //what if it is a guest??

	}

	clearPayment = async (e) => {
		e && e.preventDefault()
		let { props } = this
		let { dispatch } = props
		await Cart.updatePayment({}, dispatch)
	}

	selectPayment = async (e, payment) => {
		console.log('this first select payment', payment)
		e.preventDefault()
		let { props } = this
		let { dispatch } = props
		await Cart.updatePayment(payment, dispatch)
	}

	onSubmit = async (values) => {

	}

	render() {
		console.log('tjhis. props', this.props)
		let { props } = this
		let { cart, user, dispatch } = props

		console.log('cart', this.props)
		return [
			<Form
				mutators={{
					setName: (args, state, utils) => {
						utils.changeValue(state, 'name', () => 1)
					},
				}}
				onSubmit={this.onSubmit}
				render={({ values, handleSubmit, onChange }) => (
					<form className='row' onSubmit={handleSubmit}>
						<div className='col-12'>
							<h3 className='font-weight-light'>Payment</h3>
							<hr/>
							<div className={`mb-5 orderPayment`}>

									{user.customer &&
										<div className='row mb-5'>
											<div className='col-12'>
												{user.customer && user.customer.stripe_customer && !_.isEmpty(user.customer.stripe_customer.sources.data) ? _.map(user.customer.stripe_customer.sources.data, (item, key, arr)=>{
													return (
														<div className='row'>
															<div className='col-1'>
																<a href='#' onClick={e=>this.selectPayment(e, item)}>
																	{_.has(cart, 'payment') ? (cart.payment.id === item.id ? <i className='material-icons'>check_box</i> : <i className='material-icons'>check_box_outline_blank</i>) : <i className='material-icons'>check_box_outline_blank</i>}
																</a>
															</div>
															<div className='col-5 d-flex align-items-center'>
																{item.brand}
															</div>
															<div className='col-6 d-flex justify-content-end align-items-center'>
																<small className='text-secondary'>Ending in</small>&nbsp; {item.last4}
															</div>
														</div>
													)
												})
												:
													(
														<p className='mb-0'>You haven't saved any addresses methods.</p>
													)
												}
											</div>
										</div>
									}

									<div className="form row">
										{!_.isEmpty(user) && user.customer && user.customer.stripe_customer && !_.isEmpty(user.customer.stripe_customer.sources.data) && [<div className="col-1">
												<a href='#' onClick={e=>this.clearPayment(e)}>
													{!_.has(cart, 'payment.id') ? <i className='material-icons'>check_box</i> : <i className='material-icons'>check_box_outline_blank</i>}
												</a>
										</div>,
										<div className='col-11 mb-4'>
											Other
										</div>]}
										<div className='col-12'>
											<div className={`row ${_.has(cart, 'payment.id') && 'disabled'}`}>
												<div className="form-group col-12">
													<label>
														Full Name
													</label>
													<Field
														name="name"
														component="input"
														type="text"
														placeholder="Name on Card"
														className="form-control"
													/>
													<OnChange name={`name`}>
															{(value, previous) => {
																	if(value !== previous){
																		 Forms.setOne('payment', 'name', value, this.props.dispatch )
																	}
															}}
													 </OnChange>
												</div>
												<div className="form-group col-8">
													<label>
														Street Address
													</label>
													<Field
														name="address_line1"
														component="input"
														type="text"
														placeholder="Street Address"
														className="form-control"
													/>
													<OnChange name={`address_line1`}>
															{(value, previous) => {
																	if(value !== previous){
																		Forms.setOne('payment', 'address_line1', value, this.props.dispatch )
																	}
															}}
													 </OnChange>
												</div>
												<div className="form-group col-4">
													<label>
														Apt. Suite. etc..
													</label>
													<Field
														name="address_line2"
														component="input"
														type="text"
														placeholder="Apt. Suite. etc.."
														className="form-control"
													/>
													<OnChange name={`address_line2`}>
															{(value, previous) => {
																	if(value !== previous){
																		Forms.setOne('payment', 'address_line2', value, this.props.dispatch )
																	}
															}}
													 </OnChange>
												</div>
												<div className="form-group col-3">
													<label>
														City
													</label>
													<Field
														name="address_city"
														component="input"
														type="text"
														placeholder="City"
														className="form-control"
													/>
													<OnChange name={`address_city`}>
															{(value, previous) => {
																	if(value !== previous){
																		Forms.setOne('payment', 'address_city', value, this.props.dispatch )
																	}
															}}
													 </OnChange>
												</div>
												<div className="form-group col-3">
													<label>
														State
													</label>
													<Field
														name="address_state"
														component="input"
														type="text"
														placeholder="State / Province / Region"
														className="form-control"
													/>
													<OnChange name={`address_state`}>
															{(value, previous) => {
																	if(value !== previous){
																		Forms.setOne('payment', 'address_state', value, this.props.dispatch )
																	}
															}}
													 </OnChange>
												</div>
												<div className="form-group col-3">
													<label>
														Zip / Postal Code
													</label>
													<Field
														name="address_zip"
														component="input"
														type="text"
														placeholder="Zip / Postal Code"
														className="form-control"
													/>
													<OnChange name={`address_zip`}>
															{(value, previous) => {
																	if(value !== previous){
																		Forms.setOne('payment', 'address_zip', value, this.props.dispatch )
																	}
															}}
													 </OnChange>
												</div>
												<div className="form-group col-3">
													<label>
														Country
													</label>
													<Field
														name="address_country"
														component="input"
														type="text"
														placeholder="Country"
														className="form-control"
													/>
													<OnChange name={`address_country`}>
															{(value, previous) => {
																	if(value !== previous){
																		Forms.setOne('payment', 'address_country', value, this.props.dispatch )
																	}
															}}
													 </OnChange>
												</div>
												<div className="form-group col-12">
													<StripeProvider stripe={this.state.stripe}>
											      		<MyStoreCheckout handleSubmit={(e,stripe)=>this.createPaymentToken(e, stripe)}/>
											    	</StripeProvider>
												</div>
											</div>
										</div>
									</div>

							</div>
						</div>
				</form>
				)}
			/>
		]
	}

}
