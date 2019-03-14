import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import Sidebar from './Support/Sidebar'
import { getLocation } from '../actions/index'

@connect((store)=>{
	return {
		location: store.location,
	}
})
export default class Contact extends React.Component {
	constructor(props){
		super(props)
	}

	render() {
		let { props } = this
		let { location, dispatch } = props
		let { base, page, method, params } = getLocation(location)
		return [
			<div className="container py-5 my-5">
				<div className='row'>
					<div className='col-4'>
						<Sidebar/>
					</div>
					<div className='col-8'>
						<div className='row'>
							<div className='col-12'>
								<h3>Contact Us</h3>
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
								<input type='text' className='form-control' placeholder='Support Ticket ID' />
								<hr/>
								<input type='text' className='form-control' placeholder='First Name' />
								<input type='text' className='form-control' placeholder='Last Name' />
								<input type='text' className='form-control' placeholder='Email' />
								<select className='form-control'>
									<option>Account</option>
									<option>Orders</option>
									<option>Advertising</option>
									<option>Influencers</option>
									<option>Other</option>
								</select>
								<a href='#' className='btn btn-outline-success btn-sm'>Create Ticket</a>
							</div>


							<div className='col-12'>
								<hr className='my-5'/>
							</div>

							<div className='col-5 mb-4'>
								<h3>This is my question bro?</h3>
								<p className='mb-0'>Albert Yang</p>
								<p>28th February 2018 • 8:20am</p>
								<p><span className='badge badge-primary'>Advertising</span></p>
								<hr className='mt-5'/>
								<p className='text-secondary'>This is my question bro? This is a test I'm trying to see if my order has beeen shipped or not. I haven;t received any info on the advertising link or dashboard. Thanks.</p>
							</div>
							<div className='col-7'>
								<div className='card'>
									<div className='card-header'>
										<div className='row'>
											<div className='col-6'>
											</div>
											<div className='col-6 d-flex flex-row justify-content-end'>
												<a href='#' className='btn btn-secondary'>Post Reply</a>
											</div>
										</div>
									</div>

									<div className='card-body'>
										<div className='row'>
											<div className='col-12'>
												<h5>Helen Fraiser</h5>
												<h6>Support Team</h6>
												<p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
												</p>
											</div>
											<div className='col-12'>
												1st Dec 2017 • 10:15am
											</div>
										</div>

									</div>
								</div>

							</div>
						</div>
					</div>
				</div>
			</div>
		]
	}

}
