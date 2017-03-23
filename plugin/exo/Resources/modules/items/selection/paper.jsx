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
          showScore={true}
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