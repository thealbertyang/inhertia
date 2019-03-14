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
		return await fetchData(`/api/productCategory/${id}`)
	}

	updateModel = async (id, fields) => {
		return await postData(`/api/productCategory/update/${id}`, fields)
	}

	createModel = async (fields) => {
		return await postData(`/api/productCategory/create`, fields)
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
      Messages.set('productCategories', { message: 'Duplicate Category.', type: 'danger' }, this.props.dispatch)
    }
    else {
      Messages.set('productCategories', { message: 'Creating Failed.', type: 'danger' }, this.props.dispatch)
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
      Messages.set('productCategories', { message: 'Successfully updated.', type: 'success' }, this.props.dispatch)
    }
    else {
      Messages.set('productCategories', { message: 'Updating failed.', type: 'success' }, this.props.dispatch)
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
				onSubmit={
						method === 'create'
						? this.onSubmitCreate
						: this.onSubmitEdit
					}
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
              {messages.productCategories && <div className={`alert alert-${messages.productCategories.type}`}>{messages.productCategories.message}</div>}
            </div>
						<div className="col-8">
							<Card
								body={[
									<h6 className='card-title'>
										Category
									</h6>,
									<div className='row'>
										<div className="form-group col-6">
											<label>Title</label>
											<Field
												name={`title`}
												component="input"
												type='text'
												placeholder="Title"
												className="form-control"
											/>
										</div>
										<div className="form-group col-6">
											<label>Slug</label>
											<Field
												name={`slug`}
												component="input"
												type='text'
												className="form-control"
												placeholder="slug"
											/>
										</div>
										<div className="form-group col-12">
											<label>Description</label>
											<Field
												name={`description`}
												component="textarea"
												placeholder="Description"
												className="form-control"
											/>
										</div>
									</div>
								]}
							/>
						</div>
						<div className='col-4'>
						</div>
					</form>
					)}}
				/>
		]
	}
}
