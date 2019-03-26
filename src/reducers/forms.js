import * as _ from 'lodash'

export default (state = {}, action = {}) => {
  	switch (action.type) {
	    case 'FORM_SET': {
	    	return { ...state, [action.name]: action.form }
	    }
	    case 'FORM_SET_ONE': {
	    	return {
	    		...state,
	    		[action.name]: {
	    			...state[action.name],
	    			values: {
	    				...(_.has(state,action.name+'.values') ? state[action.name].values : {}),
	    				[action.field]: action.value,
	    			}
	    		}
	    	}
	    }
	   /* case 'FORM_INPUT_SET': {
	    	return { ...state, [action.payload.form.name]: { ...state[action.payload.form.name].inputs, [action.name]: { value: action.value, error: action.error } } }
		}*/
	    default:
	      return state
	}
}

/* eg: { formName: {
	name: 'login',
	inputs: {
	},
	message: '',
	state: 'submitting'
*/
