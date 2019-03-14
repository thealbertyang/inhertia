import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import Sidebar from './Support/Sidebar'


@connect((store)=>{
	return {
		location: store.location,
	}
})
export default class Index extends React.Component {
	constructor(props){
		super(props);
	}


	render() {
		return [
			<div className="container py-5 my-5">
				<div className='row'>
					<div className='col-md-4 col-sm-12'>
						<Sidebar/>
					</div>
					<div className='col-md-8 col-sm-12'>
						<div className='row'>
							<div className='col-12 mb-4'>
								<h3>Returns</h3>
							</div>
						</div>
						<div className='row'>
							<div className='col-12'>
								<h6 className='mb-4'>US & International Returns</h6>
								<p>To return your order please contact customer service at support@inhertia.com within 14 days of receiving your order for a full refund.</p>
								<p>Returns will be processed within 48 hours, this may vary during busy periods. Allow 5- 10 working days for refunds to appear in your account.</p>
								<p>To return swimwear, please do not remove the original wrapping. We are unable to offer returns on underwear and jewellery.</p>
								<p>To return your handbag please wrap carefully in the original dust bag to prevent any damage during shipping.</p>
								<p>When examining your handbag please be mindful not to scratch or mark the product. </p>
								<p>To protect your purchase a selection of our dresses and leather jackets are tagged and refunds will only be offered if this tag remains attached when returned.</p>
								<p>Returns for these items received without the tag attached will be returned to the customer.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		]
	}

}
