import React, {PropTypes as T} from 'react'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'
import Tooltip from 'react-bootstrap/lib/Tooltip'
import classes from 'classnames'


export const LinkWithTooltip = props =>
<OverlayTrigger
  placement="bottom"
  overlay={
    <Tooltip id={props.id}>{props.title}</Tooltip>
  }
>
  <a
    role="button"
    className={classes('btn', 'btn-link', props.classes)}
    onClick={props.onClick}
  >
  {props.label}
  </a>
</OverlayTrigger>

LinkWithTooltip.propTypes = {
  id: T.string.isRequired,
  title: T.string.isRequired,
  onClick: T.func.isRequired,
  label: T.string,
  classes: T.string
}
