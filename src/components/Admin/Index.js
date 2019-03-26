import React from 'react'
import { connect } from 'react-redux'

import * as _ from 'lodash'
import Pagination from "react-js-pagination"

import { getLocation } from '../../actions/index'
import * as Models from '../../actions/models'

import { fetchData, postData, deleteData } from '../../utils'

import { Form, Field } from 'react-final-form'


@connect((store)=>{
	return {
		forms: store.forms,
		models: store.models,
		location: store.location,
	}
})
export default class Index extends React.Component {
	constructor(props){
		super(props)
	}

	state = { data: {} }

	getModelsApi = () => {
		let { props } = this
		let { api, location, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		return (typeof api !== 'undefined' && _.has(api,'fetchModels')) ? api.fetchModels : page
	}

	load = async () => {
		let { props } = this
		let { api, location, dispatch } = props
		let { base, page, method, params } = getLocation(location)
		let currPage = params[0],
			limit = params[1]

		let model = await this.fetchModels({ api: this.getModelsApi(), currPage, limit })

		if(model.response === 200){
			if(_.isEmpty(model.data.docs) && typeof currPage !== 'undefined'){
					window.location.href = `/${base}/${page}/pagination/${(currPage - 1)}/10`
			}
			else {
				return {
	  			...model.data
	  	  }
			}
		}
  }

	fetchModels = async ({ api, currPage, limit }) => {
		return await fetchData(`/api/${api}/pagination/${(currPage && limit) ? `${currPage}/${limit}` : `1/10`}`)
	}

	deleteModel = async ({ e, id }) => {
		e.preventDefault()
		let { props } = this
		let { location, dispatch} = props
		let api = props.api
		let { base, page, method, params } = getLocation(location)

		let modelApi = _.includes(page, 'ies') ? page.slice(0, -3) + 'y' : page.slice(0, -1)

		let model = await deleteData(`/api/${modelApi}/delete/${id}`)
		if(model.response === 200){
			Models.set('messages', { [page]: { status: 'success', message: `Successfully deleted ${id}.`} }, dispatch)
		}

		this.setState({ loading: true })
			 const data = await this.load()
			 this.setState({ loading: false, data })
	}

	loadSearchtwo = async (values) => {
		alert(JSON.stringify(values,0,2))
		let { props } = this
		let { api, location, dispatch } = props
		let { base, page, method, params } = getLocation(location)
		let currPage = params[0],
			limit = params[1]

		let modelSearchAll = await this.searchAll({ api: this.getModelsApi(), term: values.term, currPage, limit })
		if(modelSearchAll.response === 200){
			if(_.isEmpty(modelSearchAll.data.docs)){
					//	window.location.href = `/${base}/${page}/pagination/${!isNaN(currPage) ?  (currPage - 1) : '1'}/10`

					console.log('modelsSearchAll'. modelSearchAll)
			}
			else {
				this.setState({ data: modelSearchAll.data })
			}
		}
	}


	searchAll = async ({ api, term, currPage, limit }) => {
		console.log(currPage, limit)
		return await fetchData(`/api/${api}/search/${term}/${(!isNaN(currPage) || !isNaN(limit) || typeof currPage !== 'undefined' || typeof limit !== 'undefined') ? `${currPage}/${limit}` : '1/10'}`)
	}

	handlePagination = (pageNumber) => {
		let { base, page, method, params } = getLocation(this.props.location)
   	window.location.href = `/${base}/${page}/pagination/${pageNumber}/10`
  }

	componentDidMount = async () => {
		this.setState({ loading: true })
			 const data = await this.load()
			 this.setState({ loading: false, data })
	}


	render() {
		let { props } = this
		let { table, location, forms, models, dispatch } = props
		let { base, page, method, params } = getLocation(location)

		console.log('THIS PROPS', this.state)
		return [
			<div className="row px-5">
				<div className='col-12'>
					{models.messages && models.messages[page] && models.messages[page].status == 'success' && <div className="alert alert-success text-left d-flex align-items-center mb-5" role="alert"><i className="material-icons">done</i>{models.messages[page].message}</div>}
				</div>
				<div className='col-12'>
					<Form
						onSubmit={this.loadSearchtwo}
						render={({ handleSubmit, pristine, invalid, values }) => {
							return (
								<form onSubmit={handleSubmit} id={`indexSearchForm`}>
									<div className="input-group mb-3">
										<Field
											name='term'
											type='text'
											component="input"
											placeholder='Search for...'
											className='form-control'
										/>
									  <div className="input-group-append">
											<button className="btn btn-outline-success d-flex align-items-center" type="submit"><i className='material-icons'>search</i></button>
									  </div>
									</div>
								</form>
							)
						}}
					/>

					<div className="table-responsive">
      			<table className="table table-striped table-hover border">
							<thead>
								<tr>
									<th>
										<input type='checkbox' name='checkbox'/>
									</th>
									{_.map(table.fields, (item, key, arr) => {
										return <th><a href='#'>{item.label}</a></th>
									})}
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{this.state.data && this.state.data.docs && this.state.data.docs.map((model, index) => {
									return (
										<tr key={index}>
											<td>
												<input type='checkbox' name='checkbox'/>
											</td>
											{table && table.fields && _.map(table.fields, (item, key, arr) => {
												return (
													<td>
														{model[item.key] && (item.format ? item.format(model[item.key]) : model[item.key])}
													</td>
												)
											})}
											<td className='actions'>
												<a href={`/${base}/${page}/edit/${_.has(table,'actions.edit') ? model[table.actions.edit] : model._id}`}><i className='material-icons'>create</i></a> &nbsp;
												<a href={`#`} onClick={(e)=>this.deleteModel({ e: e, id: model._id })}><i className='material-icons'>delete</i></a> &nbsp;
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
					<div className='table-pagination row'>
						<div className='col-6'>
							Showing {this.state.data && (this.state.data.page * 10) - 9} to {this.state.data.docs && (this.state.data.page * 10) - (10 - this.state.data.docs.length)}  of {this.state.data.docs && this.state.data.total} results.
						</div>
						<div className='col-6 d-flex justify-content-end'>
							 {this.state.data.page &&
								 	<Pagination
					          activePage={this.state.data.page}
					          itemsCountPerPage={10}
					          totalItemsCount={this.state.data.total}
					          pageRangeDisplayed={5}
					          onChange={(e)=>this.handlePagination(e)}
					          itemClass={`page-item`}
					          linkClass={`page-link`}
					          innerclassName={`pagination`}
					        />}
						</div>
					</div>
				</div>
			</div>
		]
	}
}
