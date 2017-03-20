import React, { PropTypes as T } from 'react'
import classes from 'classnames'

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

export {PageHeader}
