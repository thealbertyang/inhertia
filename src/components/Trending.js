import React from 'react'
import { connect } from 'react-redux'
import universal from 'react-universal-component'
import Link from 'redux-first-router-link'

import * as _ from 'lodash'
import moment from 'moment'
import Countdown from 'react-countdown-moment'

import { fetchData, postData } from '../utils'
import { getLocation, setForm } from '../actions/index'
import * as Models from '../actions/models'
import * as Cart from '../actions/cart'
import * as User from '../actions/user'

import { Form, Input, ColorRadio, SizeRadio } from './Form'

@connect((store)=>{
	return {
		cart: store.cart,
		forms: store.forms,
		models: store.models,
		user: store.user,
	}
})
export default class Index extends React.Component {
	constructor(props){
		super(props);
		this.state = { flashDates: [] }
	}
	
	componentDidMount = async () =>{
	let { models, dispatch } = this.props
		
		//prevent RHL from infinite reload
		if(!_.has(models, 'trendingProducts')){
			let trendingProducts = await fetchData(`/api/reports/getTrendingProducts`)
			if(trendingProducts.response == 200){
				//dispatch(Form.set(formName, _.mapValues(model.data, (input, key)=>( key == 'images' ? images : { value: input }))))
				_.map(trendingProducts.data, (item, key, arr)=>{
					this.state.flashDates[key] = moment(item.flash_date)
				})

				Models.set('trendingProducts', trendingProducts.data, dispatch)
			}
		} 

		await Cart.loadItems(dispatch)

	}

	addToWishlist = async (e, product_id) => {
		e.preventDefault(e)
		let { dispatch, user } = this.props


		let model = await postData('/api/customer/wishlist/push/'+this.props.user.customer._id, { product_id: {	value: product_id } })
		if(model.response == 200){
			let trendingProducts = await fetchData(`/api/reports/getTrendingProducts`)
			if(trendingProducts.response == 200){
				//dispatch(Form.set(formName, _.mapValues(model.data, (input, key)=>( key == 'images' ? images : { value: input }))))
				_.map(trendingProducts.data, (item, key, arr)=>{
					this.state.flashDates[key] = moment(item.flash_date)
				})

				Models.set('trendingProducts', trendingProducts.data, dispatch)
				//await this.fetchLightInTheBoxProduct()
			}
			console.log('this push was successful')
		}
		

	}

	toggleColorSelect = (e,name) => {
		e.preventDefault()

		if(typeof this.state.colorSelect === 'undefined' || typeof this.state.colorSelect[name] === 'undefined'){
			this.setState({ colorSelect: { [name]: 'open' } })
		}
		else {
			this.setState({ colorSelect: { [name]: this.state.colorSelect[name] === 'open' ? 'closed' : 'open'} })
		}
	}


	toggleSizeSelect = (e,name) => {
		e.preventDefault()

		if(typeof this.state.sizeSelect === 'undefined' || typeof this.state.sizeSelect[name] === 'undefined'){
			this.setState({ sizeSelect: { [name]: 'open' } })
		}
		else {
			this.setState({ sizeSelect: { [name]: this.state.sizeSelect[name] === 'open' ? 'closed' : 'open'} })
		}
	}

	addCartModal = async () => {
		await this.setState({ cartModal: 'on' })
	}

	closeModal = async () => {
		await this.setState({ cartModal: 'off' })
	}

	addToCart = async (e, id) => {
		e.preventDefault()

		let { props } = this
		let { forms, dispatch } = props


		let color = Form.fetchOne({ [`cartAdd${id}`]: 'color' }, forms).value
		let size = Form.fetchOne({ [`cartAdd${id}`]: 'size' }, forms).value
		let quantity = Form.fetchOne({ [`cartAdd${id}`]: 'qty' }, forms).value

		if(typeof quantity === 'undefined' || Number(quantity) <= 0){
			quantity = 1
		}

		Cart.incrementItem({ id, color, size, quantity })
	
		console.log('add this to cart', color, size, id, forms)

		Cart.loadItems(dispatch)

		await this.addCartModal()
	}

	selectImage = (e, id, key) => {
		e.preventDefault()
		this.setState({ 
			productImages: { 
				...this.state.productImages,
				[id]: key
			} 
		})
	}

	render() { 
		let { cart, forms, models, dispatch } = this.props

		console.log('this.props state doe', this.props, this.state)
		if(models && models['trendingProducts'] && models['trendingProducts']){

			return (
				<div className="trendingProducts container-fluid" style={{ background: '#303656 url(/img/shop/trending-bg.png) center center / cover no-repeat' }}>
					<div className="container p-5">
						<div className="row">
							<div className='col-12'>
								<h1 style={{ fontFamily: 'Graphik Web', fontWeight: '200', fontSize: '3rem' }} className='mb-5 text-white text-center'>Trending</h1> 
							</div>

						    <div className={`modal modalCart ${(_.has(this,'state.cartModal') && this.state.cartModal === 'on') ? 'active' : 'inactive'} `} id='test'>
						        <div className="modal-dialog" role="document">
							        <div className="modal-content">
							        	{/*<div className="modal-frosted" style={{
										    backgroundColor: '#ffffff14',
										    background: 'inherit',
										    filter: 'blur(4px)',
										    height: '100%',
										    width: '100%',
										}}>

										</div>*/}
						          		<div className="modal-header">
						           			<h5 className="modal-title">Added To Your Cart</h5>
						            		<button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={e=>this.closeModal(e)}>
						              			<span aria-hidden="true">&times;</span>
						            		</button>
						          		</div>
								        <div className="modal-body">
								        	{
									        	_.has(cart,'items') 
									        	&& 
									        	_.map(cart.items, (item, key, arr)=>{
									        		if(key === 0){
									            		return (
									            			<div className='row'>
									            				<div className='col-12'>
									            					<img src={`${ _.has(item, 'images') ? item.images[0] : '' }`} className='w-100' />
									            				</div>
									            				<div className='col-12'>
									            					{item.title && item.title}
									            				</div>
									            				<div className='col-12'>
									            					{item.price && item.price} x {item.quantity && item.quantity}
									            				</div>
									            			</div>
									            		)
								            		}
									            })
									        }
						         		</div>
						         		<div className="modal-footer">
								            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={e=>this.closeModal(e)}>Close</button>
						         		</div>
						         	</div>
						         </div>

						    </div>

							{_.map(models['trendingProducts'], (item, key, arr)=>{

								if((key + 1) <= 2){
									return (
									 <div className={`col-md-4 col-sm-12`} key={key}>
										<div className={`card ${(item.flash_status && item.flash_status === 'on') && 'flash'} ${typeof item.flash_stock !== 'undefined' ? ((item.flash_stock > 0) ? '' : 'disabled') : ''} `}>
											<div className="card-img-top" style={{ background: 'url('+item.images[_.has(this,'state.productImages.'+item._id) ? this.state.productImages[item._id] : 0]+') center center / cover no-repeat' }}>
												<div className='row h-100 mx-0 ' style={{ background: 'url(/img/shop/trending-dark-mask.png) center center / cover no-repeat' }}>

									 				<a href={`/product/${item.slug}`}>
														<div style={{ position: 'absolute', height: '100%', width: '100%' /*, backgroundColor: '#000000bf'*/ }}>
														</div>
													</a>

													<div className='col-6 p-3 d-flex flex-column align-items-start justify-content-start' style={{ visibility: (item.flash_status ? (item.flash_status == 'on' ? 'visible' : 'hidden') : 'hidden') }}>
														<span className='text-center'>
															<a href='#' className='text-white'>
																<p className='mb-0'>
																	{typeof item.flash_stock !== 'undefined' ? ((item.flash_stock > 0) ? (<i className='material-icons icon-flash'>flash_on</i>) : (<i className='material-icons icon-soldout'>cancel</i>)) : ''} 
																</p> 
															</a>
															<span className='font-weight-normal text-center text-white d-block' style={{ fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Sale</span>
															<span className='text-uppercase font-weight-light text-center text-white d-block' style={{ fontSize: '0.8rem' }}>{/*5:00:21 */}
 																{item.flash_type == 'date' ? <Countdown endDate={this.state.flashDates[key]} /> : ((item.flash_stock > 0) ? item.flash_stock+' Stock' : 'Out of Stock')}
															</span>
														</span>
													</div>

													<div className='col-6 p-3 d-flex flex-column align-items-end'>
														<span className='text-center'>
															
															<a href='#' className={`likeHeart ${(_.has(this.props.user, 'customer.wishlist') && _.find(this.props.user.customer.wishlist, { id: item._id }) > -1) ? 'active' : ''}`} onClick={e=>this.addToWishlist(e, item._id)}>
																<i className='material-icons d-block'>favorite</i>
															</a>

															<span className='text-uppercase font-weight-bold text-center text-white d-block' style={{ fontSize: '1rem', fontSize: '1.1rem', textTransform: 'uppercase' }}>{item.likes}</span>
															<span className='text-uppercase font-weight-light text-center text-white d-block' style={{ fontSize: '0.8rem' }}>likes</span>
														</span>
													</div>

													<div className='col-3 offset-9 d-flex flex-column align-items-end justify-content-end'>

														<Form name={`cartAdd${item._id}`} className='row h-100 d-flex flex-column align-items-center justify-content-end'>

															<div className={`col-12 imageOptions ${((_.has(this.state, 'colorSelect.'+item._id+'Color') && this.state.colorSelect[item._id+'Color'] === 'open') || (_.has(this.state, 'sizeSelect.'+item._id+'Size') && this.state.sizeSelect[item._id+'Size'] === 'open')) ? 'closed' : 'open'}`}>
																<div className='row' style={{ position: 'absolute', right: '0', bottom: '0', width: '5rem' }}>
																	<div className='col-12'>
																		{_.has(item,'images') && _.map(item.images, (image, key, arr)=>{
																			return (
																				<img src={image} style={{ width: '35px' }} onClick={e=>this.selectImage(e, item._id, key)} />
																			)
																		})}
																	</div>
																</div>
															</div>


															{_.has(item, 'importData.attributes') && 
																<div className='colorOptions col-12'>
																	<ColorRadio name='color' className={`${(typeof this.state.colorSelect !== 'undefined' && this.state.colorSelect[item._id+'Color'] === 'open') ? 'open' : 'closed'}`} options={item.importData.attributes[0].items} onChange={(e)=>{this.toggleColorSelect(e, item._id+'Color')}}/>
																</div>
															}



															{_.has(item, 'importData.attributes') && 
																<div className='sizeOptions col-12'>
																	<SizeRadio name='size' className={`${(typeof this.state.sizeSelect !== 'undefined' && this.state.sizeSelect[item._id+'Size'] === 'open') ? 'open' : 'closed'}`} options={item.importData.attributes[1].items} onChange={e=>this.toggleSizeSelect(e, item._id+'Size')} />
																</div>
															}
															
														</Form>

													</div>

													<div className='col-6 p-3 d-flex flex-column align-items-start justify-content-end'>
															<div className='row'>
																<div className='col-12'>
																	<h6 className='font-weight-normal text-white title'>{item.title}</h6>
																</div>
															</div>
															<div className='row'>
																<div className='col-12'>
																	<span style={{ color: '#ffd456' }}>
																		{(!item.ratingAverage || item.ratingAverage == 0) && [
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star_border</i>,
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star_border</i>,
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star_border</i>,
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star_border</i>,
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star_border</i>,
																		]}	

																		{item.ratingAverage == 1 && [
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star</i>,
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star_border</i>,
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star_border</i>,
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star_border</i>,
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star_border</i>,
																		]}																		

																		{item.ratingAverage == 2 && [
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star</i>,
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star</i>,
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star_border</i>,
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star_border</i>,
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star_border</i>,
																		]}

																		{item.ratingAverage == 3 && [
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star</i>,
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star</i>,
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star_border</i>,
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star_border</i>,
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star_border</i>,
																		]}

																		{item.ratingAverage == 4 && [
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star</i>,
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star</i>,
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star</i>,
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star</i>,
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star_border</i>,
																		]}

																		{item.ratingAverage == 5 && [
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star</i>,
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star</i>,
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star</i>,
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star</i>,
																			<i className='material-icons' style={{ fontSize: '1rem' }}>star</i>,
																		]}
																	</span>
																	<span>
																		<small style={{ color: '#56ff74' }}>({item.ratingAmount})</small>
																	</span>
																</div>
															</div>
															<div className='row'>
																<div className='col-12'>
																	<p className='mb-0 text-white price'>${(item.flash_status && item.flash_status === 'on' ? (<span>{item.price} <span style={{ textDecoration: 'line-through', opacity: '0.6' }}> {(Number(Number(item.flash_sale_amount) + Number(item.price)).toFixed(2))}</span> </span>) : item.price)}</p>
																</div>
															</div>
													</div>
													<div className='col-6 p-3 d-flex flex-column align-items-end justify-content-end'>
														<div className='row h-100 d-flex flex-column align-items-center justify-content-end'>

																<div className='col-12 d-flex flex-row align-items-center mb-0'>
																	
																	<div className='form-row'>
																		<div className='col-12 d-flex flex-row justify-content-end'>

																			<span className='font-weight-normal mt-2 mb-2 text-center text-white d-block' style={{ fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Quick Buy</span>

																		</div>

																		<div className='col-12 d-flex flex-row align-items-center justify-content-end'>
																			<a href="#" className="colorSelect" style={{ background: `url(${Form.fetchOne({ [`cartAdd${item._id}`]: 'color' }, forms).value ? _.find(item.importData.attributes[0].items, { id: Form.fetchOne({ [`cartAdd${item._id}`]: 'color' }, forms).value }).sku_img  : ''}) center center / cover ` }} onClick={e=>this.toggleColorSelect(e, item._id+'Color')}></a>


																		


																			<a href="#" className="sizeSelect ml-2" onClick={e=>this.toggleSizeSelect(e, item._id+'Size')}>{Form.fetchOne({ [`cartAdd${item._id}`]: 'size' }, forms).value ? _.find(item.importData.attributes[1].items, { id: Form.fetchOne({ [`cartAdd${item._id}`]: 'size' }, forms).value }).name  : 'S'}</a>

																		</div>
																	</div>

																</div>
																
																<div className='col-12 d-flex flex-row align-items-center justify-content-end mb-0 mt-2'>
																	<Form name={`cartAdd${item._id}`} className='form-row no-gutters d-flex flex-row align-items-center justify-content-end'>
																	 	<div className='input-group col-8'>
																			<Input type='text' name='qty' className='inputIncrement' />
																		</div>
																	</Form>
																</div>

																<div className='mt-2 col-12 d-flex flex-column justify-content-end align-items-end'>
																	<a href={`#`} className='btn btn-block btn-success img-circle box-shadow d-flex align-items-center justify-content-center' style={{ height: '4rem', width: '4rem', borderRadius: '100%', fontSize: '0.75rem' }} onClick={e=>this.addToCart(e, item._id)}>
																		<i className='material-icons'>shopping_basket</i>
																	</a>
														
																</div>
																
														</div>
													</div>

													
												</div>
											</div>
										</div>
									</div>
									)
								}
							}
							)}

							<div className='col-4'>
								<div className='row h-100'>

									{_.map(models['trendingProducts'], (item, key, arr)=>{

										if((key + 1) >= 3){
											return (
												<div className={`smaller col-6 ${(key >= 4) ? 'pt-3' : 'pb-3'}`}>
											 	<a href={`/product/${item._slug}`} className={`card-link`}>
													<div className={`card ${(item.flash_status && item.flash_status === 'on') ? 'flash' : ''} bg-transparent`}>
														<div className="card-img-top rounded-0" style={{ background: 'url('+item.images[0]+') center center / cover no-repeat', height: '100%', flex: '1 1' }}>
															<div className='row h-100 p-3 mx-0' style={{ background: 'url(/img/shop/trending-dark-mask-small.png) center center / cover no-repeat' }}>
																<div className='col-12 p-0 d-flex flex-column justify-content-end align-items-between' >
																	<div className='row'>
																		<div className='col-12'>
																			<h6 className='font-weight-normal text-white' style={{ fontSize: '0.8rem', marginBottom: '0.45rem' }}>{item.title}</h6>
																		</div>
																	</div>
																	<div className='row'>
																		<div className='col-12'>
																			<span style={{ color: '#ffd456' }}>
																				<i className='material-icons' style={{ fontSize: '1rem' }}>star</i>
																				<i className='material-icons' style={{ fontSize: '1rem' }}>star</i>
																				<i className='material-icons' style={{ fontSize: '1rem' }}>star</i>
																				<i className='material-icons' style={{ fontSize: '1rem' }}>star</i>
																				<i className='material-icons' style={{ fontSize: '1rem' }}>star</i>
																			</span>
																		</div>
																	</div>
																	<div className='row'>
																		<div className='col-12'>
																			<p className='mb-0 text-white' style={{ fontSize: '0.7rem' }}>${item.price}</p>
																		</div>
																	</div>
																</div>
															</div>
														</div>
														<div className='card-footer p-0'>
															<div className='row mt-3 no-gutters'>
																<div className='col-6 d-flex align-items-center'>
																	<a href='#' className='heart full-width' style={{ color: '#ff8787' }}>
																		<i className='material-icons d-block'>favorite_border</i>
																	</a>
																</div>
																<div className='col-6 d-flex align-items-center justify-content-end'>
																	<a href={`/product/${item.slug}`} className='text-success'>
																		<i className='material-icons'>shopping_basket</i>
																	</a>
																</div>
															</div>
														</div>
													</div>
												</a>
												</div>
											)
										}
									})}

								</div>
							</div>

						</div>

					</div>
				</div>
			)
		}
		else {
			return <div>Loading...</div>
		}
	}
}
