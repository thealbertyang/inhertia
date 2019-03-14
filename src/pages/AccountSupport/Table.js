import React from 'react'
import { connect } from 'react-redux'

import * as _ from 'lodash'
import moment from 'moment'

import { Form, Input } from '../../components/Form'
import { fetchData, postData } from '../../utils'
import * as Models from '../../actions/models'
import { getLocation } from '../../actions/index'

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
export default class Table extends React.Component {
	constructor(props){
		super(props)
	}

	loadTickets = async () => {
		let { props } = this
		let { user, dispatch } = props

		console.log('USER', user)
		let tickets = await fetchData(`/api/tickets/user/${user._id}`)
		if(tickets.response === 200){
			await Models.set('tickets', tickets.data, dispatch)
		}
		console.log('this.props', this.props)
	}

	componentDidMount = () => {
		let { props } = this
		let { models } = props
		if(!_.has(models, 'tickets')){
			this.loadTickets()
		}
	}

	componentDidUpdate = async (prevProps) => {
		if(!_.isEqual(prevProps.user, this.props.user) && this.props.user.customer){
			await this.loadTickets()
		}
	}

	render() {
		let { props } = this
		let { models, location } = props
		let { base, page, method } = getLocation(location)
		return [
			<div className="row">
				<div className='col-6'>
					<h3>Support</h3>
					<h5 className='font-weight-normal text-secondary'>Get help for your orders, account and others.</h5>
				</div>
			</div>,
			<Form name={`search`}>
	        	<div className="form-group d-flex justify-content-end mb-4 search">
					<Input name='term' style={{ width: '10rem' }} placeholder={`Search orders`} /><button className="btn btn-outline-success d-flex align-items-center" type="submit"><i className='material-icons'>search</i></button>
				</div>
			</Form>,
			<div className='row mt-4'>
				<div className='col-9'>
					<div className="table-responsive">
						<table className="table table-hover table-striped mb-0">
							<thead>
								<tr>
									<td>Question</td>
									<td>Type</td>
									<td>Created</td>
									<td>Last Reply</td>
									<td>Actions</td>
								</tr>
							</thead>
							<tbody>
								{
									_.has(models,'tickets')
								?
									(
										_.map(models.tickets, (item, key, arr)=> {
											return (
												<tr>
													<td>{item.log[0] && item.log[0].message && item.log[0].message.substring(0, 40)}</td>
													<td>{item.type}</td>
													<td>{moment(item.date).format('MMMM Do YYYY • h:mma')}</td>
													<td></td>
													<td>
														<a href={`/account/support/ticket/${item._id}`}>
															View
														</a>
													</td>
												</tr>
											)
										})
									)
								:
									(
										<tr>
											<td>
											</td>
										</tr>
									)
								}
							</tbody>
						</table>
					</div>
				</div>
				<div className='col-3 text-right'>
					<ul className='no-style'>
						<li>All</li>
						<li>Orders</li>
						<li>Account</li>
						<li>Other</li>
					</ul>
					<a href='#' className='btn btn-outline-success' onClick={(e)=>{ this.deleteAllWishlist(e) }}>Create Ticket</a>
				</div>
			</div>
		]
	}

}
