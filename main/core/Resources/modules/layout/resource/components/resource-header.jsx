import React, { PropTypes as T } from 'react'

import { PageHeader } from '#/main/core/layout/page/components/page-header.jsx'
import { ResourceActions } from '#/main/core/layout/resource/components/resource-actions.jsx'

const ResourceHeader = props =>
  <PageHeader
    className="resource-header"
    title={props.resourceNode.name}
    subtitle={props.subtitle}
  >
    <ResourceActions editEnabled={props.editEnabled} />
  </PageHeader>

ResourceHeader.propTypes = {
  resourceNode: T.shape({
    name: T.string.isRequired
  }).isRequired,
  subtitle: T.string,
  editEnabled: T.bool,
  actions: T.array
}

ResourceHeader.defaultProps = {
  editEnabled: false,
  subtitle: null,
  actions: []
}

export {ResourceHeader}
