import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import Sidebar from '../Support/Sidebar'
import { getLocation } from '../../actions/index'
import { Form, Input, Select } from '../../components/Form'
@connect((store)=>{
	return {
		forms: store.forms,
		location: store.location,
	}
})
export default class Contact extends React.Component {
	constructor(props){
		super(props)
	}

	findTicket = (e) => {
		e.preventDefault()
		let { props } = this
		let { forms } = props

		let id = Form.fetchOne({ findTicket: 'ticket_id' }, forms).value
		window.location.href = '/support/ticket/'+id
	}

	render() {
		let { props } = this
		let { location, dispatch } = props
		let { base, page, method, params } = getLocation(location)
		return [
				<div className='row'>

					<div className='col-9'>
						<div className='row'>
							<div className='col-12 mt-5'>
								<h5>Support</h5>
								<h2>Contact Us</h2>
							</div>
							<div className='col-12'>
					    		<hr className='my-5' />
					    	</div>

							<div className='col-5'>


								<p>We are available Monday to Friday 9 - 5.</p>

								<p>We are unavailable for holidays including..</p>

								<p>Enter your support ticket ID to resume a previous ticket, or create a ticket with the button</p>
								<p>You'll receive a support ticket ID once you submit your inquiry.</p>

							</div>
							<div className='col-7'>
								<Form name='findTicket'>
									<div className='form-row'>
										<div className="form-group col-12">
											<div className="input-group">
												<Input type='text' name='ticket_id' placeholder='Support Ticket ID' />
												<div className="input-group-append">
													<a href='#' className='btn btn-outline-success d-flex flex-row align-items-center' onClick={e=>this.findTicket(e)}>
														<i className='material-icons'>search</i>
													</a>
												</div>
											</div>
										</div>
									</div>
									<hr/>
								</Form>

								<Form name='createTicket'>
									<a href='/support/ticket/create' className='btn btn-outline-success btn-sm'>Create Ticket</a>
								</Form>
							</div>


							<div className='col-12'>
								<hr className='my-5'/>
							</div>


						</div>
					</div>


					<div className='col-3'>
						<Sidebar/>
					</div>

				</div>
		]
	}

}
