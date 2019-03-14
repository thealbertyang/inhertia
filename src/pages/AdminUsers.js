import React from 'react'
import Index from '../components/Admin/Index'
import Header from '../components/Admin/Header'
import CreateEdit from './AdminUsers/CreateEdit'
import { postData } from '../utils'
import * as User from '../actions/user'
import { connect } from 'react-redux'
import { getLocation, redirect } from '../actions/index'


@connect((store)=>{
	return {
		location: store.location,
	}
})

export default class AdminUsers extends React.Component {
	constructor(props){
		super(props)
	}

	render(){
		let { props } = this
		let { location } = props
		let { base, page, method, params } = getLocation(location)

		return [
			<Header title={`Users`} />,
			(typeof method === 'undefined' || !method || method === '' || method === 'pagination') &&
				[
					<Index
						api={{
							fetchModels: 'users'
						}}
						table={{
							fields: [
								{
									label: 'Id',
									key: '_id'
								},
								{
									label: 'Email',
									key: 'email',
								},
								{
									label: 'First Name',
									key: 'first_name',
								},
								{
									label: 'Roles',
									key: 'roles',
								},
								{
									label: 'Date',
									key: 'date',
								}
							]
						}}
					/>
				],
				(method === 'create' || method === 'edit') && <CreateEdit/>


		]
	}
}
