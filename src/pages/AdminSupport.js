import React from 'react'
import CreateEdit from './AdminSupport/CreateEdit'
import Index from './AdminSupport/Index'
import { postData } from '../utils'
import * as User from '../actions/user'
import { Form, Input } from '../components/Form'
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

export default class Support extends React.Component {
	constructor(props){
		super(props)
	}


	render(){
		let { props } = this

		let { forms, location, dispatch } = props
		let { base, page, method, params } = getLocation(location)

			console.log('methiod', method)
		return [
			<div className="admin-support crud container-fluid p-5 d-flex flex-column">
					{(typeof method === 'undefined' || !method || method === '' || method === 'pagination') && <Index/>}


				{(method === 'create' || method === 'edit') &&
					<CreateEdit/>
				}
			</div>

		]
	}
}
