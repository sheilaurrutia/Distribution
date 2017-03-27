import React, {Component, PropTypes as T} from 'react'
import {utils} from './utils/utils'
import cloneDeep from 'lodash/cloneDeep'
import {getOffsets} from '../../components/form/selection/selection'
import {tex} from './../../utils/translate'
import {getReactAnswerInputs} from './utils/selection-input.jsx'
import {SelectionText} from './utils/selection-text.jsx'

export class SelectionPlayer extends Component {
  constructor(props) {
    super(props)
  }

  onFindAnswer(begin = null, addTry = null) {
    const answers = cloneDeep(this.props.answer) || {positions:[], tries:0}

    if (begin) {
      answers.positions.push(begin)
    }
    //maybe this should be stored in the server
    if (addTry) {
      answers.tries++
    }

    this.props.onChange(answers)
  }

  onHighlightAnswer(selectionId, colorId) {
    const answers = cloneDeep(this.props.answer) || []
    const answer = answers.find(answer => answer.selectionId === selectionId)
    answer ? answer.colorId === colorId: answers.push({colorId,  selectionId})

    this.props.onChange(answers)
  }

  onSelectAnswer(selectionId, checked) {
    const answers = cloneDeep(this.props.answer) || []

    if (checked) {
      answers.push(selectionId)
    } else {
      const index = answers.indexOf(selectionId)
      if (index > -1) answers.splice(index, 1)
    }

    this.props.onChange(answers)
  }

  getOnAnswer() {
    switch (this.props.item.mode) {
      case 'select': return this.onSelectAnswer.bind(this)
      case 'highlight': return this.onHighlightAnswer.bind(this)
    }
  }

  render() {
    const leftTries = (this.props.item.tries || 0) - (this.props.answer ? this.props.answer.tries: 0)

    return (
      <div>
        {this.props.item.mode === 'find' && leftTries > 0 &&
          <div style={{textAlign:'center'}} className='select-tries'>{tex('left_tries')}: {leftTries}</div>
        }
        {this.props.item.mode === 'find' && leftTries <= 0 &&
          <div style={{textAlign:'center'}} className='selection-error'>{tex('no_try_left')}</div>
        }
        {this.props.item.mode !== 'find' &&
          <SelectionText
            id="selection-text-box"
            anchorPrefix="selection-element-yours"
            text={this.props.item.text}
            selections={getReactAnswerInputs(this.props.item, this.getOnAnswer(), this.answers)}
          />
        }
        {this.props.item.mode === 'find' &&
          <div id="selection-text-box" className="pointer" dangerouslySetInnerHTML={{__html: utils.makeFindHtml(
            this.props.item.text,
            this.props.answer && this.props.answer.positions ?
              this.props.item.solutions.filter(solution => this.props.answer.positions.find(ans => ans >= solution.begin && ans <= solution.end)): []
            )}}
          />
        }
      </div>
    )
  }

  componentDidMount() {
    if (this.props.item.mode === 'find') {
      document.getElementById('selection-text-box').addEventListener(
        'click',
        () => {
          let offsets = getOffsets(document.getElementById('selection-text-box'))
          const leftTries = (this.props.item.tries || 0) - (this.props.answer ? this.props.answer.tries: 0)
          if (leftTries > 0) {
            this.props.item.solutions.forEach(element => {
              if (offsets.start >= element.begin && offsets.end <= element.end) {
                this.onFindAnswer(offsets.start)
              }
            })
            this.onFindAnswer(null, true)
          }
        }
      )
    }
  }
}

SelectionPlayer.propTypes = {
  item: T.object,
  answer: T.oneOfType([
    T.array,
    T.shape({
      tries: T.number.isRequired,
      positions: T.arrayOf(
        T.number
      )
    })
  ]),
  onChange: T.func.isRequired
}
