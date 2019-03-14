import React from 'react'
import { postData } from '../utils'
import { connect } from 'react-redux'

import { getLocation, redirect } from '../actions/index'
import * as User from '../actions/user'

import Navbar from '../components/Page/Navbar'

import Overline from '../components/Typography/Overline'
import HeadingOne from '../components/Typography/HeadingOne'

@connect((store)=>{
	return {
		forms: store.forms,
		user: store.user,
		jwtToken: store.jwtToken,
		location: store.location,
	}
})

export default class Typography extends React.Component {
	constructor(props){
		super(props)
	}

	render(){
		let { props } = this
		let { forms, location, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		return [
		    <Navbar />,
				<div className={`section-container`}>
					<div className={`col-4 h-100 d-flex flex-column justify-content-center`}>
						<HeadingOne>
							 This is Heading One
						</HeadingOne>
						<h2 className="d-flex flex-row">
							 h2
						</h2>
						<h3 className="d-flex flex-row">
							 h3
						</h3>
						<h4 className="d-flex flex-row">
							 h4
						</h4>
						<h5 className="d-flex flex-row">
							 h5
						</h5>
						<h6 className="d-flex flex-row">
							 h6
						</h6>
						<span className='subtitle-one'>
							Sub-title One
						</span>
						<span className='subtitle-two'>
							Sub-title Two
						</span>
						<p>
							Body Text One
						</p>
						<p className='body-two'>
							Body Text Two
						</p>
						<button className='btn btn-primary'>
							Button
						</button>
						<button className='btn btn-primary p-3'>
							Button
						</button>

						<span className='caption'>
							Caption
						</span>
						<Overline>
							Overline
						</Overline>

					</div>
				</div>
		]
	}
}
