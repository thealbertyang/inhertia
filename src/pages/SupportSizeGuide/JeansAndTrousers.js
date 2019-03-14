import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { getLocation } from '../../actions/index'
import Sidebar from '../Support/Sidebar'
import Overline from '../../components/Typography/Overline'

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
				<div className='col-6'>
					<div className='row'>
						<div className='col-12 mb-4'>
							<h3>Jeans and Trousers</h3>
						</div>
					</div>
					<div className='row'>
						<div className='col-12'>
								<h6>Bust</h6>
								<p>Measure under your arms, around the fullest part of your chest. </p>
								<h6>Waist</h6>
								<p>Measure around your natural waistline, below your rib cage, leaving the tape a bit loose. </p>
								<h6>Hip</h6>
								<p>Measure around the fullest part of your body, above the top of your legs. </p>
						</div>
					</div>
				</div>
				<div className="col-6">
					<img src="/img/shop/jeansandtrousers-measurement.png" alt="Women's clothing size guide" className="w-100" />
				</div>
			</div>,
			<div className='row'>
				<div className='col-12'>
					<table className="table w-100 measurements responsive table-striped table-hover" style={{ fontFamily: 'Graphik Web' }}>
			        <thead>
			          <tr>
			            <th>Size</th>
			            <th>24</th>
			            <th>25</th>
			            <th>26</th>
			            <th>27</th>
			            <th>28</th>
			            <th>29</th>
			            <th>30</th>
			            <th>31</th>
			            <th>32</th>
			          </tr>
			        </thead>
			        <tbody className="inches">
			          <tr className="even">
			            <td>Waist </td>
			            <td>24</td>
			            <td>25</td>
			            <td>26</td>
			            <td>27</td>
			            <td>28</td>
			            <td>29</td>
			            <td>30</td>
			            <td>31</td>
			            <td>32</td>
			          </tr>
			          <tr>
			            <td>Hip </td>
			            <td>34</td>
			            <td>35</td>
			            <td>36</td>
			            <td>37</td>
			            <td>38</td>
			            <td>39</td>
			            <td>40</td>
			            <td>41</td>
			            <td>42</td>
			          </tr>
			          <tr className="even">
			            <td>Inside Leg Length</td>
			            <td>30</td>
			            <td>30</td>
			            <td>30</td>
			            <td>30</td>
			            <td>30</td>
			            <td>30</td>
			            <td>30</td>
			            <td>30</td>
			            <td>30</td>
			          </tr>
			        </tbody>
			        <tbody className="centimetres">
			          <tr className="even">
			            <td>Waist </td>
			            <td>61.5</td>
			            <td>64</td>
			            <td>66.5</td>
			            <td>69</td>
			            <td>71.5</td>
			            <td>74</td>
			            <td>76.5</td>
			            <td>79</td>
			            <td>81.5</td>
			          </tr>
			          <tr>
			            <td>Hip </td>
			            <td>86.5</td>
			            <td>89</td>
			            <td>91.5</td>
			            <td>94</td>
			            <td>96.5</td>
			            <td>99</td>
			            <td>101.5</td>
			            <td>104</td>
			            <td>106.5</td>
			          </tr>
			          <tr className="even">
			            <td>Inside Leg Length</td>
			            <td>76</td>
			            <td>76</td>
			            <td>76</td>
			            <td>76</td>
			            <td>76</td>
			            <td>76</td>
			            <td>76</td>
			            <td>76</td>
			            <td>76</td>
			          </tr>
			        </tbody>
			      </table>
			  </div>
			</div>,
			<div className='row'>
				<div className='col-12'>
					<div className='row'>
						<div className='col-6 py-3 d-flex flex-column align-items-start'>
							<h3>International</h3>
						</div>
					</div>
				</div>

				<div className='col-12'>
					<table className="responsive col-12 table w-100 measurements responsive table-striped table-hover" style={{ fontFamily: 'Graphik Web' }}>
			          <thead>
			            <tr>
			              <th className>SIZE</th>
			              <th className>24</th>
			              <th className>25</th>
			              <th>26</th>
			              <th>27</th>
			              <th className>28</th>
			              <th>29</th>
			              <th>30</th>
			              <th>31</th>
			              <th>32</th>
			            </tr>
			          </thead>
			          <tbody>
			            <tr className="even">
			              <td className>UK/Australia</td>
			              <td className>4</td>
			              <td className>6</td>
			              <td>8</td>
			              <td>8</td>
			              <td className>10</td>
			              <td>10</td>
			              <td>12</td>
			              <td>12</td>
			              <td>14</td>
			            </tr>
			            <tr>
			              <td className>US</td>
			              <td className>0</td>
			              <td className>2</td>
			              <td>4</td>
			              <td>4</td>
			              <td className>6</td>
			              <td>6</td>
			              <td>8</td>
			              <td>8</td>
			              <td>10</td>
			            </tr>
			            <tr className="even">
			              <td className>Japan</td>
			              <td className>3</td>
			              <td className>5</td>
			              <td>7</td>
			              <td>7</td>
			              <td className>9</td>
			              <td>9</td>
			              <td>11</td>
			              <td>11</td>
			              <td>13</td>
			            </tr>
			            <tr>
			              <td className>Korea</td>
			              <td className>24</td>
			              <td className>25</td>
			              <td>26</td>
			              <td>27</td>
			              <td className>28</td>
			              <td>29</td>
			              <td>30</td>
			              <td>31</td>
			              <td>32</td>
			            </tr>
			          </tbody>
			        </table>
		        </div>

			</div>
		]
	}

}
