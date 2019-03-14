import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { getLocation } from '../../actions/index'
import Sidebar from '../Support/Sidebar'
@connect((store)=>{
	return {
		location: store.location,
	}
})
export default class JeansAndTrousers extends React.Component {
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
			<div className="row">
				<div className='col-12 mb-4'>
					<h3 ckassName='mb-4'>Shoes</h3>
				</div>
				<div className="col-12 mb-5" style={{ fontFamily: 'Graphik Web' }}>
			        <table className='table w-100 measurements responsive table-striped table-hover'>
				        <tbody>
				          <tr>
				            <td>UK</td>
				            <td>3</td>
				            <td>4</td>
				            <td>5</td>
				            <td>6</td>
				            <td>7</td>
				            <td>8</td>
				          </tr>
				          <tr className="even">
				            <td>EU</td>
				            <td>36</td>
				            <td>37</td>
				            <td>38</td>
				            <td>39</td>
				            <td>40</td>
				            <td>41</td>
				          </tr>
				          <tr>
				            <td>US</td>
				            <td>5</td>
				            <td>6</td>
				            <td>7</td>
				            <td>8</td>
				            <td>9</td>
				            <td>10</td>
				          </tr>
				          <tr className="even">
				            <td>Australia</td>
				            <td>5.5</td>
				            <td>6.5</td>
				            <td>7.5</td>
				            <td>8.5</td>
				            <td>9.5</td>
				            <td>10.5</td>
				          </tr>
				          <tr>
				            <td>Japan </td>
				            <td>22.5</td>
				            <td>23.5</td>
				            <td>24.5</td>
				            <td>25.5</td>
				            <td>26.5</td>
				            <td>27.5</td>
				          </tr>
				          <tr className="even">
				            <td>Korea</td>
				            <td>225</td>
				            <td>235</td>
				            <td>245</td>
				            <td>255</td>
				            <td>265</td>
				            <td>275</td>
				          </tr>
				        </tbody>
				     </table>
				 </div>

			</div>
		]
	}

}
