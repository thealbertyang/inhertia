import React from 'react'
import Navbar from '../components/Page/Navbar'
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
		let { user, dispatch } = props

		console.log('user has role', this.props.user, User.hasRole(user, 'admin'))
		if(User.hasRole(user, 'admin')){
			User.logout(dispatch)
			dispatch(redirect('ADMIN','login'))
		}
		else {
			User.logout(dispatch)
			dispatch(redirect('LOGIN'))
		}
	}

	render(){

		console.log('user has role', this.props.user, User.hasRole('admin'))

		return (
			<div className={`shop page page-logout`}>
			</div>
		)
	}
}
