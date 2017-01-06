import React, {PropTypes as T} from 'react'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'
import Tooltip from 'react-bootstrap/lib/Tooltip'


export const LinkWithTooltip = props =>
<OverlayTrigger
  placement="bottom"
  overlay={
    <Tooltip id={props.id}>props.title</Tooltip>
  }
>
  <a
    className="btn btn-link"
    onClick={props.onClick}
  >
  {props.label}
  </a>
</OverlayTrigger>

LinkWithTooltip.propTypes = {
  id: T.string.isRequired,
  title: T.string.isRequired,
  label: T.string,
  onClick: T.func.isRequired
}
