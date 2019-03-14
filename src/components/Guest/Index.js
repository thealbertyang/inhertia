import React from 'react'
import Navbar from '../Navbar'
import { fetchData, postData } from '../../utils'
import * as User from '../../actions/user'
import { Form, Input } from '../Form'
import { connect } from 'react-redux'
import { getLocation, redirect } from '../../actions/index'


@connect((store)=>{
	return {
		forms: store.forms,
		user: store.user,
		jwtToken: store.jwtToken,
		location: store.location,
	}
})

export default class Index extends React.Component {
	constructor(props){
		super(props)
	}
/*
	loadOrder = async () => {
		let { props } = this
		let { dispatch, forms } = props

		console.log('did we get in here?')
		let guestOrder = await postData(`/api/user/guestOrder`, forms['guestOrder'].inputs)
		if(guestOrder.response === 200){
		console.log('did we get in here? logun,', guestOrder)
			Form.set({ name: 'guestOrder', inputs: forms['guestOrder'].inputs, status: '', message: '', dispatch })
			await User.authToken({ dispatch })
			await dispatch({ type: 'ACCOUNT' })
		}
		else {
			Form.set({ name: 'guestOrder', inputs: forms['guestOrder'].inputs, status: 'error', message: guestOrder.message, dispatch })
		}
	}
*/

	loadOrder = async () => {
		let { props } = this
		let { forms, dispatch } = props
		let guestOrder = await fetchData(`/api/order/guest/${forms['guestOrder'].inputs['order_id'].value}`)
		if(guestOrder.response === 200){
			window.location.href = `/guest/order/${forms['guestOrder'].inputs['order_id'].value}`
		}
		else {
			Form.set({ name: 'guestOrder', inputs: forms['guestOrder'].inputs, status: 'error', message: guestOrder.message, dispatch })
		}

	}

	componentDidUpdate = () => {
		let { props } = this
		let { forms } = props

		console.log('this.props', this.props)
		Form.didSubmit({ name: 'guestOrder', form: forms['guestOrder'] }) && this.loadOrder()
	}


	render(){
		let { props } = this
		let { forms, location, dispatch } = props
		let { base, page, method, params } = getLocation(location)
		console.log('guestOrder', this.props)
		let inputs = forms['guestOrder'] && forms['guestOrder'].inputs

		return (
			<div className="page page-guest container-fluid px-0" style={{ flex: '1 1', background: 'url(/img/shop/guest.jpg) center center / cover no-repeat'}}>
			    <Navbar />
				<div className={`section-container`}>
					<div className={`col-5 offset-7 h-100 d-flex flex-column align-items-end`}>
						<h1 className="text-center text-white d-flex flex-row justify-content-center">
							Welcome Guest <span class='h3 mb-0 ml-2' style={{ alignSelf: 'center' }}>👋</span>
						</h1>
						<h5 className="text-center mb-4" style={{ color: '#eaeaea', fontWeight: '300' }}>Enter the order ID to check status of your order</h5>
						
						<Form name={'guestOrder'}>
							<div className="form-row my-4">
								{forms && forms['guestOrder'] && forms['guestOrder'].status === 'error' && (
									<div className='form-group col-12'>
										<div className='alert alert-danger text-center'>
											{forms['guestOrder'].message}
										</div>
									</div>
								)}
								<div className="form-group col-12">
									<Input type='text' name='order_id' placeholder='Enter order id' className='input-material' />
								</div>
								<div className="form-group col-12">
									<button type='submit' className='form-control input-material'>Submit</button>
								</div>

								<div className="col-12 d-flex justify-content-between px-0">
							  		<a href={`/register`} style={{ color: '#ceedff' }}>Register Account</a> <a href="/forgotPassword" style={{ color: '#ceedff' }}>Forgot Password</a>
							  	</div>
							</div>
						</Form>
					</div>
				</div>
			</div>
		)
	}
}
