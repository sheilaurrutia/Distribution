import React, {Component, PropTypes as T} from 'react'
import classes from 'classnames'
import {utils} from './utils'
import {Feedback} from '../../components/feedback-btn.jsx'
import {SolutionScore} from '../../components/score.jsx'
import cloneDeep from 'lodash/cloneDeep'

/**
 * utility method for building the selection array
 */
export function getReactAnswerSelections(item, answer, showScore, displayTrueAnswer = false) {
  const elements = item.mode === 'find' ? item.solutions: item.selections

  return cloneDeep(elements).map(selection => {
    selection.selectionId = selection.id || selection.selectionId

    return selection
  }).sort((a, b) => a.begin - b.begin)
    .map(element => {
      let elId = element.selectionId
      let userAnswer = null
      switch(item.mode) {
        case 'find': {
          userAnswer = answer.positions.find(a => a >= element.begin && a <= element.end)
          break
        }
        case 'select': {
          userAnswer = answer.indexOf(element.selectionId) >= 0 ? elId: null
          break
        }
        case 'highlight': {
          userAnswer = answer.find(answer => answer.selectionId === elId) || null
          break
        }
      }

      const solution = item.solutions.find(solution => solution.selectionId === elId)

      return {
        id: elId,
        begin: element.begin,
        end: element.end,
        component: (
          <SelectionAnswer
            id={elId}
            answer={userAnswer}
            solution={solution}
            showScore={showScore}
            displayTrueAnswer={displayTrueAnswer}
            text={utils.getSelectionText(item, elId)}
            mode={item.mode}
            colors={item.colors}
            penalty={item.penalty || 0}
          />
        )
      }
    })
}

export class SelectionAnswer extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    switch(this.props.mode) {
      case 'find': {
        return (<DisplayFindAnswer
          solution={this.props.solution}
          id={this.props.id}
          text={this.props.text}
          showScore={this.props.showScore}
          displayTrueAnswer={this.props.displayTrueAnswer}
          answer={this.props.answer}
          className={this.props.className}
          penalty={this.props.penalty}
        />)
      }
      case 'select': {
        return (<DisplaySelectAnswer
          solution={this.props.solution}
          text={this.props.text}
          className={this.props.className}
          showScore={this.props.showScore}
          displayTrueAnswer={this.props.displayTrueAnswer}
          answer={this.props.answer}
          id={this.props.solution.selectionId}
        />)
      }
      case 'highlight': {
        return (<DisplayHighlightAnswer
          solutions={this.props.solution.answers}
          text={this.props.text}
          className={this.props.className}
          showScore={this.props.showScore}
          displayTrueAnswer={this.props.displayTrueAnswer}
          answer={this.props.answer}
          colors={this.props.colors}
          id={this.props.solution.selectionId}
          penalty={this.props.penalty}
        />)
      }
    }
  }
}

SelectionAnswer.propTypes = {
  id: T.string.isRequired,
  answer: T.any,
  text: T.string.isRequired,
  mode: T.string.isRequired,
  className: T.string,
  showScore: T.bool.isRequired,
  penalty: T.number,
  displayTrueAnswer: T.bool.isRequired,
  colors: T.arrayOf(T.shape({
    id: T.string.isRequired,
    code: T.string.isRequired
  })),
  solution: T.oneOfType([
    T.shape({
      score: T.number.isRequired,
      feedback: T.string
    }),
    T.shape({
      selectionId: T.string.isRequired,
      answers: T.arrayOf(T.shape({
        score: T.number.isRequired,
        feedback: T.string
      }))
    })
  ])

}

const AnswerWarningIcon = props =>
  props.valid ?
    <span className="fa fa-check answer-warning-span" aria-hidden="true" /> :
    <span className="fa fa-times answer-warning-span" aria-hidden="true" />

AnswerWarningIcon.propTypes = {
  valid: T.bool.isRequired
}

const DisplayFindAnswer = props => {
  const cssClasses = {
    'selection-success': props.solution.score > 0 && props.answer,
    'selection-error': props.solution.score <= 0 && props.answer,
    'selection-info': props.displayTrueAnswer && props.solution.score > 0
  }

  return (
    <span className={classes(props.className, cssClasses)}>

      <span>{props.text}</span>

      {(props.showScore && props.answer)  &&
        <AnswerWarningIcon valid={!!props.solution.score } />
      }

      {props.solution && props.solution.feedback &&
        <Feedback
          id={`${props.id}-feedback`}
          feedback={props.solution.feedback}
        />
      }

      {props.showScore && props.answer &&
        <SolutionScore score={props.solution ? props.solution.score : 0} />
      }
    </span>
  )
}

const DisplaySelectAnswer = props => {

  const cssClasses = {
    'selection-success': props.solution.score > 0 && props.answer,
    'selection-error': props.solution.score <= 0 && props.answer,
    'selection-info': props.displayTrueAnswer && props.solution.score > 0
  }

  return (
    <span className={classes(props.className, cssClasses)}>
      <span>{props.text}</span>

      {props.showScore && props.answer &&
        <AnswerWarningIcon valid={!!props.solution.score} />
      }

      {props.solution && props.solution.feedback &&
        <Feedback
          id={`${props.id}-feedback`}
          feedback={props.solution.feedback}
        />
      }

      {props.showScore && props.answer &&
        <SolutionScore score={props.solution ? props.solution.score : 0} />
      }
    </span>
  )
}

class DisplayHighlightAnswer extends Component {
  constructor(props) {
    super(props)

    this.state = this.props.displayTrueAnswer ?
      {solution: this.props.solutions.filter(solution => solution.score > 0)[0]}:
      {solution:
        this.props.solutions.find(solution => solution.colorId === this.props.answer.colorId) ||
        Object.assign({}, this.props.answer, {score: -this.props.penalty })}
  }

  changeSolution(colorId) {
    this.setState({solution: this.props.solutions.find(solution => solution.colorId === colorId)})
  }

  render() {
    return (
      <span className={classes(this.props.className)}>

        {this.props.displayTrueAnswer &&
          <span>
            <span style={{backgroundColor: this.props.colors.find(color => color.id === this.state.solution.colorId).code}}>
              {this.props.text}
            </span>
            <select value={this.state.solution.colorId} className="select-highlight" onChange={(e) => this.changeSolution(e.target.value) }>
              {this.props.solutions.filter(solution => solution.score > 0).map(solution => {
                return (
                  <option key={Math.random()} value={solution.colorId} style={{backgroundColor: this.props.colors.find(color => color.id === solution.colorId).code}}>
                   {'\u00a0'}{'\u00a0'}{'\u00a0'}
                  </option>
                 )
              })}
            </select>
          </span>
        }

        {!this.props.displayTrueAnswer &&
          <span style={{backgroundColor: this.props.colors.find(color => color.id === this.state.solution.colorId).code}}>
            {this.props.text}
          </span>
        }

        {this.props.showScore && this.props.answer &&
          <AnswerWarningIcon valid={!!this.state.solution.score} />
        }

        {this.state.solution.feedback &&
          <Feedback
            id={`${this.props.id}-feedback`}
            feedback={this.state.solution.feedback}
          />
        }

        {this.props.showScore && this.props.answer &&
          <SolutionScore score={this.state.solution ? this.state.solution.score : this.props.penalty} />
        }
      </span>
    )
  }
}

DisplaySelectAnswer.propTypes = {
  id: T.string.isRequired,
  text: T.string.isRequired,
  answer: T.string,
  className: T.string,
  showScore: T.bool.isRequired,
  displayTrueAnswer: T.bool.isRequired,
  solution: T.shape({
    score: T.number.isRequired,
    feedback: T.string
  })
}

DisplayFindAnswer.propTypes = {
  id: T.string.isRequired,
  text: T.string.isRequired,
  answer: T.number,
  className: T.string,
  showScore: T.bool.isRequired,
  displayTrueAnswer: T.bool.isRequired,
  solution: T.shape({
    score: T.number.isRequired,
    feedback: T.string
  }),
  penalty: T.number.isRequired
}

DisplayHighlightAnswer.propTypes = {
  id: T.string.isRequired,
  text: T.string.isRequired,
  answer: T.shape({
    selectionId: T.string.isRequired,
    colorId: T.string.isRequired
  }),
  className: T.string,
  showScore: T.bool.isRequired,
  displayTrueAnswer: T.bool.isRequired,
  colors: T.arrayOf(T.shape({
    id: T.string.isRequired,
    code: T.string.isRequired
  })).isRequired,
  solutions: T.arrayOf(T.shape({
    score: T.number.isRequired,
    feedback: T.string
  })),
  penalty: T.number.isRequired
}
