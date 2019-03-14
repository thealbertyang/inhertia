import React from 'react'

import { connect } from 'react-redux'
import { postData } from '../utils'

import { getLocation, redirect } from '../actions/index'
import * as User from '../actions/user'

import Index from '../components/Admin/Index'
import Header from '../components/Admin/Header'

import Edit from './AdminProfile/Edit'

import { Form, Input } from '../components/Form'




@connect((store)=>{
	return {
		forms: store.forms,
		user: store.user,
		jwtToken: store.jwtToken,
		location: store.location,
	}
})

export default class Profile extends React.Component {
	constructor(props){
		super(props)
	}


	render(){
		let { props } = this

		let { forms, location, dispatch } = props
		let { base, page, method, params } = getLocation(location)

			console.log('methiod', method)
		return [
			<Header controls={false}/>,
			<div className="admin-profile crud container-fluid p-5 d-flex flex-column">
				<Edit/>
			</div>

		]
	}
}
