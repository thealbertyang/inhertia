import React from 'react'
import Link from 'redux-first-router-link'

const NavItem = ({ url, title, icon}) =>
  <li className="nav-item">
      <Link to={url} className="nav-link">
        <i class={`fas fa-${icon} fa-fw mr-2`} ></i>
        {title}
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
          <NavItem url={`/${base}/campaigns`} title={`Campaigns`} icon={`funnel-dollar`} />
          <NavItem url={`/${base}/orders`} title={`Orders`} icon={`file-invoice-dollar`} />
        </ul>
        <ul className={`nav flex-column text-left mb-3`}>
          <li class="sidebar-header">
              <small className={`text-uppercase`}>Store</small>
          </li>
          <NavItem url={`/${base}/products`} title={`Products`} icon={`shopping-bag`} />

        </ul>
        <ul className={`nav flex-column text-left mb-3`}>
          <li class="sidebar-header">
            <small className={`text-uppercase`}>User</small>
  				</li>

          <li className="nav-item">
             <Link to={`/${base}/users/`} className="nav-link">
              <i className='material-icons mr-1'>people</i>
              Users
            </Link>

            <ul className='list-unstyled nav-list'>
              <li className="nav-item">
                <Link to={`/${base}/customers/`} className="nav-link">
                  <i className='material-icons mr-1'>people</i>
                  Admin
                 </Link>
              </li>
              <li className="nav-item">
                <Link to={`/${base}/customers/`} className="nav-link">
                  <i className='material-icons mr-1'>people</i>
                  Customers
                 </Link>
              </li>
            </ul>
          </li>
        </ul>
        <ul className={`nav flex-column text-left mb-3`}>
          <li class="sidebar-header">
  						<small className={`text-uppercase`}>App</small>
  				</li>

          <li className="nav-item">
          <Link to={`/${base}/settings/`} className="nav-link">
              <i className='material-icons mr-1'>settings</i>
              Settings
            </Link>
            <ul className='list-unstyled nav-list'>
              <li className="nav-item">
                <Link to={`/${base}/integrations/`} className="nav-link">
                  <i className='material-icons mr-1'>layers</i>
                    Integrations
                </Link>
              </li>
            </ul>
          </li>

        </ul>
      </div>
    </div>

  </div>
]


export default Sidebar
