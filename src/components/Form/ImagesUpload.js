import React from 'react'


const ToggleAdapter = ({ input: { onChange, value }, label, ...rest }) => (
  <Toggle
    label={label}
    toggled={!!value}
    onToggle={(event, isInputChecked) => onChange(isInputChecked)}
    {...rest}
  />
)

export class ImagesUpload extends React.Component {
	constructor(props){
		super(props)
	}

	deleteImage = async (e,key) => {
		e.preventDefault()
		const input = [...this.props.input.value]
		input.splice(key,1)
		this.props.input.value = input
		this.props.input.onChange(this.props.input.value)
	}

	onChange = async (e) => {
		let input = this.props.input.value
		let file = e.target.files[0]

    var reader = new FileReader()
    reader.onload = async (fileUpload) => {
      this.props.input.value = [ ...this.props.input.value, { type: 'data', value: file, image: fileUpload.target.result }]

      console.log('this.props change', this.props)
      this.props.input.onChange(this.props.input.value)
			console.log('this props images', this.props.input.value)

    }

		if (file) {
			await reader.readAsDataURL(file)
		}
	}

	render() {

		let { name, label, type, placeholder, classes, className, error } = this.props
		return [
			<div className="input-group mb-3">
				<input
					type="file"
					className="custom-file-input"
					name={name}
					onChange={(e)=>this.onChange(e)}
				/>
				<label className="custom-file-label" htmlFor={name}>{label}</label>
			</div>,
			this.props.input.value &&
        <div className='row'>
          {this.props.input.value.map((item, index)=>{
    				return (
    					<div className={`${className} form-group col-3`}>
    						<div className="card border-0 rounded-0">
    							<div className="card-body p-0">
    								<div className='card-img-top-controls float-right p-3' style={{ position: 'absolute', right: '0' }}>
    									<a href='#' className='text-white close' onClick={(e)=>this.deleteImage(e,index)}><i className='material-icons'>close</i></a>
    								</div>
    								<img src={!_.isEmpty(item.image) ? item.image : item} className='w-100' />
    							</div>
    						</div>
    					</div>
    				)
			     })}
        </div>
		]
	}
}

export default ImagesUpload
