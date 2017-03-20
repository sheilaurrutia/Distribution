import $ from 'jquery'
import cloneDeep from 'lodash/cloneDeep'
import React, {Component, PropTypes as T} from 'react'
import {tcex} from '../../../utils/translate'

export class Highlight extends Component {
  constructor(props) {
    super(props)

    if (props.displayTrueAnswer) {
      this.checkedElements = props.item.mode !== 'find' ? cloneDeep(this.props.item.selections): cloneDeep(this.props.item.solutions)
    } else {
      switch (props.item.mode) {
        case 'select': {
          this.checkedElements = this.props.item.selections.filter(selection => this.props.answer.indexOf(selection.id) > -1).map(selection => {
            const data = cloneDeep(selection)
            const solution = this.props.item.solutions.find(solution => solution.selectionId === selection.id)
            data.score = solution.score

            return data
          })
          break
        }
        case 'find': {
          this.checkedElements = this.props.item.solutions
            .filter(solution => {
              let found = false

              this.props.answer.positions.forEach(a => {
                if (a >= solution.begin && a <= solution.end) {
                  found = true
                }
              })

              return found
            })
          break
        }
        case 'highlight': {
          this.checkedElements = this.props.answer.map(answer => {
            const solution = this.props.item.solutions.find(solution => solution.selectionId === answer.selectionId)
            const data = cloneDeep(solution.answers.find(realAnswer => realAnswer.colorId === answer.colorId))
            const selection = this.props.item.selections.find(selection => selection.id === solution.selectionId)
            data.begin = selection.begin
            data.end = selection.end

            return data
          })
        }
      }
    }

    //checked elements returns data related to the answer a user checked.
    //It'll include the score, the feedback, the positions, the colors and whatever is usefull
    this.checkedElements.sort((a, b) => {return a.begin - b.begin})
  }

  render() {
    return (<div dangerouslySetInnerHTML={{__html: this.getHtml()}}/>)
  }

  isSolutionValid(selection) {
    return selection.score !== undefined ? selection.score: this.getSolutionForAnswer(selection).score
  }

  getSolutionForAnswer(selection) {
    return selection.score !== undefined ? selection: this.props.item.solutions.find(solution => solution.selectionId === selection.id)
  }

  //copied from the clozes
  getWarningIcon(selection) {
    const solution = this.getSolutionForAnswer(selection)

    return solution && solution.score > 0 ?
      `<span class="fa fa-check answer-warning-span ${this.getSpanClasses(true)}" aria-hidden="true"></span>` :
      `<span class="fa fa-times answer-warning-span ${this.getSpanClasses(false)}" aria-hidden="true"></span>`
  }

  getSolutionScore(solution) {
    if (solution.score) {
      const scoreTranslation = tcex('solution_score', solution.score, {'score': solution.score})

      return `<span class="item-score"> ${scoreTranslation} </span>`
    }

    return ''
  }

  getSelectHighlights(selection) {
    const solution = this.getSolutionForAnswer(selection)

    let options = '<option disabled selected value> -- select a color -- </option>'
    solution.answers.filter(answer => answer.score > 0).forEach(answer => {
      let color = this.props.item.colors.find(color => color.id === answer.colorId)
      options += `<option value="${answer.colorId}" style="background-color: ${color.code}"></option>`
    })

    return `<select data-selection-id="${solution.selectionId}" id="select-highlight-${solution.selectionId}" class="select-highlight">${options}</select><span id="span-answer-${solution.selectionId}-true"></span>`
  }

  getFeedback(solution) {
    solution = this.getSolutionForAnswer(solution)
    let feedback = solution.feedback
    if (!feedback) return ''

    return `<i role="button" class="feedback-btn fa fa-comments-o" data-content="${feedback}" data-toggle="popover" data-trigger="click" data-html="true"></i>`
  }

  getSpanClasses(isSolutionValid) {
    if (isSolutionValid && !this.props.displayTrueAnswer) return 'selection-success'
    if (!isSolutionValid && !this.props.displayTrueAnswer) return 'selection-error'
    if (this.props.displayTrueAnswer) return 'selection-info'
  }

  getFirstSpan(element, displayTrueAnswer, isSolutionValid) {
    if (element.colorId) {
      const color = this.props.item.colors.find(color => color.id === element.colorId)

      return `<span data-id=${element.selectionId} style="background-color: ${color.code}">`
    }

    return `<span data-id=${element.id} class="${this.getSpanClasses(isSolutionValid)}">`
  }

  getHtmlLength(solution, displayTrueAnswer, isSolutionValid) {
    let text = this.getFirstSpan(solution, displayTrueAnswer, isSolutionValid)
      + '</span>'

    if (this.props.showScore) {
      text += this.getSolutionScore(solution) + this.getFeedback(solution)
    }

    if (this.props.item.mode === 'highlight' && this.props.displayTrueAnswer) {
      text += this.getSelectHighlights(solution)
    } else {
      text += this.getWarningIcon(solution)
    }

    return text.length
  }

  getHtml() {
    let idx = 0
    let text = this.props.item.text

    this.checkedElements.forEach(solution => {
      let isSolutionValid = this.props.displayTrueAnswer ? true: this.isSolutionValid(solution)
      let end = text.slice(solution.end + idx)
      text = text.slice(0, solution.begin + idx)
      + this.getFirstSpan(solution, this.props.displayTrueAnswer, isSolutionValid)
      + text.slice(solution.begin + idx, solution.end + idx)
      text += '</span>'
      if (this.props.item.mode === 'highlight' && this.props.displayTrueAnswer) {
        text += this.getSelectHighlights(solution)
      } else {
        text += this.getWarningIcon(solution)
      }

      if (this.props.showScore) {
        text += this.getSolutionScore(solution) + this.getFeedback(solution)
      }

      text += end

      idx += this.getHtmlLength(solution, this.props.displayTrueAnswer, isSolutionValid) //+ 1 //+1 is wtf, maybe an error is lurking somewhere but the positions seems to be good
    })

    return text
  }

  //POPOVER AND HIGHLIGHT MODE CHANGE DETECTION
  componentDidMount() {
    $('[data-toggle="popover"]').popover()

    if (this.props.item.mode === 'highlight') {
      this.props.item.selections.forEach(el => {
        let htmlElement = document.getElementById(`select-highlight-${el.id}`)
        if (htmlElement) {
          //check the class (add or remove)
          htmlElement.addEventListener(
            'change',
            e => {
              const el = e.target
              const colorId = el.value
              const selectionId = el.getAttribute('data-selection-id')
              const color = this.props.item.colors.find(color => color.id === colorId)
              // htmlElement.style.backgroundColor = color.code
              document.getElementById(`select-highlight-${selectionId}`).style.backgroundColor = color.code
              const answer = this.props.item.solutions.find(solution => solution.selectionId === selectionId).answers.find(answer => answer.colorId === colorId)
              this.updateSelectionInfo(selectionId, answer)
            }
          )
        }
      })
    }
  }

  //REQUIRED FOR HIGHLIGHT MODE ONLY
  updateSelectionInfo(selectionId, answer) {
    let span = `
      <span id="span-answer-${selectionId}-true" class="${this.getSpanClasses(true)}">
        ${this.getWarningIcon(answer)}
        ${this.getSolutionScore(answer)}
        ${this.getFeedback(answer)}
      </span>
    `

    var div = document.createElement('div')
    div.innerHTML = span
    span = div.firstChild.nextSibling
    const toReplace = document.getElementById(`span-answer-${selectionId}-true`)
    toReplace.replaceWith(span)
    $('[data-toggle="popover"]').popover()
  }
}

Highlight.propTypes = {
  displayTrueAnswer: T.bool.isRequired,
  answer: T.oneOfType([
    T.array,
    T.shape({
      tries: T.number.isRequired,
      positions: T.arrayOf(
        T.number
      )
    })
  ]),
  showScore: T.bool.isRequired,
  item: T.shape({
    text: T.string.isRequired,
    colors: T.arrayOf(T.shape({
      id: T.string.isRequired,
      code: T.string.isRequired
    })),
    mode: T.string.isRequired,
    id: T.string.isRequired,
    solutions: T.arrayOf(T.shape({
      selectionId: T.string.isRequired
    })),
    selections: T.arrayOf(T.shape({
      id: T.string.isRequired
    }))
  })
}
