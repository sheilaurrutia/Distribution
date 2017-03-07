import {tex} from './../../../utils/translate'
import $ from 'jquery'
import cloneDeep from 'lodash/cloneDeep'
import React, {Component, PropTypes as T} from 'react'

//copied from the clozes
function getWarningIcon(solution, answer) {
  solution = utils.getSolutionForAnswer(solution, answer)

  return solution && solution.score > 0 ?
     '<span class="fa fa-check answer-warning-span" aria-hidden="true"></span>' :
     '<span class="fa fa-times answer-warning-span" aria-hidden="true"></span>'
}

function getSolutionScore(score) {
  const scoreTranslation = tcex('solution_score', score, {'score': score})

  return `<span class="item-score"> ${scoreTranslation} </span>`
}

function getFeedback(feedback) {
  if (!feedback) return ' '

  return `
    <i
      role="button"
      class="feedback-btn fa fa-comments-o"
      data-content="${feedback}"
      data-toggle="popover"
      data-trigger="click"
      data-html="true"
    >
    </i>
  `
}

function getSelectClasses(displayTrueAnswer, isSolutionValid) {
  const inputClasses = ['form-control', 'inline-select']
  if (displayTrueAnswer) inputClasses.push('select-info')
  if (isSolutionValid && !displayTrueAnswer) inputClasses.push('select-success')
  if (!isSolutionValid && !displayTrueAnswer) inputClasses.push('select-error')

  return inputClasses.reduce((a, b) => a += ' ' + b)
}

function getSpanClasses(displayTrueAnswer, isSolutionValid) {
  const classes = []
  if (isSolutionValid && !displayTrueAnswer) classes.push('score-success')
  if (!isSolutionValid && !displayTrueAnswer) classes.push('score-error')
  if (displayTrueAnswer) classes.push('score-info')

  return classes.reduce((a, b) => a += ' ' + b)
}

function makeTextHtml(text, elements, displayTrueAnswer, isSolutionValid) {

}

function getFirstSpan(selection, displayTrueAnswer, isSolutionValid) {
  return `<span data-id=${selection.id} id="selection-${selection.id}" class="span-selection">`
}

function getHtmlLength(solution, displayTrueAnswer, isSolutionValid) {
  return getFirstSpan(solution, displayTrueAnswer, isSolutionValid).length
}

export class Highlight extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (<div dangerouslySetInnerHTML={{__html: this.getHtml()}}/>)
  }

  getHtml() {
    const elements = cloneDeep(this.props.item.selections)
    let idx = 0
    elements.sort((a, b) => {return a.begin - b.begin})
    let text = this.props.item.text

    elements.forEach(solution => {
       text = text.slice(0, solution.begin + idx)
       + getFirstSpan(solution, this.props.displayTrueAnswer, this.props.isSolutionValid)
       + text.slice(solution.begin + idx, solution.end + idx)
       + text.slice(solution.end + idx)

       idx += getHtmlLength(solution, this.props.displayTrueAnswer, this.props.isSolutionValid) //+ 1 //+1 is wtf, maybe an error is lurking somewhere but the positions seems to be good

     })

    return text
  }

  componentDidMount() {
    /*
    this.elements.forEach(el => {
      let htmlElement = document.getElementById('select-' + el.holeId + '-true')
      if (htmlElement) {
        htmlElement.addEventListener(
          'change',
          e => this.updateHoleInfo(el.holeId, e.target.value)
        )
      }
    })
    $('[data-toggle="popover"]').popover()*/
  }
}
