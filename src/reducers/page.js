import { NOT_FOUND } from 'redux-first-router'

export default (state = 'HOME', action = {}) => components[action.type] || state

const components = {
  HOME: 'Home',
  ABOUT: 'About',
  COLLECTION: 'Collection',
  COMPONENTS: 'Components',
  LIST: 'List',
  VIDEO: 'Video',
  ADMIN: 'Admin',
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  GUEST: 'Guest',
  LOOKBOOK: 'Lookbook',
  SUPPORT: 'Support',
  SETUP: 'Setup',
  TYPOGRAPHY: 'Typography',
  FORGOTPASSWORD: 'ForgotPassword',
  RESETPASSWORD: 'ResetPassword',
  VERIFYEMAIL: 'VerifyEmail',
  REGISTER: 'Register',
  PRODUCTS: 'Products',
  PRODUCT: 'Product',
  CART: 'Cart',
  ACCOUNT: 'Account',
  [NOT_FOUND]: 'NotFound'
}

// NOTES: this is the primary reducer demonstrating how RFR replaces the need
// for React Router's <Route /> component.
//
// ALSO:  Forget a switch, use a hash table for perf.
