import React from 'react'

import * as _ from 'lodash'


import Navbar from '../Navbar'
import { Form, Input } from '../Form'
import { postData } from '../../utils'
import { connect } from 'react-redux'
import * as User from '../../actions/user'


@connect((store)=>{
	return {
		forms: store.forms
	}
})

export default class Register extends React.Component {
	constructor(props){
		super(props)
	}
	
	componentDidUpdate = async () => {
		let { forms, dispatch } = this.props

		let didSubmit = Form.didSubmit({ name: 'forgotPassword', form: forms['forgotPassword']})

		if(didSubmit){
			let forgotPassword = await User.forgotPassword(forms['forgotPassword'].inputs)
			if(forgotPassword.response === 200){
				console.log('it worked.')
				Form.set({ name: 'forgotPassword', inputs: {}, status: 'success', message: 'An link was sent to your email to reset your password.', dispatch })

			}
		}
	}

	render(){
		let { forms } = this.props
		console.log('register', this.props)

		return (
			<div className={`shop page page-forgotPassword`} style={{ background: 'url(/img/admin/bg/beach_enjoy.jpg) center center / cover no-repeat'}}>
		      <Navbar />
				<div className={`section-container`}>
					<div className={`col-5 offset-7 h-100 d-flex flex-column align-items-end`}>
						<h1 className="text-center text-white d-flex flex-row justify-content-center">
							Forgot Password <span className='h3 mb-0 ml-2' style={{ alignSelf: 'center' }}>❤️</span>
						</h1>
						<h5 className="text-center mb-4" style={{ color: '#eaeaea', fontWeight: '300' }}>Sign up for an account to continue</h5>
						<Form name={'forgotPassword'}>
							<div className="form-row my-4">
								{forms && forms['forgotPassword'] && forms['forgotPassword'].status === 'success' && (
									<div className='form-group col-12'>
										<div className='alert alert-success text-center'>
											{forms['forgotPassword'].message}
										</div>
									</div>
								)}
								<div className={`form-group col-12 ${_.has(forms, 'forgotPassword.status') && forms['forgotPassword'].status === 'success' ? 'disabled' : ''}`}>
									<Input type='text' name='email' placeholder='Enter email' className='input-material' />
								</div>
								<div className={`form-group col-12 ${_.has(forms, 'forgotPassword.status') && forms['forgotPassword'].status === 'success' ? 'disabled' : ''}`}>
									<button type='submit' className='form-control input-material'>Submit</button>
								</div>


								<div className="col-12 d-flex justify-content-between px-0">
							  		<a href={`/login`} style={{ color: '#ceedff' }}>Account Login</a> <a href="/register" style={{ color: '#ceedff' }}>Register Account</a>
							  	</div>
							</div>
						</Form>
					</div>
				</div>
			</div>
		)
	}
}
