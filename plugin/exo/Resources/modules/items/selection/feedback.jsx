import React, {PropTypes as T} from 'react'
import {SelectionText} from './utils/selection-text.jsx'
import {getReactAnswerSelections} from './utils/selection-answer.jsx'

export const SelectionFeedback = (props) => {
  const elements = props.item.mode === 'find' ? props.item.solutions: props.item.selections

  return (<SelectionText
     anchorPrefix="selection-element-feedback"
     className="selection-feedback"
     text={props.item.text}
     elements={elements}
     selections={getReactAnswerSelections(props.item, props.answer, false)}
  />)
}

SelectionFeedback.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    mode: T.string.isRequired,
    text: T.string.isRequired,
    solutions: T.arrayOf(T.object),
    selections: T.arrayOf(T.object)
  }).isRequired,
  answer: T.array.isRequired
}

SelectionFeedback.defaultProps = {
  answer: []
}
