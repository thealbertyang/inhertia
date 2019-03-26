import React from 'react'
import { Field, reduxForm } from 'redux-form'
import MyStoreCheckout from '../../components/Stripe/MyStoreCheckout'
import {StripeProvider} from 'react-stripe-elements'
import { connect } from 'react-redux'
import { fetchData, postData } from '../../utils'
import * as Cart from '../../actions/cart'

@connect((store)=>{
  return {
    cart: store.cart,
    form: store.form,
    user: store.user,
    location: store.location,
  }
})
class PaymentForm extends React.Component  {
  constructor(props){
    super(props)
  }

  state = { stripe: null }
  componentDidMount = async () => {
    this.setState({ stripe: window.Stripe('pk_test_vixzu5CoMlSioGsG2IgGD2Z4') });
  }


  updateModel = async (id, token) => {
		return await postData(`/api/user/customer/payment/create/${this.props.user.customer._id}`, { token: { value: token } })
	}

	handleSubmit = async () => {
    console.log('this form', this.props)

    let { props } = this
    let { cart, form, user, dispatch } = props
    let id = this.props.user._id
    let update = await this.updateModel(id, this.props.cart.token)
    if(update.response === 200){
      User.authToken({ dispatch })
    }
    else {
    }
  }

  createPaymentToken = (e, stripe) => {

		let { props } = this
		let { user, form, models, location, dispatch } = props

		console.log('form MUFA', form.payment.values)
		console.log('got stripe', stripe)


		/*

			Only if we get
			address_line1:
			address_line2:
			address_city:
			address_state:
			address_zip:
			address_country:
		*/

    let {
      name,
      address_line1,
			address_line2,
			address_city,
			address_state,
			address_zip,
			address_country
    } = form.payment.values

			stripe.createToken({
		      name: name,
		      card: {
            address_line1,
            address_line2,
            address_city,
            address_state,
            address_zip,
            address_country
          },
		    }).then( async ({token}) => {

		      console.log('Received Stripe token:', token, this.props, this);

     			await Cart.updateToken(token.id, dispatch)

     			console.log('after', this.props)

		    })


    // However, this line of code will do the same thing:
    // this.props.stripe.createToken({type: 'card', name: 'Jenny Rosen'});
	}

  render(){
      return <form onSubmit={this.handleSubmit} className='form-row'>
      <div className='col-12'>
        <h6>Add</h6>
      </div>
      <div className='form-group col-12'>
        <Field
          name={`name`}
          component="input"
          type='text'
          placeholder="Name on Card"
          className="form-control"
        />
        <OnChange name={'name'}>
            {(value, previous) => {
              // do something
                if(value !== previous){
                  Forms.set({ name: 'payment', form: { values: { name: value } }, dispatch: this.props.dispatch })
                }
            }}
          </OnChange>
      </div>
      <div className='form-group col-8'>
        <Field
          name={`address_line1`}
          component="input"
          type='text'
          placeholder="Street Address"
          className="form-control"
        />
      </div>

      <div className='form-group col-4'>
        <Field
          name={`address_line2`}
          component="input"
          type='text'
          placeholder="Apt, Suite, etc.."
          className="form-control"
        />
      </div>

      <div className='form-group col-4'>
        <Field
          name={`address_city`}
          component="input"
          type='text'
          placeholder="City"
          className="form-control"
        />
      </div>

      <div className='form-group col-2'>
        <Field
          name={`address_state`}
          component="input"
          type='text'
          placeholder="State"
          className="form-control"
        />
      </div>

      <div className='form-group col-3'>
        <Field
          name={`address_zip`}
          component="input"
          type='text'
          placeholder="Postal Code"
          className="form-control"
        />
      </div>

      <div className='form-group col-3'>
        <Field
          name={`address_country`}
          component="input"
          type='text'
          placeholder="Country"
          className="form-control"
        />
      </div>
      <div className='form-group col-12'>
        <StripeProvider stripe={this.state.stripe}>
              <MyStoreCheckout handleSubmit={(e,stripe)=>this.createPaymentToken(e, stripe)}/>
          </StripeProvider>
      </div>

      <div className='form-group col-6'>
        <button type='submit' className='btn btn-small py-1 btn-primary'>Save</button>
      </div>
    	</form>
  }
}

PaymentForm = reduxForm({
  // a unique name for the form
  form: 'payment'
})(PaymentForm)

export default PaymentForm
