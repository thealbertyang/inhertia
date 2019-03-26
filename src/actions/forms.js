import { NOT_FOUND } from 'redux-first-router'
import { fetchData, postData, deleteData } from '../utils'
import React from 'react'
import Cookie from 'universal-cookie'
import * as _ from 'lodash'

import * as User from './user'


/*


	items

	discounts

	shipping

	amount


*/


export const set = (name, form, dispatch) => dispatch({
	type: 'FORM_SET',
  name: name,
  form: form,
})

export const setOne = (name, field, value, dispatch) => dispatch({
	type: 'FORM_SET_ONE',
  name: name,
  value: value,
  field: field,
})
