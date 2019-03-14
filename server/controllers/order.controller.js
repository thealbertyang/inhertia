import Order from '../models/Order'
import Product from '../models/Product'
import Discount from '../models/Discount'
import User from '../models/User'
import Customer from '../models/Customer'
import Guest from '../models/Guest'
import Settings from '../models/Settings'
import Ticket from '../models/Ticket'
import Board from '../models/Board'

import puppeteer from 'puppeteer'

import nodemailer from 'nodemailer'
import mg from 'nodemailer-mailgun-transport'
import Email from 'email-templates'

import { Stripe } from 'stripe'
import * as jwt from 'jsonwebtoken'
import * as _ from 'lodash'
import moment from 'moment'
import formidable from 'formidable'

const util = require('util');
var ObjectID = require('mongodb').ObjectID;

let stripe = Stripe('sk_test_j3lePUHaf2fguMotCLXrQMHx');

let mapInputsToModel = (req) => ({
  stripe_id: req.body.stripe_id.value,
  shipping: {
    line1: req.body.shipping_line1.value,
  },
  status: req.body.status.value,
  user_id: 1,
  cuid: cuid(),
})

/**
 * Get all model
 * @param req
 * @param res
 * @returns void
 */
export function getAll(req, res) {
  Order.find().sort('-dateAdded').exec((err, model) => {
    if (err) {
      res.status(500).send(err);
    }
    return res.status(200).json({ message: 'Found models', response: 200, data: model })
  })
}


/**
 * Get all model
 * @param req
 * @param res
 * @returns void
 */
export function getByPagination(req, res) {

  Order.paginate({}, { page: Number(req.params.page), limit: Number(req.params.limit) }, function(err, result) {
  // result.docs
  // result.total
  // result.limit - 10
  // result.page - 3
  // result.pages

    if (err) {
      res.status(500).send(err);
    }
    return res.status(200).json({ message: 'Found models', response: 200, data: result })
  });
  /*
  Order.find().sort('-dateAdded').exec((err, model) => {
    if (err) {
      res.status(500).send(err);
    }
    return res.status(200).json({ message: 'Found models', response: 200, data: model })
  })*/
}


export function search(req, res, next) {

  Order.paginate({ $text: { $search: req.params.term }}, { page: Number(req.params.page), limit: Number(req.params.limit) }, function(err, result) {
  // result.docs
  // result.total
  // result.limit - 10
  // result.page - 3
  // result.pages

    if (err) {
      res.status(500).send(err);
    }
    return res.status(200).json({ message: 'Found models', response: 200, data: result })
  })

}

/**
 * Get all model
 * @param req
 * @param res
 * @returns void
 */
export function getByUser(req, res) {
  Order.find({ user_id: req.params.id }).sort('-dateAdded').exec((err, model) => {
    if (err) {
      res.status(500).send(err);
    }
    return res.status(200).json({ message: 'Found models', response: 200, data: model })
  });
}


export function getByGuest(req, res) {
  Order.findOne({ _id: req.params.id }).sort('-dateAdded').exec((err, model) => {
    if (err) {
      res.status(500).send(err);
    }
    return res.status(200).json({ message: 'Found models', response: 200, data: model })
  });
}



export function getOne(req, res, next){
//GET route for getting a single model
  Order.findById(req.params.id, async function (error, model) {
    if (error || !model) {
      console.log('whats the error my friend', error);
      return res.status(400).json({ status: 'error', response: 401, message: 'Error with finding single model. '+error});
    } else {

    model = model.toObject()

    if(_.has(model,'ticket_id')){

      let ticket = await Ticket.findOne({ _id: new ObjectID(model.ticket_id) }).lean().exec((error, ticket)=>{
        if (error || !ticket) {
          console.log('whats the error my friend', error);
          return res.status(400).json({ status: 'error', response: 400, message: 'Error with finding single model. '+error});
        } else {


          console.log('ticket retur ', ticket)

            return ticket

        }
      })


            if(!_.isEmpty(ticket.user_id)){
              let user = await User.findOne({ _id: new ObjectID(ticket.user_id) }).lean().exec((error, user)=>{
                if (error || !user) {
                  return res.status(400).json({ status: 'error', response: 401, message: 'Error with finding model. '+error});
                } else {
                  return user
                }
              })

              if(!_.isEmpty(user)){
                ticket['user'] = user
              }


            }


            console.log('ticket first', ticket, !_.isEmpty(ticket.user_id))

            await Promise.all(_.map(ticket.log, async (item, key, arr) => {
              if(_.has(item,'user_id') && !_.isEmpty(item,'user_id') && item.user_id !== ''){

                let userData = await User.findOne({ _id: new ObjectID(item.user_id) }).lean().exec((error, user)=>{
                  if (error || !user) {
                    return res.status(400).json({ status: 'error', response: 401, message: 'Error with finding model. '+error});
                  } else {
                    return user
                  }
                })
                ticket['log'][key]['user'] = userData
                console.log('ticket log middle', ticket['log'][key]['user'])
                console.log('ticket log userData middle', userData)

              //  console.log('mode', model, userData)
              }
            }))
            ticket.log = _.sortBy(ticket.log, function(o) { return new moment(o.date) })

              console.log('ticket log', ticket.log)
              console.log('ticket', ticket)


            //console.log('model', model)


            let board = await Board.findOne({}).lean().exec((error, board)=>{
              if(error || !board){
                return res.status(400).json({ status: 'error', response: 401, message: 'Error with model edit. '+error});
              }
              else {
                return board
              }
            })

            board = !_.isEmpty(board) ? board.board : {}

            board = {
              pending: _.map(board.pending, v=>v),
              processing: _.map(board.processing, v=>v),
              reviewing: _.map(board.reviewing, v=>v),
              resolved: _.map(board.resolved, v=>v),
            }

            let tickets = [
              ...board.pending,
              ...board.processing,
              ...board.reviewing,
              ...board.resolved,
            ]

            console.log('tickets before obj', tickets)


            tickets = await Ticket.find({ _id: { $nin: tickets } }).lean().exec((error, tickets)=>{
              return tickets._id
            })

            tickets = _.map(tickets, v=>v)


            board.pending = [ ...board.pending, ...tickets ]

            let isPending = _.includes(board.pending, req.params.id) ? true : false
            let isProcessing = _.includes(board.processing, req.params.id) ? true : false
            let isReviewing = _.includes(board.reviewing, req.params.id) ? true : false
            let isResolved = _.includes(board.resolved, req.params.id) ? true : false

            if(isPending || !_.isEmpty(ticket.status)){
              ticket.status = 'pending'
            }
            else if(isProcessing){
              ticket.status = 'processing'
            }
            else if(isReviewing){
              ticket.status = 'reviewing'
            }
            else if(isResolved){
              ticket.status = 'resolved'
            }

          console.log('ticket after return', ticket)

      model['ticket'] = ticket

          console.log('model tix', model['ticket'])

    }

    return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: model });
    }
  });
}

export function findByIds(req, res, next){
  let ids = req.query.ids
  /*
  let result = []
  console.log('query ids', req.query.ids, ids[0])
  for(let key in ids){
    result.push(`${ids[key]}`)
  }

  let findByIdsQuery = {
    _id: {
      $in: ["5aeaa30a9cc4c2008cb2ff33","5aea9fda7e2fe9008c248b06sdf"]
    }
  }*/

  //GET route for getting a single model
  Order.find({
    "_id": {
      $in: ids
    }
  }, function (error, model) {
    if (error || !model) {
      console.log('whats the error my friend', error);

      return res.status(400).json({ status: 'error', response: 400, message: 'Error with finding single model. '+error});
    } else {

      return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: model });
    }
  });
}


/**
 * Save a model
 * @param req
 * @param res
 * @returns void
 */

export async function createCustomerOrder(req, res, next) {
var form = new formidable.IncomingForm(),
          files = [],
          fields = {}

    form.on('field', function(field, value){
         fields = {...fields, [field]: value }
      })
      form.on('error', function(err) {
          console.log("an error has occured with form upload");
          console.log(err);
          req.resume();
      });

      form.on('aborted', function(err) {
          console.log("user aborted upload");
      });

      form.on('end', function() {
          console.log('-> upload done');
      });

      form.parse(req, async function(err) {
        console.log('fields', fields)
        console.log('files', files)

        /*
          cart
            shipping
            token
            items
            discounts

                Get product ids, color, size and quantity from products
                then foreach product fetch price and merge data


                get disount codes and merge with fetched discounts

                calcItems
                calcDiscounts

                calcShipping
                calcTax
                calcSubTotal
                calcTotal

                chargePayment

                createOrder
                sendEmail
        */

        let cart = JSON.parse(fields.cart)

        let { items, discounts, shipping, payment } = cart

        let fetchItems = async () => {

          //Filter down so we don't have repeated IDS fetched
          let productIds = _.transform(items, function(result, item) {
            if(!_.isEmpty(item) && item !== null){
              let isExistsId = _.indexOf(result, item.id) > -1
              !isExistsId && result.push(item.id)
            }
          }, [])

          let productsData = await Product.find({"_id": { $in: productIds }}).lean().exec((error, model)=>{
            if (error || !model) {
              return {}
            } else {
              return model
            }
          })

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

        let fetchDiscounts = async () => {

          //Filter down so we don't have repeated IDS fetched
          let discountCodes = _.transform(discounts, function(result, item) {
            if(!_.isEmpty(item) && item !== null){
              let isExistsId = _.indexOf(result, item) > -1
              !isExistsId && result.push(item)
            }
          }, [])

          let discountsData = await Discount.find({ 'discount_code': { $in: discountCodes } }, function (error, model) {
            if (error || !model) {
              return {}
            } else {
              return model
            }
          })

          let mergedData = _.transform(discounts, function(result, item) {
            if(!_.isEmpty(item) && item !== null){

              //get item by discount code
              let discountData = _.find(discountsData, { discount_code: item })
              result.push({...discountData})
            }
          }, [])

          return mergedData
        }


        let calcDiscounts = async () => {
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

        //console.log('items', items)
       // console.log('productIds', productIds)
       // console.log('productsData', productsData)

        let calcItems = async () => {
          let items = await fetchItems()
          let amount = 0
          _.map(items, (item, key, arr)=>{
            amount = amount + (item.price * item.quantity)
          })
          return Number(amount).toFixed(2)
        }

        let calcTotalQty = async () => {
          let items = await fetchItems()
          let qty = 0
          _.map(items, (item, key, arr)=>{
            qty = qty + (item.quantity)
          })
          return Number(qty)
        }



        let calcShippingRate = async () => {
          //Calc shipping rate
          let settings = await Settings.findOne({}).lean().exec((error, model)=>{
            if (error || !model) {
              return {}
            } else {
              return model
            }
          })

            let shipping_rate = Number((!_.has(settings,'shipping_rate') ? 0.25 : settings.shipping_rate))
            return shipping_rate

        }

        let calcShipping = async () => {
          //Calc shipping amounts
          let items = await calcItems()
          let shipping_rate = await calcShippingRate()
          return Number(items * shipping_rate).toFixed(2)
        }


        let calcSubTotal = async () => {
          let items = await calcItems()
          let shipping = await calcShipping()
          let discounts = await calcDiscounts()
          return Number(Number(items) + Number(shipping) - Number(discounts)).toFixed(2)
        }


        let calcTaxRate = async () => {
           let settings = await Settings.findOne({}).lean().exec((error, model)=>{
            if (error || !model) {
              return {}
            } else {
              return model
            }
          })

          let tax_rate = Number((!_.has(settings,'tax_rate') ? 0.25 : settings.tax_rate))
          return tax_rate
        }

        let calcTax = async () => {
            let tax_rate = await calcTaxRate()
            let sub_total = await calcSubTotal()
            return Number(Number(sub_total) * Number(tax_rate)).toFixed(2)
        }

        let calcTotal = async () => {
            let sub_total = await calcSubTotal()
            let tax = await calcTax()
            return Number(Number(sub_total) + Number(tax)).toFixed(2)
        }

        console.log('CALC ITEMS', await calcItems())
        console.log('CALC SHIP RATE', await calcShippingRate())
        console.log('CALC SHIPPING', await calcShipping())
        console.log('CALC DISCOUNTS', await calcDiscounts())
        console.log('CALC SUBTOTAL', await calcSubTotal())
        console.log('CALC TAX', await calcTax())
        console.log('CALC TOTAL', await calcTotal())

        let calcAmounts = async () => {
          let amount = {
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

          amount.items = items
          amount.shipping = shipping
          amount.discounts = discounts
          amount.sub_total = sub_total
          amount.tax = tax
          amount.total = total

          return amount
        }

        items = await fetchItems()
        let amount = await calcAmounts()
        let totalQty = await calcTotalQty()

            console.log('amount', amount)
            console.log('payment', payment)

        let chargePayment = async (payment, amount, totalQty) => {

           if(_.has(payment,'token.id')){
            console.log('payment.token', payment.token.id)
            console.log('amount charge', parseInt(Number(Number(amount.total * 100)/100) * 100))

            const charge = await stripe.charges.create({
              amount: parseInt(Number(Number(amount.total * 100)/100) * 100),
              currency: "usd",
              source: payment.token.id,
              description: amount.total+' payment for '+totalQty+' products @ Inhertia Shop [Payment]',

            })

            console.log('charge', charge)

            return charge
          }

        }

        let charge = await chargePayment(payment, amount, totalQty)

        let order = {
          user_id: req.params.userId,
          stripe_customer_id: '',
          stripe_charge_id: charge.id,
          stripe_source_id: charge.source.id,
          items,
          shipping,
          discounts: [{
            title: '',
            discount_code: '',
            discount_amount: 0,
          }],
          amount,
        }

          console.log('order tho', order)





        await Order.create(order, async function (error, model) {
          if(error || !model){
            if (error) {
              if(error.code == 11000){
                return res.status(409).json({ status: 'error', message: 'Duplicate model.', response: 409, data: {} })
              }

              let inputs = _.mapValues(fields, v=>({ value: v }))
              console.log('errors', error.errors)
              _.mapValues(error.errors, (v, k)=>
                inputs = {...inputs, [v.path]: { value: v.value ? v.value : '' , error: v.message }}
              )

              return res.status(400).json({ status: 'error', message: 'Creating ticket failed. Some fields are missing.', response: 400, data: { ...inputs } })
            }
          }
          else {
            let auth = {
              auth: {
                api_key: '229e2f96299f7a12133128efaa076ba6-115fe3a6-f7a8c05c',
                domain: 'sandbox3610fc12f99a4cd29c639d2654c4ccc5.mailgun.org'
              },
            }
            const email = new Email()
            let html = await email.render('order_created_customer/html', {
              name: shipping.first_name,
              items: items,
              amount: order.amount,
              shipping: order.shipping,
              order_id: model._id,
              date_ordered: moment().format('MMMM DD, YYYY'),
              url: process.env.URL,
            })
            let nodemailerMailgun = nodemailer.createTransport(mg(auth));

            nodemailerMailgun.sendMail({
              from: '"👻" <foo@example.com>', // sender address
              to: 'thealbertyang@gmail.com', // list of receivers
              subject: 'Your order is successful and is processing ✔',
              html: html,
              text: 'Mailgun rocks, pow pow!'
            }, function (err, info) {
              if (err) {
                console.log('Error: ' + err);
                return res.status(400).json({ status: 'error', response: 401, message: 'Error with finding single model. '+error});

              }
              else {
                console.log('Response: ' + info);

                return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: model });


              }
            })
          }
        })





        let deductStock = _.map(items, async (item)=>{


          let productQuery = { $inc: { purchases: Number(item.quantity) } }

          if(item.flash_status === 'on' && item.flash_type === 'stock'){
            if(item.flash_stock > 0){
              productQuery =  { $inc: { ...productQuery['$inc'], flash_stock: -(Number(item.quantity)) } }

            }
            else if(item.flash_stock <= 0){
              productQuery = { $set: { flash_status: 'off', flash_type: '', flash_amount: 0, flash_stock: 0, flash_date: null, flash_sale_amount: 0, published: 'soldout' } }
            }
          }


          await Product.findOneAndUpdate({'_id': item._id}, productQuery, { new: true }).lean().exec((error, product)=>{
            if(product) {
              console.log('worked')
            }
          })

        })


            /*

              After order deduct stock if product is flash on - stock
              purchases ++

            items

            _.map(items, )
            */


        })
}





/**
 * Save a model
 * @param req
 * @param res
 * @returns void
 */
export async function createGuestOrder(req, res, next) {
var form = new formidable.IncomingForm(),
          files = [],
          fields = {}

    form.on('field', function(field, value){
         fields = {...fields, [field]: value }
      })
      form.on('error', function(err) {
          console.log("an error has occured with form upload");
          console.log(err);
          req.resume();
      });

      form.on('aborted', function(err) {
          console.log("user aborted upload");
      });

      form.on('end', function() {
          console.log('-> upload done');
      });

      form.parse(req, async function(err) {
        console.log('fields', fields)
        console.log('files', files)

        /*
          cart
            shipping
            token
            items
            discounts

                Get product ids, color, size and quantity from products
                then foreach product fetch price and merge data


                get disount codes and merge with fetched discounts

                calcItems
                calcDiscounts

                calcShipping
                calcTax
                calcSubTotal
                calcTotal

                chargePayment

                createOrder
                sendEmail
        */

        let cart = JSON.parse(fields.cart)

        let { items, discounts, shipping, payment } = cart

        console.log('cartShipping', cart.shipping)
        let fetchItems = async () => {

          //Filter down so we don't have repeated IDS fetched
          let productIds = _.transform(items, function(result, item) {
            if(!_.isEmpty(item) && item !== null){
              let isExistsId = _.indexOf(result, item.id) > -1
              !isExistsId && result.push(item.id)
            }
          }, [])

          let productsData = await Product.find({"_id": { $in: productIds }}).lean().exec((error, model)=>{
            if (error || !model) {
              return {}
            } else {
              return model
            }
          })

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

        let fetchDiscounts = async () => {

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


        let calcDiscounts = async () => {
          let items = await calcItems()
          let shipping = await calcShipping()
          let discounts = await fetchDiscounts()

          console.log('discounts', discounts)
          console.log('shipping', shipping)
          //cart or shipping
          let discount = 0
          _.map(discounts, (item, key, arr)=>{
            if(item.discount_type === 'shipping'){
              discount = (discount + (Number(item.discount_value) * shipping))
            }
            else if(item.discount_type === 'cart'){
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

        //console.log('items', items)
       // console.log('productIds', productIds)
       // console.log('productsData', productsData)

        let calcItems = async () => {
          let items = await fetchItems()
          let amount = 0
          _.map(items, (item, key, arr)=>{
            amount = amount + (item.price * item.quantity)
          })
          return Number(amount).toFixed(2)
        }

        let calcTotalQty = async () => {
          let items = await fetchItems()
          let qty = 0
          _.map(items, (item, key, arr)=>{
            qty = qty + (item.quantity)
          })
          return Number(qty)
        }



        let calcShippingRate = async () => {
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

        let calcShipping = async () => {
          //Calc shipping amounts
          let items = await calcItems()
          let shipping_rate = await calcShippingRate()
          return Number(items * shipping_rate).toFixed(2)
        }


        let calcSubTotal = async () => {
          let items = await calcItems()
          let shipping = await calcShipping()
          let discounts = await calcDiscounts()
          return Number(Number(items) + Number(shipping) - Number(discounts)).toFixed(2)
        }


        let calcTaxRate = async () => {
           let settings = await Settings.findOne({}).lean().exec((error, model)=>{
            if (error || !model) {
              return {}
            } else {
              return model
            }
          })

          let tax_rate = Number(( (_.isEmpty(settings) || !_.has(settings,'tax_rate')) ? 0.25 : (settings.tax_rate !== null || settings.tax_rate !== '') ? 0.25 : settings.tax_rate
))
          return tax_rate
        }

        let calcTax = async () => {
            let tax_rate = await calcTaxRate()
            let sub_total = await calcSubTotal()
            return Number(Number(sub_total) * Number(tax_rate)).toFixed(2)
        }

        let calcTotal = async () => {
            let sub_total = await calcSubTotal()
            let tax = await calcTax()
            return Number(Number(sub_total) + Number(tax)).toFixed(2)
        }

        console.log('CALC ITEMS', await calcItems())
        console.log('CALC SHIP RATE', await calcShippingRate())
        console.log('CALC SHIPPING', await calcShipping())
        console.log('CALC DISCOUNTS', await calcDiscounts())
        console.log('CALC SUBTOTAL', await calcSubTotal())
        console.log('CALC TAX', await calcTax())
        console.log('CALC TOTAL', await calcTotal())

        let calcAmounts = async () => {
          let amount = {
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

          amount.items = items
          amount.shipping = shipping
          amount.discounts = discounts
          amount.sub_total = sub_total
          amount.tax = tax
          amount.total = total

          return amount
        }

        items = await fetchItems()
        let amount = await calcAmounts()
        let totalQty = await calcTotalQty()

            console.log('amount', amount)
            console.log('payment', payment)

        let chargePayment = async (payment, amount, totalQty) => {

           if(_.has(payment,'token.id')){
            console.log('payment.token', payment.token.id)
            console.log('amount charge', parseInt(Number(Number(amount.total * 100)/100) * 100))

            const charge = await stripe.charges.create({
              amount: parseInt(Number(Number(amount.total * 100)/100) * 100),
              currency: "usd",
              source: payment.token.id,
              description: amount.total+' payment for '+totalQty+' products @ Inhertia Shop [Payment]',

            })

            console.log('charge', charge)

            return charge
          }

        }

        let charge = await chargePayment(payment, amount, totalQty)


        /*

            Make order on light in the box and get light in the box order ID


            then create User, and guest role

        */





            /*

              What kind of user and with what role?

            */



            let userFields = {
              username: shipping.email,
              first_name: shipping.first_name,
              last_name: shipping.last_name,
              password: 'guest',
              email: shipping.email,
              roles: ['guest'],
              verifyEmail: 'verified',
            }

            if(typeof charge === 'undefined') {
              return res.status(400).json({ status: 'error', message: 'Payment Details were invalid.', response: 400, data: { ...userFields } })
            }


            let user = await User.findOneAndUpdate({ email: shipping.email },{ ...userFields }, { upsert: true, new: true, setDefaultsOnInsert: true }).lean().exec((error, user)=>{
              if (error) {
                if(error.code == 11000){
                  return res.status(409).json({ status: 'error', message: 'Duplicate model.', response: 409, data: {} })
                }
                let inputs = _.mapValues(userFields, v=>({ value: v }))
                console.log('errors', error.errors)
                _.mapValues(error.errors, (v, k)=> inputs = {...inputs, [v.path]: { value: v.value ? v.value : '' , error: v.message }} )
                return res.status(400).json({ status: 'error', message: 'User create failed. Some fields are missing.', response: 400, data: { ...inputs, password: { value: '', error: 'This is required' }, password_confirm: { value: '', error: 'This is required' } } })
              }
              else {
                return user
              }
            })


            console.log('user',user)
            let guestFields = {
              user_id: user._id,
              discounts_used: [],
            }

            let guest = await Guest.findOneAndUpdate({ user_id: user._id }, { ...guestFields }, { upsert: true, new: true, setDefaultsOnInsert: true  }).lean().exec((error, guest)=>{
                if(error){ if(error.code == 11000){
                  return res.status(409).json({ status: 'error', message: 'Duplicate model.', response: 409, data: {} })
                }

                  let inputs = _.mapValues(guestFields, v=>({ value: v }))
                  _.mapValues(error.errors, (v, k)=> inputs = {...inputs, [v.path]: { value: v.value ? v.value : '' , error: v.message }} )
                  return res.status(400).json({ status: 'error', message: 'Customer create failed. Some fields are missing.', response: 400, data: { ...inputs, password: { value: '', error: 'This is required' }, password_confirm: { value: '', error: 'This is required' } } })
                }
                else {
                  return guest
                }
            })

            console.log('guest',guest)

            /*User.create({ ...userFields }, function (error, user) {
              if (error) {
                if(error.code == 11000){
                  return res.status(409).json({ status: 'error', message: 'Duplicate model.', response: 409, data: {} })
                }
                let inputs = _.mapValues(fields, v=>({ value: v }))
                console.log('errors', error.errors)
                _.mapValues(error.errors, (v, k)=> inputs = {...inputs, [v.path]: { value: v.value ? v.value : '' , error: v.message }} )
                return res.status(400).json({ status: 'error', message: 'User create failed. Some fields are missing.', response: 400, data: { ...inputs, password: { value: '', error: 'This is required' }, password_confirm: { value: '', error: 'This is required' } } })
              }
              else {
                if(_.includes(JSON.parse(fields.roles), 'customer')){
                  let customerFields = {
                    user_id: user._id,
                    discounts_used: [],
                  }

                  Guest.create({...customerFields }, function(error, customer){
                    if(error || !customer){
                      let inputs = _.mapValues(fields, v=>({ value: v }))
                      _.mapValues(error.errors, (v, k)=> inputs = {...inputs, [v.path]: { value: v.value ? v.value : '' , error: v.message }} )
                      return res.status(400).json({ status: 'error', message: 'Customer create failed. Some fields are missing.', response: 400, data: { ...inputs, password: { value: '', error: 'This is required' }, password_confirm: { value: '', error: 'This is required' } } })
                    }

                    console.log('got in here')
                  })

                }

                return res.json({ status: 'success', response: 200, data: user })

              }

        */



        let order = {
          user_id: user._id,
          stripe_customer_id: '',
          stripe_charge_id: charge.id,
          stripe_source_id: charge.source.id,
          items,
          shipping,
          discounts: [{
            title: '',
            discount_code: '',
            discount_amount: 0,
          }],
          amount,
        }

          console.log('order tho', order)





             await Order.create(order, async function (error, model) {
              if (error) {
                console.log('got error here', error.code)
                if(error.code == 11000){
                  return res.json({ status: 'error'})
                }
                return next(error);
              }
              else {
                let auth = {
                  auth: {
                    api_key: '229e2f96299f7a12133128efaa076ba6-115fe3a6-f7a8c05c',
                    domain: 'sandbox3610fc12f99a4cd29c639d2654c4ccc5.mailgun.org'
                  },
                }
                const email = new Email()
                let html = await email.render('order_created_customer/html', {
                  name: shipping.first_name,
                  items: items,
                  amount: order.amount,
                  shipping: order.shipping,
                  order_id: model._id,
                  date_ordered: moment().format('MMMM DD, YYYY'),
                  url: process.env.URL,
                })
                let nodemailerMailgun = nodemailer.createTransport(mg(auth));

                nodemailerMailgun.sendMail({
                  from: '"👻" <foo@example.com>', // sender address
                  to: 'thealbertyang@gmail.com', // list of receivers
                  subject: 'Your order is successful and is processing ✔',
                  html: html,
                  text: 'Mailgun rocks, pow pow!'
                }, function (err, info) {
                  if (err) {
                    console.log('Error: ' + err);
                    return res.status(400).json({ status: 'error', response: 401, message: 'Error with finding single model. '+error});

                  }
                  else {
                    console.log('Response: ' + info);

                    return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: model });


                  }
                })
              }
            })


            let deductStock = _.map(items, async (item)=>{


            let productQuery = { $inc: { purchases: Number(item.quantity) } }

            if(item.flash_status === 'on' && item.flash_type === 'stock'){
              if(item.flash_stock > 0){
                productQuery =  { $inc: { ...productQuery['$inc'], flash_stock: -(Number(item.quantity)) } }

              }
              else if(item.flash_stock <= 0){
                productQuery = { $set: { flash_status: 'off', flash_type: '', flash_amount: 0, flash_stock: 0, flash_date: null, flash_sale_amount: 0, published: 'soldout' } }
              }
            }


            await Product.findOneAndUpdate({'_id': item._id}, productQuery, { new: true }).lean().exec((error, product)=>{
              if(product) {
                console.log('worked')
              }
            })

          })
        })
        /*





    */

/*
  const items = req.body.items
  const token = req.body.token
  const shipping = req.body.shipping

  const discounts = req.body.discounts

  let amount = 0
  let totalQuantity = 0

  for(let item in items){


    console.log('yo did we get in here doesz')
    console.log('yo did we get in here doesz', items[item])
    console.log('yo did we get in here doesz')
     await Product.findOne({'_id': items[item]._id}, function(err, model) {
      if(model) {

        items[item].title = model.title
        items[item].price = model.price
        items[item].importData = JSON.parse(model.importData)
        amount = (Number(amount) + (Number(model.price) * Number(items[item].quantity))).toFixed(2)
        totalQuantity = (Number(items[item].quantity) + Number(totalQuantity))
        console.log('korean amount', amount)
        console.log('korean amount debugify', model.price)
        console.log('outta town', items[item].quantity)
      }
    })

        console.log('korean loop amount', amount)

  }

  console.log('amount end', amount)
  console.log('items end', items)

    let modelData = {
      stripe_customer_id: null,
      stripe_token_id: token,
      stripe_charge_id: null,
      amount: {
        items: Number(amount).toFixed(2),
        shipping: 0,
        discounts: 0,
        sub_total: 0,
        tax: 0,
        total: 0,
      },
      discounts: discounts,
      items: items,
      shipping: shipping,
      status: 'pending',
      customer_id: 'guest',
    }

    //get shipping rate
    await Settings.findOne({}, function(err, model){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+error})
    }
      modelData.amount.shipping = Number(Number(modelData.amount.items) * Number((_.isEmpty(model.shipping_rate) ? 0.25 : model.shipping_rate))).toFixed(2)
    })

    //Calc discounts amounts
    //for each discounts cookie get rate

    //If cart items are over 100 then apply 100FREESHIP
    if(Number(modelData.amount.items) > 100){
      discounts.push('100FREESHIP')
    }

*/
/*
    let freeShippingUsed = false
    if(discounts.length > 0){
      for(let i = 0; i < discounts.length; i++){
        let item = discounts[i]
        console.log('discounts item', item)

        if(item == '100FREESHIP'){

           discounts[i] = {
              title: 'Free Shipping on Orders over 100$',
              discount_code: '100FREESHIP',
          }

           modelData.amount.discounts = Number(Number(modelData.amount.discounts) + Number(modelData.amount.shipping)).toFixed(2)

        }
        //update discount code to puchases + 1
        //customer codes_used update
        else {
          await Discount.findOne({ '_id': item }, function(error, model){
            console.log('discounts inside find', model)
            //if discount is members only then dont apply
            //guest can use any discounts
            //type



                if(model.discount_type == 'cart' && model.discount_roles == 'all'){

                  modelData.amount.discounts = Number(Number(modelData.amount.discounts) + (Number(modelData.amount.items) * Number(model.discount_value)) ).toFixed(2)

                  discounts[i] = {
                      title: model.title,
                      discount_code: model.discount_code,
                      discount_amount: Number( Number(model.discount_value) * Number(model.amount.items) ).toFixed(2)
                  }
                  console.log('model amount discounts', modelData.amount.discounts)
                  console.log('model amount sub_total', modelData.amount.sub_total)

                }
                else if(model.discount_type == 'shipping' && model.discount_roles == 'all'){

                  if(!_.includes(discounts,'100FREESHIP')){
                    modelData.amount.discounts = Number(Number(modelData.amount.discounts) + (Number(modelData.amount.shipping) * Number(model.discount_value))).toFixed(2)

                    discounts[i] = {
                        title: model.title,
                        discount_code: model.discount_code,
                        discount_amount: Number( Number(model.discount_value) * Number(model.amount.shipping) ).toFixed(2)
                    }
                  }
                  //updated shipping amount
                  ///modelData.amount.shipping = Number(Number(modelData.amount.discounts))

                  console.log('model amount discounts', modelData.amount.discounts)
                  console.log('model amount sub_total', modelData.amount.sub_total)
                 // modelData.amount.shipping =  Number((Number(modelData.amount.shipping) - (Number(modelData.amount.shipping) * Number(model.discount_value)) )).toFixed(2)
                }


          })
        }
      }
      console.log('we got in here sub total', modelData.amount.sub_total)
      console.log('we got in here sub total items', modelData.amount.items)
      console.log('we got in here sub total shipping', modelData.amount.shipping)
      console.log('we got in here sub total discounts', modelData.amount.discounts)
      modelData.amount.sub_total = Number(Number(modelData.amount.items) + Number(modelData.amount.shipping) - Number(modelData.amount.discounts)).toFixed(2)
      console.log('we got in here sub total', modelData.amount.sub_total)


    }
    else {
        if(Number(modelData.amount.items) > 100){
          discounts.push({
              title: 'Free Shipping on Orders over 100$',
              discount_code: '100FREESHIP',
              discount_amount: Number(modelData.amount.shipping).toFixed(2)
          })
          modelData.amount.discounts = Number(modelData.amount.shipping).toFixed(2)
        }
        else {
          modelData.amount.discounts = Number(0).toFixed(2)
        }
        modelData.amount.sub_total = Number(Number(modelData.amount.items) + Number(modelData.amount.shipping) - Number(modelData.amount.discounts)).toFixed(2)
    }



    //get tax rate
    await Settings.findOne({}, function(err, model){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+error})
    }
      modelData.amount.tax = ( Number(modelData.amount.sub_total) * Number((_.isEmpty(model.tax_rate) ? 0.0775 : model.tax_rate)) ).toFixed(2)
    })


    //calc amount total
    modelData.amount.total = Number(Number(modelData.amount.sub_total) + Number(modelData.amount.tax)).toFixed(2)

    if(token){

      let userEmail = shipping.email

      console.log('did we get in here???  1', modelData)
      console.log('did we get in here???  1', modelData.amount.total)

      const charge = await stripe.charges.create({
        amount: parseInt(Number(Number(modelData.amount.total * 100)/100) * 100),
        currency: "usd",
        source: token,
        description: modelData.amount.total+' payment for '+totalQuantity+' products @ Inhertia Shop [Payment]',

      })




        await Settings.findOne({}, async function(err, model){
          if (err) {
            return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+error})
          }

          model = JSON.parse(JSON.stringify(model))

            let inputs = _.transform(model, (result, iv, ik)=>{
                  if(typeof model[ik] === 'object'){
                    _.transform(model[ik], (x, sv, sk)=>{
                      result[ik+'_'+sk] = { value: sv }
                    }, {})
                  }
                  else if(typeof model[ik] === 'string'){
                    result[ik] = { value: iv }
                  }
                }, {})

            let verifyUserToken = jwt.verify(inputs.integrations_lightinthebox_password.value, 'LightInTheBox')

            const browser = await puppeteer.launch({
            headless: true,
            args: [
             // '--proxy-server="direct://"',
             // '--proxy-bypass-list=*',
              '--no-sandbox',
              '--disable-setuid-sandbox',
            ]})

            const page = await browser.newPage();

            const block_resources = ['image', 'stylesheet', 'media', 'font', 'texttrack', 'object', 'beacon', 'csp_report', 'imageset'];
            await page.setRequestInterception(true);
            page.on('request', request => {
              if(request.url && (_.includes(request.url, 'facebook') || _.includes(request.url, 'openx.com') || _.includes(request.url, 'criteo') || _.includes(request.url, 'gstatic') || _.includes(request.url, '.jpg') || _.includes(request.url, '.jpeg') || _.includes(request.url, '.png') || _.includes(request.url, '.gif') || _.includes(request.url, '.css')) ){
                console.log('got request.url', request.url)
                request.abort()
              }
              else if(block_resources.indexOf(request.resourceType) > 0){
                request.abort()
              }
              else {
                request.continue()
              }
            })

            await page.setViewport({ width: 1920, height: 2000 })
            await page.goto('https://www.lightinthebox.com/index.php?main_page=login', { waitUntil: 'networkidle2' });
            await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/login.jpg'})

            await page.type('#loginEmail', inputs.integrations_lightinthebox_username.value); // Types instantly
            await page.type('#loginPassword', verifyUserToken.password); // Types instantly
            await page.click('.signInBtn')
            await page.waitForSelector('.w-orderList')


            await page.goto('https://www.lightinthebox.com/index.php?main_page=shopping_cart', { waitUntil: 'networkidle2' }) && await page.waitForSelector('.mainbox')

            let isCartEmpty = await page.evaluate((element) => document.querySelector(element+' h3') ? true: false ,'.mainbox')
            let isCartFilled = await page.evaluate((element) => document.querySelector(element+' table') ? true: false ,'.mainbox')
            let deleteNo = isCartEmpty ? false : await page.evaluate((element) => document.querySelectorAll(element+ ' .remove') ? document.querySelectorAll(element+' .remove').length :  document.querySelectorAll(element+' .remove').length, '.mainbox')

            //once you login
            //check if cart empty or filled


            while(!isCartEmpty){
              //await page.waitForSelector('.mainbox')
              await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/before_delete.jpg'})
              await page.click('.remove.ir') && await page.evaluate('location.href')
              await page.waitForSelector('.mainbox')

              isCartEmpty = await page.evaluate((element) => document.querySelector(element+' h3') ? true: false ,'.mainbox')
            }
            await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/scrn6delafter2.jpg'})

              //break;

            //if length is greater than 0 then loop
            //re-evaluate list and isCartEmpty
            //if it is then continue
            //other wise stay in loop

            //if cart is empty then continue

            //otherwise delete cart


            let element = ''
            //await page._client.send('Network.clearBrowserCookies');


            for (let i = 0; i < items.length; i++) {
                let item = items[i]
                //console.log('item', item) => item.color.id
                await page.goto('https://www.lightinthebox.com/'+item.url, {waitUntil: 'networkidle2'})

                await page.evaluate('location.href');


                await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/item_'+i+'.jpg'})


                //go to page
                let importData = item.importData
                let colorSelectId = importData.attributes[0].id
                let sizeSelectId = importData.attributes[1].id

               await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/item_'+i+'_country_unselected.jpg'})

                //Select Country First

                const isCountrySelected = await page.evaluate((element) => document.querySelector(element).classList ? document.querySelector(element).classList.contains('us') : false , '.litb-icon-flag')

                if(!isCountrySelected){
                  await page.waitForSelector('.countrytoggleclass')
                  await page.click('.countrytoggleclass')
                  await page.waitForSelector('.country-selector.open')
                  await page.click('span[data-abbr="us"]') && await page.evaluate('location.href')
                  await page.waitForSelector('.country-selector')
                }
                await page.waitForSelector('.country-selector')


                //Select Color
                const isColorSelected = await page.evaluate((element) => document.querySelector(element).classList.contains("selected"), '#value_attr_'+importData.id+'_'+colorSelectId+' .value-'+item.color.id)
                const isSizeSelected = await page.evaluate((element) => document.querySelector(element).classList.contains("selected"), '#value_attr_'+importData.id+'_'+sizeSelectId+' .value-'+item.size.id)

                !isColorSelected && await page.click('#value_attr_'+importData.id+'_'+colorSelectId+' .value-'+item.color.id)
                !isSizeSelected && await page.click('#value_attr_'+importData.id+'_'+sizeSelectId+' .value-'+item.size.id)

                await page.waitForSelector('select[name=cart_quantity]')
                await page.select('select[name=cart_quantity]', String(item.quantity)); // single selection
                const isQtySelected = await page.evaluate((element) => document.querySelector(element).value, 'select[name=cart_quantity] ')

               // await page.goto('https://www.lightinthebox.com/index.php?main_page=shopping_cart', {waitUntil: 'networkidle2'})

               // await page.evaluate('location.href');

                //Add to Cart
                isQtySelected && await page.waitForSelector('.order-actions')
                await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/item_'+i+'_cart_add_before.jpg'})

               const buyAloneExists = await page.evaluate((element) => document.querySelector(element+' #buyAlone') ? true : false, '.order-actions')
               const addToCartExists = await page.evaluate((element) => !!document.querySelector(element+' btn-default'), '.order-actions')

                buyAloneExists ? (await page.click('.order-actions #buyAlone') && await page.evaluate('location.href')) : (await page.click('.order-actions .btn-default') && await page.evaluate('location.href'))
                await page.waitForSelector('.mainbox')
                await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/item_'+i+'_cart_add_after.jpg'})

            }
            await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/arewedereyet.jpg'})

            //All items are added
            //Now we want to proceed to checkout
            await page.waitForSelector('.mainbox')
            await page.waitForSelector('.checkoutBtn')
            await page.click('.checkoutBtn') && await page.evaluate('location.href')
            await page.waitForSelector('#ot_combine_shippnig_insurance')
            let totalShippingCost = await page.evaluate((element) => document.querySelector(element).innerHTML, '#ot_combine_shippnig_insurance')

            //edit address
            await page.click('.toEditAddr')
            await page.waitForSelector('.editAddr')

            //await page.waitForSelector('input[name=firstname]')
            await page.$eval('input[name=firstname]', el => el.value = ' ');
            await page.type('input[name=firstname]', shipping.first_name); // Types instantly

            //await page.waitForSelector('input[name=firstname]')
            await page.$eval('input[name=lastname]', el => el.value = ' ');
            await page.type('input[name=lastname]', shipping.last_name); // Types instantly

            await page.$eval('input[name=street_address]', el => el.value = ' ');
            await page.type('input[name=street_address]', shipping.line1); // Types instantly

            await page.$eval('input[name=suburb]', el => el.value = ' ');
            await page.type('input[name=suburb]', shipping.line2); // Types instantly

            await page.$eval('input[name=city]', el => el.value = ' ');
            await page.type('input[name=city]', shipping.city); // Types instantly

            await page.$eval('input[name=postcode]', el => el.value = '');
            await page.waitForSelector('input[name=postcode]')
            await page.type('input[name=postcode]', shipping.postal_code); // Types instantly
            await page.waitForSelector('input[name=postcode]')

            await page.$eval('input[name=phone]', el => el.value = '');
            await page.type('input[name=phone]', '6266719455'); // Types instantly
            await page.waitForSelector('input[name=phone]')

            await page.click('#country_chzn .chzn-single')
            await page.waitForSelector('#country_chzn .chzn-single-with-drop')
            await page.type('#country_chzn .chzn-search input', shipping.country)
            let targetLinks = await page.$$('#country_chzn .chzn-results li');
            for(let link of targetLinks){
              const linkName = await page.evaluate(el => el.innerHTML, link);
              if (linkName == shipping.country) {
                await link.click();
                // break if only 1 link click is needed.
                break;
              }
            }


            await page.waitForSelector('#zoneId')

            await page.click('#zoneId .chzn-single')
            //await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/before_finl.jpg'})

            await page.waitForSelector('#zoneId .chzn-single-with-drop')
            await page.type('#zoneId .chzn-search input', shipping.state)
            targetLinks = await page.$$('#zoneId .chzn-results li');
            for(let link of targetLinks){
              const linkName = await page.evaluate(el => el.innerHTML, link);
              if (linkName == shipping.state) {
                await link.click();
                // break if only 1 link click is needed.
                break;
              }
            }

           await page.waitForSelector('#zoneId .chzn-single')



            await page.waitForSelector('.tb-shippingAddr .textbtn')
            await page.click('.tb-shippingAddr .textbtn')

            await page.waitFor(2000)

            await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/before_final.jpg'})
            await page.waitForSelector('#wrapper')

            await page.click('#orderForm input[value=chinaups]')
            await page.waitFor(1000)

            await page.waitForSelector('#wrapper')
            await page.waitForSelector('select#paymentMethod')
            await page.select('select#paymentMethod', 'cybersource')
            await page.waitFor(1000)

            await page.click('#submitCart .continueBtn') && await page.evaluate('location.href');
            await page.waitForSelector('.mainbox')
            await page.waitFor(10000)



            const frame = await page.frames().find(f => f.name() == 'cyber_iframe');


            await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/card_submit.jpg'})

            await frame.$eval('input[name=card_number]', el => el.value = '42424242424424');
            await frame.select('select[name=card_type]', '001');
            await frame.select('select[name=card_expiry_month]', '01');
            await frame.select('select[name=card_expiry_year]', '2020');
            await frame.type('input[name=card_cvn]', '900');

            await frame.click('input[name=commit]')

            //await page.click('#useAddress')
            //await page.waitForSelector('.wrapper')


            await page.waitForSelector('#selDJT_chzn')
            await page.click('#selDJT_chzn .chzn-single')
            await page.waitForSelector('#selDJT_chzn .chzn-single-with-drop')
            await page.type('#selDJT_chzn .chzn-search input', shipping.state)
            targetLinks = await page.$$('#selDJT_chzn .chzn-results li');
            for(let link of targetLinks){
              const linkName = await page.evaluate(el => el.innerHTML, link);
              if (linkName == shipping.state) {
                await link.click();
                // break if only 1 link click is needed.
                break;
              }
            }





            /*await page.type('input[name=lastname]', shipping.last_name); // Types instantly
            await page.type('input[name=street_address]', shipping.line1); // Types instantly
            shipping.line2 && await page.type('input[name=suburb]', shipping.line2); // Types instantly
            await page.type('input[name=city]', shipping.city); // Types instantly



            await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/final.jpg'})
            await browser.close()



             //modelData['stripe_customer_id'] = charge.customer
            modelData['stripe_charge_id'] = charge.id
            modelData['stripe_source_id'] = charge.source.id


            console.log('CHARGE SOURCE ID', charge.source.id)

            await Order.create(modelData, async function (error, model) {
              if (error) {
                console.log('got error here', error.code)
                if(error.code == 11000){
                  return res.json({ status: 'error'})
                }
                return next(error);
              }
              else {
                let auth = {
                  auth: {
                    api_key: '229e2f96299f7a12133128efaa076ba6-115fe3a6-f7a8c05c',
                    domain: 'sandbox3610fc12f99a4cd29c639d2654c4ccc5.mailgun.org'
                  },
                }
                const email = new Email()
                let html = await email.render('order_created_guest/html', {
                  name: shipping.first_name,
                  items: items,
                  amount: modelData.amount,
                  shipping: modelData.shipping,
                  order_id: model._id,
                  date_ordered: moment().format('MMMM DD, YYYY'),
                  url: process.env.URL,
                })
                let nodemailerMailgun = nodemailer.createTransport(mg(auth));

                nodemailerMailgun.sendMail({
                  from: '"👻" <foo@example.com>', // sender address
                  to: 'thealbertyang@gmail.com', // list of receivers
                  subject: 'Your order is successful and is processing ✔',
                  html: html,
                  text: 'Mailgun rocks, pow pow!'
                }, function (err, info) {
                  if (err) {
                    console.log('Error: ' + err);
                    return res.status(400).json({ status: 'error', response: 401, message: 'Error with finding single model. '+error});

                  }
                  else {
                    console.log('Response: ' + info);

                    return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: model });


                  }
                })
              }
            })


           // return res.status(200).json({ status: 'success', response: 200, data: req.body, inputs: inputs, message: 'We got in here', verify: verifyUserToken, totalShippingCost})
           // await page.goto('https://www.lightinthebox.com/index.php?main_page=shopping_cart', { waitUntil: 'networkidle2' });
            //await page.evaluate('location.href');
            //await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/scrn.jpg'})



        })



          deduct from product stock
          if product stock is 0 then change to published soldout
          change flash status off

          items

          Product.find()
          if discount used then set that one to purchased

          discounts

          add coins for purchases







        //let amount = 0
        //let totalQuantity = 0

        for(let item in items){
           await Product.findOneAndUpdate({'_id': items[item]._id}, { $inc: { purchases: 1 } }, { new: true }, async function(err, model) {
            if(model) {
                if(model.flash_status == 'on' && model.flash_type == 'stock' && model.flash_stock > 0){
                  await Product.findOneAndUpdate({'_id': items[item]._id}, { $inc: { flash_stock: -(Number(item.quantity)) } }, { new: true }, async function(err, model) {
                    if(model) {
                      if(model.flash_stock <= 0){
                        await Product.findOneAndUpdate({'_id': items[item]._id}, { flash_status: 'off', flash_type: '', flash_amount: 0, flash_date: null, flash_sale_amount: 0, published: 'soldout' }, { new: true }, function(err, model) {
                          if(model) {

                          }
                        })
                      }
                    }
                  })
                }
              /*
              ems[item].title = model.title
              items[item].price = model.price
              items[item].importData = JSON.parse(model.importData)
              amount = (Number(amount) + (Number(model.price) * Number(items[item].quantity))).toFixed(2)
              totalQuantity = (Number(items[item].quantity) + Number(totalQuantity))
              console.log('korean amount', amount)
              console.log('korean amount debugify', model.price)
              console.log('outta town', items[item].quantity)

            }
          })

              console.log('korean loop amount', amount)

        }

      }
      */


}

export function updateMessages(req, res, next){
  //console.log('we got to update ', req.params.id, mapInputsToModel(req))
  let reqBody = _.mapValues(req.body, v=>v.value)

  Order.update({"_id": req.params.id}, { $push: { messages: { user_id: reqBody.user_id, message: reqBody.message, status: 'unread' }  } }, function (error, model) {
    if (error || !model) {
      console.log('whats the error my friend', error);

      return res.status(400).json({ status: 'error', response: 401, message: 'Error with model edit. '+error});
    } else {

      return res.status(200).json({ status: 'success', response: 200, message: 'Success with edit.'});
    }
  });
}

export function update(req, res, next){
  console.log('we got to update ', req.params.id, mapInputsToModel(req))
  Order.update({"_id": req.params.id}, mapInputsToModel(req), function (error, model) {
    if (error || !model) {
      console.log('whats the error my friend', error);

      return res.status(400).json({ status: 'error', response: 401, message: 'Error with model edit. '+error});
    } else {

      return res.status(200).json({ status: 'success', response: 200, message: 'Success with edit.'});
    }
  });
}

export function remove(req, res, next){
  Order.remove({"_id": req.params.id}, function (error, model) {
      if (error || !model) {
        console.log('whats the error my friend', error);

        return res.status(400).json({ status: 'error', response: 401, message: 'Error with model delete. '+error});
      } else {

        return res.status(200).json({ status: 'success', response: 200, message: 'Success with delete.'});
      }
    });
}

export async function scrape(req, res, next){
      const browser = await puppeteer.launch({
         headless: true,
            args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ]})
      const page = await browser.newPage();

      const block_resources = ['image', 'stylesheet', 'media', 'font', 'texttrack', 'object', 'beacon', 'csp_report', 'imageset'];
      await page.setRequestInterception(true);
      page.on('request', request => {
        if(request.url && (_.includes(request.url, 'facebook') || _.includes(request.url, 'openx.com') || _.includes(request.url, 'criteo') || _.includes(request.url, 'gstatic') || _.includes(request.url, '.jpg') || _.includes(request.url, '.jpeg') || _.includes(request.url, '.png') || _.includes(request.url, '.gif') || _.includes(request.url, '.css')) ){
          console.log('got request.url', request.url)
          request.abort()
        }
        else if(block_resources.indexOf(request.resourceType) > 0){
          request.abort()
        }
        else {
          request.continue()
        }
      })

      await page.goto('https://www.lightinthebox.com/p/'+req.params.url);
      await page.screenshot({path: '/usr/src/app/img/admin/uploads/arewedereyet.jpg'})

      let element = await page.evaluate((sel) => {
        let element = document.querySelector('#_prodInfoConfig_');
        return element? element.dataset.config: null
      })

      await browser.close()

      return res.status(200).json({ response: 200, data: JSON.parse(element)[Object.keys(JSON.parse(element))[0]] });

}

export async function lightintheboxOrder(req, res, next){

Settings.findOne({}, async function(err, model){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+error})
    }

    model = JSON.parse(JSON.stringify(model))

      let inputs = _.transform(model, (result, iv, ik)=>{
            if(typeof model[ik] === 'object'){
              _.transform(model[ik], (x, sv, sk)=>{
                result[ik+'_'+sk] = { value: sv }
              }, {})
            }
            else if(typeof model[ik] === 'string'){
              result[ik] = { value: iv }
            }
          }, {})

      let verifyUserToken = jwt.verify(inputs.integrations_lightinthebox_password.value, 'LightInTheBox')
      const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--proxy-server="direct://"',
        '--proxy-bypass-list=*',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ]})
      const page = await browser.newPage();
      await page.goto('https://www.lightinthebox.com/index.php?main_page=login', { waitUntil: 'networkidle2' });
     // await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/login.jpg'})

      await page.type('#loginEmail', inputs.integrations_lightinthebox_username.value); // Types instantly
      await page.type('#loginPassword', verifyUserToken.password); // Types instantly
      await page.click('.signInBtn')
      await page.waitForSelector('.w-orderList')


      await page.goto('https://www.lightinthebox.com/index.php?main_page=shopping_cart', { waitUntil: 'networkidle2' }) && await page.waitForSelector('.mainbox')

      let isCartEmpty = await page.evaluate((element) => document.querySelector(element+' h3') ? true: false ,'.mainbox')
      let isCartFilled = await page.evaluate((element) => document.querySelector(element+' table') ? true: false ,'.mainbox')
      let deleteNo = isCartEmpty ? false : await page.evaluate((element) => document.querySelectorAll(element+ ' .remove') ? document.querySelectorAll(element+' .remove').length :  document.querySelectorAll(element+' .remove').length, '.mainbox')

      //once you login
      //check if cart empty or filled


      while(!isCartEmpty){
        //await page.waitForSelector('.mainbox')
        //await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/before_delete.jpg'})
        await page.click('.remove.ir') && await page.evaluate('location.href')
        await page.waitForSelector('.mainbox')

        isCartEmpty = await page.evaluate((element) => document.querySelector(element+' h3') ? true: false ,'.mainbox')
      }

        //break;
/*
        let length = await page.evaluate((element) => document.querySelectorAll(element+ ' .remove') ? document.querySelectorAll(element+' .remove').length : 0, '.mainbox')
      await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/scrn6delafter2.jpg'})

        if(length == 0){
          isCartEmpty = true
        }
        if(isCartEmpty){
          break;
        }*/

      //if length is greater than 0 then loop
      //re-evaluate list and isCartEmpty
      //if it is then continue
      //other wise stay in loop

      //if cart is empty then continue

      //otherwise delete cart


      let element = ''
      //await page._client.send('Network.clearBrowserCookies');

      for (let i = 0; i < req.body.length; i ++) {
          let item = req.body[i]
          //console.log('item', item) => item.color.id
          await page.goto('https://www.lightinthebox.com/'+item.url, {waitUntil: 'networkidle2'})

          await page.evaluate('location.href');


       //   await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/item_'+i+'.jpg'})

          //go to page
          let importData = JSON.parse(item.importData)
          let colorSelectId = importData.attributes[0].id
          let sizeSelectId = importData.attributes[1].id

        //  await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/item_'+i+'_country_unselected.jpg'})

          //Select Country First

          const isCountrySelected = await page.evaluate((element) => document.querySelector(element).classList ? document.querySelector(element).classList.contains('us') : false , '.litb-icon-flag')

          if(!isCountrySelected){
            await page.waitForSelector('.countrytoggleclass')
            await page.click('.countrytoggleclass')
            await page.waitForSelector('.country-selector.open')
            await page.click('span[data-abbr="us"]') && await page.evaluate('location.href')
            await page.waitForSelector('.country-selector')
          }
          await page.waitForSelector('.country-selector')


          //Select Color
          const isColorSelected = await page.evaluate((element) => document.querySelector(element).classList.contains("selected"), '#value_attr_'+importData.id+'_'+colorSelectId+' .value-'+item.color.id)
          const isSizeSelected = await page.evaluate((element) => document.querySelector(element).classList.contains("selected"), '#value_attr_'+importData.id+'_'+sizeSelectId+' .value-'+item.size.id)

          !isColorSelected && await page.click('#value_attr_'+importData.id+'_'+colorSelectId+' .value-'+item.color.id)
          !isSizeSelected && await page.click('#value_attr_'+importData.id+'_'+sizeSelectId+' .value-'+item.size.id)

          await page.waitForSelector('select[name=cart_quantity]')
          await page.select('select[name=cart_quantity]', String(item.quantity)); // single selection
          const isQtySelected = await page.evaluate((element) => document.querySelector(element).value, 'select[name=cart_quantity] ')

         // await page.goto('https://www.lightinthebox.com/index.php?main_page=shopping_cart', {waitUntil: 'networkidle2'})

         // await page.evaluate('location.href');

          //Add to Cart
          isQtySelected && await page.waitForSelector('.order-actions')
         // await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/item_'+i+'_cart_add_before.jpg'})

         const buyAloneExists = await page.evaluate((element) => document.querySelector(element+' #buyAlone') ? true : false, '.order-actions')
         const addToCartExists = await page.evaluate((element) => !!document.querySelector(element+' btn-default'), '.order-actions')

          buyAloneExists ? (await page.click('.order-actions #buyAlone') && await page.evaluate('location.href')) : (await page.click('.order-actions .btn-default') && await page.evaluate('location.href'))
          await page.waitForSelector('.mainbox')
          //await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/item_'+i+'_cart_add_after.jpg'})

      }
      //await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/arewedereyet.jpg'})

      //All items are added
      //Now we want to proceed to checkout
      await page.waitForSelector('.mainbox')
      await page.click('.checkoutBtn') && await page.evaluate('location.href')
      await page.waitForSelector('#ot_combine_shippnig_insurance')
      let totalShippingCost = await page.evaluate((element) => document.querySelector(element).innerHTML, '#ot_combine_shippnig_insurance')
      await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/final.jpg'})
      await browser.close()

      return res.status(200).json({ status: 'success', response: 200, data: req.body, inputs: inputs, message: 'We got in here', verify: verifyUserToken, totalShippingCost})
     // await page.goto('https://www.lightinthebox.com/index.php?main_page=shopping_cart', { waitUntil: 'networkidle2' });
      //await page.evaluate('location.href');
      //await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/scrn.jpg'})



  })



}

export async function shipping(req, res, next){

Settings.findOne({}, async function(err, model){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+error})
    }

    model = JSON.parse(JSON.stringify(model))

      let inputs = _.transform(model, (result, iv, ik)=>{
            if(typeof model[ik] === 'object'){
              _.transform(model[ik], (x, sv, sk)=>{
                result[ik+'_'+sk] = { value: sv }
              }, {})
            }
            else if(typeof model[ik] === 'string'){
              result[ik] = { value: iv }
            }
          }, {})

      let verifyUserToken = jwt.verify(inputs.integrations_lightinthebox_password.value, 'LightInTheBox')
      const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--proxy-server="direct://"',
        '--proxy-bypass-list=*',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ]})
      const page = await browser.newPage();
      await page.goto('https://www.lightinthebox.com/index.php?main_page=login', { waitUntil: 'networkidle2' });
     // await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/login.jpg'})

      await page.type('#loginEmail', inputs.integrations_lightinthebox_username.value); // Types instantly
      await page.type('#loginPassword', verifyUserToken.password); // Types instantly
      await page.click('.signInBtn')
      await page.waitForSelector('.w-orderList')


      await page.goto('https://www.lightinthebox.com/index.php?main_page=shopping_cart', { waitUntil: 'networkidle2' }) && await page.waitForSelector('.mainbox')

      let isCartEmpty = await page.evaluate((element) => document.querySelector(element+' h3') ? true: false ,'.mainbox')
      let isCartFilled = await page.evaluate((element) => document.querySelector(element+' table') ? true: false ,'.mainbox')
      let deleteNo = isCartEmpty ? false : await page.evaluate((element) => document.querySelectorAll(element+ ' .remove') ? document.querySelectorAll(element+' .remove').length :  document.querySelectorAll(element+' .remove').length, '.mainbox')

      //once you login
      //check if cart empty or filled


      while(!isCartEmpty){
        //await page.waitForSelector('.mainbox')
        //await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/before_delete.jpg'})
        await page.click('.remove.ir') && await page.evaluate('location.href')
        await page.waitForSelector('.mainbox')

        isCartEmpty = await page.evaluate((element) => document.querySelector(element+' h3') ? true: false ,'.mainbox')
      }

        //break;
/*
        let length = await page.evaluate((element) => document.querySelectorAll(element+ ' .remove') ? document.querySelectorAll(element+' .remove').length : 0, '.mainbox')
      await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/scrn6delafter2.jpg'})

        if(length == 0){
          isCartEmpty = true
        }
        if(isCartEmpty){
          break;
        }*/

      //if length is greater than 0 then loop
      //re-evaluate list and isCartEmpty
      //if it is then continue
      //other wise stay in loop

      //if cart is empty then continue

      //otherwise delete cart


      let element = ''
      //await page._client.send('Network.clearBrowserCookies');

      for (let i = 0; i < req.body.length; i ++) {
          let item = req.body[i]
          //console.log('item', item) => item.color.id
          await page.goto('https://www.lightinthebox.com/'+item.url, {waitUntil: 'networkidle2'})

          await page.evaluate('location.href');


       //   await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/item_'+i+'.jpg'})

          //go to page
          let importData = JSON.parse(item.importData)
          let colorSelectId = importData.attributes[0].id
          let sizeSelectId = importData.attributes[1].id

        //  await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/item_'+i+'_country_unselected.jpg'})

          //Select Country First

          const isCountrySelected = await page.evaluate((element) => document.querySelector(element).classList ? document.querySelector(element).classList.contains('us') : false , '.litb-icon-flag')

          if(!isCountrySelected){
            await page.waitForSelector('.countrytoggleclass')
            await page.click('.countrytoggleclass')
            await page.waitForSelector('.country-selector.open')
            await page.click('span[data-abbr="us"]') && await page.evaluate('location.href')
            await page.waitForSelector('.country-selector')
          }
          await page.waitForSelector('.country-selector')


          //Select Color
          const isColorSelected = await page.evaluate((element) => document.querySelector(element).classList.contains("selected"), '#value_attr_'+importData.id+'_'+colorSelectId+' .value-'+item.color.id)
          const isSizeSelected = await page.evaluate((element) => document.querySelector(element).classList.contains("selected"), '#value_attr_'+importData.id+'_'+sizeSelectId+' .value-'+item.size.id)

          !isColorSelected && await page.click('#value_attr_'+importData.id+'_'+colorSelectId+' .value-'+item.color.id)
          !isSizeSelected && await page.click('#value_attr_'+importData.id+'_'+sizeSelectId+' .value-'+item.size.id)

          await page.waitForSelector('select[name=cart_quantity]')
          await page.select('select[name=cart_quantity]', String(item.quantity)); // single selection
          const isQtySelected = await page.evaluate((element) => document.querySelector(element).value, 'select[name=cart_quantity] ')

         // await page.goto('https://www.lightinthebox.com/index.php?main_page=shopping_cart', {waitUntil: 'networkidle2'})

         // await page.evaluate('location.href');

          //Add to Cart
          isQtySelected && await page.waitForSelector('.order-actions')
         // await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/item_'+i+'_cart_add_before.jpg'})

         const buyAloneExists = await page.evaluate((element) => document.querySelector(element+' #buyAlone') ? true : false, '.order-actions')
         const addToCartExists = await page.evaluate((element) => !!document.querySelector(element+' btn-default'), '.order-actions')

          buyAloneExists ? (await page.click('.order-actions #buyAlone') && await page.evaluate('location.href')) : (await page.click('.order-actions .btn-default') && await page.evaluate('location.href'))
          await page.waitForSelector('.mainbox')
          //await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/item_'+i+'_cart_add_after.jpg'})

      }
      //await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/arewedereyet.jpg'})

      //All items are added
      //Now we want to proceed to checkout
      await page.waitForSelector('.mainbox')
      await page.click('.checkoutBtn') && await page.evaluate('location.href')
      await page.waitForSelector('#ot_combine_shippnig_insurance')
      let totalShippingCost = await page.evaluate((element) => document.querySelector(element).innerHTML, '#ot_combine_shippnig_insurance')
      await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/final.jpg'})
      await browser.close()

      return res.status(200).json({ status: 'success', response: 200, data: req.body, inputs: inputs, message: 'We got in here', verify: verifyUserToken, totalShippingCost})
     // await page.goto('https://www.lightinthebox.com/index.php?main_page=shopping_cart', { waitUntil: 'networkidle2' });
      //await page.evaluate('location.href');
      //await page.screenshot({path: '/usr/src/app/src/img/admin/uploads/scrn.jpg'})



  })



}
