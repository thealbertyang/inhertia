import React from 'react'
import Navbar from '../Navbar'
import { postData } from '../../utils'
import { getLocation, redirect } from '../../actions/index'
import * as User from '../../actions/user'
import { Form, Input } from '../Form'
import { connect } from 'react-redux'


@connect((store)=>{
	return {
		forms: store.forms,
		user: store.user,
		location: store.location,
		jwtToken: store.jwtToken,
	}
})

export default class Login extends React.Component {
	constructor(props){
		super(props)
	}

	auth = async () => {
		let { props } = this
		let { dispatch, forms } = props

		console.log('did we get in here?')
		let login = await postData(`/api/user/login`, forms['login'].inputs)
		if(login.response === 200){
		console.log('did we get in here? logun,', login)
			Form.set({ name: 'login', inputs: forms['login'].inputs, status: '', message: '', dispatch })
			await User.authToken({ dispatch })
			await dispatch({ type: 'ADMIN' })
		}
		else {
			Form.set({ name: 'login', inputs: forms['login'].inputs, status: 'error', message: login.message, dispatch })
		}
	}

	componentDidUpdate = () => {
		let { props } = this
		let { forms } = props

		console.log('this.props', this.props)
		Form.didSubmit({ name: 'login', form: forms['login'] }) && this.auth()
	}


	render(){
		let { props } = this
		let { forms, location, dispatch } = props
		let { base, page, method, params } = getLocation(location)
		console.log('login', this.props)
		let inputs = forms['login'] && forms['login'].inputs

		return (
			<div className={`shop page page-login`} style={{ background: 'url(/img/admin/bg/beach_stare.jpg) center center / cover no-repeat'}}>
		      <Navbar />
				<div className={`section-container`}>
					<div className={`col-5 offset-7 h-100 d-flex flex-column align-items-end`}>
						<h1 className="text-center text-white d-flex flex-row justify-content-center">
							Welcome back <span class='h3 mb-0 ml-2' style={{ alignSelf: 'center' }}>👋</span>
						</h1>
						<h5 className="text-center mb-4" style={{ color: '#eaeaea', fontWeight: '300' }}>Log in to your account to continue</h5>
						
						<Form name={'login'}>
							<div className="form-row my-4">
								{forms && forms['login'] && forms['login'].status === 'error' && (
									<div className='form-group col-12'>
										<div className='alert alert-danger text-center'>
											{forms['login'].message}
										</div>
									</div>
								)}
								<div className="form-group col-12">
									<Input type='text' name='username' placeholder='Enter username' className='input-material' />
								</div>
								<div className="form-group col-12">
									<Input type='password' name='password' placeholder='Enter password' className='input-material' />
								</div>
								<div className="form-group col-12">
									<button type='submit' className='form-control input-material'>Submit</button>
								</div>

								<div className="col-12 d-flex justify-content-between px-0">
							  		<a href={`/${base}/register`} style={{ color: '#ceedff' }}>Register Account</a> <a href={`/${base}/forgotPassword`} style={{ color: '#ceedff' }}>Forgot Password</a>
							  	</div>
							</div>
						</Form>
					</div>
				</div>
			</div>
		)
	}
}
