import React from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import { fetchData, postData } from '../utils'
import * as Models from '../actions/models'
import Geomap from '../components/Admin/Geomap'

@connect((store)=>{
	return {
		models: store.models,
		location: store.location,
	}
})
export default class Index extends React.Component {
	constructor(props){
		super(props)
	}

	loadOrdersPerMonth = async () => {
		let { props } = this
		let { models, dispatch } = props

		let monthlyOrders = await fetchData(`/api/reports/getOrdersPerMonth`)
		if(monthlyOrders.response === 200) {
			Models.set('monthlyOrders', monthlyOrders.data, dispatch)
		}
	}

	loadMonthProfit = async () => {
		let { props } = this
		let { models, dispatch } = props

		let monthlyProfit = await fetchData(`/api/reports/getProfitByMonth`)
		if(monthlyProfit.response === 200) {
			Models.set('monthlyProfit', monthlyProfit.data, dispatch)
		}
	}

	componentDidMount = () => {
		let { props } = this
		let { models } = props

		if(!_.has(models, 'monthlyProfit')){
			this.loadMonthProfit()
		}

		if(!_.has(models, 'monthlyOrders')){
			this.loadOrdersPerMonth()
		}
	}

	render() {
		let { props } = this
		let { models } = props
				return (
					<div className="container-fluid d-flex flex-column">
							<div className="row">
								<div className='col-12'>
									<h2>Dashboard</h2>
								</div>
								<div className='col-6'>
									<div className="card widget-loader-bar mb-4">
								          <div className="container p-0 full-height">
								            <div className="row">
								              <div className="col">
								                <div className="card-header border-bottom-0 bg-transparent row d-flex flex-row">
								                  <div className="card-title mb-0 col-8">
								                    <span className="fs-11 all-caps">Monthly Profit
								                    </span>
								                  </div>
								                  <div className="card-controls col-4 float-right">
								                  </div>
								                </div>
								              </div>
								            </div>
								            <div className="row">
									            <div className="col px-4 mx-2">
								            		<div className="row">
								            			<div className="col-12">
									                		<h3><span className='font-lato'>$</span>{_.has(models, 'monthlyProfit') ? models['monthlyProfit'] : 0}</h3>
									                	</div>
									           			<div className="col-12 mb-4">
									                	</div>
									                </div>
									            </div>
								            </div>
								          </div>
								        </div>





								</div>
								{/*<div className={`col-6`}>
									<div className="card social-card share share-other full-width mb-4 d-flex flex-1 full-height  sm-vh-75" data-social="item">
								          <div className="circle" data-toggle="tooltip" title data-container="body" data-original-title="Label">
								          </div>
								          <div className="card-content flex-1" data-pages-bg-image="/img/admin/social_new.jpg" style={{backgroundImage: 'url("/img/admin/social_new.jpg")', height: '20rem' }}>
								            <ul className="buttons ">
								              <li>
								                <a href="#"><i className="fa fa-expand" />
								                </a>
								              </li>
								              <li>
								                <a href="#"><i className="fa fa-heart-o" />
								                </a>
								              </li>
								            </ul>
								            <div className="bg-overlay" style={{opacity: 0}} /></div>
								          <div className="card-description">
								            <p><a href="#">#TBT</a> :D</p>
								          </div>
								          <div className="card-footer clearfix">
								            <div className="time">few seconds ago</div>
								            <ul className="reactions">
								              <li><a href="#">5,345 <i className="fa fa-comment-o" /></a>
								              </li>
								              <li><a href="#">23K <i className="fa fa-heart-o" /></a>
								              </li>
								            </ul>
								          </div>
								          <div className="card-header clearfix">
								            <div className="user-pic">
								              <img alt="Avatar" width={33} height={33} data-src-retina="/img/admin/avatar_small2x.jpg" data-src="/img/admin/avatar.jpg" src="/img/admin//avatar.jpg" />
								            </div>
								            <h5>David Nester</h5>
								            <h6>Shared a link on your wall</h6>
								          </div>
								        </div>
								</div>*/}
							    <div className="col-6">
							    {/*

									get user primary shipping address if any then

									add to map

							    */}

									<div className="card widget-loader-bar mb-4">
										<div className="container p-0 full-height">
											<div className="row">
												<div className='col-12'>
														<div className="card-header border-bottom-0 bg-transparent row d-flex flex-row">
															<div className="card-title mb-0 col-8">
																	<span className="fs-11 all-caps">Monthly Orders
																	</span>
															</div>
															<div className="card-controls col-4 float-right">
															</div>
													</div>
											</div>
											</div>
											<div className="row">
												<div className="col mx-2 mx-4">
														<div className="row">
														<div className="col-12 mb-4">
																<h3 className="">{_.has(models, 'monthlyOrders') ? models['monthlyOrders'] : 0}</h3>
															</div>
														</div>
												</div>
											</div>
										</div>
									</div>
								</div>

							</div>
					</div>
				)
		//}
		//else {
		//	return <div>Loading...</div>
		//}
	}
}
