import React from 'react'
import Navbar from '../Navbar'
import { postData } from '../../utils'
import * as User from '../../actions/user'
import { Form, Input } from '../Form'
import { connect } from 'react-redux'


@connect((store)=>{
	return {
		forms: store.forms,
		user: store.user,
		jwtToken: store.jwtToken,
	}
})

export default class Register extends React.Component {
	constructor(props){
		super(props)
	}

	componentDidUpdate = async () => {
		let { forms, dispatch } = this.props

		let didSubmit = Form.didSubmit({ name: 'register', form: forms.register})

		if(didSubmit){
			let register = await postData(`/api/user/register`, forms['register'].inputs)
			if(register.response === 200){
				await User.authToken({ dispatch })
				await this.props.dispatch({ type: 'ADMIN' })
			}
			else {
				Form.set({ name: 'register', inputs: forms['register'].inputs, status: 'error', message: register.message, dispatch })
			}
		}
	}

	render(){
		let { forms } = this.props
		console.log('register', this.props)
		let inputs = forms['register'] && forms['register'].inputs

		return (
			<div className={`shop page page-login`} style={{ background: 'url(/img/admin/bg/beach_enjoy.jpg) center center / cover no-repeat'}}>
		      <Navbar />
				<div className={`section-container`}>
					<div className={`col-5 offset-7 h-100 d-flex flex-column align-items-end`}>
						<h1 className="text-center text-white d-flex flex-row justify-content-center">
							Register <span className='h3 mb-0 ml-2' style={{ alignSelf: 'center' }}>❤️</span>
						</h1>
						<h5 className="text-center mb-4" style={{ color: '#eaeaea', fontWeight: '300' }}>Sign up for an account to continue</h5>
						<Form name={'register'}>
							<div className="form-row my-4">
								{forms && forms['register'] && forms['register'].status === 'error' && (
									<div className='form-group col-12'>
										<div className='alert alert-danger text-center'>
											{forms['register'].message}
										</div>
									</div>
								)}
								<div className="form-group col-6">
									<Input type='text' name='first_name' placeholder='Enter first name' className='input-material'/>
								</div>
								<div className="form-group col-6">
									<Input type='text' name='last_name' placeholder='Enter last name' className='input-material'/>
								</div>
								<div className="form-group col-6">
									<Input type='text' name='username' placeholder='Enter username' className='input-material'/>
								</div>
								<div className="form-group col-6">
									<Input type='text' name='email' placeholder='Enter email' className='input-material' />
								</div>
								<div className="form-group col-6">
									<Input type='password' name='password' placeholder='Enter password' className='input-material'/>
								</div>
								<div className="form-group col-6">
									<Input type='password' name='password_confirm' placeholder='Re-enter password' className='input-material'/>
								</div>
								<div className="form-group col-12">
									<button type='submit' className='form-control input-material'>Submit</button>
								</div>


								<div className="col-12 d-flex justify-content-between px-0">
							  		<a href={`/login`} style={{ color: '#ceedff' }}>Account Login</a> <a href="/forgotPassword" style={{ color: '#ceedff' }}>Forgot Password</a>
							  	</div>
							</div>
						</Form>
					</div>
				</div>
			</div>
		)
	}
}