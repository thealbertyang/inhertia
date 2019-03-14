import React from 'react'
import { connect } from 'react-redux'

import { getLocation } from '../../actions/index'

export default class HeadingTwo extends React.Component {
	constructor(props){
		super(props);
	}

	render() {
		let { props } = this
		let { location, dispatch } = props

		return [
				<h2 className={props.className}>{props.children}</h2>
		]
	}
}
