// CardSection.js
import React from 'react';
import {CardElement} from 'react-stripe-elements';

class CardSection extends React.Component {
  render() {
    return (
    	<div className={`form-group col-12`}>
    		<label>Payment Details</label>
    		<CardElement style={{base: {fontSize: '18px'}}} className='form-control' onChange={(e)=>{this.props.onChange(e); console.log('this.props', this.props); }}/>
     	</div>
    );
  }
};

export default CardSection;
