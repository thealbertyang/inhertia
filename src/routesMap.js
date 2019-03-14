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
  PRODUCTS: {
    path: '/products/:params*', // TRY: visit this path or dispatch ADMIN
  },
  PRODUCT: {
    path: '/product/:params*', // TRY: visit this path or dispatch ADMIN
  },
  CART: {
    path: '/cart/:params*', // TRY: visit this path or dispatch ADMIN
  },
  ACCOUNT: {
    path: '/account/:params*', // TRY: visit this path or dispatch ADMIN
  },
  LIST: {
    path: '/list/:category',
    thunk: async (dispatch, getState) => {
      const {
        jwtToken,
        location: { payload: { category } },
        videosByCategory
      } = getState()

      if (videosByCategory[category]) return
      const videos = await fetchData(`/api/videos/${category}`, jwtToken)

      if (videos.length === 0) {
        return dispatch({ type: NOT_FOUND })
      }

      dispatch({ type: 'VIDEOS_FETCHED', payload: { videos, category } })
    }
  },
  VIDEO: {
    path: '/video/:slug',
    thunk: async (dispatch, getState) => {
      // TASK FOR YOU. YES, YOU!
      //
      // visit a VIDEO page in the app, then refresh the page, then make
      // this work when visited directly by copying the LIST route above and
      // using fetchData(`/api/video/${slug}`) and by dispatching
      // the the corresponding action type which I'll leave up to you to find
      // in ../reducers/index.js :)
    }
  },
  PLAY: {
    path: '/video/:slug/play',
    thunk: (dispatch, getState) => {
      if (typeof window === 'undefined') {
        const { slug } = getState().location.payload
        const action = redirect({ type: 'VIDEO', payload: { slug } })

        dispatch(action)
      }
    }
  },
  TYPOGRAPHY: '/typography',
  COMPONENTS: '/components',
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
