import React from 'react'
import { connect } from 'react-redux'

import * as _ from 'lodash'

import { fetchData, postData } from '../../utils'
import { getLocation, redirect } from '../../actions/index'
import * as Messages from '../../actions/messages'


import Card from '../../components/Admin/Card'
import Header from '../../components/Admin/Header'

import { FORM_ERROR } from "final-form"
import { Form, Field } from 'react-final-form'




const fetchModel = async (id) => {
	return await fetchData(`/api/setting`)
}

const updateModel = async (fields) => {
	return await postData(`/api/setting/update/`, fields)
}

@connect((store)=>{
	return {
		forms: store.forms,
		models: store.models,
		messages: store.messages,
		location: store.location,
	}
})
export default class Edit extends React.Component {
	constructor(props){
		super(props)
		this.inputRestoreFile = React.createRef()
	}

	state = { data: {} }

	componentDidMount = async () => {
		let { props } = this
		let { location, forms, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		this.setState({ loading: true })
	     const data = await this.load()
	     this.setState({ loading: false, data })

	}

	load = async () => {
		let model = await fetchModel()

		if(model.response === 200){
		  return {
				...model.data
		  }
		}
	}

	resetSettings = async () => {
		let { forms, crud, dispatch } = this.props

		let reset = await fetchData('/api/settings/reset')
		if(reset.response === 200){
			console.log('it was reset')
			//Form.set({ name: 'setting', inputs: {}, status: 'success', message: 'Reset.', dispatch })

			dispatch(redirect('ADMIN', 'settings'))
		}
	}

	restoreBackup = async (file) => {
		let { forms, crud, dispatch } = this.props

		file = _.replace(file, '.json', '')
		let restore = await fetchData('/api/settings/restore/'+file)
		if(restore.response == 200){
			Messages.set('settings', { message: 'It was restored.', type: 'success' }, dispatch)
		}
	}


	createBackup = async (file) => {
		let { forms, crud, dispatch } = this.props

		let backup = await fetchData('/api/settings/backup')
		if(backup.response == 200){
			this.setState({ loading: true })
				 const data = await this.load()
				 this.setState({ loading: false, data })
			Messages.set('settings', { message: 'Backed up.', type: 'success' }, dispatch)
		}
	}

	onSubmit = async values => {
		let { props } = this
		let { dispatch } = props
		let update = await updateModel(values)
		if(update.response === 200){
			Messages.set('settings', { message: 'Successfully updated.', type: 'success' }, dispatch)
		}
		else {
			Messages.set('settings', { message: 'Updating failed.', type: 'danger' }, dispatch)
		}
	}

	render() {
		let { props } = this
		let { location, messages, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		return [
				<Form
					keepDirtyOnReinitialize={true}
					onSubmit={this.onSubmit}
					initialValues={this.state.data}
					render={({ mutators, submitError, handleSubmit, pristine, invalid, values }) => (
						<form onSubmit={handleSubmit} className={`row px-5`} id={`createEditForm`}>
						<div className={`col-12`}>
							{messages.settings && <div className={`alert alert-${messages.settings.type}`}>{messages.settings.message}</div>}
						</div>
						<div className={`col-8`}>
							<Card
								className='mb-4'
								body={[
                  <h6 className='card-title'>
                    Shop
                  </h6>,
                  <div className='row'>
  									<div className="form-group col-12">
                      <Field name="name">
                        {({ input, meta }) => [
                            <label>Name</label>,
                            <input type="text" {...input} placeholder="Name" className={`form-control`} />,
                            meta.touched && meta.error && <span>{meta.error}</span>,
                        ]}
                      </Field>
  									</div>
  									<div className="form-group col-12">
  											<Field name="description">
  												{({ input, meta }) => [
  														<label>Description</label>,
  														<textarea type="text" {...input} placeholder="Name" className={`form-control`} />,
  														meta.touched && meta.error && <span>{meta.error}</span>,
  												]}
  											</Field>
  									</div>
                  </div>
								]}
							/>
							<Card
								className='mb-4'
								body={[
                  <h6 className='card-title'>
										Rates
									</h6>,
                  <div className='row'>
  									<div className="form-group col-12">
  											<Field name="tax_rate">
  												{({ input, meta }) => [
  														<label>Tax Rate</label>,
  														<input type="number" {...input} placeholder="Tax Rate" className={`form-control`} />,
  														meta.touched && meta.error && <span>{meta.error}</span>,
  												]}
  											</Field>
  									</div>
  									<div className="form-group col-12">
  											<Field name="shipping_rate">
  												{({ input, meta }) => [
  														<label>Shipping Rate</label>,
  														<input type="number" {...input} placeholder="Shipping Rate" className={`form-control`} />,
  														meta.touched && meta.error && <span>{meta.error}</span>,
  												]}
  											</Field>
  									</div>
                  </div>
								]}
							/>
							<Card
						    className='mb-4'
						    body={[
                  <div className='row'>
                    <div className='card-title col-6'>
  						        <h6>Backup and Restore</h6>
  						      </div>
  						      <div className='card-controls col-6 d-flex justify-content-end align-items-center'>
  						        <a href='#' className='d-flex align-items-center' onClick={(e)=>{ e.preventDefault(); this.createBackup(); }}>Backup <i className='material-icons ml-2'>backup</i></a>
  						      </div>
                  </div>,
                  <div className='row'>
  									<div className="form-group col-12">
  											<label>Restore Files</label>
  											<Field name="restore_files" component="select" className={`form-control`} defaultValue={this.state.data.restore_files && this.state.data.restore_files[0]}>
  												{
  													this.state.data && this.state.data.restore_files && this.state.data.restore_files.map((each, index) => (
  													<option value={each} key={index}>{each}</option>
  																					))}
  											</Field>
  									</div>
  									<div className="form-group col-12">
  											<a href="#" className="btn btn-success" onClick={() => {  this.restoreBackup(values.restore_files) }}>Restore</a>
  									</div>
                  </div>
						    ]}/>


						</div>
						<div className={`col-4`}>
								<Card
									className='mb-4'
									body={[
                    <h6 className='card-title'>
                      Options
                    </h6>,
                    <div className='row'>
  										<div className="form-group col-12">

  													<h6 className="font-weight-normal text-secondary text-left">Reset</h6>
  													<p>Warning this will reset all settings. Continue?</p>
  												<a href="#" className="btn btn-danger" onClick={this.resetSettings}>Reset</a>
  										</div>
										</div>
									]}
								/>
								<pre>{JSON.stringify(values, 0, 2)}</pre>

							</div>
						</form>
					)}
				/>
		]
	}
}
