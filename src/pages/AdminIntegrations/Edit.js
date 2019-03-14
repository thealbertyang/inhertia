import React from 'react'
import { connect } from 'react-redux'

import * as _ from 'lodash'

import { fetchData, postData } from '../../utils'
import { getLocation, redirect } from '../../actions/index'
import Models from '../../actions/models'


import Card from '../../components/Admin/Card'
import Header from '../../components/Admin/Header'

import { FORM_ERROR } from "final-form"
import { Form, Field } from 'react-final-form'

const formMessage = (type, message) => {
  return { [FORM_ERROR]: <div className={`alert alert-${type}`}>{message}</div> }
}

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

	state = { data: {} }


  load = async () => {
  	let model = await this.fetchModel()

  	if(model.response === 200){
  	  return {
  			...model.data
  	  }
  	}
  }

	fetchModel = async (id) => {
		return await fetchData(`/api/setting`)
	}

  updateModel = async (fields) => {
  	return await postData(`/api/setting/integrations/update`, fields)
  }

	componentDidUpdate = async () => {
		let { props } = this
		let { location, forms, dispatch } = props
		let { base, page, method, params } = getLocation(location)
		let id = params[0]

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

  onSubmit = async values => {
    let { base, page, method, params } = getLocation(this.props.location)
    let id = params[0]
    let data = {
      ...values,
      roles: JSON.stringify(values.roles)
    }
    let update = await this.updateModel(data)
    if(update.response === 200){
        return formMessage('success', 'Successfully Updated.')
    }
    else {
        return formMessage('danger', 'Updating Failed.')
    }
  }

	componentDidMount = async () => {
		let { props } = this
		let { location, forms, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		this.setState({ loading: true })
	     const data = await this.load()
	     this.setState({ loading: false, data })

	}

	render() {
		let { props } = this
		let { location, forms, models, dispatch } = props
		let { base, page, method, params } = getLocation(location)
		let inputs = forms && forms[page.slice(0, -1)] && forms[page.slice(0, -1)].inputs

		return [
				<Form
					onSubmit={this.onSubmit}
					initialValues={this.state.data}
					render={({ submitError, handleSubmit, pristine, invalid }) => (
						<form onSubmit={handleSubmit} className={`row px-5`} id={`createEditForm`}>
            <div className={`col-12`}>
						   {submitError && submitError}
            </div>
						<div className={`col-8`}>
							<Card
								className='mb-4'
								body={[
                  <h6 className='card-title'>
                    Stripe
                  </h6>,
                  <div className='row'>
  									<div className="form-group col-12">
  											<Field name="integrations_stripe">
  												{({ input, meta }) => [
  														<label>Stripe Private API Key</label>,
  														<input type="text" {...input} placeholder="Stripe Private API Key" className={`form-control`} />,
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
                      Instagram
                    </h6>,
                    <div className='row'>
  										<div className="form-group col-12">
  											<Field name="integrations_instagram">
  												{({ input, meta }) => [
  														<label>Instagram Private API Key</label>,
  														<textarea type="text" {...input} placeholder="Name" className={`form-control`} />,
  														meta.touched && meta.error && <span>{meta.error}</span>,
  												]}
  											</Field>
  										</div>
                    </div>,
									]}
								/>

						</div>
						<div className={`col-4`}>

							</div>
						</form>
					)}
				/>
		]
	}
}
