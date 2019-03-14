// MyStoreCheckout.js
import React from 'react';
import {Elements} from 'react-stripe-elements';

import CheckoutForm from './CheckoutForm';

class MyStoreCheckout extends React.Component {
  constructor(props){
  	super(props)
  }
  render() {
    return (
      <Elements>
        <CheckoutForm handleSubmit={(e, stripe)=>this.props.handleSubmit(e, stripe)}/>
      </Elements>
    );
  }
}

export default MyStoreCheckout;