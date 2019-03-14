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
					<h2 className='font-weight-light'>Items</h2>
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
													<h6 className='text-muted'>Name</h6>
												</div>,
												<div className='col-2 d-flex flex-column justify-content-center'>
													<h6 className='text-muted'>Price</h6>
												</div>,
												<div className='col-2 d-flex flex-column justify-content-center'>
													<h6 className='text-muted'>Qty</h6>
												</div>,
												<div className='col-2 d-flex flex-column justify-content-center'>
													<h6 className='text-muted'>Total</h6>
												</div>,
												<div className='col-1 d-flex flex-column justify-content-center'>

												</div>
											]
											: <div className='col-5'>
													<h6 className="text-muted">There are no items in the cart.</h6>
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
