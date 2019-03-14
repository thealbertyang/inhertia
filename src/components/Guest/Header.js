import React from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'

import Navbar from '../Navbar'
import { getLocation } from '../../actions/index'

@connect((store)=>{
	return {
		location: store.location,
		user: store.user,
		jwtToken: store.jwtToken,
	}
})
export default class Header extends React.Component {
	constructor(props){
		super(props)
	}


	render() { 
		let { props } = this
		let { user, location } = props
		let { page } = getLocation(location)

		return [
			<div className="container-fluid d-flex flex-column" style={{ background: 'url(/img/admin/bg/beach_stare.jpg) center center / cover no-repeat', minHeight: '40rem' }}>
				<Navbar className='bg-transparent box-shadow'/>
				<div className="container d-flex flex-column justify-content-end" style={{ maxWidth: '1350px', flex: '1 1' }}>
					<div className="row">
						<div className="col-4 mx-auto">
								<figure className="figure full-width d-flex flex-column align-items-center justify-content-center mb-0">
									<a className={`nav-link profile-link`} href="/shop/profile">
										<img src="/img/admin/avatar.jpg" className="figure-img img-fluid rounded-circle mb-1" style={{ height: '10rem', boxShadow: '3px 3px 35px 0px #0000007a' }} alt="A generic square placeholder image with rounded corners in a figure." />
									</a>
									<figcaption className="figure-caption text-center text-white mb-4" style={{ fontSize: '1.5rem' }}>{/*user.first_name+' '+user.last_name*/}Guest</figcaption>
									{/*<a href={`https://inhertia.com/profile/${user.username}`} className='' style={{ fontSize: '0.75rem' }}>https://inhertia.com/profile/{user.username}</a>
									<a href={`https://inhertia.com/profile/${user.username}`} className='mt-4 mb-4 text-center full-width' style={{ fontSize: '0.68rem' }}><span style={{ color: '#000' }}>🙏 REFERRAL: REFTHEALB93</span></a>*/}
									</figure>
								{/*<div className='col-5 ml-auto float-right d-flex flex-column align-items-end justify-content-center'>
									<div className='card bg-transparent border-0' style={{ width: '35%' }}>
										<div className='card-body py-5 text-center'>
											<span className='text-uppercase text-center pb-3'>YOU HAVE</span>
											<img src='/img/admin/coins.png' className='image-fluid w-100 mt-3 mb-3' />
											<span>1 coins</span>
											<br/>
											<span className='small'>*has no monetary value</span>
										</div>
									</div>
								</div>*/}
						</div>
					</div>
				</div>
				<div className="container d-flex flex-column justify-content-end" style={{ maxWidth: '1350px', flex: '1 1' }}>
					<div className="row profile-tabs">
						<div className="col-12 d-flex align-items-center justify-content-start">
							<ul className="nav nav-tabs nav-fill w-100 border-bottom-0">
								<li className="nav-item">
									<a className={`nav-link rounded-0 ${(page == 'profile' || typeof page === 'undefined') && 'active'}`} href="/account/profile">Account</a>
								</li>
								<li className="nav-item">
									<a className={`nav-link rounded-0 ${(page == 'orders') && 'active'}`} href="/account/orders">Orders</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
            </div>
		]
	}

}
