import {Selection as component} from './editor.jsx'
import {ITEM_CREATE} from './../../quiz/editor/actions'
import {makeActionCreator, makeId} from './../../utils/utils'
import set from 'lodash/set'
import cloneDeep from 'lodash/cloneDeep'

const UPDATE_QUESTION = 'UPDATE_QUESTION'
/*const ADD_SELECTION = 'ADD_SELECTION'
const OPEN_SELECTION = 'OPEN_SELECTION'
const UPDATE_SELECTION = 'UPDATE_SELECTION'
const ADD_ANSWER = 'ADD_ANSWER'
const UPDATE_ANSWER = 'UPDATE_ANSWER'
const SAVE_SELECTION = 'SAVE_SELECTION'
const REMOVE_SELECTION = 'REMOVESELECTION'
const REMOVE_ANSWER = 'REMOVE_ANSWER'
const CLOSE_POPOVER = 'CLOSE_POPOVER'*/
const ADD_COLOR = 'ADD_COLOR'
const EDIT_COLOR = 'EDIT_COLOR'

export const actions = {
  updateQuestion: makeActionCreator(UPDATE_QUESTION, 'value', 'parameter'),
  addColor: makeActionCreator(ADD_COLOR),
  editColor: makeActionCreator(EDIT_COLOR, 'colorId', 'colorCode')
}

export default {
  component,
  reduce,
  validate,
  decorate
}

function decorate(item) {
  return item
}

function reduce(item = {}, action) {
  switch (action.type) {
    case ITEM_CREATE: {
      return Object.assign({}, item, {
        text: '',
        mode: 'select',
        globalScore: false,
        solutions: [],
        _text: ''
      })
    }
    case UPDATE_QUESTION: {
      const obj = {}
      set(obj, action.parameter, action.value)
      item = Object.assign({}, item, obj)
      //set the dislayed text here
      if (action.parameter === 'text') {
        item = Object.assign({}, item, {text: action.value  })
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
  }
}

function validate(/*item*/) {
  return []
}

//depending on the values of some properties, some others must be unset
function cleanItem(item)
{
  return item
}
