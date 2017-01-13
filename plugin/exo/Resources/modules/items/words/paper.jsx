import React, {PropTypes as T} from 'react'
import {Highlight} from './utils/highlight.jsx'
import {utils} from './utils/utils'
import {Feedback} from '../components/feedback-btn.jsx'
import {SolutionScore} from '../components/score.jsx'
import {PaperTabs} from '../components/paper-tabs.jsx'
import classes from 'classnames'

const AnswerTable = (props) => {
  return(
    <div className="word-paper">
      {props.answers.map(el =>
        <div
          key={el.word}
          className={classes(
            'item',
            {
              'bg-info text-info': el.score > 0
            }
        )}>
          <span className="word-label">{el.word}</span>
          <Feedback
            id={`${el.word}-feedback`}
            feedback={el.feedback}
          />
          <SolutionScore score={el.score}/>
        </div>
      )}
    </div>
  )
}

AnswerTable.propTypes = {
  answers: T.arrayOf(T.shape({
    feedback: T.string,
    word: T.string.isRequired,
    score: T.number.isRequired
  }))
}

export const WordsPaper = (props) => {
  const textElements = utils.getTextElements(props.answer, props.item.solutions)
  var halfLength = Math.ceil(textElements.length / 2)
  var leftSide = textElements.splice(0, halfLength)
  var rightSide = textElements

  return (
    <PaperTabs
      item={props.item}
      answer={props.answer}
      yours={
        <Highlight
          text={props.answer}
          solutions={props.item.solutions}
          showScore={true}
        />
      }
      expected={
        <div>
          <div className="col-md-6">
            <AnswerTable answers={leftSide}/>
          </div>
          <div className="col-md-6">
            <AnswerTable answers={rightSide}/>
          </div>
        </div>
      }
    />
  )
}

WordsPaper.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    title: T.string.isRequired,
    description: T.string.isRequired,
    solutions: T.arrayOf(T.object)
  }).isRequired,
  answer: T.string.isRequired
}
