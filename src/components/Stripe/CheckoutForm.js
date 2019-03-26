// CheckoutForm.js
import React from 'react';
import {injectStripe} from 'react-stripe-elements';
import CardSection from './CardSection';
import { connect } from 'react-redux'

@connect((store)=>{
  return {
    cart: store.cart,
    forms: store.forms,
    location: store.location,
  }
})
class CheckoutForm extends React.Component {
  constructor(props){
    super(props)
  }

  handleSubmit = (e) => {
    //e.preventDefault();
    let { forms, crud, stripe, dispatch } = this.props
    this.props.handleSubmit && this.props.handleSubmit(e, stripe)

    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    /*this.props.stripe.createToken({
      name: this.props.cart.shipping.first_name+'_'+this.props.shop.cart.shipping.last_name,
      card: {
        'address_city': this.props.shop.cart.shipping.city,
        'address_country': this.props.shop.cart.shipping.country,
        'address_line1': this.props.shop.cart.shipping.line1,
        'address_line2': this.props.shop.cart.shipping.line2,
        'address_state': this.props.shop.cart.shipping.state,
        'address_zip': this.props.shop.cart.shipping.zip,
      },
    }).then( async ({token}) => {

      console.log('Received Stripe token:', token, this.props, this);
*/

     // this.props.dispatch(Crud.setPageModel('customerCard', { value: token.card.id }))

      //Save token to shop redux props cart token


      //once you get cart token save it to customer user token

      //what if it is a guest??

      //Shop.submitOrder(token)


    // However, this line of code will do the same thing:
    // this.props.stripe.createToken({type: 'card', name: 'Jenny Rosen'});
  }

  render() {
    return (
      <form onSubmit={e=>e.preventDefault() } className={`row`}>

        <CardSection onChange={(e)=>this.handleSubmit(e)} />
          <div className="col-12 text-right">
            {this.props.cart && this.props.cart.token ? 'Loaded' : 'Not Loaded'}
          </div>
      </form>
    );
  }
}

export default injectStripe(CheckoutForm);
