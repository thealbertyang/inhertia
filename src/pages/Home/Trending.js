import React from 'react'
import Section from '../../components/Page/Section'

import Overline from '../../components/Typography/Overline'
import HeadingTwo from '../../components/Typography/HeadingTwo'

import ButtonAlt from '../../components/Form/ButtonAlt'

import Card from '../../components/Product/Card'
import { fetchData, postData } from '../../utils'

export default class Trending extends React.Component {
  constructor(props){
    super(props)
  }

  state = { data: {} }

  load = async (slug) => {
		let model = await this.fetchLatestProducts()

		if(model.response === 200){
			return {
				...model.data
			}
		}
	}

	fetchLatestProducts = async () => {
		return await fetchData(`/api/products/latest`)
	}

  componentDidMount = async () => {
		this.setState({ loading: true })
			 const data = await this.load()
			 this.setState({ loading: false, data })
	}

  render() {
    console.log('this.data', this.state.data)
    return [
      <Section Name={`trending`} BackgroundColor={`#f3f3f3`}>
        <div className='container' style={{ maxWidth: '1350px', flex: '1 1' }}>
          <div className="row pb-5">
            <div className='col-12 col-md-4 offset-md-4 offset-sm-0 d-flex flex-column align-items-center'>
              <Overline className='text-muted'>
                Products
              </Overline>
              <HeadingTwo className='font-weight-light'>
                Latest
              </HeadingTwo>
            </div>
            <div className='col-12 col-md-4 d-flex align-items-center justify-content-center justify-content-md-end'>
              <ButtonAlt url={`/collection`} className={``}>
                More <i className={`material-icons`}>keyboard_arrow_right</i>
              </ButtonAlt>
            </div>
          </div>
          <div className={`row`}>
            {this.state.data && Object.keys(this.state.data).map((item, index)=>{
              return (
                <div className='col-12 col-md-3 px-0 px-md-5 d-flex flex-column align-items-center'>
                  <Card
                    url={`/product/${this.state.data[item].slug}`}
                    images={this.state.data[item].images}
                    title={this.state.data[item].title}
                    price={this.state.data[item].price}
                    ratings={this.state.data[item].ratings}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </Section>
    ]
  }
}
