import React, {PropTypes as T} from 'react'

export const SelectionFeedback = (/*props*/) => {
  return <div>Feedback</div>
}

SelectionFeedback.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    solutions: T.arrayOf(T.object)
  }).isRequired,
  answer: T.array.isRequired
}

SelectionFeedback.defaultProps = {
  answer: []
}
