import React from 'react'
import { connect } from 'react-redux'

import Navbar from '../components/Page/Navbar'
import Header from '../components/Page/Header'
import Footer from '../components/Page/Footer'

import { getLocation } from '../actions/index'

import universal from 'react-universal-component'

let Component = universal(props => import(`./${props.page}`))

@connect((store)=>{
	return {
		forms: store.forms,
		location: store.location,
	}
})
export default class Cart extends React.Component {
	constructor(props){
		super(props);
	}

	render() {
		let { props } = this
		let { location, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		console.log('this.props', getLocation(location))
		//params[1] order : account, shipping, payment, confirm
		return [
				<Navbar/>,
				<Header className={`py-5`} OverlineText={`Customer`} OverlineClassName={`text-white`} TitleText={`Support`} TitleClassName={`text-white`} BackgroundImage={`/img/shop/support.jpg`} Height={`25rem`}/>,
				(typeof page === 'undefined' || page === 'faq') && <Component page="SupportFAQ"/>,
				page == 'sizeGuide' && <Component page="SupportSizeGuide"/>,
				page == 'returns' && <Component page="SupportReturns"/>,
				page == 'deliveryAndShipping' && <Component page="SupportDeliveryAndShipping"/>,
				page == 'privacyPolicy' && <Component page="SupportPrivacyPolicy"/>,
				page == 'contact' && <Component page="SupportContact"/>,
				page == 'ticket' && <Component page="SupportTicket"/>,
				<Footer/>
		]
	}
}
