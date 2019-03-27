import React from 'react'
import { connect } from 'react-redux'

import * as _ from 'lodash'

import Card from '../../components/Admin/Card'
import Header from '../../components/Admin/Header'
import { Form, Field } from 'react-final-form'

import { fetchData, postData } from '../../utils'
import { getLocation, redirect } from '../../actions/index'
import Models from '../../actions/models'
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
		return await fetchData(`/api/discount/${id}`)
	}

	updateModel = async (id, fields) => {
		return await postData(`/api/discount/update/${id}`, fields)
	}

	createModel = async (fields) => {
		return await postData(`/api/discount/create`, fields)
	}

	onSubmitCreate = async (values) => {
		let { base, page, method, params } = getLocation(this.props.location)
		let data = {
			...values,
			sizes: JSON.stringify(values.sizes),
			colors: JSON.stringify(values.colors)
		}
		let create = await this.createModel(data)
		if(create.response === 200){
        this.props.dispatch(redirect('ADMIN', page))
    }
		else if(create.response === 409){
      Messages.set('Campaigns', { message: 'Duplicate Product.', type: 'danger' }, this.props.dispatch)
    }
    else {
      Messages.set('Campaigns', { message: 'Creating Failed.', type: 'danger' }, this.props.dispatch)
    }
	}

  onSubmitEdit = async (values) => {
    let { base, page, method, params } = getLocation(this.props.location)
    let id = params[0]
    let data = {
      ...values,
      sizes: JSON.stringify(values.sizes),
      colors: JSON.stringify(values.colors)
    }
    let update = await this.updateModel(id, data)
		if(update.response === 200){
			Messages.set('Campaigns', { message: 'Successfully updated.', type: 'success' }, this.props.dispatch)
    }
    else {
      Messages.set('Campaigns', { message: 'Updating failed.', type: 'success' }, this.props.dispatch)
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
		let { location, messages, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		return [
			<Form
				keepDirtyOnReinitialize={true}
				onSubmit={
            method === 'create'
            ? this.onSubmitCreate
            : this.onSubmitEdit
          }
				mutators={{
						setName: (args, state, utils) => {
							utils.changeValue(state, 'name', () => 1)
						},
					}}
				initialValues={this.state.data}
				render={({
					mutators,
					submitError,
					submitting,
					handleSubmit,
					pristine,
					invalid,
					values,
					}) => (
					<form onSubmit={handleSubmit} className={`row px-5`} id={`createEditForm`}>
						<div className={`col-12`}>
							{messages.Campaigns && <div className={`alert alert-${messages.Campaigns.type}`}>{messages.Campaigns.message}</div>}
						</div>
						<div className="col-8">
							<Card
								classes={`mb-4`}
								body={[
									<h6 className='card-title'>Discount</h6>,
									<div className='row'>
										<div className="form-group col-6">
											<Field name="title">
												{({ input, meta }) => [
														<label>Title</label>,
														<input type="text" {...input} placeholder="Enter title" className={`form-control`} />,
														meta.touched && meta.error && <span>{meta.error}</span>,
												]}
											</Field>
										</div>
										<div className="form-group col-6">
											<Field name="expire_date">
												{({ input, meta }) => [
														<label>Expire Date</label>,
														<input type="date" {...input} placeholder="Expire Date" className={`form-control`} />,
														meta.touched && meta.error && <span>{meta.error}</span>,
												]}
											</Field>
										</div>
										<div className="form-group col-4">
											<Field name="discount_code">
												{({ input, meta }) => [
														<label>Discount Code</label>,
														<input type="text" {...input} placeholder="Discount Code" className={`form-control`} />,
														meta.touched && meta.error && <span>{meta.error}</span>,
												]}
											</Field>
										</div>
										<div className="form-group col-4">
											<label>Discount Type</label>
											<Field name="discount_type" component="select" className={`form-control`}>
												<option value='cart'>Cart</option>
												<option value='shipping'>Shipping</option>
											</Field>
										</div>
										<div className="form-group col-4">
											<Field name="discount_value">
												{({ input, meta }) => [
														<label>Discount Value</label>,
														<input type="text" {...input} placeholder="Discount Value" className={`form-control`} />,
														meta.touched && meta.error && <span>{meta.error}</span>,
												]}
											</Field>
										</div>
									</div>
								]}
							/>
						</div>
						<div className='col-4'>
						</div>
					</form>
				)}
			/>
		]

	}
}
