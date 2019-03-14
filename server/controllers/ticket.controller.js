import Order from '../models/Order'
import User from '../models/User'
import Guest from '../models/Guest'
import Ticket from '../models/Ticket'
import Board from '../models/Board'
import Product from '../models/Product'
import * as _ from 'lodash'
import bcrypt from 'bcrypt'

import * as jwt from 'jsonwebtoken'

import nodemailer from 'nodemailer'
import mg from 'nodemailer-mailgun-transport'
import Email from 'email-templates'
import moment from 'moment'
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
  Ticket.find().sort('-dateAdded').exec((err, model) => {
    if (err) {
      res.status(500).send(err);
    }
    return res.status(200).json({ message: 'Found models', response: 200, data: model })
  });
}


export function getByPagination(req, res) {
  Ticket.paginate({}, { page: Number(req.params.page), limit: Number(req.params.limit) }, function(err, result) {
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

  Ticket.paginate({ $text: { $search: req.params.term }}, { page: Number(req.params.page), limit: Number(req.params.limit) }, function(err, result) {
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

export function getOne(req, res, next){

    Ticket.findOne({ '_id': req.params.id }, async function (error, model) {
      if (error || !model) {
        return res.status(400).json({ status: 'error', response: 401, message: 'Error with finding single model. '+error});
      } 
      else {
        model = model.toObject()

        if(!_.isEmpty(model.user_id)){
          let user = await User.findOne({ _id: model.user_id }).lean().exec((error, user)=>{
            if (error || !user) {
              return res.status(400).json({ status: 'error', response: 401, message: 'Error with finding model. '+error});
            } else {
              return user
            }
          })

          if(!_.isEmpty(user)){
            model['user'] = user
          }
        }
        
        await Promise.all(_.map(model.log, async (item, key, arr) => {
          if(_.has(item,'user_id') && !_.isEmpty(item,'user_id') && item.user_id !== ''){

            let userData = await User.findOne({ _id: item.user_id }).lean().exec((error, user)=>{
              if (error || !user) {
                return res.status(400).json({ status: 'error', response: 401, message: 'Error with finding model. '+error});
              } else {
                return user
              }
            })
            model['log'][key]['user'] = userData

          //  console.log('mode', model, userData)
          }
        }))
        model.log = _.sortBy(model.log, function(o) { return new moment(o.date) })
        

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

        if(isPending || !_.isEmpty(model.status)){
          model.status = 'pending'
        }
        else if(isProcessing){
          model.status = 'processing'
        }
        else if(isReviewing){
          model.status = 'reviewing'
        }
        else if(isResolved){
          model.status = 'resolved'
        }

        return res.status(200).json({ status: 'success', response: 200, message: 'Success with finding model.', data: model });

      }
    })

}


export function getByUser(req, res) {
  Ticket.find({ user_id: req.params.id }).lean().sort('-dateAdded').exec(async (error, models) => {
    if (error) {
      return res.status(400).json({ status: 'error', response: 401, message: 'Error with finding models. '+error});
    }
    else {

      models = await Promise.all(_.map(models, async (item, key, arr)=>{
        let model = item


        //model = model.toObject()

        if(!_.isEmpty(model.user_id)){
          let user = await User.findOne({ _id: model.user_id }).lean().exec((error, user)=>{
            if (error || !user) {
              return res.status(400).json({ status: 'error', response: 401, message: 'Error with finding model. '+error});
            } else {
              return user
            }
          })

          if(!_.isEmpty(user)){
            model['user'] = user
          }
        }
        
        await Promise.all(_.map(model.log, async (item, key, arr) => {
          if(_.has(item,'user_id') && !_.isEmpty(item,'user_id') && item.user_id !== ''){

            let userData = await User.findOne({ _id: item.user_id }).lean().exec((error, user)=>{
              if (error || !user) {
                return res.status(400).json({ status: 'error', response: 401, message: 'Error with finding model. '+error});
              } else {
                return user
              }
            })
            model['log'][key]['user'] = userData

          //  console.log('mode', model, userData)
          }
        }))
        model.log = _.sortBy(model.log, function(o) { return new moment(o.date) })
        

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

        if(isPending || !_.isEmpty(model.status)){
          model.status = 'pending'
        }
        else if(isProcessing){
          model.status = 'processing'
        }
        else if(isReviewing){
          model.status = 'reviewing'
        }
        else if(isResolved){
          model.status = 'resolved'
        }


        return model

      }))


      return res.status(200).json({ message: 'Found models', response: 200, data: models })

    }

  })
}



export function updateAll(req, res, next){
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

          Ticket.updateMany({"_id": req.params.id}, fields, { new: true }, function (error, model) {
            if (error || !model) {
              return res.status(400).json({ status: 'error', response: 401, message: 'Error with model edit. '+error});
            } else {
              return res.status(200).json({ status: 'success', response: 200, message: 'Success with edit.', data: model });
            }
          })
        })
}


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

        /*
          Guest or Customer

          User

          is user logged in?

          if it we are then 

          if not loggedin then create ticket with user guest

          jwtoken auth? role permissions?

        */


      let userFields = _.has(fields,'user_id') ? { _id: new ObjectID(fields.user_id) } : { email: fields.email }

      let user = await User.findOne(userFields).lean().exec((error, user) => {
        if (error || !user) {
          return res.status(400).json({ status: 'error', response: 401, message: 'Error with finding single model. '+error});
        }  
        else {
          return user
        } 
      })

      console.log('userFields', userFields)
      console.log('user', user)
      if(!_.has(user,'_id')){
        let userFields = {
          username: fields.email,
          first_name: fields.first_name,
          last_name: fields.last_name,
          password: 'guest',
          email: fields.email,
          roles: ['guest'],
          verifyEmail: 'verified',
        }

        user = await User.create({ ...userFields }, function (error, user){
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

        let guest = await Guest.create({ ...guestFields }, function (error, guest){
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


      }
      
      let inputs = {
        user_id: user._id,
        type: fields.type,
        status: '',
        assigned_user_id: _.has(fields, 'assigned_user_id') ? fields.assigned_user_id : '',
        priority: '',
        log: _.has(fields, 'log') ? _.sortBy(JSON.parse(fields.log), function(o) { return new moment(o.date) }) : [
          {
            user_id: user._id,
            message: fields.message,
            kind: 'message',
            status: '',
            date: Date.now()
          }
        ]
      }

      let ticket = await Ticket.create({ ...inputs }, (error, ticket)=>{
        if(error || !ticket){
          if (error) {
            if(error.code == 11000){
              return res.status(409).json({ status: 'error', message: 'Duplicate model.', response: 409, data: {} })
            }
           
            inputs = _.mapValues(fields, v=>({ value: v }))
            console.log('errors', error.errors)
            _.mapValues(error.errors, (v, k)=> 
              inputs = {...inputs, [v.path]: { value: v.value ? v.value : '' , error: v.message }}
            )

            return res.status(400).json({ status: 'error', message: 'Creating ticket failed. Some fields are missing.', response: 400, data: { ...inputs } })
          } 
        }
        else {
          return ticket
        }
      })

      if(fields.type === 'order'){
        let updateOrderTicketId = await Order.findOneAndUpdate({ _id: fields.order_id }, { ticket_id: ticket._id }, { new: true }).lean().exec((error, model)=>{
          if (error || !model) {
            return res.status(400).json({ status: 'error', response: 401, message: 'Error with finding single model. '+error});
          }  
          else {
            return model
          } 
        })
      }

      return res.json({ status: 'success', response: 200, data: ticket })

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

          /*

            fields.status
            fields.type
            fields.assigned_user_id

            fields.type is different than before then pull from the list ad=nd add to new list
            then add system message

            fields.assigned_user_id is different than before then add system message 

       

            let board = await Board.findOne({}).lean().exec((error, board)=>{
              if(error || !board){
                return res.status(400).json({ status: 'error', response: 401, message: 'Error with model edit. '+error});
              }
              else {
                return board
              }
            })


            fields = { 
              type: 'board',
              board: board,
            }

          */

          let ticket = await Ticket.findOne({ _id: req.params.id }).lean().exec((error, ticket)=>{
            if(error || !ticket){
              return res.status(400).json({ status: 'error', response: 401, message: 'Error with model edit. '+error});
            }
            else {
              return ticket
            }
          })



            //add to log

            //assigned_user_id !== ticket.assigned_user_id
            
            //add to log

            if(_.has(fields,'log')){
              fields.log = JSON.parse(fields.log)
              fields.log = _.sortBy(fields.log, function(o) { return new moment(o.date) })
            }


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


        //cuurent ticket status

        let isPendingEqual = (_.includes(board.pending, req.params.id) && fields.status === 'pending') ? true : false
        let isProcessingEqual = (_.includes(board.processing, req.params.id) && fields.status === 'processing') ? true : false
        let isReviewingEqual = (_.includes(board.reviewing, req.params.id) && fields.status === 'reviewing') ? true : false
        let isResolvedEqual = (_.includes(board.resolved, req.params.id) && fields.status === 'resolved') ? true : false

        let logFields = []

        if(!_.isEmpty(fields.status) && (!isPendingEqual && !isProcessingEqual && !isReviewingEqual && !isResolvedEqual) ){
              logFields = [
                ...logFields,
                { 
                  kind: 'system',
                  message: 'This ticket is '+fields.status+'.',
                  status: '',
                  date: Date.now(),
                }
              ]

              //fields.log = _.sortBy(fields.log, function(o) { return new moment(o.date) })


          /* What is the current status */
          if(_.includes(board.pending, req.params.id)){
            //remove id 
            _.pull(board.pending, req.params.id)
          }
          else if(_.includes(board.processing, req.params.id)){
            _.pull(board.processing, req.params.id)
          }
          else if(_.includes(board.reviewing, req.params.id)){
            _.pull(board.reviewing, req.params.id)
          }
          else if(_.includes(board.resolved, req.params.id)){
            _.pull(board.resolved, req.params.id)
          }

          console.log('fields', fields, req.params.id)
         // console.log('BOARD', board)
          //console.log('board[fields.status]', fields.status, board[fields.status])

          board[fields.status] = [...board[fields.status], req.params.id] 
          //console.log('new board', board)

        }


        //type change
        if(fields.type !== ticket.type){
            logFields = [
              ...logFields,
              { 
                kind: 'system',
                message: 'This ticket has been changed from '+ticket.type+' to '+fields.type+'.',
                status: '',
                date: Date.now(),
              }
            ]
        }


        //type change
        if(fields.assigned_user_id !== ticket.assigned_user_id){
            logFields = [
              ...logFields,
              { 
                kind: 'system',
                message: `This ticket has been reassigned ${(_.has(ticket,'assigned_user_id') && !_.isEmpty(ticket.assigned_user_id) && ticket.assigned_user_id !== '') ? 'from '+ticket.assigned_user_id : ''} to ${fields.assigned_user_id}.`,
                status: '',
                date: Date.now(),
              }
            ]

            //fields.assigned_user_id = new ObjectID(fields.assigned_user_id)
        }

        console.log(fields.assigned_user_id)
        let boardFields = { 
          type: 'board',
          board: board,
        }

        Board.findOneAndUpdate({}, { $set: boardFields }, { upsert: true, new: true }, function (error, model) {
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
          
            return model
          }
        })


        console.log('fields.log', fields.log)
        let newLogFields = _.filter(fields.log, (item, key, arr)=>{
          if(!_.has(item,'_id')){
            return true
          }
        })
        console.log('newLogFields', newLogFields)

        //remove log for update and use push for logs
        fields = _.omitBy(fields, (item, key, arr)=>{
          if(key === 'log'){
            return true
          }
        })

        console.log('fields', fields)
        fields = { $set: fields, $push: { log: { $each: [...logFields, ...newLogFields] } } }

        Ticket.findOneAndUpdate({"_id": req.params.id}, fields, { new: true }, async function (error, model) {
          if (error || !model) {
            return res.status(400).json({ status: 'error', response: 401, message: 'Error with model edit. '+error});
          } else {
            model = model.toObject()

            if(!_.isEmpty(model.user_id)){
              let user = await User.findOne({ _id: model.user_id }).lean().exec((error, user)=>{
                if (error || !user) {
                  return res.status(400).json({ status: 'error', response: 401, message: 'Error with finding model. '+error});
                } else {
                  return user
                }
              })

              if(!_.isEmpty(user)){
                model['user'] = user
              }
            }

            await Promise.all(_.map(model.log, async (item, key, arr) => {
              if(_.has(item,'user_id') && !_.isEmpty(item,'user_id') && item.user_id !== ''){
              let userData = await User.findOne({ _id: item.user_id }).lean().exec((error, user)=>{
                if (error || !user) {
                  return res.status(400).json({ status: 'error', response: 401, message: 'Error with finding model. '+error});
                } else {
                  return user
                }
              })
              model['log'][key]['user'] = userData

              //console.log('mode', model, userData)
              }
            }))

            model.log = _.sortBy(model.log, function(o) { return new moment(o.date) })

            let isPending = _.includes(board.pending, req.params.id) ? true : false
            let isProcessing = _.includes(board.processing, req.params.id) ? true : false
            let isReviewing = _.includes(board.reviewing, req.params.id) ? true : false
            let isResolved = _.includes(board.resolved, req.params.id) ? true : false

            if(isPending || !_.isEmpty(model.status)){
              model.status = 'pending'
            }
            else if(isProcessing){
              model.status = 'processing'
            }
            else if(isReviewing){
              model.status = 'reviewing'
            }
            else if(isResolved){
              model.status = 'resolved'
            }
            
            //console.log('model', model)

            return res.status(200).json({ status: 'success', response: 200, message: 'Success with edit.', data: model });
          }
        })
      })
}


export function updateMessages(req, res, next){

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


      await Ticket.findOneAndUpdate({"_id": req.params.id}, { $push: { log: { user_id: fields.user_id, kind: 'message', message: fields.message, status: '' }  } }, { new: true }).lean().exec(async (error, model) => {
        if (error || !model) {
          console.log('whats the error my friend', error);

          return res.status(400).json({ status: 'error', response: 401, message: 'Error with model edit. '+error});
        } else {


        if(!_.isEmpty(model.user_id)){
          let user = await User.findOne({ _id: model.user_id }).lean().exec((error, user)=>{
            if (error || !user) {
              return res.status(400).json({ status: 'error', response: 401, message: 'Error with finding model. '+error});
            } else {
              return user
            }
          })

          if(!_.isEmpty(user)){
            model['user'] = user
          }
        }
        
        await Promise.all(_.map(model.log, async (item, key, arr) => {
          if(_.has(item,'user_id') && !_.isEmpty(item,'user_id') && item.user_id !== ''){
            let userData = await User.findOne({ _id: item.user_id }).lean().exec((error, user)=>{
              if (error || !user) {
                return res.status(400).json({ status: 'error', response: 401, message: 'Error with finding model. '+error});
              } else {
                return user
              }
            })
            model['log'][key]['user'] = userData

            console.log('mode', model, userData)
          }
        }))

        model.log = _.sortBy(model.log, function(o) { return new moment(o.date) })

        console.log('model', model)

         return res.status(200).json({ status: 'success', response: 200, message: 'Success with edit.', data: model });
        }
      })

    })
}

export function remove(req, res, next){
  Ticket.remove({"_id": req.params.id}, function (error, model) {
      if (error || !model) {
        return res.status(400).json({ status: 'error', response: 401, message: 'Error with model delete. '+error});
      } else {
       
        return res.status(200).json({ status: 'success', response: 200, message: 'Success with delete.'});
      }
    })
}
