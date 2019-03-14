import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import Sidebar from '../Support/Sidebar'
import { getLocation } from '../../actions/index'
import { fetchData, postData } from '../../utils'
import * as Models from '../../actions/models'
import * as User from '../../actions/user'
import moment from 'moment'
import { Form, Input, Select } from '../../components/Form'

@connect((store)=>{
	return {
		models: store.models,
		user: store.user,
		location: store.location,
		forms: store.forms,
	}
})
export default class Ticket extends React.Component {
	constructor(props){
		super(props)
	}

	state = {
		postReply: 'off'
	}

	loadTicket = async () => {

		let { props } = this
		let { models, location, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		let ticket = await fetchData(`/api/ticket/${method}`)
		if(ticket.response === 200){
			Models.set('ticket', ticket.data, dispatch)
		}
		else {
			console.log('Ticket err', ticket)
		}
	}

	replyTicket = async (e) => {
		e.preventDefault()

		let { props } = this
		let { user, forms, models, location, dispatch } = props
		let { base, page, method, params } = getLocation(location)

/*
	    let hasRoles = _.has(user,'roles') && ((_.indexOf(user.roles, 'admin') > -1)  || (_.indexOf(user.roles, 'customer') > -1) || (_.indexOf(user.roles, 'guest') > -1)  || (_.indexOf(user.roles, 'support') > -1))
*/

		let fields = Form.fetchAll({ formName: 'replyTicket', forms})

		/*

			if logged in

			_.has(user, '_id')

		*/
		if(_.has(user, '_id')){
			let ticket = await postData(`/api/ticket/update/${method}/messages`, { ...fields, user_id: { value: user._id } })
			if(ticket.response === 200){
				Models.set('ticket', ticket.data, dispatch)
			}
		}
		else if(_.has(models,'ticket.user_id')){
			let ticket = await postData(`/api/ticket/update/${method}/messages`, { ...fields, user_id: { value: models.ticket.user_id } })
			if(ticket.response === 200){
				Models.set('ticket', ticket.data, dispatch)
			}
		}

	}

	postReply = (e) => {
		e.preventDefault()
		this.setState({ postReply: 'on' })
	}

	deleteMessage = (e, key) => {
		e.preventDefault()
		console.log('delete message', key)
	}

	componentDidMount = () => {
		let { props } = this
		let { models } = props

		if(!_.has(models, 'ticket')){
			this.loadTicket()
		}
	}

	render() {
		let { props } = this
		let { models, location, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		console.log('this.props', this.props)
		return [
				<div className='row'>

					<div className='col-9'>
						<div className='row'>
							<div className='col-12 mt-5'>
								<h5>Support</h5>
								<h2>Contact Us</h2>
							</div>

							<div className='col-12'>
								<hr className='my-5'/>
							</div>

							{
								!_.has(models, 'ticket')
								?
								(
									<div className='col-12'>
										There isn't a support ticket with this ID.
									</div>
								)
								:
								[
									<div className='col-12 mb-4'>
										<h3>{_.has(models, 'ticket') && models.ticket.log[0].message.substring(0, 40)}</h3>
										<p className='mb-0'>{_.has(models, 'ticket') && `${models.ticket.user.first_name} ${models.ticket.user.last_name}` }</p>
										<p>{_.has(models, 'ticket') && moment(models.ticket.log[0].data).format('MMMM Do YYYY • h:mma')}</p>
										<p><span className='badge badge-primary'>{_.has(models, 'ticket') && _.startCase(models.ticket.type)}</span></p>
										<p className='text-secondary'>{_.has(models, 'ticket') && models.ticket.log[0].message}</p>
									</div>,
									<div className='col-12'>
										<div className='card'>
											<div className='card-header'>
												<div className='row'>
													<div className='col-6'>
													</div>
													<div className='col-6 d-flex flex-row justify-content-end'>
														<a href='#' className='btn btn-secondary' onClick={e=>this.postReply(e)}>Post A Reply</a>
													</div>
												</div>
											</div>

											{_.has(this, 'state.postReply') && this.state.postReply === 'on' && <div className='card-body border-bottom'>
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

											<div className='card-body'>
												<div className='row'>
													{_.has(models, 'ticket') && models.ticket.log.length > 1
														?
														_.map(_.reverse(models.ticket.log.slice()), (item, key, arr)=>{
														 	if(key !== (models.ticket.log.length - 1)){
																return [
																 	<div className='col-8'>
																		{item.kind === 'system' ? (<h5></h5>) : [<h5>{item.user.first_name} {item.user.last_name}</h5>,
																		<h6>{_.includes(item.user.roles, 'guest') ? 'Guest' : 'Support'} </h6>]}
																		<p>
																			{item.message}
																		</p>
																		{moment(item.date).format('MMMM Do YYYY • h:mma')}
																	</div>,
																	<div className='col-4 d-flex flex-row justify-content-end'>
																		<a href='#' onClick={e=>this.deleteMessage(e, key)}>
																			<i className='material-icons'>delete</i>
																		</a>
																	</div>
																 ]
														 	}
														})
														 :
														(
															<div className='col-12'>
																<div className='border bg-light px-3 py-4'>
																	<p className='mb-0'>No replies yet. Please wait allow up to 24 hours for our customer representative team to get to you.</p>
																</div>
															</div>
													 	)
													}

												</div>

											</div>
										</div>
									</div>
								]

							}


						</div>
					</div>


					<div className='col-3'>
						<Sidebar/>
					</div>

				</div>
		]
	}

}
