import React from 'react'

export default class ImageUpload extends React.Component {
	constructor(props){
		super(props)
	}

	deleteImage = async (e) => {
		e.preventDefault()
		this.props.input.value = ""
		this.props.input.onChange(this.props.input.value)
	}

	onChange = async (e, key) => {
		e.preventDefault()

    this.props.input.value = key

    console.log('this.props change', this.props)
    this.props.input.onChange(this.props.input.value)

	}

	render() {
		let renderStyles = (key) => {
			if(this.props.input.value >= key){
				return { fontSize: '1rem', color: '#ffbf00' }
			}
			else {
				return { fontSize: '1rem', color: '#a2a2a2' }
			}
		}

		let { name, label, type, placeholder, classes, className, error } = this.props
		return [
			<div className='row'>
				<div className='form-group col-12'>
					<a href='#' onClick={(e)=>this.onChange(e, 1)}><i className='material-icons' style={renderStyles(1)}>star</i></a>
					<a href='#' onClick={(e)=>this.onChange(e, 2)}><i className='material-icons' style={renderStyles(2)}>star</i></a>
					<a href='#' onClick={(e)=>this.onChange(e, 3)}><i className='material-icons' style={renderStyles(3)}>star</i></a>
					<a href='#' onClick={(e)=>this.onChange(e, 4)}><i className='material-icons' style={renderStyles(4)}>star</i></a>
					<a href='#' onClick={(e)=>this.onChange(e, 5)}><i className='material-icons' style={renderStyles(5)}>star</i></a>
				</div>
			</div>
		]
	}
}
