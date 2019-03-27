import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import Sidebar from './Support/Sidebar'
import { getLocation } from '../actions/index'

@connect((store)=>{
	return {
		location: store.location,
	}
})
export default class Contact extends React.Component {
	constructor(props){
		super(props)
	}

	render() {
		let { props } = this
		let { location, dispatch } = props
		let { base, page, method, params } = getLocation(location)
		return [
			<div className="container py-5 my-5">
				<div className='row'>
					<div className='col-4'>
						<Sidebar/>
					</div>
					<div className='col-8'>
						<div className='row'>
							<div className='col-12 mb-4'>
								<h3>Contact Us</h3>
							</div>
							<div className='col-12'>
								<p>We are available Monday to Friday 9 - 5. We are unavailable for holidays including.</p>
								<p>Please contact support@inhertia.com</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		]
	}

}
