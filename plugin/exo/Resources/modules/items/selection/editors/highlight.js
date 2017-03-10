import {ITEM_CREATE} from '../../../quiz/editor/actions'
import {makeActionCreator, makeId} from '../../../utils/utils'
import set from 'lodash/set'
import cloneDeep from 'lodash/cloneDeep'
import {utils} from '../utils/utils'

const HIGHLIGHT_ADD_SELECTION = 'HIGHLIGHT_ADD_SELECTION'
const HIGHLIGHT_UPDATE_SELECTION = 'HIGHLIGHT_UPDATE_SELECTION'
const HIGHLIGHT_REMOVE_SELECTION = 'HIGHLIGHT_REMOVE_SELECTION'
const HIGHLIGHT_ADD_COLOR = 'HIGHLIGHT_ADD_COLOR'
const HIGHLIGHT_EDIT_COLOR = 'HIGHLIGHT_EDIT_COLOR'

export const actions = {
  highlightAddColor: makeActionCreator(HIGHLIGHT_ADD_COLOR),
  highlightEditColor: makeActionCreator(HIGHLIGHT_EDIT_COLOR, 'colorId', 'colorCode'),
  highlightUpdateSelection: makeActionCreator(HIGHLIGHT_UPDATE_SELECTION, 'value', 'selectionId', 'parameter'),
  highlightAddSelection: makeActionCreator(HIGHLIGHT_ADD_SELECTION, 'begin', 'end'),
  highlightRemoveSelection: makeActionCreator(HIGHLIGHT_REMOVE_SELECTION, 'selectionId')
}

export function reduce(item = {}, action) {
  switch (action.type) {
    case HIGHLIGHT_ADD_COLOR: {
      const colors = cloneDeep(item.colors)

      colors.push({
        id: makeId(),
        code: '#FFFFFF'
      })

      return Object.assign({}, item, {colors})
    }
    case HIGHLIGHT_EDIT_COLOR: {
      const colors = cloneDeep(item.colors)
      const color = colors.find(color => color.id === action.colorId)
      color.code = action.colorCode

      return Object.assign({}, item, {colors})
    }
    case HIGHLIGHT_ADD_SELECTION: {
      const selections = item.selections ? cloneDeep(item.selections): []
      const solutions = item.solutions ? cloneDeep(item.solutions): []
      const sum = utils.getRealOffsetFromBegin(selections, action.begin, 'editor')
      const id = makeId()

      selections.push({
        id,
        begin: action.begin - sum,
        end: action.end - sum
      })

      solutions.push({
        selectionId: id,
        answers: [{
          score: 0,
          colorId: item.colors[0].id
        }]
      })

      const text = utils.getTextFromDecorated(item._text)

      let newItem = Object.assign({}, item, {
        selections,
        _selectionPopover: true,
        _selectionId: id,
        solutions,
        text,
        _text: utils.makeTextHtml(text, selections, 'editor')
      })

      return cleanItem(newItem)
    }
    case HIGHLIGHT_REMOVE_SELECTION: {
      //this is only valid for the default 'visible' one
      const selections = cloneDeep(item.selections)
      const solutions = cloneDeep(item.solutions)
      selections.splice(selections.findIndex(selection => selection.id === action.selectionId), 1)
      solutions.splice(solutions.findIndex(solution => solution.selectionId === action.selectionId), 1)
      item = Object.assign(
        {},
        item,
        {
          selections,
          solutions,
          _text: utils.makeTextHtml(item.text, selections, 'editor')
        }
      )

      return utils.cleanItem(item)
    }

    case HIGHLIGHT_UPDATE_SELECTION: {
    }
    
  }
  return item
}

function validate(/*item*/) {
  return []
}
