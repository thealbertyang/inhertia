import React from 'react'
import { postData } from '../utils'
import { connect } from 'react-redux'
import * as _ from 'lodash'

import { getLocation, redirect } from '../actions/index'
import * as User from '../actions/user'

import Navbar from '../components/Admin/Navbar'
import Sidebar from '../components/Admin/Sidebar'

import universal from 'react-universal-component'

let Component = universal(props => import(`./${props.page}`))

@connect((store)=>{
	return {
		forms: store.forms,
		user: store.user,
		jwtToken: store.jwtToken,
		location: store.location,
		settings: store.settings,
	}
})

export default class Admin extends React.Component {
	constructor(props){
		super(props)
		this.state = { user_authenticated: false }
	}

	getUser = async () => {
		let user = await User.authToken({ dispatch: this.props.dispatch })
		return user
	}

	componentDidMount = async () => {
		let { props } = this
		let { user, forms, location, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		if(!await this.getUser() && page !== 'register'){
				 this.props.dispatch(redirect('ADMIN','login'))
		}
	}

	render(){
		let { props } = this
		let { user, forms, location, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		console.log('user!', props.user)
		console.log('jwttoken!', props.jwtToken)

		/*
			if user is not logged in
		*/
			if(page === 'login'){
					return (
						<Component page="AdminLogin"/>
					)
			}
			else if(page === 'register'){
					return (
						<Component page="AdminRegister"/>
					)
			}
			else if(page === 'logout'){
					return (
						<Component page="AdminLogout"/>
					)
			}
			else if(page === 'resetPassword'){
				return (
					<Component page="AdminResetPassword"/>
				)
			}
			else if(page === 'forgotPassword'){
				return (
					<Component page="AdminForgotPassword"/>
				)
			}

			else {
				return [
					<div className={`container-fluid d-flex flex-fill`}>
						<div className={`row flex-fill`}>
							<Sidebar base={ base } />
							<div className={`col-11 col-md-10 bg-light`}>
								<Navbar user={user} />
								{typeof page === 'undefined' && <Component page="AdminDashboard"/>}
								{page === 'campaigns' && <Component page="AdminCampaigns"/>}
								{page === 'customers' && <Component page="AdminCustomers"/>}
								{page === 'integrations' && <Component page="AdminIntegrations"/>}
								{page === 'orders' && <Component page="AdminOrders"/>}
								{page === 'products' && <Component page="AdminProducts"/>}
								{page === 'productCategories' && <Component page="AdminProductCategories"/>}
								{page === 'productReviews' && <Component page="AdminProductReviews"/>}
								{page === 'settings' && <Component page="AdminSettings"/>}
								{page === 'support' && <Component page="AdminSupport"/>}
								{page === 'users' && <Component page="AdminUsers"/>}
							</div>
						</div>
					</div>
				]
			}
	}
}
