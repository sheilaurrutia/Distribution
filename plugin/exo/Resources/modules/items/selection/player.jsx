import React, {Component, PropTypes as T} from 'react'
import {utils} from './utils/utils'
import cloneDeep from 'lodash/cloneDeep'
import {getOffsets} from '../../components/form/selection/selection'
import classes from 'classnames'
import {tex} from './../../utils/translate'

export class SelectionPlayer extends Component {
  constructor(props) {
    super(props)
    this.elements = this.props.item.mode === 'find' ? this.props.item.solutions : this.props.item.selections
    this.checkedElements = []
    const answers = cloneDeep(this.props.answer)
    this.answers = answers || this.props.item.mode === 'find' ? {positions:[], tries:0}: []
  }

  getHtml() {
    const elements = cloneDeep(this.elements)

    if (this.props.item.mode === 'highlight') {
      elements.forEach(element => {
        element._answers = this.props.item.solutions.find(solution => solution.selectionId === element.id).answers
      })
    }

    return this.props.item.mode !== 'find' ?
      utils.makeTextHtml(this.props.item.text, elements, this.props.item.mode, this.props.item.colors ? this.props.item.colors: []):
      utils.makeTextHtml(
        this.props.item.text,
        this.elements.filter(element => this.answers.positions.find(ans => ans >= element.begin && ans <= element.end)),
        'select'
      )
  }

  onAnswer(options = {}) {
    this.answers = cloneDeep(this.answers)
    const answers = this.answers

    switch (options.mode) {
      case 'select': {
        let selectionId = options.selectionId
        let checked = options.checked
        if (checked) {
          answers.push(selectionId)
        } else {
          const index = answers.indexOf(selectionId)
          if (index > -1) answers.splice(index, 1)
        }
        break
      }
      case 'find': {
        if (options.begin) {
          answers.positions.push(options.begin)
        }
        //maybe this should be stored in the server
        answers.tries++
        break
      }
      case 'highlight': {
        const answer = answers.find(answer => answer.selectionId === options.selectionId)
        if (answer) {
          answer.colorId = options.colorId
        } else {
          answers.push({
            colorId: options.colorId,
            selectionId: options.selectionId
          })
        }
        break
      }
    }

    return answers
  }

  render() {
    const leftTries = (this.props.item.tries || 0) - (this.props.answer ? this.props.answer.tries: 0)
    return <div>
      {this.props.item.mode === 'find' && leftTries > 0 &&
        <div style={{textAlign:'center'}} className='select-tries'>{tex('left_tries')}: {leftTries}</div>
      }
      {this.props.item.mode === 'find' && leftTries <= 0 &&
        <div style={{textAlign:'center'}} className='selection-error'>{tex('no_try_left')}</div>
      }
      <div
        id="selection-text-box"
        className={classes({'pointer-hand': this.props.item.mode === 'find'})}
        dangerouslySetInnerHTML={{__html: this.getHtml()}}
      />
    </div>
  }

  componentDidMount() {
    switch (this.props.item.mode) {
      case 'select': {
        this.elements.forEach(el => {
          let htmlElement = document.getElementById('selection-' + el.id)
          if (htmlElement) {
            //check the class (add or remove)
            htmlElement.addEventListener(
              'click',
              e => {
                const el = e.target
                const check = !el.classList.contains('checked-selection')
                const selectionId = el.getAttribute('data-selection-id')

                check ? el.classList.add('checked-selection'): el.classList.remove('checked-selection')
                this.props.onChange(this.onAnswer({
                  mode: this.props.item.mode,
                  selectionId,
                  checked: check
                }))
              }
            )
          }
        })
        break
      }
      case 'find': {
        document.getElementById('selection-text-box').addEventListener(
          'click',
          () => {
            let offsets = getOffsets(document.getElementById('selection-text-box'))
            const leftTries = (this.props.item.tries || 0) - (this.props.answer ? this.props.answer.tries: 0)
            if (leftTries > 0) {
              this.elements.forEach(element => {
                if (offsets.start >= element.begin && offsets.end <= element.end) {
                  this.props.onChange(this.onAnswer({
                    mode: this.props.item.mode,
                    selectionId: element.selectionId,
                    begin: offsets.start,
                    end: offsets.end
                  }))
                } else {
                  this.props.onChange(this.onAnswer({
                    mode: this.props.item.mode
                  }))
                }
              })
            }
          }
        )
        break
      }
      case 'highlight': {
        this.elements.forEach(el => {
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
                document.getElementById(`selection-${selectionId}`).style.backgroundColor = color.code

                this.props.onChange(this.onAnswer({
                  mode: this.props.item.mode,
                  selectionId,
                  colorId
                }))
              }
            )
          }
        })
        break
      }
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
