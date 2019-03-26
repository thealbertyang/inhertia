import React from 'react'
import { connect } from 'react-redux'
import { TransitionGroup, Transition } from 'transition-group'
import universal from 'react-universal-component'
import * as _ from 'lodash'

import Loading from './Loading'
import Err from './Error'
import isLoading from '../selectors/isLoading'

import Setup from '../pages/Setup'

import * as User from '../actions/user'
import * as Cart from '../actions/cart'
import * as Models from '../actions/models'
import { fetchData } from '../utils'
import { getLocation, redirect } from '../actions/index'


const UniversalComponent = universal(({ page }) => import(`../pages/${page}`), {
  minDelay: 500,
  loading: Loading,
  error: Err
})

@connect((store)=>{
  return {
    forms: store.forms,
    user: store.user,
    cart: store.cart,
    jwtToken: store.jwtToken,
    page: store.page,
    direction: store.direction,
    settings: store.settings,
    models: store.models,
    isLoading: isLoading(store)
  }
})
export default class Switcher extends React.Component {
  constructor(props){
    super(props)
    this.state = { loaded: null }
  }


  	getSettings = async () => {
  		let { props } = this
  		let { forms, dispatch, location } = props
  		let { method } = getLocation(location)

  		let id = method

  		let settings = await fetchData(`/api/settings`)
  		if(settings.response === 200){
  			Models.set('settings', settings.data, dispatch)
        console.log('TEST models', this.props.models)
        let hasSettings = typeof this.props.models.settings !== 'undefined' && this.props.models.settings.name !== '' && this.props.models.settings.name !== null
        let noSettings = (typeof this.props.models.settings === 'undefined' || this.props.models.settings.name === '' || this.props.models.settings.name === null)

        if(hasSettings){
          this.setState({ loaded: true })
        }
        else if(noSettings){
          this.setState({ loaded: false })
        }
      }
  		else {

        Models.set('settings', settings.data, dispatch)
        this.setState({ loaded: false })
      }
  	}

  	componentWillMount = async () => {
  		let { props } = this
  		let { models } = props

  		if(!_.has(models, 'settings')){
  			this.getSettings()
  		}

  	}

    componentDidMount = () => {
      let { props } = this
      let { models, dispatch } = props

      User.authToken({ dispatch })
      Cart.loadItems(dispatch)
      document.addEventListener('keydown', this.handleKeyDown);
    }

    componentDidUpdate(nextProps){
        console.log('switcher', nextProps, this.props)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = (e) => {
      console.log(e)

      if(e.key === 'a' && e.ctrlKey === true){
        this.props.dispatch(redirect('ADMIN'))
      }
    }


  render() {

    console.log('cart', this.props)
    let { props } = this
    let { direction, page, isLoading } = props

    let hasSettings = typeof this.props.models.settings !== 'undefined' && this.props.models.settings.name !== ''
    let noSettings = (typeof this.props.models.settings === 'undefined' || this.props.models.settings.name === '')
    return (
      <TransitionGroup
        className={`${direction}`}
        duration={500}
        prefix='fade'
      >
        <Transition key={page}>
        <div className={`page page-${_.toLower(page)}`}>
            {this.state.loaded === true && <UniversalComponent page={page} isLoading={isLoading} />}
            {this.state.loaded === false && <Setup/>}
        </div>
        </Transition>
      </TransitionGroup>
    )
  }
}
