import routesMap from './routesMap'
import * as _ from 'lodash'
import User from './actions/user'

// import jwt from 'jsonwebtoken'

export const isServer = typeof window === 'undefined'

export const fetchData = async (path, jwtToken) =>
  fetch(`${process.env.URL}${path}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${jwtToken || ''}`
    }
  }).then(data => data.json())


export const postData = async (path, form, jwtToken) =>{
  console.log(process.env.URL+`${path}`);
  console.log('forms', form)
  let formData = new FormData()

  _.map(form, (item, key)=>{
    if(key === 'images' || key === 'avatar'){
      console.log('GOT IN HERE', item)
      let images = _.map(item, (input)=>{
        if(_.has(input, 'type')){
          formData.append(key+'[]', input.value)
        }
        else {
          formData.append(key+'[]', input)
        }
      })
    }
    else if(_.isArray(item) && _.isArray(item.value)){
      form[key] && formData.append(key, JSON.stringify(item.value))
    }
    else if(typeof item === 'object'){
      form[key] && formData.append(key, JSON.stringify(item.value))
    }
    else {
      form[key] && formData.append(key, form[key])
    }
  })

  let headers = {}
  let body = {}

    headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${jwtToken || ''}`,
    }
    body = formData

  return fetch(process.env.URL+`${path}`, {
    method: 'post',
    headers: headers,
    body: body,
    credentials: 'same-origin'
  }).then(data => data.json());
};


export const deleteData = async (path, jwtToken) =>{
  console.log(process.env.URL+`${path}`);
  return fetch(process.env.URL+`${path}`, {
    method: 'delete',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${jwtToken || ''}`,
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  }).then(data => data.json());
};

export const isAllowed = async (type, state, dispatch) => {

  //if state has jwtToken then try to use that otherwise
  //use user props roles?
//  await User.authToken(null, dispatch)

  console.log('is allowed PERFORMED', type, state)

  //return true
  const role = routesMap[type] && routesMap[type].role // you can put arbitrary keys in routes
  if (!role) return true

  const user = isServer
    ? jwt.verify(state.jwtToken, process.env.JWT_SECRET)
    : userFromState(state)

  if (!user) return false

  return user.roles.includes(role)
}

// VERIFICATION MOCK:
// since middleware is syncrhonous you must use a jwt package that is sync
// like the one imported above. For now we will mock both the client + server
// verification methods:

const fakeUser = { roles: ['admin'] }
const userFromState = ({ jwtToken, user }) => jwtToken === 'real' && fakeUser
const jwt = {
  verify: (jwtToken, secret) => jwtToken === 'real' && fakeUser
}

// NOTE ON COOKIES:
// we're doing combination cookies + jwtTokens because universal apps aren't
// single page apps (SPAs). Server-rendered requests, when triggered via
// direct visits by the user, do not have headers we can set. That's the
// takeaway.
