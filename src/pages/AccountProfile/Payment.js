import React from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'

import Footer from '../../components/Page/Footer'
import Card from '../../components/Page/Card'
import Navbar from '../../components/Page/Navbar'
import { Form, Input, Password } from '../../components/Form'

import * as Cart from '../../actions/cart'
import * as User from '../../actions/user'
import { getLocation, redirect } from '../../actions/index'
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
export default class Payment extends React.Component {
	constructor(props){
		super(props)
		this.state = { status: 'view', stripe: null }
	}

	componentDidMount = async () => {
		this.setState({ stripe: window.Stripe('pk_test_vixzu5CoMlSioGsG2IgGD2Z4') });
	}

	createPaymentToken = (e, stripe) => {

		let { props } = this
		let { user, forms, models, location, dispatch } = props

		console.log('forms', forms['addPayment'])
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

		let inputs = forms['addPayment'].inputs

		if(!_.isEmpty(inputs)){
  			inputs = _.mapValues(inputs, v=>v.value)

			stripe.createToken({
		      name: user.first_name+'_'+user.last_name,
		      card: {...inputs},
		    }).then( async ({token}) => {

		      console.log('Received Stripe token:', token, this.props, this);

     			await Cart.updateToken(token.id, dispatch)

     			console.log('after', this.props)

		    })
     // this.props.dispatch(Crud.setPageModel('customerCard', { value: token.card.id }))

      //Save token to shop redux props cart token


      //once you get cart token save it to customer user token

      //what if it is a guest??

      //Shop.submitOrder(token)


    // However, this line of code will do the same thing:
    // this.props.stripe.createToken({type: 'card', name: 'Jenny Rosen'});
		}
	}
	addPayment = (e) => {
		e.preventDefault()
		//get user and insert to form inputs
		let { props } = this
		let { user, dispatch } = props

		let inputs = {
			address_line1: '',
			address_line2: '',
			address_city: '',
			address_state: '',
			address_zip: '',
			address_country: '',
		}

		inputs = _.mapValues(inputs, (v,k)=>{
	        return ({ value: v })
  		})

		Form.set({ name: 'addPayment', inputs: inputs, status: '', message: '', dispatch })
		this.setState({ status: 'manage' })
	}

	deleteCustomerShipping = async (e, id) => {
		let { props } = this
		let { user, dispatch } = props
		e.preventDefault()
		console.log('ID', id)
		let deleteCustomerShipping = await postData(`/api/customer/shipping/delete/${user.customer._id}`, { shipping_id: { value: id } } )
		if(deleteCustomerShipping.response === 200){
			User.authToken(null, dispatch)
		}
	}

	loadCreate = async () => {
		let { props } = this
		let { cart, forms, models, location, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		let patchCustomerShipping = await this.addCustomerPayment()
		if(patchCustomerShipping.response === 200){
			//Form.set(, 'success', 'Successfully saved.' )
			//redirect('ACCOUNT', 'profile')
			Form.set({ name: 'addPayment', inputs: {...forms['addPayment'].inputs, token: { value: cart.token } }, status: '', message: '', dispatch })
			User.authToken(null, dispatch)
			this.setState({ status: 'view' })
		}
		else {
			//this.set(patchOne.data, 'error', 'Error with saving.')
		}
	}

	addCustomerPayment = async (e) => {
		let { props } = this
		let { cart, forms, user } = props
		return await postData(`/api/customer/payment/create/${user.customer._id}`, { token: { value: cart.token } })
	}

	componentDidUpdate = () => {
		/*

			if form edit profile is submitting
			then postData to customer route
			if successfull then redirect and message

		*/
		let { props } = this
		let { location, forms } = props
		let { page, method } = getLocation(location)
		Form.didSubmit({ name: 'addPayment', form: forms['addPayment'] }) && this.loadCreate()
	}

	render() {
		let { props } = this
		let { user, location } = props
		let { page, method } = getLocation(location)

		return [
		<Form name={`addPayment`}>
					<Card
						body={[
							<div className='row'>
								<div className='col-6'>
									<h6 className='card-title'>Payment</h6>
								</div>
								<div className='col-6 text-right'>
									{this.state.status == 'view' && (<a href='#' onClick={(e)=>{ this.addPayment(e) }}>Add</a>)}
									{this.state.status == 'manage' && (<button type='submit' className='btn btn-small py-1 btn-outline-success'>Save</button>)}
								</div>
							</div>,
							user.customer && user.customer.stripe_customer && !_.isEmpty(user.customer.stripe_customer.sources.data) ? _.map(user.customer.stripe_customer.sources.data, (item, key, arr)=>{
									return (
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
												<a href='#' onClick={(e)=>{ e.preventDefault(); this.deleteCustomerShipping(user.customer_id, item._id)}}><i className='material-icons text-secondary'>delete</i></a>
											</div>
										</div>
									)
								})
								:
									(
										<p>You haven't saved any payment methods.</p>
									)
						]}
					/>

			{
				(this.state.status == 'manage') &&
					(
						<div className='row'>
							<div className='form-group col-8'>
								<Input label='Street Address' name='address_line1'/>
							</div>

							<div className='form-group col-4'>
								<Input type='text' label='Apt, Suite, etc..' name='address_line2'/>
							</div>

							<div className='form-group col-4'>
								<Input type='text' label='City' name='address_city'/>
							</div>

							<div className='form-group col-2'>
								<Input type='text' label='State' name='address_state'/>
							</div>

							<div className='form-group col-3'>
								<Input type='text' label='Postal Code' name='address_zip'/>
							</div>

							<div className='form-group col-3'>
								<Input type='text' label='Country' name='address_country'/>
							</div>

							<div className='form-group col-12'>
								<StripeProvider stripe={this.state.stripe}>
						      		<MyStoreCheckout handleSubmit={(e,stripe)=>this.createPaymentToken(e, stripe)}/>
						    	</StripeProvider>
						    </div>

					    </div>
					)
			}
		</Form>
		]
	}

}
