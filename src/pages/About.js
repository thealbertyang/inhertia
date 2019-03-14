import React from 'react'
import { connect } from 'react-redux'
import universal from 'react-universal-component'
import Link from 'redux-first-router-link'

import Navbar from '../components/Page/Navbar'
import Header from '../components/Page/Header'
import Section from '../components/Page/Section'
import Footer from '../components/Page/Footer'


import Instagram from './Home/Instagram'


@connect((store)=>{
	return {
		user: store.user,
		location: store.location,
	}
})
export default class About extends React.Component {
	constructor(props){
		super(props);
	}

	render() {
			return [
					<Navbar/>,
					<Header className={`py-5`} OverlineText={`About`} TitleText={`Company`} BackgroundImage={`/img/shop/aboutus.jpg`} Height={`25rem`} TitleClassName={`text-white`} OverlineClassName={`text-white`}/>,
          <Section BackgroundColor={`#ffffff`}>
  					<div className='container py-5'>
  						<div className='row'>
  							<div className='col-6 offset-3'>
  								<p>
  									We are a online boutique brand, established in Los Angeles, California. Our brand proudly supports the empowerment of women. Our site is designed from scratch - we are not a shopify store, which means we'll be able to provide you with the best customer features and contemporary user experience. With this in mind, we hope to establiash a lasting relationship with our customer base!
  								</p>
  							</div>
  						</div>
  					</div>
          </Section>,
          <Instagram/>,
					<Footer/>
			]
	}

}
