import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { getLocation } from '../actions/index'
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
		let { props } = this
		let { location, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		return [
			<div className="container py-5 my-5">
				<div className='row'>
					<div className='col-md-4 col-sm-12'>
						<Sidebar/>
					</div>
					<div className='col-md-8 col-sm-12'>
						<div className='row'>
							<div className='col-12 mb-4'>
								<h3>FAQ</h3>
							</div>
							<div className='col-12 mb-4'>
								<h6 className='mb-4'>Questions</h6>
								<div className='card'>
									<div className='card-header'>
										<a id='shop-type'>
											Are we a shopify store?
										</a>
									</div>
									<div className='card-body'>
									 We are a custom built store catered to the contemporay generation.
									</div>
								</div>
							</div>
							<div className='col-12 mb-4'>
								<div className='card' style={{ border: (params[0] == 'shipping' ? '1px solid #52bf52' : '') }}>
									<div className='card-body'>
										<a id='shipping'>
										What kind of shipping do you offer?
										</a>
									</div>
									<div className='card-footer'>
									 We offer only Expedited Express (1-4 days) - service by DHL, UPS or FedEx.
									</div>
								</div>
							</div>
							<div className='col-12 mb-4'>
								<div className='card' style={{ border: (params[0] == 'track-package' ? '1px solid #52bf52' : '') }}>
									<div className='card-body'><a id='track-package'>How do I track my package?</a>
									</div>
									<div className='card-footer'>
									  You can track your order through the customer dashboard.
									 </div>
								</div>
							</div>
							<div className='col-12 mb-4'>
								<div className='card'>
									<div className='card-body'><a id='didnt-get-delivery'>What happens if I did't receive my delivery?</a>
									</div>
									<div className='card-footer'>
									 Deliveries estimates are usually estimtes, your delivery may arrive earlier or past the estimated date depending on your shipping carrier.
									 </div>
								</div>
							</div>
							<div className='col-12 mb-4'>
								<div className='card'>
									<div className='card-body'><a id='cant-track-delivery'>What happens if I can't track my delivery and it was never delivered?</a>
									</div>
									<div className='card-footer'>
									 Please send a support ticket through the orders to send an email to support@inhertia.com
									 </div>
								</div>
							</div>
							<div className='col-12 mb-4'>
								<div className='card' style={{ border: (params[0] == 'countries-deliver' ? '1px solid #52bf52' : '') }}>
									<div className='card-body'><a id='countries-deliver'>What countries do you deliver to?</a>
									</div>
									<div className='card-footer'>
									 We currently ship to US, and EU. We will soon ship to more countries on request.
									 </div>
								</div>
							</div>
							<div className='col-12 mb-4'>
								<div className='card'>
									<div className='card-body'><a id='cant-login'>I can't login to my account anymore, how do I get access? I've already tried all the options.</a>
									</div>
									<div className='card-footer'>
									 Send an email to support@inhertia.com and we'll help you retreive your account.
									 </div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		]
	}

}
