import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import { FORM_ERROR } from "final-form"
import { Form, Field } from 'react-final-form'

import Card from '../../components/Admin/Card'
import ImageUpload from '../../components/Form/ImageUpload'

import { fetchData, postData } from '../../utils'
import { getLocation, redirect } from '../../actions/index'
import * as Messages from '../../actions/messages'

const formMessage = (type, message) => {
  return { [FORM_ERROR]: <div className={`alert alert-${type}`}>{message}</div> }
}

@connect((store)=>{
	return {
		forms: store.forms,
    messages: store.messages,
		location: store.location,
	}
})
export default class CreateEdit extends React.Component {
	constructor(props){
		super(props)
	}

	state = { data: {} }

  load = async (id) => {
  	let model = await this.fetchModel(id)

  	if(model.response === 200){
  	  return {
  			...model.data
  	  }
  	}
  }

	fetchModel = async (id) => {
		return await fetchData(`/api/user/${id}`)
	}

	createModel = async (fields) => {
		return await postData(`/api/user/create`, fields)
	}

	updateModel = async (id, fields) => {
		return await postData(`/api/user/update/${id}`, fields)
	}

  onSubmitCreate = async (values) => {
    let { base, page, method, params } = getLocation(this.props.location)
    let data = {
      ...values,
      roles: JSON.stringify(values.roles)
    }
    let create = await this.createModel(data)
    if(create.response === 200){
        this.props.dispatch(redirect('ADMIN', page))
    }
    else if(create.response === 409){
      Messages.set('products', { message: 'Duplicate Product.', type: 'danger' }, this.props.dispatch)
    }
    else {
      Messages.set('products', { message: 'Creating Failed.', type: 'danger' }, this.props.dispatch)
    }
  }

  onSubmitEdit = async (values) => {
    let { base, page, method, params } = getLocation(this.props.location)
    let id = params[0]
    let data = {
      ...values,
      roles: JSON.stringify(values.roles)
    }
    let update = await this.updateModel(id, data)
    if(update.response === 200){
      Messages.set('products', { message: 'Successfully updated.', type: 'success' }, this.props.dispatch)
    }
    else {
      Messages.set('products', { message: 'Updating failed.', type: 'success' }, this.props.dispatch)
    }
  }

	componentDidMount = async () => {
    let { base, page, method, params } = getLocation(this.props.location)
		let id = params[0]

    this.setState({ loading: true })
	     const data = await this.load(id)
	     this.setState({ loading: false, data })
	}

	render() {
		let { props } = this
		let { location, forms, messages, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		return [
			<Form
				keepDirtyOnReinitialize={true}
				onSubmit={this.onSubmitEdit}
				initialValues={this.state.data}
				mutators={{
						setName: (args, state, utils) => {
							utils.changeValue(state, 'name', () => 1)
						},
					}}
				render={({ mutators, submitError, submitting, handleSubmit, pristine, invalid, values }) => {
          return (
					<form onSubmit={handleSubmit} className={`row px-5`} id={`createEditForm`}>
            <div className={`col-12`}>
              {messages.products && <div className={`alert alert-${messages.products.type}`}>{messages.products.message}</div>}
            </div>
  					<div className={`col-12`}>
              <ul className="nav nav-tabs nav-overflow header-tabs mb-5">
                <li className="nav-item">
                  <a href="#!" className="nav-link active">
                    Profile
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#!" className="nav-link">
                    Profile
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#!" className="nav-link">
                    Billing
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#!" className="nav-link">
                    Notifications
                  </a>
                </li>
              </ul>
  					</div>
  					<div className={`col-8`}>
  						<Card
  							className='mb-4'
  							body={[
                  <h6 className='card-title'>
                    User
                  </h6>,
                  <div className='row'>
    								<div className="form-group col-6">
    										<Field name="first_name">
    											{({ input, meta }) => [
    													<label>First Name</label>,
    													<input type="text" {...input} placeholder="First Name" className={`form-control`} />,
    													meta.touched && meta.error && <span>{meta.error}</span>,
    											]}
    										</Field>
    								</div>
    								<div className="form-group col-6">
    										<Field name="last_name">
    											{({ input, meta }) => [
    													<label>Last Name</label>,
    													<input type="text" {...input} placeholder="Last Name" className={`form-control`} />,
    													meta.touched && meta.error && <span>{meta.error}</span>,
    											]}
    										</Field>
    								</div>
    								<div className="form-group col-6">
    										<Field name="email">
    											{({ input, meta }) => [
    													<label>Email</label>,
    													<input type="text" {...input} placeholder="Email" className={`form-control`} />,
    													meta.touched && meta.error && <span>{meta.error}</span>,
    											]}
    										</Field>
    								</div>
    								<div className="form-group col-6">
    										<Field name="username">
    											{({ input, meta }) => [
    													<label>Username</label>,
    													<input type="text" {...input} placeholder="Username" className={`form-control`} />,
    													meta.touched && meta.error && <span>{meta.error}</span>,
    											]}
    										</Field>
    								</div>
    								<div className="form-group col-6">
    										<Field name="password">
    											{({ input, meta }) => [
    													<label>Password</label>,
    													<input type="password" {...input} placeholder="Password" className={`form-control`} />,
    													meta.touched && meta.error && <span>{meta.error}</span>,
    											]}
    										</Field>
    								</div>
    								<div className="form-group col-6">
    										<Field name="password_confirm">
    											{({ input, meta }) => [
    													<label>Password Confirm</label>,
    													<input type="password" {...input} placeholder="Re-type Password" className={`form-control`} />,
    													meta.touched && meta.error && <span>{meta.error}</span>,
    											]}
    										</Field>
    								</div>
                  </div>
  							]}
  						/>
  							<pre style={{ maxWidth: '400px' }}>{JSON.stringify(values, 0, 2)}</pre>
						</div>
            <div className={`col-4`}>
  						<Card
  							className='mb-4'
  							body={[
                  <h6 className='avatar'>
                    Avatar
                  </h6>,
                  <div className='row'>
    								<div className="form-group col-12">
                      <Field
                          name="avatar"
                          component={ImageUpload}
                          fullWidth
                          margin="normal"
                          label="Avatar Upload"
                        />
    								</div>
                  </div>,

  							]}
  						/>
  						<Card
  							className='mb-4'

  							body={[
                  <h6 className='card-title'>
                    Roles
                  </h6>,
                  <div className='row'>
    								<div className="form-group mb-0 col-12">
                      <label>
                        <Field
                          name="roles"
                          component="input"
                          type="checkbox"
                          value="admin"
                        />
                        {' '}
                        Admin
                      </label>
                    </div>
                    <div className="form-group mb-0 col-12">
                      <label>
                        <Field
                          name="roles"
                          component="input"
                          type="checkbox"
                          value="customer"
                        />
                        {' '}
                        Customer
                      </label>
                    </div>
                    <div className="form-group mb-0 col-12">
                      <label>
                        <Field
                          name="roles"
                          component="input"
                          type="checkbox"
                          value="guest"
                        />
                        {' '}
                        Guest
                      </label>
                    </div>
                    <div className="form-group mb-0 col-12">
                      <label>
                        <Field
                          name="roles"
                          component="input"
                          type="checkbox"
                          value="support"
                        />
                        {' '}
                        Support
                      </label>
    								</div>
                  </div>
  							]}/>
  					</div>
					</form>
				)
        }}
			/>
		]

	}
}
