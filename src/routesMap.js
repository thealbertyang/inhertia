import { redirect, NOT_FOUND } from 'redux-first-router'
import { fetchData } from './utils'

export default {
  HOME: '/',
  ABOUT: '/about',
  GUEST: {
    path: '/guest/:params*', // TRY: visit this path or dispatch ADMIN
  },
  LOOKBOOK: {
    path: '/lookbook/:params*', // TRY: visit this path or dispatch ADMIN
  },
  SUPPORT: {
    path: '/support/:params*', // TRY: visit this path or dispatch ADMIN
  },
  RESETPASSWORD: {
    path: '/resetPassword/:params*', // TRY: visit this path or dispatch ADMIN
  },
  FORGOTPASSWORD: {
    path: '/forgotPassword/:params*', // TRY: visit this path or dispatch ADMIN
  },
  VERIFYEMAIL: {
    path: '/verifyEmail/:params*', // TRY: visit this path or dispatch ADMIN
  },
  PRODUCT: {
    path: '/product/:params*', // TRY: visit this path or dispatch ADMIN
  },
  CART: {
    path: '/cart/:params*', // TRY: visit this path or dispatch ADMIN
  },
  SETUP: {
    path: '/setup/:params*', // TRY: visit this path or dispatch ADMIN
  },
  ACCOUNT: {
    path: '/account/:params*', // TRY: visit this path or dispatch ADMIN
  },
  COLLECTION: '/collection',
  LOGIN: '/login',
  LOGOUT: '/logout',
  REGISTER: '/register',
  ADMIN: {
    path: '/admin/:params*', // TRY: visit this path or dispatch ADMIN
    role: 'admin' // + change jwToken to 'real' in server/index.js
  }
}

// DON'T GO DOWN THERE!
// |
// |
// |
// |
// |
// |
// |
// |
// |
// |
// |
// |
// |
// |
// |
// |
// |
// |
// |
// |
// |
// |
// |
// |
// |
// |
// |
// |
// |
// |
// |
// |
// ▼

// ANSWER: videoRoute.thunk.body:
/* HURRAY! You found the answers on the back of the cereal box!

const { jwToken, location: { payload: { slug } } } = getState()
const video = await fetchData(`/api/video/${slug}`, jwToken)

if (!video) {
  return dispatch({ type: NOT_FOUND })
}

dispatch({ type: 'VIDEO_FOUND', payload: { slug, video } })
*/
