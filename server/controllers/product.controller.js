import Product from '../models/Product';
import User from '../models/User';
import * as _ from 'lodash'
import formidable from 'formidable'
import moment from 'moment'

const fs = require('fs'), gm = require('gm').subClass({imageMagick: true});

/**
 * Get all model
 * @param req
 * @param res
 * @returns void
 */
export function getAll(req, res) {
  Product.find().sort('-dateAdded').lean().exec(async (err, models) => {
    if (err) {
      res.status(500).send(err);
    }

    console.log('models', models)

    await Promise.all(models.map(async(model, key)=>{
      console.log('item', model.reviews)
      let ratings = 0;

      if(!_.isEmpty(model.reviews)){
        let result = await Promise.all(model.reviews.map(async (item, index)=>{
          console.log('item', item)
          console.log('model', model)

          ratings += item.rating

          console.log('ratings1', item.rating)

          let user = await User.findOne({ _id: item.user_id }, function (error, user){
            if (error || !user) { return error }
            else {
              return user
            }
          })

          models[key].reviews[index].user = user
        }))
      }

      ratings = ratings / model.reviews.length

      console.log('ratings', ratings)
      models[key].ratings = ratings

      console.log('model', models)


    }))

    return res.status(200).json({ message: 'Found models', response: 200, data: models })
  });
}


export function getLatest(req, res) {
  Product.find({ status: 'published' }).sort('-dateAdded').lean().exec(async (err, models) => {
    if (err) {
      res.status(500).send(err);
    }

    console.log('models', models)

    await Promise.all(models.map(async(model, key)=>{
      console.log('item', model.reviews)
      let ratings = 0;

      if(!_.isEmpty(model.reviews)){
        let result = await Promise.all(model.reviews.map(async (item, index)=>{
          console.log('item', item)
          console.log('model', model)

          ratings += item.rating

          console.log('ratings1', item.rating)

          let user = await User.findOne({ _id: item.user_id }, function (error, user){
            if (error || !user) { return error }
            else {
              return user
            }
          })

          models[key].reviews[index].user = user
        }))
      }

      ratings = ratings / model.reviews.length

      console.log('ratings', ratings)
      models[key].ratings = ratings

      console.log('model', models)


    }))

    /*let ratings = 0;

    if(!_.isEmpty(model.reviews)){
      let result = await Promise.all(model.reviews.map(async (item, index)=>{
        console.log('item', item)
        console.log('model', model)

        ratings += item.rating

        console.log('ratings1', item.rating)

        let user = await User.findOne({ _id: item.user_id }, function (error, user){
          if (error || !user) { return error }
          else {
            return user
          }
        })

        model.reviews[index].user = user
      }))
    }

    //ratings = ratings / model.reviews.length

    console.log('ratings', ratings)
    console.log('ratings length', model.reviews)
    model.ratings = ratings*/

    return res.status(200).json({ message: 'Found models', response: 200, data: models })
  })
}


export function getByPagination(req, res) {

  Product.paginate({}, { page: Number(req.params.page), limit: Number(req.params.limit) }, function(err, result) {
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
 * Get all published model
 * @param req
 * @param res
 * @returns void
 */
export function getByCategory(req, res) {
  //let reqBody = _.mapValues(req.body, v=>v.value)
  console.log('got hereS')
  console.log('slug', req.params.slug)

  ProductCategory.findOne({ slug: req.params.slug }, function(error, model){
    if (error | !model) {
      return res.status(400).json({ status: 'error', response: 400, message: 'Error with finding models. '+error, data: {} })
    }
    else {
    Product.find({ product_category_ids: model._id }).sort('-dateAdded').exec((error, model) => {
      if (error | !model) {
      return res.status(400).json({ status: 'error', response: 400, message: 'Error with finding models. '+error})
      }
      else {
        return res.status(200).json({ message: 'Found models', response: 200, data: model })
      }
    })
    }
  })
}

export function getRelated(req, res) {
  //let reqBody = _.mapValues(req.body, v=>v.value)
  console.log('got hereS')

  Product.find({}).sort('-dateAdded').exec((err, model) => {
    if (err) {
      res.status(500).send(err);
    }
    console.log('_id', req.params.id)
    return res.status(200).json({ message: 'Found models', response: 200, data: model })
  })

}




export function search(req, res, next) {

  Product.paginate({ $text: { $search: req.params.term }}, { page: Number(req.params.page), limit: Number(req.params.limit) }, function(err, result) {
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

export function searchFilter(req, res, next) {
  var form = new formidable.IncomingForm(),
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

  form.parse(req, function(err) {
    console.log('fields', fields)

    let options = {}

    if(!_.isEmpty(fields.sortBy)){

      let sortBy = {}

      if(fields.sortBy === 'newest'){
        sortBy = { date: -1 }
      }
      else if(fields.sortBy === 'oldest'){
        sortBy = { date: 1 }
      }
      else if(fields.sortBy === 'highestRatings'){
        //sortBy = { date: -1 }
      }
      else if(fields.sortBy === 'mostReviews'){
        //sortBy = { : -1 }
      }
      else if(fields.sortBy === 'price_low_to_high'){
        sortBy = { price: 1 }
      }
      else if(fields.sortBy === 'price_high_to_low'){
        sortBy = { price: -1 }
      }

      if(!_.isEmpty(sortBy)){

        options = { ...options, sortBy: sortBy }

      }

      else {
      }

    }

    //categories
    if(!_.isEmpty(fields.categories)){
      console.log('fields.categories JSON.parse', JSON.parse(fields.categories))

     // query
    }
    //price limits

    // get ratings

    //most reviews

    // find users above 18 by city
    let aggregate = Product.aggregate().match({
      $and: [
        {
          $text: {
            $search: req.params.term
          }
        },
        {
          product_category_ids: { $in: typeof fields.categories !== 'undefined' ? JSON.parse(fields.categories) : [] }
        }
      ] } /*age : {'lt' : 18 }*/ )

    options = { page : Number(req.params.page), limit : Number(req.params.limit), ...options }

    Product.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
    // result.docs
    // result.total
    // result.limit - 10
    // result.page - 3
    // result.pages

      if (err) {
        res.status(500).send(err);
      }
      return res.status(200).json({ message: 'Found models', response: 200, data: { docs: results, total: count, pages: pageCount, page: Number(req.params.page), limit: Number(req.params.limit) } })
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
 * Save a model
 * @param req
 * @param res
 * @returns void
 */
export function create(req, res, next) {
 var form = new formidable.IncomingForm(),
            files = [],
            fields = {},
            images = []

        form.uploadDir = '/usr/src/app/img/admin/uploads/';
        form.multiples = true;
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
          else if(field == 'importData'){
           fields = {...fields, [field]: _.isEmpty(value) ? {} : JSON.parse(value) }
          }
          else if(field == 'product_category_ids'){
           fields = {...fields, [field]: _.isEmpty(value) ? [] : JSON.parse(value) }
          }
          else if(field == 'markup' || field == 'cost' || field == 'price' || field == 'stock'){
           fields = {...fields, [field]: Number(value) }
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

        form.parse(req, function(err) {
          console.log('fields', fields)
          console.log('files', files)

          images = [...images, ..._.map(files, (file)=> '/img/admin/uploads/'+file.file.name)]

          let query = {}

          //delete fields['images[]']

          query = { ...fields, images: images }
          console.log('query', query, fields, files, {...query, user_id: 1 })

         Product.create({...query, user_id: 1 }, function (error, model) {
            if (error) {
              console.log('got error here', error.code)
              console.log('validation error', error['ValidatonError'])
              let inputs = _.mapValues(query, v=>({ value: v }))

              console.log('errors', error.errors)
              _.mapValues(error.errors, (v, k)=>
                inputs = {...inputs, [v.path]: { value: v.value ? v.value : '' , error: v.message }}
              )
              if(error.code == 11000){
                return res.status(409).json({ status: 'error', message: 'Duplicate model.', response: 409, data: {} })
              }
              return res.status(400).json({ status: 'error', message: error.message, response: 400, data: inputs })
            } else {
              return res.json({ status: 'success', response: 200, message: 'Success with edit.', data: model });
            }
          })
       })
}

export function getOne(req, res, next){
  Product.findOne({ _id: req.params.id }).lean().exec(async (error, model) =>{
    if (error || !model) {
      return res.status(400).json({ status: 'error', response: 400, message: 'Error with finding single model. '+error});
    } else {

      let ratings = 0;

      if(!_.isEmpty(model.reviews)){
        let result = await Promise.all(model.reviews.map(async (item, index)=>{
          console.log('item', item)
          console.log('model', model)

          ratings += item.rating

          console.log('ratings1', item.rating)

          let user = await User.findOne({ _id: item.user_id }, function (error, user){
            if (error || !user) { return error }
            else {
              return user
            }
          })

          model.reviews[index].user = user
        }))
      }

      ratings = ratings / model.reviews.length

      console.log('ratings', ratings)
      model.ratings = ratings

      return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: model });
    }
  })
}

export function getBySlug(req, res, next){
  Product.findOne({ slug: req.params.slug }).lean().exec(async (error, model) => {
    if (error || !model) {``
      return res.status(400).json({ status: 'error', response: 400, message: 'Error with finding single model. '+error});
    } else {
      let ratings = 0;
      if(!_.isEmpty(model.reviews)){
        let result = await Promise.all(model.reviews.map(async (item, index)=>{
          ratings += item.rating
          let user = await User.findOne({ _id: item.user_id }, function (error, user){
            if (error || !user) { return error }
            else {
              return user
            }
          })
          model.reviews[index].user = user
        }))
      }
      ratings = ratings / model.reviews.length
      model.ratings = Math.round(ratings)

      let related = await Product.find({}).lean().exec((error, models)=>{
        models.map((item, index)=>{
            if(item.slug === req.params.slug){
              models.splice(index, 1)
            }
        })
      })
      model.related = related
      console.log('related', related)
      return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: model });
    }
  })
}

export function getByIds(req, res, next){
  let ids = req.params.ids
  ids = ids.split(',')
  Product.find({"_id": { $in: ids }}, function (error, model) {
    if (error || !model) {
      return res.status(400).json({ status: 'error', response: 400, message: 'Error with finding single model. '+error});
    } else {
      return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: model });
    }
  })
}

export function createReview(req, res, next) {
  var form = new formidable.IncomingForm(),
          files = [],
          fields = {},
          images = []

      form.on('field', function(field, value){
        console.log('fields inside', field, value)
        fields = {...fields, [field]: value }
      })

      form.parse(req, async function(err) {
        console.log('fields', fields)
        console.log('files', files)

        await Product.findOneAndUpdate({"_id": req.params.id}, { $push: { reviews: { user_id: fields.user_id, comment: fields.comment, rating: fields.rating } } }, { safe: true, upsert: true, new: true }, function (error, model) {
            if (error || !model) {
              return res.status(400).json({ message: error.message, response: 400 })
            } else {
              return res.status(200).json({ status: 'success', response: 200, message: 'Success with edit.', data: model });
            }
        })
     })
}


export function removeReview(req, res, next) {
  var form = new formidable.IncomingForm(),
          files = [],
          fields = {},
          images = []

      form.on('field', function(field, value){
        console.log('fields inside', field, value)
        fields = {...fields, [field]: value }
      })

      form.parse(req, async function(err) {
        console.log('fields', fields)
        console.log('files', files)

        await Product.findOneAndUpdate({"_id": req.params.id}, { reviews: fields }, {new: true}, function (error, model) {
            if (error || !model) {
              return res.status(400).json({ message: error.message, response: 400, data: inputs })
            } else {
              return res.status(200).json({ status: 'success', response: 200, message: 'Success with edit.', data: model });
            }
        })
     })
}

export function update(req, res, next) {
    var form = new formidable.IncomingForm(),
            files = [],
            fields = {},
            images = []

        form.uploadDir = '/usr/src/app/img/admin/uploads/';
        form.multiples = true;
        form.on('file', function(field, file) {
          files = [ ...files, { field, file } ]
          console.log('we got in file', file, field)
            //rename the incoming file to the file's name
            //fs.rename(, form.uploadDir + "/" + file.name);
            gm(file.path)
            .resize(1000,1500, '!')
            .write(form.uploadDir + "/" + file.name, function (err) {
              if (!err) {
                console.log('done')
              }
              else {
                console.log('error', err)
              }
            });

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
            if(!_.has(value, 'type')){
              images.push(value)
            }
          }
          else if(isJson(value)){
            fields = {...fields, [field]: JSON.parse(value)}
          }
          else if(field == 'product_category_ids'){
           fields = {...fields, [field]: _.isEmpty(value) ? [] : JSON.parse(value) }
          }
          else if(field == 'importData'){
           fields = {...fields, [field]: _.isEmpty(value) ? {} : JSON.parse(value) }
          }
          else if(field == 'markup' || field == 'cost' || field == 'price' || field == 'flash_sale_amount' || field == 'flash_stock'){
           fields = {...fields, [field]: Number(value) }
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


          images = [...images, ..._.map(files, (file)=> '/img/admin/uploads/'+file.file.name)]

          let query = {}

          //delete fields['images[]']

          query = { ...fields, images: images }
          console.log('query', query, fields, files)

          await Product.findOneAndUpdate({"_id": req.params.id}, query, {new: true}, function (error, model) {
              if (error || !model) {
                let inputs = _.mapValues(query, v=>({ value: v }))
                console.log('errors', error.errors)
                _.mapValues(error.errors, (v, k)=>
                  inputs = {...inputs, [v.path]: { value: v.value ? v.value : '' , error: v.message }}
                )
                return res.status(400).json({ message: error.message, response: 400, data: inputs })
              } else {
                return res.status(200).json({ status: 'success', response: 200, message: 'Success with edit.', data: model });
              }
          })
       })

}

export function remove(req, res, next){
  Product.findOneAndRemove({"_id": req.params.id}, function (error, model) {
    if (error || !model) {
      return res.status(400).json({ status: 'error', response: 400, message: 'Error with model delete. '+error});
    } else {
      Product.find().sort('-dateAdded').exec((err, model) => {
        if (err) {
          res.status(500).send(err);
        }
        return res.status(200).json({ status: 'success', response: 200, message: 'Success with delete.', data: model })
      })
    }
  })
}
