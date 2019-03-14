import React from 'react'
import { connect } from 'react-redux'

import Footer from './Footer'
import { getLocation, redirect } from '../actions/index'
import * as User from '../actions/user'

import universal from 'react-universal-component'
let Component = universal(props => import(`./Guest/${props.page}`))

@connect((store)=>{
	return {
		forms: store.forms,
		user: store.user,
		location: store.location,
	}
})
export default class Guest extends React.Component {
	constructor(props){
		super(props);
	}

	render() { 
		let { props } = this
		let { location, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		console.log(getLocation(location))
		//params[1] order : account, shipping, payment, confirm
		return [
			(typeof page === 'undefined' || !page ) && <Component page="Index"/>,
			page == 'order' && <Component page="Order"/>,
			<Footer/>
		]
	}
}
