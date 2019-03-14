import { NOT_FOUND } from 'redux-first-router'
import { fetchData, postData } from '../utils'
import * as _ from 'lodash'

// try dispatching these from the redux devTools

export const goToPage = (type, category) => ({
  type,
  payload: category && { category }
})

export const goHome = () => ({
  type: 'HOME'
})

export const goToAdmin = () => ({
  type: 'ADMIN'
})

export const notFound = () => ({
  type: NOT_FOUND
})

export const visitCategory = category => ({
  type: 'LIST',
  payload: { category }
})

export const visitVideo = slug => ({
  type: 'VIDEO',
  payload: { slug }
})

export const setForm = (name, inputs) => {
  console.log('name', name)
  return ({ 
      type: 'FORM_SET', 
      payload: {
        form: {
          name: name, 
          inputs: inputs,
        }
      }
    })

}

export const getQuery = () => {
  console.log('tester')
}

export const fetchByUserId = async (id) => {
  console.log('we got fetchByUserId', id)
  let customer = await fetchData(`/api/customer/user/${id}`)
  return customer
}


export const redirect = (redirectAction, redirectPage) => {
  return ({ type: redirectAction, payload: { params: redirectPage }, pathname: redirectPage, kind: 'load' })
}