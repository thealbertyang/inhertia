import * as _ from 'lodash'
import Product from '../models/Product'
import Discount from '../models/Discount'
import Settings from '../models/Settings'
import { Stripe } from 'stripe'
let stripe = Stripe('sk_test_j3lePUHaf2fguMotCLXrQMHx');
var ObjectID = require('mongodb').ObjectID;
export const fetchItems = async (items) => {

  //Filter down so we don't have repeated IDS fetched
  let productIds = _.transform(items, function(result, item) {
    if(!_.isEmpty(item) && item !== null){
      let isExistsId = _.indexOf(result, item.id) > -1
      !isExistsId && result.push(ObjectID(item.id))
    }
  }, [])

  let productsData = await Product.find({"_id": { $in: productIds }}).lean().exec((error, model)=>{
    if (error || !model) {
      return {}
    } else {
      return model
    }
  })

  console.log('productIds', productIds)
  console.log('productsData', productsData)
  //foreach items, we want to merge back respective data fetched from server
  let mergedData = _.transform(items, function(result, item) {
    if(!_.isEmpty(item) && item !== null){

      //console.log('PRODUCTSDATA INSIDE', productsData)
      //console.log('PRODUCTSDATA INSIDE', item.id)
      let productData = _.find(productsData, function(product){ return product._id == item.id })

     // console.log('productData', productData)
      result.push({...productData, ...item})
    }
  }, [])

  return mergedData
}

export const fetchDiscounts = async (discounts) => {

  //Filter down so we don't have repeated IDS fetched
  let discountCodes = _.transform(discounts, function(result, item) {
    if(!_.isEmpty(item) && item !== null){
      let isExistsId = _.indexOf(result, item) > -1
      !isExistsId && result.push(item)
    }
  }, [])

  let discountsData = await Discount.find({ 'discount_code': { $in: discountCodes } }).lean().exec((error, model)=>{
    if (error || !model) {
      return {}
    } else {
      return model
    }
  })

  console.log('discountsData', discountsData)
  let mergedData = _.transform(discounts, function(result, item) {
    if(!_.isEmpty(item) && item !== null){

      //get item by discount code
      let discountData = _.find(discountsData, { discount_code: item })
      result.push({...discountData})
    }
  }, [])

  return mergedData
}


export const calcDiscounts = async (discounts, itemsPrice, shippingPrice) => {
  //cart or shipping
  let discount = 0
  _.map(discounts, (item, key, arr)=>{
    if(item.discount_type === 'shipping'){
      discount += (Number(item.discount_value) * shippingPrice)
    }
    else if(item.discount_type === 'cart'){
      discount += (Number(item.discount_value) * itemsPrice)
    }
  })

  //Don't let discount be higher than items plus shipping
  let itemsAndShipping = Number(itemsPrice) + Number(shippingPrice)
  if(itemsAndShipping < discount){
    discount = itemsAndShipping
  }

  return Number(discount).toFixed(2)
}

//console.log('items', items)
// console.log('productIds', productIds)
// console.log('productsData', productsData)

export const calcItems = async (items) => {
  items = await fetchItems(items)
  let amount = 0
  _.map(items, (item, key, arr)=>{
    amount = amount + (item.price * item.quantity)
  })
  return Number(amount).toFixed(2)
}

export const calcShippingRate = async () => {
  //Calc shipping rate
  let settings = await Settings.findOne({}).lean().exec((error, model)=>{
    if (error || !model) {
      return {}
    } else {
      return model
    }
  })

  let shipping_rate = Number(( (_.isEmpty(settings) || !_.has(settings,'shipping_rate'))
    ? 0.25
    : (settings.shipping_rate !== null || settings.shipping_rate !== '') ? 0.25 : settings.shipping_rate
  ))
  return shipping_rate
}

export const calcShipping = async (items) => {
  //Calc shipping amounts
  let shipping_rate = await calcShippingRate()
  return Number(items * shipping_rate).toFixed(2)
}

let calcTotalQty = async () => {
  let items = await fetchItems()
  let qty = 0
  _.map(items, (item, key, arr)=>{
    qty = qty + (item.quantity)
  })
  return Number(qty)
}

export const calcSubTotal = async (itemsCost, shippingCost, discountsCost) => {
  return Number(Number(itemsCost) + Number(shippingCost) - Number(discountsCost)).toFixed(2)
}

export const calcTaxRate = async () => {
   let settings = await Settings.findOne({}).lean().exec((error, model)=>{
    if (error || !model) {
      return {}
    } else {
      return model
    }
  })

  let tax_rate = Number(( (_.isEmpty(settings) || !_.has(settings,'tax_rate'))
                                  ? 0.25
                                  : (settings.tax_rate === null || settings.tax_rate === '')
                                    ? 0.25
                                    : settings.tax_rate))
  return tax_rate
}

export const calcTax = async (subTotalCost) => {
    let tax_rate = await calcTaxRate()
    return Number(Number(subTotalCost) * Number(tax_rate)).toFixed(2)
}

export const calcTotal = async (subTotalCost, taxCost) => {
    return Number(Number(subTotalCost) + Number(taxCost)).toFixed(2)
}


export const calcAmounts = async (items, discounts) => {
  items = await fetchItems(items)
  discounts = await fetchDiscounts(discounts)
  let itemsCost = await calcItems(items)
  let shippingCost = await calcShipping(itemsCost)
  let discountsCost = await calcDiscounts(discounts, itemsCost, shippingCost)
  let subTotalCost = await calcSubTotal(itemsCost, shippingCost, discountsCost)
  let taxCost = await calcTax(subTotalCost)
  let totalCost = await calcTotal(subTotalCost, taxCost)

  let amount = {
      items: itemsCost,
      shipping: shippingCost,
      discounts: discountsCost,
      sub_total: subTotalCost,
      tax: taxCost,
      total: totalCost,
  }

  return amount
}
