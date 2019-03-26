import React from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'

import Card from '../../components/Page/Card'
import Footer from '../../components/Page/Footer'
import Navbar from '../../components/Page/Navbar'
import { Form, Field } from 'react-final-form'
import { FORM_ERROR } from "final-form"

import * as Cart from '../../actions/cart'
import * as User from '../../actions/user'
import { getLocation, redirect } from '../../actions/index'
import { fetchData, postData } from '../../utils'


const formMessage = (type, message) => {
  return { [FORM_ERROR]: <div className={`alert alert-${type}`}>{message}</div> }
}

@connect((store)=>{
	return {
		cart: store.cart,
		models: store.models,
		location: store.location,
		forms: store.forms,
		user: store.user,
		jwtToken: store.jwtToken,
	}
})
export default class Shipping extends React.Component {
	constructor(props){
		super(props)
		this.state = { view: 'hidden' }
	}

	deleteCustomerShipping = async (e, id) => {
		let { props } = this
		let { user, dispatch } = props
		e.preventDefault()
		console.log('ID', id)
		let deleteCustomerShipping = await postData(`/api/user/customer/shipping/delete/${user.customer._id}`, { shipping_id: id } )
		if(deleteCustomerShipping.response === 200){
			User.authToken({ dispatch })
		}
	}

	updateModel = async (id, fields) => {
		return await postData(`/api/user/customer/shipping/update/${this.props.user.customer._id}`, fields)
	}

	onSubmitCreate = async (values) => {
    let { props } = this
    let { user, dispatch } = props
    let id = this.props.user._id
    let data = {
      ...values,
      roles: JSON.stringify(values.roles)
    }
    let update = await this.updateModel(id, data)
    if(update.response === 200){
      User.authToken({ dispatch })
        return formMessage('success', 'Successfully Updated.')
    }
    else {
        return formMessage('danger', 'Updating Failed.')
    }
  }

  addShipping = (e) => {
    e.preventDefault()
    this.setState({ view: 'visible' })
  }

  componentDidMount = () => {
  }

	render() {
		let { props } = this
		let { user, location } = props
		let { page, method } = getLocation(location)

		return [
			<Form
				keepDirtyOnReinitialize={true}
				onSubmit={this.onSubmitCreate}
				mutators={{
						setName: (args, state, utils) => {
							utils.changeValue(state, 'name', () => 1)
						},
					}}
				render={({ mutators, submitError, submitting, handleSubmit, pristine, invalid, values }) => {
					return (
					<form onSubmit={handleSubmit} id={`editShippingForm`}>
						<Card
              className={`mb-4`}
							body={[
								<div className='row'>
									<div className='col-6'>
										<h6 className='card-title'>Shipping</h6>
									</div>
									<div className='col-6 text-right'>
								  </div>
  							</div>,
  							(user.customer && !_.isEmpty(user.customer.shipping)) ? _.map(user.customer.shipping, (item, key, arr)=>{
  										return (
  											typeof item !== 'undefined' && item !== null
  											? [
                          <div className='row'>
                            <div className='col-1 d-flex align-items-center'>
    													<i className='material-icons text-success'>check_circle</i>
    												</div>
    												<div className='col-10 d-flex justify-content-start align-items-center'>
    													<p className='mb-0'><span className='text-muted'>{item.first_name} {item.last_name}</span> <br/>{item.line1} {item.line2} {item.city}, {item.state} {item.postal_code}</p>
    												</div>
    												<div className='col-1 d-flex flex-column align-items-center justify-content-end'>
    													<a href='#' onClick={(e)=>{ this.deleteCustomerShipping(e, item._id)}}><i className='material-icons text-secondary'>delete</i></a>
    												</div>
                          </div>
  											]
  											: null
  										)
  									})

                    :

                    (
                      <div className='row'>
                        <div className='col-12'>
                          <p className='mb-0'>You haven't saved any payment methods.</p>
                        </div>
                      </div>
                    ),

							]}
							/>

              <Card
                body={[
                  <div className='row'>
  									<div className='col-6'>
  										<h6 className='card-title'>Add Shipping</h6>
  									</div>
  									<div className='col-6 text-right'>
  								  </div>
    							</div>,
                  <div className='form-row'>
                    <div className='form-group col-4'>
                      <Field
                        name={`first_name`}
                        component="input"
                        type='text'
                        placeholder="First Name"
                        className="form-control"
                      />
                    </div>
                    <div className='form-group col-4'>
                      <Field
                        name={`last_name`}
                        component="input"
                        type='text'
                        placeholder="Last Name"
                        className="form-control"
                      />
                    </div>
                    <div className='form-group col-4'>
                      <Field
                        name={`phone`}
                        component="input"
                        type='text'
                        placeholder="Phone"
                        className="form-control"
                      />
                    </div>

                    <div className='form-group col-8'>
                      <Field
                        name={`line1`}
                        component="input"
                        type='text'
                        placeholder="Street Address"
                        className="form-control"
                      />
                    </div>

                    <div className='form-group col-4'>
                      <Field
                        name={`line2`}
                        component="input"
                        type='text'
                        placeholder="Apt, Suite, etc.."
                        className="form-control"
                      />
                    </div>

                    <div className='form-group col-4'>
                      <Field
                        name={`city`}
                        component="input"
                        type='text'
                        placeholder="City"
                        className="form-control"
                      />
                    </div>

                    <div className='form-group col-2'>
                      <Field
                        name={`state`}
                        component="input"
                        type='text'
                        placeholder="State"
                        className="form-control"
                      />
                    </div>

                    <div className='form-group col-3'>
                      <Field
                        name={`postal_code`}
                        component="input"
                        type='text'
                        placeholder="Postal Code"
                        className="form-control"
                      />
                    </div>

                    <div className='form-group col-3'>
                      <Field
                        name={`country`}
                        component="input"
                        type='text'
                        placeholder="Country"
                        className="form-control"
                      />
                    </div>

                    <div className='form-group col-6'>
                      <button type='submit' className='btn btn-small py-1 btn-primary'>Save</button>
                    </div>
                  </div>
                ]}
              />

						</form>
					)}}/>
		]
	}

}
