import React from 'react'
import { connect } from 'react-redux'
import { postData } from '../utils'
import { getLocation, redirect } from '../actions/index'
import * as User from '../actions/user'

import Edit from './Setup/Edit'

@connect((store)=>{
	return {
		forms: store.forms,
		user: store.user,
		jwtToken: store.jwtToken,
		location: store.location,
	}
})

export default class AdminSetup extends React.Component {
	constructor(props){
		super(props)
	}

	render(){
		let { props } = this
		let { forms, location, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		return [
			<Edit/>
		]
	}
}
