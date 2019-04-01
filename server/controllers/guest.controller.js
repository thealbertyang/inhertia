import User from '../models/User'
import Guest from '../models/Guest'
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

let stripe = Stripe('');

/**
 * Get all model
 * @param req
 * @param res
 * @returns void
 */
export function getAll(req, res) {
  Guest.find().sort('-dateAdded').exec((err, model) => {
    if (err) {
      res.status(500).send(err);
    }
    return res.status(200).json({ message: 'Found models', response: 200, data: model })
  });
}


export function getByPagination(req, res) {
  Guest.paginate({}, { page: Number(req.params.page), limit: Number(req.params.limit) }, function(err, result) {
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

  Guest.paginate({ $text: { $search: req.params.term }}, { page: Number(req.params.page), limit: Number(req.params.limit) }, function(err, result) {
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
  Guest.findOne({ user_id: req.params.id }, async function (error, model) {
    if (error || !model) {
      return res.status(400).json({ status: 'error', response: 401, message: 'Error with finding single model. '+error});
    }
    else {
     return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: model });
    }
  })
}



export function getOne(req, res, next){

    Guest.findOne({ '_id': req.params.id }, async function (error, model) {
      if (error || !model) {
          return res.status(400).json({ status: 'error', response: 401, message: 'Error with finding single model. '+error});
        }
        else {
          return res.status(200).json({ status: 'success', response: 200, message: 'Found single model.', data: model });
        }
    })
}


export function remove(req, res, next){
  Guest.remove({"_id": req.params.id}, function (error, model) {
      if (error || !model) {
        return res.status(400).json({ status: 'error', response: 401, message: 'Error with model delete. '+error});
      } else {

        return res.status(200).json({ status: 'success', response: 200, message: 'Success with delete.'});
      }
    })
}
