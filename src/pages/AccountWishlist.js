import React from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'

import Navbar from '../components/Page/Navbar'
import Header from '../components/Page/Header'

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

	state = { data: {} }

	load = async () => {
		let { props } = this
		let { user, dispatch } = props

		let model = await this.fetchModel(user)

		if(model.response === 200){
			return {
				...model.data
			}
		}
	}

	fetchModel = async (user) => {
		return await fetchData(`/api/customer/wishlist/${user.customer._id}`)
	}

	componentDidMount = async () => {
		let { props } = this
		let { user, models, dispatch } = props
		console.log('user', user, this.props.user)
		this.setState({ loading: true })
			 const data = await this.load()
			 this.setState({ loading: false, data })

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

	deleteWishlist = async (e, id) => {
		let { props } = this
		let { user } = props

		e.preventDefault()
		let wishlist = await postData(`/api/customer/wishlist/pull/${user.customer._id}`, { product_id: id })
		if(wishlist.response === 200){
			this.setState({ loading: true })
				 const data = await this.load()
				 this.setState({ loading: false, data })
		}
	}

	render() {
		let { props } = this
		let { user, models, location } = props
		let { page } = getLocation(location)

		console.log('this.props', this.props)
		return [
		<div className={`container-fluid px-0 page page-account-wishlist`}>
			<div className='container' style={{ maxWidth: '1350px' }}>
				<div className="row">
					<div className='col-12'>
						<div className='card'>
							<div className='card-body'>
								<h6>Wishlist</h6>
								<div className='row'>
									{this.state.data &&  _.map(this.state.data, (item, key, arr)=>{
										return (
										<div className='col-4'>
											<div className='card border-0'>
												<div className='card-body p-0'>
													<div className="card-img-top-controls float-right p-3" style={{ position: 'absolute', right: '0px' }}>
														<a href="#" class="text-white close" onClick={e=>this.deleteWishlist(e, item._id)}>
															<i className="material-icons">close</i>
														</a>
													</div>
													{item.images && item.images[0] && <img src={item.images[0]} className='img-fluid'/>}
												</div>
												<div className='card-body p-0 mt-3'>
													<h6 className="card-title mb-1">{item.title}</h6>
													<p className="card-subtitle text-muted mb-3">${item.price}</p>
												</div>

											</div>
										</div>
									)})}
								</div>
							</div>
						</div>
					</div>



				</div>
			</div>
		</div>
		]
	}

}
