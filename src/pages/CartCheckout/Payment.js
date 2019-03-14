import React from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'

import { OnChange } from 'react-final-form-listeners'
import { Form, Field } from 'react-final-form'
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
		this.setState({ stripe: window.Stripe('pk_test_vixzu5CoMlSioGsG2IgGD2Z4') });

		let { props } = this
		let { dispatch } = props
		let payment = await Cart.loadPayment(dispatch)

	//	let inputs = _.mapValues(payment, (item, arr, key)=>({ value: item }))
	//	Form.set({ name: 'cart_payment', inputs: inputs, status: '', message: '', dispatch })
	}


	createPaymentToken = (e, stripe) => {
		let { props } = this
		let { cart, user, forms, models, location, dispatch } = props

		console.log('got stripe', stripe, this.props.cart)
		let name = cart.payment.name

		let card = {
        'address_city': cart.payment.address_city,
        'address_country': cart.payment.address_country,
        'address_line1': cart.payment.address_line1,
        'address_line2': cart.payment.address_line2,
        'address_state': cart.payment.address_state,
        'address_zip': cart.payment.address_zip,
      }

			stripe.createToken({
		      name,
		      card: card,
		    }).then( async ({token}) => {
		      	console.log('Received Stripe token:', token, this.props, this);
					let payment = Cart.fetchPayment()
     			await Cart.updatePayment({ ...payment, token, name}, dispatch)
     			await Cart.loadPayment(dispatch)
     			console.log('after', this.props)

		    })
     // this.props.dispatch(Crud.setPageModel('customerCard', { value: token.card.id }))

      //Save token to shop redux props cart token


      //once you get cart token save it to customer user token

      //what if it is a guest??

      //Shop.submitOrder(token)


    // However, this line of code will do the same thing:
    // this.props.stripe.createToken({type: 'card', name: 'Jenny Rosen'});
		//}
	}

	selectPayment = async (e, payment) => {

		console.log('this first select payment', payment)

		e.preventDefault()
		let { props } = this
		let { forms, dispatch } = props
		await Cart.updatePayment(payment, dispatch)
		await Cart.updateToken(token, dispatch)

		payment = await Cart.loadPayment(dispatch)

		let inputs = _.mapValues(payment, (item, arr, key)=>({ value: item }))
		//delete inputs._id

	//	Form.set({ name: 'cart_payment', inputs, dispatch })


	}
	onSubmit = async (values) => {

	}
	render() {
		console.log('tjhis. props', this.props)
		let { props } = this
		let { cart, user, dispatch } = props

		return [
			<Form
				mutators={{
					setName: (args, state, utils) => {
						utils.changeValue(state, 'name', () => 1)
					},
				}}
				initialValues={cart.payment}
				onSubmit={this.onSubmit}
				render={({ values, handleSubmit, onChange }) => (
					<form className='row' onSubmit={handleSubmit}>
						<div className='col-12'>
							<h2 className='font-weight-light'>Payment</h2>
							<hr/>
							<div className={`mb-5 orderPayment`}>

									{user.customer &&
										<div className='row mb-5'>
											<div className='col-12'>
												{user.customer && user.customer.stripe_customer && !_.isEmpty(user.customer.stripe_customer.sources.data) ? _.map(user.customer.stripe_customer.sources.data, (item, key, arr)=>{
													return (
														<div className='row'>
															<div className='col-auto d-flex align-items-center'>
																<i className='material-icons text-success'>check_circle</i>
															</div>
															<div className='col-5 d-flex align-items-center'>
																{item.brand}
															</div>
															<div className='col-5 d-flex justify-content-end align-items-center'>
																<small className='text-secondary'>Ending in</small>&nbsp; {item.last4}
															</div>
															<div className='col-1 d-flex flex-column align-items-center justify-content-end'>
																<a href='#' onClick={e=>this.selectPayment(e, item)}>
																	{_.has(cart, 'payment') ? (cart.payment.id === item.id ? <i className='material-icons'>check_box</i> : <i className='material-icons'>check_box_outline_blank</i>) : <i className='material-icons'>check_box_outline_blank</i>}
																</a>
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
											<div className="form-group col-12">
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
																	Cart.addPayment({ name: value })
																}
														}}
												 </OnChange>
											</div>
											<div className="form-group col-8">
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
																	Cart.addPayment({ address_line1: value })
																}
														}}
												 </OnChange>
											</div>
											<div className="form-group col-4">
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
																	Cart.addPayment({ address_line2: value })
																}
														}}
												 </OnChange>
											</div>
											<div className="form-group col-3">
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
																	Cart.addPayment({ address_city: value })
																}
														}}
												 </OnChange>
											</div>
											<div className="form-group col-3">
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
																	Cart.addPayment({ address_state: value })
																}
														}}
												 </OnChange>
											</div>
											<div className="form-group col-3">
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
																	Cart.addPayment({ address_zip: value })
																}
														}}
												 </OnChange>
											</div>
											<div className="form-group col-3">
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
																	Cart.addPayment({ address_country: value })
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
				</form>
				)}
			/>
		]
	}

}
