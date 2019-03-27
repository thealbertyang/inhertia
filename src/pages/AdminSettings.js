import React from 'react'
import Index from '../components/Admin/Index'
import Header from '../components/Admin/Header'
import Edit from './AdminSettings/Edit'
import { postData } from '../utils'
import * as User from '../actions/user'
import { connect } from 'react-redux'
import { getLocation, redirect } from '../actions/index'


@connect((store)=>{
	return {
		forms: store.forms,
		user: store.user,
		jwtToken: store.jwtToken,
		location: store.location,
	}
})

export default class AdminSettings extends React.Component {
	constructor(props){
		super(props)
	}

	render(){
		let { props } = this

		let { forms, location, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		return [
			<Header controls={true}/>,
			<Edit/>
		]
	}
}
