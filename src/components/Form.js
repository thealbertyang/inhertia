import { NOT_FOUND } from 'redux-first-router'
import { fetchData, postData } from '../utils'
import { setForm } from '../actions'
import { connect } from 'react-redux'
import React from 'react'
import ReactDOM from 'react-dom'

import * as _ from 'lodash'


@connect((store)=>{
	return {
		forms: store.forms,
		jwToken: store.jwToken,
	}
})
export class RatingRadio extends React.Component {
	constructor(props){
		super(props)
		this.state = { value: 5, error: '', hover: 5 }
	}

	fetchInput = (props, type) => {
		let { forms, name, dispatch } = props
		let formName = ReactDOM.findDOMNode(this).closest('form').getAttribute('name')
		return (_.has(forms[formName],'inputs')) ? forms[formName].inputs[name] : { value: '' }
	}

	componentDidMount = () => {
		console.log('this name', this.props.name, this.props)
		this.setState({...this.fetchInput(this.props)})
	}

	componentDidUpdate = (prevProps, prevState) => {
		!_.isEqual(this.fetchInput(this.props), this.fetchInput(prevProps, 'next'))	&& this.setState({ value: _.has(this.fetchInput(this.props), 'value') ? this.fetchInput(this.props).value : '', error: _.has(this.fetchInput(this.props), 'error') ? this.fetchInput(this.props).error : '' })
	}

	onChange = async (e) => {
		let { forms, name, dispatch } = this.props

		let formName = ReactDOM.findDOMNode(this).closest('form').getAttribute('name')
		let inputs = forms && forms[formName] && forms[formName].inputs

		let input = e.target
		let value = input.value
		let checked = input.checked

		console.log('checked', checked)
		if(checked){

		console.log('this is adding', this.state,  [...this.state.value, this.state.role ])

			inputs = {
				...inputs,
				[name]: { value: [...this.state.value, value ] }
			}

			await Form.set({ name: formName, inputs, status: '', dispatch })

		}

		else {

			inputs = {
				...inputs,
				[name]: { value: _.pull(this.state.value, value) }
			}

			await Form.set({ name: formName, inputs, status: '', dispatch })

		}

		/*inputs = {
			...inputs,
			[name]: { value: value }
		}

		await Form.set({ name: formName, inputs, status: '', dispatch })

		this.props.onChange && this.props.onChange()*/

	}

	selectRating = async (e, rating) => {
		e.preventDefault()
		let { forms, name, dispatch } = this.props
		let formName = ReactDOM.findDOMNode(this).closest('form').getAttribute('name')
		let inputs = forms && forms[formName] && forms[formName].inputs
		inputs = {
			...inputs,
			[name]: { value: rating }
		}

		await Form.set({ name: formName, inputs, status: '', dispatch })
	}
/*

	selectColor = (id) => {
		let { props } = this
		let { forms, models, location, dispatch } = props
		let inputs = _.has(forms['cartAdd'],'inputs') ? forms['cartAdd'].inputs : {}
		Form.set({ name: 'cartAdd', inputs: { ...inputs, color: { value: id } }, dispatch })
	}

	selectSize = (id) => {
		let { props } = this
		let { forms, models, location, dispatch } = props
		let inputs = _.has(forms['cartAdd'],'inputs') ? forms['cartAdd'].inputs : {}
		Form.set({ name: 'cartAdd', inputs: { ...inputs, size: { value: id } }, dispatch })
	}
*/
	mouseEnter = (rating) => {
		this.setState({ hover: rating })
	}

	mouseLeave = () => {
		this.setState({ hover: false })
	}

	render() {
		let { forms, name, label, type, placeholder, className, options } = this.props
		console.log('size options', options, this.state)
		return [
			<div className='ratingRadio row'>
				{label && <div className='col-12'>
					<label htmlFor={name}>{label}</label>
				</div>}
				<div className='col-12 d-flex align-items-center'>
					{this.state.value}

					{_.map([1,2,3,4,5], (item, key, arr)=>{
						return (
							<i
								className='material-icons'
								style={{ fontSize: '1.5rem', color: this.state.hover ? (this.state.hover >= item ? '#eabb30' : '#4e4e4e') : (this.state.value ? (this.state.value >= item ? '#eabb30' : '#4e4e4e') : '#eabb30') }}
								onMouseEnter={e=>this.mouseEnter(item)}
								onMouseLeave={this.mouseLeave}
								onClick={e=>this.selectRating(e, item)}
							>
								star
							</i>
						)
					})}
				</div>
			</div>,
			<div className="invalid-feedback">{this.state.error ? this.state.error : ''}</div>
		]
	}

}


@connect((store)=>{
	return {
		forms: store.forms,
		jwToken: store.jwToken,
	}
})
export class SizeRadio extends React.Component {
	constructor(props){
		super(props)
		this.state = { value: '', error: '' }
	}

	fetchInput = (props, type) => {
		let { forms, name, dispatch } = props
		let formName = ReactDOM.findDOMNode(this).closest('form').getAttribute('name')
		return (_.has(forms[formName],'inputs')) ? forms[formName].inputs[name] : { value: '' }
	}

	componentDidMount = () => {
		console.log('this name', this.props.name, this.props)
		this.setState({...this.fetchInput(this.props)})
	}

	componentDidUpdate = (prevProps, prevState) => {
		!_.isEqual(this.fetchInput(this.props), this.fetchInput(prevProps, 'next'))	&& this.setState({ value: _.has(this.fetchInput(this.props), 'value') ? this.fetchInput(this.props).value : '', error: _.has(this.fetchInput(this.props), 'error') ? this.fetchInput(this.props).error : '' })
	}

	onBlur = () => {
		this.props.onBlur && this.props.onBlur()
	}

	onChange = async (e) => {
		let { forms, name, dispatch } = this.props

		let formName = ReactDOM.findDOMNode(this).closest('form').getAttribute('name')
		let inputs = forms && forms[formName] && forms[formName].inputs

		let input = e.target
		let value = input.value
		let checked = input.checked

		console.log('checked', checked)
		if(checked){

		console.log('this is adding', this.state,  [...this.state.value, this.state.role ])

			inputs = {
				...inputs,
				[name]: { value: [...this.state.value, value ] }
			}

			await Form.set({ name: formName, inputs, status: '', dispatch })

		}

		else {

			inputs = {
				...inputs,
				[name]: { value: _.pull(this.state.value, value) }
			}

			await Form.set({ name: formName, inputs, status: '', dispatch })

		}

		/*inputs = {
			...inputs,
			[name]: { value: value }
		}

		await Form.set({ name: formName, inputs, status: '', dispatch })

		this.props.onChange && this.props.onChange()*/

	}

	select = async (e, id) => {
		e.preventDefault()
		console.log('selecting this as id', id)
		let { forms, name, dispatch } = this.props
		let formName = ReactDOM.findDOMNode(this).closest('form').getAttribute('name')
		let inputs = forms && forms[formName] && forms[formName].inputs
		inputs = {
			...inputs,
			[name]: { value: id }
		}

		await Form.set({ name: formName, inputs, status: '', dispatch })
		this.props.onChange && this.props.onChange(e)

	}
/*

	selectColor = (id) => {
		let { props } = this
		let { forms, models, location, dispatch } = props
		let inputs = _.has(forms['cartAdd'],'inputs') ? forms['cartAdd'].inputs : {}
		Form.set({ name: 'cartAdd', inputs: { ...inputs, color: { value: id } }, dispatch })
	}

	selectSize = (id) => {
		let { props } = this
		let { forms, models, location, dispatch } = props
		let inputs = _.has(forms['cartAdd'],'inputs') ? forms['cartAdd'].inputs : {}
		Form.set({ name: 'cartAdd', inputs: { ...inputs, size: { value: id } }, dispatch })
	}
*/
	render() {
		let { forms, name, label, type, placeholder, className, options } = this.props
		console.log('size options', options, this.state)
		return [
			<div className={`sizeRadio row ${className}`}>
				{label && <div className='col-12'>
					<label htmlFor={name}>{label}</label>
				</div>}
				<div className='col-12'>
					{_.map(options, (item, key, arr)=> {
						return [
							<div className="form-check form-check-inline">
								<a href='#' onClick={(e)=>this.select(e, item.id)} className={`${(this.state.value == item.id) ? 'selected' : ''}`} style={{ background: 'url('+_.replace(item.sku_img,' ','%20')+')' }}>
									{item.name && !_.includes(item.name,'Child') ? item.name : item.name.split('-')[1]}
								</a>
							</div>
						]
					})}
				</div>
			</div>,
			<div className="invalid-feedback">{this.state.error ? this.state.error : ''}</div>
		]
	}

}


@connect((store)=>{
	return {
		forms: store.forms,
		jwToken: store.jwToken,
	}
})
export class ColorRadio extends React.Component {
	constructor(props){
		super(props)
		this.state = { value: '', error: '' }
	}

	fetchInput = (props, type) => {
		let { forms, name, dispatch } = props
		let formName = ReactDOM.findDOMNode(this).closest('form').getAttribute('name')
		return (_.has(forms[formName],'inputs')) ? forms[formName].inputs[name] : { value: '' }
	}

	componentDidMount = () => {
		console.log('this name', this.props.name, this.props)
		this.setState({...this.fetchInput(this.props)})
	}

	componentDidUpdate = (prevProps, prevState) => {
		!_.isEqual(this.fetchInput(this.props), this.fetchInput(prevProps, 'next'))	&& this.setState({ value: _.has(this.fetchInput(this.props), 'value') ? this.fetchInput(this.props).value : '', error: _.has(this.fetchInput(this.props), 'error') ? this.fetchInput(this.props).error : '' })
	}

	onBlur = () => {
		this.props.onBlur && this.props.onBlur()
	}

	onChange = async (e) => {
		let { forms, name, dispatch } = this.props

		let formName = ReactDOM.findDOMNode(this).closest('form').getAttribute('name')
		let inputs = forms && forms[formName] && forms[formName].inputs

		let input = e.target
		let value = input.value
		let checked = input.checked

		console.log('checked', checked)
		if(checked){

		console.log('this is adding', this.state,  [...this.state.value, this.state.role ])

			inputs = {
				...inputs,
				[name]: { value: [...this.state.value, value ] }
			}

			await Form.set({ name: formName, inputs, status: '', dispatch })

		}

		else {

			inputs = {
				...inputs,
				[name]: { value: _.pull(this.state.value, value) }
			}

			await Form.set({ name: formName, inputs, status: '', dispatch })

		}

		/*inputs = {
			...inputs,
			[name]: { value: value }
		}

		await Form.set({ name: formName, inputs, status: '', dispatch })

		this.props.onChange && this.props.onChange()*/

	}

	select = async (e, id) => {
		e.preventDefault()
		console.log('selecting this as id', id)
		let { forms, name, dispatch } = this.props
		let formName = ReactDOM.findDOMNode(this).closest('form').getAttribute('name')
		let inputs = forms && forms[formName] && forms[formName].inputs
		inputs = {
			...inputs,
			[name]: { value: id }
		}

		await Form.set({ name: formName, inputs, status: '', dispatch })

		this.props.onChange && this.props.onChange(e)
	}

	render() {
		let { forms, name, label, type, placeholder, className, options } = this.props
		console.log('options', options, this.state)
		return [
			<div className={`colorRadio row ${className}`}>
				{label && <div className='col-12'>
					<label htmlFor={name}>{label}</label>
				</div>}
				<div className='col-12'>
					{_.map(options, (item, key, arr)=> {
						return [
							<div className="form-check form-check-inline">
								<a href='#' onClick={(e)=>this.select(e, item.id)} className={`${(this.state.value == item.id) ? 'selected' : ''}`} style={{ background: 'url('+_.replace(item.sku_img,' ','%20')+')' }}>
								</a>
							</div>
						]
					})}
				</div>
			</div>,
			<div className="invalid-feedback">{this.state.error ? this.state.error : ''}</div>
		]
	}

}
@connect((store)=>{
	return {
		forms: store.forms,
		jwToken: store.jwToken,
	}
})
export class Radio extends React.Component {
	constructor(props){
		super(props)
		this.state = { value: '', error: '' }
	}

	fetchInput = (props, type) => {
		let { forms, name, dispatch } = props
		let formName = ReactDOM.findDOMNode(this).closest('form').getAttribute('name')
		return (_.has(forms[formName],'inputs')) ? forms[formName].inputs[name] : { value: '' }
	}

	componentDidMount = () => {
		console.log('this name', this.props.name, this.props)
		this.setState({...this.fetchInput(this.props)})
	}

	componentDidUpdate = (prevProps, prevState) => {
		!_.isEqual(this.fetchInput(this.props), this.fetchInput(prevProps, 'next'))	&& this.setState({ value: _.has(this.fetchInput(this.props), 'value') ? this.fetchInput(this.props).value : '', error: _.has(this.fetchInput(this.props), 'error') ? this.fetchInput(this.props).error : '' })
	}

	onBlur = () => {
		this.props.onBlur && this.props.onBlur()
	}

	onChange = async (e) => {
		let { forms, name, dispatch } = this.props

		let formName = ReactDOM.findDOMNode(this).closest('form').getAttribute('name')
		let inputs = forms && forms[formName] && forms[formName].inputs

		let input = e.target
		let value = input.value
		let checked = input.checked

		console.log('checked', checked)
		if(checked){

		console.log('this is adding', this.state,  [...this.state.value, this.state.role ])

			inputs = {
				...inputs,
				[name]: { value: [...this.state.value, value ] }
			}

			await Form.set({ name: formName, inputs, status: '', dispatch })

		}

		else {

			inputs = {
				...inputs,
				[name]: { value: _.pull(this.state.value, value) }
			}

			await Form.set({ name: formName, inputs, status: '', dispatch })

		}

		/*inputs = {
			...inputs,
			[name]: { value: value }
		}

		await Form.set({ name: formName, inputs, status: '', dispatch })

		this.props.onChange && this.props.onChange()*/

	}

	render() {
		let { forms, name, label, type, placeholder, className, options } = this.props
		return [
			<label htmlFor={name}>{label}</label>,
			<div className='border p-3' style={{ borderColor: '#e6e6e6 !important', backgroundColor: '#fdfdfd' }}>
				{_.map(options, (item, key, arr)=> {
					return [
						<div className="form-check">
							<input
								type='checkbox'
								name={name}
								id={`${name}[${item}]`}
								className='form-check-input'
								key={key}
								value={item}
								checked={_.indexOf(this.state.value, item) >= 0}
								onChange={(e)=>this.onChange(e)}
								onBlur={(e)=>this.onBlur(e)}
							/>
							<label className="form-check-label" htmlFor={`${name}[${item}]`}>
								{key}
							</label>
						</div>
					]
				})}
			</div>,
			<div className="invalid-feedback">{this.state.error ? this.state.error : ''}</div>
		]
	}

}

@connect((store)=>{
	return {
		forms: store.forms,
		jwToken: store.jwToken,
	}
})
export class List extends React.Component {
	constructor(props){
		super(props)
		this.state = { value: '', error: '' }
	}

	fetchInput = (props, type) => {
		let { forms, name, dispatch } = props
		let formName = ReactDOM.findDOMNode(this).closest('form').getAttribute('name')
		return (_.has(forms[formName],'inputs')) ? forms[formName].inputs[name] : { value: '' }
	}


	componentDidMount = () => {
		console.log('this name', this.props.name, this.props)
		this.setState({...this.fetchInput(this.props)})
	}

	componentDidUpdate = async (prevProps, prevState) => {

		console.log('name', this.props.name)
		!_.isEqual(this.fetchInput(this.props), this.fetchInput(prevProps, 'next'))	&& await this.setState({ value: _.has(this.fetchInput(this.props), 'value') ? this.fetchInput(this.props).value : '', error: _.has(this.fetchInput(this.props), 'error') ? this.fetchInput(this.props).error : '' })
	}

	onBlur = () => {
		this.props.onBlur && this.props.onBlur()
	}

	onChange = (e) => {
		console.log('we are trying to change', e.target.value)
		this.setState({ role: e.target.value })
		this.forceUpdate()
	}


	add = async (e) => {
		e.preventDefault()

		let { forms, name, dispatch } = this.props

		let formName = ReactDOM.findDOMNode(this).closest('form').getAttribute('name')
		let inputs = forms && forms[formName] && forms[formName].inputs

		console.log('this is adding', this.state,  [...this.state.value, this.state.role ])

		inputs = {
			...inputs,
			[name]: { value: [...this.state.value, this.state.role ] }
		}

		await Form.set({ name: formName, inputs, status: '', dispatch })
	}

	remove = async (e, item) => {
		e.preventDefault()

		let { forms, name, dispatch } = this.props

		let formName = ReactDOM.findDOMNode(this).closest('form').getAttribute('name')
		let inputs = forms && forms[formName] && forms[formName].inputs

		console.log('this is removingng', this.state,  [...this.state.value, this.state.role ])

		inputs = {
			...inputs,
			[name]: { value: _.pull(this.state.value, item) }
		}

		await Form.set({ name: formName, inputs, status: '', dispatch })
	}

	render() {
		let { name, label, placeholder } = this.props
		console.log('this.props state', this.props, this.state)
		return [
			<label htmlFor={name}>{label}</label>,
				<div className="form-group list-input">
					<input
						type={`text`}
						placeholder={placeholder ? placeholder : ''}
						className={`form-control mb-3`}
						value={this.state.role}
						onChange={e=>this.onChange(e)}
					/>
					<button className="btn btn-outline-success d-flex align-items-center" onClick={e=>this.add(e)}><i className='material-icons'>add_circle</i></button>
				</div>,
				<div className={`form-group list-table`}>
					{this.state.value && _.map(this.state.value, (item, key, arr)=>{
						console.log('item', item)
						console.log('key', key)
						return (
							<div className={`d-flex flex-row align-items-center justify-content-between`} key={key}>
								{item}
								<a href='#' onClick={e=>this.remove(e, item)} className='close'>
									<i className='material-icons'>close</i>
								</a>
							</div>
						)
					})}
				</div>,
				<div className="invalid-feedback">{this.state.error ? this.state.error : ''}</div>

		]
	}
}


@connect((store)=>{
	return {
		forms: store.forms,
		jwToken: store.jwToken,
	}
})
export class Password extends React.Component {
	constructor(props){
		super(props)
		this.state = { value: '', error: '' }
	}

	fetchInput = (props, type) => {
		let { forms, name, dispatch } = props
		let formName = ReactDOM.findDOMNode(this).closest('form').getAttribute('name')
		return (_.has(forms[formName],'inputs')) ? forms[formName].inputs[name] : { value: '' }
	}


	componentDidMount = () => {
		console.log('this name', this.props.name, this.props)
		this.setState({...this.fetchInput(this.props)})
	}

	componentDidUpdate = async (prevProps, prevState) => {

		console.log('name', this.props.name)
		!_.isEqual(this.fetchInput(this.props), this.fetchInput(prevProps, 'next'))	&& await this.setState({ value: _.has(this.fetchInput(this.props), 'value') ? this.fetchInput(this.props).value : '', error: _.has(this.fetchInput(this.props), 'error') ? this.fetchInput(this.props).error : '' })
	}


	onBlur = () => {

		//if value is empty then set to default
		this.props.onBlur && this.props.onBlur()
	}

	onChange = async (e) => {
		let { forms, name, dispatch } = this.props

		let formName = ReactDOM.findDOMNode(this).closest('form').getAttribute('name')
		let inputs = forms && forms[formName] && forms[formName].inputs

		let input = e.target
		let value = input.value

		inputs = {
			...inputs,
			[name]: { value: value }
		}

		await Form.set({ name: formName, inputs, status: '', dispatch })
		//this.setState({...this.fetchInput(this.props)})
	}

	render() {
		let { forms, name, label, type, placeholder, className } = this.props
		return [
			<label htmlFor={name}>{label}</label>,
			<input
				type={`password`}
				name={name}
				placeholder={placeholder ? placeholder : ''}
				className={`form-control ${this.state.error ? 'is-invalid' : ''} ${className}`}
				value={this.state.value}
				onChange={(e)=>this.onChange(e)}
				onBlur={(e)=>this.onBlur()}
			/>,
			<div className="invalid-feedback">{this.state.error ? this.state.error : ''}</div>
		]
	}
}


@connect((store)=>{
	return {
		forms: store.forms,
		jwToken: store.jwToken,
	}
})
export class ImageUpload extends React.Component {
	constructor(props){
		super(props)
		this.state = { value: '', error: '' }
	}


	fetchInput = (props, type) => {
		let { forms, name, dispatch } = props
		let formName = ReactDOM.findDOMNode(this).closest('form').getAttribute('name')
		let inputs = forms && forms[formName] && forms[formName].inputs
		let input = inputs && inputs[name] && inputs[name].value

		console.log('input.value', input)
		return (_.has(forms[formName],'inputs')) ? forms[formName].inputs[name] : { value: '' }
	}


	componentDidMount = () => {
		console.log('this name', this.props.name, this.props)
		this.setState({...this.fetchInput(this.props)})
	}

	componentDidUpdate = async (prevProps, prevState) => {

		console.log('name', this.props.name)
		!_.isEqual(this.fetchInput(this.props), this.fetchInput(prevProps, 'next'))	&& await this.setState({ value: _.has(this.fetchInput(this.props), 'value') ? this.fetchInput(this.props).value : '', error: _.has(this.fetchInput(this.props), 'error') ? this.fetchInput(this.props).error : '' })
	}


	onBlur = () => {
		//if value is empty then set to default
		this.props.onBlur && this.props.onBlur()
	}


	deleteImage = async (key) => {
		let { props } = this
		let { location, forms, models, dispatch } = props
		let { base, page, method, params } = getLocation(location)
		page = page.slice(0, -1)
		let inputs = forms && forms[page] && forms[page].inputs

		inputs = {
			...inputs,
			[name]: { value: _.pull(this.state.value, value) }
		}

		await Form.set({ name: formName, inputs, status: '', dispatch })

		_.remove(inputs.images.value, function(n, k) {
			console.log('n', n, k)
			return k == key
		});
		Form.set({ name: page, inputs: inputs, status: '', message: '', dispatch})
	}

	onChange = async (e) => {
		let { forms, name, type, dispatch } = this.props
		let formName = ReactDOM.findDOMNode(this).closest('form').getAttribute('name')
		let inputs = forms && forms[formName] && forms[formName].inputs
		let input = inputs && inputs[name] && inputs[name].value
		let file = e.target.files[0]

	   	var reader = new FileReader()
     	reader.onload = async (fileUpload) => {
     		inputs = {
				...inputs,
				[name]: { value: input ? ((!_.isEmpty(type) && type === 'single') ? [{ type: 'data', value: file, image: fileUpload.target.result } ] : [...input, { type: 'data', value: file, image: fileUpload.target.result } ]) : [ { type: 'data', value: file, image: fileUpload.target.result } ] },
			}

			Form.set({ name: formName, inputs, status: '', dispatch })
     	}

		if (file) {
			let test = await reader.readAsDataURL(file)
		}
	}



	render() {

		console.log('this.state', this.state)
		let { name, label, type, placeholder, classes, className, error } = this.props
		return [
		<div className={`${className} form-group col-12`}>
			<div className="card border-0 rounded-0">
				<div className="card-body p-0">
					<div className='card-img-top-controls float-right p-3' style={{ position: 'absolute', right: '0' }}>
						<a href='#' className='text-white close' onClick={(e)=>this.deleteImage(0)}><i className='material-icons'>close</i></a>
					</div>
					<img src={(!_.isEmpty(this.state.value) ? (!_.isEmpty(this.state.value[0].image) ? this.state.value[0].image : this.state.value) : '')} className='w-100 rounded-circle' />

				</div>
			</div>
		</div>,
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
		</div>,
		]
	}
}


@connect((store)=>{
	return {
		forms: store.forms,
		jwToken: store.jwToken,
	}
})
export class ImagesUpload extends React.Component {
	constructor(props){
		super(props)
		this.state = { value: '', error: '' }
	}



	transform = (array) => {
		/*


			Get array and transform to [ { type: 'data', value: file, image: fileUpload.target.result } ] : [ { type: 'data', value: file, image: fileUpload.target.result  } ]



		*/
	}

	fetchInput = (props, type) => {
		let { forms, name, dispatch } = props
		let formName = ReactDOM.findDOMNode(this).closest('form').getAttribute('name')
		let inputs = forms && forms[formName] && forms[formName].inputs
		let input = inputs && inputs[name] && inputs[name].value


		/*
     		inputs = {
				...inputs,

				[name]: { value: input ? [...input, { type: 'data', value: file, image: fileUpload.target.result } ] : [ { type: 'data', value: file, image: fileUpload.target.result } ] },
			}

		forms[formName].inputs[name] = */

		console.log('input.value', input)
		return (_.has(forms[formName],'inputs')) ? forms[formName].inputs[name] : { value: '' }
	}


	componentDidMount = () => {
		console.log('this name', this.props.name, this.props)
		this.setState({...this.fetchInput(this.props)})
	}

	componentDidUpdate = async (prevProps, prevState) => {

		console.log('name', this.props.name)
		!_.isEqual(this.fetchInput(this.props), this.fetchInput(prevProps, 'next'))	&& await this.setState({ value: _.has(this.fetchInput(this.props), 'value') ? this.fetchInput(this.props).value : '', error: _.has(this.fetchInput(this.props), 'error') ? this.fetchInput(this.props).error : '' })
	}


	onBlur = () => {
		//if value is empty then set to default
		this.props.onBlur && this.props.onBlur()
	}


	deleteImage = async (key) => {
		let { props } = this
		let { location, forms, models, dispatch } = props
		let { base, page, method, params } = getLocation(location)
		page = page.slice(0, -1)
		let inputs = forms && forms[page] && forms[page].inputs

		inputs = {
			...inputs,
			[name]: { value: _.pull(this.state.value, value) }
		}

		await Form.set({ name: formName, inputs, status: '', dispatch })

		_.remove(inputs.images.value, function(n, k) {
			console.log('n', n, k)
			return k == key
		});
		Form.set({ name: page, inputs: inputs, status: '', message: '', dispatch})
	}

	onChange = async (e) => {
		let { forms, name, type, dispatch } = this.props
		let formName = ReactDOM.findDOMNode(this).closest('form').getAttribute('name')
		let inputs = forms && forms[formName] && forms[formName].inputs
		let input = inputs && inputs[name] && inputs[name].value
		let file = e.target.files[0]

	   	var reader = new FileReader()
     	reader.onload = async (fileUpload) => {
     		inputs = {
				...inputs,
				[name]: { value: input ? ((!_.isEmpty(type) && type === 'single') ? [{ type: 'data', value: file, image: fileUpload.target.result } ] : [...input, { type: 'data', value: file, image: fileUpload.target.result } ]) : [ { type: 'data', value: file, image: fileUpload.target.result } ] },
			}

			Form.set({ name: formName, inputs, status: '', dispatch })
     	}

		if (file) {
			let test = await reader.readAsDataURL(file)
		}
	}



	render() {
		let { name, label, type, placeholder, classes, className, error } = this.props
		return [
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
		</div>,
		_.map(this.state.value, (item, key) => {
			console.log('what values can we get, item, key', item,  key)
			return (
				<div className={`${className} form-group ${(!_.isEmpty(type) && type === 'single') ? 'col-12' : 'col-3'}`} key={key}>
					<div className="card border-0 rounded-0">
						<div className="card-img-top rounded-0" style={{background: 'url('+((!_.has(item, 'type') || (!_.isEmpty(type) && type === 'single') ) ? item : item.image)+') center center / cover no-repeat', height: '16.5rem'}}>
							<div className='card-img-top-controls float-right p-3'>
								<a href='#' className='text-white close' onClick={(e)=>this.deleteImage(item)}><i className='material-icons'>close</i></a>
							</div>
						</div>
					</div>
				</div>
			)
		})
		]
	}
}

@connect((store)=>{
	return {
		forms: store.forms,
		jwToken: store.jwToken,
	}
})
export class Input extends React.Component {
	constructor(props){
		super(props)
		this.state = { value: '', error: '' }
	}

	fetchInput = (props, type) => {
		let { forms, name, dispatch } = props
		let formName = ReactDOM.findDOMNode(this).closest('form').getAttribute('name')

		//console.log('fetchInput', forms)
		return (_.has(forms[formName],'inputs')) ? forms[formName].inputs[name] : { value: '' }
	}


	componentDidMount = async () => {
		//console.log('this name', this.props.name, this.props)
		let { props } = this
		let { forms, name, defaultValue, dispatch } = props



		let hasInput = this.fetchInput(this.props) ? this.fetchInput(this.props) : false
		//console.log('has input', hasInput, this.props, this.fetchInput(this.props))
		if(hasInput){
			let value = hasInput == '' ? ({ ...hasInput }) : (typeof defaultValue !== 'undefined' ? { value: defaultValue } : { value: '' })
			await this.setState({ ...hasInput })
		}
		else {

		}

	}

	componentDidUpdate = async (prevProps, prevState) => {

		//console.log('name', this.props.name)
		!_.isEqual(this.fetchInput(this.props), this.fetchInput(prevProps, 'next'))	&&
		await this.setState({
			value:
			_.has(this.fetchInput(this.props), 'value')
			?
			this.fetchInput(this.props).value
			:
			'',
			error:
			 _.has(this.fetchInput(this.props), 'error')
			 ?
			 this.fetchInput(this.props).error
			 :
			 ''
		})
	}

	onBlur = (e) => {
		this.props.onBlur && this.props.onBlur(e)
	}

	onChange = async (e) => {
		let { forms, name, type, dispatch } = this.props

		let formName = ReactDOM.findDOMNode(this).closest('form').getAttribute('name')

		let inputs = forms && forms[formName] && forms[formName].inputs

		let input = e.target
		let value = input.value

		if(type == 'number'){
			value = Number(value)
		}

		inputs = {
			...inputs,
			[name]: { value: value }
		}

		await Form.set({ name: formName, inputs, status: '', dispatch })
		//this.setState({...this.fetchInput(this.props)})

		this.props.onChange && this.props.onChange(e)
	}

	render() {
		let { forms, name, label, type, placeholder, className, defaultValue } = this.props
		return [
			label && <label htmlFor={name}>{label}</label>,
			<input
				type={type}
				name={name}
				placeholder={placeholder ? placeholder : ''}
				className={`form-control ${this.state.error ? 'is-invalid' : ''} ${className}`}
				value={this.state.value}
				onChange={(e)=>this.onChange(e)}
				onBlur={(e)=>this.onBlur(e)}
				defaultValue={defaultValue}
			/>,
			<div className="invalid-feedback">{this.state.error ? this.state.error : ''}</div>
		]
	}
}

@connect((store)=>{
	return {
		forms: store.forms,
		jwToken: store.jwToken,
	}
})
export class CheckList extends React.Component {
	constructor(props){
		super(props)
		this.state = { value: '', error: '' }
	}

	fetchInput = (props, type) => {
		let { forms, name, dispatch } = props
		let formName = ReactDOM.findDOMNode(this).closest('form').getAttribute('name')
		return (_.has(forms[formName],'inputs')) ? forms[formName].inputs[name] : { value: '' }
	}

	componentDidMount = () => {
		console.log('this name', this.props.name, this.props)
		this.setState({...this.fetchInput(this.props)})
	}

	componentDidUpdate = (prevProps, prevState) => {
		!_.isEqual(this.fetchInput(this.props), this.fetchInput(prevProps, 'next'))	&& this.setState({ value: _.has(this.fetchInput(this.props), 'value') ? this.fetchInput(this.props).value : '', error: _.has(this.fetchInput(this.props), 'error') ? this.fetchInput(this.props).error : '' })
	}

	onBlur = () => {
		this.props.onBlur && this.props.onBlur()
	}

	onChange = async (e) => {
		let { forms, name, dispatch } = this.props

		let formName = ReactDOM.findDOMNode(this).closest('form').getAttribute('name')
		let inputs = forms && forms[formName] && forms[formName].inputs

		let input = e.target
		let value = input.value
		let checked = input.checked

		console.log('checked', checked)
		if(checked){

		console.log('this is adding', this.state,  [...this.state.value, this.state.role ])

			inputs = {
				...inputs,
				[name]: { value: [...this.state.value, value ] }
			}

			await Form.set({ name: formName, inputs, status: '', dispatch })
			this.props.onChange && this.props.onChange(e, inputs[name])

		}

		else {

			inputs = {
				...inputs,
				[name]: { value: _.pull(this.state.value, value) }
			}

			await Form.set({ name: formName, inputs, status: '', dispatch })
			this.props.onChange && this.props.onChange(e, inputs[name])
		}





		/*inputs = {
			...inputs,
			[name]: { value: value }
		}

		await Form.set({ name: formName, inputs, status: '', dispatch })

		this.props.onChange && this.props.onChange()*/

	}

	render() {
		let { forms, name, label, type, placeholder, className, options } = this.props
		return [
			<label htmlFor={name}>{label}</label>,
			<div className='border p-3' style={{ borderColor: '#e6e6e6 !important', backgroundColor: '#fdfdfd' }}>
				{_.map(options, (item, key, arr)=> {
					return [
						<div className="form-check">
							<input
								type='checkbox'
								name={name}
								id={`${name}[${item}]`}
								className='form-check-input'
								key={key}
								value={item}
								checked={_.indexOf(this.state.value, item) >= 0}
								onChange={(e)=>this.onChange(e)}
								onBlur={(e)=>this.onBlur(e)}
							/>
							<label className="form-check-label" htmlFor={`${name}[${item}]`}>
								{key}
							</label>
						</div>
					]
				})}
			</div>,
			<div className="invalid-feedback">{this.state.error ? this.state.error : ''}</div>
		]
	}

}

@connect((store)=>{
	return {
		forms: store.forms,
		jwToken: store.jwToken,
	}
})
export class Select extends React.Component {
	constructor(props){
		super(props)
		this.state = { value: '', error: '' }
	}





	fetchInput = (props, type) => {
		let { forms, name, dispatch } = props
		let formName = ReactDOM.findDOMNode(this).closest('form').getAttribute('name')
		return (_.has(forms[formName],'inputs')) ? forms[formName].inputs[name] : { value: '' }
	}

	componentDidMount = async () => {
		//console.log('this name', this.props.name, this.props)
		let { props } = this
		let { forms, name, defaultValue, dispatch } = props



		let hasInput = this.fetchInput(this.props) ? this.fetchInput(this.props) : false
		//console.log('has input', hasInput, this.props, this.fetchInput(this.props))
		if(hasInput){
			let value = hasInput == '' ? ({ ...hasInput }) : (typeof defaultValue !== 'undefined' ? { value: defaultValue } : { value: '' })
			await this.setState({ ...hasInput })
		}
		else {

		}

	}

	componentDidUpdate = async (prevProps, prevState) => {

		//console.log('name', this.props.name)
		!_.isEqual(this.fetchInput(this.props), this.fetchInput(prevProps, 'next'))	&&
		await this.setState({
			value:
			_.has(this.fetchInput(this.props), 'value')
			?
			this.fetchInput(this.props).value
			:
			'',
			error:
			 _.has(this.fetchInput(this.props), 'error')
			 ?
			 this.fetchInput(this.props).error
			 :
			 ''
		})
	}
/*
	componentDidUpdate = (prevProps, prevState) => {



		console.log('breakdown!!!!!1')


		let isPropsChanged = !_.isEqual(this.fetchInput(this.props), this.fetchInput(prevProps, 'next'))

		if(isPropsChanged || !_.has(prevProps, 'forms')){
			this.setState({ value: this.fetchInput(this.props).value, error: _.has(this.fetchInput(this.props), 'error') ? this.fetchInput(this.props).error : '' })
		}

		console.log('breakdown!!!!!1', _.has(this.fetchInput(this.props), 'value') )

	}*/

	onBlur = () => {
		this.props.onBlur && this.props.onBlur()
	}

	onChange = async (e) => {
		let { forms, name, dispatch } = this.props

		let formName = ReactDOM.findDOMNode(this).closest('form').getAttribute('name')
		let inputs = forms && forms[formName] && forms[formName].inputs

		let input = e.target
		let value = input.value

		inputs = {
			...inputs,
			[name]: { value: value }
		}

		await Form.set({ name: formName, inputs, status: '', dispatch })
		this.props.onChange && this.props.onChange(e, value)

	}

	render() {
		let { forms, name, label, type, placeholder, className, options } = this.props
		return [
			<label htmlFor={name}>{label}</label>,
			<select
				type={type}
				name={name}
				placeholder={placeholder ? placeholder : ''}
				className={`form-control ${this.state.error ? 'is-invalid' : ''} ${className}`}
				value={this.state.value}
				onChange={(e)=>this.onChange(e)}
				onBlur={(e)=>this.onBlur()}
			>
				<option>Select {label}</option>
				{_.map(options, (item, key, arr)=> {
					return <option key={key} value={item} selected={this.state.value == item}>{key}</option>
				})}
			</select>,
			<div className="invalid-feedback">{this.state.error ? this.state.error : ''}</div>
		]
	}

}


@connect((store)=>{
	return {
		forms: store.forms,
		location: store.location,
		jwToken: store.jwToken,
	}
})
export class Form extends React.Component {
	constructor(props){
		super(props)
	}

	static set ({ name, inputs, message, status, dispatch }) { return dispatch({
  		type: 'FORM_SET',
  		payload: {
  			form: {
  				name: name,
  				inputs: inputs,
  				message: message,
  				status: status,
  			}
  		}
  	}) }

	static isFormChanged ({ prevForm, thisForm }) {
		return (prevForm && thisForm) ? !_.isEqual(prevForm.inputs, thisForm.inputs) : false
	}

	static fetchAll ({ formName, forms }) {
		return _.has(forms[formName],'inputs') ? forms[formName].inputs : {}
	}

	static updateOne(query, input, dispatch){
		let form = Object.keys(query)[0]

		return dispatch({
	  		type: 'FORM_SET_ONE',
	  		form,
	  		input: {
	  			name: query[form],
	  			...input
	  		},
	  	})
	}

	static fetchOne (query, forms) {
		let formName = Object.keys(query)[0]
		let inputName = query[formName]

		let inputs = _.has(forms[formName],'inputs') ? forms[formName].inputs : {}
		let input = _.has(inputs,inputName) ? inputs[inputName] : {}
		return input
	}


  	static didSubmit ({ name, form }) {
		if(form){
			if(form && form.status == 'submitting'){
				return form.inputs
			}
			else {

				return false
			}
		}
		return false
	}

	onSubmit = async (e) => {
		e.preventDefault()
		let { props } = this
		let { forms, name, dispatch } = props
		let inputs = forms && forms[name] && forms[name].inputs
		Form.set({ name, inputs, status: 'submitting', dispatch })
	}

	render = () => {
		return (
			<form name={this.props.name} onSubmit={(e)=>{ this.onSubmit(e); this.props.onSubmit(e) }} className={this.props.className}>
				{this.props.children}
			</form>
		)
	}

}
