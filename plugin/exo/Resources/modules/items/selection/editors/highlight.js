import {ITEM_CREATE} from '../../../quiz/editor/actions'
import {makeActionCreator, makeId} from '../../../utils/utils'
import set from 'lodash/set'
import cloneDeep from 'lodash/cloneDeep'
import {utils} from '../utils/utils'

const UPDATE_QUESTION = 'UPDATE_QUESTION'
const ADD_SELECTION = 'ADD_SELECTION'
const UPDATE_SELECTION = 'UPDATE_SELECTION'
const OPEN_SELECTION = 'OPEN_SELECTION'
const REMOVE_SELECTION = 'REMOVESELECTION'

/*
const ADD_ANSWER = 'ADD_ANSWER'
const UPDATE_ANSWER = 'UPDATE_ANSWER'
const SAVE_SELECTION = 'SAVE_SELECTION'

const REMOVE_ANSWER = 'REMOVE_ANSWER'
*/
const CLOSE_POPOVER = 'CLOSE_POPOVER'
const ADD_COLOR = 'ADD_COLOR'
const EDIT_COLOR = 'EDIT_COLOR'
//const ADD_ANSWER = 'ADD_ANSWER'

export const actions = {
  addColor: makeActionCreator(ADD_COLOR),
  updateSelection: makeActionCreator(UPDATE_SELECTION, 'value', 'selectionId', 'parameter'),
  editColor: makeActionCreator(EDIT_COLOR, 'colorId', 'colorCode'),
  addSelection: makeActionCreator(ADD_SELECTION, 'begin', 'end'),
  removeSelection: makeActionCreator(REMOVE_SELECTION, 'selectionId')
}

export function reduce(item = {}, action) {
  switch (action.type) {
    case ADD_COLOR: {

    }
    case EDIT_COLOR: {

    }
    case ADD_SELECTION: {

    }
    case REMOVE_SELECTION: {

    }
    case UPDATE_SELECTION: {
    }
  }
  return item
}

function validate(/*item*/) {
  return []
}
