import React, {PropTypes as T} from 'react'
import {PaperTabs} from '../components/paper-tabs.jsx'
import {SelectionText} from './utils/selection-text.jsx'
import {getReactAnswerSelections} from './utils/selection-answer.jsx'

export const SelectionPaper = (props) => {
  return (
    <PaperTabs
      item={props.item}
      answer={props.answer}
      id={props.item.id}
      yours={
        <SelectionText
          anchorPrefix="selection-element-yours"
          text={props.item.text}
          selections={getReactAnswerSelections(props.item, props.answer, true, false)}
        />
      }
      expected={
        <SelectionText
          anchorPrefix="selection-element-expected"
          text={props.item.text}
          selections={getReactAnswerSelections(props.item, props.answer, true, true)}
        />
      }
    />
  )
}

SelectionPaper.propTypes = {
  item: T.shape({
    text: T.string.isRequired,
    mode: T.string.isRequired,
    selections: T.arrayOf(T.shape({})),
    id: T.string.isRequired,
    title: T.string.isRequired,
    description: T.string.isRequired,
    solutions: T.arrayOf(T.shape({}))
  }).isRequired,
  answer: T.oneOfType([
    T.array,
    T.shape({
      tries: T.number.isRequired,
      positions: T.arrayOf(
        T.number
      )
    })
  ]).isRequired
}

SelectionPaper.defaultProps = {
  answer: []
}
