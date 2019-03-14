import React from 'react'
import { connect } from 'react-redux'

import * as _ from 'lodash'

import Card from '../../components/Admin/Card'
import Header from '../../components/Admin/Header'

import { Form, Input, Password, List, ImageUpload, Select, CheckList } from '../../components/Form'

import { fetchData, postData } from '../../utils'
import { getLocation, redirect } from '../../actions/index'
import Models from '../../actions/models'

@connect((store)=>{
	return {
		forms: store.forms,
		models: store.models,
		location: store.location,
	}
})
export default class CreateEdit extends React.Component {
	constructor(props){
		super(props)
	}
	convertModelToInputs = (modelData) => {
		let inputs = _.mapValues(modelData, (v,k)=>{
	        return ({ value: v })
  		})
		return ({...inputs})
	}

	componentDidMount = async () => {
		let { props } = this
		let { location, forms, dispatch } = props
		let { base, page, method, params } = getLocation(location)
		let id = params[0]

		if(!_.has(forms, 'productReview') && method === 'edit'){
			let model = await this.fetchModel(id)
			if(model.response === 200){
				Form.set({ name: 'productReview', inputs: this.convertModelToInputs(model.data), dispatch })
			}
		}
	}

	fetchModel = async (id) => {
		return await fetchData(`/api/productReview/${id}`)
	}

	updateModel = async (id, fields) => {
		return await postData(`/api/productReview/update/${id}`, fields)
	}

	createModel = async (fields) => {
		return await postData(`/api/productReview/create`, fields)
	}

	componentDidUpdate = async () => {
		let { props } = this
		let { location, forms, dispatch } = props
		let { base, page, method, params } = getLocation(location)
		let id = params[0]

		let didSubmit = Form.didSubmit({ name: 'productReview', form: forms['productReview'] })
		if(didSubmit){
			if(method === 'edit'){
				let model = await this.updateModel(id, forms['productReview'].inputs)
				if(model.response === 200){
					Form.set({ name: 'productReview', inputs: this.convertModelToInputs(model.data), status: 'success', message: 'Successfully saved.', dispatch })
				}
				else {
					Form.set({ name: 'productReview', inputs: model.data, status: 'error', message: 'Error with saving.', dispatch })
				}
			}
			else if(method === 'create') {
				let model = await this.createModel(forms['productReview'].inputs)
				if(model.response === 200){
					dispatch(redirect('ADMIN', page))
				}
				else {
					Form.set({ name: 'productReview', inputs: model.data, status: 'error', message: 'Error with saving.', dispatch })
				}
			}
		}
	}

	render() {
		let { props } = this
		let { location, forms, models, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		return [
			<div className="crud container px-0">
				<Form name='productReview' className="row">
					<div className='col-12'>
						{forms['productReview'] && forms['productReview'].status == 'success' && <div className="alert alert-success text-left d-flex align-items-center mb-5" role="alert"><i className="material-icons">done</i>{forms['productReview'].message}</div>}
					</div>
					<div className="col-8">
						<Card
							classes={`mb-4`}
							header={
								<div className='col-6 mb-0'>
									Edit
								</div>
							}
							body={[
								<div className='form-group col-6'>
									<Input type='text' name={`title`} label='Title' />
								</div>,
								<div className='form-group col-6'>
									<Input type='text' name={`slug`} label='Slug' />
								</div>,
								<div className="form-group col-12">
									<Input type='text' name={`description`} label='Description' />
								</div>,
							]}
						/>,
					</div>
					<div className='col-4'>
						<Card
							header={
								<div className='col-6 mb-0'>
									{_.capitalize(method)}
								</div>
							}
							body={[
								<div className="form-group col-12">
									<Input type='text' name={`user_id`} label='User ID' />
								</div>,
								<div className="form-group col-12">
									<Input type='text' name={`product_id`} label='Product ID' />
								</div>,
								<div className="form-group col-12">
									<Input type='number' name={`rating`} label='Rating' />
								</div>,
								<div className="form-group col-12">
									<Select name={`published`} label='Status' options={{ 'Draft': false, 'Published': true }} />
								</div>,
							]}
							footer={
								<div className="form-group d-flex justify-content-end col-12 mt-3">
							  		<button type="submit" className="btn col-6 btn-success">Submit</button>
							  		<a href={`/${base}/${page}`} className="ml-3 col-6 btn text-secondary bg-light btn-medium">Cancel</a>
							  	</div>
							}
						/>
					</div>
				</Form>
			</div>
		]
	}
}
