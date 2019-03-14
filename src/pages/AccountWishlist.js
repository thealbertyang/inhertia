import React from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'

import Navbar from '../components/Page/Navbar'
import Header from '../components/Page/Header'

import { Form, Input } from '../components/Form'
import { getLocation } from '../actions/index'
import { fetchData, postData, deleteData } from '../utils'
import * as Models from '../actions/models'

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
export default class AccountWishlist extends React.Component {
	constructor(props){
		super(props)
	}

	componentDidMount = async () => {
		let { props } = this
		let { user, models, dispatch } = props
		console.log('user', user, this.props.user)
		if(!_.has(models, 'wishlist')){
			let wishlist = await fetchData('/api/customer/wishlist/'+props.user.customer._id)
			if(wishlist.response == 200){
			await Models.set('wishlist', wishlist.data, dispatch)

					/*_.map(models.data, (item, key, arr)=>{
						this.state.flashDates[key] = moment(item.flash_date)
					})*/
			}
		}
	}

	deleteAllWishlist = async (e) => {
		let { props } = this
		let { user } = props

		e.preventDefault()
		let wishlist = await deleteData(`/api/customer/wishlist/delete/${user.customer._id}`)
		if(wishlist.response === 200){
			console.log('successfully deleted')
		}
	}

	render() {
		let { props } = this
		let { user, models, location } = props
		let { page } = getLocation(location)

		console.log('this.props', this.props)
		return [
		<div className={`container-fluid px-0 page page-account-wishlist`}>
			<Header/>
			<div className='container my-5 py-5' style={{ maxWidth: '1350px' }}>
				<div className="row">
					<div className='col-6'>
						<h5>Wishlist</h5>
					</div>
					<div className='col-6 text-right'>
						<a href='#' className='btn btn-outline-success' onClick={(e)=>{ this.deleteAllWishlist(e) }}>Delete All</a>
					</div>
					<div className='col-12'>
						<hr className='my-3' />
					</div>
					{_.has(models, 'wishlist') && _.map(models['wishlist'], (item, key, arr)=>(
						<div className='col-3'>
							<div className='card'>
								<div className='card-body' style={{ height: '20rem', background: `url(${item.images ? item.images[0] : ''}) center center / cover no-repeat` }}>
								</div>
								<div className='card-body'>
									{item.title}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
		]
	}

}
