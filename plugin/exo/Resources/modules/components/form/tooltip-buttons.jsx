import React, {PropTypes as T} from 'react'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'
import Tooltip from 'react-bootstrap/lib/Tooltip'
import classes from 'classnames'


export const LinkWithTooltip = props =>
<OverlayTrigger
  placement={props.position}
  overlay={
    <Tooltip id={props.id}>{props.title}</Tooltip>
  }
>
  <a
    role="button"
    className={classes('btn', 'btn-link', props.className)}
    onClick={props.onClick}
  >
  {props.label}
  </a>
</OverlayTrigger>

LinkWithTooltip.defaultProps = {
  position:'top'
}

LinkWithTooltip.propTypes = {
  id: T.string.isRequired,
  title: T.string.isRequired,
  position: T.string.isRequired,
  onClick: T.func.isRequired,
  label: T.string,
  className: T.string
}
