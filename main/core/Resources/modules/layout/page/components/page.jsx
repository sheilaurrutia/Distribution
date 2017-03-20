import React, { PropTypes as T } from 'react'

/**
 * Page scaffolding components.
 */

/**
 * Page container.
 *
 * @param props
 * @constructor
 */
const PageContainer = props =>
  <div className="page-container">
    {props.children}
  </div>

PageContainer.propTypes = {
  fullScreen: T.bool,
  children: T.node
}

const Page = props =>
  <main className="page">
    {props.children}
  </main>

Page.propTypes = {
  fullScreen: T.bool,
  children: T.node
}

Page.defaultTypes = {
  fullScreen: false
}

const PageContent = props =>
  <div className="page-content">
    {props.children ?
      props.children :
      <div className="placeholder">This page has no content for now.</div>
    }
  </div>

PageContent.propTypes = {
  children: T.node
}

export {
  PageContainer,
  Page
}
