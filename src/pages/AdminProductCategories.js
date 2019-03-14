import React from 'react'
import Index from '../components/Admin/Index'
import Header from '../components/Admin/Header'
import CreateEdit from './AdminProductCategories/CreateEdit'
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

export default class ProductCategories extends React.Component {
	constructor(props){
		super(props)
	}


	render(){
		let { props } = this

		let { forms, location, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		return [
			<Header title={'Product Categories'}/>,
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
											label: 'Slug',
											key: 'slug',
										},
										{
											label: 'Date',
											key: 'date',
										}
									],
								}}
						/>
					],
				(method === 'create' || method === 'edit') &&	<CreateEdit/>
		]
	}
}
