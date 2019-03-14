import React from 'react'
import { connect } from 'react-redux'
import universal from 'react-universal-component'
import Link, { NavLink } from 'redux-first-router-link'
import * as _ from 'lodash'
import { getLocation } from '../../actions/index'

@connect((store)=>{
	return {
		user: store.user,
		location: store.location,
	}
})
export default class CrudHeader extends React.Component {
	constructor(props){
		super(props);
	}
	async componentDidMount(){
	}
	render() {
		let { base, page, method } = getLocation(this.props.location)
		let controls = this.props.controls
		return [
				<div className={`row mt-5 mb-4 px-5`}>
						<div className="col-6 text-left d-flex align-items-center">
							<h3>{this.props.title ? this.props.title : _.capitalize(page)}</h3>
						</div>
						<div className="col-6 d-flex align-items-center">
							<div className="btn-toolbar d-block ml-auto text-right">
	            	{(controls !== false) &&
		            	(((typeof method === 'undefined' && controls !== true)|| method == 'pagination')
									? <div className="btn-group">
												<a href={`/${base}/${page}/create`} className="btn d-flex justify-content-center align-items-center btn-outline-secondary">Create</a>
										</div>
									: [
											<div className="btn-group mr-2">
												<a href={`#`} onClick={(e)=>history.back()} className="btn d-flex justify-content-center align-items-center btn-outline-secondary">Back</a>
											</div>,
											<div className="btn-group">
												<button type="submit" className={`btn-primary btn form-control`} onClick={() =>
													document
														.getElementById("createEditForm")
														.dispatchEvent(new Event("submit", { cancelable: true }))
												}>
												{method === 'create' ? 'Create' : 'Save'}
												</button>
											</div>
									])}
		          </div>
		        </div>
		    </div>
		]
	}
}
