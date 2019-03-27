import React from 'react'
import Link from 'redux-first-router-link'

const NavItem = ({ url, title, icon}) =>
  <li className="nav-item">
      <Link to={url} className="nav-link">
        <i class={`fas fa-${icon} fa-fw mr-2`} ></i>
        <span className='d-none d-md-block'>{title}</span>
      </Link>
  </li>

const Sidebar = ({ base }) => [
  <div className={`sidebar col-1 col-md-2`}>
    <div className={`row`}>
      <div className={`col-12 py-3`}>
        <h5 className="my-0 mr-md-4 font-weight-normal navbar-brand"><a href="/">INHERTIA</a></h5>
      </div>
      <div className={`col-12`}>
        <ul className={`nav flex-column text-left mb-3`}>
          <li class="sidebar-header">
  						<small className={`text-uppercase`}>Main</small>
  				</li>
          <NavItem url={`/${base}`} title={`Dashboard`} icon={`home`} />

        </ul>
        <ul className={`nav flex-column text-left mb-3`}>
          <li class="sidebar-header">
              <small className={`text-uppercase`}>Store</small>
          </li>
          <NavItem url={`/${base}/products`} title={`Products`} icon={`shopping-bag`} />
          <NavItem url={`/${base}/orders`} title={`Orders`} icon={`file-invoice-dollar`} />
          <NavItem url={`/${base}/campaigns`} title={`Campaigns`} icon={`funnel-dollar`} />
        </ul>
        <ul className={`nav flex-column text-left mb-3`}>
          <li class="sidebar-header">
            <small className={`text-uppercase`}>User</small>
  				</li>

          <li className="nav-item">
            <NavItem url={`/${base}/users`} title={`Users`} icon={`user`} />
          </li>
        </ul>
        <ul className={`nav flex-column text-left mb-3`}>
          <li class="sidebar-header">
  						<small className={`text-uppercase`}>App</small>
  				</li>

          <li className="nav-item">
            <NavItem url={`/${base}/settings`} title={`Settings`} icon={`cog`} />
          </li>

        </ul>
      </div>
    </div>

  </div>
]


export default Sidebar
