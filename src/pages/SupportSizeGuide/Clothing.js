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
			<div className="row">
				<div className='col-6'>
					<div className='row'>
						<div className='col-12 mb-4'>
							<h3>Clothing</h3>
						</div>
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
					<img src="/img/shop/clothing-measurement.png" alt="Women's clothing size guide" className="w-100" />
				</div>
				<div className="col-12 mb-5">
					<table className="table w-100 measurements responsive table-striped table-hover" style={{ fontFamily: 'Graphik Web' }}>
						<thead>
							<tr>
								<th>Size</th>
								<th>XS</th>
								<th>XS</th>
								<th>S</th>
								<th>S</th>
								<th>M</th>
								<th>M</th>
								<th>L</th>
							</tr>
						</thead>
						<tbody className="inches">
							<tr className="even">
								<td>UK</td>
								<td>2</td>
								<td>4</td>
								<td>6</td>
								<td>8</td>
								<td>10</td>
								<td>12</td>
								<td>14</td>
							</tr>
							<tr>
								<td>EU</td>
								<td>30</td>
								<td>32</td>
								<td>34</td>
								<td>36</td>
								<td>38</td>
								<td>40</td>
								<td>42</td>
							</tr>
							<tr className="even">
								<td>US</td>
								<td>00</td>
								<td>0</td>
								<td>2</td>
								<td>4</td>
								<td>6</td>
								<td>8</td>
								<td>10</td>
							</tr>
							<tr>
								<td>Bust</td>
								<td>30</td>
								<td>31</td>
								<td>32</td>
								<td>33</td>
								<td>35</td>
								<td>37</td>
								<td>39</td>
							</tr>
							<tr className="even">
								<td>Waist</td>
								<td>23</td>
								<td>24</td>
								<td>25</td>
								<td>26</td>
								<td>28</td>
								<td>30</td>
								<td>32</td>
							</tr>
							<tr>
								<td>Hip</td>
								<td>33</td>
								<td>34</td>
								<td>35</td>
								<td>36</td>
								<td>38</td>
								<td>40</td>
								<td>42</td>
							</tr>
						</tbody>
						<tbody className="centimetres">
							<tr className="even">
								<td>UK</td>
								<td>2</td>
								<td>4</td>
								<td>6</td>
								<td>8</td>
								<td>10</td>
								<td>12</td>
								<td>14</td>
							</tr>
							<tr>
								<td>EU</td>
								<td>30</td>
								<td>32</td>
								<td>34</td>
								<td>36</td>
								<td>38</td>
								<td>40</td>
							</tr>
							<tr className="even">
								<td>US</td>
								<td>00</td>
								<td>0</td>
								<td>2</td>
								<td>4</td>
								<td>6</td>
								<td>8</td>
								<td>10</td>
							</tr>
							<tr>
								<td>Bust</td>
								<td>77</td>
								<td>79.5</td>
								<td>82</td>
								<td>84.5</td>
								<td>89.5</td>
								<td>94.5</td>
								<td>99.5</td>
							</tr>
							<tr className="even">
								<td>Waist</td>
								<td>59</td>
								<td>61.5</td>
								<td>64</td>
								<td>66.5</td>
								<td>71.5</td>
								<td>76.5</td>
								<td>81.5</td>
							</tr>
							<tr>
								<td>Hip</td>
								<td>84</td>
								<td>86.5</td>
								<td>89</td>
								<td>91.5</td>
								<td>96.5</td>
								<td>101.5</td>
								<td>106.5</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div className='col-12'>
					<div className='row'>
						<div className='col-6 py-3 d-flex flex-column align-items-start'>
							<h3>International</h3>
						</div>
					</div>
				</div>

				<div className='col-12'>
					<table className="table w-100 measurements responsive table-striped table-hover" style={{ fontFamily: 'Graphik Web' }}>
						<thead>
							<tr>
								<th>Size</th>
								<th>XS</th>
								<th>XS</th>
								<th>S</th>
								<th>S</th>
								<th>M</th>
								<th>M</th>
								<th>L</th>
							</tr>
						</thead>
						<tbody>
						<tr className="even">
							<td className>UK</td>
							<td className>2</td>
							<td className>4</td>
							<td className>6</td>
							<td className>8</td>
							<td className>10</td>
							<td className>12</td>
							<td className>14</td>
						</tr>
						<tr>
							<td className>EU</td>
							<td className>30</td>
							<td className>32</td>
							<td className>34</td>
							<td className>36</td>
							<td className>38</td>
							<td className>40</td>
							<td className>42</td>
						</tr>
						<tr className="even" r>
							<td className>US</td>
							<td className>00</td>
							<td className>0</td>
							<td className>2</td>
							<td className>4</td>
							<td className>6</td>
							<td className>8</td>
							<td className>10</td>
						</tr>
						<tr>
							<td className>France/Spain</td>
							<td className>30</td>
							<td className>32</td>
							<td className>34</td>
							<td className>36</td>
							<td className>38</td>
							<td className>40</td>
							<td className>42</td>
						</tr>
						<tr className="even">
							<td className>Germany</td>
							<td className>28</td>
							<td className>30</td>
							<td className>32</td>
							<td className>34</td>
							<td className>36</td>
							<td className>38</td>
							<td className>40</td>
						</tr>
						<tr>
							<td className>Italy</td>
							<td className>34</td>
							<td className>36</td>
							<td className>38</td>
							<td className>40</td>
							<td className>42</td>
							<td className>44</td>
							<td className>46</td>
						</tr>
						<tr className="even">
							<td className>Japan</td>
							<td className>1</td>
							<td className>3</td>
							<td className>5</td>
							<td className>7</td>
							<td className>9</td>
							<td className>11</td>
							<td className>13</td>
						</tr>
						<tr>
							<td className>Korea</td>
							<td className>44</td>
							<td className>44</td>
							<td className>55</td>
							<td className>55</td>
							<td className>66</td>
							<td className>66</td>
							<td className>77</td>
						</tr>
						</tbody>
					</table>
				</div>
			</div>
		]
	}

}
