import React from 'react'
import Index from '../components/Admin/Index'
import Header from '../components/Admin/Header'
import CreateEdit from './AdminCampaigns/CreateEdit'
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

export default class Campaigns extends React.Component {
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
											label: 'Title',
											key: 'title',
										},
										{
											label: 'Discount Code',
											key: 'discount_code',
										},
										{
											label: 'Type',
											key: 'discount_type',
										},
										{
											label: 'Value Deducted',
											key: 'discount_value',
										},
										{
											label: 'Date',
											key: 'date',
										}
									],
								}}
							api={{
								fetchModels: 'discounts'
							}}
						/>
					],
				(method === 'create' || method === 'edit') && <CreateEdit/>

		]
	}
}
