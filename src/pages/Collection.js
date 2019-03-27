import React from 'react'
import { connect } from 'react-redux'
import universal from 'react-universal-component'
import Link from 'redux-first-router-link'
import * as _ from 'lodash'

import { fetchData, postData } from '../utils'
import { getLocation } from '../actions/index'
import * as Models from '../actions/models'

import Navbar from '../components/Page/Navbar'
import Header from '../components/Page/Header'
import Section from '../components/Page/Section'
import Footer from '../components/Page/Footer'

import Overline from '../components/Typography/Overline'
import HeadingTwo from '../components/Typography/HeadingTwo'

import Card from '../components/Product/Card'

@connect((store)=>{
	return {
		user: store.user,
		location: store.location,
		models: store.models,
	}
})
export default class Collection extends React.Component {
	constructor(props){
		super(props);
		this.state = { loaded: null }
	}

	componentDidMount = async () => {
		await this.loadProducts()

	}

	loadProducts = async () => {
		let { props } = this
		let { models, location, dispatch } = props
		let { page } = getLocation(location)

			let products = await fetchData(`/api/products`)
			if(products.response === 200){
					Models.set('products', products.data, dispatch)
					this.setState({ loaded: true })
			}
	}

	render() {
		let { props } = this
		let { location, forms, models, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		console.log('this.models', this.props.models.products)
			return [
					<Navbar/>,
					<Header
            OverlineText={`Product`}
            OverlineClassName={`text-muted`}
            TitleText={`Collection`}
            TitleClassName={`text-dark`}
            Height={`15rem`}
						className={`pt-5`}
          />,
          <Section BackgroundColor={`#ffffff`}>
          <div className='container' style={{ maxWidth: '1350px', flex: '1 1' }}>
            <div className="row">
							{this.state.loaded === true && _.map(models['products'], (item, key, arr)=>{
									return (
										<div className="col-12 col-md-3 px-5 d-flex flex-column align-items-center">
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
								})
							}
            </div>
          </div>
          </Section>,
					<Footer/>
			]
	}

}
