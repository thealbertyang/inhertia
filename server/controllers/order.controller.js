import Order from '../models/Order'
import Product from '../models/Product'
import Discount from '../models/Discount'
import User from '../models/User'
import Customer from '../models/Customer'
import Guest from '../models/Guest'
import Settings from '../models/Settings'
import * as Cart from '../libs/Cart'

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

let stripe = Stripe('');

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

  Order.paginate({}, { page: Number(req.params.page), limit: Number(req.params.limit), sort: '-date' }, function(err, result) {
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
  Order.findOne({ _id: req.params.id }).sort('-dateAdded').lean().exec(async (error, order) => {
    if (error) {
      return res.status(400).json({ status: 'error', response: 400, message: 'Could not find order id.'});
    }


    //only if user is guest

    order.user = await User.findById(order.user_id).lean().exec()
    if(order.stripe_charge_id){
      console.log('got in here')

      const orderCharge = await stripe.charges.retrieve(order.stripe_charge_id)
      order.stripe_charge = orderCharge

    }

    return res.status(200).json({ message: 'Found models', response: 200, data: order })
  });
}



export function getOne(req, res, next){
//GET route for getting a single model
  Order.findById(req.params.id, async function (error, order) {
    if (error || !order) {
      console.log('whats the error my friend', error);
      return res.status(400).json({ status: 'error', response: 400, message: 'Error with finding single model. '+error});
    } else {

    order = order.toObject()

    order.user = await User.findById(order.user_id).lean().exec()
    if(order.stripe_charge_id){
      console.log('got in here')

      const orderCharge = await stripe.charges.retrieve(order.stripe_charge_id)
      order.stripe_charge = orderCharge

    }

    return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: order });
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

const chargeCard = async (payment, amounts) => await stripe.charges.create({
  amount: parseInt(Number(Number(amounts.total * 100)/100) * 100),
  currency: "usd",
  customer: payment.customer,
  source: payment.id,
  description: amounts.total+' payment for products @ Inhertia Shop [Payment]',
})

const chargeToken = async (payment, amounts) => await stripe.charges.create({
  amount: parseInt(Number(Number(amounts.total * 100)/100) * 100),
  currency: "usd",
  source: payment.token.id,
  description: amounts.total+' payment for products @ Inhertia Shop [Payment]',
})

const chargePayment = async (payment, amounts) => {
  if(_.has(payment,'token.id')){
    return await chargeToken(payment, amounts)
  }
  else if(_.has(payment,'id')){
    return await chargeCard(payment, amounts)
  }
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
                calcShipping
                calcDiscounts
                calcTax
                calcSubTotal
                calcTotal

                chargePayment

                createOrder
                sendEmail
        */

        let cart = JSON.parse(fields.cart)
        let { items, discounts, shipping, payment } = cart

        if(items.length === 0) {
          return res.status(400).json({ status: 'error', message: 'You need a items to be able to purchase.', response: 400 })
        }

        let user = await User.findOne({ _id: req.params.userId }).lean().exec();

        console.log('user', user)
        let amounts = await Cart.calcAmounts(items, discounts)
        let fetchedItems = await Cart.fetchItems(items)
        let charge = await chargePayment(payment, amounts)

        if(typeof charge === 'undefined') {
          return res.status(400).json({ status: 'error', message: 'Payment Details were invalid.', response: 400 })
        }

        let orderQuery = {
          user_id: req.params.userId,
          stripe_customer_id: '',
          stripe_charge_id: charge.id,
          stripe_source_id: charge.source.id,
          items: fetchedItems,
          shipping,
          discounts: [{
            title: '',
            discount_code: '',
            discount_amount: 0,
          }],
          amounts,
        }

        let deductStock = _.map(fetchedItems, async (item)=>{
          let productQuery = { $inc: { purchases: (Number(item.quantity)) } }

          await Product.findOneAndUpdate({'_id': item._id}, productQuery, { new: true }).lean().exec((error, product)=>{
            if(product) {
              console.log('worked')
            }
            else {
              console.log('error',error)
            }
          })
        })

        await Order.create(orderQuery, async function (error, model) {
          if(error || !model){
            if (error) {
              if(error.code == 11000){
                return res.status(409).json({ status: 'error', message: 'Duplicate model.', response: 409, data: {} })
              }
              return res.status(400).json({ status: 'error', message: 'Creating ticket failed. Some fields are missing.', response: 400 })
            }
          }
          else {
            let auth = {
              auth: {
                api_key: '',
                domain: 'inhertia.com'
              },
            }

            console.log('charge', charge)
            const email = new Email()
            let html = await email.render('order_created/html', {
              name: shipping.first_name,
              items: fetchedItems,
              amount: amounts,
              shipping,
              charge,
              order_id: model._id,
              date_ordered: moment().format('MMMM DD, YYYY'),
              url: process.env.URL,
            })
            let nodemailerMailgun = nodemailer.createTransport(mg(auth));

            nodemailerMailgun.sendMail({
              from: '"Inhertia Clothing Brand" <no-reply@inhertia.com>', // sender address
              to: user.email, // list of receivers
              subject: 'Your order is successful and is processing ✔',
              html: html,
              text: 'Mailgun rocks, pow pow!'
            }, function (err, info) {
              if (err) {
                console.log('Error: ' + err);
                return res.status(400).json({ status: 'error', response: 400, message: 'Could not send email. Please check your email and try again.' });

              }
              else {
                console.log('Response: ' + info);
                return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: model });
              }
            })
          }
        })



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

        if(items.length === 0) {
          return res.status(400).json({ status: 'error', message: 'You need a items to be able to purchase.', response: 400 })
        }

        if(typeof shipping.email === 'undefined') {
          return res.status(400).json({ status: 'error', message: 'You need a shipping email if you are a guest.', response: 400, data: { email: "Required." } })
        }

        let amounts = await Cart.calcAmounts(items, discounts)
        let fetchedItems = await Cart.fetchItems(items)
        let charge = await chargePayment(payment, amounts)

        if(typeof charge === 'undefined') {
          return res.status(400).json({ status: 'error', message: 'Payment Details were invalid.', response: 400 })
        }

        let userFields = {
          username: shipping.email,
          first_name: shipping.first_name,
          last_name: shipping.last_name,
          password: 'guest',
          email: shipping.email,
          roles: ['guest'],
          verifyEmail: 'verified',
        }

        let userExists = await User.findOne({ email: shipping.email }).lean().exec((error, user)=>{
          if(user){
            return user
          }
          else {
            return false
          }
        })

        let user;

        if(userExists){
          user = userExists
        }
        else {
          user = await User.findOneAndUpdate({ email: shipping.email },{ ...userFields }, { upsert: true, new: true, setDefaultsOnInsert: true }).lean().exec((error, user)=>{
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
        }

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


        let orderQuery = {
          user_id: user._id,
          stripe_customer_id: '',
          stripe_charge_id: charge.id,
          stripe_source_id: charge.source.id,
          items: fetchedItems,
          shipping,
          discounts: [{
            title: '',
            discount_code: '',
            discount_amount: 0,
          }],
          amounts,
        }

        console.log('order tho', orderQuery)

        await Order.create(orderQuery, async function (error, model) {
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
                api_key: '',
                domain: 'inhertia.com'
              },
            }
            console.log('charge', charge)

            const email = new Email()
            let html = await email.render('order_created/html', {
              name: shipping.first_name,
              items: fetchedItems,
              amount: amounts,
              charge,
              shipping,
              order_id: model._id,
              date_ordered: moment().format('MMMM DD, YYYY'),
              url: process.env.URL,
            })
            let nodemailerMailgun = nodemailer.createTransport(mg(auth));

            nodemailerMailgun.sendMail({
              from: '"Inhertia Clothing Brand" <no-reply@inhertia.com>', // sender address
              to: shipping.email, // list of receivers
              subject: 'Your order is successful and is processing ✔',
              html: html,
              text: ''
            }, function (err, info) {
              if (err) {
                console.log('Error: ' + err);
                return res.status(400).json({ status: 'error', response: 400, message: 'Error with finding single model. '+error});

              }
              else {
                console.log('Response: ' + info);

                return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: model });


              }
            })
          }
        })

         //console.log('payment.token', payment.token && payment.token.id, payment.id)
         //console.log('amount charge', parseInt(Number(Number(amount.total * 100)/100) * 100))
         //const charge = await chargeCustomerCard(payment, amount, totalQty)
         //console.log('charge', charge)
         //return charge
         console.log('we got payment.id / card', payment)
         //return res.status(200).json({ status: 'success', response: 200, message: 'Order Success.'  });
       })

}

export function updateMessages(req, res, next){
  //console.log('we got to update ', req.params.id, mapInputsToModel(req))
  let reqBody = _.mapValues(req.body, v=>v.value)

  Order.update({"_id": req.params.id}, { $push: { messages: { user_id: reqBody.user_id, message: reqBody.message, status: 'unread' }  } }, function (error, model) {
    if (error || !model) {
      console.log('whats the error my friend', error);

      return res.status(400).json({ status: 'error', response: 400, message: 'Error with model edit.'});
    } else {

      return res.status(200).json({ status: 'success', response: 200, message: 'Success with edit.'});
    }
  });
}

export function update(req, res, next){
  console.log('we got to update ', req.params.id)
  var form = new formidable.IncomingForm(),
      files = [],
      fields = {},
      images = []


  form.on('field', function(field, value){
    console.log('fields inside', field, value)
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
    Order.update({"_id": req.params.id}, fields, function (error, model) {
      if (error || !model) {
        console.log('whats the error my friend', error);

        return res.status(400).json({ status: 'error', response: 400, message: 'Error with model edit. '+error});
      } else {

        return res.status(200).json({ status: 'success', response: 200, message: 'Success with edit.'});
      }
    })
  })
}

export function remove(req, res, next){
  Order.remove({"_id": req.params.id}, function (error, model) {
      if (error || !model) {
        console.log('whats the error my friend', error);

        return res.status(400).json({ status: 'error', response: 400, message: 'Error with model delete. '+error});
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
