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
export default class AccountProfile extends React.Component {
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

	updateModel = async (id, fields) => {
		return await postData(`/api/user/update/${id}`, fields)
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

	componentDidMount = async () => {
		let user = this.props.user
		let { base, page, method, params } = getLocation(this.props.location)
		let id = params[0]

		console.log('this. user!!@#@!#', user)
	//	this.setState({ loading: true })
		//	 const data = await this.load(id)
		//	 this.setState({ loading: false, data })
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
					<form onSubmit={handleSubmit} id={`editProfileForm`}>
						<Card
							body={[
									<h6 className='card-title'>Profile</h6>,
									<div className='form-row'>
                    <div className={`col-12`}>
          						{submitError && submitError}
          					</div>
										<div className='form-group col-6'>
											<label>First Name</label>
											<Field
												name={`first_name`}
												component="input"
												type='text'
												placeholder="First Name"
												className="form-control"
											/>
										</div>
										<div className='form-group col-6'>
											<label>Last Name</label>
											<Field
												name={`last_name`}
												component="input"
												type='text'
												placeholder="Last Name"
												className="form-control"
											/>
										</div>
										<div className='form-group col-12'>
											<label>Email</label>
											<Field
												name={`email`}
												component="input"
												type='text'
												placeholder="Email"
												className="form-control"
											/>
										</div>
										<div className='form-group col-12'>
											<label>Phone</label>
											<Field
												name={`phone`}
												component="input"
												type='text'
												placeholder="Phone"
												className="form-control"
											/>
										</div>
										<div className='form-group col-6'>
											<label>Password</label>
											<Field
												name={`password`}
												component="input"
												type='password'
												placeholder="Password"
												className="form-control"
											/>
										</div>
										<div className='form-group col-6'>
											<label>Password Confirm</label>
											<Field
												name={`password_confirm`}
												component="input"
												type='password'
												placeholder="Re-type Password"
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
				)}}
			/>
		]
	}

}
