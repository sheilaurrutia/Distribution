import React, {Component, PropTypes as T} from 'react'

import {FormGroup} from './../../components/form/form-group.jsx'
import classes from 'classnames'
import {t, tex} from './../../utils/translate'
import {Textarea, ProseMirrorEditor} from './../../components/form/textarea.jsx'
import {Radios} from './../../components/form/radios.jsx'
import {ColorPicker} from './../../components/form/color-picker.jsx'
import Popover from 'react-bootstrap/lib/Popover'
import {actions} from './editor'
import {TooltipButton} from './../../components/form/tooltip-button.jsx'

class ChoiceItem extends Component {
  constructor(props) {
    super(props)
    this.state = {showFeedback: false}
  }

  render() {
    return (
      <div className={classes(
          'choice-item-selection',
          {'positive-score': this.props.answer.score > 0},
          {'negative-score': this.props.answer.score <= 0}
        )
      }>
        <div className='row'>
          <div className="col-xs-4">
            <input
              className="form-control choice-form"
              type="number"
              value={this.props.answer.score}
              onChange={e => this.props.onChange(
                actions.updateAnswer(
                  this.props.selection.id,
                  'score',
                  parseInt(e.target.value)
                )
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
            <TooltipButton
              id={`answer-${this.props.id}-delete`}
              className="fa fa-trash-o"
              title={t('delete')}
              onClick={() => this.props.onChange(
                actions.removeAnswer(this.props.answer.text, this.props.answer.caseSensitive)
              )}
            />
          </div>
        </div>
        {this.state.showFeedback &&
          <div className="feedback-container selection-form-row">
            <Textarea
              id={`choice-${this.props.id}-feedback`}
              title={tex('feedback')}
              content={this.props.answer.feedback}
              onChange={text => this.props.onChange(
                actions.updateAnswer(
                  this.props.selection.id,
                  'feedback',
                  text
                )
              )}
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
  }
}

ChoiceItem.propTypes = {
  answer: T.shape({
    score: T.number,
    feedback: T.string,
    text: T.string,
    caseSensitive: T.bool
  }).isRequired,
  selection: T.shape({
    id: T.string.isRequired
  }).isRequired,
  id: T.number.isRequired,
  deletable: T.bool.isRequired,
  onChange: T.func.isRequired,
  validating: T.bool.isRequired,
  _errors: T.object
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

  closePopover() {
    this.props.onChange(actions.closePopover())
  }

  removeAndClose() {
    this.props.onChange(actions.removeSelection(this.getSelection().id))
    this.closePopover()
  }

  render() {
    return (
      <Popover
        bsClass="hole-form-content"
        id={this.getSelection().id}
        placement="right"
        positionLeft={this.offsetLeft}
        positionTop={this.offsetTop}
      >
        <div className="panel-default">
          <div className="panel-body pull-right close-popover selection-form-row">
            <i onClick={this.removeAndClose.bind(this)} className="fa fa-trash-o"></i>
            {'\u00a0'}
            {!this.props._errors.answers &&
              <b onClick={this.closePopover.bind(this)}>x</b>
            }
          </div>
          <div className="panel-body">
            {this.props.item.solutions.find(solution => solution.selectionId === this.getSelection().id).answers.map((answer, index) => {
              return (<ChoiceItem
                key={index}
                id={index}
                score={answer.score}
                feedback={answer.feedback}
                deletable={index > 0}
                onChange={this.props.onChange}
                selection={this.getSelection()}
                answer={answer}
                validating={this.props.validating}
                _errors={this.props._errors}
              />)
            })}

            {this.state.showFeedback &&
              <div className="feedback-container selection-form-row">
                <Textarea
                  id={`choice-${this.getSelection().id}-feedback`}
                  title={tex('feedback')}
                  onChange={text => this.props.onChange(
                    actions.updateAnswer(this.getSelection().id, 'feedback', text)
                  )}
                />
              </div>
            }
            <div className="selection-form-row">
              <button
                className="btn btn-default"
                onClick={() => this.props.onChange(
                  actions.addAnswer(this.getSelection().id))}
                type="button"
              >
                <i className="fa fa-plus"/>
                {tex('key_word')}
              </button>
            </div>
          </div>
        </div>
      </Popover>
    )
  }
}

SelectionForm.propTypes = {
  item: T.shape.object,
  onChange: T.func.isRequired,
  validating: T.bool.isRequired,
  _errors: T.object
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

ColorElement.propTypes = {
  index: T.number.isRequired,
  color: T.object.isRequired,
  onChange: T.func.isRequired,
  _errors: T.object
}

export class Selection extends Component {
  constructor(props) {
    super(props)
  }

  onSelect(word, cb) {
    this.word = word
    this.fnTextUpdate = cb
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
          <FormGroup
            controlId="globalScore"
            label={t('global_score')}
            warnOnly={!this.props.validating}
          >
            <input
               type="checkbox"
               onChange={e => this.props.onChange(actions.updateQuestion(e.target.checked, 'globalScore'))}
               checked={this.props.item.globalScore}
             />
          </FormGroup>
          {this.props.item.globalScore &&
            <div>
              <FormGroup
                controlId="selection-global-success-score"
                label={t('selection-global-success-score')}
                warnOnly={!this.props.validating}
              >
                <input
                   type="number"
                   onChange={e => this.props.onChange(actions.updateQuestion(e.target.value, 'globalScore.success'))}
                   value={this.props.item.globalScore.success}
                 />
              </FormGroup>
              <FormGroup
                controlId="selection-global-failure-score"
                label={t('selection-global-failure-score')}
                warnOnly={!this.props.validating}
              >
                <input
                   type="number"
                   onChange={e => this.props.onChange(actions.updateQuestion(e.target.value, 'globalScore.failure'))}
                   value={this.props.item.globalScore.failure}
                 />
              </FormGroup>
            </div>
          }
          <Radios
            groupName="mode-group"
            options={[
              {value: 'select', label: tex('visible')},
              {value: 'find', label: tex('invisible')},
              {value: 'highlight', label: tex('highlight')}
            ]}
            checkedValue={this.props.item.mode}
            inline={true}
            onChange={value => this.props.onChange(actions.updateQuestion(value, 'mode'))}
          >
          </Radios>
          {this.props.item.mode === 'highlight' &&
            <div>
              <FormGroup
                controlId="selection-default-penalty"
                label={t('global_penalty')}
                warnOnly={!this.props.validating}
              >
                <input
                   type="number"
                   onChange={e => this.props.onChange(actions.updateQuestion(e.target.value, 'penalty'))}
                   value={this.props.item.penalty}
                 />
              </FormGroup>
              <div>{tex('possible_color_choices')}</div>
              {
                this.props.item.colors.map((color, index) => {
                  return (<ColorElement key={'color'+index} index={index} color={color} onChange={this.props.onChange}/>)
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
          <ProseMirrorEditor/>
          <button
            type="button"
            className="btn btn-default"
            onClick={() => this.props.onChange(this.addSelection())}><i className="fa fa-plus"/>
            {tex('create_answer_zone')}
          </button>
          {(this.props.item._popover && this.props.item._selectionId) &&
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
