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
export default class Header extends React.Component {
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

	render() {
		let { props } = this
		let { location, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		console.log('this.props', getLocation(location))

    let backgroundImage = this.getBackgroundImage()
    let backgroundColor = this.getBackgroundColor()

		//params[1] order : account, shipping, payment, confirm

		return [
				<div className={`container-fluid my-0 ${props.className}`} style={{ backgroundImage: backgroundImage,
            backgroundColor: backgroundColor,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
        }}>
					<div className="container">
						<div className="row">
							<div className='col-12 d-flex flex-column justify-content-center align-items-center' style={{ height: props.Height }}>
										<Overline className={`${props.OverlineClassName}`}>
                      {props.OverlineText}
										</Overline>
										<HeadingOne className={`${props.TitleClassName}`}>
                      {props.TitleText}
                    </HeadingOne>
							</div>
	 					 </div>
					</div>
				</div>
		]
	}
}
