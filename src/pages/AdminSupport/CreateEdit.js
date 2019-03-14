import React from 'react'
import { connect } from 'react-redux'

import * as _ from 'lodash'

import Card from '../../components/Admin/Card'
import Header from '../../components/Admin/Header'

import { Form, Input, Password, List, ImageUpload, Select, CheckList } from '../../components/Form'

import { fetchData, postData } from '../../utils'
import { getLocation, redirect } from '../../actions/index'
import Models from '../../actions/models'
import moment from 'moment'
import Pagination from "react-js-pagination"

@connect((store)=>{
	return {
		forms: store.forms,
		user: store.user,
		models: store.models,
		location: store.location,
	}
})
export default class CreateEdit extends React.Component {
	constructor(props){
		super(props)
	}

	convertModelToInputs = (modelData) => {
		let inputs = _.mapValues(modelData, (v,k)=>{
	        return ({ value: v })
  		})
		return ({...inputs})
	}

	componentDidMount = async () => {
		let { props } = this
		let { location, forms, dispatch } = props
		let { base, page, method, params } = getLocation(location)
		let id = params[0]

		if(!_.has(forms, 'ticket') && method === 'edit'){
			let model = await this.fetchModel(id)
			if(model.response === 200){

				let inputs = {
					status: '',
					type: '',
					assigned_user_id: '',
					user_id: '',
					log: [],
				}

				inputs = _.mapValues(inputs, (v,k)=>{
			        return ({ value: v })
		  		})
				inputs = { ...inputs, ...this.convertModelToInputs(model.data)}

				Form.set({ name: 'ticket', inputs, dispatch })
			}
		}
		else if(!_.has(forms, 'ticket') && method === 'create'){

				let inputs = {
					status: '',
					type: '',
					assigned_user_id: '',
					user_id: '',
					log: [],
				}

				inputs = _.mapValues(inputs, (v,k)=>{
			        return ({ value: v })
		  		})

				Form.set({ name: 'ticket', inputs, dispatch })
		}
	}

	fetchModel = async (id) => {
		return await fetchData(`/api/ticket/${id}`)
	}

	updateModel = async (id, fields) => {
		return await postData(`/api/ticket/update/${id}`, fields)
	}

	createModel = async (fields) => {
		return await postData(`/api/ticket/create`, fields)
	}

	componentDidUpdate = async () => {
		let { props } = this
		let { location, forms, dispatch } = props
		let { base, page, method, params } = getLocation(location)
		let id = params[0]

		let didSubmit = Form.didSubmit({ name: 'ticket', form: forms['ticket'] })
		if(didSubmit){
			if(method === 'edit'){
				let model = await this.updateModel(id, forms['ticket'].inputs)
				if(model.response === 200){
					Form.set({ name: 'ticket', inputs: this.convertModelToInputs(model.data), status: 'success', message: 'Successfully saved.', dispatch })
				}
				else {
					Form.set({ name: 'ticket', inputs: model.data, status: 'error', message: 'Error with saving.', dispatch })
				}
			}
			else if(method === 'create') {
				let model = await this.createModel(forms['ticket'].inputs)
				if(model.response === 200){
					dispatch(redirect('ADMIN', page))
				}
				else {
					Form.set({ name: 'ticket', inputs: model.data, status: 'error', message: 'Error with saving.', dispatch })
				}
			}
		}
	}

	postReply = (e) => {
		e.preventDefault()
		this.setState({ postReply: 'on' })
	}

	replyTicket = async (e) => {
		e.preventDefault()

		let { props } = this
		let { user, forms, models, location, dispatch } = props
		let { base, page, method, params } = getLocation(location)

/*
	    let hasRoles = _.has(user,'roles') && ((_.indexOf(user.roles, 'admin') > -1)  || (_.indexOf(user.roles, 'customer') > -1) || (_.indexOf(user.roles, 'guest') > -1)  || (_.indexOf(user.roles, 'support') > -1))
*/

		if(_.has(user, '_id')){
			let message = Form.fetchOne({ replyTicket: 'message' }, forms).value
			let fields = Form.fetchAll({ formName: 'ticket', forms})

			if(_.has(fields, 'log.value')){
				fields.log.value.push({
					user_id: user._id,
					user,
		         	kind: 'message',
		          	message,
		          	status: '',
		          	date: Date.now(),
				})
			}
			else {
				fields =
				{
					log: {
						value: [{
							user_id: user._id,
							user,
				         	kind: 'message',
				          	message,
				          	status: '',
				          	date: Date.now(),
          				}]
          			}
          		}
			}

			Form.set({ name: 'ticket', inputs: fields, message: '', status: '', dispatch })
		}
	//	if(_.has(models,'ticket.user_id')){
			//let ticket = await postData(`/api/ticket/update/${method}/messages`, { ...fields, user_id: { value: models.ticket.user_id } })
			//if(ticket.response === 200){
				//Models.set('ticket', ticket.data, dispatch)
			//}
		//}

	}

	handlePagination = (pageNumber) => {
		this.setState({ log: pageNumber })
	}

	render() {
		let { props } = this
		let { user, location, forms, models, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		return [
			<div className="crud container px-0">
				<Form name='ticket' className="row">
					<div className='col-12'>
						{forms['ticket'] && forms['ticket'].status == 'success' && <div className="alert alert-success text-left d-flex align-items-center mb-5" role="alert"><i className="material-icons">done</i>{forms['ticket'].message}</div>}
					</div>
					<div className="col-8">
						{_.has(forms,'ticket.inputs.log.value') && !_.isEmpty(forms.ticket.inputs.log.value) &&
							[
							<div>
								<h3>{forms.ticket.inputs.log.value[0].message.substring(0,40)}</h3>
								{forms.ticket.inputs.log.value[0].kind !== 'system' ? (<p className='mb-0'>{forms.ticket.inputs.log.value[0].user.first_name} {forms.ticket.inputs.log.value[0].user.last_name} | {forms.ticket.inputs.log.value[0].user.username} </p>) :
								(<p className='mb-0'>System</p>)
								}
								<p className='mb-0'>{moment(forms.ticket.inputs.log.value[0].date).format('MMMM Do YYYY • h:mma')}</p>
								<p><span className='badge badge-primary'>{forms.ticket.inputs.type.value}</span></p>
								<p className='text-secondary'>{forms.ticket.inputs.log.value[0].message}</p>
							</div>,
							<hr className='my-5'/>
							]
						}



							<div className='card'>
								<div className='card-header'>
									<div className='row'>
										<div className='col-6 d-flex flex-row align-items-center'>
											{_.capitalize(method)}
										</div>
										<div className='col-6 d-flex flex-row justify-content-end'>
											<a href='#' className='btn btn-secondary' onClick={e=>this.postReply(e)}>Post A Reply</a>
										</div>
									</div>
								</div>
								{_.has(this, 'state.postReply') && this.state.postReply === 'on' &&
									<div className='card-body border-bottom'>
										<Form name='replyTicket'>
											<div className='form-row'>
												<div className="form-group col-12">
													<div className="input-group">
														<Input type="text" name='message' placeholder='Message'/>
														<div className="input-group-append">
															<a href='#' className='btn btn-outline-success d-flex flex-row align-items-center' onClick={e=>this.replyTicket(e)}>
																<i className='material-icons'>add</i>
															</a>
														</div>
													</div>
												</div>
											</div>
										</Form>
									</div>}

								{
									(_.has(forms,'ticket.inputs.log.value') && forms.ticket.inputs.log.value.length > 1) ?
									_.map(_.reverse(forms.ticket.inputs.log.value.slice()), (item, key, arr)=>{
											let page = _.has(this,'state.log') ? this.state.log : 1
										 	if(key !== (arr.length - 1) && ((key + 1) >= ((page * 10) - 9 )) && ((key + 1) <= (page * 10)) ){
												return (
													<div className='card-body'>
														<div className='row'>
												 			<div className='col-12'>
																{item.kind === 'system' ? (<h5></h5>) : [<h5>{item.user.first_name} {item.user.last_name}</h5>,
																<h6>{_.includes(item.user.roles, 'guest') ? 'Guest' : 'Support'} </h6>]}
																<p>
																	{item.message}
																</p>
															</div>
															<div className='col-12'>
																{moment(item.date).format('MMMM Do YYYY • h:mma')}
															</div>
														</div>
													</div>
												 )
										 	}
										})
									:
									(
										<div className='card-body'>
											<p className='mb-0'>No replies yet. Please response to the customer within 24 hours.</p>
										</div>
									)
								}

								{(_.has(forms,'ticket.inputs.log.value') && forms.ticket.inputs.log.value.length > 1) &&
								<div className='card-body border-top'>
									<div className='row'>
										<div className='col-6'>
										</div>
										<div className='col-6 d-flex flex-row justify-content-end'>
											<Pagination
									          activePage={_.has(this,'state.log') ? this.state.log : 1}
									          itemsCountPerPage={10}
									          totalItemsCount={forms.ticket.inputs.log.value.length}
									          pageRangeDisplayed={5}
									          onChange={(e)=>this.handlePagination(e)}
									          itemClass={`page-item`}
									          linkClass={`page-link`}
									          innerClass={`pagination`}
									        />
										</div>
									</div>
								</div>}
							</div>

					</div>
					<div className='col-4'>
						<div className='card'>
							<div className='card-header'>
								<div className='row'>
									<div className='col-6 mb-0'>
										{_.capitalize(method)}
									</div>
								</div>
							</div>
							<div className='card-body'>
								<div className='row'>
								{method === 'create' &&
									<div className="form-group col-12">
										<Input type='text' name={`user_id`} label={`For User`} />
									</div>}
									<div className="form-group col-12">
										<Input type='text' name={`assigned_user_id`} label={`${method === 'edit' ? 'Re-Assign' : 'Assign'} To`} />
									</div>
									<div className="form-group col-12">
										<Select name={`type`} label='Type' options={{ Order: 'order', Account: 'account', Advertise: 'advertise', Influence: 'influence', Other: 'other' }} />
									</div>
									<div className="form-group col-12">
										<Select name={`status`} label='Status' options={{ Pending: 'pending', 'Doing': 'processing', Reviewing: 'reviewing', 'Resolved': 'resolved' }} />
									</div>
								</div>
							</div>
							<div className='card-footer'>
								<div className='form-row'>
									<div className="form-group col-6">
								  		<button type="submit" className="btn btn-block btn-success">Submit</button>
								  	</div>
									<div className="form-group col-6">
								  		<a href={`/${base}/${page}`} className="btn btn-block text-secondary bg-light btn-medium">Cancel</a>
								  	</div>
								</div>
							</div>
						</div>
					</div>
				</Form>
			</div>
		]
	}
}
