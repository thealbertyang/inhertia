import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { getLocation } from '../actions/index'

import Sidebar from './Support/Sidebar'

import Clothing from './SupportSizeGuide/Clothing'
import JeansAndTrousers from './SupportSizeGuide/JeansAndTrousers'
import Shoes from './SupportSizeGuide/Shoes'

@connect((store)=>{
	return {
		location: store.location,
	}
})
export default class Index extends React.Component {
	constructor(props){
		super(props);
		this.state = { measurements: 'inches' }
	}

	changeMeasurements = (e, measurement) => {
		 this.setState({ measurements: e.target.value });
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
						{(typeof method === 'undefined' || !method || method === 'clothing') && <Clothing/>}
						{method === 'jeansAndTrousers' && <JeansAndTrousers/>}
						{method === 'shoes' && <Shoes/>}
					</div>
				</div>
			</div>
		]
	}

}
