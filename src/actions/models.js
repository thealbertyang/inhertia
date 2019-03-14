import { NOT_FOUND } from 'redux-first-router'
import { fetchData, postData } from '../utils'
import React from 'react'
import Cookie from 'universal-cookie'


export const set = ( name, data, dispatch) => {
 dispatch({ type: 'MODEL_SET', name: name, data: data })
}

export const fetchModels = async (apiUrl, type, data) => {
	let models;
	if(!type){
		models = await fetchData(apiUrl)
		console.log('fetch models', models)
	}
	else if(type == 'post'){
		models = await postData(apiUrl, data)
		console.log('fetch models by post', models)
	}
	return models

}

export const fetchModel = async ({ apiUrl }) => {
	let model = await fetchData(`${apiUrl}`)
	console.log('fetch model', model)
	return model
}

export const createModel = async ({ apiUrl, data }) => {
	console.log('creating model', data)
	let model = await postData(apiUrl, data)
	return model
}

export const updateModel = async ({ apiUrl, data }) => {
	let model = await postData(apiUrl, data)
	console.log('edit model', model)
	return model
}

export const deleteModel = async ({ apiUrl }) => {
	let model = await deleteData(apiUrl)
	console.log('delete model', model)
	return model
}
