import React, { PropTypes as T } from 'react'
import classes from 'classnames'

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

/**
 * Root of the current page.
 *
 * @param props
 * @constructor
 */
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

const PageHeader = props =>
  <header className={classes('page-header', props.className)}>
    <h1>
      {props.title}
      &nbsp;
      {props.subtitle && <small>{props.subtitle}</small>}
    </h1>

    {props.children}
  </header>

PageHeader.propTypes = {
  title: T.string.isRequired,
  subtitle: T.string,
  className: T.string,
  children: T.node
}

PageHeader.defaultTypes = {
  subtitle: null
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
  Page,
  PageHeader,
  PageContent
}
