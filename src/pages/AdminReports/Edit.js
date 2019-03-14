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

	restoreBackup = async (file) => {
		let { forms, crud, dispatch } = this.props

		file = _.replace(file, '.json', '')
		let restore = await fetchData('/api/settings/restore/'+file)
		if(restore.response == 200){
			console.log('it was restored')
			dispatch(redirect('ADMIN', 'settings'))
		}
	}


	createBackup = async (file) => {
		let { forms, crud, dispatch } = this.props

		let backup = await fetchData('/api/settings/backup')
		if(backup.response == 200){
			console.log('it was backuped')

			dispatch(redirect('ADMIN', 'settings'))
		}
	}

	render() {
		let { props } = this
		let { location, forms, models, dispatch } = props
		let { base, page, method, params } = getLocation(location)
		let inputs = forms && forms[page.slice(0, -1)] && forms[page.slice(0, -1)].inputs

		return [
			<div className="crud container px-0">
				<Form name={`setting`} className="row">
					<div className='col-12'>
						{forms['setting'] && forms['setting'].status == 'success' && <div className="alert alert-success text-left d-flex align-items-center mb-5" role="alert"><i className="material-icons">done</i>{forms['setting'].message}</div>}
					</div>
					<div className="col-md-8 col-sm-12">
						<Card
							className='mb-4'
							header={
								<div className='card-title col-12 mb-0'>
									Shop {_.capitalize(page)}
								</div>
							}

							body={[
								<div className="form-group col-12">
								    <Input type='text' name='name' placeholder='Enter name' label='Shop Name'/>
								</div>,
								<div className="form-group col-12">
								    <Input type='text' name='description' placeholder='Enter short description' label='Description'/>
								</div>,
							]}
						>
						</Card>
						<Card
							className='mb-4'
							header={
								<div className='card-title col-12 mb-0'>
									SHIPPING {_.capitalize(page)}
								</div>
							}
							body={[
								<div className="form-group col-12">
							    	<Input type="number" name="tax_rate" label='Tax Rate' placeholder="Enter tax rate rate"/>
								</div>,
								<div className="form-group col-12">
								    <Input type="number" name="shipping_rate" label='Shipping Rate' placeholder="Enter shipping rate rate"/>
								</div>,
							]}
						>
						</Card>
						<Card
						className='mb-4'
						header={[
							<div className='card-title col-6 mb-0'>
								BACKUP AND RESTORE
							</div>,
							<div className='card-controls col-6 mb-0 d-flex justify-content-end align-items-center'>
								<a href='#' className='d-flex align-items-center' onClick={(e)=>{ e.preventDefault(); this.createBackup(); }}>Backup <i className='material-icons ml-2'>backup</i></a>
							</div>,
						]}
						body={[
							<div className="form-group col-12">
							    <label for="shipping_rate">Restore</label>
							    <div className='form-row'>
							    	<div className='col-10'>
							    		<select className='form-control' name='restore_file' ref={this.inputRestoreFile}>
									    	{inputs && inputs['restore_files'] && _.map(inputs['restore_files'].value, (item, key, arr)=>{

									    		return (
									    			<option value={item}>{item}</option>
									    		)
									    	})}
									    </select>
									</div>
									<div className='col-2'>
							       		<a href='#' className='btn btn-success btn-block' onClick={(e)=>{ e.preventDefault(); this.restoreBackup(this.inputRestoreFile.current.value); }}>Restore</a>
							       	</div>
							    </div>
							</div>,
						]}>
						</Card>
					</div>
	        		<div className="col-md-4 col-sm-12">
	        			<Card
							header={
								<div className='card-title col-12 mb-0'>
									SAVE {_.capitalize(page)}
								</div>
							}

							body={[
								<div className="col-12 mx-0 mt-3">
									<h4 className="font-weight-normal text-secondary text-left">Warnings</h4>
									<hr/>
								</div>,
								<div className="form-group col-12">
								    <label for="warnings_delete">Leave delete warning on?</label>
									<div className="form-check">
										<div class="form-check">

											<label className="form-check-label" for="warnings_delete_true">
											On
											</label>
										</div>
										<div className="form-check">

											<label className="form-check-label" for="warnings_delete_false">
											Off
											</label>
										</div>
									</div>
								</div>,
								<div className="col-12 mx-0 mt-3">
									<h4 className="font-weight-normal text-secondary text-left">Reset</h4>
									<hr/>
								</div>,
								<div className="form-group col-12">
									<div className="alert alert-danger col-12 py-4">
								    	<p>Warning this will reset all settings. Continue?</p>
										<a href="#" className="btn btn-danger">Reset</a>
									</div>
								</div>
							]}
							footer={
								<div className='col-12'>
									<div className='form-row'>
										<div className="form-group d-flex col-6 mt-3">
									  		<button type="submit" className="btn btn-block btn-success">Submit</button>
									  	</div>
									  	<div className="form-group d-flex col-6 mt-3">
									  		<a href={`/${base}`} className="btn btn-block bg-light text-secondary btn-medium">Cancel</a>
									  	</div>
								  	</div>
							  	</div>
							}
						>
						</Card>
					</div>
				</Form>
			</div>
		]
	}
}
