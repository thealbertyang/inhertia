import React from 'react'
import Index from '../components/Admin/Index'
import Header from '../components/Admin/Header'
import CreateEdit from './AdminCustomers/CreateEdit'
import { postData } from '../utils'
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

export default class Customers extends React.Component {
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
			<div className="admin-customers crud container-fluid p-5 d-flex flex-column">
				{(typeof method === 'undefined' || !method || method === '' || method === 'pagination') &&

						[
						<div className='container pb-5'>
							<div className='row'>
								<div className='col-6'>
								Users
								</div>
								<div className='col-6'>
								Customers
								</div>
							</div>
						</div>,
						<Index

							table={
								{
									fields: [
										{
											label: 'Id',
											key: '_id'
										},
										{
											label: 'Coins',
											key: 'coins',
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
									],
									actions: {
										edit: 'user_id'
									}
								}}
						/>
					]
				}

				{(method === 'create' || method === 'edit') &&
					<CreateEdit/>
				}
			</div>

		]
	}
}
