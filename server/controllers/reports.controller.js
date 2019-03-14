import Product from '../models/Product';
import ProductReview from '../models/ProductReview';
import Order from '../models/Order';
import ProductCategory from '../models/ProductCategory'
import Customer from '../models/Customer'
import * as _ from 'lodash'
import formidable from 'formidable'
const fs = require('fs');
var moment = require('moment')

/**
 * Get all model
 * @param req
 * @param res
 * @returns void
 */
export function getAll(req, res) {
  Product.find().sort('-dateAdded').exec((err, model) => {
    if (err) {
      res.status(500).send(err);
    }
    return res.status(200).json({ message: 'Found models', response: 200, data: model })
  });
}

/**
 * Get all published model
 * @param req
 * @param res
 * @returns void
 */
export function getByCategory(req, res) {
  //let reqBody = _.mapValues(req.body, v=>v.value)
  console.log('got hereS')
  console.log('slug', req.params.slug)

  ProductCategory.findOne({ slug: req.params.slug }, function(err, model){
    if (err) {
      return res.status(500).json({ status: 'error', response: 500, message: 'Error with finding models. '+error})
    }

  Product.find({ product_category_ids: model._id }).sort('-dateAdded').exec((err, model) => {
    if (err) {
      res.status(500).send(err);
    }
    return res.status(200).json({ message: 'Found models', response: 200, data: model })
  })

  })





}

/**
 * Get all model
 * @param req
 * @param res
 * @returns void
 */
export function getPublished(req, res) {
  Product.find({ published: 'true' }).sort('-dateAdded').exec((err, model) => {
    if (err) {
      res.status(500).send(err);
    }
    return res.status(200).json({ message: 'Found models', response: 200, data: model })
  });
}

/**
 * Get all model
 * @param req
 * @param res
 * @returns void
 */
export function getTrendingProducts(req, res) {

  console.log('get getTrendingProducts')
  Product.find({ published: 'true' }).lean().sort({date: 'desc'}).exec(async (err, model) => {
    if (err) {
      res.status(500).send(err);
    }

    let averageRating = 0;

    for(let i=0; i < model.length; i++){

     await ProductReview.find({'product_id': model[i]._id}, function(err, review) {

      for(let iR=0; iR < review.length; iR++){

        if(review[iR].rating) {
          averageRating = averageRating + Number(review[iR].rating)

          //items[i].username = model.username
         // items[i].first_name = model.first_name
          //items[i].last_name = model.last_name
        } 

        model[i]['ratingAverage'] = Number(averageRating / review.length)
        model[i]['ratingAmount'] = Number(review.length)
      }

      if(averageRating == 0){
        model[i]['ratingAverage'] = 0
        model[i]['ratingAmount'] = 0
      }
    })

    await Customer.find({ 'wishlist': { $elemMatch: { product_id: model[i]._id } } }, function(error, likes) {
      model[i]['likes'] = likes.length

      console.log('likes', likes)
    })


  }


    return res.status(200).json({ message: 'Found models', response: 200, data: _.reverse(model) })
  });
}


export async function getProfitByMonth(req, res) {

  console.log('get profit by month')

var startMonth = moment().startOf('month')
var endMonth = moment(startMonth).endOf('month')
let total = 0

let orders = await Order.find({ 
    date: { 
      $gte: startMonth.toDate(),
      $lt: endMonth.toDate()
    } 
  }).exec(async (err, models) => {
    if (err) {
      res.status(500).send(err);
    }
    else {
      _.map(models,(item, key, arr)=>{
        total = total + item.amount.total
      })
    }
  })

return res.status(200).json({ message: 'Found models', response: 200, data: total })


}

export async function getOrdersPerMonth(req, res) {

  console.log('get orders per month')

var startMonth = moment().startOf('month')
var endMonth = moment(startMonth).endOf('month')
let total = 0

let orders = await Order.find({ 
    date: { 
      $gte: startMonth.toDate(),
      $lt: endMonth.toDate()
    } 
  }).exec(async (err, models) => {
    if (err) {
      res.status(500).send(err);
    }
    else {
      _.map(models,(item, key, arr)=>{
        total = total + 1
      })
    }
  })

return res.status(200).json({ message: 'Found models', response: 200, data: total })


}


export async function getCustomersGeo(req, res) {
/*
let customers = await Order.find({ 
    shipping: { 
      $gte: startMonth.toDate(),
      $lt: endMonth.toDate()
    } 
  }).exec(async (err, models) => {
    if (err) {
      res.status(500).send(err);
    }
    else {
      _.map(models,(item, key, arr)=>{
        total = total + item.amount.total
      })
    }
  })

return res.status(200).json({ message: 'Found models', response: 200, data: total })
*/

}


/**
 * Save a model
 * @param req
 * @param res
 * @returns void
 */
export function create(req, res, next) {
  let reqBody = _.mapValues(req.body, v=>v.value)
  Product.create({ ...reqBody }, function (error, model) {
    if (error) {
      console.log('got error here', error.code)
      console.log('validation error', error['ValidatonError'])
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
      return res.json({ status: 'success', response: 200 });
    }
  })
}

export function getOne(req, res, next){
  Product.findById(req.params.id, function (error, model) {
    if (error || !model) {
      return res.status(400).json({ status: 'error', response: 401, message: 'Error with finding single model. '+error});
    } else {
      return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: model });
    }
  })
}

export function findByIds(req, res, next){
  let ids = req.query.ids
  Product.find({"_id": { $in: ids }}, function (error, model) {
    if (error || !model) {
      return res.status(400).json({ status: 'error', response: 400, message: 'Error with finding single model. '+error});
    } else {
      return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: model });
    }
  })
}

export function update(req, res, next) {
  let reqBody = _.mapValues(req.body, v=>v.value)
        var form = new formidable.IncomingForm(),
            files = [],
            fields = []

        form.uploadDir = '/usr/src/app/src/img/admin/uploads/';
        form.multiples = true;
        form.on('file', function(field, file) {
          files = [ ...files, { field, file } ]
          console.log('we got in file', file, field)
            //rename the incoming file to the file's name
            fs.rename(file.path, form.uploadDir + "/" + file.name);

        });

        form.on('field', function(field, value){
          console.log('fields inside', field, value)
           fields.push({name: field, value:value })
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
          console.log(_.map(files, (file)=>{
            return '/img/admin/uploads/'+file.file.name
          }))

          let images = _.map(files, (file)=>{
            return '/img/admin/uploads/'+file.file.name
          })

          //foreach images[]
          let query = {}

          if(!_.isEmpty(files)){
            console.log('we have files')

            //foreach images[] if item.value then add to images array
           let fieldsObj = {}

           _.map(fields, (v)=>{
           if(typeof v !== 'undefined'){
              console.log(v)
            console.log('we in fields')
            fieldsObj = {...fieldsObj, ...{ [v.name]: v.value } }
          // fieldsObj.push([v.name]: v.value )
           }
           console.log('fieldsObj', fieldsObj)
          })

           fields.map((item, key)=>{
              console.log('item key', item, key)
              if(item.name == 'images[]'){
                images.push(item.value)
                delete fields[key]
              }
            })

          // fields =  _.mapValues(fields, v=>v.value)

            query = { ...fieldsObj, ...{ images: images } }
            //upsert = { upsert: true }

          }
          else {
            console.log('we dont files')
            //do we have images from form?
            //if we do have images from form then we want to use that
            let images = []  
            let fieldsObj = {}

           _.map(fields, (v)=>{
           if(typeof v !== 'undefined'){
              console.log(v)
            console.log('we in fields')
            fieldsObj = {...fieldsObj, ...{ [v.name]: v.value } }
          // fieldsObj.push([v.name]: v.value )
           }
           console.log('fieldsObj', fieldsObj)
          })

          //console.log(fields)
           fields.map((item, key)=>{
              console.log('item key', item, key)
              if(item.name == 'images[]'){
                images.push(item.value)
                delete fields[key]
              }
            })




            //other wise delete so no error
           // delete fields.images
            query = { ...fieldsObj, ...{ images: images } }
           // upsert = { upsert: false }
          }
          console.log('query', query)

          await Product.update({"_id": req.params.id}, query, function (error, model) {
              if (error || !model) {
                let inputs = _.mapValues(fields, v=>({ value: v }))
                _.mapValues(error.errors, (ev, ek)=>inputs[ek] ? inputs[ek].error = 'This is '+ev.kind : null)
                return res.status(400).json({ message: error.message, response: 400, data: inputs })
              } else {
                return res.status(200).json({ status: 'success', response: 200, message: 'Success with edit.'});
              }
          })
       })
  
}

export function remove(req, res, next){
  Product.remove({"_id": req.params.id}, function (error, model) {
    if (error || !model) {
      return res.status(400).json({ status: 'error', response: 401, message: 'Error with model delete. '+error});
    } else {
      return res.status(200).json({ status: 'success', response: 200, message: 'Success with delete.'});
    }
  })
}