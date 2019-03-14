import User from '../models/User'
import Customer from '../models/Customer'
import Product from '../models/Product'
import * as _ from 'lodash'
import bcrypt from 'bcrypt'

import * as jwt from 'jsonwebtoken'

import nodemailer from 'nodemailer'
import mg from 'nodemailer-mailgun-transport'
import Email from 'email-templates'
import formidable from 'formidable'

var ObjectID = require('mongodb').ObjectID;

import { Stripe } from 'stripe'

let stripe = Stripe('sk_test_j3lePUHaf2fguMotCLXrQMHx');

/**
 * Get all model
 * @param req
 * @param res
 * @returns void
 */
export function getAll(req, res) {
  Customer.find().sort('-dateAdded').exec((err, model) => {
    if (err) {
      res.status(500).send(err);
    }
    return res.status(200).json({ message: 'Found models', response: 200, data: model })
  });
}


export function getByPagination(req, res) {
  Customer.paginate({}, { page: Number(req.params.page), limit: Number(req.params.limit) }, function(err, result) {
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


export function search(req, res, next) {

  Customer.paginate({ $text: { $search: req.params.term }}, { page: Number(req.params.page), limit: Number(req.params.limit) }, function(err, result) {
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

export function getByUserId(req, res, next){
  Customer.findOne({ user_id: req.params.id }, async function (error, model) {
    if (error || !model) {
      return res.status(400).json({ status: 'error', response: 401, message: 'Error with finding single model. '+error});
    } else {
        if(!_.isEmpty(model.stripe_customer_id) && model.stripe_customer_id !=='undefined' && model.stripe_customer_id !== ''){
          const customer = await stripe.customers.retrieve(model.stripe_customer_id)
          if(customer){
            console.log('customer', customer)
            model = model.toObject() 
            model['stripe_customer'] = customer
            return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: model });
          }
          else {
            return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: model });
          }
        }
        else {
            return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: model });
        }
    }
  })
}




export function login(req, res, next) {
      var form = new formidable.IncomingForm(),
            files = [],
            fields = {}

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

          if (fields.username && fields.password) {
            User.authenticate(fields.username, fields.password, function (error, user) {
              if (error || !user) {
                return res.status(401).json({ status: 'error', response: 401, message: 'Error with authentication. '+error});
              } 
              else {
                const jwtToken = jwt.sign({ id: user._id, username: user.username, first_name: user.first_name, role: user.role, verifyEmail: user.verifyEmail }, 'real');
                const cookie = req.cookies.jwtToken

                if (jwtToken) {
                  res.cookie('jwtToken', jwtToken, { maxAge: 9000000 })
                  req.cookies.jwtToken = jwtToken
                }
                //console.log('got in', req.session);
                //req.session.userIdtest = user._id;
                return res.status(200).json({ status: 'success', response: 200, message: 'Success with authentication. '+error, jwtToken: jwtToken });
              }
            })
          } else {  
            return res.status(401).json({ 
              status: 'error', 
              response: 401, 
              message: 'All fields required', 
              data: { 
                username: (!fields.username && { value: '', error: 'This is required.' }), 
                password: (!fields.password && { value: '', error: 'This is required.' })  
              } 
            })
          }
        })
/*
  */
}



export function register(req, res, next) {

  console.log('DID WE GET INB HERE DOE')
        var form = new formidable.IncomingForm(),
            files = [],
            fields = {}

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

     

        if(fields.password !== fields.password_confirm){
          let inputs = _.mapValues(fields, v=>({ value: v }))
          return res.status(400).json({ status: 'error', message: 'Passwords do not match.', response: 400, data: { ...inputs, password: { value: '', error: 'Passwords do not match.' }, password_confirm: { value: '', error: '\xa0' } }})
        }

        
        bcrypt.hash(fields.password, 10, function (err, hash){
          fields.password = hash
          let jwtToken = jwt.sign({ email: fields.email }, 'verifyEmail')

          User.create({ ...fields, roles: ['customer'], verifyEmail: jwtToken}, function (error, user) {
            if (error) {
              if(error.code == 11000){
                return res.status(409).json({ status: 'error', message: 'Duplicate model.', response: 409, data: {} })
              }
             
              let inputs = _.mapValues(fields, v=>({ value: v }))
              console.log('errors', error.errors)
              _.mapValues(error.errors, (v, k)=> 
                inputs = {...inputs, [v.path]: { value: v.value ? v.value : '' , error: v.message }}
              )

              return res.status(400).json({ status: 'error', message: 'Registration failed. Some fields are missing.', response: 400, data: { ...inputs, password_confirm: { value: '', error: 'This is required' } } })
            } 
            else {
              //req.session.userId = user._id;
              //console.log(user, req.session)
              Customer.create({ user_id: user._id }, async function(error, customer){
                if (error) {
                  if(error.code == 11000){
                    return res.status(409).json({ status: 'error', message: 'Duplicate model.', response: 409, data: {} })
                  }
                  let inputs = _.mapValues(fields, v=>({ value: v }))
                    console.log('errors', error.errors)
                    _.mapValues(error.errors, (v, k)=> 
                      inputs = {...inputs, [v.path]: { value: v.value ? v.value : '' , error: v.message }}
                    )
                  //or use error.message
                  return res.status(400).json({ status: 'error', message: 'Registration failed. Some fields are missing.', response: 400, data: { ...inputs, password_confirm: { value: '', error: 'This is required' } } })
                } 
                else {
                    let auth = {
                      auth: {
                        api_key: '229e2f96299f7a12133128efaa076ba6-115fe3a6-f7a8c05c',
                        domain: 'sandbox3610fc12f99a4cd29c639d2654c4ccc5.mailgun.org'
                      },
                    }
                    const email = new Email()
                    let html = await email.render('user_created_verify/html', {
                      name: fields.firstName,
                      url: process.env.URL,
                      token: jwtToken, 
                      email: fields.email,
                    })
                    let nodemailerMailgun = nodemailer.createTransport(mg(auth));

                    nodemailerMailgun.sendMail({
                      from: '"👻" <no-reply@thealbertyang.com>', // sender address
                      to: 'thealbertyang@gmail.com', // list of receivers
                      subject: 'Complete your account sign up', 
                      html: html,
                      text: 'Mailgun rocks, pow pow!'
                    }, function (err, info) {
                      if (err) {
                        console.log('Error: ' + err);
                      }
                      else {
                        console.log('Response: ' + info);
                      }
                    })

                    jwtToken = jwt.sign({ id: user._id, username: user.username, first_name: user.first_name, role: user.role, verifyEmail: user.verifyEmail }, 'real');
                    const cookie = req.cookies.jwtToken

                    if (jwtToken) {
                      res.cookie('jwtToken', jwtToken, { maxAge: 9000000 })
                      req.cookies.jwtToken = jwtToken
                    }
                
                    return res.json({ status: 'success', response: 200, data: { jwtToken: jwtToken } });
              }
              })
            }
          })
        })
    

      
    })
}

/**
 * Save a model
 * @param req
 * @param res
 * @returns void
 */
export function create(req, res, next) {

    var form = new formidable.IncomingForm(),
        files = [],
        fields = {}

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

    form.parse(req, function(err) {
      console.log('fields', fields)
      console.log('files', files)

      if(!_.isEmpty(fields.username) || !_.isEmpty(fields.first_name) || !_.isEmpty(fields.last_name) || !_.isEmpty(fields.email) || !_.isEmpty(fields.password) || !_.isEmpty(fields.password_confirm) ){
        console.log('we are trying to create user and customer')

        if(fields.password !== fields.password_confirm){
          let inputs = _.mapValues(fields, v=>({ value: v }))
          return res.status(400).json({ status: 'error', message: 'Passwords do not match.', response: 400, data: { ...inputs, password: { value: '', error: 'Passwords do not match.' }, password_confirm: { value: '', error: '\xa0' } }})
        }

        
        bcrypt.hash(fields.password, 10, function (err, hash){
          fields.password = hash
          let jwtToken = jwt.sign({ email: fields.email }, 'verifyEmail')

          User.create({ ...fields, roles: ['customer'], verifyEmail: jwtToken}, function (error, user) {
            if (error) {
              if(error.code == 11000){
                return res.status(409).json({ status: 'error', message: 'Duplicate model.', response: 409, data: {} })
              }
             
              let inputs = _.mapValues(fields, v=>({ value: v }))
              console.log('errors', error.errors)
              _.mapValues(error.errors, (v, k)=> 
                inputs = {...inputs, [v.path]: { value: v.value ? v.value : '' , error: v.message }}
              )

              return res.status(400).json({ status: 'error', message: 'Registration failed. Some fields are missing.', response: 400, data: { ...inputs, password_confirm: { value: '', error: 'This is required' } } })
            } 
            else {
              //req.session.userId = user._id;
              //console.log(user, req.session)
              Customer.create({ user_id: user._id }, async function(error, customer){
                if (error) {
                  if(error.code == 11000){
                    return res.status(409).json({ status: 'error', message: 'Duplicate model.', response: 409, data: {} })
                  }
                  let inputs = _.mapValues(fields, v=>({ value: v }))
                    console.log('errors', error.errors)
                    _.mapValues(error.errors, (v, k)=> 
                      inputs = {...inputs, [v.path]: { value: v.value ? v.value : '' , error: v.message }}
                    )
                  //or use error.message
                  return res.status(400).json({ status: 'error', message: 'Registration failed. Some fields are missing.', response: 400, data: { ...inputs, password_confirm: { value: '', error: 'This is required' } } })
                } 
                else {
                    let auth = {
                      auth: {
                        api_key: '229e2f96299f7a12133128efaa076ba6-115fe3a6-f7a8c05c',
                        domain: 'sandbox3610fc12f99a4cd29c639d2654c4ccc5.mailgun.org'
                      },
                    }
                    const email = new Email()
                    let html = await email.render('user_created_verify/html', {
                      name: fields.firstName,
                      url: process.env.URL,
                      token: jwtToken, 
                      email: fields.email,
                    })
                    let nodemailerMailgun = nodemailer.createTransport(mg(auth));

                    nodemailerMailgun.sendMail({
                      from: '"👻" <no-reply@thealbertyang.com>', // sender address
                      to: 'thealbertyang@gmail.com', // list of receivers
                      subject: 'Complete your account sign up', 
                      html: html,
                      text: 'Mailgun rocks, pow pow!'
                    }, function (err, info) {
                      if (err) {
                        console.log('Error: ' + err);
                      }
                      else {
                        console.log('Response: ' + info);
                      }
                    })

                    const jwtToken = jwt.sign({ id: user._id, username: user.username, first_name: user.first_name, role: user.role, verifyEmail: user.verifyEmail }, 'real');
                    const cookie = req.cookies.jwtToken

                    if (jwtToken) {
                      res.cookie('jwtToken', jwtToken, { maxAge: 9000000 })
                      req.cookies.jwtToken = jwtToken
                    }
                
                    return res.json({ status: 'success', response: 200, data: { jwtToken: jwtToken } });
              }
              })
            }
          })
        })
      }
      
      else {
        console.log('we are not trying to create customer only')
      }


      /*


      */

      /*

      let fields = _.mapValues(req.body, v=>v.value)
      if(fields.password !== fields.password_confirm){
        let inputs = _.mapValues(fields, v=>({ value: v }))
        return res.status(400).json({ status: 'error', message: 'Passwords do not match.', response: 400, data: { ...inputs, password: { value: '', error: 'Passwords do not match.' }, password_confirm: { value: '', error: '\xa0' } }})
      }

        Customer.create({}, function(error, customer){
        if (error) {
          if(error.code == 11000){
            return res.status(409).json({ status: 'error', message: 'Duplicate model.', response: 409, data: {} })
          }
          let inputs = _.mapValues(fields, v=>({ value: v }))
            console.log('errors', error.errors)
            _.mapValues(error.errors, (v, k)=> 
              inputs = {...inputs, [v.path]: { value: v.value ? v.value : '' , error: v.message }}
            )

          //or use error.message
          return res.status(400).json({ status: 'error', message: 'Registration failed. Some fields are missing.', response: 400, data: { ...inputs, password_confirm: { value: '', error: 'This is required' } } })
        } 
        else {
          bcrypt.hash(fields.password, 10, function (err, hash){
                fields.password = hash;
                let jwtToken = jwt.sign({ email: fields.email }, 'verifyEmail');

                User.create({ ...fields, customer_id: customer._id, role: ['customer'], verifyEmail: jwtToken}, async function (error, user) {
                  if (error) {
                    if(error.code == 11000){
                      return res.status(409).json({ status: 'error', message: 'Duplicate model.', response: 409, data: {} })
                    }
                   
                  let inputs = _.mapValues(fields, v=>({ value: v }))
                    console.log('errors', error.errors)
                    _.mapValues(error.errors, (v, k)=> 
                      inputs = {...inputs, [v.path]: { value: v.value ? v.value : '' , error: v.message }}
                    )

                    return res.status(400).json({ status: 'error', message: 'Registration failed. Some fields are missing.', response: 400, data: { ...inputs, password_confirm: { value: '', error: 'This is required' } } })
                  } else {
                    //req.session.userId = user._id;
                    //console.log(user, req.session)

                          let auth = {
                            auth: {
                              api_key: '229e2f96299f7a12133128efaa076ba6-115fe3a6-f7a8c05c',
                              domain: 'sandbox3610fc12f99a4cd29c639d2654c4ccc5.mailgun.org'
                            },
                          }
                          const email = new Email()
                          let html = await email.render('user_created_verify/html', {
                            name: fields.firstName,
                            url: process.env.URL,
                            token: jwtToken, 
                            email: fields.email,
                          })
                          let nodemailerMailgun = nodemailer.createTransport(mg(auth));

                          nodemailerMailgun.sendMail({
                            from: '"👻" <no-reply@thealbertyang.com>', // sender address
                            to: 'thealbertyang@gmail.com', // list of receivers
                            subject: 'Complete your account sign up', 
                            html: html,
                            text: 'Mailgun rocks, pow pow!'
                          }, function (err, info) {
                            if (err) {
                              console.log('Error: ' + err);
                            }
                            else {
                              console.log('Response: ' + info);
                            }
                          })
                    return res.json({ status: 'success', response: 200 });
                  }
                })

          })
        }
      })*/
    })
}


export function getOne(req, res, next){

    Customer.findOne({ '_id': req.params.id }, async function (error, model) {
      if (error || !model) {
          return res.status(400).json({ status: 'error', response: 401, message: 'Error with finding single model. '+error});
        } else {

console.log('we got in here die')
          //get stripe object with customer id
          if(model.stripe_customer_id){
console.log('we got in here trippy')

            const customer = await stripe.customers.retrieve(model.stripe_customer_id)
console.log('we got in here trippy', customer)

            model.stripe_customer = customer
          }

          return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: model });
      }
    })
}

export function findByIds(req, res, next){
  let ids = req.query.ids
  User.find({"_id": { $in: ids } }, function (error, model) {
    if (error || !model) {
      return res.status(400).json({ status: 'error', response: 400, message: 'Error with finding single model. '+error});
    } else {
      return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: model });
    }
  })
}

export function update(req, res, next){
   var form = new formidable.IncomingForm(),
            files = [],
            fields = {}

      form.on('field', function(field, value){
          console.log('fields inside', field, value)
          if(field == 'shipping'){
           fields = {...fields, [field]: _.isEmpty(value) ? [{}] : JSON.parse(value) }
          }
          else if(field == 'wishlist'){
           fields = {...fields, [field]: _.isEmpty(value) ? [{}] : JSON.parse(value) }
          }
          else if(field == 'discounts_used'){
           fields = {...fields, [field]: _.isEmpty(value) ? [] : JSON.parse(value) }
          }
          else {
           fields = {...fields, [field]: value }
          }
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

          Customer.findOneAndUpdate({"_id": req.params.id}, fields, { new: true }, function (error, model) {
            if (error || !model) {
              return res.status(400).json({ status: 'error', response: 401, message: 'Error with model edit. '+error});
            } else {
              return res.status(200).json({ status: 'success', response: 200, message: 'Success with edit.', data: model });
            }
          })
        })
}

export function remove(req, res, next){
  Customer.remove({"_id": req.params.id}, function (error, model) {
      if (error || !model) {
        return res.status(400).json({ status: 'error', response: 401, message: 'Error with model delete. '+error});
      } else {
       
        return res.status(200).json({ status: 'success', response: 200, message: 'Success with delete.'});
      }
    })
}


export function getCustomerWishlist(req, res, next){
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
         
          let customer = await Customer.findOne({"_id": req.params.id}).lean().exec((error, model)=> {
            if (error || !model) {
              return res.status(400).json({ status: 'error', response: 401, message: 'Error with model edit. '+error});
            } else {

             return model
            }
          })

          let fetchItems = async () => {
           let ids = _.map(customer.wishlist, v=>v.product_id)
              

          console.log('ids', ids)
          console.log('customer', customer)
          let productsData = await Product.find({ '_id': { $in: ids } }).lean().exec((error, model)=> {
            if (error || !model) {
              return {}
            } else {
              return model
            }
          })
          console.log('productsData', productsData)

          let mergedData = _.transform(ids, function(result, item) {
            if(!_.isEmpty(item) && item !== null){



              //get item by product id
              let productData = _.find(productsData, { _id: new ObjectID(item) })

              result.push({...productData})



            console.log('productsData', productsData)
            console.log('productData', productData)
            console.log('item', item)
            console.log('result', result)

            }
          }, [])

          console.log('mergedData', mergedData)

          return mergedData
          }
              return res.status(200).json({ status: 'success', response: 200, message: 'Success with edit.', data: await fetchItems() });

          /*await Customer.findOne({"_id": req.params.id}).lean().exec(async (error, model)=> {
            if (error || !model) {
              return res.status(400).json({ status: 'error', response: 401, message: 'Error with model edit. '+error});
            } else {
              
              let wishlist = []
              console.log('model', model.wishlist)
              console.log('model', model.wishlist.length)

              wishlist = await _.transform(model.wishlist, async (results, item)=>{

                await Product.findOne({ '_id': item._id }).lean().exec((error, model) => {
                  results.push(model)
                  console.log('new wishlist inside', wishlist)
                  console.log('new wishlist inside', model)
                })
                console.log('new wishlist', wishlist)
              }, [])

              console.log('new wishlist outlise', wishlist)

              return res.status(200).json({ status: 'success', response: 200, message: 'Success with edit.', data: wishlist });
            }
          })*/
        })
}

export function deleteCustomerWishlist(req, res, next){
      Customer.update({"_id": req.params.id}, { wishlist: [] }, function (error, model) {
        if (error || !model) {
          return res.status(400).json({ status: 'error', response: 401, message: 'Error with model edit. '+error});
        } else {
          return res.status(200).json({ status: 'success', response: 200, message: 'Success with edit.'});
        }
      })
}


export function pushCustomerWishlist(req, res, next){
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
          Customer.update({"_id": req.params.id, 'wishlist._id': { $ne: fields.product_id } },  { $push: { wishlist: { _id: fields.product_id } } }, function (error, model) {
            if (error || !model) {
              return res.status(400).json({ status: 'error', response: 401, message: 'Error with model edit. '+error});
            } else {
              return res.status(200).json({ status: 'success', response: 200, message: 'Success with edit.'});
            }
          })
        })

    
}

export function pullCustomerWishlist(req, res, next){
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


          Customer.update({"_id": req.params.id},  { $pull: { wishlist: { product_id: fields.product_id } } }, function (error, model) {
            if (error || !model) {
              return res.status(400).json({ status: 'error', response: 401, message: 'Error with model edit. '+error});
            } else {
              return res.status(200).json({ status: 'success', response: 200, message: 'Success with edit.'});
            }
          })
        })
}


export function updateCustomerPrimaryShipping(req, res, next){
 let reqBody = _.mapValues(req.body, v=>v.value)

console.log('reqBody', reqBody)
      Customer.update({"_id": req.params.id}, { shipping_primary_id: reqBody.shipping_id }, function (error, model) {
        if (error || !model) {
          return res.status(400).json({ status: 'error', response: 401, message: 'Error with model edit. '+error});
        } else {
          return res.status(200).json({ status: 'success', response: 200, message: 'Success with edit.'});
        }
      })
}

export function updateCustomerShipping(req, res, next){
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

          Customer.findOneAndUpdate({"_id": req.params.id},  { $push: { shipping: { first_name: fields.first_name, last_name: fields.last_name, phone: fields.phone, line1: fields.line1, line2: fields.line2, city: fields.city, state: fields.state, postal_code: fields.postal_code, country: fields.country } } }, function (error, model) {
            if (error || !model) {
              return res.status(400).json({ status: 'error', response: 401, message: 'Error with model edit. '+error});
            } else {
              return res.status(200).json({ status: 'success', response: 200, message: 'Success with edit.'});
            }
          })
        })
}

export function deleteCustomerShipping(req, res, next){
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
          console.log('req.params.id', req.params.id)
          Customer.update({"_id": req.params.id},  { $pull: { shipping: {'_id': fields.shipping_id} } }, function (error, model) {
            if (error || !model) {
              return res.status(400).json({ status: 'error', response: 401, message: 'Error with model edit. '+error});
            } else {
              return res.status(200).json({ status: 'success', response: 200, message: 'Success with edit.'});
            }
          })
        })
}

export function updateCustomerPrimaryPayment(req, res, next){
 let reqBody = _.mapValues(req.body, v=>v.value)

console.log('reqBody', reqBody)
      Customer.findOne({ '_id': req.params.id}, async function (error, model) {
        if (error || !model) {
          return res.status(400).json({ status: 'error', response: 401, message: 'Error with model edit. '+error});
        } else {
console.log('did we get in here?')

          const updatePrimaryCard = await stripe.customers.update(model.stripe_customer_id, {
              default_source: reqBody.card_id
          }, function(err, customer)
           {
          

              console.log('customer', customer)
              return res.status(200).json({ status: 'success', response: 200, message: 'Success with edit.'});

          })
        }
      })
}

export function createCustomerPayment(req, res, next){
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

          Customer.findOne({ '_id': req.params.id}, async function(error, model) {
            if (error || !model) {
              return res.status(400).json({ status: 'error', response: 401, message: 'Error with model edit. '+error});
            } else {
              if(model.stripe_customer_id){
                  const card = await stripe.customers.createSource(
                    model.stripe_customer_id, 
                    { source: fields.token }
                  )
                  return res.status(200).json({ status: 'success', response: 200, message: 'Success with edit.'});

              }
              else {
                  //user cust id to find their email and create stripe cust

                  User.findOne({ _id: model.user_id }, async function (error, model) {
                    // Create a Customer card source:
                    const customer = await stripe.customers.create({
                      source: fields.token,
                      email: model.email,
                    })

                    Customer.update({ '_id': req.params.id }, { stripe_customer_id: customer.id }, (error, model) =>{
                      return res.status(200).json({ status: 'success', response: 200, message: 'Success with edit.'});
                    })
                  })
              }
            }
          })
        })
}

export function deleteCustomerPayment(req, res, next){
 let reqBody = _.mapValues(req.body, v=>v.value)
 console.log('reqBody', reqBody.card_id)
      Customer.findOne({"_id": req.params.id}, async function (error, model) {
        if (error || !model) {
          return res.status(400).json({ status: 'error', response: 401, message: 'Error with model edit. '+error});
        } else {

          const deleteCard = await stripe.customers.deleteCard(
            model.stripe_customer_id,
            reqBody.card_id,
            function(err, confirmation) {
              // asynchronously called
              return res.status(200).json({ status: 'success', response: 200, message: 'Success with edit.'});
            }
          )
        }
      })
}