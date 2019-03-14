import Discount from '../models/Discount';
import * as _ from 'lodash'
import formidable from 'formidable'

/**
 * Get all model
 * @param req
 * @param res
 * @returns void
 */
export function getAll(req, res) {
  Discount.find().sort('-dateAdded').exec((err, model) => {
    if (err) {
      res.status(500).send(err);
    }
    return res.status(200).json({ message: 'Found models', response: 200, data: model })
  });
}


export function getByPagination(req, res) {

  Discount.paginate({}, { page: Number(req.params.page), limit: Number(req.params.limit) }, function(err, result) {
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

  Discount.paginate({ $text: { $search: req.params.term }}, { page: Number(req.params.page), limit: Number(req.params.limit) }, function(err, result) {
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
  console.log(req.body)
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
          Discount.create(fields, function (error, model) {
              if (error) {
              if(error.code == 11000){
                return res.status(409).json({ status: 'error', message: 'Duplicate model.', response: 409, data: {} })
              }
              let inputs = _.mapValues(query, v=>({ value: v }))

              console.log('errors', error.errors)
              _.mapValues(error.errors, (v, k)=> 
                inputs = {...inputs, [v.path]: { value: v.value ? v.value : '' , error: v.message }}
              )
              return res.status(400).json({ status: 'error', message: 'Registration failed. Some fields are missing.', response: 400, data: { ...inputs, password_confirm: { value: '', error: 'This is required' } } })
            } else {
                return res.json({ status: 'success', response: 200 });
             }
            })
      })
}


export function getOne(req, res, next){
  Discount.findById(req.params.id, function (error, model) {
    if (error || !model) {
      return res.status(400).json({ status: 'error', response: 401, message: 'Error with finding single model. '+error});
    } else {
      return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: model });
    }
  })
}

export function getByCode(req, res, next){
   var form = new formidable.IncomingForm(),
      files = [],
      fields = {}

  
  form.on('field', function(field, value){
    console.log('fields inside', field, value)
    if(field == 'discount_codes'){
     fields = {...fields, [field]: !_.isEmpty(JSON.parse(value)) ? JSON.parse(value) : [] }
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
    let discount_code = req.params.code
    console.log('discount_code', discount_code)
    Discount.findOne({ discount_code: discount_code }, function (error, model) {
      if (error || !model) {
        return res.status(400).json({ status: 'error', response: 400, message: 'Error with finding single model. '+error});
      } else {
        return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: model });
      }
    })
  })
}

export function getByCodes(req, res, next){
  var form = new formidable.IncomingForm(),
      files = [],
      fields = {}

  
  form.on('field', function(field, value){
    console.log('fields inside', field, value)
    if(field == 'discount_codes'){
     fields = {...fields, [field]: !_.isEmpty(JSON.parse(value)) ? JSON.parse(value) : [] }
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
    console.log('discount fields', fields)
    Discount.find({ 'discount_code': { $in: fields.discount_codes } }, function (error, model) {
      if (error || !model) {
        return res.status(400).json({ status: 'error', response: 400, message: 'Error with finding single model. '+error});
      } else {
        return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: model });
      }
    })
  })
}

export function campaignIncreaseViews(req, res, next) {


    Discount.update({"discount_code": req.params.code}, { $inc: {views: 1} }, function (error, model) {
     if (error || !model) {
        return res.status(400).json({ status: 'error', response: 400, message: 'Error with finding single model. '+error});
        
      } else {
         Discount.findOne({"discount_code": req.params.code}, function (error, model) {
            if (error || !model) {
              return res.status(400).json({ status: 'error', response: 400, message: 'Error with finding single model. '+error});
            } else {
              return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: model });
            }
          })
      }
    })

}

export function update(req, res, next) {

    console.log(req.body)
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
          Discount.findOneAndUpdate({"_id": req.params.id}, fields, {new:true}, function (error, model) {
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
  Discount.remove({"_id": req.params.id}, function (error, model) {
    if (error || !model) {
      return res.status(400).json({ status: 'error', response: 401, message: 'Error with model delete. '+error});
    } else {
      return res.status(200).json({ status: 'success', response: 200, message: 'Success with delete.'});
    }
  })
}