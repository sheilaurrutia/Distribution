import React, {Component, PropTypes as T} from 'react'
import {FormGroup} from './../../components/form/form-group.jsx'
import classes from 'classnames'
import {tex} from './../../utils/translate'
import {Textarea} from './../../components/form/textarea.jsx'
import {Radios} from './../../components/form/radios.jsx'
import {ColorPicker} from './../../components/form/color-picker.jsx'
import {actions} from './editor'
import {TooltipButton} from './../../components/form/tooltip-button.jsx'
import {utils} from './utils/utils'
import get from 'lodash/get'
import {ErrorBlock} from './../../components/form/error-block.jsx'
import {SCORE_SUM, SCORE_FIXED} from './../../quiz/enums'
import {CheckGroup} from './../../components/form/check-group.jsx'
import {BaseModal} from './../../modal/components/base.jsx'

function updateAnswer(value, parameter, selectionId, mode) {
  switch(mode) {
    case 'select': {
      return actions.findUpdateAnswer(value, selectionId, parameter)
    }
    case 'find': {
      return actions.selectUpdateAnswer(value, selectionId, parameter)
    }
    case 'highlight': {
      return actions.highlightUpdateSelection(value, selectionId, parameter)
    }
  }
}

function removeSelection(selectionId, mode) {
  switch(mode) {
    case 'select': {
      return actions.selectRemoveSelection(selectionId)
    }
    case 'find': {
      return actions.findRemoveAnswer(selectionId)
    }
    case 'highlight': {
      return actions.highlightRemoveSelection(selectionId)
    }
  }
}

function addSelection(begin, end, mode) {
  switch(mode) {
    case 'select': {
      return actions.selectAddSelection(begin, end)
    }
    case 'find': {
      return actions.findAddAnswer(begin, end)
    }
    case 'highlight': {
      return actions.highlightAddSelection(begin, end)
    }
  }
}

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
            {this.props.item.score.type === SCORE_SUM &&
              <input
                className="form-control choice-form"
                type="number"
                value={this.props.score}
                onChange={e => this.props.onChange(updateAnswer(parseInt(e.target.value), 'score', this.selectionId, this.props.item.mode))}
              />
            }
            {this.props.item.score.type === SCORE_FIXED &&
              <CheckGroup
                label={tex('correct_answer')}
                checkId={'selection-chk-' + this.selectionId}
                checked={this.props.score > 0}
                onChange={checked => this.props.onChange(updateAnswer(checked ? 1 : 0, 'score', this.selectionId, this.props.item.mode))}
              />
            }
         </div>
          <div className="col-xs-3">
            <TooltipButton
              id={`choice-${this.selectionId}-feedback-toggle`}
              className="fa fa-comments-o"
              title={tex('choice_feedback_info')}
              onClick={() => this.setState({showFeedback: !this.state.showFeedback})}
            />
          </div>
        </div>
        {this.state.showFeedback &&
          <div className="feedback-container selection-form-row">
            <Textarea
              id={`choice-${this.selectionId}-feedback`}
              title={tex('feedback')}
              onChange={text => this.props.onChange(updateAnswer(text, 'feedback', this.selectionId, this.props.item.mode))}
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
  selection: T.shape({
    id: T.string.isRequired
  }),
  solution: T.shape({
    selectionId: T.string.isRequired,
    feedback: T.string
  }),
  item: T.shape({
    mode: T.string.isRequired,
    score: T.shape({
      type: T.string.isReqired
    })
  }),
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
    return this.props.item.selections ?
      this.props.item.selections.find(selection => selection.id === this.props.item._selectionId):
      {
        id: this.props.item._selectionId
      }
  }

  getSolution() {
    return this.props.item.solutions.find(solution => solution.selectionId === this.props.item._selectionId)
  }

  closePopover() {
    this.props.onChange(actions.closePopover())
  }

  render() {
    return (
      <BaseModal
        bsClass="selection-form-content"
        id={this.props.item._selectionId}
        placement="right"
        positionLeft={this.offsetLeft}
        positionTop={this.offsetTop}
        fadeModal={this.closePopover.bind(this)}
        hideModal={this.closePopover.bind(this)}
        show={this.props.item._selectionPopover}
        title={utils.getSelectionText(this.props.item)}
      >
        <div className="panel-default">
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
            {this.props.item.mode === 'highlight' &&
              this.getSolution().answers.map((answer, key) => {
                return <HighlightAnswer key={key} answer={answer} item={this.props.item} onChange={this.props.onChange}></HighlightAnswer>
              })
            }
            {this.props.item.mode === 'highlight' &&
              <button
                className="btn btn-default"
                onClick={() => this.props.onChange(actions.highlightAddAnswer(this.props.item._selectionId))}
                type="button"
                disabled={this.getSolution().answers.length >= this.props.item.colors.length }
              >
                <i className="fa fa-plus"/>
                {tex('color')}
              </button>
            }
          </div>
          {get(this.props, '_errors.solutions') &&
            <ErrorBlock text={this.props._errors.solutions} warnOnly={!this.props.validating}/>
          }
          {this.state.showFeedback &&
            <div className="feedback-container selection-form-row">
              <Textarea
                id={`choice-${this.props.item._selectionId}-feedback`}
                title={tex('feedback')}
                onChange={text => this.props.onChange(updateAnswer('feedback', text, this.props.item._selectionId, this.props.item.mode))}
              />
            </div>
          }
        </div>
      </BaseModal>
    )
  }
}

SelectionForm.propTypes = {
  item: T.shape({
    _selectionId: T.string,
    _selectionPopover: T.bool,
    mode: T.string.isRequired,
    id: T.string.isRequired,
    solutions: T.arrayOf(T.shape({
      selectionId: T.string.isRequired
    })),
    selections: T.arrayOf(T.shape({
      id: T.string.isRequired
    })),
    colors: T.array
  }).isRequired,
  onChange: T.func.isRequired,
  validating: T.bool.isRequired,
  _errors: T.object
}

class ColorElement extends Component {
  render() {
    return (
      <div>
        <ColorPicker color={this.props.color.code}
          onPick={(e) => {this.props.onChange(actions.highlightEditColor(this.props.color.id, e.hex))}}>
        </ColorPicker>
        {'\u00a0'}
        <i onClick={() => this.props.onChange(actions.highlightRemoveColor(this.props.color.id))} className="fa fa-trash-o pointer"></i>
      </div>
    )
  }
}

ColorElement.propTypes = {
  index: T.number.isRequired,
  color: T.shape({
    code: T.string.isRequired,
    id: T.string.isRequired
  }),
  onChange: T.func.isRequired,
  _errors: T.object
}

class HighlightAnswer extends Component {
  constructor(props) {
    super(props)
    this.state = {showFeedback: false}
  }

  render() {
    const color = this.props.item.colors.find(color => color.id === this.props.answer.colorId)

    return (
      <div>
        <div className='row'>
          <div className="col-xs-4">
            <select
              style={{ backgroundColor: color.code }}
              onChange={e => this.props.onChange(actions.highlightUpdateAnswer('colorId', e.target.value, this.props.answer._answerId))}
              value={this.props.answer.colorId}
            >
            {this.props.item.colors.map((color, key) => {
              return <option
                className="color-option"
                key={key}
                value={color.id}
                style={{ backgroundColor: color.code, hover: color.code }}
              >
                {'\u00a0'}{'\u00a0'}{'\u00a0'}{'\u00a0'}{'\u00a0'}
              </option>
            })}
            </select>
          </div>
          <div className="col-xs-3">
            {this.props.item.score.type === SCORE_SUM &&
              <input
                 type="number"
                 onChange={e => this.props.onChange(actions.highlightUpdateAnswer('score', parseInt(e.target.value), this.props.answer._answerId))}
                 value={this.props.answer.score}
                 className="form-control choice-form"
              />
            }
            {this.props.item.score.type === SCORE_FIXED &&
              <CheckGroup
                label=""
                checkId={this.props.answer._answerId}
                checked={this.props.answer.score > 0}
                onChange={checked => this.props.onChange(actions.highlightUpdateAnswer('score', checked ? 1 : 0, this.props.answer._answerId))}
              />
            }
         </div>
         <div className="col-xs-2">
           <TooltipButton
             id={`choice-${this.props.answer._answerId}-feedback-toggle`}
             className="fa fa-comments-o"
             title={tex('choice_feedback_info')}
             onClick={() => this.setState({showFeedback: !this.state.showFeedback})}
           />
        </div>
        <div className="col-xs-3">
          <i onClick={() => this.props.onChange(actions.highlightRemoveAnswer(this.props.answer._answerId))} className="fa fa-trash-o pointer"></i>
        </div>
      </div>
      {this.state.showFeedback &&
        <div className="feedback-container selection-form-row">
          <Textarea
            id={`choice-${this.props.answer._answerId}-feedback`}
            title={tex('feedback')}
            onChange={text => this.props.onChange(actions.highlightUpdateAnswer('feedback', text, this.props.answer._answerId))}
            content={this.props.answer.feedback}
          />
        </div>
      }
    </div>)
  }
}

HighlightAnswer.propTypes = {
  item: T.shape({
    colors: T.arrayOf(T.shape({
      id: T.string.isRequired,
      code: T.string.isRequired
    })),
    score: T.shape({
      type: T.string.isRequired
    })
  }),
  onChange: T.func.isRequired,
  answer: T.shape({
    colorId: T.string.isRequired,
    _answerId: T.string,
    score: T.number.isRequired,
    feedback: T.string
  })
}

export class Selection extends Component {
  constructor(props) {
    super(props)
    this.onSelect = this.onSelect.bind(this)
    this.updateText = this.updateText.bind(this)
    this.addSelection = this.addSelection.bind(this)
    this.state = {begin: null, end: null}
  }

  updateText() {
    utils.makeTextHtml(this.props.item._text, this.props.item.solutions)
  }

  onSelect(selected, cb, offsets) {
    if (offsets) {
      this.setState({begin: offsets.trueStart, end: offsets.trueEnd})
    }
  }

  addSelection() {
    this.props.onChange(addSelection(this.state.begin, this.state.end, this.props.item.mode))
  }

  onSelectionClick(el) {
    if (el.classList.contains('edit-selection-btn')) {
      this.props.onChange(actions.openAnswer(el.dataset.selectionId))
    } else {
      if (el.classList.contains('delete-selection-btn')) {
        this.props.onChange(removeSelection(el.dataset.selectionId, this.props.item.mode))
      }
    }
  }

  render() {
    return(
      <div>
        <div>
          <CheckGroup
            checkId={`item-${this.props.item.id}-fixedScore`}
            checked={this.props.item.score.type === SCORE_FIXED}
            label={tex('fixed_score')}
            onChange={checked => this.props.onChange(actions.updateQuestion(checked ? SCORE_FIXED : SCORE_SUM, 'score.type', {}))}
          />
          {this.props.item.score.type === SCORE_FIXED &&
            <div>
              <FormGroup
                controlId={`item-${this.props.item.id}-fixedSuccess`}
                label={tex('fixed_score_on_success')}
                warnOnly={!this.props.validating}
              >
                <input
                  id={`item-${this.props.item.id}-fixedSuccess`}
                  type="number"
                  min="0"
                  value={this.props.item.score.success}
                  className="form-control"
                  onChange={e => this.props.onChange(
                    actions.updateQuestion(parseInt(e.target.value), 'score.success', {})
                  )}
                />
              </FormGroup>
              <FormGroup
                controlId={`item-${this.props.item.id}-fixedFailure`}
                label={tex('fixed_score_on_failure')}
                warnOnly={!this.props.validating}
              >
                <input
                  id={`item-${this.props.item.id}-fixedFailure`}
                  type="number"
                  value={this.props.item.score.failure}
                  className="form-control"
                  onChange={e => this.props.onChange(
                    actions.updateQuestion(parseInt(e.target.value), 'score.failure', {})
                  )}
                />
              </FormGroup>
            </div>
          }
          <Radios
            groupName="mode-group"
            options={[
              {value: 'select', label: tex('select')},
              {value: 'find', label: tex('find')},
              {value: 'highlight', label: tex('highlight')}
            ]}
            checkedValue={this.props.item.mode}
            inline={true}
            onChange={value => this.props.onChange(actions.updateQuestion(value, 'mode', {}))}
          >
          </Radios>
          {this.props.item.mode === 'find' &&
            <FormGroup
              controlId={`item-${this.props.item.id}-tries`}
              label={tex('tries_number')}
              warnOnly={!this.props.validating}
            >
              <input
                id={`item-${this.props.item.id}-tries`}
                type="number"
                min={this.props.item.solutions ? this.props.item.solutions.filter(solution => solution.score > 0).length: 1}
                value={this.props.item.tries}
                className="form-control"
                onChange={e => this.props.onChange(actions.updateQuestion(parseInt(e.target.value), 'tries', {}))}
              />
            </FormGroup>
          }
          {this.props.item.score.type === SCORE_SUM && (this.props.item.mode === 'highlight' || this.props.item.mode === 'find') &&
            <FormGroup
              controlId="selection-default-penalty"
              label={tex('global_penalty')}
              warnOnly={!this.props.validating}
            >
              <input
                 className="form-control"
                 type="number"
                 min="0"
                 onChange={e => this.props.onChange(actions.updateQuestion(parseInt(e.target.value), 'penalty', {}))}
                 value={this.props.item.penalty}
               />
            </FormGroup>
          }
          {this.props.item.mode === 'highlight' &&
            <div className="panel-body">
              <div>{tex('possible_color_choices')}</div>
              {
                this.props.item.colors.map((color, index) => {
                  return (<ColorElement key={'color' + index} index={index} color={color} onChange={this.props.onChange}/>)
                })
              }
                {get(this.props.item, '_errors.colors') &&
                  <ErrorBlock text={get(this.props.item, '_errors.colors')} warnOnly={!this.props.validating}/>
                }
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={() => this.props.onChange(actions.highlightAddColor())}
                >
                  <i className="fa fa-plus"/>{'\u00a0'}{tex('add_color')}
                </button>
            </div>
          }
          <FormGroup
            error={get(this.props.item, '_errors.text')}
            warnOnly={!this.props.validating}
            controlId="selection-text-box"
            label=""
          >
          <Textarea
            id={this.props.item.id}
            onSelect={this.onSelect}
            onChange={(text, offsets) => this.props.onChange(actions.updateQuestion(text, 'text', offsets))}
            onClick={this.onSelectionClick.bind(this)}
            content={this.props.item._text}
            updateText={this.updateText}
          />
        </FormGroup>
          <button
            type="button"
            className="btn btn-default"
            disabled={this.state.begin === this.state.end}
            onClick={() => this.props.onChange(this.addSelection())}><i className="fa fa-plus"/>
            {'\u00a0'}{tex('create_selection_zone')}
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
