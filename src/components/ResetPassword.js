import React from 'react'
import Navbar from './Navbar'
import { Form, Input } from './Form'
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

		return (
			<div className={`shop page page-login`} style={{ background: 'url(/img/admin/bg/beach_enjoy.jpg) center center / cover no-repeat'}}>
		      <Navbar />
				<div className={`section-container`}>
					<div className={`col-5 offset-7 h-100 d-flex flex-column align-items-end`}>
						<h1 className="text-center text-white d-flex flex-row justify-content-center">
							Reset Password <span className='h3 mb-0 ml-2' style={{ alignSelf: 'center' }}>❤️</span>
						</h1>
						<h5 className="text-center mb-4" style={{ color: '#eaeaea', fontWeight: '300' }}>Sign up for an account to continue</h5>
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
				</div>
			</div>
		)
	}
}
