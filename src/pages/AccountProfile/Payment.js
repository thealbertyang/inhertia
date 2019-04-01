import React from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'

import Footer from '../../components/Page/Footer'
import Card from '../../components/Page/Card'
import Navbar from '../../components/Page/Navbar'
import { Form, Field } from 'react-final-form'


import * as Cart from '../../actions/cart'
import * as User from '../../actions/user'
import * as Forms from '../../actions/forms'
import { getLocation, redirect } from '../../actions/index'
import { fetchData, postData } from '../../utils'

import MyStoreCheckout from '../../components/Stripe/MyStoreCheckout'
import {StripeProvider} from 'react-stripe-elements'
import { OnChange } from 'react-final-form-listeners'



@connect((store)=>{
	return {
		cart: store.cart,
		models: store.models,
		location: store.location,
		form: store.form,
		forms: store.forms,
		user: store.user,
		jwtToken: store.jwtToken,
	}
})
export default class Payment extends React.Component {
	constructor(props){
		super(props)
	}

	state = { stripe: null }

	componentDidMount = async () => {
    this.setState({ stripe: window.Stripe('') });
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

			console.log('address_line1', address_line1)
			console.log('address_line2', address_line2)
			console.log('address_citya', address_city)
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

     			await Cart.updateToken(token.id, dispatch)

     			console.log('after', this.props)

		    })


    // However, this line of code will do the same thing:
    // this.props.stripe.createToken({type: 'card', name: 'Jenny Rosen'});
	}

	deleteCustomerShipping = async (e, id) => {
		let { props } = this
		let { user, dispatch } = props
		e.preventDefault()
		let deleteCustomerShipping = await postData(`/api/user/customer/payment/delete/${user.customer._id}`, { payment_id: id } )
		if(deleteCustomerShipping.response === 200){
			User.authToken({ dispatch })
		}
	}


	updateModel = async (id, token) => {
		return await postData(`/api/user/customer/payment/create/${this.props.user.customer._id}`, { token: token })
	}

	onSubmitCreate = async (values) => {
    let { props } = this
    let { cart, user, dispatch } = props
    let id = this.props.user._id

		console.log('TOKEN', cart)
    let update = await this.updateModel(id, cart.token)
    if(update.response === 200){
      User.authToken({ dispatch })
    }
    else {
    }
  }

	render() {
		let { props } = this
		let { user, location } = props
		let { page, method } = getLocation(location)

		console.log('this form', this.props)
		return [
			<Form
				keepDirtyOnReinitialize={true}
				onSubmit={this.onSubmitCreate}
				mutators={{
						setName: (args, state, utils) => {
							utils.changeValue(state, 'name', () => 1)
						},
					}}
				render={({ mutators, submitError, submitting, handleSubmit, pristine, invalid, values }) => {
					return (
					<form onSubmit={handleSubmit} id={`editShippingForm`} autoComplete="none">
					<input type="hidden" value="something"/>
					<Card
						className='mb-4'
						body={[
							<div className='row'>
								<div className='col-6'>
									<h6 className='card-title'>Payments</h6>
								</div>
								<div className='col-6 text-right'>
								</div>
							</div>,
							_.has(user,'customer.stripe_customer') && !_.isEmpty(user.customer.stripe_customer.sources.data) ? _.map(user.customer.stripe_customer.sources.data, (item, key, arr)=>{
									return [
										<div className='row'>
											<div className='col-1 d-flex align-items-center'>
												<i className='material-icons text-success'>check_circle</i>
											</div>
											<div className='col-5 d-flex align-items-center'>
												{item.brand}
											</div>
											<div className='col-5 d-flex justify-content-end align-items-center'>
												<small className='text-secondary'>Ending in</small>&nbsp; {item.last4}
											</div>
											<div className='col-1 d-flex flex-column align-items-center justify-content-end'>
												<a href='#' onClick={(e)=>{ this.deleteCustomerShipping(e, item.id)}}><i className='material-icons text-secondary'>delete</i></a>
											</div>
										</div>
									]
								})
								:
									(
										<div className='row'>
											<div className='col-12'>
												<p className='mb-0'>You haven't saved any payment methods.</p>
											</div>
										</div>
									)
						]}
					/>
					<Card
						body={[
							<div className='row py-2'>
								<div className='col-12'>
									<h6>Add Payment</h6>
								</div>
								<div className='form-group col-12'>
									<Field
										name={`name`}
										component="input"
										type='text'
										placeholder="Name on Card"
										className="form-control"
										autoComplete="none"
									/>
									<OnChange name={'name'}>
										{(value, previous) => {
											// do something
												if(value !== previous && previous){
													Forms.setOne('payment', 'name', value, this.props.dispatch )
												}
										}}
									 </OnChange>

								</div>
								<div className='form-group col-8'>
									<Field
										name={`address_line1`}
										component="input"
										type='text'
										placeholder="Street Address"
										className="form-control"
									/>
									<OnChange name={'address_line1'}>
										{(value, previous) => {
											// do something
												if(value !== previous && previous){
													Forms.setOne('payment', 'address_line1', value, this.props.dispatch )
												}
										}}
									 </OnChange>
								</div>

								<div className='form-group col-4'>
									<Field
										name={`address_line2`}
										component="input"
										type='text'
										placeholder="Apt, Suite, etc.."
										className="form-control"
									/>
									<OnChange name={'address_line2'}>
											{(value, previous) => {
												// do something
													if(value !== previous && previous){
														Forms.setOne('payment', 'address_line2', value, this.props.dispatch )
													}
											}}
									 </OnChange>
								</div>

								<div className='form-group col-4'>
									<Field
										name={`address_city`}
										component="input"
										type='text'
										placeholder="City"
										className="form-control"
									/>
									<OnChange name={'address_city'}>
											{(value, previous) => {
												// do something
													if(value !== previous && previous){
														Forms.setOne('payment', 'address_city', value, this.props.dispatch )
													}
											}}
									 </OnChange>
								</div>

								<div className='form-group col-2'>
									<Field
										name={`address_state`}
										component="input"
										type='text'
										placeholder="State"
										className="form-control"
									/>
									<OnChange name={'address_state'}>
											{(value, previous) => {
												// do something
													if(value !== previous && previous){
														Forms.setOne('payment', 'address_state', value, this.props.dispatch )
													}
											}}
									 </OnChange>
								</div>

								<div className='form-group col-3'>
									<Field
										name={`address_zip`}
										component="input"
										type='text'
										placeholder="Postal Code"
										className="form-control"
									/>
									<OnChange name={'address_zip'}>
											{(value, previous) => {
												// do something
													if(value !== previous && previous){
														Forms.setOne('payment', 'address_zip', value, this.props.dispatch )
													}
											}}
									 </OnChange>
								</div>

								<div className='form-group col-3'>
									<Field
										name={`address_country`}
										component="input"
										type='text'
										placeholder="Country"
										className="form-control"
									/>
									<OnChange name={'address_country'}>
											{(value, previous) => {
												// do something
													if(value !== previous && previous){
														Forms.setOne('payment', 'address_country', value, this.props.dispatch )
													}
											}}
									 </OnChange>
								</div>

								<div className='form-group col-12'>
									<StripeProvider stripe={this.state.stripe}>
										<MyStoreCheckout handleSubmit={(e,stripe)=>this.createPaymentToken(e, stripe)}/>
									</StripeProvider>
								</div>

								<div className='form-group col-6'>
									<button type='submit' className='btn btn-small py-1 btn-primary'>Save</button>
								</div>
						 </div>
						]}
					/>
				</form>
			)}}
			/>
		]
	}

}
