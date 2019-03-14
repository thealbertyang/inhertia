import React from 'react'
import { connect } from 'react-redux'

import { getLocation } from '../../actions/index'

export default class HeadingOne extends React.Component {
	constructor(props){
		super(props);
	}

	render() {
		let { props } = this
		let { location, dispatch } = props

		return [
				<h1 className={props.className}>{props.children}</h1>
		]
	}
}
