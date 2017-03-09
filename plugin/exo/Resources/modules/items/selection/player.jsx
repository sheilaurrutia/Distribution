import React, {Component, PropTypes as T} from 'react'
import {utils} from './utils/utils'
import cloneDeep from 'lodash/cloneDeep'
import {getOffsets} from '../../components/form/selection/selection'

export class SelectionPlayer extends Component {
  constructor(props) {
    super(props)
    this.elements = this.props.item.mode === 'find' ? this.props.item.solutions : this.props.item.selections
    this.checkedElements = []
    this._leftTries = this.props.item.tries
  }

  getHtml() {


    return this.props.item.mode !== 'find' ?
      utils.makeTextHtml(this.props.item.text, this.elements, 'select'):
      utils.makeTextHtml(this.props.item.text, this.elements.filter(element => this.props.answer.find(ans =>  ans > element.begin && ans < element.end)), 'select')
  }

  onAnswer(options = {}) {
    const answers = cloneDeep(this.props.answer)
    console.log(options)

    switch (options.mode) {
      case 'select': {
        let selectionId = options.selectionId
        let checked = options.checked
        if (checked) {
          answers.push(selectionId)
        } else {
          const index = answers.indexOf(selectionId);
          if (index > -1) answers.splice(index, 1);
        }
        break
      }
      case 'find': {
        answers.push(options.begin)
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
      <div id="selection-text-box" dangerouslySetInnerHTML={{__html: this.getHtml()}} />
    </div>
  }

  componentDidMount() {
    switch (this.props.item.mode) {
      case 'select': {
        this.elements.forEach((el, key) => {
          let htmlElement = document.getElementById('selection-' + el.id)
          if (htmlElement) {
            //check the class (add or remove)
            htmlElement.addEventListener(
              'click',
              e => {
                const el = e.target
                const check = !el.classList.contains('checked-selection')
                const selectionId = el.getAttribute('data-id')

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
          e => {
            let offsets = getOffsets(document.getElementById('selection-text-box'))
            console.log(offsets)
            console.log(this.elements)
            console.log(document.getElementById('selection-text-box').textContent)
            console.log(document.getElementById('selection-text-box').innerHTML)
            //this._leftTries--
            //if (this._leftTries > 0) {
              this.elements.forEach(element => {
                if (offsets.start >= element.begin && offsets.end <= element.end) {
                  alert('found')
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
