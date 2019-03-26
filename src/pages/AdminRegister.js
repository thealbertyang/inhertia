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
		messages: store.messages,
	}
})

export default class Register extends React.Component {
	constructor(props){
		super(props)
		window.addEventListener("resize", this.update)
	}

	state = {
	 height: 0,
	 width: 0
	}

	componentDidMount = async () => {
		this.update()
	}

	update = () => {
		this.setState({
			height: window.innerHeight,
			width: window.innerWidth
		})
	}

	register = async (fields) => {
		let { props } = this
		let { dispatch } = props

		let login = await postData(`/api/user/register`, fields)
		if(login.response === 200){
			User.authToken({ dispatch })
			dispatch({ type: 'ADMIN' })
		}
		else {
			Messages.set('Register', { type: 'danger', message: login.message }, dispatch)
		}
	}

	onSubmit = async values => {
		await this.register(values)
	}

	render(){
		let { props } = this
		let { messages, location } = props
		let { base, page, method, params } = getLocation(location)
		let backgroundImage = this.state.width >= 768 ? `/img/shop/RegisterSide.png` : ''

		return [
		  	<Navbar />,
				<Section className={`flex-fill px-5 align-items-center d-flex`} Name={`hero`} BackgroundColor={`#ffffff`} BackgroundImage={backgroundImage} BackgroundSize={`contain`} BackgroundPosition={`25% center`} Height={`50rem`}>
					<div className={`col-12 col-md-3 offset-md-6`}>
						<Overline>
							Customer
						</Overline>
						<h1 className="d-flex flex-row font-weight-light">
							 Register
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
									{messages.Register && <div className={`alert alert-${messages.Register.type}`}>{messages.Register.message}</div>}
									<div className="form-row my-4">
										<div className="form-group col-6">
											<Field name="username">
												{({ input, meta }) => [
														<input {...input} type="text" className='form-control' placeholder="Username" />,
														(meta.error || meta.submitError) &&
														meta.touched && <span>{meta.error || meta.submitError}</span>
												]}
											</Field>
										</div>
										<div className="form-group col-6">
											<Field name="email">
												{({ input, meta }) => [
														<input {...input} type="email" className='form-control' placeholder="Email" />,
														(meta.error || meta.submitError) &&
														meta.touched && <span>{meta.error || meta.submitError}</span>
												]}
											</Field>
										</div>
										<div className="form-group col-6">
											<Field name="first_name">
												{({ input, meta }) => [
														<input {...input} type="text" className='form-control' placeholder="First Name" />,
														(meta.error || meta.submitError) &&
														meta.touched && <span>{meta.error || meta.submitError}</span>
												]}
											</Field>
										</div>
										<div className="form-group col-6">
											<Field name="last_name">
												{({ input, meta }) => [
														<input {...input} type="text" className='form-control' placeholder="Last Name" />,
														(meta.error || meta.submitError) &&
														meta.touched && <span>{meta.error || meta.submitError}</span>
												]}
											</Field>
										</div>
										<div className="form-group col-6">
											<Field name="password">
												{({ input, meta }) => [
														<input {...input} type="password" className='form-control' placeholder="Password" />,
														meta.error && meta.touched && <span>{meta.error}</span>
												]}
											</Field>
										</div>
										<div className="form-group col-6">
											<Field name="password_confirm">
												{({ input, meta }) => [
														<input {...input} type="password" className='form-control' placeholder="Re-type Password" />,
														meta.error && meta.touched && <span>{meta.error}</span>
												]}
											</Field>
										</div>
										<div className="form-group col-12 mb-4">
											<button type='submit' className='form-control btn btn-primary btn-lg text-uppercase shadow'>
												<i className="fas fa-key"></i> &nbsp; Register
											</button>
										</div>
										<div className="col-12 d-flex justify-content-between">
												<a href={`/admin/login`}>Account Login</a> <a href="/forgotPassword">Forgot Password</a>
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
