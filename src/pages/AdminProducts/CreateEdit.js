import React from 'react'
import { connect } from 'react-redux'

import * as _ from 'lodash'
import moment from 'moment'

import { FORM_ERROR } from "final-form"
import { Form, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'

import Card from '../../components/Admin/Card'
import ImagesUpload from '../../components/Form/ImagesUpload'
import Avatar from '../../components/Page/Avatar'

import { fetchData, postData } from '../../utils'
import { getLocation, redirect } from '../../actions/index'

import * as Messages from '../../actions/messages'
import createDecorator from 'final-form-calculate'

const formMessage = (type, message) => {
  return { [FORM_ERROR]: <div className={`alert alert-${type}`}>{message}</div> }
}


@connect((store)=>{
	return {
		forms: store.forms,
		models: store.models,
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
		return await fetchData(`/api/product/${id}`)
	}

	updateModel = async (id, fields) => {
		return await postData(`/api/product/update/${id}`, fields)
	}

	createModel = async (fields) => {
		return await postData(`/api/product/create`, fields)
	}

	round = (number) => {
		var num = Number(number) //, rounded = theform.rounded
		num = num ? num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0] : 0
		return Number(num)
	}

  calculator = createDecorator(
  {
    field: /cost|markup/, // when a field matching this pattern changes...
    updates: {
      // ...update the total to the result of this function
      price: (ignoredValue, allValues) =>
        (Number(allValues.cost) + Number(allValues.markup))
    }
  })

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
      sizes: JSON.stringify(values.sizes),
      colors: JSON.stringify(values.colors)
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
				onSubmit={
            method === 'create'
            ? this.onSubmitCreate
            : this.onSubmitEdit
          }
				initialValues={this.state.data}
        decorators={[this.calculator]}
				mutators={{
						setName: (args, state, utils) => {
							utils.changeValue(state, 'name', () => 1)
						},
						...arrayMutators
					}}
				render={({
					mutators,
					submitError,
					submitting,
					handleSubmit,
					pristine,
					invalid,
					values,
					form: {
          	mutators: { push, pop }
        	}}) => (
					<form onSubmit={handleSubmit} className={`row px-5`} id={`createEditForm`}>
						{/*}<pre style={{ maxWidth: '400px' }}>{JSON.stringify(values, 0, 2)}</pre>*/}
            <div className={`col-12`}>
							{messages.products && <div className={`alert alert-${messages.products.type}`}>{messages.products.message}</div>}
						</div>
						<div className="col-12 col-md-8">
							<Card
								className='mb-4'
								body={[
                  <h6 className='card-title'>
                    Product
                  </h6>,
                  <div className="row">
  									<div className="form-group col-12 d-none">
  											{method == 'edit' && <input type="hidden" name="_id" label='Id' placeholder="Enter id" disabled />}
  									</div>
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
  										<Field name="slug">
  											{({ input, meta }) => [
  													<label>Slug</label>,
  													<input type="text" {...input} placeholder="Enter slug" className={`form-control`} />,
  													meta.touched && meta.error && <span>{meta.error}</span>,
  											]}
  										</Field>
  									</div>
  									<div className="form-group col-12">
  										<Field name="description">
  											{({ input, meta }) => [
  													<label>Description</label>,
  													<textarea {...input} placeholder="Enter description" className={`form-control`} />,
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
                    Pricing
                  </h6>,
                  <div className="row">
  									<div className={'form-group col-4'}>
  										<Field name="cost">
  											{({ input, meta }) => [
  													<label>Cost</label>,
  													<input type="number" {...input} placeholder="Cost of product" className={`form-control`} />,
  													meta.touched && meta.error && <span>{meta.error}</span>,
  											]}
  										</Field>
  									</div>
  									<div className="form-group col-1 d-flex justify-content-center align-items-center">
  										<div className='mt-4'>+</div>
  									</div>
  									<div className={`form-group col-3`}>
  										<Field name="markup">
  											{({ input, meta }) => [
  													<label>Markup</label>,
  													<input type="number" {...input} placeholder="Markup" className={`form-control`} />,
  													meta.touched && meta.error && <span>{meta.error}</span>,
  											]}
  										</Field>
  									</div>
  									<div className="form-group col-1 d-flex justify-content-center align-items-center">
  										<div className='mt-4'>=</div>
  									</div>
  									<div className="form-group col-3">
  										<Field name="price">
  											{({ input, meta }) => [
  													<label>Price</label>,
  													<input type="number" {...input} placeholder="Price Total" className={`form-control`} disabled />,
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
                      <h6>
                        Images
                      </h6>
  									</div>
  									<div className='card-controls col-6 mb-0 d-flex align-items-center justify-content-end'>
  										<a href='#'><i className='material-icons'>add_a_photo</i></a>
  									</div>
                  </div>,
                  <div className='row'>
                    <div className="form-group col-12">
  									<Field
  											name="images"
  											component={ImagesUpload}
  											fullWidth
  											margin="normal"
  											label="Images upload"
  										/>
                      </div>
                  </div>
								]}
							/>
							<Card
								className='mb-4'
                body={[
                  <div className='row'>
                    <div className='card-title col-6'>
                      <h6>
                        Reviews
                      </h6>
  									</div>
  									<div className='card-controls col-6 mb-0 d-flex align-items-center justify-content-end'>
  									</div>
                  </div>,
                  <div className='row'>
                    <div className="form-group col-12">
                    <table className="table responsive table-hover mb-0">
                     <tbody className={`py-4`}>
                      <FieldArray name="reviews">

                         {({ fields }) =>
                           fields.map((name, index) => [
														 <tr key={name}>
																<td className={`py-5`} width='10%'>
                                  <Avatar src={_.has(fields.value[index].user,'avatar') && fields.value[index].user.avatar} size='medium' />
																</td>
																<td className={`text-justify py-5`}>
																	<span style={{ fontWeight: '500' }}>{_.has(fields.value[index].user,'username') && fields.value[index].user.username}</span>&nbsp; <span className={`text-muted mb-2`}>{moment(fields.value[index].date).format("MMM Do YYYY")}</span><br/>
																	<div className='col-12 mt-2 mb-3 px-0 d-flex align-items-center'>
																		<i className='material-icons' style={{ fontSize: '1rem', color: '#ffbf00' }}>star</i>
																		<i className='material-icons' style={{ fontSize: '1rem', color: '#ffbf00' }}>star</i>
																		<i className='material-icons' style={{ fontSize: '1rem', color: '#ffbf00' }}>star</i>
																		<i className='material-icons' style={{ fontSize: '1rem', color: '#ffbf00' }}>star</i>
																		<i className='material-icons' style={{ fontSize: '1rem', color: '#ffbf00' }}>star</i>
																	</div>
																	<p>
                                    {fields.value[index].comment}
																	</p>
																</td>
                                <td className={`py-5 text-right`}>
                                  <span
                                    onClick={() => fields.remove(index)}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <i className='fas fa-trash'></i>
                                  </span>
                                </td>
															</tr>,
                          ])
                         }
                       </FieldArray>
                       </tbody>
                     </table>
                    </div>
                  </div>
								]}
							/>
						</div>
						<div className='col-12 col-md-4 d-flex flex-column'>
              <Card
                className='mb-4 order-3 order-md-1'
                body={[
                  <div className='row'>
										<div className='card-title col-6'>
                      <h6>
                        Details
                      </h6>
										</div>
										<div className='card-controls col-6 mb-0 d-flex justify-content-end'>
											<a href={`/product/`} target='_blank'><i className='material-icons'>pageview</i></a>
										</div>
									</div>,
                  <div className='row'>
										<div className={`form-group col-12`}>
											<label>
												Status
											</label>
											<Field name="status" component="select" className={`form-control`}>
												<option value='draft'>Draft</option>
												<option value='published'>Published</option>
											</Field>
										</div>
									</div>
                ]}
              />

							<Card
								className='mb-4 order-2 order-md-2'
								body={[
                  <h6 className='card-title'>
                    Colors
                  </h6>,
                  <div className='row'>
  									<div className="form-group col-12">
  										<div className="input-group">
  												<Field name="color" component="input" className="form-control" />
  												<div className="input-group-append">
  												<button
  													type="button"
  													onClick={() => push('colors', values.color)}
  													className={`btn btn-primary`}
  												>
  													Add Color
  												</button>
  												</div>
  										</div>
  									</div>
  									<FieldArray name="colors">
  									 {({ fields }) =>
  										 fields.map((name, index) => [
  											 <div className="form-group col-10" key={name}>
  												 {fields.value[index]}
  												</div>,
  												<div className="form-group col-2 d-flex justify-content-end" key={name}>
  												 <span
  													 onClick={() => fields.remove(index)}
  													 style={{ cursor: 'pointer' }}
  												 >
  													 ❌
  												 </span>
  											 </div>
  										])
  									 }
  								 </FieldArray>
                  </div>
								]}
							/>

							<Card
  							className='mb-4 order-1 order-md-3'
  							body={[
                  <h6 className='card-title'>
                    Sizes
                  </h6>,
                  <div className='row'>
    								<div className="form-group mb-0 col-12">
                      <label>
                        <Field
                          name="sizes"
                          component="input"
                          type="checkbox"
                          value="xs"
                        />
                        {' '}
                        Extra Small
                      </label>
                    </div>
                    <div className="form-group mb-0 col-12">
                      <label>
                        <Field
                          name="sizes"
                          component="input"
                          type="checkbox"
                          value="small"
                        />
                        {' '}
                        Small
                      </label>
                    </div>
                    <div className="form-group mb-0 col-12">
                      <label>
                        <Field
                          name="sizes"
                          component="input"
                          type="checkbox"
                          value="medium"
                        />
                        {' '}
                        Medium
                      </label>
                    </div>
                    <div className="form-group mb-0 col-12">
                      <label>
                        <Field
                          name="sizes"
                          component="input"
                          type="checkbox"
                          value="large"
                        />
                        {' '}
                        Large
                      </label>
    								</div>
                  </div>
  							]}/>
						</div>
					</form>
					)}
				/>
		]
	}
}
