import React from 'react'
import Navbar from '../components/Page/Navbar'

export default class Success extends React.Component {
	constructor(props){
		super(props)
	}

	render() {
		return [
			<div className="row">
				<div className="col-12" style={{ paddingTop: '10rem', paddingBottom: '10rem' }}>
					<div className="container">
						<div className="row">
							<div className="col-12 text-center">
									<h2>Order Confirmed!</h2>
									<h3><i className='material-icons text-success my-4' style={{ fontSize: '3.5rem' }}>check_circle</i></h3>
									<h4>
										Thank you. Your order has been confirmed.
									</h4>
									<p className='text-secondary' style={{ paddingBottom: '2rem' }}>Your order hasn't shipped yet but we sent you an email to track your order.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		]
	}

}
