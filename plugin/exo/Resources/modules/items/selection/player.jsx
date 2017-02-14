import React, {Component, PropTypes as T} from 'react'

export class SelectionPlayer extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <div>player</div>
  }
}


SelectionPlayer.propTypes = {
  item: T.object,
  answer: T.array,
  onChange: T.func.isRequired
}

SelectionPlayer.defaultProps = {
  answer: []
}
