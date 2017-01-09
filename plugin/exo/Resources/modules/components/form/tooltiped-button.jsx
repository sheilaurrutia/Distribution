import React, {PropTypes as T} from 'react'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'
import Tooltip from 'react-bootstrap/lib/Tooltip'
import classes from 'classnames'


export const BtnWithTooltip = props =>
<OverlayTrigger
  placement={props.position}
  overlay={
    <Tooltip id={props.id}>{props.title}</Tooltip>
  }
>
  <button
    role="button"
    aria-disabled={!props.enabled}
    className={classes('btn', 'btn-link', props.className, {disabled: !props.enabled})}
    onClick={props.onClick}
  >
    {props.label}
  </button>
</OverlayTrigger>

BtnWithTooltip.defaultProps = {
  position:'top',
  enabled: true
}

BtnWithTooltip.propTypes = {
  id: T.string.isRequired,
  title: T.string.isRequired,
  position: T.string.isRequired,
  enabled: T.bool.isRequired,
  onClick: T.func,
  label: T.string,
  className: T.string
}
