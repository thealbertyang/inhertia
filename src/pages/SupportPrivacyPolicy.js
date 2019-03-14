import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import Sidebar from './Support/Sidebar'

@connect((store)=>{
	return {
		location: store.location,
	}
})
export default class Index extends React.Component {
	constructor(props){
		super(props);
	}


	render() {
		return [
			<div className="container py-5 my-5">
				<div className='row'>
					<div className='col-md-4 col-sm-12'>
						<Sidebar/>
					</div>
					<div className='col-md-8 col-sm-12'>
						<div className='row'>
							<div className='col-12 mb-4'>
								<h3>Privacy Policy</h3>
							</div>
							<div className='col-12'>
								<p>Effective date: June 29, 2018</p>

								<p>Inhertia LLC ("us", "we", or "our") operates the https://www.inhertia.com website and the Inhertia App mobile application (the "Service").</p>
								<p>This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>
								<p>We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same meanings as in our Terms and Conditions.</p>
							</div>

							<div className='col-12'>
									<hr className='mb-5' />
							</div>

							<div className='col-12'>
								<h4>Information Collection And Use</h4>
								<p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>
								<br/>

								<h5>Types of Data Collected</h5>
								<br/>

								<h6>Personal Data</h6>
								<p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:</p>

								<p>
									<ul>
										<li>Email address</li><li>First name and last name</li><li>Phone number</li><li>Address, State, Province, ZIP/Postal code, City</li><li>Cookies and Usage Data</li>
										</ul>
								</p>
								<br/>
								<h6>Usage Data</h6>
								<p>We may also collect information that your browser sends whenever you visit our Service or when you access the Service by or through a mobile device ("Usage Data").</p>
								<p>This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>
								<p>When you access the Service by or through a mobile device, this Usage Data may include information such as the type of mobile device you use, your mobile device unique ID, the IP address of your mobile device, your mobile operating system, the type of mobile Internet browser you use, unique device identifiers and other diagnostic data.</p>
								<br/>

								<h6>Tracking & Cookies Data</h6>
								<p>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information.</p>
								<p>Cookies are files with small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. Tracking technologies also used are beacons, tags, and scripts to collect and track information and to improve and analyze our Service.</p>
								<p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</p>
								<p>Examples of Cookies we use:</p>
								<p>
									<ul>
										<li><strong>Session Cookies.</strong> We use Session Cookies to operate our Service.</li>
										<li><strong>Preference Cookies.</strong> We use Preference Cookies to remember your preferences and various settings.</li>
										<li><strong>Security Cookies.</strong> We use Security Cookies for security purposes.</li>
									</ul>
								</p>
							</div>

							<div className='col-12'>
									<hr className='my-5' />
							</div>

							<div className='col-12'>
								<h4>Use of Data</h4>

								<p>Inhertia LLC uses the collected data for various purposes:</p>
								<p>
									<ul>
										<li>To provide and maintain the Service</li>
										<li>To notify you about changes to our Service</li>
										<li>To allow you to participate in interactive features of our Service when you choose to do so</li>
										<li>To provide customer care and support</li>
										<li>To provide analysis or valuable information so that we can improve the Service</li>
										<li>To monitor the usage of the Service</li>
										<li>To detect, prevent and address technical issues</li>
									</ul>
								</p>
							</div>

							<div className='col-12'>
									<hr className='my-5' />
							</div>

							<div className='col-12'>
								<h4>Transfer Of Data</h4>
								<p>Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.</p>
								<p>If you are located outside United States and choose to provide information to us, please note that we transfer the data, including Personal Data, to United States and process it there.</p>
								<p>Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.</p>
								<p>Inhertia LLC will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy and no transfer of your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of your data and other personal information.</p>
							</div>

							<div className='col-12'>
									<hr className='my-5' />
							</div>

							<div className='col-12'>
								<h4>Disclosure Of Data</h4>
								<br/>
								<h5>Legal Requirements</h5>
								<p>Inhertia LLC may disclose your Personal Data in the good faith belief that such action is necessary to:</p>
								<p>
									<ul>
										<li>To comply with a legal obligation</li>
										<li>To protect and defend the rights or property of Inhertia LLC</li>
										<li>To prevent or investigate possible wrongdoing in connection with the Service</li>
										<li>To protect the personal safety of users of the Service or the public</li>
										<li>To protect against legal liability</li>
									</ul>
								</p>
							</div>

							<div className='col-12'>
									<hr className='my-5' />
							</div>

							<div className='col-12'>
								<h4>Security Of Data</h4>
								<p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
							</div>

							<div className='col-12'>
									<hr className='my-5' />
							</div>

							<div className='col-12'>
								<h4>Service Providers</h4>
								<p>We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.</p>
								<p>These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
								<br/>

								<h4>Analytics</h4>
								<p>We may use third-party Service Providers to monitor and analyze the use of our Service.</p>
								<p>
									<ul>
											<li>
												<p><strong>Google Analytics</strong></p>
												<p>Google Analytics is a web analytics service offered by Google that tracks and reports website traffic. Google uses the data collected to track and monitor the use of our Service. This data is shared with other Google services. Google may use the collected data to contextualize and personalize the ads of its own advertising network.</p>
													<p>For more information on the privacy practices of Google, please visit the Google Privacy & Terms web page: <a href="https://policies.google.com/privacy?hl=en">https://policies.google.com/privacy?hl=en</a></p>
										</li>
									</ul>
								</p>
							 </div>


							<div className='col-12'>
									<hr className='my-5' />
							</div>

							<div className='col-12'>
								<h4>Links To Other Sites</h4>
								<p>Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.</p>
								<p>We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.</p>
							</div>

							<div className='col-12'>
									<hr className='my-5' />
							</div>

							<div className='col-12'>
								<h4>Children's Privacy</h4>
								<p>Our Service does not address anyone under the age of 18 ("Children").</p>
								<p>We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.</p>
							</div>

							<div className='col-12'>
									<hr className='my-5' />
							</div>

							<div className='col-12'>
								<h4>Changes To This Privacy Policy</h4>
								<p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
								<p>We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "effective date" at the top of this Privacy Policy.</p>
								<p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
							</div>

							<div className='col-12'>
									<hr className='my-5' />
							</div>

							<div className='col-12'>
								<h4>Contact Us</h4>
								<p>If you have any questions about this Privacy Policy, please contact us:</p>
								<p>
									<ul>
										<li>By email: support@inhertia.com</li>
										<li>By visiting this page on our website: https://www.inhertia</li>
									</ul>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		]
	}

}
