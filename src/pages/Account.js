import React from 'react'
import { connect } from 'react-redux'

import Navbar from '../components/Page/Navbar'
import Header from '../components/Page/Header'
import Section from '../components/Page/Section'
import Footer from '../components/Page/Footer'

import Overline from '../components/Typography/Overline'

import { getLocation, redirect } from '../actions/index'
import * as User from '../actions/user'

import universal from 'react-universal-component'
let Component = universal(props => import(`./${props.page}`))

@connect((store)=>{
	return {
		forms: store.forms,
		user: store.user,
		location: store.location,
	}
})
export default class Account extends React.Component {
	constructor(props){
		super(props);
	}

	componentDidMount = async () => {
		let { props } = this
	    let { jwtToken, forms, location, dispatch } = props

	    //check for role
	    let authToken = await User.authToken({ dispatch })

	    if(!authToken){
				dispatch(redirect('LOGIN',''))
	    }
	    else {
	   // 	(_.indexOf(authToken.roles, 'customer') === -1 || _.indexOf(authToken.roles, 'admin') === -1) && dispatch(redirect('LOGIN',''))
	    }
	}

	resendVerifyEmail = async (e) => {
		e.preventDefault()

		let { props } = this
		let { forms, user, dispatch } = props
		let resend = await fetchData(`/api/user/resendVerifyEmail/${user.verifyEmail}/${user.email}`)
		if(resend.response === 200){
			console.log('resend')
			User.authToken({ dispatch })
		}
	}

	render() {
		let { props } = this
		let { user, location, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		console.log(getLocation(location))
		//params[1] order : account, shipping, payment, confirm
		return [
			<Navbar/>,
			<Header className={`d-flex justify-content-center my-0 pt-5`} OverlineText={`Manage`} OverlineClassName={`text-muted`} TitleText={`Account`} Height={`15rem`}/>,
			<Section>
				<div className={`container`}>
					<div className={`row`}>
						<div className={`col-12`}>
							{user && user.verifyEmail !== 'verified' && (
								<div className={`card mb-5`}>
									<div className='card-body'>
										<div className='row'>
											<div className='col-8'>
												Please verify your email address to continue.
											</div>
											<div className='col-4 text-right'>
												Trouble finding email? <a href='#' onClick={(e)=>this.resendVerifyEmail(e)}>Resend link</a>
											</div>
										</div>
									</div>

								</div>
							)}
						</div>
						<div className={`col-md-4 col-sm-12`}>
							<div className='card border-primary mb-4'>
								<div className='card-body'>
									<div className='row'>
										<div className='col-12'>
											<h6 className='card-title mb-0'>
												Navigation
											</h6>
										</div>
									</div>
								</div>
								<ul className="list-group list-group-flush">
									<li className="list-group-item">
										<a className={`nav-link px-0 rounded-0 ${(page == 'profile' || typeof page === 'undefined') && 'active'}`} href="/account/profile">Account</a>
									</li>
									<li className="list-group-item">
										<a className={`nav-link px-0 rounded-0 ${(page == 'orders') && 'active'}`} href="/account/orders">Orders</a>
									</li>
									<li className="list-group-item">
										<a className={`nav-link px-0 rounded-0 ${(page == 'wishlist') && 'active'}`} href="/account/wishlist">Wishlist</a>
									</li>
									<li className="list-group-item">
										<a className={`nav-link px-0 rounded-0 ${(page == 'support') && 'active'}`} href="/account/support">Support</a>
									</li>
								</ul>
							</div>
						</div>
						<div className={`col-md-8 col-sm-12`}>
						{user && user._id &&
							[
								(typeof page === 'undefined' || page == 'profile') && <Component page="AccountProfile"/>,
								page == 'orders' && !params[1] && <Component page="AccountOrders"/>,
								page == 'wishlist' && !params[1] && <Component page="AccountWishlist"/>,
								page == 'referrals' && !params[1] && <Component page="AccountReferrals"/>,
								page == 'support' && !params[1] && <Component page="AccountSupport"/>,
							]}
							</div>
					</div>
				</div>
			</Section>,
			<Footer/>
		]
	}
}
