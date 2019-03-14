import React from 'react'
import { connect } from 'react-redux'
//import Breadcrumbs from './Breadcrumbs'
import * as _ from 'lodash'
import Link, { NavLink } from 'redux-first-router-link'
import { Form, Input, RatingRadio } from '../Form'
import * as Models from '../../actions/models'

import { getLocation } from '../../actions/index'
import { fetchData, postData } from '../../utils'

@connect((store)=>{
	return {
		forms: store.forms,
		models: store.models,
		location: store.location,
		jwtToken: store.jwtToken,
		cart: store.cart,
		user: store.user,
	}
})
export default class Reviews extends React.Component {
	constructor(props){
		super(props)
		this.timer = null
	}

	loadReviews = async () => {
		let { props } = this
		let { models, dispatch } = props
			let productReviews = await fetchData(`/api/productReviews/product/${models['product']._id}`)
			if(productReviews.response === 200){
				await Models.set('productReviews', productReviews.data, dispatch)
			}
	}

	loadUpdate = async (e) => {
		let { props } = this
		let { user, forms, models, dispatch } = props

		console.log('product id', models['product'])
		this.timer = setTimeout(async ()=>{

			console.log('gpt here')
			let postReview = await postData(`/api/productReview/create/`, {...forms['writeReview'].inputs, customer_id: { value: user.customer._id }, product_id: { value: models['product']._id } })
			if(postReview.response === 200){
				Form.set({ name: 'writeReview', inputs: forms['writeReview'].inputs, status: 'success', message: '', dispatch})
				await this.loadReviews()
			}
		}, 500)
	}

	componentDidMount = async () => {
		await this.loadReviews()
	}

	componentDidUpdate = async (prevProps) => {
		let { props } = this
		let { location, forms } = props
		let { page, method } = getLocation(location)
		
		let didSubmit = Form.didSubmit({ name: 'writeReview', form: forms['writeReview'] })
		if(!_.isEmpty(didSubmit)){
			await this.loadUpdate()
		}
	}

	isUserReviewed = () => {
		let { props } = this
		let { user, forms, models, dispatch } = props

		if(_.has(user, 'customer._id') && !_.isEmpty(models['productReviews'])){
			let isReviewed = find(models['productReviews'], { customer_id: user.customer._id })
			if(typeof isReviewed !== 'undefined'){
				return true
			}
			else {
				return false
			}
		}
	} 


	fetchWriteReviewStatus = () => {
		let { props } = this
		let { user, forms, models, dispatch } = props

		if(_.has(forms['writeReview'], 'status')){
			return forms['writeReview'].status
		}
		else {
			return ''
		}
	} 


	render() { 
		let { props } = this
		let { location, forms, models, user, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		let productModel = _.has(models, 'product') && models['product']
		console.log('this.props', this.props)

		if(productModel){
		
			return [
				<h5 className="text-left mt-4"><a id='reviews'><span className="sub">Reviews</span></a></h5>,
				<hr className='mb-4'/>,
				models['productReviews'] && _.map(models['productReviews'], function(item, key, arr){
					if((key + 1) <= 4){

					return (
						<a id={`review-${item._id}`}>
						<div className='row'>
							<div className="col-4">
								<div className='row'>
									<div className='col-12'>
										<p className='font-weight-normal' style={{ fontSize: '0.8rem', letterSpacing: '0.02rem', color: '#5c5c5f' }}><span style={{ color: '#232323' }}>{item.user && item.user.username}</span></p>
									</div>
									<div className='col-12'>
										<p className='font-weight-normal' style={{ fontSize: '0.8rem', letterSpacing: '0.02rem', color: '#5c5c5f' }}><span style={{ color: '#232323' }}>{item.user && item.user.first_name}</span></p>
									</div>
									<div className='col-12'>
										<p className='font-weight-normal' style={{ fontSize: '0.8rem', letterSpacing: '0.02rem', color: '#5c5c5f' }}><span style={{ color: '#232323' }}>{item.user && item.user.last_name}</span></p>
									</div>
								</div>
							</div>
							<div className='col-8'>
								<div className='row'>
									<div className='col-12'>
										<p style={{ color: '#383838', fontSize: '1.2rem', letterSpacing: '0.02rem' }}>{item.title}</p>
									</div>
									<div className='col-12 mb-3 d-flex align-items-center'>
										{item.rating == 1 &&
											(
												<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>
											)
										}													

										{item.rating == 2 &&
											[
												<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
												<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
											]
										}

										{item.rating == 3 &&
											[
												<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
												<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
												<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
											]
										}

										{item.rating == 4 &&
											[
												<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
												<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
												<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
												<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
											]
										}

										{item.rating == 5 &&
											[
												<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
												<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
												<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
												<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
												<i className='material-icons' style={{ fontSize: '1rem', color: '#eabb30' }}>star</i>,
											]
										}
									</div>
									<div className='col-12 mb-3'>
										<p className='mb-2' style={{ fontSize: '0.8rem', letterSpacing: '0.02rem', color: '#5c5c5f', lineHeight: '1.8' }}>{item.description}</p>
										<a href='#' style={{ color: '#05728c', letterSpacing: '.06rem' }}>Read more +</a>
									</div>
								</div>
							</div>
							<div className='col-12'>
								<hr className='mt-2 mb-4'/>
							</div>
						</div>
						</a>
					)
					}
				}),
				<div className='row writeReview'>
					{(_.isEmpty(user) || typeof user === 'undefined') ? 
						(
							<div className='col-12' style={{ display: 'block' }}>
								<div className='card'>
									<div className='card-body d-flex justify-content-center py-5'>
										<a href='#' className='btn btn-outline-success'>Login to Post a Review</a>
									</div>
								</div>
							</div>
						)

						:

						(
							<Form name={`writeReview`} className={`col-12`}>
								<div className={`card ${(_.has(forms['writeReview'], 'status') && forms['writeReview'].status === 'submitting') ? 'opacity-50' : '' }`}>
									
									{this.isUserReviewed() ? 
										(
											<div className='card-body py-5'>
												<div className='row'>
													<div className='col-8 mx-auto'>
														<h5 className="text-center mt-4 mb-4"><span className="sub">Thanks for Posting!</span></h5>
													</div>
												</div>
												<div className='form-row'>
													<div className='form-group text-center col-8 mx-auto'>
														<p>Thanks for posting a review!</p>
													</div>
												</div>
											</div> 
										)

										:

										( 
											<div className='card-body py-5'>
												{this.fetchWriteReviewStatus() === 'success' ? 
													[
														<div className='row'>
															<div className='col-8 mx-auto'>
																<h5 className="text-left mt-4 mb-4"><span className="sub">Sucesfully Posted!</span></h5>
															</div>
														</div>,
														<div className='form-row'>
															<div className='form-group col-8 mx-auto'>
																<p>Thanks for posting a review!</p>
															</div>
														</div>
													]

													:

													[
														<div className='row'>
															<div className='col-8 mx-auto'>
																<h5 className="text-left mt-4 mb-4"><span className="sub">Post Review</span></h5>
															</div>
														</div>,
														<div className='form-row'>
															<div className='form-group col-8 mx-auto'>
																<Input type='text' name='title' placeholder='How was the product you purchased?'/>
															</div>
															<div className='form-group col-8 mx-auto d-flex align-items-center justify-content-end'>
																<RatingRadio name='rating' />
															</div>
															<div className='form-group col-8 mx-auto'>
																<textarea className='form-control' name='description' placeholder='Enter description'/>
															</div>
														</div>,
														<div className='row'>
															<div className='col-8 mb-3 mx-auto d-flex justify-content-end'>
																<button type='submit' className='btn btn-outline-success'>Post</button>
															</div>
														</div>
													]
												}
											</div> 
										)
									}
								
								</div>
							</Form>
						)
					}
				</div>
			]
		}
		else {
			return <div>Loading</div>
		}
	}
}
