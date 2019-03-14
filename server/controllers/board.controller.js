import Board from '../models/Board'
import Ticket from '../models/Ticket'

import * as jwt from 'jsonwebtoken'
import * as _ from 'lodash'
import formidable from 'formidable'

var fs = require('fs');


export function getOne(req, res, next){
  console.log('test')
  Board.findOne({}, async function(error, model){
    

    /*
    
      for each id in categories

      any items that aren't in the ticket
      []

      _.transform()
    */
      let board = (!_.isEmpty(model) && model.toObject()) ? model.toObject().board : {}


        let result = async (id) => await Ticket.findOne({ _id: id }).lean().exec((error, model)=>{
          if (error || !model) {
            return []
          } else {
            return model
          }
        })


      let loadTickets = async (ids) => await Promise.all(_.map(ids, async (id)=>{ 
        console.log('loadTickets id', id)
     

        console.log('result', await result(id))
        return result(id)
      }))



      let tickets = [
        ...board.pending,
        ...board.processing,
        ...board.reviewing,
        ...board.resolved,
      ]

      console.log('tickets before obj', tickets)

       tickets = await Ticket.find({ _id: { $nin: tickets } }).lean().exec((error, tickets)=>{
          return tickets
        })

      console.log('board before', board)
      console.log('tickets before', tickets)

      board.pending = [ ...await loadTickets(board.pending), ...tickets ]
      board.processing = await loadTickets(board.processing)
      board.reviewing = await loadTickets(board.reviewing)
      board.resolved = await loadTickets(board.resolved)


      console.log('board after', board)
      console.log('tickets after', tickets)
       
       //purge null values
       board.pending = _.filter(board.pending, (item, key, arr)=>{
        if(item !== null){
          return true
        }
       })
       board.processing = _.filter(board.processing, (item, key, arr)=>{
        if(item !== null){
          return true
        }
       })
       board.reviewing = _.filter(board.reviewing, (item, key, arr)=>{
        if(item !== null){
          return true
        }
       })
       board.resolved = _.filter(board.resolved, (item, key, arr)=>{
        if(item !== null){
          return true
        }
       })


      console.log('board2', board)

      return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: board })
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

          /*

            for every uboard that is the same remove
            the differences then add status to log

          */

          let oldBoard = await Board.findOne({}).lean().exec((error, board)=>{
            if(error || !board){
              return res.status(400).json({ status: 'error', response: 401, message: 'Error with model edit. '+error});
            }
            else {
              return board
            }
          })

          oldBoard = !_.isEmpty(oldBoard) ? oldBoard.board : {}

          oldBoard = {
            pending: _.map(oldBoard.pending, v=>v),
            processing: _.map(oldBoard.processing, v=>v),
            reviewing: _.map(oldBoard.reviewing, v=>v),
            resolved: _.map(oldBoard.resolved, v=>v),
          }

          
          let newBoard = JSON.parse(fields.board)

          newBoard = {
            pending: _.map(newBoard.pending, v=>v._id),
            processing: _.map(newBoard.processing, v=>v._id),
            reviewing: _.map(newBoard.reviewing, v=>v._id),
            resolved: _.map(newBoard.resolved, v=>v._id),
          }


          let newPendingIdsToUpdate = _.differenceWith(newBoard.pending, oldBoard.pending, _.isEqual)
          let newProcessingIdsToUpdate = _.differenceWith(newBoard.processing, oldBoard.processing, _.isEqual)
          let newReviewingIdsToUpdate = _.differenceWith(newBoard.reviewing, oldBoard.reviewing, _.isEqual)
          let newResolvedIdsToUpdate = _.differenceWith(newBoard.resolved, oldBoard.resolved, _.isEqual)

          console.log(newPendingIdsToUpdate)
          console.log(newProcessingIdsToUpdate)
          console.log(newReviewingIdsToUpdate)
          console.log(newResolvedIdsToUpdate)

          let updateTicketLog = async (id, update) => await Ticket.findOneAndUpdate({ _id: id }, update).lean().exec((error, ticket)=>{
            if(error||!ticket){
              return res.status(400).json({ status: 'error', response: 401, message: 'Error with model edit. '+error})
            }
            else {
              return ticket
            }
          })

          //foreach ids add log system to new status 
          let updatePendingIdsLog = await Promise.all(_.map(newPendingIdsToUpdate, async (item, key, arr)=>{
            let update = {
              $push: {
                log: { 
                  kind: 'system',
                  message: 'This ticket is pending.',
                  status: '',
                  date: Date.now(),
                }
              }
            }
            return await updateTicketLog(item, update)
          }))

          let updateProcessingIdsLog = await Promise.all(_.map(newProcessingIdsToUpdate, async (item, key, arr)=>{
            let update = {
              $push: {
                log: { 
                  kind: 'system',
                  message: 'This ticket is processing.',
                  status: '',
                  date: Date.now(),
                }
              }
            }
            return await updateTicketLog(item, update)
          }))

          let updateReviewingIdsLog = await Promise.all(_.map(newReviewingIdsToUpdate, async (item, key, arr)=>{
            let update = {
              $push: {
                log: { 
                  kind: 'system',
                  message: 'This ticket is under review.',
                  status: '',
                  date: Date.now(),
                }
              }
            }
            return await updateTicketLog(item, update)
          }))

          let updateResolvedIdsLog = await Promise.all(_.map(newResolvedIdsToUpdate, async (item, key, arr)=>{
            let update = {
              $push: {
                log: { 
                  kind: 'system',
                  message: 'This ticket is resolved.',
                  status: '',
                  date: Date.now(),
                }
              }
            }
            return await updateTicketLog(item, update)
          }))

          console.log('updatePendingIdsLog', updatePendingIdsLog)
          console.log('updateProcessingIdsLog', updateProcessingIdsLog)
          console.log('updateReviewingIdsLog', updateReviewingIdsLog)
          console.log('updateResolvedingIdsLog', updateResolvedIdsLog)

          /*
          oldBoard.pending [0, 1, 2, 3]
          newBoard.pending [0, 6, 4]

          oldBoard.processing [4, 5, 6, 7]
          newBoard.processing [5, 7, 3, 2, 1] 
          */


          fields = { 
            type: 'board',
            board: newBoard,
          }

          //console.log('reqBody', reqBody)
          Board.findOneAndUpdate({}, { $set: fields }, { upsert: true, new: true }, function (error, model) {
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
            
              return res.status(200).json({ status: 'success', response: 200, message: 'Success with edit.', data: model})
            }
          })
        })
}

