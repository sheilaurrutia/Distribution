import React, {Component, PropTypes as T} from 'react'

import {FormGroup} from './../../components/form/form-group.jsx'
import classes from 'classnames'
import {t, tex} from './../../utils/translate'
import {Textarea} from './../../components/form/textarea.jsx'
import {Radios} from './../../components/form/radios.jsx'
import {ColorPicker} from './../../components/form/color-picker.jsx'
import Popover from 'react-bootstrap/lib/Popover'
import {actions} from './editor'
import {TooltipButton} from './../../components/form/tooltip-button.jsx'
import {utils} from './utils/utils'

class ChoiceItem extends Component {
  constructor(props) {
    super(props)
    this.state = {showFeedback: false}
    this.selectionId = this.props.selection ? this.props.selection.id: this.props.solution.selectionId
  }

  render() {
    return (
      <div className={classes(
          'choice-item-selection',
          {'positive-score': this.props.score > 0},
          {'negative-score': this.props.score <= 0}
        )
      }>
        <div className='row'>
          <div className="col-xs-4">
            <input
              className="form-control choice-form"
              type="number"
              value={this.props.score}
              onChange={e => this.props.onChange(
                actions.updateSelection(parseInt(e.target.value), this.selectionId, 'score')
              )}
            />
          </div>
          <div className="col-xs-3">
            <TooltipButton
              id={`choice-${this.props.id}-feedback-toggle`}
              className="fa fa-comments-o"
              title={tex('choice_feedback_info')}
              onClick={() => this.setState({showFeedback: !this.state.showFeedback})}
            />
          {this.props.item.mode === 'highlight' &&
              <TooltipButton
                id={`answer-${this.props.id}-delete`}
                className="fa fa-trash-o"
                title={t('delete')}
              />
            }
          </div>
        </div>
        {this.state.showFeedback &&
          <div className="feedback-container selection-form-row">
            <Textarea
              id={`choice-${this.props.id}-feedback`}
              title={tex('feedback')}
              onChange={text => this.props.onChange(
                actions.updateSelection(text, this.selectionId, 'feedback')
              )}
              content={this.props.solution.feedback}
            />
          </div>
          }
      </div>
    )
  }
}

ChoiceItem.defaultProps = {
  answer: {
    feedback: ''
  },
  score: 0
}

ChoiceItem.propTypes = {
  score: T.number.isRequired,
  onChange: T.func.isRequired
}

class SelectionForm extends Component {
  constructor(props) {
    super(props)
    this.state = {showFeedback: false}

    this.offsetTop = window.scrollY + window.innerHeight / 2 - (420/2)
    this.offsetLeft = window.scrollX + window.innerWidth / 2 - (420/2)
  }

  getSelection() {
    return this.props.item.selections.find(selection => selection.id === this.props.item._selectionId)
  }

  getSolution() {
    return this.props.item.solutions.find(solution => solution.selectionId === this.props.item._selectionId)
  }

  closePopover() {
    this.props.onChange(actions.closePopover())
  }

  removeAndClose() {
    this.props.onChange(actions.removeSelection(this.props.item._selectionId))
    this.closePopover()
  }

  render() {
    return (
      <Popover
        bsClass="hole-form-content"
        id={this.props.item._selectionId}
        placement="right"
        positionLeft={this.offsetLeft}
        positionTop={this.offsetTop}
      >
        <div className="panel-default">
          <div className="panel-body pull-right close-popover hole-form-row">
            <i onClick={this.removeAndClose.bind(this)} className="fa fa-trash-o"></i>
            {'\u00a0'}
            {!this.props._errors.answers &&
              <b onClick={this.closePopover.bind(this)}>x</b>
            }
          </div>
        </div>
        <div className="panel-body">
          {(this.props.item.mode === 'select' || this.props.item.mode === 'find') &&
            <ChoiceItem
              score={this.getSolution().score}
              selection={this.getSelection()}
              solution={this.getSolution()}
              item={this.props.item}
              onChange={this.props.onChange}
            />
          }
          {this.state.showFeedback &&
            <div className="feedback-container selection-form-row">
              <Textarea
                id={`choice-${this.props.item._selectionId}-feedback`}
                title={tex('feedback')}
                onChange={text => this.props.onChange(
                  actions.updateAnswer(this.props.item._selectionId, 'feedback', text)
                )}
              />
            </div>
          }
          <div className="selection-form-row">
            {this.props.item.mode === 'highlight' &&
              <button
                className="btn btn-default"
                onClick={() => this.props.onChange(
                  actions.addAnswer(this.props.item._selectionId))}
                type="button"
              >
                <i className="fa fa-plus"/>
                {tex('color')}
              </button>
            }
          </div>
        </div>
      </Popover>
    )
  }
}

SelectionForm.propTypes = {/*
  item: T.shape.object,
  onChange: T.func.isRequired,
  validating: T.bool.isRequired,
  _errors: T.object*/
}

class ColorElement extends Component {
  render() {
    return (
      <div>
        <span>{tex('color')} {this.props.index}</span>
        <ColorPicker color={this.props.color.code}
          onPick={(e) => {this.props.onChange(actions.editColor(this.props.color.id, e.hex))}}>
        </ColorPicker>
      </div>
    )
  }
}

ColorElement.propTypes = {/*
  index: T.number.isRequired,
  color: T.object.isRequired,
  onChange: T.func.isRequired,
  _errors: T.object*/
}

export class Selection extends Component {
  constructor(props) {
    super(props)
    this.begin = null
    this.end = null
    this.onSelect = this.onSelect.bind(this)
    this.updateText = this.updateText.bind(this)
    this.addSelection = this.addSelection.bind(this)
    console.log(props.item.tries)
  }

  updateText() {
    utils.makeTextHtml(this.props.item._text, this.props.item.solutions)
  }

  onSelect(selected, cb, offsets) {
    if (offsets) {
      this.begin = offsets.trueStart
      this.end = offsets.trueEnd
    }
  }

  addSelection() {
    this.props.onChange(actions.addSelection(this.begin, this.end))
  }

  onSelectionClick(el) {
    if (el.classList.contains('edit-selection-btn')) {
      this.props.onChange(actions.openSelection(el.dataset.selectionId))
    } else {
      if (el.classList.contains('delete-selection-btn')) {
        this.props.onChange(actions.removeSelection(el.dataset.selectionId))
      }
    }
  }

  render() {
    return(
      <div>
        <div>
          <Radios
            groupName="mode-group"
            options={[
              {value: 'select', label: tex('visible')},
              {value: 'find', label: tex('invisible')},
              {value: 'highlight', label: tex('highlight')}
            ]}
            checkedValue={this.props.item.mode}
            inline={true}
            onChange={value => this.props.onChange(actions.updateQuestion(value, 'mode', {}))}
          >
          </Radios>
          {this.props.item.mode === 'find' &&
            <input
               type="number"
               onChange={e => this.props.onChange(actions.updateQuestion(parseInt(e.target.value), 'tries', {}))}
               value={this.props.item.tries}
             />
          }
          {this.props.item.mode === 'highlight' &&
            <div>
              <FormGroup
                controlId="selection-default-penalty"
                label={t('global_penalty')}
                warnOnly={!this.props.validating}
              >
              <input
                 className="form-control"
                 type="number"
                 onChange={e => this.props.onChange(actions.updateQuestion(parseInt(e.target.value), 'penalty'))}
                 value={this.props.item.penalty}
               />
              </FormGroup>
              <div>{tex('possible_color_choices')}</div>
              {
                this.props.item.colors.map((color, index) => {
                  return (<ColorElement key={'color' + index} index={index} color={color} onChange={this.props.onChange}/>)
                })
              }
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={() => this.props.onChange(actions.addColor())}
                >
                  <i className="fa fa-plus"/>{tex('add_color')}
                </button>
            </div>
          }
          <Textarea
            id={this.props.item.id}
            onSelect={this.onSelect}
            onChange={(text, offsets) => this.props.onChange(actions.updateQuestion(text, 'text', offsets))}
            onClick={this.onSelectionClick.bind(this)}
            content={this.props.item._text}
            updateText={this.updateText}
          />
          <button
            type="button"
            className="btn btn-default"
            onClick={() => this.props.onChange(this.addSelection())}><i className="fa fa-plus"/>
            {tex('create_answer_zone')}
          </button>
          {this.props.item._selectionPopover &&
            <div>
              <SelectionForm
                item={this.props.item}
                onChange={this.props.onChange}
                validating={this.props.validating}
                _errors={this.props.item._errors}
              />
            </div>
          }
        </div>
      </div>
    )
  }
}

Selection.propTypes = {
  item: T.object,
  onChange: T.func.isRequired,
  validating: T.bool.isRequired
}
