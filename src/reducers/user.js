export default (state = {}, action = {}) => {
	switch (action.type) {
	    case 'USER_SET': {
	    	console.log('got user set', { ...state, ...action.payload })
	    	return { ...state, ...action.payload }
	    }
	    default:
	      return state
	}
}

// TRY THIS: change 'member' to 'admin' to access private area (see src/routesMap.js)
