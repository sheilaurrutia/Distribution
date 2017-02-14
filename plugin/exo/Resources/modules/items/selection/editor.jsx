import React, {Component, PropTypes as T} from 'react'

export class Selection extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <div>editor</div>
  }
}

Selection.propTypes = {
  item: T.object,
  onChange: T.func.isRequired,
  validating: T.bool.isRequired
}
