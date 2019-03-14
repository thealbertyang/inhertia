import React from 'react'
import Navbar from './Navbar'
import { postData } from '../utils'
import { getLocation, redirect } from '../actions/index'
import * as User from '../actions/user'
import { Form, Input } from './Form'
import { connect } from 'react-redux'


@connect((store)=>{
	return {
		forms: store.forms,
		user: store.user,
		jwtToken: store.jwtToken,
		location: store.location,
	}
})

export default class VerifyEmail extends React.Component {
	constructor(props){
		super(props)
	}

	componentDidMount = async () => {
		let { props } = this
		let { location, dispatch } = props 
		let { page } = getLocation(location)

		console.log('page', page)

		let verifyEmail = await User.verifyEmail(page)
		if(verifyEmail.response === 200){
			dispatch(redirect('ACCOUNT'))
		}
		//User.logout(dispatch)
		//dispatch(redirect('LOGIN'))
	}

	render(){
		return (
			<div className={`shop page page-logout`}>
		      <Navbar />
				<div className={`section-container`}>
					<div className={`col-12 h-100 d-flex flex-column align-items-center`}>
						<h1 className="text-center text-white d-flex flex-row justify-content-center">
							Logging out. <span class='h3 mb-0 ml-2' style={{ alignSelf: 'center' }}>👋</span>
						</h1>
					</div>
				</div>
			</div>
		)
	}
}
