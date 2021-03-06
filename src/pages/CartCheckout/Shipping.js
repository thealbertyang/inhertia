import React from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'


import { OnChange } from 'react-final-form-listeners'
import { Form, Field } from 'react-final-form'

import * as Cart from '../../actions/cart'
import { getLocation } from '../../actions/index'
import { fetchData, postData } from '../../utils'

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
	}

	componentDidMount = async () => {
		let { props } = this
		let { dispatch } = props
		let shipping = await Cart.loadShipping(dispatch)
		let inputs = _.mapValues(shipping, (item, arr, key)=>({ value: item }))
	}

	componentDidUpdate = async (prevProps) => {

		/*console.log('this first supdate shiupping')

		let { props } = this
		let { forms, dispatch } = props
		let isShippingChanged = Form.isFormChanged({ prevForm: prevProps.forms.cart_shipping, thisForm: this.props.forms.cart_shipping })

		if(isShippingChanged){
			let shipping = Form.fetchAll({ formName: 'cart_shipping', forms })
			shipping = _.mapValues(shipping, item=>item.value)
		console.log('this first supdate shiupping 2')

			//delete shipping._id
			await Cart.updateShipping(shipping)
			await Cart.loadShipping(dispatch)
		}
*/

	}

	onChange = async (e) => {
		let { props } = this
		let { forms, dispatch } = props
		console.log('we changing bro!!!!')
		let shipping = Form.fetchAll({ formName: 'cart_shipping', forms })
			shipping = _.mapValues(shipping, item=>item.value)
		console.log('this first supdate shiupping 2')

			delete shipping._id
			await Cart.updateShipping(shipping)
			await Cart.loadShipping(dispatch)
	}

	selectShipping = async ({ e, shipping }) => {

		console.log('this first select shiupping')

		e.preventDefault()
		let { props } = this
		let { forms, dispatch } = props
		await Cart.updateShipping(shipping)
		console.log('this first select shiupping 2')

		shipping = await Cart.loadShipping(dispatch)

		let inputs = _.mapValues(shipping, (item, arr, key)=>({ value: item }))
		//delete inputs._id

		Form.set({ name: 'cart_shipping', inputs, dispatch })


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
				validate={values => {
					const errors = {};
					if (!values.email) {
						errors.email = "Required";
					}
					return errors;
				}}
				initialValues={cart.shipping}
				onSubmit={this.onSubmit}
				render={({ values, handleSubmit, onChange }) => (
					<form className='row' onSubmit={handleSubmit}>
					<div className='col-12'>
						<h3 className='font-weight-light'>Shipping</h3>
						<hr/>
						{/*<pre>{JSON.stringify(values, 0, 2)}</pre>*/}

						<div className={`orderShipping mb-5`}>
							{user.customer &&
								<div className='row mb-5'>
									<div className='col-12'>
									 	{(!_.isEmpty(user.customer.shipping) ? _.map(user.customer.shipping, (item, key, arr)=>{
											return [
												<div className='row'>
													<div className='col-1 d-flex'>
														<a href='#' onClick={e=>this.selectShipping({ e, shipping: item })}>
															{_.has(cart, 'shipping') ? (cart.shipping._id === item._id ? <i className='material-icons'>check_box</i> : <i className='material-icons'>check_box_outline_blank</i>) : <i className='material-icons'>check_box_outline_blank</i>}
														</a>
													</div>
													<div className='col-11 d-flex justify-content-start align-items-center'>
														<p className='mb-0'>{item.line1 && item.line1}. {item && item.line1}  {item && item.city}, {item && item.state} {item && item.postal_code}</p>
													</div>
												</div>,
											]
										})
										:
											[
												<p className='mb-0'>You haven't saved any addresses methods.</p>
											]
										)}
									</div>
								</div>
							}

							<div className="form row">
								<div className="form-group col-3">
									<label>
										First Name
									</label>
									<Field name="first_name">
										{({ input, meta }) => [
												<input {...input} type="text" className='form-control' placeholder="First Name" />,
												(meta.error || meta.submitError) &&
												meta.touched && <div className='mt-2'>{meta.error || meta.submitError}</div>
										]}
									</Field>

									<OnChange name={`first_name`}>
					            {(value, previous) => {
													if(value !== previous){
														Cart.addShipping({ first_name: value })
													}
					            }}
					         </OnChange>
								</div>
								<div className="form-group col-3">
									<label>
										Last Name
									</label>
									<Field name="last_name">
										{({ input, meta }) => [
												<input {...input} type="text" className='form-control' placeholder="Last Name" />,
												(meta.error || meta.submitError) &&
												meta.touched && <div className='mt-2'>{meta.error || meta.submitError}</div>
										]}
									</Field>
									<OnChange name={`last_name`}>
											{(value, previous) => {
													if(value !== previous){
														Cart.addShipping({ last_name: value })
													}
											}}
									 </OnChange>
								</div>
								<div className={`form-group col-3 ${_.isEmpty(user) ? 'col-3' : 'col-6'}`}>
									<label>
										Phone
									</label>
									<Field name="phone">
										{({ input, meta }) => [
												<input {...input} type="text" className='form-control' placeholder="Phone" />,
												(meta.error || meta.submitError) &&
												meta.touched && <div className='mt-2'>{meta.error || meta.submitError}</div>
										]}
									</Field>
									<OnChange name={`phone`}>
											{(value, previous) => {
													if(value !== previous){
														Cart.addShipping({ phone: value })
													}
											}}
									 </OnChange>
								</div>
								{_.isEmpty(user) && <div className="form-group col-3">
									<label>
										Email
									</label>
									<Field name="email">
										{({ input, meta }) => [
												<input {...input} type="email" className='form-control' placeholder="Email" />,
												(meta.error || meta.submitError) &&
												meta.touched && <div className='mt-2'>{meta.error || meta.submitError}</div>
										]}
									</Field>
									<OnChange name={`email`}>
											{(value, previous) => {
													if(value !== previous){
														Cart.addShipping({ email: value })
													}
											}}
									 </OnChange>
								</div>}
								<div className="form-group col-8">
									<label>
										Address Street
									</label>
									<Field name="line1">
										{({ input, meta }) => [
												<input {...input} type="text" className='form-control' placeholder="Address" />,
												(meta.error || meta.submitError) &&
												meta.touched && <div className='mt-2'>{meta.error || meta.submitError}</div>
										]}
									</Field>
									<OnChange name={`line1`}>
											{(value, previous) => {
													if(value !== previous){
														Cart.addShipping({ line1: value })
													}
											}}
									 </OnChange>
								</div>
								<div className="form-group col-4">
									<label>
										Apt. Suite. etc...
									</label>
									<Field name="line2">
										{({ input, meta }) => [
												<input {...input} type="text" className='form-control' placeholder="Apt. Suite. etc.." />,
												(meta.error || meta.submitError) &&
												meta.touched && <div className='mt-2'>{meta.error || meta.submitError}</div>
										]}
									</Field>
									<OnChange name={`line2`}>
											{(value, previous) => {
													if(value !== previous){
														Cart.addShipping({ line2: value })
													}
											}}
									 </OnChange>
								</div>
								<div className="form-group col-3">
									<label>
										City
									</label>
									<Field name="city">
										{({ input, meta }) => [
												<input {...input} type="text" className='form-control' placeholder="City" />,
												(meta.error || meta.submitError) &&
												meta.touched && <div className='mt-2'>{meta.error || meta.submitError}</div>
										]}
									</Field>
									<OnChange name={`city`}>
											{(value, previous) => {
													if(value !== previous){
														Cart.addShipping({ city: value })
													}
											}}
									 </OnChange>
								</div>
								<div className="form-group col-3">
									<label>
										State
									</label>
									<Field name="state">
										{({ input, meta }) => [
												<input {...input} type="text" className='form-control' placeholder="State / Province / Region" />,
												(meta.error || meta.submitError) &&
												meta.touched && <div className='mt-2'>{meta.error || meta.submitError}</div>
										]}
									</Field>
									<OnChange name={`state`}>
											{(value, previous) => {
													if(value !== previous){
														Cart.addShipping({ state: value })
													}
											}}
									 </OnChange>
								</div>
								<div className="form-group col-3">
									<label>
										Zip/ Postal Code
									</label>
									<Field name="postal_code">
										{({ input, meta }) => [
												<input {...input} type="text" className='form-control' placeholder="Zip / Postal Code" />,
												(meta.error || meta.submitError) &&
												meta.touched && <div className='mt-2'>{meta.error || meta.submitError}</div>
										]}
									</Field>
									<OnChange name={`postal_code`}>
											{(value, previous) => {
													if(value !== previous){
														Cart.addShipping({ postal_code: value })
													}
											}}
									 </OnChange>
								</div>
								<div className="form-group col-3">
									<label>
										Country
									</label>
									<Field name="country">
										{({ input, meta }) => [
												<input {...input} type="text" className='form-control' placeholder="Country" />,
												(meta.error || meta.submitError) &&
												meta.touched && <div className='mt-2'>{meta.error || meta.submitError}</div>
										]}
									</Field>
									<OnChange name={`country`}>
											{(value, previous) => {
													if(value !== previous){
														Cart.addShipping({ country: value })
													}
											}}
									 </OnChange>
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
