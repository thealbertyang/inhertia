import React from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'

import { Form, Field } from 'react-final-form'
import { OnChange } from 'react-final-form-listeners'

import * as Cart from '../../actions/cart'

@connect((store)=>{
	return {
		cart: store.cart,
	}
})
export default class Item extends React.Component {
	constructor(props){
		super(props)
	}

	render(){
		let { _id, fields, name, index, title, slug, color, size, price, total } = this.props

		return (
			<div className='row py-5 border-top'>
				<div className='col-2'>
					<a href={`/product/${slug}`}>
						<img src='/img/admin/uploads/41025693_025_2.jpg' className={`img-fluid`}/>
					</a>
				</div>
				<div className='col-3 d-flex flex-column justify-content-center'>
					<a href={`/product/${slug}`}>
						<h6>{title}</h6>
					</a>
					<p>{_.capitalize(color)}</p>
				</div>
				<div className='col-2 d-flex flex-column justify-content-center'>
					<p className={`mb-0`}>${price}</p>
				</div>
				<div className='col-2 d-flex flex-column justify-content-center'>
				<Field
					name={`${name}.quantity`}
					component="input"
					type='number'
					placeholder="Qty"
					className='form-control'
				/>

				<OnChange name={`${name}.quantity`}>
            {(value, previous) => {
              // do something
								if(value !== previous){
									Cart.updateItem({ id: _id, size, color, quantity: value })
									Cart.loadAmounts(this.props.dispatch)
								}
            }}
          </OnChange>
				</div>
				<div className='col-2 d-flex flex-column justify-content-center'>
					<p className={`mb-0`}>${Number(fields.value[index].quantity) * Number(price)}</p>
				</div>
				<div className='col-1 d-flex flex-column justify-content-center'>
					<span
						onClick={() => {
							Cart.removeItem({ id: _id, color, size })
							Cart.loadItems(this.props.dispatch)
							fields.remove(index)
						}}
						style={{ cursor: 'pointer' }}
					>
						❌
					</span>
				</div>
			</div>
		)
	}
}
