import React from 'react'
import Link from 'redux-first-router-link'
import Avatar from '../Page/Avatar'

const Navbar = ({ user }) => <nav className="navbar d-flex flex-column flex-md-row align-items-center py-3 border-bottom mb-4">
  <nav className="my-2 my-md-0 mr-md-auto">
    <a className="p-2 text-dark" href="/collection">Collection</a>
    <a className="p-2 text-dark" href="/orders">Orders</a>
    <a className="p-2 text-dark" href="/support">Support</a>
    <a className="p-2 text-dark" href="/about">About</a>
  </nav>
  <ul className="navbar-nav d-flex flex-row justify-content-md-end justify-content-md-center align-items-center px-0">
     <li className="nav-item mr-2">
       <Link to="/login" className="nav-link d-flex flex-row justify-content-center">
           <Avatar/>
       </Link>
     </li>

     {(user && !_.isEmpty(user)) && [
      <li className="nav-item dropdown">
       <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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

export default Navbar
