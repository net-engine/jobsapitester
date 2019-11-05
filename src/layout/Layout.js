import React, { Fragment } from 'react';

const Layout = props => {
  return (
    <Fragment>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="/">Jobs API Tester</a>
      </nav>
      <div className="container">
        <div className="row my-2">
          <div className="col">
            {props.children}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default Layout;
