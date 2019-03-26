import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { getLocation } from '../../actions/index'

@connect((store)=>{
	return {
		location: store.location,
	}
})
export default class Sidebar extends React.Component {
	constructor(props){
		super(props)
	}

	render() {
		let { props } = this
		let { location } = props
		let { base, page, method, params } = getLocation(location)

		return [
			<div className='sidebar row'>
				<div className='col-sm-6 col-md-12'>
					<div className='card border-primary mb-5'>
						<div className='card-body'>
							<div className='row'>
								<div className='col-12'>
									<h6 className='card-title mb-0'>
										Support
									</h6>
								</div>
							</div>
						</div>
						<ul className="list-group list-group-flush">
							<li className="list-group-item">
								<a class={`${(typeof method === 'undefined' || !method) && 'active'}`} href="/support/faq">FAQ</a>
							</li>
							<li className="list-group-item">
								<a class={(method == 'clothing' || !method) && 'active'} href="/support/sizeGuide/clothing">Sizes</a>
							</li>
							<li className="list-group-item">
								<a class={`${(method == 'deliveryAndShipping' || !method) && 'active'}`} href="/support/deliveryAndShipping">Delivery &amp; Shipping</a>
							</li>
							<li className="list-group-item">
								<a class={`${(method == 'returns') && 'active'}`} href="/support/returns">Returns</a>
							</li>
							<li className="list-group-item">
								<a class={`${(method == 'privacyPolicy') && 'active'}`} href="/support/privacyPolicy">Privacy Policy</a>
							</li>
							<li className="list-group-item">
								<a class={`${(method == 'contact') && 'active'}`} href="/support/contact">Contact</a>
							</li>

						</ul>
					</div>
				</div>
			</div>
		]
	}
}
