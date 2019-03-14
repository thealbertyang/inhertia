import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import Sidebar from './Support/Sidebar'
import Card from '../components/Page/Card'
import { getLocation } from '../actions/index'

const QuestionCard = ({ question, answer }) =>
<Card
		className='mb-4'
		header={[
				<div className='row'>
					<div className='col-12'>
						{question}
					</div>
				</div>
		]}
		body={[
			<div className='row'>
				<div className='col-12'>
					<p className='mb-0'>{answer}</p>
				</div>
			</div>
		]}
	/>

@connect((store)=>{
	return {
		location: store.location,
	}
})
export default class DeliveryAndShipping extends React.Component {
	constructor(props){
		super(props)
	}

	state = {
		questions: [
			{
				question: 'What kind of shipping do you offer?',
				answer: 'We offer only Expedited Express (1-4 days) - service by DHL, UPS or FedEx.'
			},
			{
				question: 'How do I track my package?',
				answer: 'You can track your order through the customer dashboard.'
			},
			{
				question: 'What happens if I did not receive my delivery?',
				answer: 'Deliveries estimates are usually estimtes, your delivery may arrive earlier or past the estimated date depending on your shipping carrier.'
			},
			{
				question: 'What happens if I cannot track my delivery and it was never delivered?',
				answer: 'Please send a support ticket to support@inhertia.com'
			},
			{
				question: 'What countries do you deliver to?',
				answer: 'We currently ship to US, and EU. We will soon ship to more countries on request.'
			},
			{
				question: 'I cannot login to my account anymore, how do I get access? I have already tried all the options.',
				answer: 'Send an email to support@inhertia.com and we will help you retreive your account.'
			},
		]
	}

	render() {
		let { props } = this
		let { location, dispatch } = props
		let { base, page, method, params } = getLocation(location)
		return [
			<div className="container py-5 my-5">
				<div className='row'>
					<div className='col-md-4 col-sm-12'>
						<Sidebar/>
					</div>
					<div className='col-md-8 col-sm-12'>
						<div className='row'>
							<div className='col-12 mb-4'>
								<h3>Delivery &amp; Shipping</h3>
							</div>
							<div className='col-12 mb-4'>
								<h6 className='mb-4'>Shipping</h6>
								<p>We currently only offer expedited shipping which take 3 - 4 business days in addition to 1 day processing time.</p>
								<p>It is carried by one of the following global express shipping companies: DHL, UPS, FedEx, and TNT.</p>
								<p>You'll receive a tracking number once your order leaves our distribution centre for use on the delivery website.</p>
							</div>
							<div className='col-12 mb-4'>
								<h6 className='mb-4'>Delivery</h6>
								<p>Deliveries arrive between 9am and 5pm Monday to Friday, excluding weekends.</p>
								<p>A signature is not required for delivery as UPS may leave your parcel in a safe place.</p>
								<p>Order by 7pm (EST), 6pm (CST), 4pm (PST) for NEXT DAY Shipping, delivered Monday to Friday excluding weekends.</p>
								<p>Order After 7pm (EST), 6pm (CST), 4pm (PST) on Thursday and before 7pm (EST), 6pm (CST), 4pm (PST) on Friday and you’ll receive your order on Monday.</p>
							</div>
							<div className='col-12'>
								<h6 className='mb-4'>Questions</h6>
								{this.state.questions && this.state.questions.map((item, index)=>
									<QuestionCard {...item} />
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		]
	}

}
