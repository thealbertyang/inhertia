import React from 'react'
import Index from '../components/Admin/Index'
import Header from '../components/Admin/Header'
import CreateEdit from './AdminProducts/CreateEdit'
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

export default class Products extends React.Component {
	constructor(props){
		super(props)
	}

	render(){
		let { props } = this
		let { location, dispatch } = props
		let { base, page, method, params } = getLocation(location)

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
									label: 'Price',
									key: 'price',
								},
								{
									label: 'Purchases',
									key: 'purchases'
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
