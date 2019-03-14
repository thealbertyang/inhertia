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
		this.state = { status: 'view' }
	}

	deleteCustomerShipping = async (e, id) => {
		let { props } = this
		let { user, dispatch } = props
		e.preventDefault()
		console.log('ID', id)
		let deleteCustomerShipping = await postData(`/api/customer/shipping/delete/${user.customer._id}`, { shipping_id: { value: id } } )
		if(deleteCustomerShipping.response === 200){
			User.authToken(dispatch)
		}
	}

	updateModel = async (id, fields) => {
		return await postData(`/api/user/customer/shipping/update/${user.customer._id}`, fields)
	}

	onSubmitEdit = async (values) => {
    let id = this.props.user._id
    let data = {
      ...values,
      roles: JSON.stringify(values.roles)
    }
    let update = await this.updateModel(id, data)
    if(update.response === 200){
        return formMessage('success', 'Successfully Updated.')
    }
    else {
        return formMessage('danger', 'Updating Failed.')
    }
  }


	render() {
		let { props } = this
		let { user, location } = props
		let { page, method } = getLocation(location)

		return [
			<Form
				keepDirtyOnReinitialize={true}
				onSubmit={this.onSubmitEdit}
				initialValues={this.props.user}
				mutators={{
						setName: (args, state, utils) => {
							utils.changeValue(state, 'name', () => 1)
						},
					}}
				render={({ mutators, submitError, submitting, handleSubmit, pristine, invalid, values }) => {
					return (
					<form onSubmit={handleSubmit} id={`editShippingForm`}>
						<Card
							body={[
								<div className='row'>
									<div className='col-6'>
										<h6 className='card-title'>Shipping</h6>
									</div>
									<div className='col-6 text-right'>
									{this.state.status == 'view' && (<a href='#' onClick={(e)=>{ this.addShipping(e) }}>Add</a>)}
									{this.state.status == 'manage' && (<button type='submit' className='btn btn-small py-1 btn-outline-success'>Save</button>)}
								</div>
							</div>,
							user.customer && (
								<div className='row mb-5'>
									{_.map(user.customer.shipping, (item, key, arr)=>{
										return (
											typeof item !== 'undefined' && item !== null
											? [
												<div className='col-1 d-flex align-items-center'>
													<i className='material-icons text-success'>check_circle</i>
												</div>,
												<div className='col-10 d-flex justify-content-start align-items-center'>
													<p className='mb-0'>{item.line}. Los Angeles, CA 90032</p>
												</div>,
												<div className='col-1 d-flex flex-column align-items-center justify-content-end'>
													<a href='#' onClick={(e)=>{ this.deleteCustomerShipping(e, item._id)}}><i className='material-icons text-secondary'>delete</i></a>
												</div>,
											]
											: null
										)
									})}
								</div>
							)
							]}
							/>
						{
							(this.state.status == 'manage') &&
								(
										<div className='form-row border-top pt-5'>
											<div className='form-group col-4'>
												<Input type='text' label='First Name' name='first_name' />
											</div>
											<div className='form-group col-4'>
												<Input type='text' label='Last Name' name='last_name'/>
											</div>
											<div className='form-group col-4'>
												<Input type='text' label='Phone' name='phone'/>
											</div>

											<div className='form-group col-8'>
												<Input label='Street Address' name='line1'/>
											</div>

											<div className='form-group col-4'>
												<Input type='text' label='Apt, Suite, etc..' name='line2'/>
											</div>

											<div className='form-group col-4'>
												<Input type='text' label='City' name='city'/>
											</div>

											<div className='form-group col-2'>
												<Input type='text' label='State' name='state'/>
											</div>

											<div className='form-group col-3'>
												<Input type='text' label='Post Code' name='postal_code'/>
											</div>

											<div className='form-group col-3'>
												<Input type='text' label='Country' name='country'/>
											</div>
										</div>
								)
						}
						</form>
					)}}/>
		]
	}

}
