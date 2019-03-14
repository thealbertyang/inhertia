import React from 'react'
import { connect } from 'react-redux'
import Link, { NavLink } from 'redux-first-router-link'
import * as _ from 'lodash'
import Avatar from './Avatar'

@connect((store)=>{
  return {
    location: store.location,
    cart: store.cart,
    user: store.user,
  }
})
export default class Navbar extends React.Component {
  constructor(props){
    super(props)
  }
  render() {
    let { props } = this
    let { user, cart } = props
    let logoColor = props.logoColor
    let linksColor = props.linksColor

    return [
      <nav className={`navbar navbar-expand-lg d-flex flex-column flex-md-row align-items-center p-3 px-md-4 bg-white border-bottom ${props.className}`}>
        <h5 className="my-0 mr-md-4 font-weight-normal navbar-brand"><a href="/">INHERTIA</a></h5>
        <nav className="my-2 my-md-0 mr-md-auto">
          <a className="p-2 text-dark" href="/collection">Collection</a>
          <a className="p-2 text-dark" href="/orders">Orders</a>
          <a className="p-2 text-dark" href="/support">Support</a>
          <a className="p-2 text-dark" href="/about">About</a>
          <a className="p-2 text-dark" href="/admin">Admin</a>
        </nav>
        <ul className="navbar-nav d-flex flex-row justify-content-md-end justify-content-md-center align-items-center px-0">
           <li className="nav-item mr-2">
             <Link to="/cart" className="nav-link d-flex flex-row justify-content-center">
               <span className="badge badge-pill badge-danger d-flex flex-row justify-content-center align-items-center mr-1" style={{flex: '1 1'}}>
                 {_.has(cart,'items') ? _.sumBy(cart.items, (item, key, arr)=>{ return item.quantity }) : 0}
               </span>
               <i className="fas fa-shopping-cart"></i>
             </Link>
           </li>

           <li className="nav-item">
             <Link to="/login" className="nav-link d-flex flex-row justify-content-center">
                <i className="fas fa-user"></i>
             </Link>
           </li>

           {(user && !_.isEmpty(user)) && [
            <li className="nav-item dropdown">
             <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <Avatar size={`small`} className={`mr-2`}/>

               {user.first_name}
             </a>
             <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
               {_.indexOf(user.roles,'admin') > -1 && <a className="dropdown-item" href="/admin">Admin</a>}
               <a className="dropdown-item" href="/account">My Account</a>
               <div className="dropdown-divider" />
                <a className="dropdown-item" href="/logout">Logout</a>
              </div>
           </li>
           ]}
         </ul>
      </nav>
    ]
  }
}
