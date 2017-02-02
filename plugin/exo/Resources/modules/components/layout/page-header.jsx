import React, { PropTypes as T } from 'react'

const PageHeader = props =>
  <div className="page-header">
    <h1>
      {props.title}
      &nbsp;
      {null !== props.subtitle && <small>{props.subtitle}</small>}
    </h1>

    {props.children}
  </div>

PageHeader.propTypes = {
  /**
   * The page title
   */
  title: T.node.isRequired,
  /**
   * An optional subtitle
   */
  subtitle: T.string,
  /**
   * Other
   */
  children: T.node
}

PageHeader.defaultProps = {
  subtitle: null,
  children: []
}

export default PageHeader
