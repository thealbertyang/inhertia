import React from 'react'

export class ImageUpload extends React.Component {
	constructor(props){
		super(props)
	}

	deleteImage = async (e) => {
		e.preventDefault()
		this.props.input.value = ""
		this.props.input.onChange(this.props.input.value)
	}

	onChange = async (e) => {
		let input = this.props.input.value
		let file = e.target.files[0]

    var reader = new FileReader()
    reader.onload = async (fileUpload) => {
      this.props.input.value = [ { type: 'data', value: file, image: fileUpload.target.result } ]

      console.log('this.props change', this.props)
      this.props.input.onChange(this.props.input.value)
    }

		if (file) {
			await reader.readAsDataURL(file)
		}
	}

	render() {

		let { name, label, type, placeholder, classes, className, error } = this.props
		return [
			<div className='row'>
				<div className={`${className} form-group col-12`}>
					<div className="card border-0 rounded-0">
						<div className="card-body text-center p-0">
							<div className='card-img-top-controls float-right p-3' style={{ position: 'absolute', right: '0' }}>
								<a href='#' className='close' onClick={(e)=>this.deleteImage(e)}><i className='material-icons'>close</i></a>
							</div>
							{!_.isEmpty(this.props.input.value) && <img src={(!_.isEmpty(this.props.input.value[0].image) ? this.props.input.value[0].image : this.props.input.value)} className='w-50 text-center rounded-circle' />}

						</div>
					</div>
				</div>
				<div className='form-group col-12'>
					<div className="input-group mb-3">
						<input
							type="file"
							className="custom-file-input"
							name={name}
							onChange={(e)=>this.onChange(e)}
						/>
						<label className="custom-file-label" htmlFor={name}>{label}</label>
					</div>
				</div>
			</div>
		]
	}
}

function ImageUpload(props) {
  const {
    input: { name, onChange, value, ...restInput },
    meta,
    ...rest
  } = props;
  const showError =
    ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) &&
    meta.touched;

  return (
    <TimePicker
      {...rest}
      name={name}
      helperText={showError ? meta.error || meta.submitError : undefined}
      error={showError}
      inputProps={restInput}
      onChange={onChange}
      value={value === '' ? null : value}
    />
  );
}

export default ImageUpload
