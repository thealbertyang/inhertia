import React from 'react'
import { connect } from 'react-redux'

import Overline from '../Typography/Overline'
import HeadingOne from '../Typography/HeadingOne'

import { getLocation } from '../../actions/index'



@connect((store)=>{
	return {
		forms: store.forms,
		location: store.location,
	}
})
export default class Hero extends React.Component {
	constructor(props){
		super(props);
	}

  getBackgroundImage() {
    return (
      this.props.BackgroundImage !== undefined
        ? `url( ${this.props.BackgroundImage} )`
        : null
    )
  }

  getBackgroundColor() {
    return (
      this.props.BackgroundColor !== undefined
        ? this.props.BackgroundColor
        : null
    )
  }

  getBackgroundSize() {
    return (
      this.props.BackgroundSize !== undefined
        ? this.props.BackgroundSize
        : `center center`
    )
  }

  getBackgroundPosition() {
    return (
      this.props.BackgroundColor !== undefined
        ? this.props.BackgroundPosition
        : `cover`
    )
  }

	render() {
		let { props } = this
		let { location, dispatch } = props
		let { base, page, method, params } = getLocation(location)

    let backgroundImage = this.getBackgroundImage()
    let backgroundColor = this.getBackgroundColor()
    let backgroundSize = this.getBackgroundSize()
    let backgroundPosition = this.getBackgroundPosition()


		return [
				<div
          className=
            {`
              section
              ${
                typeof props.Name === 'undefined'
                ? ``
                : 'section-'+props.Name
              }
              container-fluid
              ${
								props.fluid ? 'py-0' : 'py-5'
							}
              ${
                props.className
              }
            `}

            style={{
              backgroundColor: backgroundColor,
              backgroundImage: backgroundImage,
              backgroundSize: backgroundSize,
              backgroundPosition: backgroundPosition,
              backgroundRepeat: 'no-repeat',
              height: props.Height
            }}
          >
          {props.children}
				</div>
		]
	}
}
