import React from 'react'
import { connect } from 'react-redux'
import universal from 'react-universal-component'
import * as _ from 'lodash'
import moment from 'moment'
import Link from 'redux-first-router-link'

import Navbar from '../components/Page/Navbar'
import Header from '../components/Page/Header'
import Section from '../components/Page/Section'
import Footer from '../components/Page/Footer'
import Avatar from '../components/Page/Avatar'

import Rating from '../components/Form/Rating'
import Button from '../components/Form/Button'
import ButtonAlt from '../components/Form/ButtonAlt'

import Card from '../components/Product/Card'

import Overline from '../components/Typography/Overline'
import { Form, Field } from 'react-final-form'

import { fetchData, postData } from '../utils'
import { getLocation, redirect } from '../actions/index'
import * as Cart from '../actions/cart'

let renderStyles = (key, rating) => {
	if(rating >= key){
		return { fontSize: '1rem', color: '#ffbf00' }
	}
	else {
		return { fontSize: '1rem', color: '#a2a2a2' }
	}
}

const Review = ({ username, comment, avatar, rating, date }) =>
	<tr>
		<td className={`py-5`} width='10%'>
			<Avatar size={`medium`} src={avatar} />
		</td>
		<td className={`text-justify py-5`}>
			<span style={{ fontWeight: '500' }}>{username ? username : 'Ashley Briggs' }</span>&nbsp; <span className={`text-muted mb-2`}>{moment(date).format("MMM Do YYYY")}</span><br/>
			<div className='col-12 mt-2 mb-3 px-0 d-flex align-items-center'>
						<i className='material-icons' style={renderStyles(1, rating)}>star</i>
						<i className='material-icons' style={renderStyles(2, rating)}>star</i>
						<i className='material-icons' style={renderStyles(3, rating)}>star</i>
						<i className='material-icons' style={renderStyles(4, rating)}>star</i>
						<i className='material-icons' style={renderStyles(5, rating)}>star</i>
			</div>
			<p>
				{comment ? comment : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim'}
			</p>
		</td>
	</tr>


@connect((store)=>{
	return {
		user: store.user,
		location: store.location,
	}
})
export default class Product extends React.Component {
	constructor(props){
		super(props);
	}

	state = { data: {}, imageIndex: 0 }

	load = async (slug) => {
		let model = await this.fetchModel(slug)

		if(model.response === 200){
			return {
				...model.data
			}
		}
	}

	fetchModel = async (slug) => {
		return await fetchData(`/api/product/slug/${slug}`)
	}

	updateModel = async (id, fields) => {
		return await postData(`/api/product/update/${id}`, fields)
	}

	createReviews = async (id, fields) => {
		return await postData(`/api/product/reviews/${id}`, fields)
	}

	onSubmitReview = async (id, user_id, values) => {
		let model = await this.createReviews(id, { ...values, user_id })

		if(model.response === 200){
			let { props } = this
			let { location, user, forms, models, dispatch } = props
			let { base, page, method, params } = getLocation(location)
			let slug = page
			this.setState({ loading: true })
				 const data = await this.load(slug)
				 this.setState({ loading: false, data })
		}
	}

	addToWishlist = async (e) => {
		let { props } = this
		let { user } = props

		e.preventDefault()

		let wishlist = await postData(`/api/user/customer/wishlist/push/${user.customer._id}`, { product_id: this.state.data._id })
		if(wishlist.response === 200){
			console.log('successfully added')
		}
	}

	onSubmit = (values) => {
			Cart.incrementItem({
				id: this.state.data._id,
				size: values.sizes,
				color: values.colors,
				quantity: values.quantity,
			})
			Cart.loadItems(this.props.dispatch)
	}

	componentDidMount = async () => {
		let { props } = this
		let { location, user, forms, models, dispatch } = props
		let { base, page, method, params } = getLocation(location)
		let slug = page

		this.setState({ loading: true })
			 const data = await this.load(slug)
			 this.setState({ loading: false, data })
	}

	changeImage = (e, image) => {
		e.preventDefault()
		this.setState({ imageIndex: image })
	}

	required = value => (value ? undefined : 'Required')

	render() {
		let { props } = this
		let { location, user, forms, models, dispatch } = props
		let { base, page, method, params } = getLocation(location)
		let slug = page

		let renderStyles = (key, rating) => {
			if(rating >= key){
				return { fontSize: '1rem', color: '#ffbf00' }
			}
			else {
				return { fontSize: '1rem', color: '#a2a2a2' }
			}
		}

			console.log('data', this.state.data)
			console.log('data', base, page, method)
			return [
					<Navbar/>,
          typeof slug !== 'undefined' && this.state.data
					? <Section>
						<div className='container' style={{ maxWidth: '1350px' }}>
  						<div className='row mb-5'>
  							<div className='col-md-7 col-sm-12'>
									<div className={`row`}>
										<div className='col-md-2'>
											{this.state.data.images && this.state.data.images[0] && <a href='#' onClick={(e)=>{ this.changeImage(e, 0) }}><img src={this.state.data.images[0]} className="img-fluid mb-2" alt="..." /></a>}
											{this.state.data.images && this.state.data.images[1] && <a href='#' onClick={(e)=>{ this.changeImage(e, 1) }}><img src={this.state.data.images[1]} className="img-fluid mb-2" alt="..." /></a>}
											{this.state.data.images && this.state.data.images[2] && <a href='#' onClick={(e)=>{ this.changeImage(e, 2) }}><img src={this.state.data.images[2]} className="img-fluid mb-2" alt="..." /></a>}
											{this.state.data.images && this.state.data.images[3] && <a href='#' onClick={(e)=>{ this.changeImage(e, 3) }}><img src={this.state.data.images[3]} className="img-fluid mb-2" alt="..." /></a>}
											{this.state.data.images && this.state.data.images[4] && <a href='#' onClick={(e)=>{ this.changeImage(e, 4) }}><img src={this.state.data.images[4]} className="img-fluid mb-2" alt="..." /></a>}
										</div>
										<div className='col-md-10'>
											{this.state.data.images && this.state.data.images[this.state.imageIndex] && <img src={this.state.data.images[this.state.imageIndex]} className="img-fluid mb-2" alt="..." />}
										</div>
									</div>
								</div>
								<Form
									onSubmit={this.onSubmit}
									render={({ handleSubmit, values })=>(
									<form onSubmit={handleSubmit} className={`col-md-5 col-sm-12 d-flex flex-column justify-content-center`}>
	    							<h1 className={`mt-5 mt-md-0`}>{this.state.data.title}</h1>
										<div className={`row mb-3`}>
											<div className={`col-6`}>
												<p className={`d-flex align-items-center`}>
													<i className='material-icons' style={renderStyles(1, this.state.data.ratings)}>star</i>
													<i className='material-icons' style={renderStyles(2, this.state.data.ratings)}>star</i>
													<i className='material-icons' style={renderStyles(3, this.state.data.ratings)}>star</i>
													<i className='material-icons' style={renderStyles(4, this.state.data.ratings)}>star</i>
													<i className='material-icons mr-1' style={renderStyles(5, this.state.data.ratings)}>star</i>
													<small className={`text-muted text-uppercase`}>{this.state.data.reviews && this.state.data.reviews.length} Reviews</small>
												</p>
												<h6>
													${this.state.data.price}
												</h6>
											</div>
										</div>
										<div className={`row`}>
											<div className={`col-12 mb-3`}>
												<p className={`text-muted text-justify`}>
													{this.state.data.description}
												</p>
											</div>
										</div>
										<div className="form-row mb-5">
											<div className="form-group col-3">
												<label>
													Size
												</label>
												{this.state.data.sizes && (
													<Field name="sizes" component="select" className={`form-control`} defaultValue={this.state.data.sizes[0]}>
														{this.state.data.sizes.map((item, index) => <option value={item}>{_.capitalize(item)}</option>)}
													</Field>
												)}
											</div>
											<div className="form-group col-3">
												<label>
													Color
												</label>
												{this.state.data.colors && (
													<Field name="colors" component="select" className={`form-control`} defaultValue={this.state.data.colors[0]}>
														{this.state.data.colors.map((item, index) => <option value={item}>{_.capitalize(item)}</option>)}
													</Field>
												)}
											</div>
											<div class="form-group col-6">
												<Field name="quantity" defaultValue={`1`}>
													{({ input, meta }) => [
															<label>Quantity</label>,
															<input type="text" {...input} type="number" placeholder="Enter title" className={`form-control`} />,
															meta.touched && meta.error && <span>{meta.error}</span>,
													]}
												</Field>
											</div>
										</div>
										<div className={`row mb-3`}>
											<div className={`col-6`}>
												<Button className='text-uppercase btn-block btn-lg shadow' type="submit">
													<i class="material-icons mr-2">shopping_cart</i> Add to Cart
												</Button>
											</div>
											<div className={`col-6`}>
												<a className={`text-uppercase btn-block btn-lg bg-transparent ${_.isEmpty(user) && 'disabled'}`} href='#' onClick={e=>this.addToWishlist(e)}>
													<i class="material-icons mr-2">favorite</i> Add to Wishlist
												</a>
											</div>
										</div>
	  						  </form>
									)
								}/>
							</div>
							<div className="row mt-5">
								<div className="col-7">
									<h4 className='mb-4'>
										Reviews
									</h4>
									<div className='row'>
										<div className="col-12">
											<Form
												onSubmit={(values)=>this.onSubmitReview(this.state.data._id, user._id, values)}
												render={({ handleSubmit, values })=>(
													<form onSubmit={handleSubmit}>
													{!_.isEmpty(this.props.user) && <table className="table responsive table-hover"><tr className='bg-light'>
														<td className={`py-5`} width="10%">
															<Avatar src={this.props.user.avatar} size={`medium`}/><br/>
														</td>
														<td className={`text-justify py-5`}>
															<span style={{ fontWeight: '500' }}>{this.props.user.username}</span>&nbsp; <span className={`text-muted mb-2`}>{moment().format("MMM Do YYYY")}</span><br/>
															<div className='col-12 mt-2 mb-3 px-0 d-flex align-items-center'>
																<Field
																	name="rating"
																	component={Rating}
																	fullWidth
																	margin="normal"
																	defaultValue={1}
																/>
															</div>
															<p>
																<Field
																	name='comment'
																	component='textarea'
																	className='form-control'
																	validate={this.required}
																>
																	{({ input, meta }) => [
																			<textarea {...input} className={'form-control'} />,
																			meta.error && meta.touched && <span>{meta.error}</span>
																	]}
																</Field>
															</p>
															<p>
																<button className='btn btn-primary'>Save Comment</button>
															</p>
														</td>
													</tr></table>
												}
										        <table className="table responsive">
										          <tbody className={`py-4`}>
																	{!_.isEmpty(this.state.data.reviews) ? this.state.data.reviews.map((item, index)=> {
																			return <Review avatar={_.has(item,'user.avatar') && item.user.avatar} username={_.has(item,'user.username') && item.user.username} comment={item.comment} rating={item.rating} date={item.date} />
																	})
																	:
																		<tr>
																			<td className='px-0'>There are no reviews to display.</td>
																		</tr>
																	}
										          </tbody>
										        </table>
													</form>
												)}
												/>
										</div>

									</div>
								</div>
								<div className="col-5">
									<h4 className='mb-4'>
										Related
									</h4>
									<div className='row'>
										{this.state.data.related && this.state.data.related.map((item, index)=>{

											if((index + 1) <= 3){
												return (
													<div className="col-12 col-md-4">
														<Card
															url={`/product/${item.slug}`}
															title={item.title}
															images={item.images}
															ratings={`visible`}
															price={item.price}
															ratings={item.ratings}
															id={item._id}
														/>
													</div>
												)
											}
										})}
									</div>
								</div>
							</div>
						</div>
          </Section>
					: <Section className='flex-fill d-flex flex-column justify-content-center align-items-center'>
							<h1>404</h1>
							<p>Sorry this product doesn't exist.</p>
					</Section>,
					<Footer/>
			]
	}

}
