import editor from './editor'
import {SelectionPaper} from './paper.jsx'
import {SelectionPlayer} from './player.jsx'
import {SelectionFeedback} from './feedback.jsx'

function expectAnswer(/*item*/) {

}

export default {
  type: 'application/x.selection+json',
  name: 'selection',
  paper: SelectionPaper,
  player: SelectionPlayer,
  feedback: SelectionFeedback,
  editor,
  expectAnswer
}
