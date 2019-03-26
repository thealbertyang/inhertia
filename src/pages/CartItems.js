import React from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'

import { Form, Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import arrayMutators from 'final-form-arrays'
import { OnChange } from 'react-final-form-listeners'

import Item from './CartItems/Item'
import OrderSummary from './Cart/OrderSummary'
import * as Cart from '../actions/cart'


@connect((store)=>{
	return {
		cart: store.cart,
		user: store.user,
	}
})
export default class Index extends React.Component {
	constructor(props){
		super(props)
	}

	state = { data: {} }

	load = async () => {

		return { items: await Cart.fetchItems() }
	}

	onSubmit = () => {

	}

	componentDidMount = async () => {
		this.setState({ loading: true })
			 const data = await this.load()
			 this.setState({ loading: false, data })
	}


	render() {
		let { props } = this
		let { cart } = props

		console.log('this.props', this.state)

		return [
			<div className='container'>
				<div className='row'>
					<div className="col-12 col-md-8">
					<h3 className='font-weight-light'>Items</h3>
						<Form
							initialValues={this.state.data}
							mutators={{
								setName: (args, state, utils) => {
									utils.changeValue(state, 'name', () => 1)
								},
								...arrayMutators
							}}
							onSubmit={this.onSubmit}
							render={({
								form: {
			          mutators: { push, pop }
			        }, mutators, values, handleSubmit, onChange }) => (
								<form className='card border-0 mb-5' onSubmit={handleSubmit}>
									<div className='card-body px-0'>
										<div className='row pb-2'>
											{!_.isEmpty(cart.items) ? [
												<div className='col-5'>
													<p className='text-muted mb-0'>Name</p>
												</div>,
												<div className='col-2 d-flex flex-column justify-content-center'>
													<p className='text-muted mb-0'>Price</p>
												</div>,
												<div className='col-2 d-flex flex-column justify-content-center'>
													<p className='text-muted mb-0'>Qty</p>
												</div>,
												<div className='col-2 d-flex flex-column justify-content-center'>
													<p className='text-muted mb-0'>Total</p>
												</div>,
												<div className='col-1 d-flex flex-column justify-content-center'>

												</div>
											]
											: <div className='col-5'>
													<h6 className="text-muted mb-4">There are no items in the cart.</h6>
													<a className="btn btn-primary d-flex align-items-center justify-content-center text-uppercase btn-block btn-lg shadow" href="/collection">
														<i class="material-icons mr-2">shopping_cart</i> Shop Collection
													</a>
												</div>}
										</div>

										<FieldArray name="items">
				              {({ fields }) =>
				                fields.map((name, index) => (
				                  <div key={name}>
														<Item
															{...fields.value[index]}
															name={name}
															index={index}
															fields={fields} />
				                  </div>
				                ))
				              }
				            </FieldArray>
									</div>
								</form>
							)}/>
					</div>
					<div className="col-12 col-md-4">
						<OrderSummary/>
					</div>
				</div>
			</div>
		]
	}

}
