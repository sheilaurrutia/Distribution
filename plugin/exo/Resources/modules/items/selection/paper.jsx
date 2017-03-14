import React, {PropTypes as T} from 'react'
import {PaperTabs} from '../components/paper-tabs.jsx'
import {Highlight} from './utils/highlight.jsx'


export const SelectionPaper = (props) => {
  return (
    <PaperTabs
      item={props.item}
      answer={props.answer}
      id={props.item.id}
      yours={
        <Highlight
          item={props.item}
          answer={props.answer}
          showScore={false}
          displayTrueAnswer={false}
        />
      }
      expected={
        <Highlight
          item={props.item}
          answer={props.answer}
          showScore={true}
          displayTrueAnswer={true}
        />
      }
    />
  )
}

SelectionPaper.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    title: T.string.isRequired,
    description: T.string.isRequired,
    solutions: T.arrayOf(T.object)
  }).isRequired,
  answer: T.array.isRequired
}

SelectionPaper.defaultProps = {
  answer: []
}
