import React from 'react'
import { connect } from 'react-redux'
import universal from 'react-universal-component'
import Link, { NavLink } from 'redux-first-router-link'
import * as _ from 'lodash'

@connect((store)=>{
	return {
		user: store.user,
	}
})
export default class Card extends React.Component {
	constructor(props){
		super(props)
	}
	render() {
		let { body } = this.props
		let className = this.props.className
		let header = this.props.header
		let footer = this.props.footer

		return (
			<div className={`card ${className && className}`}>
				{header && <div className='card-header'>
					<div className='card-title mb-0'>
							{header}
					</div>
				</div>}
				{body && <div className='card-body'>
						{body}
				</div>}
				{footer && <div className='card-footer bg-white'>
						{footer}
				</div>}
			</div>
		)
	}
}
