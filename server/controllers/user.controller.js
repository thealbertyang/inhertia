import User from '../models/User'
import Customer from '../models/Customer'
import Guest from '../models/Guest'

import bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import Cookie from 'universal-cookie'

import * as _ from 'lodash'
import nodemailer from 'nodemailer'
import mg from 'nodemailer-mailgun-transport'
import Email from 'email-templates'
import formidable from 'formidable'
const fs = require('fs');
import { Stripe } from 'stripe'

let stripe = Stripe('sk_test_j3lePUHaf2fguMotCLXrQMHx');

export function getByPagination(req, res) {

 User.paginate({}, {sort: { date: -1 }, page: Number(req.params.page), limit: Number(req.params.limit) }, function(err, result) {
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
  //if user term match id and is Found else search textt
  User.paginate({ $text: { $search: req.params.term }}, { sort: { date: -1 }, page: Number(req.params.page), limit: Number(req.params.limit) }, function(err, result) {
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

export function authToken(req, res, next) {
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

          console.log('got into users jwtToken')
          let jwtToken = fields.jwtToken
          if (jwtToken) {
            console.log('we got into jwttoken', jwtToken)
            let verifyUserToken = jwt.verify(jwtToken, 'real')

            console.log('give me verifyUserToken: '+verifyUserToken)
            //fetch some data here
            User.findOne({"_id": verifyUserToken.id}, async function(error, user){
              if (error || !user) {
                return res.status(401).json({ status: 'error', response: 401, message: 'Error with token authentication. '+error});
              }
              else {
                user = user.toObject()
                if(!_.isEmpty(user.roles)){

                  if(_.includes(user.roles, 'customer')){
                    user.customer = await Customer.findOne({ user_id: user._id }).lean().exec(async (error, customer)=>{
                      return customer
                    })
                    if(user.customer.stripe_customer_id){
                      user.customer.stripe_customer = await stripe.customers.retrieve(user.customer.stripe_customer_id)
                    }
                  }

                  if(_.includes(user.roles, 'guest')){
                    user.guest = await Guest.findOne({ user_id: user._id }).lean().exec((error, guest)=>{
                      return guest
                    })
                  }

                  if(_.includes(user.roles, 'support')){
                    user.support = await Support.findOne({ user_id: user._id }).lean().exec((error, support)=>{
                      return support
                    })
                  }

                }

                let data = { ...user, jwtToken: jwtToken, id: user._id }
                return res.status(200).json({ status: 'success', response: 200, message: 'Success with token authentication. ', data: data });
              }
            })
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
                const jwtToken = jwt.sign({ id: user._id, username: user.username, first_name: user.first_name, role: user.role, verifyEmail: user.verifyEmail, avatar: user.avatar }, 'real');
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


export function verifyEmail(req, res, next) {
  console.log('got into users verify email jwtToken')
  let jwtToken = req.params.token
  if (jwtToken) {
    let userData = jwt.verify(jwtToken, 'verifyEmail')
//    User.findOne({"verifyEmail": jwtToken}, function (error, user){
    User.findOne({"email": userData.email }, function (error, user){
      console.log('are we in here though??????')
      if (error || !user) {
        console.log('a22222222222222222222222?')

        return res.status(401).json({ status: 'error', response: 401, message: 'Error with email token authentication. '+error});
      }
      else {
        //found user, but already verified
        //not verified then verify
        console.log('a333333333333333333333333333333?', user)
        console.log('user.verifyEmail', user.verifyEmail)
        console.log('jwtToken', jwtToken)
        if(user.verifyEmail == 'true'){
          user = JSON.parse(JSON.stringify(user))
          let data = { ...user, jwtToken: jwtToken.value, id: user._id }
          return res.status(200).json({ status: 'success', response: 200, message: 'Success your email is already verified. ', data: data });
        }
        else if(user.verifyEmail == jwtToken){
          let data = { ...userData, jwtToken: jwtToken }
            return User.update({'verifyEmail': jwtToken}, { verifyEmail: 'verified' }, function (error, model) {
              if (error || !model) {
                return res.status(400).json({ status: 'error', response: 401, message: 'Error with model edit. '+error});
              } else {
                return res.status(200).json({ status: 'success', response: 200, message: 'Success with email token authentication. ', data: data });
              }
            })
        }
        else {
          return res.status(401).json({ status: 'error', response: 401, message: 'Error with email authentication. '+error});
        }
      }
    })

  }
}


export function resendVerifyEmail(req, res, next) {

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

      let jwtToken = jwt.sign({ email: req.params.email }, 'verifyEmail');

      User.findOneAndUpdate({ verifyEmail: req.params.token }, { verifyEmail: jwtToken }, async function (error, user) {
        if (error) {
          if(error.code == 11000){
            return res.status(409).json({ status: 'error', message: 'Duplicate model.', response: 409, data: {} })
          }
          let inputs = _.mapValues(fields, v=>({ value: v }))
          console.log('errors', error.errors)
          _.mapValues(error.errors, (v, k)=> inputs = {...inputs, [v.path]: { value: v.value ? v.value : '' , error: v.message }} )
          return res.status(400).json({ status: 'error', message: 'Registration failed. Some fields are missing.', response: 400, data: { ...inputs, password: { value: '', error: 'This is required' }, password_confirm: { value: '', error: 'This is required' } } })
        } else {
          //req.session.userId = user._id;
          //console.log(user, req.session)

          let auth = {
            auth: {
              api_key: 'key-040c7266fbe55eb75787645fb72165d2',
              domain: 'sandbox3610fc12f99a4cd29c639d2654c4ccc5.mailgun.org'
            },
          }
          const email = new Email()
          let html = await email.render('user_created_verify/html', {
            name: 'Elon',
            url: process.env.URL,
            token: jwtToken,
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

          return res.json({ status: 'success', response: 200, data: { jwtToken: jwtToken } });

        }
      })
    })
}


export function forgotPassword(req, res, next) {
    console.log('got into users forgotPassword')

    var form = new formidable.IncomingForm(),
       files = [],
      fields = {}

    form.on('field', function(field, value){
      console.log('fields inside', field, value)
      fields = {...fields, [field]: value }
    })

    form.on('error', function(err) {
      console.log("an error has occured with form upload")
      console.log(err)
      req.resume()
    })

    form.on('aborted', function(err) {
      console.log("user aborted upload");
    })

    form.on('end', function() {
      console.log('-> upload done');
    })

    form.parse(req, async function(err) {
      console.log('fields', fields)
      console.log('files', files)

      //Change forgotPassword, token to
      let jwtToken = jwt.sign({ email: fields.email }, 'forgotPassword');

      User.findOneAndUpdate({ email: fields.email }, { forgotPassword: jwtToken }, {upsert: true}, async function (error, user){
        if (error) {
            //Couldn't find email
            return res.status(401).json({ status: 'error', response: 401, message: 'Error with password reset. '+error});
        }
        else {
        //Found email... add token send password reset

          let auth = {
            auth: {
              api_key: 'key-040c7266fbe55eb75787645fb72165d2',
              domain: 'inhertia.com'
            },
          }

          const email = new Email()

          let html = await email.render('user_reset_password/html', {
            url: process.env.URL,
            token: jwtToken,
            username: user.username,
            email: user.email,
          })

          let nodemailerMailgun = nodemailer.createTransport(mg(auth));

          console.log('user', user)
          nodemailerMailgun.sendMail({
            from: '"Inhertia Clothing Brand" <no-reply@inhertia.com>', // sender address
            to: user.email, // list of receivers
            subject: 'Reset password',
            html: html,
            text: 'Reset password',
          }, function (err, info) {
            if (err) {
              console.log('Error: ' + err);
            }
            else {
              console.log('Response: ' + info);
            }
          })

          return res.status(200).json({ status: 'success', response: 200, message: `We sent an email to ${fields.email} change your password.`})

        }
      })
  })
}


export function resetPassword(req, res, next) {
   console.log('got into users forgotPassword')


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

      if (fields.token && fields.password) {
        let jwtToken = jwt.verify(fields.token, 'forgotPassword');
        bcrypt.hash(fields.password, 10, function (err, hash){

          fields.password = hash
          User.findOneAndUpdate({ forgotPassword : fields.token }, { forgotPassword: 'false', password: fields.password }, {upsert:true}, async function (error, user){
            if (error) {
                //Couldn't find email
                return res.status(401).json({ status: 'error', response: 401, message: 'Error with password reset. '+error});
            }
            else {

              return res.status(200).json({ status: 'success', response: 200, message: `Successfully reset your password.`})

            }
          })
        })
      }
  })

}


export function getAll(req, res) {
  User.find().sort('-dateAdded').exec((err, model) => {
    if (err) {
      res.status(500).send(err);
    }
    return res.status(200).json({ message: 'Found models', response: 200, data: model })
  });
}

export function getOne(req, res, next){
  User.findById(req.params.id, async (error, user) => {
    if (error || !user) {
      return res.status(400).json({ status: 'error', response: 401, message: 'Error with finding single model. '+error});
    } else {
      user = user.toObject()
      if(!_.isEmpty(user.roles)){

        if(_.includes(user.roles, 'customer')){
          user.customer = await Customer.findOne({ user_id: user._id }).lean().exec(async (error, customer)=>{
            console.log('what is it then', customer)

            if(customer_id){
              customer.stripe_customer = await stripe.customers.retrieve(customer.stripe_customer_id)
              console.log('what is it then', customer.stripe_customer)
            }

            return customer
          })
        }

        if(_.includes(user.roles, 'guest')){
          user.guest = await Guest.findOne({ user_id: user._id }).lean().exec((error, guest)=>{
            return guest
          })
        }

        if(_.includes(user.roles, 'support')){
          user.support = await Support.findOne({ user_id: user._id }).lean().exec((error, support)=>{
            return support
          })
        }

      }
      return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: user});
    }
  })
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

          bcrypt.hash(fields.password, 10, function(err, hash){
            console.log('fields2', fields, hash)
            fields.password = hash
            let jwtToken = jwt.sign({ email: fields.email }, 'verifyEmail')
            User.create({ ...fields, roles: ['admin'], verifyEmail: jwtToken }, async function (error, user) {
              if (error) {
                if(error.code == 11000){
                  return res.status(409).json({ status: 'error', message: 'The username or email is already taken.', response: 409, data: {} })
                }
                let inputs = _.mapValues(fields, v=>({ value: v }))
                console.log('errors', error.errors)
                _.mapValues(error.errors, (v, k)=> inputs = {...inputs, [v.path]: { value: v.value ? v.value : '' , error: v.message }} )
                return res.status(400).json({ status: 'error', message: 'Registration failed. Some fields are missing.', response: 400, data: { ...inputs, password: { value: '', error: 'This is required' }, password_confirm: { value: '', error: 'This is required' } } })
              } else {
                //req.session.userId = user._id;
                //console.log(user, req.session)
                /*
                let auth = {
                  auth: {
                    api_key: '229e2f96299f7a12133128efaa076ba6-115fe3a6-f7a8c05c',
                    domain: 'sandbox3610fc12f99a4cd29c639d2654c4ccc5.mailgun.org'
                  },
                }
                const email = new Email()
                let html = await email.render('user_created_verify/html', {
                  name: 'Elon',
                  url: process.env.URL,
                  token: jwtToken,
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
                })*/

                return res.json({ status: 'success', response: 200, data: { jwtToken: jwtToken } });

              }
            })
          })
    })
}


export function create(req, res, next) {

  console.log('DID WE GET INB HERE DOE')
        var form = new formidable.IncomingForm(),
            files = [],
            fields = {},
            images = []

        form.uploadDir = '/usr/src/app/img/shop/uploads/avatar';
        form.on('file', function(field, file) {
          files = [ ...files, { field, file } ]
          console.log('we got in file', file, field)
            //rename the incoming file to the file's name
            fs.rename(file.path, form.uploadDir + "/" + file.name);

        })

        function isJson(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }

        form.on('field', function(field, value){
          console.log('fields inside', field, value)
            if(field == 'images[]'){
              images.push(value)
            }
            else if(isJson(value)){
              fields = {...fields, [field]: JSON.parse(value)}
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

          images = [...images, ..._.map(files, (file)=> '/img/shop/uploads/avatar/'+file.file.name)]

          if(fields.password !== fields.password_confirm){
            let inputs = _.mapValues(fields, v=>({ value: v }))
            return res.status(400).json({ status: 'error', message: 'Passwords do not match.', response: 400, data: { ...inputs, password: { value: '', error: 'Passwords do not match.' }, password_confirm: { value: '', error: '\xa0' } }})
          }
            /*

              What kind of user and with what role?

            */
            let userFields = {
              avatar: !_.isEmpty(images) ? images[0] : '',
              username: fields.username,
              phone: fields.phone,
              first_name: fields.first_name,
              last_name: fields.last_name,
              password: hash,
              email: fields.email,
              roles: fields.roles,
              verifyEmail: 'verified',
            }

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(userFields.password, salt);
            userFields.password = hash

            User.create({ ...userFields }, function (error, user) {
              if (error) {
                if(error.code == 11000){
                  return res.status(409).json({ status: 'error', message: 'This username or email is already taken.', response: 409, data: {} })
                }
                let inputs = _.mapValues(fields, v=>({ value: v }))
                console.log('errors', error.errors)
                _.mapValues(error.errors, (v, k)=> inputs = {...inputs, [v.path]: { value: v.value ? v.value : '' , error: v.message }} )
                return res.status(400).json({ status: 'error', message: 'User create failed. Some fields are missing.', response: 400, data: { ...inputs, password: { value: '', error: 'This is required' }, password_confirm: { value: '', error: 'This is required' } } })
              }
              return res.json({ status: 'success', response: 200, data: user })
            })
          })


  }



export async function update(req, res, next){
  console.log('DID WE GET INB HERE DOE')
        var form = new formidable.IncomingForm(),
            files = [],
            fields = {},
            images = []

        form.uploadDir = '/usr/src/app/img/shop/uploads/avatar';
        form.on('file', function(field, file) {
          files = [ ...files, { field, file } ]
          console.log('we got in file', file, field)
            //rename the incoming file to the file's name
            fs.rename(file.path, form.uploadDir + "/" + file.name);

        })

        form.on('field', function(field, value){
          console.log('fields inside', field, value)
            if(field == 'images[]'){
              images.push(value)
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


          images = [...images, ..._.map(files, (file)=> '/img/shop/uploads/avatar/'+file.file.name)]

           let userFields = {
            avatar: !_.isEmpty(images) ? images[0] : '',
            username: fields.username,
            phone: fields.phone,
            first_name: fields.first_name,
            last_name: fields.last_name,
            password: fields.password,
            password_confirm: fields.password_confirm,
            email: fields.email,
            roles: fields.roles ? JSON.parse(fields.roles) : null,
            verifyEmail: 'true',
          }

          //if there isn't a password then we don't need to update password
          if ((userFields.password && userFields.password_confirm)) {

            if(userFields.password !== userFields.password_confirm){
              let inputs = _.mapValues(fields, v=>({ value: v }))
              return res.status(400).json({ status: 'error', message: 'Passwords do not match.', response: 400, data: { ...inputs, password: { value: '', error: 'Passwords do not match.' }, password_confirm: { value: '', error: '\xa0' } }})
            }
            console.log('HASG b4')

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(userFields.password, salt);


              userFields.password = hash

            console.log('HASG a4', hash)


          }
          else if(!userFields.password || !userFields.password_confirm){
            //if one of them is absent then remove
              delete userFields.password;
              delete userFields.password_confirm;
          }

         console.log('userFieds', userFields)

          let user = await User.findOneAndUpdate({"_id": req.params.id}, { $set: userFields }, { new: true }).lean().exec((error, user)=>{
                if (error) {
                  if(error.code == 11000){
                    return res.status(409).json({ status: 'error', message: 'Duplicate model.', response: 409, data: {} })
                  }

                  let inputs = _.mapValues(fields, v=>({ value: v }))
                  console.log('errors', error.errors)
                  _.mapValues(error.errors, (v, k)=>
                      inputs = {...inputs, [v.path]: { value: v.value ? v.value : '' , error: v.message } }
                    )

                  return res.status(400).json({ status: 'error', message: 'Update failed. Some fields are missing.', response: 400, data: { ...inputs, password_confirm: { value: '', error: 'This is required' } } })
                }
                else {


                  return user


              }
          })


          return res.json({ status: 'success', response: 200, data: user })
    })
}



export function remove(req, res, next){
  User.remove({"_id": req.params.id}, function (error, model) {
      if (error || !model) {
        return res.status(400).json({ status: 'error', response: 401, message: 'Error with model delete. '+error});
      } else {
        User.find().sort('-dateAdded').exec((err, model) => {
          if (err) {
            res.status(500).send(err);
          }
          return res.status(200).json({ status: 'success', response: 200, message: 'Success with delete.', data: model })
        })
      }
    })
}
