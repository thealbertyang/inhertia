import React from 'react'
import { connect } from 'react-redux'
import { postData } from '../utils'
import * as User from '../actions/user'
import { getLocation, redirect } from '../actions/index'

import Index from '../components/Admin/Index'
import Header from '../components/Admin/Header'

import CreateEdit from './AdminOrders/CreateEdit'


@connect((store)=>{
	return {
		forms: store.forms,
		user: store.user,
		jwtToken: store.jwtToken,
		location: store.location,
	}
})

export default class Orders extends React.Component {
	constructor(props){
		super(props)
	}


	render(){
		let { props } = this

		let { forms, location, dispatch } = props
		let { base, page, method, params } = getLocation(location)

			console.log('methiod', method)
		return [
			<Header/>,
			(typeof method === 'undefined' || !method || method === '' || method === 'pagination') &&

					[
					<Index
						table={
							{
								fields: [
									{
										label: 'Id',
										key: '_id'
									},
									{
										label: 'Status',
										key: 'status',
									},
									{
										label: 'Date',
										key: 'date',
									}
								],
							}}
					/>
				],
			(method === 'create' || method === 'edit') && <CreateEdit/>
		]
	}
}
