import React from 'react'
import { connect } from 'react-redux'
import universal from 'react-universal-component'
import * as _ from 'lodash'
import Link from 'redux-first-router-link'

import Navbar from '../components/Page/Navbar'
import Header from '../components/Page/Header'
import Section from '../components/Page/Section'
import Footer from '../components/Page/Footer'
import Avatar from '../components/Page/Avatar'

import Button from '../components/Form/Button'
import ButtonAlt from '../components/Form/ButtonAlt'

import Card from '../components/Product/Card'

import Overline from '../components/Typography/Overline'
import { Form, Field } from 'react-final-form'

import { fetchData, postData } from '../utils'
import { getLocation, redirect } from '../actions/index'
import * as Cart from '../actions/cart'


const Review = ({ name }) =>
	<tr>
		<td className={`py-5`}>
			<Avatar size={`medium`}/><br/>
		</td>
		<td className={`text-justify py-5`}>
			<span style={{ fontWeight: '500' }}>{name ? name : 'Ashley Briggs' }</span>&nbsp; <span className={`text-muted mb-2`}>1-8-19</span><br/>
			<div className='col-12 mt-2 mb-3 px-0 d-flex align-items-center'>
						<i className='material-icons' style={{ fontSize: '1rem', color: '#ffbf00' }}>star</i>
						<i className='material-icons' style={{ fontSize: '1rem', color: '#ffbf00' }}>star</i>
						<i className='material-icons' style={{ fontSize: '1rem', color: '#ffbf00' }}>star</i>
						<i className='material-icons' style={{ fontSize: '1rem', color: '#ffbf00' }}>star</i>
						<i className='material-icons' style={{ fontSize: '1rem', color: '#ffbf00' }}>star</i>
			</div>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
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

	state = { data: {} }

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

	createModel = async (fields) => {
		return await postData(`/api/product/create`, fields)
	}

	addToCart = ({ id, size, color, quantity }) => {
		alert(this.state.data._id)
		Cart.updateItem({  })
	}

	onSubmit = (values) => {
		  window.alert(JSON.stringify(values, 0, 2))
			Cart.incrementItem({
				id: this.state.data._id,
				size: values.sizes,
				color: values.colors,
				quantity: values.quantity,
			})
	}

	componentDidMount = async () => {
		let { props } = this
		let { location, forms, models, dispatch } = props
		let { base, page, method, params } = getLocation(location)
		let slug = page

		this.setState({ loading: true })
			 const data = await this.load(slug)
			 this.setState({ loading: false, data })
	}

	render() {
			console.log('data', this.state.data)
			return [
					<Navbar/>,
          <Section>
						<div className='container' style={{ maxWidth: '1350px' }}>
  						<div className='row mb-5'>
  							<div className='col-md-7 col-sm-12'>
									<div className={`row`}>
										<div className='col-md-2'>
											{this.state.data.images && this.state.data.images[1] && <img src={this.state.data.images[1]} className="img-fluid mb-2" alt="..." />}
											{this.state.data.images && this.state.data.images[2] && <img src={this.state.data.images[2]} className="img-fluid mb-2" alt="..." />}
											{this.state.data.images && this.state.data.images[3] && <img src={this.state.data.images[3]} className="img-fluid mb-2" alt="..." />}
											{this.state.data.images && this.state.data.images[4] && <img src={this.state.data.images[4]} className="img-fluid mb-2" alt="..." />}
										</div>
										<div className='col-md-10'>
											{this.state.data.images && this.state.data.images[0] && <img src={this.state.data.images[0]} className="img-fluid mb-2" alt="..." />}
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
													<i className='material-icons' style={{ fontSize: '1.25rem', color: '#ffbf00' }}>star</i>
													<i className='material-icons' style={{ fontSize: '1.25rem', color: '#ffbf00' }}>star</i>
													<i className='material-icons' style={{ fontSize: '1.25rem', color: '#ffbf00' }}>star</i>
													<i className='material-icons' style={{ fontSize: '1.25rem', color: '#ffbf00' }}>star</i>
													<i className='material-icons mr-1' style={{ fontSize: '1.25rem', color: '#ffbf00' }}>star</i>
													<small className={`text-muted text-uppercase`}>45 Reviews</small>
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
												<a className='text-uppercase btn-lg border-0' href='#'>
													<i class="material-icons mr-2">favorite_border</i> Add to Wishlist
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
							        <table className="table responsive table-hover">
							          <tbody className={`py-4`}>
														<Review name={`Ashley Briggs`}/>
														<Review name={`Jen Watkins`}/>
														<Review name={`Emily Tran`}/>
														<Review name={`Washondra Lee`}/>
							          </tbody>
							        </table>
										</div>

									</div>
								</div>
								<div className="col-5">
									<h4 className='mb-4'>
										Related
									</h4>
									<div className='row'>
										<div className='col-4'>
											<Card
												ratings={`visible`}
												title='Blue Purse'
											/>
										</div>
										<div className='col-4'>
											<Card ratings={`visible`}/>
										</div>
										<div className='col-4'>
											<Card ratings={`visible`}/>
										</div>
									</div>
								</div>
							</div>
						</div>
          </Section>,
					<Footer/>
			]
	}

}
