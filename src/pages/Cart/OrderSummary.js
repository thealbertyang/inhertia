import React from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'

import { Form, Field } from 'react-final-form'

import * as Cart from '../../actions/cart'
import * as Messages from '../../actions/messages'
import { getLocation, redirect } from '../../actions/index'

@connect((store)=>{
	return {
		cart: store.cart,
		location: store.location,
		forms: store.forms,
		user: store.user,
	}
})
export default class OrderSummary extends React.Component {
	constructor(props){
		super(props)
	}

	componentDidMount = async () => {
		let { props } = this
		let { dispatch } = props

		await Cart.loadAmounts(this.props.dispatch)
		await Cart.loadItems(dispatch)
		await this.loadDiscounts()
	}

	loadDiscounts = async () => {
		let { props } = this
		let { dispatch } = props
		await Cart.loadDiscounts(dispatch)
		await Cart.loadAmounts(dispatch)
	}

	applyDiscount = async (values) => {
		if(!_.isEmpty(values.discount_code)){
			await Cart.applyDiscount(values.discount_code)
			await this.loadDiscounts()
		}
	}

	removeDiscount = async (e, key) => {
		e.preventDefault()
		await Cart.removeDiscount(key)
		await this.loadDiscounts()
	}

	submitOrder = async (e) => {
		e.preventDefault()
		let { props } = this
		let { cart, user, dispatch } = props

		//let validShipping = await this.validateShipping()
		//let validPayment = await this.validatePayment()

		//if(validPayment && validShipping){
			if(_.isEmpty(user)){
				 let guestOrder = await Cart.submitGuestOrder()
				 if(guestOrder.response === 200){
					 dispatch(redirect('CART', 'success'))
				 }
				 else {
					 console.log('it didnt go thru')
					 Messages.set('checkout', { type: 'danger', message: guestOrder.message }, dispatch)
				 }
			}
			else {
				let customerOrder = await Cart.submitCustomerOrder(user._id)
				if(customerOrder.response === 200){
					dispatch(redirect('CART', 'success'))
				}
				else {
					console.log('it didnt go thru')
					Messages.set('checkout', { type: 'danger', message: customerOrder.message }, dispatch)
				}
			}
		//}
	}

	checkoutOrder = async (e) => {
			//if items aren't null
			let items = await Cart.loadItems(this.props.dispatch)

			console.log('isEmpty', items, _.isEmpty(items))
			if (!_.isEmpty(items)) {
				this.props.dispatch(redirect('CART', 'checkout'))
			}
	}

	render() {
		let { props } = this
		let { cart, location } = props
		let { page } = getLocation(location)
		console.log('order this.state', this.state, this.props)
		return [
			<div className='card border-primary orderSummary'>
				<div className='card-body'>
					<div className='row mb-4'>
						<div className='col-12'>
							<h6 className='card-title'>Order Summary</h6>
						</div>
						<div className="col-6">
							<p className="mb-1 text-muted">Items</p>
						</div>
						<div className="col-6 text-right">
							{cart.amounts && cart.amounts.items}
						</div>
						<div className="col-6">
							<p className="mb-1 text-muted">Shipping</p>
						</div>
						<div className="col-6 text-right">
							{cart.amounts && cart.amounts.shipping}
						</div>
					</div>
					<div className='row mb-4'>
						<div className="col-6">
							<p className="mb-1 text-muted">Discount</p>
						</div>
						<div className="col-6 text-right">
							{cart.amounts && cart.amounts.discounts}
						</div>
						<div className="col-6">
							<p className="mb-1 text-muted">Sub Total</p>
						</div>
						<div className="col-6 text-right">
							{cart.amounts && cart.amounts.sub_total}
						</div>
					</div>
					<div className='row mb-4'>
						<div className="col-6">
							<p className="mb-1 text-muted">Taxes</p>
						</div>
						<div className="col-6 text-right">
							{cart.amounts && cart.amounts.tax}
						</div>
					</div>
					<div className='row'>
						<div className="col-6">
							<p className="mb-1">Total</p>
						</div>
						<div className="col-6 text-right">
						{cart.amounts && cart.amounts.total}
						</div>
					</div>
				</div>
				<div className='card-body pt-0'>
					<div className='row'>
						<div className="col-12">
							<Form
								keepDirtyOnReinitialize={true}
								onSubmit={this.applyDiscount}
								mutators={{
										setName: (args, state, utils) => {
											utils.changeValue(state, 'discount_code', () => '')
										},
									}}
									initialValues={cart.discounts && cart.discounts[0]}
								render={({
									mutators,
									submitError,
									submitting,
									handleSubmit,
									pristine,
									invalid,
									values,
									}) => (
									<form onSubmit={handleSubmit} className={`input-group`} id={`createEditForm`}>
										<Field name="discount_code">
											{({ input, meta }) => [
													<input type="text" {...input} placeholder="Discount Code" className={`form-control`} />,
													meta.touched && meta.error && <span>{meta.error}</span>,
													<div className="input-group-append">
														{values.discount_code && values.discount_code && <button className="btn btn-outline-secondary" type="submit"><i className="fas fa-reply"></i></button>}
														{values.discount_code && values.discount_code !== '' && <button className="btn btn-outline-secondary" onClick={(e)=> { this.removeDiscount(e, 0); mutators.setName(); }}><i className="far fa-minus-square"></i></button>}
													</div>
											]}
										</Field>
									</form>
								)}
							/>
						</div>
					</div>
				</div>
				<div className='card-footer py-4'>
					<div className='row'>
						<div className="col-6">
							{typeof page === 'undefined' && <a href={`#`} className={`btn btn-primary btn-block ${_.isEmpty(this.props.cart.items) ? 'disabled' : '' }`} onClick={e=>this.checkoutOrder(e)}>Checkout</a>}
							{page === 'checkout' && <a href={`#`} className="btn btn-primary btn-block" onClick={e=>this.submitOrder(e)}>Purchase</a>}
						</div>
						<div className="col-6">
							<a href="#" onClick={(e)=>history.back()} className="btn btn-secondary btn-block">Back</a>
						</div>
					</div>
				</div>
			</div>

		]
	}

}
