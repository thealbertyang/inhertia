export default (state = { loaded: false }, action = {}) => {
  switch (action.type) {
    case 'SETTINGS_FETCHED':
      return { ...state, ...action.payload, loaded: action.loaded }
    default:
      return state
  }
}
const capitalize = str =>
  str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
