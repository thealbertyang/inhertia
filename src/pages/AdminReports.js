import React from 'react'

import Header from '../components/Admin/Header'
import Index from './AdminReports/Index'

import { connect } from 'react-redux'
import { getLocation, redirect } from '../actions/index'
import * as User from '../actions/user'

import { postData } from '../utils'



@connect((store)=>{
	return {
		forms: store.forms,
		user: store.user,
		jwtToken: store.jwtToken,
		location: store.location,
	}
})

export default class Reports extends React.Component {
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
			<div className="admin-reports crud container-fluid p-5 d-flex flex-column">
				<Index/>
			</div>

		]
	}
}
