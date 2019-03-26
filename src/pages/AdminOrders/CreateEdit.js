import React from 'react'
import { connect } from 'react-redux'

import * as _ from 'lodash'
import moment from 'moment'

import Card from '../../components/Admin/Card'
import Header from '../../components/Admin/Header'

import { Form, Field } from 'react-final-form'

import { fetchData, postData } from '../../utils'
import { getLocation, setForm } from '../../actions/index'
import * as Messages from '../../actions/messages'

@connect((store)=>{
	return {
		forms: store.forms,
		models: store.models,
		messages: store.messages,
		location: store.location,
	}
})
export default class CreateEdit extends React.Component {
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

	fetchUser = async (id) => {
		return await fetchData(`/api/user/${id}`)
	}

	fetchModel = async (id) => {
		return await fetchData(`/api/order/${id}`)
	}

	updateModel = async (id, fields) => {
		return await postData(`/api/order/update/${id}`, fields)
	}

	createModel = async (fields) => {
		return await postData(`/api/order/create`, fields)
	}

  onSubmitCreate = async (values) => {
    let { base, page, method, params } = getLocation(this.props.location)
    let data = {
      ...values,
      roles: JSON.stringify(values.roles)
    }
    let create = await this.createModel(data)
    if(create.response === 200){
        this.props.dispatch(redirect('ADMIN', page))
    }
		else if(create.response === 409){
      Messages.set('orders', { message: 'Duplicate Product.', type: 'danger' }, this.props.dispatch)
    }
    else {
      Messages.set('orders', { message: 'Creating Failed.', type: 'danger' }, this.props.dispatch)
    }
  }

  onSubmitEdit = async (values) => {
    let { base, page, method, params } = getLocation(this.props.location)
    let id = params[0]
    let data = {
      ...values,
      roles: JSON.stringify(values.roles)
    }
    let update = await this.updateModel(id, data)
    if(update.response === 200){
			Messages.set('orders', { message: 'Successfully updated.', type: 'success' }, this.props.dispatch)
    }
    else {
      Messages.set('orders', { message: 'Updating failed.', type: 'success' }, this.props.dispatch)
    }
  }

	componentDidMount = async () => {
    let { base, page, method, params } = getLocation(this.props.location)
		let id = params[0]

    this.setState({ loading: true })
	     const data = await this.load(id)
	     this.setState({ loading: false, data })
	}

	render() {
		let { props } = this
		let { location, messages, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		console.log('this.state', this.state)

		return [
			<Form
				keepDirtyOnReinitialize={true}
				onSubmit={this.onSubmitEdit}
				initialValues={this.state.data}
				mutators={{
						setName: (args, state, utils) => {
							utils.changeValue(state, 'name', () => 1)
						},
					}}
				render={({ mutators, submitError, submitting, handleSubmit, pristine, invalid, values }) => {
					let progressStyle = () => {
						if(values.status === 'pending'){
							return { width: '25%'}
						}
						else if(values.status === 'shipped'){
							return { width: '50%'}
						}
						else if(values.status === 'delivered'){
							return { width: '75%'}
						}
						else if(values.status === 'completed'){
							return { width: '100%'}
						}
					}


					let calcCostOfGoodsSold = () => {
						let cost = 0;
						this.state.data.items && this.state.data.items.map((item, index)=>{
							cost += (item.cost + item.markup) * item.quantity
						})
						return cost
					}

					let calcCostOfGoods = () => {
						let cost = 0;
						this.state.data.items && this.state.data.items.map((item, index)=>{
							cost += item.cost * item.quantity
						})
						return cost
					}

					return (
						<form onSubmit={handleSubmit} className={`row px-5`} id={`createEditForm`}>
							<div className={`col-12`}>
	  						{messages.orders && <div className={`alert alert-${messages.orders.type}`}>{messages.orders.message}</div>}
	  					</div>
	  					<div className={`col-4`}>
								<Card
									className={`mb-4`}
									body={[
										<div className='col-6 mx-auto text-center'>
											<img src={`/img/admin/avatar.jpg`} className="w-100 rounded-circle mb-3" />

											{this.state.data.user && this.state.data.user.username}<br/>
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
								<Card
									className={`mb-5`}
									body={[
										<h6 className='card-title'>Profit Reports</h6>,
										<div className='row'>
											<div className="col-12">
												<div className='row'>
													<div class='col-6'>Cost of Goods Sold:</div>
													<div class='col-6 text-right'>${calcCostOfGoodsSold()}</div>
												</div>
												<div className='row'>
													<div class='col-6'>Cost of Goods:</div>
													<div class='col-6 text-right'>- ${calcCostOfGoods()}</div>
												</div>
												<div className='row'>
													<div className='col-12'>
														<hr className='my-1'/>
													</div>
												</div>
												<div className='row'>
													<div class='col-6'>Goods Sold Profit:</div>
													<div class='col-6 text-right'>${calcCostOfGoodsSold() - calcCostOfGoods()}</div>
												</div>
											</div>
										</div>
									]}
								/>
							</div>
							<div className="col-8">

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
						              <Field
						                name="status"
						                component="input"
						                type="radio"
						                value="pending"
						              />{' '}
						              Pending
						            </label>
											</div>
											<div className="col">
												<label>
													<Field
														name="status"
														component="input"
														type="radio"
														value="shipped"
													/>{' '}
													Shipped
												</label>
											</div>
											<div className="col">
												<label>
													<Field
														name="status"
														component="input"
														type="radio"
														value="delivered"
													/>{' '}
													Delivered
												</label>
											</div>
											<div className="col">
											<label>
												<Field
													name="status"
													component="input"
													type="radio"
													value="completed"
												/>{' '}
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
						</form>

					)
			}}/>
		]

	}
}
