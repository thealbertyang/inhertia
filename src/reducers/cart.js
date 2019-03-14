export default (state = {}, action = {}) => {
	switch (action.type) {
	    case 'CART_AMOUNTS_SET': {
	    	return { ...state, 'amounts': action.amounts }
	    }
	    case 'CART_ITEMS_SET': {
	    	return { ...state, 'items': action.items }
		}
	    case 'CART_DISCOUNTS_SET': {
	    	return { ...state, 'discounts': action.discounts }
		}
	    case 'CART_SHIPPING_SET': {
	    	return { ...state, 'shipping': action.shipping }
		} 
		case 'CART_PAYMENT_SET': {
	    	return { ...state, payment: action.payment }
		}
		case 'CART_TOKEN_SET': {
	    	return { ...state, token: action.token }
		}
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
