export default (state = {}, action = {}) => {
  if (action.type === 'MODEL_SET') {
    return { ...state, [action.name]: action.data }
  }
  return state
}

/* eg: { formName: { 
	name: 'login', 
	inputs: {
	},
	message: '',
	state: 'submitting'
*/
