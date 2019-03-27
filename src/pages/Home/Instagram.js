import React from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import { fetchData } from '../../utils'
import * as Models from '../../actions/models'
import HeadingTwo from '../../components/Typography/HeadingTwo'

@connect((store)=>{
  return {
    user: store.user,
    models: store.models,
  }
})
export default class Instagram extends React.Component {
  constructor(props){
    super(props)
  }

  loadIG = async () => {
    let { props } = this
    let { models, dispatch } = props


    let ig = await fetchData(`/api/instagram/`)
    if(ig.response === 200){
        Models.set('ig', ig.data.instagram, dispatch)
    }
  }

  componentDidMount = () => {
    let { props } = this
    let { models } = props


    if(!_.has(models, 'ig')){
        this.loadIG()
    }
  }

  render() {
    let { props } = this
    let { models } = props

    console.log('ig props', props, models)
    return (
        <div className="instagram container-fluid pt-5 px-5" style={{ background: 'url(/img/shop/insta-bg.jpg) center center / cover no-repeat' }}>
          <div className="row mb-5">
            <div className='col-12 d-flex flex-column align-items-center'>
              <HeadingTwo className='font-weight-light text-white'>Instagram</HeadingTwo>
            </div>
            <div className='col-12 d-flex justify-content-center'>
              <a href='#' className='btn btn-success rounded-0' style={{ fontFamily: 'Graphik Web', lineHeight: '1', fontWeight: '500', fontSize: '0.75rem' }}>Follow</a>
            </div>
          </div>
          <div className="row">
            {_.has(models,'ig') && _.map(models.ig, (item, key, arr)=>{
                if((key + 1) <= 12){
                    return <div className='col-2 col-md-1 d-flex' style={{ backgroundColor: '#000', background: '#000 url('+item.images.standard_resolution.url+') center center / cover no-repeat', height: '10rem'}} >
                      <a href={`${item.link}`} target='_blank' style={{ flex: '1 1' }}></a>
                    </div>
                }
            })}

          </div>
        </div>
    )
    }
}
