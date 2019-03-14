import React from 'react'
import { connect } from 'react-redux'

import * as _ from 'lodash'

import { fetchData, postData } from '../../utils'
import { getLocation, redirect } from '../../actions/index'
import Models from '../../actions/models'

import Section from '../../components/Page/Section'
import Overline from '../../components/Typography/Overline'

import Card from '../../components/Admin/Card'
import Header from '../../components/Admin/Header'

import { Form, Field } from 'react-final-form'
import { FORM_ERROR } from "final-form"

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
				//Form.set({ name: 'setting', inputs: this.convertModelToInputs(model.data), dispatch })
			}
		}
	}

	fetchModel = async (id) => {
		return await fetchData(`/api/setting`)
	}

	updateModel = async (fields) => {
		return await postData(`/api/setting/update/`, fields)
	}

	componentDidUpdate = async () => {
		let { props } = this
		let { location, forms, dispatch } = props
		let { base, page, method, params } = getLocation(location)
		let id = params[0]
/*
		let didSubmit = Form.didSubmit({ name: 'setting', form: forms['setting'] })
		if(didSubmit){
			let model = await this.updateModel(id, forms['setting'].inputs)
			if(model.response === 200){
				Form.set({ name: 'setting', inputs: this.convertModelToInputs(model.data), status: 'success', message: 'Successfully saved.', dispatch })
			}
			else {
				Form.set({ name: 'setting', inputs: model.data, status: 'error', message: 'Error with saving.', dispatch })
			}
		}*/
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


 	sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

	onSubmit = async (values) => {
	  await this.sleep(300);
	  window.alert(JSON.stringify(values, 0, 2))

		console.log('fields', values)
		this.updateModel(values)

	}

	restoreBackup = async (file) => {
		let { forms, crud, dispatch } = this.props

		file = _.replace(file, '.json', '')
		let restore = await fetchData('/api/settings/restore/'+file)
		if(restore.response == 200){
			console.log('it was restored')
		//	dispatch(redirect('ADMIN', 'settings'))
		return { [FORM_ERROR]: <div className={`alert alert-danger`}>Updating Failed.</div> }
		}
	}



	render() {
		let { props } = this
		let { location, forms, models, dispatch } = props
		let { base, page, method, params } = getLocation(location)
		//let inputs = forms && forms[page.slice(0, -1)] && forms[page.slice(0, -1)].inputs

		return [
			<Section className={`d-flex flex-fill px-5`} Name={`hero`} BackgroundColor={`#ffffff`}>
				<div className={`row flex-fill`}>
					<div className={`col-6 offset-3 d-flex flex-column justify-content-center`}>
					<Form
						onSubmit={this.onSubmit}
						validate={values => {
			        const errors = {};
			        if (!values.name) {
			          errors.name = "Required";
			        }
			        return errors;
			      }}
						render={({ values, handleSubmit, pristine, invalid }) => (
							<form onSubmit={handleSubmit}>


								<h2 className={`font-weight-light`}>Hi, welcome.</h2>
								<p className={'mb-5'}>Please setup your store.</p>

								<ul className="nav nav-tabs nav-fill header-tabs mb-5">
									<li className="nav-item">
										<a href="#!" className="nav-link active">
											Shop
										</a>
									</li>
									<li className="nav-item">
										<a href="#!" className="nav-link">
											Rates
										</a>
									</li>
									<li className="nav-item">
										<a href="#!" className="nav-link">
											Integrations
										</a>
									</li>
									<li className="nav-item">
										<a href="#!" className="nav-link">
											Account
										</a>
									</li>
								</ul>

								<Card
									className='mb-4'
									header={
										<div className='card-title col-12 mb-0'>
											Shop {_.capitalize(page)}
										</div>
									}

									body={[
										<div className="form-group col-12">
											<div>

												<Field name="name">
													{({ input, meta }) => [
															<label>Shop Name</label>,
															<input type="text" {...input} placeholder="Name" className={`form-control`} />,
															meta.touched && meta.error && <span>{meta.error}</span>,
													]}
												</Field>
											</div>
										</div>,
										<div className="form-group col-12">
											<button type="submit" className={`form-control btn-primary btn`} disabled={pristine || invalid}>
												Submit
											</button>
										</div>,
									]}
								/>

								<Card
							    className='mb-4'
							    header={[
							      <div className='card-title col-6 mb-0'>
							        Restore
							      </div>
							    ]}
							    body={[
										<div className="form-group col-12">
												<label>Backup Files</label>
												<Field name="restore_files" component="select" className={`form-control`}>
													<option/>
													{
														this.props.models.settings && this.props.models.settings.restore_files && this.props.models.settings.restore_files.map((each, index) => (
														<option value={each} key={index}>{each}</option>
													))}
												</Field>
										</div>,
										<div className="form-group col-12">
												<a href="#" className="btn btn-success" onClick={() => { this.restoreBackup(values.restore_files) }}>Restore</a>

										</div>,

							    ]}/>
							</form>
						)}
					/>
					</div>
				</div>
			</Section>
		]
	}
}
