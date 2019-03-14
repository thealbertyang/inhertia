import { NOT_FOUND } from 'redux-first-router'
import { fetchData, postData } from '../utils'
import React from 'react'
import Cookie from 'universal-cookie'
import * as jwt from 'jsonwebtoken'
import * as _ from 'lodash'
import * as Customer from './customer'

export const fetchUser = async () => {
	let userCookie = await fetchUserCookie()

	let user = await fetchData('/api/user/'+id)
	return user
}

export const fetchUserCookie = () => {
	let cookie = new Cookie()
	cookie = cookie.get('user') ? cookie.get('user') : {}
	return cookie
}

export const updateUserCookie = (value) => {
	let cookie = new Cookie()
	return cookie.set('user', value, { path: '/'})
}

export const deleteUserCookie = () => {
	let cookie = new Cookie()
	cookie.remove('user', { path: '/'})
}


export const register = async (inputs) => {
	let register = await postData('/api/user/create', inputs)
	return register
}


export const registerCustomer = async (inputs) => {
	let register = await postData('/api/customer/create', inputs)
	return register
}

export const isLoggedIn = async (user) => {
	let userCookie = await fetchUserCookie()
	return userCookie
}

export const setUser = async (data, dispatch) => {
     return await dispatch({ type: 'USER_SET', payload: data })
}

export const setToken = async (token, dispatch) => {
     return await dispatch({ type: 'TOKEN', payload: token })
}

export const authToken = async ({ token, dispatch }) => {
		//try to get auth through cookies
		let cookie = new Cookie()

		token = !_.isEmpty(token) ? (token) : cookie.get('jwtToken')
      	if(!_.isEmpty(token)){

        	let authToken = await postData('/api/user/authToken', { jwtToken:  token })
        	if(authToken.response === 200){
        		let user = authToken.data
        		console.log('got authToken responz', user)

          		//let customer = await Customer.fetchByUserId(user._id)

          		await setUser({...user }, dispatch)
          		await setToken(token,dispatch)

          		return user
        	}
      	}
      	else {
      		return false
      	}
}

export const logout = (dispatch) => {
	let cookie = new Cookie()
	cookie.remove('jwtToken', { path: '/'})
}

export const verifyEmail = async (token) => {
	let user = await fetchData('/api/user/verifyEmail/'+token)
	return user
}

export const forgotPassword = async (email) => {
	let user = await postData('/api/user/forgotPassword', email)
	return user
}

export const resetPassword = async (token, inputs) => {
	let user = await postData('/api/user/resetPassword', { ...inputs, token: { value: token } })
	return user
}

export const login = async (inputs) => {
	let login = await postData('/api/user/login', inputs)
	return login
}


export const isEmailVerified = (user) => {
	//look at cookie role ['admin', 'member']
	let isEmailVerified = _.has(user, 'verifyEmail') ? user.verifyEmail === 'verified' : false
	return isEmailVerified
}

export const hasRole = (role) => {
	//look at cookie role ['admin', 'member']
	let userCookie = module.exports.fetchUserCookie()
	return !_.isEmpty(userCookie) ? userCookie.roles.includes(role) : false
}
