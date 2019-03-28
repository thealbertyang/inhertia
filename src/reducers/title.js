export default (state = 'Inherta Clothing Brand', action = {}) => {
  switch (action.type) {
    case 'LOGIN':
      return 'Inherta Clothing Brand - Login'
    case 'ADMIN':
      return 'Inherta Clothing Brand - Admin'
    default:
      return state
  }
}

// RFR automatically changes the document.title for you :)
