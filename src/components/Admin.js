import React from 'react'
import { connect } from 'react-redux'
import universal from 'react-universal-component'
import Cookie from 'universal-cookie'

import Navbar from './Navbar'
import Login from './Admin/Login'
import Register from './Admin/Register'
import Users from './Admin/Users'
import Customers from './Admin/Customers'
import Products from './Admin/Products'
import ProductCategories from './Admin/ProductCategories'
import ProductReviews from './Admin/ProductReviews'
import Orders from './Admin/Orders'
import Campaigns from './Admin/Campaigns'
import Settings from './Admin/Settings'
import Dashboard from './Admin/Dashboard'
import Reports from './Admin/Reports'
import Integrations from './Admin/Integrations'
import Support from './Admin/Support'
import Profile from './Admin/Profile'


import { Form, Input } from './Form'
import Header from './Admin/Header'
import ForgotPassword from './Admin/ForgotPassword'
import ResetPassword from './Admin/ResetPassword'
import Sidebar from './Admin/Sidebar'

import { fetchData, postData } from '../utils'

import * as User from '../actions/user'
import * as Models from '../actions/models'
import { getLocation, redirect } from '../actions/index'

import * as _ from 'lodash'

let Component = universal(props => import(`./Admin/${props.component}`))

@connect((store)=>{
	return {
		forms: store.forms,
		jwtToken: store.jwtToken,
		user: store.user,
		location: store.location,
		models: store.models,
	}
})

export default class Admin extends React.Component {
	constructor(props){
		super(props)
	}

	loadSettings = async () => {
		let { props } = this
		let { forms, dispatch } = props

		if(!_.has(forms, 'settings')){
			let settings = await fetchData(`/api/settings`)
			if(settings.response === 200){
				Models.set('settings', settings.data, dispatch)
			}
		}

	}

	componentDidMount = async () => {
		let { props } = this
		let { jwtToken, forms, location, dispatch } = props
		let { base, page, method, params } = getLocation(location)
		//this.loadSettings()

		 //check for role
	    let authToken = await User.authToken({ dispatch })

	    console.log('admin mounted', page, authToken)
	    /*let noPage = (page !== 'login' && page !== 'register' && typeof page === 'undefined')
	    if(noPage){
		    	console.log('is it here 1')

		    if(!authToken){
		    	console.log('is it here')
				dispatch(redirect('ADMIN','login'))
		    }
		    else {
		    	console.log('or is it here')

		    	(_.indexOf(authToken.roles, 'admin') === -1) && dispatch(redirect('ADMIN','login'))
		    }
		}
		else {

			if(!authToken){
				dispatch(redirect('ADMIN','login'))
			}
			console.log('hi test herere1', page)
		}*/
	}

	componentDidUpdate = async (prevProps) => {
		console.log('admin testS updates', prevProps.user, this.props.user)

		let { props } = this
		let { dispatch } = props

		let propsFetched = prevProps && !_.isEqual(prevProps.user.id, this.props.user.id)
		if(propsFetched){

		 //Check if User is Logged in
	   let authToken = await User.authToken({ dispatch })

	   if(!authToken){
			dispatch(redirect('ADMIN','login'))
	   }
	   else {
	   	(_.indexOf(authToken.roles, 'admin') === -1) && dispatch(redirect('ADMIN','login'))
	   }

		}
	}

	render(){
		let { props } = this
		let { location } = props
		let { base, page, method } = getLocation(location)


		console.log('this props', this.props)

		if(page === 'login' || page === 'register' || page === 'forgotPassword' || page === 'resetPassword'){
			if(page === 'login'){
				return <Login/>
			}
			else if(page === 'register'){
				return <Register/>
			}
			else if(page === 'resetPassword'){
				return <ResetPassword/>
			}
			else if(page === 'forgotPassword'){
				return <ForgotPassword/>
			}

		}
		else {
			return [
				<div className="admin container-fluid">
					<div className="row">
						<div className="col-12">
							<nav className="navbar navbar-dark bg-dark flex-md-nowrap p-0 shadow">
						        <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#">Inhertia</a>
						        <ul className="navbar-nav px-3">
						          <li className="nav-item text-nowrap">
						            <a href={`/${base}/profile`} className="nav-link" >
					      				<img src='' className='rounded-circle w-100 avatar'/>
					      			</a>
						          </li>
						        </ul>
						      </nav>
						</div>
						<div className="col-2 d-none d-md-block bg-dark-navy sidebar">
							<Sidebar/>
						</div>
						<main role='main' className="col-10 px-0 ml-auto">
							{(typeof page === 'undefined' || !page || page === 'dashboard') && <Dashboard/>}
							{page === 'users' && <Users/>}
							{page === 'customers' && <Customers/>}
							{page === 'products' && <Products/>}
							{page === 'productCategories' && <ProductCategories/>}
							{page === 'productReviews' && <ProductReviews/>}
							{page === 'orders' && <Orders/>}
							{page === 'campaigns' && <Campaigns/>}
							{page === 'settings' && <Settings/>}
							{page === 'reports' && <Reports/>}
							{page === 'integrations' && <Integrations/>}
							{page === 'support' && <Support/>}
							{page === 'profile' && <Profile/>}

						</main>
					</div>
				</div>
			]
		}

	}
}
