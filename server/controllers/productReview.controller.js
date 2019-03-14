import ProductReview from '../models/ProductReview';
import User from '../models/User';
import * as _ from 'lodash'

import formidable from 'formidable'


/**
 * Get all model
 * @param req
 * @param res
 * @returns void
 */
export function getAll(req, res) {
  ProductReview.find().sort('-dateAdded').exec((err, model) => {
    if (err) {
      res.status(500).send(err);
    }
    return res.status(200).json({ message: 'Found models', response: 200, data: model })
  });
}

export function getByProduct(req, res) {
  ProductReview.find({ product_id: req.params.id }).lean().sort({date: 'descending'}).exec(async function(error, model) {
    if (error || !model) {
      return res.status(400).json({ status: 'error', response: 401, message: 'Error with finding single model. '+error});
    } else {


      //foreach model grab username, first name, lastname, 
/*
      _.map(model, (item, key, arr)=>{

        User.find({ '_id': model.user_id }), function (error, user) {
          model[key].user = {
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
          }
        })

      })
*/

  //model = model
  //let test = _.map(model, (item, key, arr)=>{
    //model = model

  for(let i=0; i < model.length; i++){
     await User.findOne({'_id': model[i].user_id}, function(err, user) {
      if(user) {
        //items[i].username = model.username
       // items[i].first_name = model.first_name
        //items[i].last_name = model.last_name
        model[i]['user'] = {
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
        }

      } 
    })
  }

  //})
    //  console.log('models PRODUCT!!@#!@#@#', model)
      return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: model });
    }
  })
}


export function getByPagination(req, res) {

  ProductReview.paginate({}, { page: Number(req.params.page), limit: Number(req.params.limit) }, function(err, result) {
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

  ProductReview.paginate({ $text: { $search: req.params.term }}, { page: Number(req.params.page), limit: Number(req.params.limit) }, function(err, result) {
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

      form.parse(req, async function(err) {
          console.log('fields', fields)
          console.log('files', files)
        fields.slug = _.camelCase(fields.title)
          console.log('fields', fields)

        ProductReview.create(fields, function (error, model) {
            if (error) {
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
              return res.json({ status: 'success', response: 200 });
           }
          })
      })
}

export function getOne(req, res, next){
  ProductReview.findById(req.params.id, function (error, model) {
    if (error || !model) {
      return res.status(400).json({ status: 'error', response: 401, message: 'Error with finding single model. '+error});
    } else {
      return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: model });
    }
  })
}

export function findByIds(req, res, next){
  let ids = req.query.ids
  ProductReview.find({"_id": { $in: ids }}, function (error, model) {
    if (error || !model) {
      return res.status(400).json({ status: 'error', response: 400, message: 'Error with finding single model. '+error});
    } else {
      return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: model });
    }
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
        ProductReview.findOneAndUpdate({"_id": req.params.id}, fields, {new:true}, function (error, model) {
           if (error || !model) {
              let inputs = _.mapValues(fields, v=>({ value: v }))

              console.log('errors', error.errors)
              _.mapValues(error.errors, (v, k)=> 
                inputs = {...inputs, [v.path]: { value: v.value ? v.value : '' , error: v.message }}
              )
              return res.status(400).json({ message: error.message, response: 400, data: inputs })
            } else {
              return res.status(200).json({ status: 'success', response: 200, message: 'Success with edit.', data: model});
            }
          })
    })
}

export function remove(req, res, next){
  ProductReview.remove({"_id": req.params.id}, function (error, model) {
    if (error || !model) {
      return res.status(400).json({ status: 'error', response: 401, message: 'Error with model delete. '+error});
    } else {
      return res.status(200).json({ status: 'success', response: 200, message: 'Success with delete.'});
    }
  })
}