import { NOT_FOUND } from 'redux-first-router'
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

}

export const getLocation = (locationProps) => {
    //find this page
    let locationParams = typeof locationProps !== 'undefined' ? locationProps.payload.params : ''
    let url = typeof locationProps !== 'undefined' ? locationProps.pathname : ''

    let base = url.replace(locationParams,'');
    base = _.replace(base, new RegExp('/','g'), '')

    url = url.split('/')

    //make sure to remove the first empty array key from url
    url.shift()
    let baseRouteKey = url.findIndex(index => base === index)


    //everything after base index
    let parameters = url.slice(baseRouteKey + 1)

    let [ page, method, ...params] = parameters


    /*

    // Can also constructor from another URLSearchParams
    const params = new URLSearchParams('q=search+string&version=1&person=Eric');

    params.get('q') === "search string"
    params.get('version') === "1"
    Array.from(params).length === 3

    */

    return { base, page, method, params }
}


export const redirect = (redirectAction, redirectPage) => {
  return ({ type: redirectAction, payload: { params: redirectPage }, pathname: redirectPage, kind: 'load' })
}
