import { NOT_FOUND } from 'redux-first-router'
import { fetchData, postData, deleteData } from '../utils'
import React from 'react'
import Cookie from 'universal-cookie'
import * as _ from 'lodash'

import * as User from './user'


/*


	items

	discounts

	shipping

	amount


*/


export const setModal = (dispatch) => dispatch({
	type: 'SHOP_SET_MODAL'
})

export const clearModal = (dispatch) => dispatch({
	type: 'SHOP_CLEAR_MODAL'
})

export const fetchCookie = (name) => {
	let cookie = new Cookie()
	return cookie.get(name)
}

export const setCookie = (name, value) => {
	let cookie = new Cookie()
	return cookie.set(name, value, { path: '/'})
}

export const deleteCookie = (name) => {
	let cookie = new Cookie()
	return cookie.remove(name, { path: '/'})
}

export const fetchItems = async () => {
	let items = !_.isEmpty(fetchCookie('cart_items')) ? fetchCookie('cart_items') : []

	//Filter down so we don't have repeated IDS fetched
	let productIds = _.transform(items, function(result, item) {
		if(!_.isEmpty(item) && item !== null){
			let isExistsId = _.indexOf(result, item.id) > -1
			!isExistsId && result.push(item.id)
		}
	}, [])


	if(_.isEmpty(productIds)){ return [] }

	let productsData = await fetchData(`/api/products/ids/${productIds}`)
	//foreach items, we want to merge back respective data fetched from server
	if(productsData.response === 200){
		let mergedData = _.transform(items, function(result, item) {
			if(!_.isEmpty(item) && item !== null){
				let productData = _.find(productsData.data, { _id: item.id })
				result.push({...productData, ...item})
			}
		}, [])

		console.log('mergedData', mergedData)
		return mergedData
	}
}
export const updateItems = (value) => {
	return setCookie('cart_items', value)
}

export const updateItem = async ({ id, color, size, quantity }) => {
	let items = !_.isEmpty(fetchCookie('cart_items')) ? fetchCookie('cart_items') : []
  console.log('got here', quantity)
	if(Number(quantity) < 1){
		items = _.remove(items, item => !(item.id == id && item.color == color && item.size == size) )
	}
	else {
		let key = _.findIndex(items, (item, key, arr)=> (item.id == id && item.color == color && item.size == size) )
		items[key] = {...items[key], quantity: Number(quantity), color, size}
	}

	return updateItems(items)
}


export const removeItem = ({ id, color, size }) => {
	let items = !_.isEmpty(fetchCookie('cart_items')) ? fetchCookie('cart_items') : []
	items = _.remove(items, item => !(item.id == id && item.color == color && item.size == size) )
	return updateItems(items)
}

export const incrementItem = async ({ id, color, size, quantity }) => {

	let items = !_.isEmpty(fetchCookie('cart_items')) ? fetchCookie('cart_items') : []

	let key = _.findIndex(items, (item, key, arr)=>{
		return (item.id == id && item.color == color && item.size == size)
	})

	let item = items[key]
	console.log('items before', items)
	console.log('item before', item)
	if(!_.isEmpty(item)){
		items[key] = {...items[key], quantity: (Number(item.quantity) + Number(quantity)), color, size}
	}
	else {
		items.push({ id, quantity: Number(quantity), color, size })
	}
  console.log('item pushed', items)


	return updateItems(items)
}

export const loadItems = async (dispatch) => {
	let items = await fetchItems()
	dispatch({
		type: 'CART_ITEMS_SET',
		items: items,
	})

	return items
}

/* CART PAYMENT */

export const fetchPayment = () => {
	let payment = !_.isEmpty(fetchCookie('cart_payment')) ? fetchCookie('cart_payment') : {}
	return payment
}

export const addPayment = async (item) => {
  let payment = !_.isEmpty(fetchCookie('cart_payment')) ? fetchCookie('cart_payment') : {}
	return setCookie('cart_payment', { ...payment, ...item })
}

export const updatePayment = async (payment, dispatch) => {
	dispatch({
		type: 'CART_PAYMENT_SET',
		payment: payment,
	})
	return setCookie('cart_payment', payment)
}

export const loadPayment = async (dispatch) => {
	let payment = await fetchPayment()
	dispatch({
		type: 'CART_PAYMENT_SET',
		payment: payment,
	})

	return payment
}

/* CART TOKEN */

export const updateToken = async (token, dispatch) => {
	//let payment = !_.isEmpty(fetchCookie('cart_payment')) ? fetchCookie('cart_payment') : {}
	//payment.token = token
	dispatch({
		type: 'CART_TOKEN_SET',
		token: token,
	})
	//return setCookie('cart_payment', payment)
}

/* CART SHIPPING */

export const fetchShipping = async () => {
	let shipping = !_.isEmpty(fetchCookie('cart_shipping')) ? fetchCookie('cart_shipping') : {}
	return shipping
}

export const loadShipping = async (dispatch) => {
	let shipping = await fetchShipping()
	dispatch({ type: 'CART_SHIPPING_SET', shipping })
	return shipping
}

export const addShipping = async (item) => {
  let shipping = !_.isEmpty(fetchCookie('cart_shipping')) ? fetchCookie('cart_shipping') : {}
	return setCookie('cart_shipping', { ...shipping, ...item })
}

export const updateShipping = async (shipping) => {
	return setCookie('cart_shipping', shipping)
}


export const loadDiscounts = async (dispatch) => {
	let discounts = await fetchDiscounts()
	dispatch({
		type: 'CART_DISCOUNTS_SET',
		discounts: discounts,
	})
	return discounts
}

export const updateDiscounts = (value) => {
	return setCookie('cart_discounts', value)
}

export const fetchDiscounts = async () => {
	let discounts = !_.isEmpty(fetchCookie('cart_discounts')) ? fetchCookie('cart_discounts') : []

	//Filter down so we don't have repeated IDS fetched
	let discountsCodes = _.transform(discounts, function(result, item) {
		if(!_.isEmpty(item) && item !== null){
			let isExistsId = _.indexOf(result, item) > -1
			!isExistsId && result.push(item)
		}
	}, [])


	let discountsData = await postData(`/api/discounts/decrypt/`, { discount_codes: discountsCodes })
	if(discountsData.response === 200){
		let mergedData = _.transform(discounts, function(result, item) {
			if(!_.isEmpty(item) && item !== null){

				//get item by discount code
				let discountData = _.find(discountsData.data, { discount_code: item })
				result.push({...discountData})
			}
		}, [])

		return mergedData
	}
}


export const fetchAmounts = async () => {
	let amounts = await calcAmounts()
	return amounts
}

export const loadAmounts = async (dispatch) => {
	let amounts = await calcAmounts()
	dispatch({
		type: 'CART_AMOUNTS_SET',
		amounts: amounts,
	})
	return amounts
}

export const calcAmounts = async (dispatch) => {
	let amounts = {
			items: 0,
			shipping: 0,
			discounts: 0,
			sub_total: 0,
			tax: 0,
			total: 0,
		}

		let items = await calcItems()
		let shipping = await calcShipping()
		let discounts = await calcDiscounts()
		let sub_total = await calcSubTotal()
		let tax = await calcTax()
		let total = await calcTotal()


		amounts.items = items
		amounts.shipping = shipping
		amounts.discounts = discounts
		amounts.sub_total = sub_total
		amounts.tax = tax
		amounts.total = total

	return amounts
}

export const calcItems = async (dispatch) => {
	let items = await fetchItems()
	let amount = 0
	_.map(items, (item, key, arr)=>{
		amount = amount + (item.price * item.quantity)
	})

	return Number(amount).toFixed(2)
}

export const calcShippingRate = async (dispatch) => {
	//Calc shipping rate
	let settings = await fetchData(`/api/settings`)
	if(settings.response == 200){
		let shipping_rate = Number((_.isEmpty(settings.data.shipping_rate) ? 0.25 : settings.data.shipping_rate))
		return shipping_rate
	}

}

export const calcShipping = async (dispatch) => {
	//Calc shipping amounts
	let items = await calcItems()
	let shipping_rate = await calcShippingRate()
	return Number(items * shipping_rate).toFixed(2)
}

export const calcDiscounts = async () => {
	let items = await calcItems()
	let shipping = await calcShipping()
	let discounts = await fetchDiscounts()

	//cart or shipping
	let discount = 0
	_.map(discounts, (item, key, arr)=>{
		if(item.discount_type == 'shipping'){
			discount = (discount + (Number(item.discount_value) * shipping))
		}
		else if(item.discount_type == 'cart'){
			discount = (discount + (Number(item.discount_value) * items))
		}
	})

	//Don't let discount be higher than items plus shipping
	let itemsAndShipping = Number(items) + Number(shipping)
	if(itemsAndShipping < discount){
		discount = itemsAndShipping
	}

	return Number(discount).toFixed(2)
}

export const calcSubTotal = async (dispatch) => {
	let items = await calcItems()
	let shipping = await calcShipping()
	let discounts = await calcDiscounts()

	return Number(Number(items) + Number(shipping) - Number(discounts)).toFixed(2)
}

export const calcTaxRate = async (dispatch) => {
	let settings = await fetchData(`/api/settings`)
	if(settings.response == 200){
		let tax_rate = Number((_.isEmpty(settings.data.tax_rate) ? 0.25 : settings.data.tax_rate))
		return tax_rate
	}
}

export const calcTax = async (dispatch) => {
	let tax_rate = await calcTaxRate()
	let sub_total = await calcSubTotal()
	return Number(Number(sub_total) * Number(tax_rate)).toFixed(2)
}

export const calcTotal = async (dispatch) => {
	let sub_total = await calcSubTotal()
	let tax = await calcTax()
	return Number(Number(sub_total) + Number(tax)).toFixed(2)
}

export const fetchDiscount = async (code) => {
	let discount = await fetchData(`/api/discount/decrypt/${code}`)
	if(discount.response === 200){
		return discount.data
	}
}

export const applyDiscount =  async (code) => {
	//fetch one discount and see if we should add depending on discount role
	let discount = await fetchDiscount(code)
	//let user = await User.authToken()

  console.log('discount', discount)
	//let isCustomerOrAdmin = !_.isEmpty(user) ? user.roles.includes('admin, customer') : false
	let discounts = []

	//if(discount.discount_roles === 'customer' && isCustomerOrAdmin || discount.discount_roles === 'all'){
		discounts = [...discounts, code]
	//}

	return updateDiscounts(discounts)
}

export const removeDiscount = (key) => {
	let discounts = !_.isEmpty(fetchCookie('cart_discounts')) ? fetchCookie('cart_discounts') : []

	discounts = _.remove(discounts, function(item, k){
		if(k == key){
			return false
		}
		else {
			return true
		}

	})

	return updateDiscounts(discounts)
}

export const submitGuestOrder = async () => {

	let items = !_.isEmpty(fetchCookie('cart_items')) ? fetchCookie('cart_items') : []
	let discounts = !_.isEmpty(fetchCookie('cart_discounts')) ? fetchCookie('cart_discounts') : []
	let shipping = await fetchShipping()
	let payment = await fetchPayment()

	let guestOrder = await postData(`/api/order/guest/create`, { cart: { items, discounts, shipping, payment } })
	if(guestOrder.response === 200){
		console.log('guest order success;')
    deleteCookie('cart_items')
    deleteCookie('cart_shipping')
    deleteCookie('cart_payment')
    deleteCookie('cart_discounts')
	}

	return guestOrder
}

export const submitCustomerOrder = async (userId) => {
	//is it saved or new pass token.id or customer.id card.// id
	let items = !_.isEmpty(fetchCookie('cart_items')) ? fetchCookie('cart_items') : []
	let discounts = !_.isEmpty(fetchCookie('cart_discounts')) ? fetchCookie('cart_discounts') : []
	let shipping = await fetchShipping()
	let payment = await fetchPayment()

	let customerOrder = await postData(`/api/order/create/${userId}`, { cart: { items, discounts, shipping, payment } })
	if(customerOrder.response === 200){
		console.log('customer order success;')
    deleteCookie('cart_items')
    deleteCookie('cart_shipping')
    deleteCookie('cart_payment')
    deleteCookie('cart_discounts')
	}

	return customerOrder
}
