import React from 'react'
import Navbar from '../components/Page/Navbar'
import Section from '../components/Page/Section'
import Overline from '../components/Typography/Overline'

import { Form, Input } from '../components/Form'
import { getLocation, redirect } from '../actions/index'
import { postData } from '../utils'
import { connect } from 'react-redux'
import * as User from '../actions/user'


@connect((store)=>{
	return {
		forms: store.forms,
		location: store.location,
	}
})

export default class Register extends React.Component {
	constructor(props){
		super(props)
	}

	componentDidMount = async () => {
		/*

			if we have page token



		*/


	}

	componentDidUpdate = async () => {
		let { forms, location, dispatch } = this.props
		let { page } = getLocation(location)

		let didSubmit = Form.didSubmit({ name: 'resetPassword', form: forms['resetPassword']})

		if(didSubmit){
			let resetPassword = await User.resetPassword(page, forms['resetPassword'].inputs)
			if(resetPassword.response === 200){
				dispatch(redirect('LOGIN'))
			}
		}
	}

	render(){
		let { forms, location, dispatch } = this.props
		let { page } = getLocation(location)

		let resetPasswordToken = page
		console.log('register', this.props, !page)
		let inputs = forms['register'] && forms['register'].inputs

		return [
		      <Navbar />,
	        <Section className={`flex-fill px-5`} Name={`hero`} BackgroundColor={`#ffffff`} BackgroundImage={`/img/admin/bg/beach_enjoy.jpg`} BackgroundSize={`cover`} BackgroundPosition={`center center`} Height={`50rem`}>
					<div className={`col-4 offset-6 h-100 d-flex flex-column justify-content-center`}>
						<Overline className={`text-white-50`}>
							Forgot
						</Overline>
						<h1 className="text-white">
							Password
						</h1>

						{page && <Form name={'resetPassword'}>
							<div className="form-row my-4">
								<div className="form-group col-12">
									<Input type='text' name='password' placeholder='Enter password' className='input-material' />
								</div>
								<div className="form-group col-12">
									<Input type='text' name='password_confirm' placeholder='Confirm Password' className='input-material' />
								</div>
								<div className="form-group col-12">
									<button type='submit' className='form-control input-material'>Submit</button>
								</div>


								<div className="col-12 d-flex justify-content-between px-0">
							  		<a href={`/login`} style={{ color: '#ceedff' }}>Account Login</a> <a href="/register" style={{ color: '#ceedff' }}>Register Account</a>
							  	</div>
							</div>
						</Form>}
						</div>
					</Section>
		]
	}
}
