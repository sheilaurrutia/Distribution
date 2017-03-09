import {ITEM_CREATE} from '../../../quiz/editor/actions'
import {makeActionCreator, makeId} from '../../../utils/utils'
import set from 'lodash/set'
import cloneDeep from 'lodash/cloneDeep'
import {utils} from '../utils/utils'

const FIND_ADD_ANSWER = 'FIND_ADD_ANSWER'
const FIND_UPDATE_ANSWER = 'FIND_UPDATE_ANSWER'
const FIND_REMOVE_ANSWER = 'FIND_REMOVE_ANSWER'

export const actions = {
  findUpdateAnswer: makeActionCreator(FIND_UPDATE_ANSWER, 'value', 'selectionId', 'parameter'),
  findAddAnswer: makeActionCreator(FIND_ADD_ANSWER, 'begin', 'end'),
  findRemoveAnswer: makeActionCreator(FIND_REMOVE_ANSWER, 'selectionId')
}

export function reduce(item = {}, action) {
  switch (action.type) {
    case FIND_ADD_ANSWER: {
      const solutions = item.solutions ? cloneDeep(item.solutions): []
      const sum = utils.getRealOffsetFromBegin(solutions, action.begin, 'editor')
      const id = makeId()

      solutions.push({
          selectionId: id,
          score: 0,
          begin: action.begin - sum,
          end: action.end - sum
        })

      const text = utils.getTextFromDecorated(item._text)

      let newItem = Object.assign({}, item, {
        selections,
        _selectionPopover: true,
        _selectionId: id,
        solutions,
        text,
        _text: utils.makeTextHtml(text, solutions, 'editor')
      })

      return utils.cleanItem(newItem)
    }
    case FIND_REMOVE_ANSWER: {
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
          _text: utils.makeTextHtml(item.text, solutions, 'editor')
        }
      )

      return utils.cleanItem(item)
    }
    case FIND_UPDATE_ANSWER: {
      const solutions = cloneDeep(item.solutions)
      const solution = solutions.find(solution => solution.selectionId === action.selectionId)
      solution[action.parameter] = action.value

      return Object.assign({}, item, {solutions})
    }
  }
  return item
}

function validate(/*item*/) {
  return []
}
