import editor from './editor'
import {SelectionPaper} from './paper.jsx'
import {SelectionPlayer} from './player.jsx'
import {SelectionFeedback} from './feedback.jsx'

function expectAnswer(item) {
    switch (item.mode) {
        case 'select':
          return item.solutions.filter(s => s.score > 0).map(s => s.id)
        case 'find':
          return item.solutions.filter(s => s.score > 0).map(s => { return {begin: s.begin, end: s.end} })
        case 'highlight':
          return item.solutions.map(solution => solution.answers.reduce((prev, current) => prev.score > current.score ? prev : current))
    }
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
