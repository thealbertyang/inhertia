import React from 'react'
import { connect } from 'react-redux'

import * as _ from 'lodash'
import moment from 'moment'

import Card from '../../components/Admin/Card'
import Header from '../../components/Admin/Header'



import { fetchData, postData } from '../../utils'
import { getLocation, setForm } from '../../actions/index'
import * as Models from '../../actions/models'

@connect((store)=>{
	return {
		forms: store.forms,
		models: store.models,
		location: store.location,
	}
})
export default class CreateEdit extends React.Component {
	constructor(props){
		super(props)
	}

	render() {
		let { props } = this
		let { location, forms, models, dispatch } = props
		let { base, page, method, params } = getLocation(location)

				return [

				]

	}
}
