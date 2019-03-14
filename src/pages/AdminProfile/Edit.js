import React from 'react'
import { connect } from 'react-redux'

import * as _ from 'lodash'

import { fetchData, postData } from '../../utils'
import { getLocation, redirect } from '../../actions/index'
import Models from '../../actions/models'

import { Form, Input } from '../../components/Form'

import Card from '../../components/Admin/Card'
import Header from '../../components/Admin/Header'

@connect((store)=>{
	return {
		user: store.user,
		forms: store.forms,
		models: store.models,
		location: store.location,
	}
})
export default class Edit extends React.Component {
	constructor(props){
		super(props)
		this.inputRestoreFile = React.createRef()
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

		//prevent RHL from infinite reload
		if(!_.has(forms, 'setting')){
			let model = await this.fetchModel()
			if(model.response === 200){
				Form.set({ name: 'setting', inputs: this.convertModelToInputs(model.data), dispatch })
			}
		}
	}

	fetchModel = async (id) => {
		return await fetchData(`/api/setting`)
	}

	updateModel = async (id, fields) => {
		return await postData(`/api/setting/update/`, fields)
	}

	componentDidUpdate = async () => {
		let { props } = this
		let { location, forms, dispatch } = props
		let { base, page, method, params } = getLocation(location)
		let id = params[0]

		let didSubmit = Form.didSubmit({ name: 'setting', form: forms['setting'] })
		if(didSubmit){
			let model = await this.updateModel(id, forms['setting'].inputs)
			if(model.response === 200){
				Form.set({ name: 'setting', inputs: this.convertModelToInputs(model.data), status: 'success', message: 'Successfully saved.', dispatch })
			}
			else {
				Form.set({ name: 'setting', inputs: model.data, status: 'error', message: 'Error with saving.', dispatch })
			}
		}
	}



	render() {
		let { props } = this
		let { user, location, forms, models, dispatch } = props
		let { base, page, method, params } = getLocation(location)
		let inputs = forms && forms[page.slice(0, -1)] && forms[page.slice(0, -1)].inputs

		console.log('uyser', user)
		return [
			<div className="crud container px-0">
				<Form name={`setting`} className="row">
					<div className='col-12'>
						{forms['setting'] && forms['setting'].status == 'success' && <div className="alert alert-success text-left d-flex align-items-center mb-5" role="alert"><i className="material-icons">done</i>{forms['setting'].message}</div>}
					</div>

					<div className="col-md-4 col-sm-12">
						<div className='card'>
							<div className='card-header'>
								<div className='row'>
									<div className='card-title col-12 mb-0'>
										{_.capitalize(page)}
									</div>
								</div>
							</div>

							<div className='card-body'>
								<div className='row'>
									<div className='col-6 mx-auto d-flex flex-column justify-content-center align-items-center'>
										<img src="/img/shop/uploads/avatar/iStock-528577984.jpg" className="w-100 rounded-circle mb-4" />
										<p>{_.has(user, 'first_name') && user.first_name} {_.has(user, 'last_name') && user.last_name}</p>
									</div>
									<div className="col-12 d-flex flex-row justify-content-center">
										{_.has(user,'roles') && _.map(user.roles, (item, arr, key)=>{
											return (
												<span className='badge badge-info mr-1 font-weight-normal'>
													{_.startCase(item)}
												</span>
											)
										})}
									</div>


								</div>
							</div>


						</div>
					</div>

					<div className="col-md-8 col-sm-12">

					</div>

				</Form>
			</div>
		]
	}
}
