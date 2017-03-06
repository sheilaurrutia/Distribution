import React, {Component, PropTypes as T} from 'react'
import {utils} from './utils/utils'
import cloneDeep from 'lodash/cloneDeep'

export class SelectionPlayer extends Component {
  constructor(props) {
    super(props)
    this.elements = this.props.item.mode === 'find' ? this.props.item.solutions : this.props.item.selections
  }

  getHtml() {
    return utils.makeTextHtml(
      this.props.item.text,
      this.elements,
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
          const index = answers.indexOf(selectionId);
          if (index > -1) answers.splice(index, 1);
        }
        break
      }
    }

    return answers
  }

  render() {
    return <div dangerouslySetInnerHTML={{__html: this.getHtml()}} />
  }

  componentDidMount() {
    //elements are selections if it's !find
    if (this.props.item.mode !== 'find') {
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
