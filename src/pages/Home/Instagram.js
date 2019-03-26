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
                return <div className='col-1 d-flex' style={{ backgroundColor: '#000', background: '#000 url('+item.images.standard_resolution.url+') center center / cover no-repeat', height: '10rem'}} >
                    <a href={`${item.link}`} target='_blank' style={{ flex: '1 1' }}></a>
                </div>
            })}
            <div className='col-2 col-md-1' style={{ backgroundColor: '#000', background: '#000 url(/img/shop/insta/1.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#d3d3d3', background: '#000 url(/img/shop/insta/2.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#000', background: '#000 url(/img/shop/insta/3.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#d3d3d3', background: '#000 url(/img/shop/insta/4.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#000', background: '#000 url(/img/shop/insta/5.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#d3d3d3', background: '#000 url(/img/shop/insta/6.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#000', background: '#000 url(/img/shop/insta/7.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#d3d3d3', background: '#000 url(/img/shop/insta/8.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#000', background: '#000 url(/img/shop/insta/9.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#d3d3d3', background: '#000 url(/img/shop/insta/10.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#000', background: '#000 url(/img/shop/insta/11.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#d3d3d3', background: '#000 url(/img/shop/insta/12.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>
          </div>

          <div className="row">
            <div className='col-2 col-md-1' style={{ backgroundColor: '#000', background: '#000 url(/img/shop/insta/13.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#d3d3d3', background: '#000 url(/img/shop/insta/14.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#000', background: '#000 url(/img/shop/insta/15.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#d3d3d3', background: '#000 url(/img/shop/insta/16.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#000', background: '#000 url(/img/shop/insta/17.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#d3d3d3', background: '#000 url(/img/shop/insta/18.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#000', background: '#000 url(/img/shop/insta/19.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#d3d3d3', background: '#000 url(/img/shop/insta/20.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#000', background: '#000 url(/img/shop/insta/21.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#d3d3d3', background: '#000 url(/img/shop/insta/22.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#000', background: '#000 url(/img/shop/insta/23.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#d3d3d3', background: '#000 url(/img/shop/insta/24.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>
          </div>

          <div className="row">
            <div className='col-2 col-md-1' style={{ backgroundColor: '#000', background: '#000 url(/img/shop/insta/25.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#d3d3d3', background: '#000 url(/img/shop/insta/26.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#000', background: '#000 url(/img/shop/insta/27.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#d3d3d3', background: '#000 url(/img/shop/insta/28.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#000', background: '#000 url(/img/shop/insta/29.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#d3d3d3', background: '#000 url(/img/shop/insta/30.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#000', background: '#000 url(/img/shop/insta/31.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#d3d3d3', background: '#000 url(/img/shop/insta/32.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#000', background: '#000 url(/img/shop/insta/33.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#d3d3d3', background: '#000 url(/img/shop/insta/34.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#000', background: '#000 url(/img/shop/insta/35.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#d3d3d3', background: '#000 url(/img/shop/insta/36.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>
          </div>

          <div className="row">
            <div className='col-2 col-md-1' style={{ backgroundColor: '#000', background: '#000 url(/img/shop/insta/37.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#d3d3d3', background: '#000 url(/img/shop/insta/38.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#000', background: '#000 url(/img/shop/insta/39.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#d3d3d3', background: '#000 url(/img/shop/insta/40.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#000', background: '#000 url(/img/shop/insta/41.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#d3d3d3', background: '#000 url(/img/shop/insta/42.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#000', background: '#000 url(/img/shop/insta/43.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#d3d3d3', background: '#000 url(/img/shop/insta/44.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#000', background: '#000 url(/img/shop/insta/45.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#d3d3d3', background: '#000 url(/img/shop/insta/46.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#000', background: '#000 url(/img/shop/insta/47.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>

            <div className='col-2 col-md-1' style={{ backgroundColor: '#d3d3d3', background: '#000 url(/img/shop/insta/48.jpg) center center / cover no-repeat', height: '10rem'}} >

            </div>
          </div>
        </div>
    )
    }
}
