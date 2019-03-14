import ReactDOM from 'react-dom'
import React from 'react'
import { connect } from 'react-redux'

import * as _ from 'lodash'

import { fetchData, postData } from '../../utils'
import { getLocation, redirect } from '../../actions/index'
import * as Models from '../../actions/models'

import { Form, Input } from '../../components/Form'

import Card from '../../components/Admin/Card'
import Header from '../../components/Admin/Header'

import { LinePath } from "@vx/shape";
import { scaleTime, scaleLinear } from "@vx/scale";
import { extent, max } from "d3-array";

/*
const width = window.innerWidth;
const height = window.innerHeight;
*/

const xSelector = d => new Date(d.date);
const ySelector = d => d.price;

@connect((store)=>{
	return {
		forms: store.forms,
		models: store.models,
		location: store.location,
	}
})
export default class Index extends React.Component {
	constructor(props){
		super(props)
		this.inputRestoreFile = React.createRef()
	}

	componentDidMount = async () => {
		let { props } = this
		let { models, location, forms, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		let res = await fetch(`https://api.coindesk.com/v1/bpi/historical/close.json`)
		let data = await res.json()

		if(!_.isEmpty(data)){
			await this.setState({
		      data: Object.keys(data.bpi).map(date => {
		        return {
		          date,
		          price: data.bpi[date],
		        }
		      }),
		      width: ReactDOM.findDOMNode(this).querySelector('#geomap').getBoundingClientRect().width,
		      height: window.innerHeight,
		    })

			await Models.set('reports', data, dispatch)
		}
	}

	calcGeoDimensions = () => {
		const padding = 100;
		const xMax = this.state.width - padding;
		const yMax = this.state.height - padding;

		const xScale = scaleTime({
	    	range: [padding, xMax],
	    	domain: extent(this.state.data, xSelector),
	  	});

	    const dataMax = max(this.state.data, ySelector);
	    const yScale = scaleLinear({
	      range: [yMax, padding],
	      domain: [0, dataMax + (dataMax / 3)],
	    })
	}

	render() {
		let { props } = this
		let { location, forms, models, dispatch } = props
		let { base, page, method, params } = getLocation(location)
		//const { data } = this.state;


		console.log('this.props - this.state', this.props, this.state)
		return [
			<div className="container">
				<div className='row'>
					<div className='col-12'>
						<div className='card'>
							<div className='card-body'>
								<h2>$7,358.07</h2>
							</div>
						</div>


						<div className='card' id='geomap'>
							<div className='card-body'>
						      	{/*(_.has(this,'state.width') && _.has(this,'state.data') && !_.isEmpty(this.state.data)) &&
						      	[
						      		<svg width={`100%`} height={`500px`}>
						        		<rect x={0} y={0} width={`100%`} height={`500px`} fill="#32deaa" />
						        		<LinePath
								          data={this.state.data}
								          xScale={xScale}
								          yScale={yScale}
								          x={xSelector}
								          y={ySelector}
								          strokeWidth={5}
								          stroke="#FFF"
								          strokeLinecap="round"
								          fill="transparent"
								        />
							      	</svg>
							      ]*/}
					    	</div>
					    </div>
					</div>
				</div>
			</div>
		]
	}
}
