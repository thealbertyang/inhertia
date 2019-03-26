import React from 'react'
import { connect } from 'react-redux'

import Navbar from '../components/Page/Navbar'
import Footer from '../components/Page/Footer'
import Header from '../components/Page/Header'
import Section from '../components/Page/Section'

import { getLocation } from '../actions/index'

import universal from 'react-universal-component'
let Component = universal(props => import(`./${props.page}`))

@connect((store)=>{
	return {
		forms: store.forms,
		location: store.location,
	}
})
export default class CartPage extends React.Component {
	constructor(props){
		super(props);
	}

	render() {
		let { props } = this
		let { location, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		//params[1] order : account, shipping, payment, confirm
		return [
			<Navbar/>,
			page !== 'success' && [
				<Header OverlineText={`User`} OverlineClassName='text-muted' TitleText={`Cart`} Height={`15rem`} className={`pt-5`}/>,
				<Section>
					{typeof page === 'undefined' && <Component page="CartItems"/>}
					{page == 'checkout' && <Component page="CartCheckout"/>}
				</Section>,
			],
			page == 'success' && <Component page="CartSuccess"/>,
			<Footer/>
		]
	}
}
