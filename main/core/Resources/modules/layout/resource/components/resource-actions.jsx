import React, { PropTypes as T } from 'react'
import classes from 'classnames'
import MenuItem from 'react-bootstrap/lib/MenuItem'

import {
  PageActions,
  PageGroupActions,
  PageAction,
  FullScreenAction,
  MoreAction
} from '#/main/core/layout/page/components/page-actions.jsx'

const PublishAction = props =>
  <PageAction
    id="resource-publish"
    title={props.published ? 'This resource is published. (click to unpublish it)' : 'This resource is not published. (click to publish it)'}
    icon={classes('fa', {
      'fa-eye-slash': !props.published,
      'fa-eye': props.published
    })}
    action={props.togglePublish}
  />

PublishAction.propTypes = {
  published: T.bool.isRequired,
  togglePublish: T.func.isRequired
}

const FavoriteAction = props =>
  <PageAction
    id="resource-favorite"
    title={props.favorited ? 'You have favorited this resource. (click to remove it)' : 'You have not favorited this resource yet. (click to favorite it)'}
    icon={classes('fa', {
      'fa-star-o': !props.favorited,
      'fa-star': props.favorited
    })}
    action={props.toggleFavorite}
  />

FavoriteAction.propTypes = {
  favorited: T.bool.isRequired,
  toggleFavorite: T.func.isRequired
}

const ManageRightsAction = props => {
  let title, icon
  switch (props.rights) {
    case 'all':
      title = 'This resource is accessible by everyone. (click to edit access rights)'
      icon = 'fa-unlock'
      break
    case 'admin':
      title = 'This resource is accessible by managers only. (click to edit access rights)'
      icon = 'fa-lock'
      break
    case 'workspace':
      title = 'This resource is accessible by workspace users. (click to edit access rights)'
      icon = 'fa-unlock-alt'
      break
    case 'custom':
      title = 'This resource has custom access rights. (click to edit access rights)'
      icon = 'fa-unlock-alt'
      break
  }

  return (
    <PageAction
      id="resource-rights"
      title={title}
      icon={classes('fa', icon)}
      action={props.openRightsManagement}
    >
      {'custom' === props.rights &&
      <span className="fa fa-asterisk text-danger"></span>
      }
    </PageAction>
  )
}

ManageRightsAction.propTypes = {
  rights: T.oneOf(['all', 'admin', 'workspace', 'custom']).isRequired,
  openRightsManagement: T.func.isRequired
}

const LikeAction = props =>
  <PageAction
    id="resource-like"
    title="Like this resource"
    icon="fa fa-thumbs-o-up"
    action={() => true}
  >
    <span className="label label-primary">{props.likes}</span>
  </PageAction>

LikeAction.propTypes = {
  likes: T.number.isRequired
}

const ResourceActions = props =>
  <PageActions className="resource-actions">
    <PageGroupActions>
      <PageAction id="resource-edit" title="Edit this resource" icon="fa fa-pencil" />
      <PublishAction published={true} togglePublish={() => true} />
      <ManageRightsAction rights="workspace" openRightsManagement={() => true} />
    </PageGroupActions>

    <PageGroupActions>
      <PageAction id="resource-share" title="Share this resource" icon="fa fa-share" />
      <LikeAction likes={100} />
      <FavoriteAction favorited={false} toggleFavorite={() => true} />
    </PageGroupActions>

    <PageGroupActions>
      <FullScreenAction fullScreen={false} toggleFullScreen={() => true} />
      <MoreAction id="resource-more">
        <MenuItem header>Quiz</MenuItem>
        <MenuItem eventKey="1">
          <span className="fa fa-fw fa-play" />
          Test quiz
        </MenuItem>
        <MenuItem eventKey="1">
          <span className="fa fa-fw fa-list" />
          Show results
        </MenuItem>
        <MenuItem eventKey="1">
          <span className="fa fa-fw fa-pie-chart" />
          Show statistics
        </MenuItem>
        <MenuItem eventKey="1">
          <span className="fa fa-fw fa-check-square-o" />
          Manual correction
        </MenuItem>

        <MenuItem header>Management</MenuItem>
        <MenuItem eventKey="1">
          <span className="fa fa-fw fa-pencil" />
          Edit properties
        </MenuItem>
        <MenuItem eventKey="1">
          <span className="fa fa-fw fa-desktop" />
          Edit display options
        </MenuItem>
        <MenuItem eventKey="1">
          <span className="fa fa-fw fa-tags" />
          Manage tags
        </MenuItem>

        <MenuItem eventKey="1">
          <span className="fa fa-fw fa-user-secret" />
          Show as...
        </MenuItem>

        <MenuItem header>Other</MenuItem>
        <MenuItem eventKey="1">
          <span className="fa fa-fw fa-comment" />
          Add a comment
        </MenuItem>

        <MenuItem eventKey="1">
          <span className="fa fa-fw fa-sticky-note" />
          Add a note
        </MenuItem>

        <MenuItem divider />
        <MenuItem eventKey="4">
          <span className="fa fa-fw fa-upload" />
          Export resource
        </MenuItem>

        <MenuItem divider />
        <MenuItem eventKey="4" className="dropdown-link-danger">
          <span className="fa fa-fw fa-trash" />
          Delete resource
        </MenuItem>
      </MoreAction>
    </PageGroupActions>
  </PageActions>

ResourceActions.propTypes = {
  editEnabled: T.bool
}

ResourceActions.defaultTypes = {
  editEnabled: false
}

export {
  ResourceActions
}
