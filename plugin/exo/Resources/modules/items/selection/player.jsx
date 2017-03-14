import React, {Component, PropTypes as T} from 'react'
import {utils} from './utils/utils'
import cloneDeep from 'lodash/cloneDeep'
import {getOffsets} from '../../components/form/selection/selection'
import classes from 'classnames'

export class SelectionPlayer extends Component {
  constructor(props) {
    super(props)
    this.elements = this.props.item.mode === 'find' ? this.props.item.solutions : this.props.item.selections
    this.checkedElements = []
    this._leftTries = this.props.item.tries
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
        this.elements.filter(element => this.props.answer.find(ans => ans >= element.begin && ans <= element.end)),
        'select'
      )
  }

  onAnswer(options = {}) {
    const answers = cloneDeep(this.props.answer)
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
        answers.push(options.begin)
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
    return <div>
      {this.props.item.mode === 'find' &&
        <div className='select-tries'>Tries: {this._leftTries}</div>
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
            //this._leftTries--
            //if (this._leftTries > 0) {
            this.elements.forEach(element => {
              if (offsets.start >= element.begin && offsets.end <= element.end) {
                this.props.onChange(this.onAnswer({
                  mode: this.props.item.mode,
                  selectionId: element.selectionId,
                  begin: offsets.start,
                  end: offsets.end
                }))
              }
            })
            //}
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
  answer: T.array,
  onChange: T.func.isRequired
}

SelectionPlayer.defaultProps = {
  answer: []
}
