import React, {PropTypes as T} from 'react'
import {Highlight} from './utils/highlight.jsx'


export const SelectionFeedback = (props) => {
  return (
    <Highlight
      item={props.item}
      showScore={false}
      answer={props.answer}
      displayTrueAnswer={false}
    />
  )
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
