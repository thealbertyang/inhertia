import React from 'react'
import { connect } from 'react-redux'

import * as _ from 'lodash'
import moment from 'moment'

import Card from '../../components/Admin/Card'
import Header from '../../components/Admin/Header'

import { Form, Field } from 'react-final-form'

import { fetchData, postData } from '../../utils'
import { getLocation, setForm } from '../../actions/index'
import Models from '../../actions/models'

@connect((store)=>{
	return {
		forms: store.forms,
		models: store.models,
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
        return formMessage('danger', 'Duplicate User.')
    }
    else {
        return formMessage('danger', 'Updating Failed.')
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
        return formMessage('success', 'Successfully Updated.')
    }
    else {
        return formMessage('danger', 'Updating Failed.')
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
		let { location, forms, models, dispatch } = props
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
					return (
						<form onSubmit={handleSubmit} className={`row px-5`} id={`createEditForm`}>
							<div className={`col-12`}>
	  						{submitError && submitError}
	  					</div>
	  					<div className={`col-4`}>
								<Card
									className={`mb-4`}
									body={[
										<div className='col-6 mx-auto text-center'>
											<img src="/img/admin/avatar.jpg" className="w-100 rounded-circle mb-3" />

											Username

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
									   				<div class='col-6 text-right'>{this.state.data.amount && this.state.data.amount.items}</div>
									   			</div>
									   		</div>
									   		<div className="col-12">
									   			<div className='row'>
									   				<div class='col-6'>Shipping:</div>
									   				<div class='col-6 text-right'>{this.state.data.amount && this.state.data.amount.shipping}</div>
									   			</div>
									   		</div>
									   		<div className="col-12">
									   			<div className='row'>
									   				<div class='col-6'>Discounts:</div>
									   				<div class='col-6 text-right'>-{this.state.data.amount && this.state.data.amount.discounts}</div>
									   			</div>
									   		</div>
									   		<div className="col-12">
									   			<div className='row'>
									   				<div className='col-12'>
									   					<hr className='my-1'/>
									   				</div>
									   				<div class='col-6'>Sub-Total:</div>
									   				<div class='col-6 text-right'>{this.state.data.amount && this.state.data.amount.sub_total}</div>
									   			</div>
									   		</div>
									   		<div className="col-12">
									   			<div className='row'>
									   				<div class='col-6'>Tax:</div>
									   				<div class='col-6 text-right'>{this.state.data.amount && this.state.data.amount.tax}</div>
									   			</div>
									   		</div>
											</div>

									]}
									footer={[
										<div className='row'>
						   				<div class='col-6'>Amount Total:</div>
						   				<div class='col-6 text-right'>{this.state.data.amount && this.state.data.amount.total}</div>
										</div>
									]}
								/>
								<Card
									className={`mb-5`}
									header={
										<div className='col-12 mb-0'>
											Profit Reports
										</div>
									}
									body={[
										<div className='row'>
							   			<div className='col-12'>
								   			Cost of Goods Sold:
											<br/>
						   					- Costs of Goods:
						   					<hr/>
						   					Profit on Items:
						   					<hr/>
						   					+ Shipping: <br/>
						   					- Discounts:
						   					<hr/>
						   					= Sub-total: <br/>
						   					+ Tax:
						   					<hr/>
						   					= Total Profit Amount:
							   			</div>
										</div>
									]}
									footer={[
										<div className='row'>
						   				<div class='col-6'>Amount Total:</div>,
						   				<div class='col-6 text-right'></div>
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
									]}
								/>

								<Card
									className={`mb-4`}
									body={
										[	<h6 className='card-title'>Items</h6>,
											_.map(this.state.data.items, (item, key, arr)=>{
												return (
													<div className="text-center row d-flex align-items-center mb-4">
														<div className="col-2">
															<img src='/img/admin/uploads/41025693_025_b4.jpg' className='w-100 mb-4' />
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

								<Card
									header={[
										<div className='col-6 mb-0'>
											Support
										</div>,
										<div className='col-6 controls d-flex justify-content-end'>
											<b style={{ fontWeight: '500' }}>Order ID#:</b>
										</div>
									]}
									body={[

										<div className='col-4'>
											<h6 className='mb-1'><span className='float-left'>John Tax</span>
					                		</h6>
					                		{/*<span style={{ width: '0.75rem', height: '0.75rem', display: 'block', marginTop: '0.25rem', marginLeft: '0.5rem', float: 'left', backgroundColor: '#02B875', borderRadius: '100%' }}/>*/}
					                		<span className="text-muted text-small" style={{ display: 'block', clear: 'both' }}>Inhertia Support Team</span>
					                	</div>,

										<div className='col-8'>
					                		<span className="text-muted text-small" style={{ display: 'block', clear: 'both' }}>Hi, we received your return and have refunded your purchase. Please allow for 2 business days for your card company to process your refund.</span>
					                	</div>,


								        <div className="col-12 px-0">
											<div className="card-body overflow-auto">
												{/*model.messages && _.map(model.messages, (item, key, arr)=>{
												return (
													<div className={`row mb-3 ${(item.user_id == user._id ? 'justify-content-end text-right' : 'justify-content-start')}`}>
												      <div className="col-auto">
												        <div className={`card ${(item.user_id == user._id ? 'bg-primary text-white' : 'justify-content-start bg-light')}`}>
												          <div className="card-body p-2">
												            <p className="mb-0">
												              {item.message}
												            </p>
												            <div>
												              <small className="opacity-60">{moment(item.date).format('h:mma')}</small>
												            </div>
												          </div>
												        </div>
												      </div>
												    </div>
												)
												})*/}
											</div>
										</div>
									]}
									footer={[
							          	<div className="col-12 bg-light">
								            <Form name={'orderMessages'} className="d-flex align-items-center">
								              <div className="input-group input-group-lg">

								                <input className="form-control" type="text" placeholder="Type a message" name="message" />
								              </div>
								              <button className="btn btn-link pr-0" type='submit'>
								                <span className="h3">💌</span>
								              </button>
								            </Form>
							          	</div>
							     	]}
								/>
							</div>
						</form>

					)
			}}/>
		]

	}
}
