import React, {PropTypes as T} from 'react'
import {connect} from 'react-redux'

import {select} from './../selectors'
import {actions as paginationActions} from './../actions/pagination'
import {actions as searchActions} from './../actions/search'
import {select as paginationSelect} from './../selectors/pagination'


const ResourceContainer = props =>
  <Resource
    resourceNode={props.resourceNode}
  >
    {props.children}
  </Resource>

ResourceContainer.propTypes = {
  resourceNode: T.shape({

  })
}

function mapStateToProps(state) {
  return {
    resourceNode: select.resourceNode(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

const ConnectedResource = connect(mapStateToProps, mapDispatchToProps)(Resource)

export {ConnectedResource as Resource}
