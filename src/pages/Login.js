import React from 'react'
import { connect } from 'react-redux'
import { Form, Field } from "react-final-form"
import { FORM_ERROR } from "final-form"

import Navbar from '../components/Page/Navbar'
import Section from '../components/Page/Section'
import Overline from '../components/Typography/Overline'

import { getLocation, redirect } from '../actions/index'
import * as User from '../actions/user'
import * as Messages from '../actions/messages'

import { postData } from '../utils'

@connect((store)=>{
	return {
		user: store.user,
		messages: store.messages,
		location: store.location,
	}
})

export default class Login extends React.Component {
	constructor(props){
		super(props)
		window.addEventListener("resize", this.update)
	}

	state = {
	 height: 0,
	 width: 0
	}

	componentDidMount = async () => {
		let { props } = this
		let { dispatch } = props

		let authToken = await User.authToken({ dispatch })
		if(!_.isEmpty(authToken)){
			dispatch({ type: 'ACCOUNT' })
		}

		this.update()
	}

	update = () => {
		this.setState({
			height: window.innerHeight,
			width: window.innerWidth
		})
	}

	authenticate = async (fields) => {
		let { props } = this
		let { dispatch } = props

		let login = await postData(`/api/customer/login`, fields)
		if(login.response === 200){
			User.authToken({ dispatch })
			dispatch({ type: 'ACCOUNT' })
		}
		else {
			  Messages.set('Login', { type: 'danger', message: 'Login failed.'}, dispatch)
		}
	}

	onSubmit = async values => {
		await this.authenticate(values)
	}

	render(){
		let { props } = this
		let { location, messages } = props
		let { base, page, method, params } = getLocation(location)
		let backgroundImage = this.state.width >= 768 ? `/img/shop/LoginSide.png` : ''

		console.log('LOCATION', getLocation(location))
		return [
		    <Navbar/>,
        <Section className={`flex-fill px-5 align-items-center d-flex`} Name={`hero`} BackgroundColor={`#ffffff`} BackgroundImage={backgroundImage} BackgroundSize={`contain`} BackgroundPosition={`25% center`} Height={`50rem`}>
					<div className={`col-12 col-md-3 offset-md-6`}>
						<Overline>
							Customer
						</Overline>
						<h1 className="d-flex flex-row font-weight-light">
							 Sign In
						</h1>
						<Form
				      onSubmit={this.onSubmit}
				      validate={values => {
				        const errors = {};
				        if (!values.username) {
				          errors.username = "Required";
				        }
				        if (!values.password) {
				          errors.password = "Required";
				        }
				        return errors;
				      }}
				      render={({
				        submitError,
				        handleSubmit,
				        reset,
				        submitting,
				        pristine,
				        values
				      }) => (
				        <form onSubmit={handleSubmit}>
									{messages.Login && <div className={`alert alert-${messages.Login.type}`}>{messages.Login.message}</div>}
									<div className="form-row my-4">
										<div className="form-group col-12">
											<Field name="username">
												{({ input, meta }) => [
														<input {...input} type="text" className='form-control' placeholder="Username" />,
														(meta.error || meta.submitError) &&
														meta.touched && <span>{meta.error || meta.submitError}</span>
												]}
											</Field>
										</div>
										<div className="form-group col-12">
											<Field name="password">
												{({ input, meta }) => [
														<input {...input} type="password" className='form-control' placeholder="Password" />,
														meta.error && meta.touched && <span>{meta.error}</span>
												]}
											</Field>
										</div>
										<div className="form-group col-12 mb-4">
											<button type='submit' className='form-control btn btn-primary btn-lg text-uppercase shadow'>
												<i className="fas fa-key"></i> &nbsp; Login
											</button>
										</div>
										<div className="col-12 d-flex justify-content-between">
												<a href={`/register`}>Register Account</a> <a href="/forgotPassword">Forgot Password</a>
										</div>
									</div>
				        </form>
				      )}
				    />
					</div>
				</Section>
		]
	}
}