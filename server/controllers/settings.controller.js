import Settings from '../models/Settings';
import Order from '../models/Order';
import Product from '../models/Product';
import ProductCategory from '../models/ProductCategory';
import ProductReview from '../models/ProductReview';
import Customer from '../models/Customer';
import User from '../models/User';
import Discount from '../models/Discount';
import moment from 'moment'

import * as jwt from 'jsonwebtoken'
import * as _ from 'lodash'
import formidable from 'formidable'

var fs = require('fs');


export function getOne(req, res, next){
  Settings.findOne({}, function(error, model){
    if (error || !model) {

      let files = [];
      console.log('model', model)
      fs.readdirSync('/usr/src/app/backups/').forEach(file => {
        files.push(file)
      })

      model = {
        name: '',
        description: '',
        restore_files: files,
        tax_rate: '',
        shipping_rate: '',
        warnings_delete: '',
      }

      return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: model })
    }
      /*

        if we have nothing then load with ''

        name: String,
        description: String,
        tax_rate: String,
        integrations_stripe:
        integrations_instagram:
        integrations_lightinthebox_username: String,
        integrations_lightinthebox_password: String,
        warnings_delete:

       _id, name, description, warnings_delete, tax_rate, integrations_stripe, integrations_instagram, integrations_lightinthebox_username, integrations_lightinthebox_password

      */
    model = JSON.parse(JSON.stringify(model))

    //Make sure to add restore files
    let files = [];
    console.log('model', model)
    fs.readdirSync('/usr/src/app/backups/').forEach(file => {
      files.push(file)
    })

    model['restore_files'] = files

    return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: model })
  })
}

export async function databaseBackup(req, res) {


  //Grab all models and save into a file?

  let backup = {}

  await Settings.findOne({}, function(err, model){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+err})
    }

    backup = {...backup, settings: model}
  })

  await User.find({}, function(err, model){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+err})
    }

    backup = {...backup, users: model}
  })

  await Order.find({}, function(err, model){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+err})
    }

    backup = {...backup, orders: model}
  })

  await Product.find({}, function(err, model){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+err})
    }

    backup = {...backup, products: model}
  })

  await ProductReview.find({}, function(err, model){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+err})
    }

    backup = {...backup, productReviews: model}
  })

  await ProductCategory.find({}, function(err, model){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+err})
    }

    backup = {...backup, productCategories: model}
  })

  await Discount.find({}, function(err, model){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+err})
    }

    backup = {...backup, discounts: model}
  })

  await Customer.find({}, function(err, model){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+err})
    }

    backup = {...backup, customers: model}
  })

  backup = JSON.stringify(backup);
  fs.writeFile('/usr/src/app/backups/'+moment().format('M-D-YYYY-h_mm_ssa')+'.json', backup, 'utf8');

  return res.status(200).json({ message: 'Found models', response: 200, data: backup })


}

export async function databaseRestore(req, res){

    /*

      //delete all models

      //insert all models with the specified backup

    */

  await Settings.deleteMany({}, function(err){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+err})
    }
  })

  await Order.deleteMany({}, function(err){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+err})
    }
  })

  await Product.deleteMany({}, function(err){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+err})
    }
  })

  await ProductReview.deleteMany({}, function(err){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+err})
    }
  })

  await ProductCategory.deleteMany({}, function(err){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+err})
    }
  })

  await Discount.deleteMany({}, function(err){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+err})
    }
  })

  await Customer.deleteMany({}, function(err){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+err})
    }
  })

  await User.deleteMany({}, function(err){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+err})
    }
  })

  /* RESTORE */

  //open file
  let backup = JSON.parse(fs.readFileSync('/usr/src/app/backups/'+req.params.file+'.json', 'utf8'));


console.log('backup', backup)
 await Settings.insertMany([backup['settings']], function(err){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+err})
    }
  })

  await Order.insertMany(backup['orders'], function(err){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+err})
    }
  })

  await Product.insertMany(backup['products'], function(err){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+err})
    }
  })

  await ProductReview.insertMany(backup['productReviews'], function(err){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+err})
    }
  })

  await ProductCategory.insertMany(backup['productCategories'], function(err){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+err})
    }
  })

  await Discount.insertMany(backup['discounts'], function(err){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+err})
    }
  })

  await Customer.insertMany(backup['customers'], function(err){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+err})
    }
  })

  await User.insertMany(backup['users'], function(err){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+err})
    }
  })
    return res.status(200).json({ message: 'Restored Database', response: 200, backup })


}

export async function databaseReset(req, res){
  await Settings.deleteMany({}, function(err){
     if (err) {
       return res.status(500).json({ status: 'error', response: 500, message: 'Error with deleting models. '+err})
     }
   })
   return res.status(200).json({ message: 'ResetDatabase', response: 200 })
}

/**
 * Get all model
 * @param req
 * @param res
 * @returns void
 */
export function getAll(req, res) {
  Settings.find().sort('-dateAdded').exec((err, model) => {
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+error})
    }
    return res.status(200).json({ message: 'Found models', response: 200, data: model })
  })
}

export function update(req, res, next) {
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

          fields = {
            name: fields.name,
            description: fields.description,
            tax_rate: fields.tax_rate,
            shipping_rate: fields.shipping_rate,
            warnings_delete: fields.warnings_delete,
          }

          //console.log('reqBody', reqBody)
          Settings.findOneAndUpdate({}, { $set: fields }, { upsert: true, new: true }, function (error, model) {
            if (error || !model) {
              console.log('got error here', error.code)
              console.log('validation error', error['ValidatonError'])
              let inputs = _.mapValues(fields, v=>({ value: v }))

              console.log('errors', error.errors)
              _.mapValues(error.errors, (v, k)=>
                inputs = {...inputs, [v.path]: { value: v.value ? v.value : '' , error: v.message }}
              )
              if(error.code == 11000){
                return res.status(409).json({ status: 'error', message: 'Duplicate model.', response: 409, data: {} })
              }
              return res.status(400).json({ status: 'error', message: error.message, response: 400, data: inputs })
            } else {
                model = JSON.parse(JSON.stringify(model))

                //Make sure to add restore files
                let files = [];
                console.log('model', model)
                fs.readdirSync('/usr/src/app/backups/').forEach(file => {
                  files.push(file)
                })

                model['restore_files'] = files

              return res.status(200).json({ status: 'success', response: 200, message: 'Success with edit.', data: model})
            }
          })
        })
}

export function integrationsUpdate(req, res, next) {
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

          fields = {
            integrations_stripe: fields.integrations_stripe,
            integrations_instagram: fields.integrations_instagram,
            integrations_lightinthebox_username: fields.integrations_lightinthebox_username,
            integrations_lightinthebox_password: jwt.sign({ password: fields.integrations_lightinthebox_password }, 'LightInTheBox'),
          }

          Settings.findOneAndUpdate({}, { $set: fields }, { upsert: true, new: true }, function (error, model) {
            if (error || !model) {
              let inputs = _.mapValues(fields, v=>({ value: v }))
                console.log('errors', error.errors)
              _.mapValues(error.errors, (v, k)=> inputs = {...inputs, [v.path]: { value: v.value ? v.value : '' , error: v.message } } )
              return res.status(400).json({ status: 'error', message: error.message, response: 400, data: inputs })
            }
            else {
                //Make sure to add restore files
                let files = [];
                console.log('model', model)
                fs.readdirSync('/usr/src/app/backups/').forEach(file => {
                  files.push(file)
                })

                model['restore_files'] = files

              return res.status(200).json({ status: 'success', response: 200, message: 'Success with edit.', data: model})

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
export async function create(req, res, next) {
  //always convert at point of usage
  let reqBody = _.mapValues(req.body, v=>v.value)
  Settings.create({
    name: reqBody.name,
    description: reqBody.description,
    shipping_rate: reqBody.shipping_rate,
    tax_rate: reqBody.tax_rate,
    warnings: {
      delete: reqBody.warnings_delete
    }
  }, function (error, model) {
    if (error) {
      //console.log('got error here', error.code)
      //console.log('validation error', error['ValidatonError'])
      let inputs = _.mapValues(error.errors, (v,k)=>{
        let name = k
        let kind = v.kind
        return ({ value: '', error: 'This is '+kind })
      })

      return res.status(400).json({ status: 'error', message: error.message, response: 400, data: inputs })
      if(error.code == 11000){
        return res.status(409).json({ status: 'error', message: 'Duplicate model.', response: 409, data: {} })
      }
      return next(error);
    } else {
      return res.json({ status: 'success', response: 200 })
    }
  })
}

export function remove(req, res, next){
  Settings.deleteOne({}, function (error, model) {
      if (error || !model) {
        return res.status(400).json({ status: 'error', response: 400, message: 'Error with model delete. '+error})
      } else {
        return res.status(200).json({ status: 'success', response: 200, message: 'Success with delete.'})
      }
    })
}
