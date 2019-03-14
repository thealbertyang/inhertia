import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import Sidebar from '../Support/Sidebar'
import { getLocation } from '../../actions/index'
import { postData } from '../../utils'
import { Form, Input, Select } from '../../components/Form'


@connect((store)=>{
	return {
		user: store.user,
		forms: store.forms,
		location: store.location,
	}
})
export default class Create extends React.Component {
	constructor(props){
		super(props)
	}

	createTicket = async (e) => {
		e.preventDefault()
		let { props } = this
		let { user, forms } = props


		let fields = Form.fetchAll({ formName: 'createTicket', forms })

		if(_.has(user,'_id')){
			fields['user_id'] = { value: user._id }
		}

		let create = await postData(`/api/ticket/create`, fields)
		if(create.response === 200){
			window.location.href = '/support/ticket/'+create.data._id
		}
	}

	render() {
		let { props } = this
		let { user, location, dispatch } = props
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
									<Input type='text' name='ticket_id' placeholder='Support Ticket ID' />
									<hr/>
								</Form>

								<Form name='createTicket'>
									<div className='form-row'>
										{!_.has(user,'_id') ? [
										<div className="form-group col-6">
											<Input type='text' name='first_name' placeholder='First Name' />
										</div>,
										<div className="form-group col-6">
											<Input type='text' name='last_name' placeholder='Last Name' />
										</div>,
										<div className="form-group col-6">
											<Input type='email' name='email' placeholder='Email' />
										</div>,
										]
										:
										(
											<div className='col-6'>
												{user.first_name+' '+user.last_name}
											</div>
										)
										}
										<div className="form-group col-6 d-flex">
											<Select name='type' options={{ Account: 'account', Order: 'Order', Advertise: 'advertise', Influence: 'influence', Other: 'other' }}/>
										</div>

										<div className="form-group col-12">
											<Input type='message' name='message' placeholder='Message' />
										</div>
										<div className="form-group col-6">
											<a href='#' className='btn btn-outline-success btn-sm' onClick={e=>this.createTicket(e)}>Create Ticket</a>
										</div>
									</div>
								</Form>
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
