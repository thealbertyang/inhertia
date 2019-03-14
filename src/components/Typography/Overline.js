import React from 'react'
import { connect } from 'react-redux'
import Link, { NavLink } from 'redux-first-router-link'

@connect((store)=>{
  return {
    location: store.location,
  }
})
export default class Overline extends React.Component {
  constructor(props){
    super(props)
  }
  render() {
    let { props } = this

    return [
       <span className={`overline ${props.className}`}>
          {props.children}
       </span>
    ]
  }
}
