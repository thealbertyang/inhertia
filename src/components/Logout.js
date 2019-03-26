import React from 'react'
import Navbar from '../components/Navbar'
import { postData } from '../utils'
import { getLocation, redirect } from '../actions/index'
import * as User from '../actions/user'
import { Form, Input } from '../components/Form'
import { connect } from 'react-redux'


@connect((store)=>{
	return {
		forms: store.forms,
		user: store.user,
		jwtToken: store.jwtToken,
	}
})

export default class Logout extends React.Component {
	constructor(props){
		super(props)
	}

	componentDidMount = async () => {
		let { props } = this
		let { dispatch } = props
		await User.logout(dispatch)
		await User.setUser({}, dispatch)

		console.log('this USER IS:??', this.props)
	//	window.href.location = '/login'
	}

	render(){
		return (
			<div className={`shop page page-logout`}>
			</div>
		)
	}
}
