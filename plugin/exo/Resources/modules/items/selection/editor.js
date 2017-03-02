import {Selection as component} from './editor.jsx'
import {ITEM_CREATE} from './../../quiz/editor/actions'
import {makeActionCreator, makeId} from './../../utils/utils'
import set from 'lodash/set'
import cloneDeep from 'lodash/cloneDeep'
import {utils} from './utils/utils'
import $ from 'jquery'
import {getOffsets} from '../../components/form/selection/selection'

const UPDATE_QUESTION = 'UPDATE_QUESTION'
const ADD_SELECTION = 'ADD_SELECTION'
const UPDATE_SELECTION = 'UPDATE_SELECTION'
/*
const OPEN_SELECTION = 'OPEN_SELECTION'

const ADD_ANSWER = 'ADD_ANSWER'
const UPDATE_ANSWER = 'UPDATE_ANSWER'
const SAVE_SELECTION = 'SAVE_SELECTION'
const REMOVE_SELECTION = 'REMOVESELECTION'
const REMOVE_ANSWER = 'REMOVE_ANSWER'
*/
const CLOSE_POPOVER = 'CLOSE_POPOVER'
const ADD_COLOR = 'ADD_COLOR'
const EDIT_COLOR = 'EDIT_COLOR'
//const ADD_ANSWER = 'ADD_ANSWER'

export const actions = {
  updateQuestion: makeActionCreator(UPDATE_QUESTION, 'value', 'parameter', 'offsets'),
  addColor: makeActionCreator(ADD_COLOR),
  updateSelection: makeActionCreator(UPDATE_SELECTION, 'score', 'selectionId'),
  editColor: makeActionCreator(EDIT_COLOR, 'colorId', 'colorCode'),
  addSelection: makeActionCreator(ADD_SELECTION, 'begin', 'end'),
  closePopover: makeActionCreator(CLOSE_POPOVER)
}

export default {
  component,
  reduce,
  validate,
  decorate
}

function decorate(item) {
  return Object.assign({}, item, {
    _text: utils.makeTextHtml(item.text, item.mode === 'find' ? item.solutions : item.selections)
  })
}

function reduce(item = {}, action) {
  switch (action.type) {
    case ITEM_CREATE: {
      return Object.assign({}, item, {
        text: '',
        mode: 'select',
        globalScore: false,
        solutions: [],
        _selectionPopover: false,
        _text: ''
      })
    }
    case UPDATE_QUESTION: {
      const obj = {}
      set(obj, action.parameter, action.value)
      item = Object.assign({}, item, obj)
      //set the dislayed text here
      if (action.parameter === 'text') {
        //then we need to update the positions here because if we add text BEFORE our marks, then everything is screwed up
        item = recomputePositions(item, action.offsets)
        item = Object.assign({}, item, {text: action.value, _text: action.value})
      }
      //if we set the mode to highlight, we also initialize the colors
      if (action.parameter === 'mode' && action.value === 'highlight') {
        item = Object.assign({}, item, {colors: []})
      }

      return cleanItem(item)
    }
    case ADD_COLOR: {
      const colors = cloneDeep(item.colors)

      colors.push({
        id: makeId(),
        code: '#FFFFFF'
      })

      return Object.assign({}, item, {colors})
    }
    case EDIT_COLOR: {
      const colors = cloneDeep(item.colors)
      const color = colors.find(color => color.id === action.colorId)
      color.code = action.colorCode

      return Object.assign({}, item, {colors})
    }
    case ADD_SELECTION: {
      const selections = item.selections ? cloneDeep(item.selections): []
      const solutions = item.solutions ? cloneDeep(item.solutions): []
      let solution = null
      const selection = {
        id: makeId()
      }

      switch (item.mode) {
        case 'highlight':
          solution = {
            selectionId: selection.id,
            answers: [{
              score: 0,
              colorId: item.colors[0].id
            }]
          }
          break
        case 'select':
          solution = {
            selectionId: selection.id,
            score: 0
          }
          break
        case 'find':
          solution = {
            selectionId: selection.id,
            score: 0,
            begin: action.begin,
            end: action.end
          }
          break
      }

      let toSort = item.mode === 'find' ? solutions : selections
      toSort = toSort.filter(sort => { return sort.begin < action.begin})

      toSort = toSort.sort((a, b) => {a.begin - b.begin})
      const sum = toSort.reduce((acc, val) => { return acc + utils.getHtmlLength(val)}, 0)

      selection.begin = action.begin - sum
      selection.end = action.end - sum

      if (item.mode !== 'find') {
        selections.push(selection)
      }

      solutions.push(solution)

      const text = utils.getTextFromDecorated(item._text)

      let newItem = Object.assign({}, item, {
        selections,
        _selectionPopover: true,
        _selectionId: selection.id,
        solutions,
        text,
        _text: utils.makeTextHtml(text, item.mode === 'find' ? solutions : selections)
      })

      return cleanItem(newItem)

    }
    case CLOSE_POPOVER: {
      return Object.assign({}, item, {_selectionPopover: false})
    }
    case UPDATE_SELECTION: {
      const solutions = cloneDeep(item.solutions)
      const selection = item.selections.find(selection => selection.id === action.selectionId)
      const solution = solutions.find(solution => solution.selectionId === selection.id)
      solution.score = action.score

      return Object.assign({}, item, {solutions})
    }
  }
}

function validate(/*item*/) {
  return []
}

//this is not working as intended actually
function recomputePositions(item, offsets) {
  return item
  let toSort = item.mode === 'find' ? item.solutions : item.selections
  toSort = cloneDeep(toSort)
  toSort.sort((a, b) => a.begin - b.begin)
  let idx = 0

  //please filter now
  toSort.forEach(element => {
    element._trueBegin = utils.getHtmlLength(element) * idx + element.begin
    idx++

    console.log('truestart', offsets)

    if (offsets.trueStart < element._trueBegin) {
      element._trueBegin ++
      element.begin ++
      element.end ++
    }
  })

  const newData = item.mode === 'find' ? {solutions: toSort} : {selections: toSort}

  item = Object.assign({}, item, newData)

  return item
}

//depending on the values of some properties, some others must be unset
function cleanItem(item)
{
  //here we remove the unused selections
  const _text = item._text

  const tmp = document.createElement('div')
  const ids = []
  let toRemove = []
  tmp.innerHTML = _text

  //what are the selection in the text ?
  $(tmp).find('.selection-button').each(function () {
    ids.push($(this).attr('data-selection-id'))
  })

  //if we're missing selections in the items, then we'll have to remove them
  if (item.mode !== 'find' && item.selections) {
    item.selections.forEach(selection => {
      let idx = ids.findIndex(id => id === selection.id)
      if (idx < 0) toRemove.push(selection.id)
    })
  }

  //= php array_unique
  toRemove = toRemove.filter((item, pos) => toRemove.indexOf(item) == pos)

  const solutions = cloneDeep(item.solutions)
  const selections = cloneDeep(item.selections)

  //and now we finally remove them !!!
  toRemove.forEach(selectionId => {
    const selIdx = selections.findIndex(selection => selection.id === selectionId)
    const solIdx = solutions.findIndex(solution => solution.selectionId === selectionId)

    selections.splice(selIdx, 1)
    solutions.splice(solIdx, 1)
  })

  //also we just check the text is correct
  let text = utils.getTextFromDecorated(item._text)

  //that'all for now folks !
  return Object.assign({}, item, {selections, solutions, text})
}
