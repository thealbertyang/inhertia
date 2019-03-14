import * as _ from 'lodash'

export default (state = {}, action = {}) => {
  	switch (action.type) {
	    case 'FORM_SET': {
	    	return { ...state, [action.payload.form.name]: action.payload.form }
	    }
	    case 'FORM_SET_ONE': {
	    	return { 
	    		...state, 
	    		[action.form]: {
	    			...state[action.form], 
	    			inputs: {
	    				...(_.has(state,action.form+'.inputs') ? state[action.form].inputs : {}),
	    				[action.input.name]: {
	    					value: action.input.value, 
	    					error: action.input.error 
	    				} 
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
