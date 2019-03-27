import React from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'

import { Form, Field } from "react-final-form"

import Navbar from '../components/Page/Navbar'
import Overline from '../components/Typography/Overline'
import Section from '../components/Page/Section'

import * as User from '../actions/user'
import * as Messages from '../actions/messages'
import { postData } from '../utils'

@connect((store)=>{
	return {
		messages: store.messages
	}
})

export default class ForgotPassword extends React.Component {
	constructor(props){
		super(props)
		window.addEventListener("resize", this.update)
	}

	state = {
	 height: 0,
	 width: 0
	}

	componentDidMount = () => {
		this.update()
	}

	update = () => {
		this.setState({
			height: window.innerHeight,
			width: window.innerWidth
		})
	}

	//await User.forgotPassword(forms['forgotPassword'].inputs)

	onSubmit = async values => {
		let user = await User.forgotPassword(values)
		if(user.response === 200){
			Messages.set('ForgotPassword', { type: 'success', message: 'Success! Check your email to reset your password.'}, this.props.dispatch)
		}
		else {
			Messages.set('ForgotPassword', { type: 'danger', message: 'Could not reset your password. Check if you entered the right email.' }, this.props.dispatch)
		}
	}

	render(){
		let { messages } = this.props
		console.log('register', this.props)
		let backgroundImage = this.state.width >= 768 ? `/img/shop/LoginSide.png` : ''

		return [
			<Navbar/>,
			<Section className={`flex-fill px-5 align-items-center d-flex`} Name={`hero`} BackgroundColor={`#ffffff`} BackgroundImage={backgroundImage} BackgroundSize={`contain`} BackgroundPosition={`25% center`} Height={`50rem`}>
				<div className={`col-12 col-md-3 offset-md-6`}>
					<Overline>
						Customer
					</Overline>
					<h1 className="d-flex flex-row font-weight-light">
						 Password
					</h1>
					<Form
						onSubmit={this.onSubmit}
						validate={values => {
							const errors = {};
							if (!values.email) {
								errors.email = "Required";
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
								{messages.ForgotPassword && <div className={`alert alert-${messages.ForgotPassword.type}`}>{messages.ForgotPassword.message}</div>}
								<div className="form-row my-4">
									<div className="form-group col-12">
										<Field name="email">
											{({ input, meta }) => [
													<input {...input} type="email" className='form-control' placeholder="Enter email" />,
													(meta.error || meta.submitError) &&
													meta.touched && <div className='mt-2'>{meta.error || meta.submitError}</div>
											]}
										</Field>
									</div>
									<div className="form-group col-12 mb-4">
										<button type='submit' className='form-control btn btn-primary btn-lg text-uppercase shadow'>
											<i className="fas fa-key"></i> &nbsp; Retrieve
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
